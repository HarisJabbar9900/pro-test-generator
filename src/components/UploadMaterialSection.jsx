import React, { useState, useEffect } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, 
  BookOpen, Sparkles, Check, ChevronRight, HelpCircle, 
  Hash, Cloud, Layers, Plus, Trash2, ArrowRight, FileEdit, RefreshCw, FolderPlus, Tag
} from 'lucide-react';
import { extractTextFromFile, parseDocumentIntoQuestions, validateUploadedFile } from '../utils/docParser';
import { 
  getQuestionBank, 
  addSubjectToClass,
  addChapterToSubject,
  addTopicToChapter, 
  importParsedQuestionsToTopic,
  deleteTopicFromChapter,
  deleteChapterFromSubject
} from '../utils/questionBankService';
import { 
  saveUploadedMaterialToFirebase, 
  syncBankToFirebase,
  deleteTopicFromFirebase,
  deleteChapterFromFirebase
} from '../utils/firebaseBankService';
import { notify } from '../utils/notify';
import { confirmAction } from '../utils/confirmDialog';

export default function UploadMaterialSection({
  bank,
  selectedClass,
  setSelectedClass,
  onBankUpdated,
  onGoToGenerator
}) {
  // Current Class & Subject
  const currentClassData = bank[selectedClass] || { subjects: [] };
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => {
    return currentClassData.subjects[0]?.id || '';
  });

  const currentSubject = currentClassData.subjects.find(s => s.id === selectedSubjectId) || currentClassData.subjects[0];
  const currentChapters = currentSubject?.chapters || [];

  // Active Chapter selection
  const [selectedChapterId, setSelectedChapterId] = useState(() => {
    return currentChapters[0]?.id || '';
  });

  // Keep selectedChapterId updated when subject or class changes
  useEffect(() => {
    if (currentChapters.length > 0) {
      if (!currentChapters.some(c => c.id === selectedChapterId)) {
        setSelectedChapterId(currentChapters[0].id);
      }
    } else {
      setSelectedChapterId('');
    }
  }, [selectedSubjectId, selectedClass, currentChapters]);

  const activeChapter = currentChapters.find(c => c.id === selectedChapterId) || currentChapters[0];
  const activeChapterTopics = activeChapter?.topics || [];

  // Add Chapter Form state
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [newChapterName, setNewChapterName] = useState('');

  // Topic Number & Name state
  const [topicNumber, setTopicNumber] = useState('1.1');
  const [topicName, setTopicName] = useState('');

  // When active chapter changes, auto-suggest next topic number
  useEffect(() => {
    if (activeChapter) {
      const nextIndex = (activeChapterTopics.length || 0) + 1;
      setTopicNumber(`${activeChapter.chapterNumber || 1}.${nextIndex}`);
    }
  }, [activeChapter?.id, activeChapterTopics.length]);

  // Upload & Parsing state
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'paste'
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activePreviewTab, setActivePreviewTab] = useState('mcqs');
  const [isSaving, setIsSaving] = useState(false);
  const [questionCategory, setQuestionCategory] = useState('topic'); // 'topic' | 'exercise'

  // New Subject form state
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  // Handle Class Change
  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    const firstSub = bank[cls]?.subjects[0];
    setSelectedSubjectId(firstSub?.id || '');
    const firstCh = firstSub?.chapters?.[0];
    setSelectedChapterId(firstCh?.id || '');
    setParsedData(null);
    setSuccessMessage('');
  };

  // Add new Subject
  const handleAddSubjectSubmit = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const updated = addSubjectToClass(selectedClass, newSubjectName.trim());
    if (updated) {
      onBankUpdated(updated);
      syncBankToFirebase(updated).catch(e => console.warn(e));
      const added = updated[selectedClass]?.subjects?.slice(-1)[0];
      if (added) {
        setSelectedSubjectId(added.id);
        setSelectedChapterId('');
      }
      notify.success(`Subject "${newSubjectName.trim()}" added!`);
      setNewSubjectName('');
      setShowAddSubject(false);
    }
  };

  // Add new Chapter directly
  const handleCreateChapter = (e) => {
    e.preventDefault();
    if (!newChapterName.trim() || !currentSubject) {
      notify.warning("Please enter a chapter name.");
      return;
    }

    const chNum = parseInt(newChapterNumber, 10) || (currentChapters.length + 1);
    const updated = addChapterToSubject(selectedClass, currentSubject.id, chNum, newChapterName.trim());
    if (updated) {
      onBankUpdated(updated);
      syncBankToFirebase(updated).catch(e => console.warn(e));
      const subChapters = updated[selectedClass]?.subjects?.find(s => s.id === currentSubject.id)?.chapters || [];
      const newlyAddedCh = subChapters.find(c => c.chapterNumber === chNum || c.name.toLowerCase().trim() === newChapterName.trim().toLowerCase()) || subChapters[subChapters.length - 1];
      if (newlyAddedCh) {
        setSelectedChapterId(newlyAddedCh.id);
        setTopicNumber(`${newlyAddedCh.chapterNumber}.1`);
      }
      notify.success(`Chapter ${chNum}: "${newChapterName.trim()}" created!`);
      setNewChapterName('');
      setNewChapterNumber('');
      setShowAddChapterModal(false);
    }
  };

  // Process Raw Document / Pasted Text
  const processRawText = (text, sourceName) => {
    if (!text || text.trim().length < 15) {
      throw new Error("Text is too short. Please make sure file contains questions with numbering.");
    }
    const parsed = parseDocumentIntoQuestions(text);
    const totalFound = (parsed.mcqs?.length || 0) + (parsed.shortQuestions?.length || 0) + (parsed.longQuestions?.length || 0);
    if (totalFound === 0) {
      throw new Error("Koi questions detect nahi huye. Questions ke sath numbers (1., 2. ya Q1:) aur MCQs ke sath options (A, B, C, D) hona zaroori hain.");
    }
    setParsedData(parsed);

    // Auto set default preview tab
    if (parsed.mcqs?.length > 0) setActivePreviewTab('mcqs');
    else if (parsed.shortQuestions?.length > 0) setActivePreviewTab('shortQuestions');
    else setActivePreviewTab('longQuestions');

    if (!topicName && sourceName) {
      const clean = sourceName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTopicName(clean);
    }

    // Auto-detect exercise documents and suggest Exercise category
    if (parsed.isLikelyExercise || /exercise|مشق/i.test(sourceName || '')) {
      setQuestionCategory('exercise');
      setTopicNumber('Exercise');
      if (!topicName || topicName.toLowerCase().includes('topic') || topicName.toLowerCase().includes('pasted')) {
        setTopicName('Official Textbook Exercise');
      }
    }
  };

  // Handle File Upload
  const handleFileSelection = async (file) => {
    if (!file) return;

    // Security check: file size and extension whitelist
    const validation = validateUploadedFile(file);
    if (!validation.valid) {
      notify.error(validation.error);
      setParseError(validation.error);
      return;
    }

    setUploadedFile(file);
    setIsParsing(true);
    setParseError('');
    setSuccessMessage('');
    setParsedData(null);

    try {
      const extracted = await extractTextFromFile(file);
      processRawText(extracted, file.name);
    } catch (err) {
      setParseError(err.message || "Failed to parse document.");
    } finally {
      setIsParsing(false);
    }
  };

  // Handle Text Paste Process
  const handlePasteProcess = () => {
    if (!pastedText.trim()) return;
    setIsParsing(true);
    setParseError('');
    setSuccessMessage('');
    setParsedData(null);

    try {
      processRawText(pastedText, "Pasted Questions");
    } catch (err) {
      setParseError(err.message || "Failed to parse text.");
    } finally {
      setIsParsing(false);
    }
  };

  // Save to Bank & Firebase
  const handleSaveToBankAndFirebase = async () => {
    if (!currentSubject) {
      notify.error("Please select a subject first.");
      return;
    }

    if (!activeChapter) {
      notify.error("Please select or create a chapter first.");
      return;
    }

    if (!topicName.trim()) {
      notify.warning("Please enter a topic name.");
      return;
    }

    setIsSaving(true);

    const tNum = (topicNumber || `${activeChapter.chapterNumber}.1`).trim();
    const tName = topicName.trim();

    // Check if topic already exists in active chapter by number or name
    const currentSubObj = bank[selectedClass]?.subjects?.find(s => s.id === currentSubject.id);
    const chapterObj = currentSubObj?.chapters?.find(c => c.id === activeChapter.id);
    
    const existingTopic = chapterObj?.topics?.find(t => 
      t.topicNumber?.toLowerCase() === tNum.toLowerCase() ||
      t.name?.toLowerCase() === tName.toLowerCase()
    );

    let targetTopicId = null;

    if (existingTopic) {
      // APPEND MODE: Add to existing topic without deleting previous MCQs/questions!
      targetTopicId = existingTopic.id;
    } else {
      // NEW TOPIC MODE: Create new topic
      const res = addTopicToChapter(selectedClass, currentSubject.id, activeChapter.id, tNum, tName);
      if (res && res.topicId) {
        onBankUpdated(res.bank);
        targetTopicId = res.topicId;
      }
    }

    if (!targetTopicId) {
      notify.error("Target topic could not be found or created.");
      setIsSaving(false);
      return;
    }

    const dataToSave = {
      mcqs: (parsedData.mcqs || []).map(m => ({
        ...m,
        isExercise: questionCategory === 'exercise',
        category: questionCategory
      })),
      shortQuestions: (parsedData.shortQuestions || []).map(s => ({
        ...s,
        isExercise: questionCategory === 'exercise',
        category: questionCategory
      })),
      longQuestions: (parsedData.longQuestions || []).map(l => ({
        ...l,
        isExercise: questionCategory === 'exercise',
        category: questionCategory
      }))
    };

    const importRes = importParsedQuestionsToTopic(selectedClass, currentSubject.id, activeChapter.id, targetTopicId, dataToSave);

    if (importRes && importRes.success) {
      onBankUpdated(importRes.bank);
      const isAppended = !!existingTopic;
      const msg = isAppended
        ? `Appended to Topic ${tNum} (${tName}): ${importRes.counts.mcqs} MCQs, ${importRes.counts.shortQuestions} Shorts, ${importRes.counts.longQuestions} Longs.`
        : `Created Topic ${tNum} (${tName}) with ${importRes.counts.mcqs} MCQs, ${importRes.counts.shortQuestions} Shorts, ${importRes.counts.longQuestions} Longs!`;
      
      setSuccessMessage(msg);
      notify.success(msg);

      // Save individual document to Firebase
      saveUploadedMaterialToFirebase({
        fileName: uploadedFile?.name || "Direct Text Upload",
        gradeClass: selectedClass,
        subjectName: currentSubject.name,
        chapterName: activeChapter.name,
        topicNumber: tNum,
        topicName: tName,
        parsedData
      }).catch(e => console.warn(e));

      // Sync entire bank to Firestore
      syncBankToFirebase(importRes.bank).catch(e => console.warn(e));

      // Reset file input
      setUploadedFile(null);
      setPastedText('');
      setParsedData(null);
    } else {
      notify.error("Failed to save: " + (importRes?.message || "Unknown error"));
    }

    setIsSaving(false);
  };

  // Delete topic handler
  const handleDeleteTopic = async (chId, topId, topName) => {
    confirmAction({
      title: "Delete Topic",
      message: `Are you sure you want to delete topic "${topName}" and all its questions from the bank?`,
      confirmText: "Delete Topic",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        const targetCh = currentChapters.find(c => c.id === chId);
        const targetTop = targetCh?.topics?.find(t => t.id === topId);
        const topNum = targetTop?.topicNumber || '';

        const updated = deleteTopicFromChapter(selectedClass, currentSubject.id, chId, topId);
        if (updated) {
          onBankUpdated(updated);
          notify.info(`Topic "${topName}" was deleted.`);
          // Delete completely from Firebase (both main_bank and uploaded_materials collection)
          deleteTopicFromFirebase(selectedClass, currentSubject?.name, targetCh?.name, topNum, updated)
            .catch(e => console.warn("Firebase delete topic error:", e));
        }
      }
    });
  };

  // Delete chapter handler
  const handleDeleteChapter = async (chId, chName) => {
    confirmAction({
      title: "Delete Chapter",
      message: `Are you sure you want to delete Chapter "${chName}" and all its topics/questions?`,
      confirmText: "Delete Chapter",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        const updated = deleteChapterFromSubject(selectedClass, currentSubject.id, chId);
        if (updated) {
          onBankUpdated(updated);
          notify.info(`Chapter "${chName}" was deleted.`);
          // Delete completely from Firebase (both main_bank and uploaded_materials collection)
          deleteChapterFromFirebase(selectedClass, currentSubject?.name, chName, updated)
            .catch(e => console.warn("Firebase delete chapter error:", e));
        }
      }
    });
  };

  return (
    <div className="max-w-[1700px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn text-slate-800">
      
      {/* TOP HEADER */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <UploadCloud className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Material Upload & Question Bank
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Firebase Cloud Sync Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Neeche 4 aasan steps mein Chapter aur Topic banayein, phir Word (.docx) ya Text file upload karke questions save karein.
          </p>
        </div>

        {/* Shortcut to Paper Maker */}
        <button
          onClick={onGoToGenerator}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-indigo-500/20 transition-all cursor-pointer group shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Paper Banane Walay Portion Mein Jayein</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* LEFT COLUMN: 4 CLEAR STEPS */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* STEP 1: CLASS & SUBJECT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <h2 className="text-sm font-bold text-slate-900">Class & Subject Choose Karein</h2>
              </div>
              <span className="text-xs text-indigo-600 font-bold">{selectedClass} Class</span>
            </div>

            {/* Class Buttons */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Class:</label>
              <div className="grid grid-cols-4 gap-2">
                {['9th', '10th', '11th', '12th'].map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => handleClassSelect(cls)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      selectedClass === cls
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {cls} Class
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-500">Subject:</label>
                <button
                  type="button"
                  onClick={() => setShowAddSubject(!showAddSubject)}
                  className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Naya Subject Add Karein</span>
                </button>
              </div>

              {/* Add Subject Inline Box */}
              {showAddSubject && (
                <form onSubmit={handleAddSubjectSubmit} className="flex gap-2 mb-3 p-3 bg-slate-50 rounded-xl border border-indigo-200">
                  <input
                    type="text"
                    placeholder="Naye Subject Ka Naam (e.g. Computer Science)"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 cursor-pointer"
                  >
                    Save Subject
                  </button>
                </form>
              )}

              <div className="flex flex-wrap gap-1.5">
                {currentClassData.subjects.map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(sub.id);
                      const firstCh = sub.chapters?.[0];
                      setSelectedChapterId(firstCh?.id || '');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      selectedSubjectId === sub.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 2: CHAPTER SELECTION OR CREATION */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                <h2 className="text-sm font-bold text-slate-900">Chapter Select Karein Ya Naya Add Karein</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAddChapterModal(!showAddChapterModal);
                  setNewChapterNumber(`${currentChapters.length + 1}`);
                  setNewChapterName(`Chapter ${currentChapters.length + 1}`);
                }}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>+ Naya Chapter Banayein</span>
              </button>
            </div>

            {/* Inline Add Chapter Form */}
            {showAddChapterModal && (
              <form onSubmit={handleCreateChapter} className="p-4 bg-slate-50 rounded-xl border border-emerald-300 space-y-3 animate-fadeIn">
                <div className="font-bold text-xs text-emerald-800 flex items-center gap-1.5">
                  <FolderPlus className="w-4 h-4" />
                  <span>Naye Chapter Ki Details:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Chapter Number:</label>
                    <input
                      type="number"
                      value={newChapterNumber}
                      onChange={(e) => setNewChapterNumber(e.target.value)}
                      placeholder="1, 2, 3..."
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">Chapter Ka Naam:</label>
                    <input
                      type="text"
                      value={newChapterName}
                      onChange={(e) => setNewChapterName(e.target.value)}
                      placeholder="e.g. Physical Quantities & Measurement"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddChapterModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm cursor-pointer"
                  >
                    + Chapter Save Karein
                  </button>
                </div>
              </form>
            )}

            {/* List of Existing Chapters as Easy Selector Cards */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                Mojooda Chapters (Click karke select karein):
              </label>

              {currentChapters.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                  Is subject mein abhi koi chapter nahi hai. Upar <strong className="text-emerald-700">"+ Naya Chapter Banayein"</strong> par click karein.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                  {currentChapters.map(ch => {
                    const isSelected = (selectedChapterId === ch.id);
                    const chMcqs = (ch.topics || []).reduce((acc, t) => acc + (t.mcqs?.length || 0), 0);
                    const chShorts = (ch.topics || []).reduce((acc, t) => acc + (t.shortQuestions?.length || 0), 0);
                    const chLongs = (ch.topics || []).reduce((acc, t) => acc + (t.longQuestions?.length || 0), 0);

                    return (
                      <div
                        key={ch.id}
                        onClick={() => setSelectedChapterId(ch.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-400 text-slate-900 shadow-sm ring-1 ring-indigo-400'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="font-bold flex items-center gap-1.5">
                            <span className="text-amber-800 font-mono bg-amber-50 px-1 py-0.5 rounded border border-amber-200">Ch {ch.chapterNumber}:</span>
                            <span className="truncate">{ch.name}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1.5 font-mono">
                            <span>{ch.topics?.length || 0} Topics</span>
                            <span>•</span>
                            <span className="text-cyan-700 font-bold">{chMcqs} M</span>
                            <span className="text-indigo-700 font-bold">{chShorts} S</span>
                            <span className="text-purple-700 font-bold">{chLongs} L</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChapter(ch.id, ch.name);
                            }}
                            title="Delete Chapter"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* STEP 3: TOPIC NUMBER & NAME */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                <h2 className="text-sm font-bold text-slate-900">Topic Number & Topic Name Enter Karein</h2>
              </div>
              <span className="text-[11px] text-indigo-600 font-mono">
                {activeChapter ? `Chapter ${activeChapter.chapterNumber} ke liye` : ''}
              </span>
            </div>

            {/* Question Category: Regular Topic vs Textbook Exercise */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  <span>سوالات کی کیٹگری (Question Category):</span>
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  منتخب کریں کہ یہ مواد عام ٹاپک کا ہے یا درسی کتاب کی مشق (Exercise) کا ہے تاکہ ٹیسٹ بناتے وقت الگ فلٹر ہو سکے۔
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-300 rounded-lg shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setQuestionCategory('topic');
                    if (activeChapter) {
                      const nextIndex = (activeChapterTopics.length || 0) + 1;
                      setTopicNumber(`${activeChapter.chapterNumber || 1}.${nextIndex}`);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    questionCategory === 'topic'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>📘 عام ٹاپک (Topic)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setQuestionCategory('exercise');
                    setTopicNumber('Exercise');
                    if (!topicName || topicName.toLowerCase().includes('topic')) {
                      setTopicName('Official Textbook Exercise');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    questionCategory === 'exercise'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>⭐ درسی مشق (Exercise)</span>
                </button>
              </div>
            </div>

            {questionCategory === 'exercise' && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2 animate-fadeIn">
                <span className="text-base">⭐</span>
                <div>
                  <span className="font-bold">مشقی مواد موڈ ایکٹیو ہے:</span>
                  <span className="ml-1 text-[11px] text-amber-800">
                    یہ سوالات <strong>Exercise (مشقی سوالات)</strong> کے طور پر محفوظ ہوں گے اور ٹیسٹ بناتے وقت آپ مشقی MCQs اور Shorts کو 1-کلک میں شامل یا خارج کر سکیں گے۔
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Topic Number */}
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Topic Number (1.1, 1.2...):
                </label>
                <div className="relative">
                  <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={topicNumber}
                    onChange={(e) => setTopicNumber(e.target.value)}
                    placeholder="e.g. 1.1 ya 1.2"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono font-bold"
                  />
                </div>
              </div>

              {/* Topic Name */}
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Topic Ka Naam (Topic Name):
                </label>
                <input
                  type="text"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g. Physical Quantities and Measurement"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium"
                />
              </div>
            </div>

            {/* Real-time Existing Topic Indicator & Append Mode */}
            {(() => {
              const tNum = (topicNumber || '').trim().toLowerCase();
              const tName = (topicName || '').trim().toLowerCase();
              const existing = activeChapterTopics.find(t => 
                (tNum && t.topicNumber?.toLowerCase() === tNum) || 
                (tName && t.name?.toLowerCase() === tName)
              );

              if (existing) {
                const curM = existing.mcqs?.length || 0;
                const curS = existing.shortQuestions?.length || 0;
                const curL = existing.longQuestions?.length || 0;
                return (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center justify-between gap-2 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <span className="text-base">ℹ️</span>
                      <div>
                        <span className="font-bold">Mojooda Topic Selected: "{existing.topicNumber} - {existing.name}"</span>
                        <p className="text-[11px] text-blue-600 mt-0.5">
                          Is topic mein pehle se <strong>{curM} MCQs</strong>, <strong>{curS} Shorts</strong> mojood hain. Naye questions save karne par purana data delete nahi hoga balkay yeh naye questions bhi sath shamil (Append) ho jayenge!
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-blue-600 text-white font-mono text-[10px] font-bold shrink-0 shadow-xs">
                      Append Mode ON
                    </span>
                  </div>
                );
              }
              return (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <span><strong>Naya Topic Banega:</strong> Yeh topic number aur naam is chapter mein naya banaya jayega.</span>
                </div>
              );
            })()}

            {/* Quick Chips of Existing Topics in this chapter */}
            {activeChapterTopics.length > 0 && (
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 block mb-1">Is Chapter ke pehle se mojood topics (Click karke select karein):</span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                  {activeChapterTopics.map(top => (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => {
                        setTopicNumber(top.topicNumber);
                        setTopicName(top.name);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="text-amber-800 font-mono font-bold bg-amber-50 px-1 rounded border border-amber-200">{top.topicNumber}</span>
                      <span className="truncate max-w-[130px] font-semibold">{top.name}</span>
                      <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-1 py-0.2 rounded border border-cyan-200">{top.mcqs?.length || 0}M</span>
                      <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200">{top.shortQuestions?.length || 0}S</span>
                      <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1 py-0.2 rounded border border-purple-200">{top.longQuestions?.length || 0}L</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* STEP 4: FILE UPLOAD OR DIRECT TEXT PASTE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">4</span>
                <h2 className="text-sm font-bold text-slate-900">Word File Ya Text Upload Karein</h2>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setInputMode('file')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    inputMode === 'file' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Word File (.docx)
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    inputMode === 'paste' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Text Paste
                </button>
              </div>
            </div>

            {/* Target Summary Banner */}
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs flex items-center gap-2 text-indigo-900">
              <span className="font-semibold text-slate-900">Target:</span>
              <span>{selectedClass} Class</span>
              <span>➔</span>
              <span>{currentSubject?.name}</span>
              <span>➔</span>
              <span>Chapter {activeChapter?.chapterNumber || 1}</span>
              <span>➔</span>
              <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Topic {topicNumber || '1.1'}: {topicName || '(Naam Likhien)'}</span>
            </div>

            {/* File Upload Box */}
            {inputMode === 'file' ? (
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50/60 hover:bg-indigo-50/20 rounded-2xl p-6 transition-all cursor-pointer group text-center">
                <input
                  type="file"
                  accept=".docx,.doc,.txt"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileSelection(e.target.files[0]);
                  }}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 group-hover:scale-110 transition-transform flex items-center justify-center mb-3">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {uploadedFile ? uploadedFile.name : "Word (.docx) ya Text (.txt) file select karne ke liye yahan click karein"}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  File mein MCQs, Short Questions aur Long Questions auto detect ho jayenge
                </span>
              </label>
            ) : (
              <div className="space-y-2">
                <textarea
                  rows={6}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Yahan questions paste karein:&#10;1. Which of the following is a base quantity?&#10;(A) Speed (B) Mass (C) Force (D) Work&#10;Answer: B&#10;&#10;Q2. Define inertia with example.&#10;&#10;Q3. State Newton's Second Law of Motion and derive F = ma."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={handlePasteProcess}
                  disabled={!pastedText.trim() || isParsing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm"
                >
                  Extract Questions
                </button>
              </div>
            )}

            {/* Parsing Indicator */}
            {isParsing && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
                <span>Document read karke questions extract kiye ja rahe hain...</span>
              </div>
            )}

            {/* Error Message */}
            {parseError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* QUESTIONS PREVIEW & SAVE BUTTON */}
          {parsedData && (
            <div className="bg-white border border-indigo-300 rounded-2xl p-5 shadow-md space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Detect Shuda Questions Preview</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Neeche questions check karke Bank aur Firebase mein save karein</p>
                </div>

                {/* Preview Tabs */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('mcqs')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      activePreviewTab === 'mcqs' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    MCQs ({parsedData.mcqs?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('shortQuestions')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      activePreviewTab === 'shortQuestions' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Shorts ({parsedData.shortQuestions?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('longQuestions')}
                    className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                      activePreviewTab === 'longQuestions' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Longs ({parsedData.longQuestions?.length || 0})
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div className="max-h-64 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {activePreviewTab === 'mcqs' && (
                  parsedData.mcqs?.length > 0 ? (
                    parsedData.mcqs.map((m, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                        <div className="font-semibold text-slate-800">{idx + 1}. {m.question}</div>
                        <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                          {m.options?.map((opt, oIdx) => (
                            <div key={oIdx} className={m.correctAnswer === ['A','B','C','D'][oIdx] ? 'text-emerald-700 font-bold bg-emerald-50 px-1 rounded' : ''}>
                              ({['A','B','C','D'][oIdx]}) {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : <div className="text-xs text-slate-400 py-3 text-center">Koi MCQs nahi mile.</div>
                )}

                {activePreviewTab === 'shortQuestions' && (
                  parsedData.shortQuestions?.length > 0 ? (
                    parsedData.shortQuestions.map((s, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
                        {idx + 1}. {s.question}
                      </div>
                    ))
                  ) : <div className="text-xs text-slate-400 py-3 text-center">Koi Short Questions nahi mile.</div>
                )}

                {activePreviewTab === 'longQuestions' && (
                  parsedData.longQuestions?.length > 0 ? (
                    parsedData.longQuestions.map((l, idx) => (
                      <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800">
                        {idx + 1}. {l.question}
                      </div>
                    ))
                  ) : <div className="text-xs text-slate-400 py-3 text-center">Koi Long Questions nahi mile.</div>
                )}
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveToBankAndFirebase}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving to Firebase Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4" />
                      <span>
                        {activeChapterTopics.some(t => 
                          (topicNumber && t.topicNumber?.toLowerCase() === topicNumber.trim().toLowerCase()) ||
                          (topicName && t.name?.toLowerCase() === topicName.trim().toLowerCase())
                        ) ? `Mojooda Topic ${topicNumber || ''} Mein Questions Shamil Karein (Append)` : 'Bank aur Firebase Cloud Mein Save Karein'}
                      </span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: PREVIEW OF MATERIAL FOR CURRENT SUBJECT */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{currentSubject?.name || 'Subject'} Ka Majooda Material</span>
                </h3>
                <p className="text-[11px] text-slate-500">{selectedClass} Class</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                {currentChapters.length} Chapters
              </span>
            </div>

            {/* Chapters & Topics List */}
            <div className="mt-4 space-y-3 max-h-[calc(100vh-14rem)] overflow-y-auto custom-scrollbar pr-1">
              {currentChapters.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Is subject mein abhi koi material nahi hai. Upar diye gaye form se pehla Chapter aur Topic upload karein!
                </div>
              ) : (
                currentChapters.map(ch => (
                  <div key={ch.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Chapter {ch.chapterNumber}: {ch.name}</span>
                      <span className="text-[10px] text-slate-500 font-normal">{ch.topics?.length || 0} Topics</span>
                    </div>

                    <div className="space-y-1.5 pl-2 border-l-2 border-indigo-400">
                      {ch.topics?.map(top => {
                        const mCount = top.mcqs?.length || 0;
                        const sCount = top.shortQuestions?.length || 0;
                        const lCount = top.longQuestions?.length || 0;
                        return (
                          <div key={top.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs hover:border-indigo-300 transition-all shadow-2xs">
                            <div>
                              <div className="font-semibold text-slate-800">
                                <span className="text-indigo-600 font-mono mr-1.5">{top.topicNumber}</span>
                                <span>{top.name}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">{mCount} MCQs</span>
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">{sCount} Shorts</span>
                                <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">{lCount} Longs</span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteTopic(ch.id, top.id, top.name)}
                              title="Delete Topic"
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom shortcut to paper maker */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onGoToGenerator}
                className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 rounded-xl text-xs font-bold border border-indigo-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Is Material Se Test Paper Banayein</span>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
