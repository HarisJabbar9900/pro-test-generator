import React, { useState } from 'react';
import { 
  UploadCloud, FileText, CheckCircle2, AlertCircle, X, 
  Layers, BookOpen, Sparkles, Check, ChevronRight, HelpCircle, Hash, Cloud
} from 'lucide-react';
import { extractTextFromFile, parseDocumentIntoQuestions } from '../utils/docParser';
import { 
  getQuestionBank, 
  addChapterToSubject,
  addTopicToChapter, 
  importParsedQuestionsToTopic 
} from '../utils/questionBankService';
import { 
  saveUploadedMaterialToFirebase, 
  syncBankToFirebase 
} from '../utils/firebaseBankService';
import { notify } from '../utils/notify';

export default function FileUploadBankModal({ 
  isOpen, 
  onClose, 
  initialClass = "9th",
  initialSubjectId = null,
  onQuestionsImported 
}) {
  const [bank, setBank] = useState(() => getQuestionBank());
  const [selectedClass, setSelectedClass] = useState(initialClass);
  const [selectedSubjectId, setSelectedSubjectId] = useState(initialSubjectId);
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [isCreatingNewChapter, setIsCreatingNewChapter] = useState(false);
  const [newChapterNumber, setNewChapterNumber] = useState('');
  const [newChapterName, setNewChapterName] = useState('');

  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [topicNumber, setTopicNumber] = useState('1.1');
  const [topicName, setTopicName] = useState('');

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [activePreviewTab, setActivePreviewTab] = useState('mcqs');

  const currentClassData = bank[selectedClass] || { subjects: [] };
  const currentSubject = currentClassData.subjects.find(s => s.id === selectedSubjectId) || currentClassData.subjects[0];
  const currentChapters = currentSubject?.chapters || [];
  const currentChapter = currentChapters.find(c => c.id === selectedChapterId) || currentChapters[0];
  const currentTopics = currentChapter?.topics || [];

  // Handle Class Change
  const handleClassChange = (cls) => {
    setSelectedClass(cls);
    const firstSub = bank[cls]?.subjects[0];
    setSelectedSubjectId(firstSub?.id || '');
    setIsCreatingNewChapter(false);
    const firstCh = firstSub?.chapters?.[0];
    setSelectedChapterId(firstCh?.id || '');
    setSelectedTopicId('');
    setTopicNumber(firstCh ? `${firstCh.chapterNumber}.1` : '1.1');
    setTopicName('');
  };

  // Handle File Selection
  const handleFileSelection = async (file) => {
    if (!file) return;
    setUploadedFile(file);
    setIsParsing(true);
    setParseError('');
    setSuccessMessage('');
    setParsedData(null);

    try {
      const extractedText = await extractTextFromFile(file);
      if (!extractedText || extractedText.trim().length < 15) {
        throw new Error("Could not extract readable text from this file. Please make sure the document is not password-protected.");
      }

      const parsed = parseDocumentIntoQuestions(extractedText);
      const totalFound = (parsed.mcqs?.length || 0) + (parsed.shortQuestions?.length || 0) + (parsed.longQuestions?.length || 0);

      if (totalFound === 0) {
        throw new Error("No questions could be detected. Please ensure questions are numbered (e.g. 1. What is..., Q2:, etc.) and MCQs have options (A), (B), (C), (D).");
      }

      setParsedData(parsed);

      // Suggest topic name from filename if empty
      if (!topicName) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTopicName(cleanName);
      }

    } catch (err) {
      console.error("File parsing error:", err);
      setParseError(err.message || "Failed to parse document.");
    } finally {
      setIsParsing(false);
    }
  };

  // Save to Question Bank
  const handleSaveToBank = () => {
    if (!currentSubject) {
      notify.error("Please select a subject first.");
      return;
    }

    let targetChapterId = selectedChapterId || currentChapter?.id;

    // Create Chapter if needed
    if (isCreatingNewChapter || !targetChapterId || currentChapters.length === 0) {
      const chNum = parseInt(newChapterNumber) || (currentChapters.length + 1);
      const chName = newChapterName.trim() || `Chapter ${chNum}`;
      const updated = addChapterToSubject(selectedClass, currentSubject.id, chNum, chName);
      if (updated) {
        setBank(updated);
        const addedCh = updated[selectedClass]?.subjects?.find(s => s.id === currentSubject.id)?.chapters?.slice(-1)[0];
        targetChapterId = addedCh?.id;
      }
    }

    if (!targetChapterId) {
      notify.error("Please select or create a chapter first.");
      return;
    }

    const tNum = (topicNumber || "1.1").trim();
    const tName = (topicName || uploadedFile?.name?.replace(/\.[^/.]+$/, "") || `Topic ${tNum}`).trim();

    // Check if topic exists in target chapter
    const currentSubjectObj = bank[selectedClass]?.subjects?.find(s => s.id === currentSubject.id);
    const targetChapter = currentSubjectObj?.chapters?.find(c => c.id === targetChapterId);

    const existingTopic = targetChapter?.topics?.find(t => 
      (selectedTopicId && t.id === selectedTopicId) ||
      t.topicNumber?.toLowerCase() === tNum.toLowerCase() ||
      t.name?.toLowerCase() === tName.toLowerCase()
    );

    let targetTopicId = existingTopic ? existingTopic.id : null;

    if (!targetTopicId) {
      // Create new topic with the specified number and name
      const res = addTopicToChapter(selectedClass, currentSubject.id, targetChapterId, tNum, tName);
      if (res && res.topicId) {
        setBank(res.bank);
        targetTopicId = res.topicId;
      }
    }

    if (!targetTopicId) {
      notify.error("Target topic could not be resolved.");
      return;
    }

    const res = importParsedQuestionsToTopic(selectedClass, currentSubject.id, targetChapterId, targetTopicId, parsedData);

    if (res.success) {
      notify.success(`Saved ${res.counts.mcqs} MCQs, ${res.counts.shortQuestions} Short, and ${res.counts.longQuestions} Long questions!`, {
        description: "Synced to Firebase Cloud."
      });
      
      // Save entire bank & individual uploaded document to Firebase Cloud Firestore
      saveUploadedMaterialToFirebase({
        fileName: uploadedFile?.name,
        gradeClass: selectedClass,
        subjectName: currentSubject.name,
        chapterName: targetChapter?.name || `Chapter ${targetChapterId}`,
        topicNumber: tNum,
        topicName: tName,
        parsedData
      }).catch(e => console.warn("Firebase upload doc warning:", e));

      syncBankToFirebase(res.bank)
        .then(() => {
          // background sync ok
        })
        .catch(() => {});

      if (onQuestionsImported) {
        onQuestionsImported(res.bank);
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      notify.error("Failed to save: " + res.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Upload Word / Text File to Specific Topic
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Topic Number (1.1, 1.2)
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Cloud className="w-3 h-3 text-amber-400" />
                  Firebase Cloud Sync
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Choose Class ➔ Subject ➔ Chapter ➔ Topic (Number & Name) to upload MCQs, Short & Long questions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
          
          {/* Step 1: Destination Selection Hierarchy */}
          <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 space-y-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              1. Destination: Class, Subject, Chapter & Numbered Topic
            </div>

            {/* 1.1 Class Selection */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold w-24">Class:</span>
              <div className="grid grid-cols-4 gap-2 flex-1">
                {["9th", "10th", "11th", "12th"].map(cls => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => handleClassChange(cls)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      selectedClass === cls
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                    }`}
                  >
                    {cls} Class
                  </button>
                ))}
              </div>
            </div>

            {/* 1.2 Subject Selection (Name Only) */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold w-24">Subject:</span>
              <select
                value={currentSubject?.id || ''}
                onChange={(e) => {
                  const newSubId = e.target.value;
                  setSelectedSubjectId(newSubId);
                  setIsCreatingNewChapter(false);
                  const sub = currentClassData.subjects.find(s => s.id === newSubId);
                  const firstCh = sub?.chapters?.[0];
                  setSelectedChapterId(firstCh?.id || '');
                  setSelectedTopicId('');
                  setTopicNumber(firstCh ? `${firstCh.chapterNumber}.${(firstCh.topics?.length || 0) + 1}` : '1.1');
                  setTopicName('');
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
              >
                {currentClassData.subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 1.3 Chapter Selection (Shows chapters for selected subject) */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-semibold w-24">Chapter:</span>
                <div className="flex-1 flex gap-2">
                  <select
                    value={isCreatingNewChapter ? '__new__' : (currentChapter?.id || '')}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setIsCreatingNewChapter(true);
                        setNewChapterNumber(currentChapters.length + 1);
                        setNewChapterName('');
                      } else {
                        setIsCreatingNewChapter(false);
                        setSelectedChapterId(e.target.value);
                        const ch = currentChapters.find(c => c.id === e.target.value);
                        if (ch) {
                          const nextNum = `${ch.chapterNumber}.${(ch.topics?.length || 0) + 1}`;
                          setTopicNumber(nextNum);
                          setTopicName('');
                          setSelectedTopicId('');
                        }
                      }
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  >
                    {currentChapters.length === 0 ? (
                      <option value="__new__">+ No chapters - Click to Add Chapter</option>
                    ) : (
                      currentChapters.map(ch => (
                        <option key={ch.id} value={ch.id}>
                          Chapter {ch.chapterNumber}: {ch.name}
                        </option>
                      ))
                    )}
                    {currentChapters.length > 0 && (
                      <option value="__new__">+ Add New Chapter...</option>
                    )}
                  </select>

                  {!isCreatingNewChapter && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewChapter(true);
                        setNewChapterNumber(currentChapters.length + 1);
                        setNewChapterName('');
                      }}
                      className="px-2.5 py-1.5 text-xs bg-slate-800 hover:bg-slate-750 text-indigo-300 font-medium rounded-lg border border-slate-700 whitespace-nowrap"
                    >
                      + New Chapter
                    </button>
                  )}
                </div>
              </div>

              {/* Inline input if adding new chapter */}
              {isCreatingNewChapter && (
                <div className="flex items-center gap-2 pl-27 pt-1">
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-indigo-500/60 rounded-lg px-2 py-1.5 w-24">
                    <span className="text-[10px] text-indigo-400 font-bold">Ch #</span>
                    <input
                      type="number"
                      placeholder="1"
                      value={newChapterNumber}
                      onChange={(e) => setNewChapterNumber(e.target.value)}
                      className="w-full bg-transparent text-xs text-white font-bold text-center focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="New Chapter Title (e.g. Dynamics, Kinematics...)"
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    className="flex-1 bg-slate-900 border border-indigo-500/60 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewChapter(false)}
                    className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg bg-slate-800"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* 1.4 Topic: Direct Topic Number (e.g. 1.1) and Topic Name Inputs */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-semibold w-24">Topic:</span>
                <div className="flex-1 flex gap-2">
                  <div className="w-24 relative flex items-center">
                    <span className="absolute left-2.5 text-indigo-400 text-xs font-bold">#</span>
                    <input
                      type="text"
                      placeholder="1.1"
                      value={topicNumber}
                      onChange={(e) => {
                        setTopicNumber(e.target.value);
                        setSelectedTopicId('');
                      }}
                      className="w-full pl-6 pr-2 bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg py-2 text-xs text-amber-300 font-bold focus:outline-none"
                      title="Topic Number (e.g. 1.1, 1.2, 2.1)"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Topic Name (e.g. Introduction to Physics, Velocity...)"
                    value={topicName}
                    onChange={(e) => {
                      setTopicName(e.target.value);
                      setSelectedTopicId('');
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-white focus:outline-none font-medium"
                  />
                </div>
              </div>

              {/* Optional selector to auto-fill an existing topic from this chapter */}
              {currentTopics.length > 0 && (
                <div className="flex items-center gap-2 pl-27 text-[11px] text-slate-400">
                  <span className="text-slate-500">یا پہلے سے موجود ٹاپک چنیں:</span>
                  <select
                    value={selectedTopicId || ''}
                    onChange={(e) => {
                      const tid = e.target.value;
                      setSelectedTopicId(tid);
                      const found = currentTopics.find(t => t.id === tid);
                      if (found) {
                        setTopicNumber(found.topicNumber);
                        setTopicName(found.name);
                      }
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs text-indigo-300 focus:outline-none max-w-[280px] truncate"
                  >
                    <option value="">-- Choose Existing Topic --</option>
                    {currentTopics.map(t => (
                      <option key={t.id} value={t.id}>
                        Topic {t.topicNumber}: {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Upload Word (.docx) or Text (.txt) File */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              2. Select Word (.docx) or Text (.txt) File
            </div>

            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileSelection(e.dataTransfer.files[0]);
                }
              }}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-850/50 hover:bg-slate-800/60 rounded-2xl cursor-pointer transition-all text-center group"
            >
              <input
                type="file"
                accept=".docx,.doc,.txt,.pdf"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileSelection(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 group-hover:bg-indigo-600/20 group-hover:scale-110 transition-all flex items-center justify-center mb-3">
                <FileText className="w-6 h-6" />
              </div>

              <span className="text-sm font-semibold text-slate-200">
                {uploadedFile ? uploadedFile.name : "Click to select or drop Word (.docx) / Text (.txt) file here"}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                The parser will automatically detect MCQs, Short Questions, and Long Questions
              </span>
            </label>

            {isParsing && (
              <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-blue-400" />
                <span>Reading document & extracting questions for Topic {topicNumber || ''}...</span>
              </div>
            )}

            {parseError && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-emerald-950/50 border border-emerald-500 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
            )}
          </div>

          {/* Step 3: Parsed Questions Live Preview */}
          {parsedData && (
            <div className="space-y-3 bg-slate-850 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Questions Extracted for this Topic</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                      {(parsedData.mcqs?.length || 0) + (parsedData.shortQuestions?.length || 0) + (parsedData.longQuestions?.length || 0)} Total
                    </span>
                  </div>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('mcqs')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      activePreviewTab === 'mcqs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    MCQs ({parsedData.mcqs?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('short')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      activePreviewTab === 'short' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Short ({parsedData.shortQuestions?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewTab('long')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                      activePreviewTab === 'long' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Long ({parsedData.longQuestions?.length || 0})
                  </button>
                </div>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
                {activePreviewTab === 'mcqs' && (
                  parsedData.mcqs?.map((m, idx) => (
                    <div key={m.id} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
                      <div className="font-semibold text-slate-200">
                        <span className="text-indigo-400 mr-1">{idx + 1}.</span> {m.question}
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 mt-1">
                        {m.options?.map((opt, oIdx) => {
                          const letter = String.fromCharCode(65 + oIdx);
                          const isAns = m.answer === letter;
                          return (
                            <span key={oIdx} className={isAns ? 'text-emerald-400 font-bold' : ''}>
                              ({letter}) {opt} {isAns && '✓'}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}

                {activePreviewTab === 'short' && (
                  parsedData.shortQuestions?.map((s, idx) => (
                    <div key={s.id} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between">
                      <span className="text-slate-200">
                        <span className="text-indigo-400 mr-1">Q{idx + 1}.</span> {s.question}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">{s.marks} Marks</span>
                    </div>
                  ))
                )}

                {activePreviewTab === 'long' && (
                  parsedData.longQuestions?.map((l, idx) => (
                    <div key={l.id} className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 flex justify-between">
                      <span className="text-slate-200">
                        <span className="text-indigo-400 mr-1">Q{idx + 1}.</span> {l.question}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">{l.marks} Marks</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-all"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveToBank}
            disabled={!parsedData || isParsing}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            <span>Save to Topic {topicNumber || ''} ({currentSubject?.name})</span>
          </button>
        </div>

      </div>
    </div>
  );
}
