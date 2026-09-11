import React, { useState } from 'react';
import { 
  BookOpen, Plus, Trash2, Download, Upload, Check, 
  HelpCircle, Layers, FileText, ArrowRight, X, Sparkles, AlertCircle, RefreshCw, ChevronDown, ChevronRight
} from 'lucide-react';
import {
  getQuestionBank,
  addSubjectToClass,
  deleteSubjectFromClass,
  addChapterToSubject,
  deleteChapterFromSubject,
  addTopicToChapter,
  deleteTopicFromChapter,
  addQuestionToTopic,
  deleteQuestionFromTopic,
  bulkImportMCQs,
  exportBankJSON,
  importBankJSON,
  saveQuestionBank,
  INITIAL_QUESTION_BANK
} from '../utils/questionBankService';
import FileUploadBankModal from './FileUploadBankModal';
import { notify } from '../utils/notify';
import { confirmAction } from '../utils/confirmDialog';

export default function AdminBankPanel({ 
  selectedClass, 
  setSelectedClass, 
  onClose,
  onBankUpdated 
}) {
  const [bank, setBank] = useState(() => getQuestionBank());
  const [activeSubjectId, setActiveSubjectId] = useState(() => {
    const subs = getQuestionBank()[selectedClass]?.subjects || [];
    return subs[0]?.id || null;
  });

  const [activeChapterId, setActiveChapterId] = useState(null);
  const [activeTopicId, setActiveTopicId] = useState(null);
  const [activeTypeTab, setActiveTypeTab] = useState('mcqs'); // 'mcqs' | 'shortQuestions' | 'longQuestions' | 'bulk'
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);

  // Forms State
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);

  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [newChapterName, setNewChapterName] = useState('');
  const [showAddChapter, setShowAddChapter] = useState(false);

  const [newTopicNumber, setNewTopicNumber] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [showAddTopic, setShowAddTopic] = useState(false);

  // MCQ Form
  const [mcqQuestion, setMcqQuestion] = useState('');
  const [mcqOptA, setMcqOptA] = useState('');
  const [mcqOptB, setMcqOptB] = useState('');
  const [mcqOptC, setMcqOptC] = useState('');
  const [mcqOptD, setMcqOptD] = useState('');
  const [mcqAnswer, setMcqAnswer] = useState('A');
  const [mcqMarks, setMcqMarks] = useState(1);

  // Short Q Form
  const [shortQuestion, setShortQuestion] = useState('');
  const [shortMarks, setShortMarks] = useState(2);

  // Long Q Form
  const [longQuestion, setLongQuestion] = useState('');
  const [longMarks, setLongMarks] = useState(5);

  // Bulk Paste State
  const [bulkText, setBulkText] = useState('');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState('');

  const currentClassData = bank[selectedClass] || { subjects: [] };
  const currentSubject = currentClassData.subjects.find(s => s.id === activeSubjectId) || currentClassData.subjects[0];
  const currentChapters = currentSubject?.chapters || [];
  const currentChapter = currentChapters.find(c => c.id === activeChapterId) || currentChapters[0];
  const currentTopics = currentChapter?.topics || [];
  const currentTopic = currentTopics.find(t => t.id === activeTopicId) || currentTopics[0];

  const updateBankState = (newBank) => {
    setBank(newBank);
    if (onBankUpdated) onBankUpdated(newBank);
  };

  // Add Subject Handler
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const updated = addSubjectToClass(selectedClass, newSubjectName.trim());
    if (updated) {
      updateBankState(updated);
      setNewSubjectName('');
      setShowAddSubject(false);
      const addedSub = updated[selectedClass]?.subjects?.slice(-1)[0];
      if (addedSub) {
        setActiveSubjectId(addedSub.id);
        setActiveChapterId(addedSub.chapters?.[0]?.id || null);
        setActiveTopicId(addedSub.chapters?.[0]?.topics?.[0]?.id || null);
      }
    }
  };

  // Delete Subject Handler
  const handleDeleteSubject = (subId, subName) => {
    confirmAction({
      title: "Delete Subject",
      message: `Are you sure you want to delete subject "${subName}" and all its questions?`,
      confirmText: "Delete Subject",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const updated = deleteSubjectFromClass(selectedClass, subId);
        updateBankState(updated);
        const nextSub = updated[selectedClass]?.subjects[0];
        setActiveSubjectId(nextSub?.id || null);
        setActiveChapterId(nextSub?.chapters?.[0]?.id || null);
        setActiveTopicId(nextSub?.chapters?.[0]?.topics?.[0]?.id || null);
      }
    });
  };

  // Add Chapter Handler
  const handleAddChapter = (e) => {
    e.preventDefault();
    if (!newChapterName.trim() || !currentSubject) return;
    const chNum = newChapterNumber || (currentChapters.length + 1);
    const updated = addChapterToSubject(selectedClass, currentSubject.id, chNum, newChapterName.trim());
    if (updated) {
      updateBankState(updated);
      setNewChapterName('');
      setNewChapterNumber('');
      setShowAddChapter(false);
    }
  };

  // Delete Chapter Handler
  const handleDeleteChapter = (chId, chName) => {
    confirmAction({
      title: "Delete Chapter",
      message: `Delete chapter "${chName}" and all its topics?`,
      confirmText: "Delete Chapter",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const updated = deleteChapterFromSubject(selectedClass, currentSubject.id, chId);
        updateBankState(updated);
        setActiveChapterId(null);
        setActiveTopicId(null);
      }
    });
  };

  // Add Topic Handler
  const handleAddTopic = (e) => {
    e.preventDefault();
    if (!newTopicName.trim() || !currentChapter) return;
    const tNum = newTopicNumber.trim() || `${currentChapter.chapterNumber || 1}.${currentTopics.length + 1}`;
    const res = addTopicToChapter(selectedClass, currentSubject.id, currentChapter.id, tNum, newTopicName.trim());
    if (res && res.bank) {
      updateBankState(res.bank);
      setNewTopicName('');
      setNewTopicNumber('');
      setShowAddTopic(false);
      setActiveTopicId(res.topicId);
    }
  };

  // Delete Topic Handler
  const handleDeleteTopic = (chId, topId, topName) => {
    confirmAction({
      title: "Delete Topic",
      message: `Delete topic "${topName}" and all its questions?`,
      confirmText: "Delete Topic",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        const updated = deleteTopicFromChapter(selectedClass, currentSubject.id, chId, topId);
        updateBankState(updated);
        setActiveTopicId(null);
      }
    });
  };

  // Add MCQ Handler
  const handleAddMcq = (e) => {
    e.preventDefault();
    if (!mcqQuestion.trim() || !currentTopic || !currentChapter) return;
    const updated = addQuestionToTopic(selectedClass, currentSubject.id, currentChapter.id, currentTopic.id, 'mcqs', {
      question: mcqQuestion.trim(),
      options: [mcqOptA.trim() || 'Option A', mcqOptB.trim() || 'Option B', mcqOptC.trim() || 'Option C', mcqOptD.trim() || 'Option D'],
      answer: mcqAnswer,
      marks: mcqMarks
    });
    if (updated) {
      updateBankState(updated);
      setMcqQuestion('');
      setMcqOptA('');
      setMcqOptB('');
      setMcqOptC('');
      setMcqOptD('');
    }
  };

  // Add Short Question Handler
  const handleAddShort = (e) => {
    e.preventDefault();
    if (!shortQuestion.trim() || !currentTopic || !currentChapter) return;
    const updated = addQuestionToTopic(selectedClass, currentSubject.id, currentChapter.id, currentTopic.id, 'shortQuestions', {
      question: shortQuestion.trim(),
      marks: shortMarks
    });
    if (updated) {
      updateBankState(updated);
      setShortQuestion('');
    }
  };

  // Add Long Question Handler
  const handleAddLong = (e) => {
    e.preventDefault();
    if (!longQuestion.trim() || !currentTopic || !currentChapter) return;
    const updated = addQuestionToTopic(selectedClass, currentSubject.id, currentChapter.id, currentTopic.id, 'longQuestions', {
      question: longQuestion.trim(),
      marks: longMarks
    });
    if (updated) {
      updateBankState(updated);
      setLongQuestion('');
    }
  };

  // Delete Question Handler
  const handleDeleteQuestion = (type, qId) => {
    if (!currentTopic || !currentChapter) return;
    const updated = deleteQuestionFromTopic(selectedClass, currentSubject.id, currentChapter.id, currentTopic.id, type, qId);
    if (updated) updateBankState(updated);
  };

  // Bulk Import Handler
  const handleBulkImport = () => {
    if (!bulkText.trim() || !currentTopic) return;
    const res = bulkImportMCQs(selectedClass, currentSubject.id, currentTopic.id, bulkText);
    if (res.success) {
      updateBankState(res.bank);
      notify.success(`Successfully imported ${res.count} MCQs into Topic ${currentTopic.topicNumber}!`);
      setBulkSuccessMsg(`Successfully imported ${res.count} MCQs into Topic ${currentTopic.topicNumber}!`);
      setBulkText('');
      setTimeout(() => setBulkSuccessMsg(''), 4000);
    } else {
      notify.error("Could not parse MCQs. Please verify the format.");
    }
  };

  // Backup & Restore
  const handleRestoreJSON = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = importBankJSON(ev.target?.result);
      if (res.success) {
        updateBankState(res.bank);
        notify.success("Question Bank restored successfully!");
      } else {
        notify.error("Restore failed: " + res.error);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    confirmAction({
      title: "Reset Data to Default",
      message: "Are you sure you want to reset all data to default starter bank? Custom additions will be overwritten.",
      confirmText: "Reset to Default",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        saveQuestionBank(INITIAL_QUESTION_BANK);
        updateBankState(INITIAL_QUESTION_BANK);
      }
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex flex-col">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Admin Question Bank & Material Repository
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Chapters & Numbered Topics
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Organize by Class ➔ Subject ➔ Chapter ➔ Numbered Topics (1.1, 1.2) ➔ MCQs, Short & Long Questions.
              </p>
            </div>
          </div>
        </div>

        {/* Global Utilities */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFileUploadModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>📁 Upload Word / Text File</span>
          </button>

          <button
            type="button"
            onClick={exportBankJSON}
            title="Download full database backup"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            Export Backup JSON
          </button>

          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium cursor-pointer transition-all">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            Restore Backup
            <input type="file" accept=".json" onChange={handleRestoreJSON} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleResetDefaults}
            title="Restore original sample data"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border border-slate-700 rounded-lg text-xs transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all ml-2 cursor-pointer"
          >
            <span>Go to Paper Canvas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Class Switcher Pills */}
      <div className="pt-6 pb-4">
        <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">
          Select Target Class:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {["9th", "10th", "11th", "12th"].map(cls => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                const firstSub = bank[cls]?.subjects[0];
                setActiveSubjectId(firstSub?.id || null);
                setActiveChapterId(firstSub?.chapters?.[0]?.id || null);
                setActiveTopicId(firstSub?.chapters?.[0]?.topics?.[0]?.id || null);
              }}
              className={`py-3 px-4 rounded-xl font-bold text-sm sm:text-base transition-all flex items-center justify-between border cursor-pointer ${
                selectedClass === cls
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-400/50 shadow-lg shadow-indigo-600/25 ring-2 ring-indigo-400/20'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{cls} Class</span>
              <span className={`text-xs px-2 py-0.5 rounded-md ${selectedClass === cls ? 'bg-black/20 text-white' : 'bg-slate-700 text-slate-400'}`}>
                {bank[cls]?.subjects?.length || 0} Subs
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Column Working Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 flex-1">
        
        {/* Column 1: Subjects (3 cols) */}
        <div className="lg:col-span-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
            <span className="text-sm font-semibold text-slate-200">
              Subjects ({currentClassData.subjects.length})
            </span>
            <button
              type="button"
              onClick={() => setShowAddSubject(true)}
              className="flex items-center gap-1 text-xs px-2.5 py-1 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Subject
            </button>
          </div>

          {/* Add Subject Inline Form */}
          {showAddSubject && (
            <form onSubmit={handleAddSubject} className="mb-3 p-3 bg-slate-900/90 rounded-xl border border-indigo-500/40">
              <label className="text-xs text-slate-300 font-medium block mb-1">Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Urdu, Biology, Statistics"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white mb-2 focus:outline-none focus:border-indigo-500"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubject(false)}
                  className="px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md"
                >
                  Save
                </button>
              </div>
            </form>
          )}

          {/* Subject List */}
          <div className="space-y-1.5 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
            {currentClassData.subjects.map(sub => {
              const chCount = sub.chapters?.length || 0;
              const isSelected = (currentSubject?.id === sub.id);

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setActiveSubjectId(sub.id);
                    setActiveChapterId(sub.chapters?.[0]?.id || null);
                    setActiveTopicId(sub.chapters?.[0]?.topics?.[0]?.id || null);
                  }}
                  className={`p-3 rounded-xl cursor-pointer border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-white shadow-sm'
                      : 'bg-slate-800/40 border-slate-700/40 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs sm:text-sm">{sub.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {chCount} Chapters
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSubject(sub.id, sub.name);
                    }}
                    title="Delete Subject"
                    className="p-1 hover:text-rose-400 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 2: Chapters & Numbered Topics Tree (4 cols) */}
        <div className="lg:col-span-4 bg-slate-800/60 rounded-2xl border border-slate-700/60 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 mb-3">
            <div>
              <span className="text-sm font-semibold text-slate-200">
                Chapters & Topics
              </span>
              <div className="text-[11px] text-indigo-400 font-semibold">
                {currentSubject?.name || 'Select a subject'}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowAddChapter(true)}
                className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded-lg border border-slate-700 font-medium"
              >
                + Chapter
              </button>
              {currentChapter && (
                <button
                  type="button"
                  onClick={() => setShowAddTopic(true)}
                  className="text-[11px] px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium"
                >
                  + Topic
                </button>
              )}
            </div>
          </div>

          {/* Add Chapter Form */}
          {showAddChapter && (
            <form onSubmit={handleAddChapter} className="mb-3 p-3 bg-slate-900/90 rounded-xl border border-indigo-500/40 space-y-2">
              <span className="text-xs text-slate-300 font-bold block">+ Add New Chapter</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Ch #"
                  value={newChapterNumber}
                  onChange={(e) => setNewChapterNumber(e.target.value)}
                  className="w-16 text-xs px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-center focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Chapter Name (e.g. Kinematics)"
                  value={newChapterName}
                  onChange={(e) => setNewChapterName(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddChapter(false)}
                  className="px-2 py-1 text-[11px] text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md"
                >
                  Save Chapter
                </button>
              </div>
            </form>
          )}

          {/* Add Topic Form */}
          {showAddTopic && (
            <form onSubmit={handleAddTopic} className="mb-3 p-3 bg-slate-900/90 rounded-xl border border-indigo-500/40 space-y-2">
              <span className="text-xs text-slate-300 font-bold block">
                + Add Topic to Chapter {currentChapter?.chapterNumber}
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 1.1"
                  value={newTopicNumber}
                  onChange={(e) => setNewTopicNumber(e.target.value)}
                  className="w-20 text-xs px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-amber-300 font-bold text-center focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Topic Title (e.g. Physical Quantities)"
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopic(false)}
                  className="px-2 py-1 text-[11px] text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md"
                >
                  Save Topic
                </button>
              </div>
            </form>
          )}

          {/* Chapters & Topics Tree */}
          <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
            {currentChapters.map(ch => {
              const isChActive = (currentChapter?.id === ch.id);
              const chTopics = ch.topics || [];

              return (
                <div key={ch.id} className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                  <div
                    onClick={() => {
                      setActiveChapterId(ch.id);
                      if (chTopics.length > 0) setActiveTopicId(chTopics[0].id);
                    }}
                    className={`p-2.5 flex items-center justify-between cursor-pointer transition-all ${
                      isChActive ? 'bg-slate-800/90 text-white font-bold' : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-amber-400 text-xs font-extrabold">Ch {ch.chapterNumber}:</span>
                      <span className="text-xs line-clamp-1">{ch.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {chTopics.length}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChapter(ch.id, ch.name);
                        }}
                        className="p-1 hover:text-rose-400 text-slate-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Topic Items in Chapter */}
                  <div className="p-1.5 space-y-1 bg-slate-950/40">
                    {chTopics.map(top => {
                      const isTopActive = (currentTopic?.id === top.id);
                      const qCount = (top.mcqs?.length || 0) + (top.shortQuestions?.length || 0) + (top.longQuestions?.length || 0);

                      return (
                        <div
                          key={top.id}
                          onClick={() => {
                            setActiveChapterId(ch.id);
                            setActiveTopicId(top.id);
                          }}
                          className={`p-2 rounded-lg cursor-pointer transition-all flex items-center justify-between border text-xs group ${
                            isTopActive
                              ? 'bg-indigo-600/25 border-indigo-500 text-white font-semibold'
                              : 'bg-slate-900/30 border-slate-800/80 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="text-amber-300 font-bold shrink-0">{top.topicNumber}</span>
                            <span className="line-clamp-1">{top.name}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">({qCount})</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTopic(ch.id, top.id, top.name);
                              }}
                              className="p-0.5 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Question Editor & Questions in Topic (5 cols) */}
        <div className="lg:col-span-5 bg-slate-800/60 rounded-2xl border border-slate-700/60 p-4 sm:p-5 flex flex-col">
          {currentTopic ? (
            <>
              <div className="pb-3 border-b border-slate-700/60 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span>{currentSubject?.name}</span>
                    <span>•</span>
                    <span>Topic {currentTopic.topicNumber}</span>
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-1">{currentTopic.name}</h3>
                </div>

                {/* Sub Tabs: MCQs | Short | Long | Bulk */}
                <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-700/80">
                  <button
                    onClick={() => setActiveTypeTab('mcqs')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeTypeTab === 'mcqs' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    MCQs ({currentTopic.mcqs?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTypeTab('shortQuestions')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeTypeTab === 'shortQuestions' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Short ({currentTopic.shortQuestions?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTypeTab('longQuestions')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeTypeTab === 'longQuestions' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Long ({currentTopic.longQuestions?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTypeTab('bulk')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeTypeTab === 'bulk' ? 'bg-emerald-600 text-white shadow' : 'text-emerald-400 hover:text-white'
                    }`}
                  >
                    ⚡ Bulk
                  </button>
                </div>
              </div>

              {/* MCQs TAB */}
              {activeTypeTab === 'mcqs' && (
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* Add MCQ Form */}
                  <form onSubmit={handleAddMcq} className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/70 space-y-3">
                    <div className="font-semibold text-xs text-indigo-300 flex items-center justify-between">
                      <span>+ Add MCQ into Topic {currentTopic.topicNumber}</span>
                      <span className="text-[11px] text-slate-400">Use "||" for Urdu: (English || اردو)</span>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Question prompt..."
                      value={mcqQuestion}
                      onChange={(e) => setMcqQuestion(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      required
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Option (A)"
                        value={mcqOptA}
                        onChange={(e) => setMcqOptA(e.target.value)}
                        className="text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Option (B)"
                        value={mcqOptB}
                        onChange={(e) => setMcqOptB(e.target.value)}
                        className="text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Option (C)"
                        value={mcqOptC}
                        onChange={(e) => setMcqOptC(e.target.value)}
                        className="text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Option (D)"
                        value={mcqOptD}
                        onChange={(e) => setMcqOptD(e.target.value)}
                        className="text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white"
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                          Correct:
                          <select
                            value={mcqAnswer}
                            onChange={(e) => setMcqAnswer(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-amber-300 font-bold"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </label>

                        <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                          Marks:
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={mcqMarks}
                            onChange={(e) => setMcqMarks(e.target.value)}
                            className="w-12 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-white text-center"
                          />
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md"
                      >
                        Save MCQ
                      </button>
                    </div>
                  </form>

                  {/* List Existing MCQs */}
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1 flex-1 custom-scrollbar">
                    {(currentTopic.mcqs || []).map((q, idx) => (
                      <div key={q.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs flex justify-between gap-3 group">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-200">
                            <span className="text-indigo-400 font-bold mr-1.5">{idx + 1}.</span>
                            {q.question}
                          </div>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-slate-400 pt-1">
                            {q.options?.map((opt, oIdx) => {
                              const letter = String.fromCharCode(65 + oIdx);
                              const isCorrect = (q.answer === letter);
                              return (
                                <span key={oIdx} className={isCorrect ? 'text-emerald-400 font-bold' : ''}>
                                  ({letter}) {opt} {isCorrect && '✓'}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion('mcqs', q.id)}
                          className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity self-start"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {(currentTopic.mcqs?.length || 0) === 0 && (
                      <div className="text-center py-6 text-xs text-slate-500">
                        No MCQs yet in Topic {currentTopic.topicNumber}. Add above, or click "📁 Upload Word / Text File"!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SHORT QUESTIONS TAB */}
              {activeTypeTab === 'shortQuestions' && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <form onSubmit={handleAddShort} className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/70 space-y-3">
                    <div className="font-semibold text-xs text-indigo-300">
                      + Add Short Question into Topic {currentTopic.topicNumber}
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Short question prompt..."
                      value={shortQuestion}
                      onChange={(e) => setShortQuestion(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      required
                    />

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                        Marks:
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={shortMarks}
                          onChange={(e) => setShortMarks(e.target.value)}
                          className="w-16 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-white text-center"
                        />
                      </label>

                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md"
                      >
                        Save Short Question
                      </button>
                    </div>
                  </form>

                  {/* List Existing Short Qs */}
                  <div className="space-y-2 overflow-y-auto max-h-[320px] pr-1 flex-1 custom-scrollbar">
                    {(currentTopic.shortQuestions || []).map((q, idx) => (
                      <div key={q.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs flex justify-between gap-3 group">
                        <div>
                          <span className="text-indigo-400 font-bold mr-1.5">Q{idx + 1}.</span>
                          <span className="text-slate-200">{q.question}</span>
                          <span className="ml-2 text-[10px] text-amber-400 font-semibold">({q.marks} Marks)</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion('shortQuestions', q.id)}
                          className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {(currentTopic.shortQuestions?.length || 0) === 0 && (
                      <div className="text-center py-6 text-xs text-slate-500">
                        No short questions yet in Topic {currentTopic.topicNumber}.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LONG QUESTIONS TAB */}
              {activeTypeTab === 'longQuestions' && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <form onSubmit={handleAddLong} className="bg-slate-900/70 p-4 rounded-xl border border-slate-700/70 space-y-3">
                    <div className="font-semibold text-xs text-indigo-300">
                      + Add Long Question into Topic {currentTopic.topicNumber}
                    </div>

                    <textarea
                      rows={3}
                      placeholder="Detailed question prompt..."
                      value={longQuestion}
                      onChange={(e) => setLongQuestion(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                      required
                    />

                    <div className="flex items-center justify-between">
                      <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                        Marks:
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={longMarks}
                          onChange={(e) => setLongMarks(e.target.value)}
                          className="w-16 bg-slate-800 border border-slate-700 rounded-md px-2 py-1 text-xs text-white text-center"
                        />
                      </label>

                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md"
                      >
                        Save Long Question
                      </button>
                    </div>
                  </form>

                  {/* List Existing Long Qs */}
                  <div className="space-y-2 overflow-y-auto max-h-[320px] pr-1 flex-1 custom-scrollbar">
                    {(currentTopic.longQuestions || []).map((q, idx) => (
                      <div key={q.id} className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 text-xs flex justify-between gap-3 group">
                        <div>
                          <span className="text-indigo-400 font-bold mr-1.5">Q{idx + 1}.</span>
                          <span className="text-slate-200">{q.question}</span>
                          <span className="ml-2 text-[10px] text-amber-400 font-semibold">({q.marks} Marks)</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion('longQuestions', q.id)}
                          className="text-slate-600 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {(currentTopic.longQuestions?.length || 0) === 0 && (
                      <div className="text-center py-6 text-xs text-slate-500">
                        No long questions yet in Topic {currentTopic.topicNumber}.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* BULK PASTE TAB */}
              {activeTypeTab === 'bulk' && (
                <div className="space-y-4 flex-1 flex flex-col">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300">
                    <p className="font-semibold mb-1">⚡ Paste MCQs into Topic {currentTopic.topicNumber}:</p>
                    <pre className="mt-1 p-2 bg-slate-950 rounded text-[10px] text-slate-400 font-mono">
{`1. What is SI unit of force?
(A) Newton (B) Joule (C) Pascal (D) Watt
Ans: A`}
                    </pre>
                  </div>

                  {bulkSuccessMsg && (
                    <div className="p-2.5 bg-emerald-600/20 border border-emerald-500 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      {bulkSuccessMsg}
                    </div>
                  )}

                  <textarea
                    rows={8}
                    placeholder="Paste MCQs here..."
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 flex-1"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setBulkText('')}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkImport}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Import into Topic {currentTopic.topicNumber}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-500">
              <Layers className="w-12 h-12 stroke-[1.5] mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-400">
                Select or Add a Chapter & Topic on the left to view and add questions.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* File Upload Modal */}
      <FileUploadBankModal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        initialClass={selectedClass}
        initialSubjectId={activeSubjectId}
        onQuestionsImported={(updatedBank) => {
          updateBankState(updatedBank);
        }}
      />

    </div>
  );
}
