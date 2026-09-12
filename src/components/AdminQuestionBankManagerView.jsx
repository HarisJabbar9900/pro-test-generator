import React, { useState, useMemo } from 'react';
import { 
  Database, Search, Filter, CheckCircle2, Edit3, Trash2, Plus, 
  Cloud, RefreshCw, ChevronDown, ChevronRight, Layers, BookOpen, 
  Check, X, AlertCircle, Sparkles, FileText, ArrowLeft, Eye
} from 'lucide-react';
import { 
  getQuestionBank, 
  saveQuestionBank, 
  updateQuestionInTopic, 
  deleteQuestionFromTopic, 
  addQuestionToTopic,
  isExerciseQuestion
} from '../utils/questionBankService';
import { syncBankToFirebase } from '../utils/firebaseBankService';
import { notify } from '../utils/notify';
import { confirmAction } from '../utils/confirmDialog';

export default function AdminQuestionBankManagerView({
  bank = {},
  onBankUpdated,
  onExit
}) {
  const [localBank, setLocalBank] = useState(() => getQuestionBank());
  const [selectedClass, setSelectedClass] = useState('11th');
  const [selectedSubjectId, setSelectedSubjectId] = useState('ALL');
  const [selectedChapterId, setSelectedChapterId] = useState('ALL');
  const [selectedTopicId, setSelectedTopicId] = useState('ALL');
  const [activeTypeFilter, setActiveTypeFilter] = useState('ALL'); // 'ALL' | 'mcqs' | 'shortQuestions' | 'longQuestions' | 'exercise'
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // Edit Question Modal State
  const [editingItem, setEditingItem] = useState(null); // { classId, subjectId, chapterId, topicId, type, question }
  
  // Add Question Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQType, setNewQType] = useState('mcqs');
  const [newQText, setNewQText] = useState('');
  const [newQOptA, setNewQOptA] = useState('');
  const [newQOptB, setNewQOptB] = useState('');
  const [newQOptC, setNewQOptC] = useState('');
  const [newQOptD, setNewQOptD] = useState('');
  const [newQAnswer, setNewQAnswer] = useState('A');
  const [newQMarks, setNewQMarks] = useState(1);
  const [newQIsExercise, setNewQIsExercise] = useState(false);

  // Topic expanded accordion state
  const [expandedTopics, setExpandedTopics] = useState({});

  // Helper to commit bank change and auto-sync to cloud
  const handleCommitBankChange = async (updatedBank, successMsg = "Bank updated successfully!") => {
    setLocalBank(updatedBank);
    saveQuestionBank(updatedBank);
    if (onBankUpdated) onBankUpdated(updatedBank);

    // Auto-sync to Firebase in background
    setIsSyncing(true);
    try {
      const res = await syncBankToFirebase(updatedBank);
      if (res.success) {
        setLastSyncTime(new Date().toLocaleTimeString());
        notify.success(successMsg);
      } else {
        notify.info("Saved locally (offline mode).");
      }
    } catch (err) {
      console.warn("Cloud sync warning:", err);
      notify.info("Saved locally.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Manual Full Sync to Cloud
  const handleManualSync = async () => {
    setIsSyncing(true);
    const res = await syncBankToFirebase(localBank);
    setIsSyncing(false);
    if (res.success) {
      setLastSyncTime(new Date().toLocaleTimeString());
      notify.success("All questions successfully synced with Cloud Database!");
    } else {
      notify.error("Cloud sync failed: " + (res.error || "Unknown error"));
    }
  };

  // Available subjects for selected class
  const classData = localBank[selectedClass] || { subjects: [] };
  const subjectsList = classData.subjects || [];

  // Selected subject object
  const currentSubject = subjectsList.find(s => s.id === selectedSubjectId) || (selectedSubjectId === 'ALL' ? subjectsList[0] : null);
  const chaptersList = currentSubject?.chapters || [];

  // Selected chapter object
  const currentChapter = chaptersList.find(c => c.id === selectedChapterId) || null;
  const topicsList = currentChapter ? currentChapter.topics || [] : [];

  // Fast helper to parse letter index
  const getOptIndex = (ans) => {
    if (!ans) return -1;
    const str = String(ans).toLowerCase().replace(/[^a-d0-9]/g, '');
    if (str === 'a' || str === '1') return 0;
    if (str === 'b' || str === '2') return 1;
    if (str === 'c' || str === '3') return 2;
    if (str === 'd' || str === '4') return 3;
    const num = Number(str);
    if (!isNaN(num) && num >= 0 && num <= 3) return num;
    return -1;
  };

  // Quick Change MCQ Correct Answer (1 Click!)
  const handleQuickChangeAnswer = (classId, subjectId, chapterId, topicId, mcq, newAnswerLetter) => {
    const letter = newAnswerLetter.toUpperCase();
    const optIdx = letter.charCodeAt(0) - 65;
    const optText = (mcq.options && mcq.options[optIdx]) ? mcq.options[optIdx] : "";

    const updatedData = {
      answer: `(${letter.toLowerCase()})`,
      correctIndex: optIdx,
      answerKey: optText
    };

    const res = updateQuestionInTopic(classId, subjectId, chapterId, topicId, 'mcqs', mcq.id, updatedData);
    if (res.success) {
      handleCommitBankChange(res.bank, `MCQ Answer changed to (${letter})!`);
    } else {
      notify.error("Could not update answer: " + res.message);
    }
  };

  // Delete Question
  const handleDelete = async (classId, subjectId, chapterId, topicId, type, qId, qText) => {
    const ok = await confirmAction({
      title: "Delete Question?",
      message: `Are you sure you want to permanently remove this question?\n\n"${qText.slice(0, 70)}..."`,
      confirmText: "Yes, Delete",
      isDestructive: true
    });
    if (!ok) return;

    const updatedBank = deleteQuestionFromTopic(classId, subjectId, chapterId, topicId, type, qId);
    if (updatedBank) {
      handleCommitBankChange(updatedBank, "Question deleted successfully.");
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (classId, subjectId, chapterId, topicId, type, question) => {
    setEditingItem({
      classId,
      subjectId,
      chapterId,
      topicId,
      type,
      question: JSON.parse(JSON.stringify(question))
    });
  };

  // Save Edit Question
  const handleSaveEdit = () => {
    if (!editingItem) return;
    const { classId, subjectId, chapterId, topicId, type, question } = editingItem;

    if (!question.question?.trim()) {
      notify.error("Question text cannot be empty!");
      return;
    }

    if (type === 'mcqs') {
      const idx = getOptIndex(question.answer);
      if (idx >= 0 && question.options && question.options[idx]) {
        question.correctIndex = idx;
        question.answerKey = question.options[idx];
      }
    }

    const res = updateQuestionInTopic(classId, subjectId, chapterId, topicId, type, question.id, question);
    if (res.success) {
      handleCommitBankChange(res.bank, "Question updated successfully!");
      setEditingItem(null);
    } else {
      notify.error("Failed to update: " + res.message);
    }
  };

  // Handle Add New Question Submit
  const handleAddQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQText.trim()) {
      notify.error("Question text is required!");
      return;
    }

    const targetSubId = selectedSubjectId !== 'ALL' ? selectedSubjectId : subjectsList[0]?.id;
    if (!targetSubId) {
      notify.error("Please select a valid subject first!");
      return;
    }

    const targetSub = subjectsList.find(s => s.id === targetSubId);
    const targetCh = (selectedChapterId !== 'ALL' ? targetSub?.chapters?.find(c => c.id === selectedChapterId) : targetSub?.chapters?.[0]);
    if (!targetCh) {
      notify.error("Please select or create a chapter first!");
      return;
    }

    const targetTop = (selectedTopicId !== 'ALL' ? targetCh?.topics?.find(t => t.id === selectedTopicId) : targetCh?.topics?.[0]);
    if (!targetTop) {
      notify.error("Please select or create a topic first!");
      return;
    }

    let qData = {
      question: newQText.trim(),
      marks: Number(newQMarks) || (newQType === 'mcqs' ? 1 : newQType === 'shortQuestions' ? 2 : 5),
      isExercise: newQIsExercise,
      category: newQIsExercise ? 'exercise' : 'topic'
    };

    if (newQType === 'mcqs') {
      const opts = [newQOptA.trim(), newQOptB.trim(), newQOptC.trim(), newQOptD.trim()];
      const ansIdx = getOptIndex(newQAnswer);
      qData.options = opts;
      qData.answer = `(${newQAnswer.toLowerCase()})`;
      qData.correctIndex = ansIdx >= 0 ? ansIdx : 0;
      qData.answerKey = opts[qData.correctIndex] || "";
    }

    const updatedBank = addQuestionToTopic(selectedClass, targetSub.id, targetCh.id, targetTop.id, newQType, qData);
    if (updatedBank) {
      handleCommitBankChange(updatedBank, "New question successfully added!");
      setShowAddModal(false);
      // Reset form
      setNewQText('');
      setNewQOptA('');
      setNewQOptB('');
      setNewQOptC('');
      setNewQOptD('');
      setNewQAnswer('A');
    }
  };

  // Compile list of questions based on filters
  const filteredQuestionGroups = useMemo(() => {
    const groups = [];
    const qLower = searchQuery.toLowerCase().trim();

    const targetClasses = selectedClass === 'ALL' ? Object.keys(localBank) : [selectedClass];

    targetClasses.forEach(clsKey => {
      const cls = localBank[clsKey];
      if (!cls || !Array.isArray(cls.subjects)) return;

      cls.subjects.forEach(sub => {
        if (selectedSubjectId !== 'ALL' && sub.id !== selectedSubjectId) return;

        (sub.chapters || []).forEach(ch => {
          if (selectedChapterId !== 'ALL' && ch.id !== selectedChapterId) return;

          (ch.topics || []).forEach(top => {
            if (selectedTopicId !== 'ALL' && top.id !== selectedTopicId) return;

            const isExFilter = activeTypeFilter.startsWith('exercise');

            const mcqs = (top.mcqs || []).filter(q => {
              if (activeTypeFilter === 'shortQuestions' || activeTypeFilter === 'longQuestions') return false;
              if (activeTypeFilter === 'exercise_shorts' || activeTypeFilter === 'exercise_longs') return false;
              if (isExFilter && !isExerciseQuestion(q, top)) return false;
              if (qLower) {
                const inQ = (q.question || '').toLowerCase().includes(qLower);
                const inOpts = (q.options || []).some(opt => opt.toLowerCase().includes(qLower));
                const inAns = (q.answerKey || '').toLowerCase().includes(qLower);
                if (!inQ && !inOpts && !inAns) return false;
              }
              return true;
            });

            const shorts = (top.shortQuestions || []).filter(q => {
              if (activeTypeFilter === 'mcqs' || activeTypeFilter === 'longQuestions') return false;
              if (activeTypeFilter === 'exercise_mcqs' || activeTypeFilter === 'exercise_longs') return false;
              if (isExFilter && !isExerciseQuestion(q, top)) return false;
              if (qLower && !(q.question || '').toLowerCase().includes(qLower)) return false;
              return true;
            });

            const longs = (top.longQuestions || []).filter(q => {
              if (activeTypeFilter === 'mcqs' || activeTypeFilter === 'shortQuestions') return false;
              if (activeTypeFilter === 'exercise_mcqs' || activeTypeFilter === 'exercise_shorts') return false;
              if (isExFilter && !isExerciseQuestion(q, top)) return false;
              if (qLower && !(q.question || '').toLowerCase().includes(qLower)) return false;
              return true;
            });

            if (mcqs.length > 0 || shorts.length > 0 || longs.length > 0) {
              groups.push({
                classKey: clsKey,
                className: cls.className || `${clsKey} Class`,
                subjectId: sub.id,
                subjectName: sub.name,
                chapterId: ch.id,
                chapterNumber: ch.chapterNumber,
                chapterName: ch.name,
                topicId: top.id,
                topicNumber: top.topicNumber,
                topicName: top.name,
                isExerciseTopic: isExerciseQuestion({ isExercise: false }, top),
                mcqs,
                shorts,
                longs,
                total: mcqs.length + shorts.length + longs.length
              });
            }
          });
        });
      });
    });

    return groups;
  }, [localBank, selectedClass, selectedSubjectId, selectedChapterId, selectedTopicId, activeTypeFilter, searchQuery]);

  // Compute total counts of filtered items
  const totalFilteredCounts = useMemo(() => {
    let m = 0, s = 0, l = 0;
    filteredQuestionGroups.forEach(g => {
      m += g.mcqs.length;
      s += g.shorts.length;
      l += g.longs.length;
    });
    return { mcqs: m, shorts: s, longs: l, total: m + s + l };
  }, [filteredQuestionGroups]);

  // Compute overall counts for current selected scope (Class, Subject, Chapter, Topic, Search)
  // before activeTypeFilter is applied, so button counts and stats remain 100% STABLE
  const scopeCounts = useMemo(() => {
    let mcqs = 0;
    let shorts = 0;
    let longs = 0;
    let exercise = 0;
    let exerciseMcqs = 0;
    let exerciseShorts = 0;
    let exerciseLongs = 0;

    const qLower = searchQuery.toLowerCase().trim();
    const targetClasses = selectedClass === 'ALL' ? Object.keys(localBank) : [selectedClass];

    targetClasses.forEach(clsKey => {
      const cls = localBank[clsKey];
      if (!cls || !Array.isArray(cls.subjects)) return;

      cls.subjects.forEach(sub => {
        if (selectedSubjectId !== 'ALL' && sub.id !== selectedSubjectId) return;

        (sub.chapters || []).forEach(ch => {
          if (selectedChapterId !== 'ALL' && ch.id !== selectedChapterId) return;

          (ch.topics || []).forEach(top => {
            if (selectedTopicId !== 'ALL' && top.id !== selectedTopicId) return;

            // MCQs
            (top.mcqs || []).forEach(q => {
              if (qLower) {
                const inQ = (q.question || '').toLowerCase().includes(qLower);
                const inOpts = (q.options || []).some(opt => opt.toLowerCase().includes(qLower));
                const inAns = (q.answerKey || '').toLowerCase().includes(qLower);
                if (!inQ && !inOpts && !inAns) return;
              }
              mcqs++;
              if (isExerciseQuestion(q, top)) {
                exercise++;
                exerciseMcqs++;
              }
            });

            // Shorts
            (top.shortQuestions || []).forEach(q => {
              if (qLower && !(q.question || '').toLowerCase().includes(qLower)) return;
              shorts++;
              if (isExerciseQuestion(q, top)) {
                exercise++;
                exerciseShorts++;
              }
            });

            // Longs
            (top.longQuestions || []).forEach(q => {
              if (qLower && !(q.question || '').toLowerCase().includes(qLower)) return;
              longs++;
              if (isExerciseQuestion(q, top)) {
                exercise++;
                exerciseLongs++;
              }
            });
          });
        });
      });
    });

    const total = mcqs + shorts + longs;
    return {
      mcqs,
      shorts,
      longs,
      total,
      exercise,
      exerciseMcqs,
      exerciseShorts,
      exerciseLongs
    };
  }, [localBank, selectedClass, selectedSubjectId, selectedChapterId, selectedTopicId, searchQuery]);

  return (
    <div className="flex-1 flex flex-col bg-slate-100 min-h-screen">
      
      {/* 1. TOP CONTROL BAR */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-4 border-b border-slate-800 shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>Question Bank & Answer Key Editor</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Live Editor
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage, edit questions, change MCQ answer keys, and auto-sync with Cloud Database.
              </p>
            </div>
          </div>

          {/* Cloud Sync & Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Sync changes immediately to Firestore"
            >
              <Cloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud Database'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>

            {lastSyncTime && (
              <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
                Synced: {lastSyncTime}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* 2. FILTER & SEARCH TOOLBAR */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto space-y-3">
          
          {/* Class Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Class:
            </span>
            {['ALL', '9th', '10th', '11th', '12th'].map(cKey => (
              <button
                key={cKey}
                type="button"
                onClick={() => {
                  setSelectedClass(cKey);
                  setSelectedSubjectId('ALL');
                  setSelectedChapterId('ALL');
                  setSelectedTopicId('ALL');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedClass === cKey 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cKey === 'ALL' ? 'All Classes' : `${cKey} Class`}
              </button>
            ))}
          </div>

          {/* Selectors Row (Subject, Chapter, Topic & Search) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* Subject Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedChapterId('ALL');
                  setSelectedTopicId('ALL');
                }}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="ALL">All Subjects</option>
                {subjectsList.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Chapter Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Chapter</label>
              <select
                value={selectedChapterId}
                onChange={(e) => {
                  setSelectedChapterId(e.target.value);
                  setSelectedTopicId('ALL');
                }}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="ALL">All Chapters</option>
                {chaptersList.map(ch => (
                  <option key={ch.id} value={ch.id}>
                    Ch #{ch.chapterNumber}: {ch.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selector */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Topic</label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value)}
                disabled={!currentChapter}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="ALL">All Topics</option>
                {topicsList.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.topicNumber}: {t.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Instant Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search question, option, answer..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Filter Pills & Stats Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pt-2 border-t border-slate-100">
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { id: 'ALL', label: 'All Questions', count: scopeCounts.total },
                { id: 'mcqs', label: 'MCQs Only', count: scopeCounts.mcqs },
                { id: 'shortQuestions', label: 'Short Qs Only', count: scopeCounts.shorts },
                { id: 'longQuestions', label: 'Long Qs Only', count: scopeCounts.longs },
                { id: 'exercise', label: 'Exercise Questions', count: scopeCounts.exercise }
              ].map(f => {
                const isActive = f.id === 'exercise' ? activeTypeFilter.startsWith('exercise') : activeTypeFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActiveTypeFilter(f.id)}
                    className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                      isActive
                        ? f.id === 'exercise'
                          ? 'bg-emerald-700 text-white shadow-xs ring-1 ring-emerald-700'
                          : 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                        isActive
                          ? f.id === 'exercise'
                            ? 'bg-emerald-900/60 text-emerald-100'
                            : 'bg-slate-800 text-cyan-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {f.count}
                    </span>
                  </button>
                );
              })}

              {/* Sub-filters when Exercise is selected */}
              {activeTypeFilter.startsWith('exercise') && (
                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-300 px-2 py-1 rounded-lg text-xs animate-fadeIn">
                  <span className="text-emerald-950 font-black text-[10px] uppercase tracking-wider px-1">
                    Exercise:
                  </span>
                  {[
                    { id: 'exercise', label: 'All', count: scopeCounts.exercise },
                    { id: 'exercise_mcqs', label: 'MCQs', count: scopeCounts.exerciseMcqs },
                    { id: 'exercise_shorts', label: 'Shorts', count: scopeCounts.exerciseShorts },
                    { id: 'exercise_longs', label: 'Longs', count: scopeCounts.exerciseLongs }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveTypeFilter(sub.id)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        activeTypeFilter === sub.id
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      <span>{sub.label}</span>
                      <span className={`text-[10px] font-mono font-black ${
                        activeTypeFilter === sub.id ? 'text-emerald-200' : 'text-emerald-700'
                      }`}>
                        ({sub.count})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Total Scope Count Badge */}
            {scopeCounts.total > 0 && (
              <div className="shrink-0 self-start lg:self-center">
                <span className="bg-slate-900 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs flex items-center gap-1.5">
                  <span className="text-slate-400 font-sans text-[11px] uppercase tracking-wider font-semibold">Total:</span>
                  <span className="text-cyan-300 font-black">{scopeCounts.total} Qs</span>
                </span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. MAIN QUESTIONS LIST */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {filteredQuestionGroups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
            <Database className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">No Questions Found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your class, subject, chapter, or search query.
            </p>
          </div>
        ) : (
          filteredQuestionGroups.map(group => {
            const groupKey = `${group.classKey}-${group.subjectId}-${group.chapterId}-${group.topicId}`;
            const isExpanded = expandedTopics[groupKey] !== false; // default expanded

            return (
              <div 
                key={groupKey}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                
                {/* Topic Header Card */}
                <div 
                  onClick={() => setExpandedTopics(prev => ({ ...prev, [groupKey]: !isExpanded }))}
                  className="bg-slate-50 hover:bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                          {group.className} • {group.subjectName}
                        </span>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          Ch #{group.chapterNumber}: {group.chapterName}
                        </span>
                      </div>
                      <h2 className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1.5">
                        <span className="font-mono text-blue-600">{group.topicNumber}</span>
                        <span>{group.topicName}</span>
                        {group.isExerciseTopic && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold border border-emerald-200">
                            Exercise Topic
                          </span>
                        )}
                      </h2>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    {group.mcqs.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">
                        {group.mcqs.length} MCQs
                      </span>
                    )}
                    {group.shorts.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                        {group.shorts.length} Shorts
                      </span>
                    )}
                    {group.longs.length > 0 && (
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold border border-purple-200">
                        {group.longs.length} Longs
                      </span>
                    )}
                  </div>
                </div>

                {/* Questions Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-6 divide-y divide-slate-100">
                    
                    {/* 1. MCQS SECTION */}
                    {group.mcqs.length > 0 && (
                      <div className="space-y-3 pt-4 first:pt-0">
                        <h3 className="text-xs font-black uppercase text-cyan-800 tracking-wider flex items-center gap-1.5">
                          <span>Multiple Choice Questions</span>
                          <span className="text-[10px] bg-cyan-100 text-cyan-800 px-1.5 py-0.2 rounded font-bold">
                            {group.mcqs.length}
                          </span>
                          <span className="text-[10px] font-normal text-slate-400 ml-2">
                            (Click any option card to instantly set/change the correct answer!)
                          </span>
                        </h3>

                        <div className="grid grid-cols-1 gap-3">
                          {group.mcqs.map((mcq, mIdx) => {
                            const activeAnsIdx = getOptIndex(mcq.answer);

                            return (
                              <div 
                                key={mcq.id || mIdx}
                                className="bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl p-3.5 space-y-2.5 transition-all"
                              >
                                {/* Statement & Badges */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-black text-xs text-slate-700">
                                        Q{mIdx + 1}.
                                      </span>
                                      <p className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                                        {mcq.question}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px]">
                                      <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono font-semibold">
                                        {mcq.marks || 1} Mark
                                      </span>
                                      {isExerciseQuestion(mcq) ? (
                                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                                          Textbook Exercise
                                        </span>
                                      ) : (
                                        <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                                          Topic-Wise Bank
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEdit(group.classKey, group.subjectId, group.chapterId, group.topicId, 'mcqs', mcq)}
                                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                      title="Edit Question Statement & Options"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(group.classKey, group.subjectId, group.chapterId, group.topicId, 'mcqs', mcq.id, mcq.question)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                      title="Delete Question"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Options (Interactive 1-Click Answer Changer) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                  {(mcq.options || []).map((opt, oIdx) => {
                                    const letter = String.fromCharCode(65 + oIdx);
                                    const isCurrentCorrect = activeAnsIdx === oIdx;

                                    return (
                                      <div
                                        key={oIdx}
                                        onClick={() => handleQuickChangeAnswer(group.classKey, group.subjectId, group.chapterId, group.topicId, mcq, letter)}
                                        className={`p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all flex items-center justify-between gap-2 select-none ${
                                          isCurrentCorrect
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-400'
                                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                                        }`}
                                        title={`Click to set (${letter}) as the correct answer`}
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${
                                            isCurrentCorrect
                                              ? 'bg-emerald-600 text-white'
                                              : 'bg-slate-200 text-slate-700'
                                          }`}>
                                            {letter}
                                          </span>
                                          <span className="leading-snug">{opt}</span>
                                        </div>

                                        {isCurrentCorrect && (
                                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                                            <Check className="w-3 h-3 text-emerald-700" />
                                            <span>Correct</span>
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Current Key Info */}
                                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-mono">
                                  <span>
                                    Key: <strong className="text-emerald-700 font-bold">{mcq.answer || 'N/A'}</strong> - {mcq.answerKey || 'No text key'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 italic">
                                    Click any card above to change key
                                  </span>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 2. SHORT QUESTIONS SECTION */}
                    {group.shorts.length > 0 && (
                      <div className="space-y-3 pt-4 first:pt-0">
                        <h3 className="text-xs font-black uppercase text-indigo-800 tracking-wider flex items-center gap-1.5">
                          <span>Short Questions</span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-bold">
                            {group.shorts.length}
                          </span>
                        </h3>

                        <div className="grid grid-cols-1 gap-2">
                          {group.shorts.map((sq, sIdx) => (
                            <div 
                              key={sq.id || sIdx}
                              className="bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl p-3 flex items-start justify-between gap-3 transition-all"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-xs text-indigo-700">
                                    Q{sIdx + 1}.
                                  </span>
                                  <p className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">
                                    {sq.question}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono font-semibold">
                                    {sq.marks || 2} Marks
                                  </span>
                                  {isExerciseQuestion(sq) ? (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                                      Exercise Short
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                                      Board-Style Topic Short
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(group.classKey, group.subjectId, group.chapterId, group.topicId, 'shortQuestions', sq)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Short Question"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(group.classKey, group.subjectId, group.chapterId, group.topicId, 'shortQuestions', sq.id, sq.question)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Question"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 3. LONG QUESTIONS SECTION */}
                    {group.longs.length > 0 && (
                      <div className="space-y-3 pt-4 first:pt-0">
                        <h3 className="text-xs font-black uppercase text-purple-800 tracking-wider flex items-center gap-1.5">
                          <span>Long Questions</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                            {group.longs.length}
                          </span>
                        </h3>

                        <div className="grid grid-cols-1 gap-2">
                          {group.longs.map((lq, lIdx) => (
                            <div 
                              key={lq.id || lIdx}
                              className="bg-slate-50/70 border border-slate-200 hover:border-slate-300 rounded-xl p-3 flex items-start justify-between gap-3 transition-all"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-black text-xs text-purple-700">
                                    Q{lIdx + 1}.
                                  </span>
                                  <p className="font-bold text-xs sm:text-sm text-slate-800 leading-snug">
                                    {lq.question}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px]">
                                  <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-mono font-semibold">
                                    {lq.marks || 5} Marks
                                  </span>
                                  {isExerciseQuestion(lq) && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                                      Exercise Long
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(group.classKey, group.subjectId, group.chapterId, group.topicId, 'longQuestions', lq)}
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Long Question"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(group.classKey, group.subjectId, group.chapterId, group.topicId, 'longQuestions', lq.id, lq.question)}
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Question"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. MODAL: EDIT FULL QUESTION & OPTIONS */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <span>Edit {editingItem.type === 'mcqs' ? 'MCQ & Answer Key' : editingItem.type === 'shortQuestions' ? 'Short Question' : 'Long Question'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Question Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Statement</label>
              <textarea
                rows={3}
                value={editingItem.question.question || ''}
                onChange={(e) => setEditingItem({
                  ...editingItem,
                  question: { ...editingItem.question, question: e.target.value }
                })}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            {/* If MCQ: Options and Selected Answer */}
            {editingItem.type === 'mcqs' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Options & Correct Answer Selection</label>
                {(editingItem.question.options || ['', '', '', '']).map((opt, oIdx) => {
                  const letter = String.fromCharCode(65 + oIdx);
                  const isCurCorrect = getOptIndex(editingItem.question.answer) === oIdx;

                  return (
                    <div key={oIdx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingItem({
                            ...editingItem,
                            question: {
                              ...editingItem.question,
                              answer: `(${letter.toLowerCase()})`,
                              correctIndex: oIdx,
                              answerKey: opt
                            }
                          });
                        }}
                        className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                          isCurCorrect
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                        title="Click to mark this option as correct"
                      >
                        {letter}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...(editingItem.question.options || ['', '', '', ''])];
                          newOpts[oIdx] = e.target.value;
                          setEditingItem({
                            ...editingItem,
                            question: {
                              ...editingItem.question,
                              options: newOpts,
                              answerKey: isCurCorrect ? e.target.value : editingItem.question.answerKey
                            }
                          });
                        }}
                        placeholder={`Option ${letter}`}
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                      {isCurCorrect && (
                        <span className="text-[10px] text-emerald-700 font-black uppercase">
                          ✓ Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Marks & Exercise Checkbox */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Marks</label>
                <input
                  type="number"
                  value={editingItem.question.marks || 1}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    question: { ...editingItem.question, marks: Number(e.target.value) || 1 }
                  })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(editingItem.question.isExercise)}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      question: { 
                        ...editingItem.question, 
                        isExercise: e.target.checked,
                        category: e.target.checked ? 'exercise' : 'topic'
                      }
                    })}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>Textbook Exercise Question</span>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer shadow-xs transition-colors"
              >
                Save & Update
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. MODAL: ADD NEW QUESTION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>Add New Question to Question Bank</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-3">
              
              {/* Question Type Radio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Question Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'mcqs', label: 'MCQ' },
                    { id: 'shortQuestions', label: 'Short Q' },
                    { id: 'longQuestions', label: 'Long Q' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setNewQType(t.id);
                        setNewQMarks(t.id === 'mcqs' ? 1 : t.id === 'shortQuestions' ? 2 : 5);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        newQType === t.id
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statement */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Statement</label>
                <textarea
                  rows={3}
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  placeholder="Enter the question text here..."
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  required
                />
              </div>

              {/* Options for MCQ */}
              {newQType === 'mcqs' && (
                <div className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Options & Correct Answer
                  </label>
                  {[
                    { val: newQOptA, set: setNewQOptA, letter: 'A' },
                    { val: newQOptB, set: setNewQOptB, letter: 'B' },
                    { val: newQOptC, set: setNewQOptC, letter: 'C' },
                    { val: newQOptD, set: setNewQOptD, letter: 'D' }
                  ].map(opt => (
                    <div key={opt.letter} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setNewQAnswer(opt.letter)}
                        className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                          newQAnswer === opt.letter
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                        title="Click to select this as correct answer"
                      >
                        {opt.letter}
                      </button>
                      <input
                        type="text"
                        value={opt.val}
                        onChange={(e) => opt.set(e.target.value)}
                        placeholder={`Option (${opt.letter})`}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        required
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Marks & Exercise */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marks</label>
                  <input
                    type="number"
                    value={newQMarks}
                    onChange={(e) => setNewQMarks(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={newQIsExercise}
                      onChange={(e) => setNewQIsExercise(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600"
                    />
                    <span>Textbook Exercise Question</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer shadow-xs transition-colors"
                >
                  Save to Topic
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
