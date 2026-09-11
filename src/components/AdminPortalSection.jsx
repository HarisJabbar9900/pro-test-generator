import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Upload, 
  CheckCircle2, Cloud, Layers, 
  Check, Database, CheckSquare, Bot, Sliders
} from 'lucide-react';
import { 
  addClassToBank, 
  deleteClassFromBank, 
  addSubjectToClass, 
  deleteSubjectFromClass,
  addChapterToSubject,
  deleteChapterFromSubject,
  addTopicToChapter,
  deleteTopicFromChapter,
  addQuestionToTopic,
  deleteQuestionFromTopic,
  importParsedQuestionsToTopic
} from '../utils/questionBankService';
import { syncBankToFirebase, fetchBankFromFirebase } from '../utils/firebaseBankService';
import { parseDocumentIntoQuestions } from '../utils/docParser';
import AdminDatabaseCatalogView from './AdminDatabaseCatalogView';
import AdminQuestionBankManagerView from './AdminQuestionBankManagerView';
import AdminBotRulesModal from './AdminBotRulesModal';
import { fetchBotConfig } from '../utils/aiBotService';
import { notify } from '../utils/notify';
import { confirmAction } from '../utils/confirmDialog';

export default function AdminPortalSection({
  bank,
  onBankUpdated,
  currentUser,
  onExit
}) {
  // Navigation & Selection States
  const classKeys = Object.keys(bank || {});
  const [selectedClass, setSelectedClass] = useState(() => classKeys[0] || '9th');

  const currentClassData = bank[selectedClass] || { subjects: [] };
  const subjects = currentClassData.subjects || [];

  const [selectedSubjectId, setSelectedSubjectId] = useState(() => subjects[0]?.id || '');
  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const chapters = currentSubject?.chapters || [];

  const [selectedChapterId, setSelectedChapterId] = useState(() => chapters[0]?.id || '');
  const currentChapter = chapters.find(c => c.id === selectedChapterId) || chapters[0];
  const topics = currentChapter?.topics || [];

  const [selectedTopicId, setSelectedTopicId] = useState(() => topics[0]?.id || '');
  const currentTopic = topics.find(t => t.id === selectedTopicId) || topics[0];

  // Active Management Tab: 'catalog' | 'upload' | 'single' | 'manage' | 'bot_rules'
  const [activeTab, setActiveTab] = useState('catalog');
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);
  const [showBotRulesModal, setShowBotRulesModal] = useState(false);
  const [botConfig, setBotConfig] = useState(null);

  const handleRefreshDatabase = async () => {
    setIsRefreshingDb(true);
    try {
      const res = await fetchBankFromFirebase();
      if (res && res.success && res.bank) {
        onBankUpdated(res.bank);
        setStatusNotice({ type: 'success', message: 'Database refreshed from live Firebase Cloud!' });
        setTimeout(() => setStatusNotice(null), 3500);
      }
    } catch (err) {
      console.warn("Refresh error:", err);
    } finally {
      setIsRefreshingDb(false);
    }
  };

  const handleSelectTopicFromCatalog = (clsKey, subId, chId, topId) => {
    setSelectedClass(clsKey);
    setSelectedSubjectId(subId);
    setSelectedChapterId(chId);
    setSelectedTopicId(topId);
    setActiveTab('manage');
  };

  // Modal / Form States: Add Class, Add Subject, Add Chapter, Add Topic
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClassKey, setNewClassKey] = useState('');

  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [newChapterName, setNewChapterName] = useState('');

  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTopicNumber, setNewTopicNumber] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [topicError, setTopicError] = useState('');

  // Tab 1: Upload / Paste State
  const [pasteText, setPasteText] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);
  const [statusNotice, setStatusNotice] = useState(null);

  // Tab 2: Single Question Form State
  const [singleType, setSingleType] = useState('mcq');
  const [singleQuestion, setSingleQuestion] = useState('');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');
  const [optAnswer, setOptAnswer] = useState('A');
  const [marks, setMarks] = useState(1);

  // Auto-sync wrapper
  const notifyAndSync = (updatedBank, successMsg) => {
    onBankUpdated(updatedBank);
    syncBankToFirebase(updatedBank).then(() => {
      setStatusNotice({ type: 'success', message: `${successMsg} & Synced with Firebase!` });
      setTimeout(() => setStatusNotice(null), 4000);
    }).catch(() => {
      setStatusNotice({ type: 'warning', message: `${successMsg} (Local saved, Firebase sync pending)` });
      setTimeout(() => setStatusNotice(null), 4000);
    });
  };

  // 1. ADD CLASS
  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassKey.trim()) return;
    const res = addClassToBank(newClassKey.trim(), `${newClassKey.trim()} Class`);
    if (res.success) {
      notifyAndSync(res.bank, `Class "${newClassKey}" added`);
      setSelectedClass(newClassKey.trim());
      setNewClassKey('');
      setShowAddClassModal(false);
      notify.success(`Class "${newClassKey}" added successfully!`);
    } else {
      notify.error(res.message || "Failed to add class.");
    }
  };

  // DELETE CLASS
  const handleDeleteClass = () => {
    if (classKeys.length <= 1) {
      notify.warning("At least one class must remain.");
      return;
    }
    confirmAction({
      title: "Delete Class",
      message: `Are you sure you want to delete "${selectedClass}" class and all its subjects?`,
      confirmText: "Delete Class",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const updated = deleteClassFromBank(selectedClass);
        const remainingKeys = Object.keys(updated);
        setSelectedClass(remainingKeys[0] || '9th');
        notifyAndSync(updated, `Class "${selectedClass}" deleted`);
      }
    });
  };

  // 2. ADD SUBJECT
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const updated = addSubjectToClass(selectedClass, newSubjectName.trim());
    if (updated) {
      notifyAndSync(updated, `Subject "${newSubjectName}" added`);
      setNewSubjectName('');
      setShowAddSubjectModal(false);
      const newSub = updated[selectedClass]?.subjects?.slice(-1)[0];
      if (newSub) setSelectedSubjectId(newSub.id);
    }
  };

  // DELETE SUBJECT
  const handleDeleteSubject = () => {
    if (!currentSubject) return;
    confirmAction({
      title: "Delete Subject",
      message: `Are you sure you want to delete subject "${currentSubject.name}" and all its chapters?`,
      confirmText: "Delete Subject",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const updated = deleteSubjectFromClass(selectedClass, currentSubject.id);
        notifyAndSync(updated, `Subject "${currentSubject.name}" deleted`);
        const remaining = updated[selectedClass]?.subjects || [];
        setSelectedSubjectId(remaining[0]?.id || '');
      }
    });
  };

  // 3. ADD CHAPTER
  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!newChapterName.trim()) return;
    const num = Number(newChapterNumber) || (chapters.length + 1);
    const updated = addChapterToSubject(selectedClass, currentSubject.id, num, newChapterName.trim());
    if (updated) {
      notifyAndSync(updated, `Chapter ${num}: "${newChapterName}" added`);
      setNewChapterNumber('');
      setNewChapterName('');
      setShowAddChapterModal(false);
      const sub = updated[selectedClass]?.subjects.find(s => s.id === currentSubject.id);
      const newCh = sub?.chapters?.slice(-1)[0];
      if (newCh) setSelectedChapterId(newCh.id);
    }
  };

  // DELETE CHAPTER
  const handleDeleteChapter = () => {
    if (!currentChapter) return;
    confirmAction({
      title: "Delete Chapter",
      message: `Delete Chapter ${currentChapter.chapterNumber}: "${currentChapter.name}" and all its topics?`,
      confirmText: "Delete Chapter",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const updated = deleteChapterFromSubject(selectedClass, currentSubject.id, currentChapter.id);
        notifyAndSync(updated, `Chapter deleted`);
        const sub = updated[selectedClass]?.subjects.find(s => s.id === currentSubject.id);
        setSelectedChapterId(sub?.chapters[0]?.id || '');
      }
    });
  };

  // 4. ADD TOPIC (WITH DUPLICATE VALIDATION)
  const handleAddTopic = (e) => {
    e.preventDefault();
    setTopicError('');

    const tNum = newTopicNumber.trim();
    const tName = newTopicName.trim();

    if (!tName) {
      setTopicError("Topic name is required.");
      return;
    }

    // Check duplicate topic number or name
    const existingNum = topics.some(t => t.topicNumber.toLowerCase() === tNum.toLowerCase());
    const existingName = topics.some(t => t.name.toLowerCase() === tName.toLowerCase());

    if (existingNum && tNum) {
      setTopicError(`Topic Number "${tNum}" already exists in this chapter!`);
      return;
    }
    if (existingName) {
      setTopicError(`A topic named "${tName}" already exists in this chapter!`);
      return;
    }

    const { bank: updated, topicId } = addTopicToChapter(
      selectedClass, 
      currentSubject.id, 
      currentChapter.id, 
      tNum || `${currentChapter.chapterNumber}.${topics.length + 1}`, 
      tName
    );

    if (updated) {
      notifyAndSync(updated, `Topic "${tNum} ${tName}" added`);
      setNewTopicNumber('');
      setNewTopicName('');
      setShowAddTopicModal(false);
      setSelectedTopicId(topicId);
    }
  };

  // DELETE TOPIC
  const handleDeleteTopic = (topicId) => {
    confirmAction({
      title: "Delete Topic",
      message: "Are you sure you want to delete this topic and all its questions?",
      confirmText: "Delete Topic",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const updated = deleteTopicFromChapter(selectedClass, currentSubject.id, currentChapter.id, topicId);
        notifyAndSync(updated, "Topic deleted");
        const sub = updated[selectedClass]?.subjects.find(s => s.id === currentSubject.id);
        const ch = sub?.chapters.find(c => c.id === currentChapter.id);
        setSelectedTopicId(ch?.topics[0]?.id || '');
      }
    });
  };

  // PARSE MATERIAL TEXT
  const handleParseText = () => {
    if (!pasteText.trim()) return;
    const parsed = parseDocumentIntoQuestions(pasteText);
    setParsedPreview(parsed);
  };

  // SAVE PARSED MATERIAL TO CURRENT TOPIC
  const handleSaveParsedToTopic = () => {
    if (!currentTopic || !parsedPreview) return;

    const res = importParsedQuestionsToTopic(
      selectedClass,
      currentSubject.id,
      currentChapter.id,
      currentTopic.id,
      {
        mcqs: parsedPreview.mcqs || [],
        shortQuestions: parsedPreview.shortQuestions || [],
        longQuestions: parsedPreview.longQuestions || []
      }
    );

    if (res.success) {
      notifyAndSync(res.bank, `Added ${res.counts.total} questions to "${currentTopic.name}"`);
      setPasteText('');
      setParsedPreview(null);
      setActiveTab('manage');
    }
  };

  // ADD SINGLE QUESTION SUBMIT
  const handleAddSingleQuestion = (e) => {
    e.preventDefault();
    if (!singleQuestion.trim() || !currentTopic) return;

    let qData = { question: singleQuestion.trim(), marks: Number(marks) || 1 };
    let qType = 'mcqs';

    if (singleType === 'mcq') {
      qType = 'mcqs';
      qData.options = [optA.trim(), optB.trim(), optC.trim(), optD.trim()];
      qData.answer = optAnswer;
    } else if (singleType === 'short') {
      qType = 'shortQuestions';
      qData.marks = Number(marks) || 2;
    } else {
      qType = 'longQuestions';
      qData.marks = Number(marks) || 5;
    }

    const updated = addQuestionToTopic(selectedClass, currentSubject.id, currentChapter.id, currentTopic.id, qType, qData);
    if (updated) {
      notifyAndSync(updated, "Question added");
      setSingleQuestion('');
      setOptA('');
      setOptB('');
      setOptC('');
      setOptD('');
      setActiveTab('manage');
    }
  };

  // DELETE QUESTION FROM TOPIC
  const handleDeleteQuestion = (type, qId) => {
    const updated = deleteQuestionFromTopic(selectedClass, currentSubject.id, currentChapter.id, currentTopic.id, type, qId);
    notifyAndSync(updated, "Question deleted");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans pb-16">
      
      {/* TOP ADMIN HEADER BAR */}
      <div className="bg-slate-900 text-white px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Admin</span>
          </button>
          <div className="h-5 w-[1px] bg-slate-700"></div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-2">
              <span>PRO TEST MAKER Admin Portal</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                PIN Verified
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => syncBankToFirebase(bank).then(() => notify.success("All questions are in sync with Firebase!"))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Firebase Cloud Synced</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATION BANNER */}
      {statusNotice && (
        <div className={`p-3 text-xs font-bold text-center flex items-center justify-center gap-2 ${
          statusNotice.type === 'success' ? 'bg-emerald-100 text-emerald-800 border-b border-emerald-200' : 'bg-amber-100 text-amber-800 border-b border-amber-200'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusNotice.message}</span>
        </div>
      )}

      {/* MAIN ADMIN WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* 4-LEVEL HIERARCHY SELECTOR ROW */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Question Bank Hierarchy (Class &gt; Subject &gt; Chapter &gt; Topic)</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">Select level to add or edit data</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            
            {/* 1. CLASS SELECTOR */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">1. Class</span>
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(true)}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  + Add Class
                </button>
              </div>
              <div className="flex gap-1.5">
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {classKeys.map(k => (
                    <option key={k} value={k}>{k} Class</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleDeleteClass}
                  title="Delete Class"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 2. SUBJECT SELECTOR */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">2. Subject</span>
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(true)}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  + Add Subject
                </button>
              </div>
              <div className="flex gap-1.5">
                <select
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    const sub = subjects.find(s => s.id === e.target.value);
                    if (sub && sub.chapters[0]) {
                      setSelectedChapterId(sub.chapters[0].id);
                      if (sub.chapters[0].topics[0]) {
                        setSelectedTopicId(sub.chapters[0].topics[0].id);
                      }
                    }
                  }}
                  className="w-full bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleDeleteSubject}
                  title="Delete Subject"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. CHAPTER SELECTOR */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">3. Chapter</span>
                <button
                  type="button"
                  onClick={() => setShowAddChapterModal(true)}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  + Add Chapter
                </button>
              </div>
              <div className="flex gap-1.5">
                <select
                  value={selectedChapterId}
                  onChange={(e) => {
                    setSelectedChapterId(e.target.value);
                    const ch = chapters.find(c => c.id === e.target.value);
                    if (ch && ch.topics[0]) setSelectedTopicId(ch.topics[0].id);
                  }}
                  className="w-full bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
                >
                  {chapters.map(c => (
                    <option key={c.id} value={c.id}>Chap#{c.chapterNumber}: {c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleDeleteChapter}
                  title="Delete Chapter"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 4. TOPIC SELECTOR */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">4. Topic Number & Name</span>
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(true)}
                  className="text-[10px] font-black text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  + Add Topic
                </button>
              </div>
              <div className="flex gap-1.5">
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer truncate"
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.topicNumber} {t.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => currentTopic && handleDeleteTopic(currentTopic.id)}
                  title="Delete Topic"
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* ACTIVE TOPIC SUMMARY BADGE */}
          {currentTopic && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-900">Current Target Topic:</span>
                <span className="px-2 py-0.5 bg-blue-600 text-white font-black rounded text-[11px]">
                  {currentTopic.topicNumber}
                </span>
                <span className="font-bold text-slate-800">{currentTopic.name}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span>MCQs: <b className="text-blue-600">{currentTopic.mcqs?.length || 0}</b></span>
                <span>Short: <b className="text-blue-600">{currentTopic.shortQuestions?.length || 0}</b></span>
                <span>Long: <b className="text-blue-600">{currentTopic.longQuestions?.length || 0}</b></span>
              </div>
            </div>
          )}
        </div>

        {/* WORKSPACE TABS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Tab navigation */}
          <div className="flex flex-wrap items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>1. Database Overview & Catalog (Live)</span>
            </button>

            <button
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'editor'
                  ? 'border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>Questions & Answer Key Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>2. Batch Paste / Upload Material</span>
            </button>

            <button
              onClick={() => setActiveTab('single')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'single'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>3. Add Single Question</span>
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'manage'
                  ? 'border-blue-600 text-blue-700 bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>4. Manage Questions ({ (currentTopic?.mcqs?.length || 0) + (currentTopic?.shortQuestions?.length || 0) + (currentTopic?.longQuestions?.length || 0) })</span>
            </button>

            <button
              onClick={() => {
                fetchBotConfig().then(cfg => setBotConfig(cfg));
                setShowBotRulesModal(true);
              }}
              className="px-4 py-2.5 text-xs font-bold border-b-2 border-transparent text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
            >
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              <span>AI Assistant Rules & Guardrails</span>
            </button>
          </div>

          {/* TAB: QUESTION BANK & LIVE ANSWER KEY EDITOR */}
          {activeTab === 'editor' && (
            <AdminQuestionBankManagerView
              bank={bank}
              onBankUpdated={onBankUpdated}
            />
          )}

          {/* TAB 0: DATABASE CATALOG & OVERVIEW */}
          {activeTab === 'catalog' && (
            <AdminDatabaseCatalogView
              bank={bank}
              onSelectTopic={handleSelectTopicFromCatalog}
              onRefreshDatabase={handleRefreshDatabase}
              isRefreshing={isRefreshingDb}
            />
          )}

          {/* TAB 1: BATCH UPLOAD / PASTE */}
          {activeTab === 'upload' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Paste or Upload Raw Material for this Topic</h3>
                  <p className="text-xs text-slate-500">Paste your questions text with options and answers. Parser will automatically separate MCQs, Shorts and Long questions.</p>
                </div>

                {/* Text file upload button */}
                <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold border border-slate-300 transition-all cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Choose .txt File</span>
                  <input
                    type="file"
                    accept=".txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setPasteText(event.target.result);
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>

              <textarea
                rows="10"
                value={pasteText}
                onChange={(e) => {
                  setPasteText(e.target.value);
                  setParsedPreview(null);
                }}
                placeholder="Paste questions here... Example:&#10;1. What is a computer network?&#10;A) Group of computers  B) Single CPU  C) Monitor  D) Mouse&#10;Answer: A&#10;&#10;Short Questions:&#10;1. Define topology.&#10;2. Differentiate LAN and WAN."
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleParseText}
                  disabled={!pasteText.trim()}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  Analyze & Parse Questions
                </button>

                {parsedPreview && (
                  <button
                    type="button"
                    onClick={handleSaveParsedToTopic}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save into Topic &amp; Cloud ({ (parsedPreview.mcqs?.length || 0) + (parsedPreview.shortQuestions?.length || 0) + (parsedPreview.longQuestions?.length || 0) } Questions)</span>
                  </button>
                )}
              </div>

              {/* Parsed Preview Section */}
              {parsedPreview && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Detected {parsedPreview.mcqs?.length || 0} MCQs, {parsedPreview.shortQuestions?.length || 0} Short Questions, {parsedPreview.longQuestions?.length || 0} Long Questions</span>
                  </h4>
                  <div className="max-h-60 overflow-y-auto space-y-2 text-xs divide-y divide-slate-200">
                    {(parsedPreview.mcqs || []).map((m, idx) => (
                      <div key={idx} className="pt-2">
                        <p className="font-bold text-slate-800">Q{idx+1}: {m.question}</p>
                        <p className="text-slate-500 text-[11px] pl-3">Options: {m.options?.join(' | ')} (Ans: {m.answer})</p>
                      </div>
                    ))}
                    {(parsedPreview.shortQuestions || []).map((s, idx) => (
                      <div key={idx} className="pt-2">
                        <p className="font-bold text-slate-800">SQ{idx+1}: {s.question}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SINGLE QUESTION FORM */}
          {activeTab === 'single' && (
            <form onSubmit={handleAddSingleQuestion} className="p-6 space-y-4 max-w-3xl">
              <div className="flex gap-3">
                {['mcq', 'short', 'long'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSingleType(t)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      singleType === t ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {t === 'mcq' ? 'MCQ' : t === 'short' ? 'Short Question' : 'Long Question'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Statement</label>
                <textarea
                  rows="3"
                  value={singleQuestion}
                  onChange={(e) => setSingleQuestion(e.target.value)}
                  placeholder="Enter question text here..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              {singleType === 'mcq' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option A</label>
                    <input
                      type="text"
                      value={optA}
                      onChange={(e) => setOptA(e.target.value)}
                      placeholder="Option A"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option B</label>
                    <input
                      type="text"
                      value={optB}
                      onChange={(e) => setOptB(e.target.value)}
                      placeholder="Option B"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option C</label>
                    <input
                      type="text"
                      value={optC}
                      onChange={(e) => setOptC(e.target.value)}
                      placeholder="Option C"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Option D</label>
                    <input
                      type="text"
                      value={optD}
                      onChange={(e) => setOptD(e.target.value)}
                      placeholder="Option D"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Correct Answer</label>
                    <select
                      value={optAnswer}
                      onChange={(e) => setOptAnswer(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Marks</label>
                    <input
                      type="number"
                      value={marks}
                      onChange={(e) => setMarks(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded"
                    />
                  </div>
                </div>
              )}

              {singleType !== 'mcq' && (
                <div className="w-32">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Marks</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs font-bold border border-slate-300 rounded"
                  />
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
              >
                + Add to Topic
              </button>
            </form>
          )}

          {/* TAB 3: MANAGE QUESTIONS IN TOPIC */}
          {activeTab === 'manage' && (
            <div className="p-6 space-y-4">
              {!currentTopic || ((currentTopic.mcqs?.length || 0) + (currentTopic.shortQuestions?.length || 0) + (currentTopic.longQuestions?.length || 0)) === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No questions currently stored in this topic. Add via Batch Upload or Single Question tab.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* MCQs */}
                  {(currentTopic.mcqs || []).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-blue-700 bg-blue-50 p-2 rounded">
                        MCQs ({currentTopic.mcqs.length})
                      </h4>
                      <div className="divide-y divide-slate-100">
                        {currentTopic.mcqs.map((q, idx) => (
                          <div key={q.id || idx} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                            <div className="space-y-1">
                              <p className="font-bold text-slate-800">{idx+1}. {q.question}</p>
                              <div className="flex gap-4 text-[11px] text-slate-500 pl-4">
                                {(q.options || []).map((opt, i) => (
                                  <span key={i} className={String.fromCharCode(65+i) === q.answer ? 'text-emerald-600 font-bold' : ''}>
                                    ({String.fromCharCode(65+i)}) {opt}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion('mcqs', q.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Short Questions */}
                  {(currentTopic.shortQuestions || []).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-indigo-700 bg-indigo-50 p-2 rounded">
                        Short Questions ({currentTopic.shortQuestions.length})
                      </h4>
                      <div className="divide-y divide-slate-100">
                        {currentTopic.shortQuestions.map((q, idx) => (
                          <div key={q.id || idx} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                            <p className="font-bold text-slate-800">{idx+1}. {q.question} ({q.marks || 2} Marks)</p>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion('shortQuestions', q.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Long Questions */}
                  {(currentTopic.longQuestions || []).length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-black uppercase text-amber-700 bg-amber-50 p-2 rounded">
                        Long Questions ({currentTopic.longQuestions.length})
                      </h4>
                      <div className="divide-y divide-slate-100">
                        {currentTopic.longQuestions.map((q, idx) => (
                          <div key={q.id || idx} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                            <p className="font-bold text-slate-800">{idx+1}. {q.question} ({q.marks || 5} Marks)</p>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuestion('longQuestions', q.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: ADD CLASS */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-800">Add New Class</h3>
            <input
              type="text"
              autoFocus
              value={newClassKey}
              onChange={(e) => setNewClassKey(e.target.value)}
              placeholder="e.g. 10th, 8th, 1st Year"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddClassModal(false)}
                className="flex-1 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddClass}
                className="flex-1 py-1.5 bg-blue-600 text-xs font-bold text-white rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SUBJECT */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl p-5 max-w-xs w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-800">Add Subject to {selectedClass} Class</h3>
            <input
              type="text"
              autoFocus
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="e.g. Biology, Islamic Studies"
              className="w-full px-3 py-2 text-xs rounded border border-slate-300"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAddSubjectModal(false)}
                className="flex-1 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddSubject}
                className="flex-1 py-1.5 bg-blue-600 text-xs font-bold text-white rounded cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD CHAPTER */}
      {showAddChapterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-800">Add Chapter to {currentSubject?.name}</h3>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Chapter Number</label>
              <input
                type="number"
                value={newChapterNumber}
                onChange={(e) => setNewChapterNumber(e.target.value)}
                placeholder="e.g. 1, 2, 3"
                className="w-full px-3 py-2 text-xs rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Chapter Name</label>
              <input
                type="text"
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                placeholder="e.g. Database Systems"
                className="w-full px-3 py-2 text-xs rounded border border-slate-300"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddChapterModal(false)}
                className="flex-1 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddChapter}
                className="flex-1 py-1.5 bg-blue-600 text-xs font-bold text-white rounded cursor-pointer"
              >
                Save Chapter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: ADD TOPIC (WITH DUPLICATE VALIDATION) */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-2xl space-y-3">
            <h3 className="font-bold text-sm text-slate-800">
              Add Topic to Chap#{currentChapter?.chapterNumber}
            </h3>

            {topicError && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded">
                {topicError}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Topic Number</label>
              <input
                type="text"
                value={newTopicNumber}
                onChange={(e) => setNewTopicNumber(e.target.value)}
                placeholder={`e.g. ${currentChapter?.chapterNumber || 1}.1`}
                className="w-full px-3 py-2 text-xs rounded border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Topic Name</label>
              <input
                type="text"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="e.g. Network Architecture"
                className="w-full px-3 py-2 text-xs rounded border border-slate-300"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowAddTopicModal(false);
                  setTopicError('');
                }}
                className="flex-1 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddTopic}
                className="flex-1 py-1.5 bg-blue-600 text-xs font-bold text-white rounded cursor-pointer"
              >
                Save Topic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN AI BOT RULES CONTROL MODAL */}
      {showBotRulesModal && (
        <AdminBotRulesModal
          isOpen={showBotRulesModal}
          onClose={() => setShowBotRulesModal(false)}
          currentConfig={botConfig}
          currentUser={currentUser}
          onConfigSaved={(updated) => setBotConfig(updated)}
        />
      )}

    </div>
  );
}
