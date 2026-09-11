import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRight, Search, CheckSquare, Square, 
  RefreshCw, FileText, Layers, BookOpen, CheckCircle2, ChevronRight, Edit3,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { notify } from '../utils/notify';
import { computeSyllabusText } from '../utils/syllabusHelper';
import { isExerciseQuestion } from '../utils/questionBankService';

export default function PTMTopicSelectionView({
  selectedCourse = "PECTAA",
  selectedClass = "9th",
  currentSubject,
  currentChapters = [],
  selectedTopicIds = [],
  setSelectedTopicIds,
  onGeneratePaper,
  onBackToSubjects,
  onBackToClasses,
  initialStage = 'topics' // 'topics' | 'criteria'
}) {
  // Stage state to separate Chapter/Topic selection from Question Criteria
  const [stage, setStage] = useState(initialStage);

  // Filter bar states matching exact CTM screenshot
  const [questionType, setQuestionType] = useState('ALL');
  const [requiredQuestions, setRequiredQuestions] = useState(10);
  const [eachQuestionMarks, setEachQuestionMarks] = useState(1);
  const [mediumType, setMediumType] = useState('ENGLISH');
  const [choiceCount, setChoiceCount] = useState(0);
  const [blankLinesType, setBlankLinesType] = useState('None');
  const [showChapterNameOnPaper, setShowChapterNameOnPaper] = useState(false);

  // Data Selection Popover State with separate Exercise MCQs & Short Questions
  const [showDataSelectionDropdown, setShowDataSelectionDropdown] = useState(false);
  const [dataSelectionCategories, setDataSelectionCategories] = useState({
    exerciseMcqs: true,
    exerciseShorts: true,
    topicMcqs: true,
    topicShorts: true,
    pastPapers: true,
    additional: true,
    conceptual: true
  });

  const isAllCategoriesSelected = Object.values(dataSelectionCategories).every(Boolean);

  const toggleSelectAllCategories = () => {
    const nextVal = !isAllCategoriesSelected;
    setDataSelectionCategories({
      exerciseMcqs: nextVal,
      exerciseShorts: nextVal,
      topicMcqs: nextVal,
      topicShorts: nextVal,
      pastPapers: nextVal,
      additional: nextVal,
      conceptual: nextVal
    });
  };

  const toggleCategory = (catKey) => {
    setDataSelectionCategories(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  // Collapsible / folding chapters state to save vertical space
  const [collapsedChapterIds, setCollapsedChapterIds] = useState(() => new Set());

  const toggleChapterFold = (chId) => {
    setCollapsedChapterIds(prev => {
      const next = new Set(prev);
      if (next.has(chId)) {
        next.delete(chId);
      } else {
        next.add(chId);
      }
      return next;
    });
  };

  const allChaptersCollapsed = currentChapters.length > 0 && currentChapters.every(ch => collapsedChapterIds.has(ch.id));

  const toggleAllChaptersFold = () => {
    if (allChaptersCollapsed) {
      setCollapsedChapterIds(new Set()); // Expand all
    } else {
      setCollapsedChapterIds(new Set(currentChapters.map(ch => ch.id))); // Collapse all
    }
  };

  // Helper to ensure each topic always has a solid unique ID even if legacy data omitted it
  const getTopicIdentifier = (ch, t) => t.id || `${ch.id}-topic-${t.topicNumber || t.name}`;

  // Total topics
  const allTopicIds = useMemo(() => {
    const ids = [];
    currentChapters.forEach(ch => {
      (ch.topics || []).forEach(t => ids.push(getTopicIdentifier(ch, t)));
    });
    return ids;
  }, [currentChapters]);

  const isAllSelected = allTopicIds.length > 0 && selectedTopicIds.length === allTopicIds.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTopicIds([]);
    } else {
      setSelectedTopicIds([...allTopicIds]);
    }
  };

  const handleToggleChapter = (chapter) => {
    const chTopicIds = (chapter.topics || []).map(t => getTopicIdentifier(chapter, t));
    const areAllChSelected = chTopicIds.length > 0 && chTopicIds.every(id => selectedTopicIds.includes(id));

    if (areAllChSelected) {
      setSelectedTopicIds(prev => prev.filter(id => !chTopicIds.includes(id)));
    } else {
      const merged = new Set([...selectedTopicIds, ...chTopicIds]);
      setSelectedTopicIds(Array.from(merged));
    }
  };

  const handleToggleTopic = (topicId) => {
    if (!topicId) return;
    if (selectedTopicIds.includes(topicId)) {
      setSelectedTopicIds(prev => prev.filter(id => id !== topicId));
    } else {
      setSelectedTopicIds(prev => [...prev, topicId]);
    }
  };

  // Count available questions across selected topics honoring Exercise & Topic filters
  const availableQuestions = useMemo(() => {
    let m = 0, s = 0, l = 0;
    const incExMcq = dataSelectionCategories.exerciseMcqs !== false;
    const incExShort = dataSelectionCategories.exerciseShorts !== false;
    const incTopMcq = dataSelectionCategories.topicMcqs !== false;
    const incTopShort = dataSelectionCategories.topicShorts !== false;

    currentChapters.forEach(ch => {
      (ch.topics || []).forEach(t => {
        const tid = getTopicIdentifier(ch, t);
        if (selectedTopicIds.includes(tid)) {
          (t.mcqs || []).forEach(q => {
            const isEx = isExerciseQuestion(q, t);
            if (isEx && !incExMcq) return;
            if (!isEx && !incTopMcq) return;
            m++;
          });
          (t.shortQuestions || []).forEach(q => {
            const isEx = isExerciseQuestion(q, t);
            if (isEx && !incExShort) return;
            if (!isEx && !incTopShort) return;
            s++;
          });
          l += (t.longQuestions?.length || 0);
        }
      });
    });
    const typeTotal = questionType === 'MCQ' ? m : questionType === 'SHORT' ? s : questionType === 'LONG' ? l : (m + s + l);
    return { mcqs: m, shorts: s, longs: l, total: typeTotal };
  }, [currentChapters, selectedTopicIds, questionType, dataSelectionCategories]);

  // Compute clean syllabus text for the summary
  const syllabusSummary = useMemo(() => {
    return computeSyllabusText(currentChapters, selectedTopicIds);
  }, [currentChapters, selectedTopicIds]);

  const handleProceedToCriteria = () => {
    if (selectedTopicIds.length === 0) {
      notify.warning("Please select at least one chapter or topic to continue.");
      return;
    }
    setStage('criteria');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToTopics = () => {
    setStage('topics');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchAndGenerate = () => {
    if (selectedTopicIds.length === 0) {
      notify.warning("Please select at least one topic.");
      setStage('topics');
      return;
    }

    let mcqCount = 0;
    let shortCount = 0;
    let longCount = 0;
    let mcqMarks = eachQuestionMarks;
    let shortMarks = 2;
    let longMarks = 5;

    if (questionType === 'MCQ') {
      mcqCount = requiredQuestions;
      mcqMarks = eachQuestionMarks;
    } else if (questionType === 'SHORT') {
      shortCount = requiredQuestions;
      shortMarks = eachQuestionMarks;
    } else if (questionType === 'LONG') {
      longCount = requiredQuestions;
      longMarks = eachQuestionMarks;
    } else {
      // ALL / Mixed
      mcqCount = requiredQuestions;
      shortCount = Math.max(1, Math.ceil(requiredQuestions / 2));
      longCount = 2;
    }

    onGeneratePaper({
      selectedTopicIds,
      questionType,
      dataSelectionCategories: { ...dataSelectionCategories },
      mcqCount,
      mcqMarks,
      shortCount,
      shortMarks,
      longCount,
      longMarks,
      language: mediumType === 'URDU' ? 'Urdu' : mediumType === 'DUAL MEDIUM' ? 'English + Urdu (Bilingual)' : 'English',
      showAnswerLines: blankLinesType !== 'None',
      showChapterName: showChapterNameOnPaper,
      choiceCount
    });
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-5 font-sans">
      
      {/* ========================================================================= */}
      {/* PAGE 1: CHAPTER & TOPIC SELECTION                                        */}
      {/* ========================================================================= */}
      {stage === 'topics' && (
        <div className="space-y-4 sm:space-y-5 animate-fadeIn">
          
          {/* TOP BREADCRUMB & HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={onBackToSubjects}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-all cursor-pointer shrink-0"
                title="Go Back to Subjects"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                  {currentSubject?.name} (SNC) - Select Topics
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Course: <span className="text-blue-600 font-bold">{selectedCourse}</span> | Class: <span className="text-blue-600 font-bold">{selectedClass}</span>
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-500 flex flex-wrap items-center gap-1.5 pl-8 sm:pl-0">
              <button onClick={onBackToClasses} className="text-blue-600 hover:underline">Classes</button>
              <span className="text-slate-400">/</span>
              <button onClick={onBackToSubjects} className="text-blue-600 hover:underline">{selectedClass}</button>
              <span className="text-slate-400">/</span>
              <span className="text-slate-700 font-bold">Topics</span>
            </div>
          </div>

          {/* MASTER CHECKBOX & CONTROLS: SELECT ALL CHAPTERS & COLLAPSE/EXPAND ALL */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <label className="flex items-center gap-3 cursor-pointer text-sm sm:text-base font-black text-slate-900 select-none">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleToggleSelectAll}
                className="w-5 h-5 rounded border-slate-400 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>Select All Chapters</span>
            </label>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              {currentChapters.length > 0 && (
                <button
                  type="button"
                  onClick={toggleAllChaptersFold}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title={allChaptersCollapsed ? "Expand all chapters" : "Collapse all chapters to save space"}
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${allChaptersCollapsed ? '-rotate-90 text-slate-500' : 'rotate-0 text-blue-600'}`} />
                  <span>{allChaptersCollapsed ? "Expand All Chapters" : "Collapse All Chapters"}</span>
                </button>
              )}

              <span className="text-xs font-bold text-slate-500 shrink-0">
                {selectedTopicIds.length} / {allTopicIds.length} Topics Selected
              </span>
            </div>
          </div>

          {/* CHAPTERS & TOPICS LIST (EXACT CTM SCREENSHOT STYLING WITH FOLDING) */}
          <div className="space-y-4">
            {currentChapters.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300 text-slate-500">
                <p className="font-bold">No chapters found for this subject.</p>
                <p className="text-xs mt-1">Upload chapters and questions using the Material Upload section.</p>
              </div>
            ) : (
              currentChapters.map((ch) => {
                const chTopicIds = (ch.topics || []).map(t => getTopicIdentifier(ch, t));
                const areAllChSelected = chTopicIds.length > 0 && chTopicIds.every(id => selectedTopicIds.includes(id));
                const isSomeChSelected = chTopicIds.some(id => selectedTopicIds.includes(id));
                const isCollapsed = collapsedChapterIds.has(ch.id);

                const chMcqs = (ch.topics || []).reduce((acc, t) => acc + (t.mcqs?.length || 0), 0);
                const chShorts = (ch.topics || []).reduce((acc, t) => acc + (t.shortQuestions?.length || 0), 0);
                const chLongs = (ch.topics || []).reduce((acc, t) => acc + (t.longQuestions?.length || 0), 0);

                return (
                  <div 
                    key={ch.id} 
                    className="bg-[#2d3748] text-white rounded-md shadow-sm overflow-hidden border border-slate-700 transition-all"
                  >
                    {/* Chapter Header Box (Dark Slate, White Bold Text, Clickable to Fold/Unfold) */}
                    <div 
                      onClick={() => toggleChapterFold(ch.id)}
                      className={`px-3 sm:px-4 py-2.5 bg-[#252f3e] flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer transition-colors hover:bg-[#2b3749] ${!isCollapsed ? 'border-b border-slate-700' : ''}`}
                    >
                      <div className="flex items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                        <label className="flex items-center gap-2.5 cursor-pointer font-black text-xs sm:text-sm select-none hover:text-cyan-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={areAllChSelected}
                            ref={el => { if (el) el.indeterminate = !areAllChSelected && isSomeChSelected; }}
                            onChange={() => handleToggleChapter(ch)}
                            className="w-4 h-4 rounded border-slate-400 text-cyan-500 focus:ring-0 cursor-pointer"
                          />
                          <span>Chap#{ch.chapterNumber}: {ch.name}</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs pl-6 sm:pl-0">
                          <span className="text-slate-400 font-semibold text-[11px] sm:text-xs">
                            {ch.topics?.length || 0} Topics
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-bold font-mono text-[10px] sm:text-[11px]">
                            {chMcqs} MCQs
                          </span>
                          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-800/80 text-indigo-300 font-bold font-mono text-[10px] sm:text-[11px]">
                            {chShorts} Shorts
                          </span>
                          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-purple-950/80 border border-purple-800/80 text-purple-300 font-bold font-mono text-[10px] sm:text-[11px]">
                            {chLongs} Longs
                          </span>
                        </div>

                        {/* Individual Fold / Unfold Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleChapterFold(ch.id);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/70 text-xs font-semibold transition-all cursor-pointer shadow-xs ml-auto sm:ml-0"
                          title={isCollapsed ? "Expand Chapter Topics" : "Fold Chapter Topics"}
                        >
                          <span className="text-[11px] font-medium hidden xs:inline">{isCollapsed ? "Expand" : "Fold"}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCollapsed ? '-rotate-90 text-slate-400' : 'rotate-0 text-cyan-400'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Topics Sub-items List (Visible when not collapsed) */}
                    {!isCollapsed && (
                      <div className="p-2.5 sm:p-3 sm:pl-6 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs animate-fadeIn">
                        {(ch.topics || []).map((topic) => {
                          const topicId = getTopicIdentifier(ch, topic);
                          const isChecked = selectedTopicIds.includes(topicId);
                          const tMcqCount = topic.mcqs?.length || 0;
                          const tShortCount = topic.shortQuestions?.length || 0;
                          const tLongCount = topic.longQuestions?.length || 0;

                          return (
                            <label
                              key={topicId}
                              className={`flex items-center justify-between gap-2 p-2.5 rounded-lg cursor-pointer select-none transition-all min-h-[44px] ${
                                isChecked ? 'bg-slate-700/80 text-white font-bold ring-1 ring-cyan-500/40' : 'text-slate-300 hover:text-white hover:bg-slate-700/40'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleTopic(topicId)}
                                  className="w-4 h-4 rounded border-slate-400 text-blue-500 focus:ring-0 cursor-pointer shrink-0"
                                />
                                <span className="truncate text-xs">{topic.topicNumber} {topic.name}</span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0 font-mono text-[10px]">
                                <span 
                                  title={`${tMcqCount} MCQs in database`}
                                  className={`px-1.5 py-0.5 rounded font-bold ${
                                    tMcqCount > 0 
                                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                                      : 'bg-slate-800/90 text-slate-500 border border-slate-700/60'
                                  }`}
                                >
                                  {tMcqCount} M
                                </span>
                                <span 
                                  title={`${tShortCount} Short Questions in database`}
                                  className={`px-1.5 py-0.5 rounded font-bold ${
                                    tShortCount > 0 
                                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
                                      : 'bg-slate-800/90 text-slate-500 border border-slate-700/60'
                                  }`}
                                >
                                  {tShortCount} S
                                </span>
                                <span 
                                  title={`${tLongCount} Long Questions in database`}
                                  className={`px-1.5 py-0.5 rounded font-bold ${
                                    tLongCount > 0 
                                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                                      : 'bg-slate-800/90 text-slate-500 border border-slate-700/60'
                                  }`}
                                >
                                  {tLongCount} L
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* STICKY BOTTOM ACTION BAR: CONTINUE TO QUESTION CRITERIA */}
          <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl shadow-lg sticky bottom-3 sm:bottom-4 z-20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 animate-fadeIn">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 font-bold rounded-lg text-xs">
                {selectedTopicIds.length} of {allTopicIds.length} Topics Selected
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Pool: <strong className="text-slate-800 font-mono">{availableQuestions.total}</strong> Qs
              </span>
            </div>

            <button
              type="button"
              disabled={selectedTopicIds.length === 0}
              onClick={handleProceedToCriteria}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Continue to Question Criteria</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: QUESTION CRITERIA & CONFIGURATION                                */}
      {/* ========================================================================= */}
      {stage === 'criteria' && (
        <div className="space-y-5 animate-fadeIn">
          
          {/* TOP BREADCRUMB & HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBackToTopics}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                title="Back to Topics"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  {currentSubject?.name} (SNC) - Question Criteria
                </h1>
                <p className="text-xs text-slate-500 font-semibold">
                  Course: <span className="text-blue-600 font-bold">{selectedCourse}</span> | Class: <span className="text-blue-600 font-bold">{selectedClass}</span>
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <button onClick={onBackToClasses} className="text-blue-600 hover:underline">Classes</button>
              <span className="text-slate-400">/</span>
              <button onClick={onBackToSubjects} className="text-blue-600 hover:underline">{selectedClass}</button>
              <span className="text-slate-400">/</span>
              <button onClick={handleBackToTopics} className="text-blue-600 hover:underline">Topics</button>
              <span className="text-slate-400">/</span>
              <span className="text-slate-700 font-bold">Criteria</span>
            </div>
          </div>

          {/* ACTIVE SYLLABUS SUMMARY CARD */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-4 sm:p-5 shadow-sm border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-blue-500/30 border border-blue-400/40 text-blue-300 text-[10px] font-bold uppercase rounded-md tracking-wider">
                  Selected Syllabus
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {selectedTopicIds.length} Topics Selected
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white truncate tracking-tight">
                {syllabusSummary || `${selectedTopicIds.length} Topics Selected`}
              </h2>
              <p className="text-xs text-slate-300 font-medium flex items-center gap-2">
                <span>Available in Pool:</span>
                <span className="text-cyan-300 font-bold font-mono">{availableQuestions.mcqs} MCQs</span>
                <span>•</span>
                <span className="text-indigo-300 font-bold font-mono">{availableQuestions.shorts} Shorts</span>
                <span>•</span>
                <span className="text-purple-300 font-bold font-mono">{availableQuestions.longs} Longs</span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleBackToTopics}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start md:self-auto shrink-0"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Change Topics</span>
            </button>
          </div>

          {/* EXACT 2-ROW CTM FILTER & SELECTION BAR (MATCHING USER SCREENSHOT) */}
          <div className="p-4 sm:p-6 space-y-4 bg-white border border-slate-300 rounded-xl shadow-md">
            
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                <span>Question Selection & Paper Configuration</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Configure question types, marks, medium, and choice rules for the test paper.
              </p>
            </div>

            {/* Row 1: Question Type, Selection, Required Questions, Each Question Marks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
              {/* Question Type */}
              <div className="flex border border-slate-300 rounded overflow-hidden shadow-2xs">
                <span className="bg-[#1890ff] text-white font-bold px-3 py-2 flex items-center whitespace-nowrap text-xs select-none shrink-0">
                  Question Type
                </span>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="w-full bg-white px-2 py-2 text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
                >
                  <option value="ALL">Question Type</option>
                  <option value="MCQ">MCQs</option>
                  <option value="SHORT">Short Questions</option>
                  <option value="LONG">Long Questions</option>
                </select>
              </div>

              {/* Selection & Data Selection Type with Dropdown Popover */}
              <div className="relative flex border border-slate-300 rounded shadow-2xs">
                <span className="bg-[#1890ff] text-white font-bold px-3 py-2 flex items-center whitespace-nowrap text-xs select-none shrink-0">
                  Selection
                </span>
                <button
                  type="button"
                  onClick={() => setShowDataSelectionDropdown(!showDataSelectionDropdown)}
                  className="w-full bg-white px-2.5 py-2 text-slate-800 font-semibold focus:outline-none text-xs flex items-center justify-between gap-1 cursor-pointer select-none"
                >
                  <span className="truncate">Data Selection Type</span>
                  <span className="text-[10px] text-slate-500 font-bold shrink-0">⬍</span>
                </button>

                {/* Popover Menu */}
                {showDataSelectionDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setShowDataSelectionDropdown(false)} 
                    />
                    <div className="absolute left-0 right-0 sm:right-auto top-full mt-1.5 bg-white border border-slate-300 rounded-md shadow-2xl z-50 p-3 space-y-2.5 min-w-full sm:min-w-[270px] animate-fadeIn text-slate-800">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">Question Categories</span>
                        <button
                          type="button"
                          onClick={toggleSelectAllCategories}
                          className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          {isAllCategoriesSelected ? "Deselect All" : "Select All"}
                        </button>
                      </div>

                      {/* Exercise Section */}
                      <div className="p-2 bg-amber-50 rounded border border-amber-200 space-y-1.5">
                        <div className="text-[10px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1">
                          <span>⭐</span>
                          <span>Textbook Exercise (مشقی مواد)</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none hover:text-amber-800 text-slate-800">
                          <input
                            type="checkbox"
                            checked={dataSelectionCategories.exerciseMcqs}
                            onChange={() => toggleCategory('exerciseMcqs')}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                          />
                          <span>Exercise MCQs (مشقی MCQs)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none hover:text-amber-800 text-slate-800">
                          <input
                            type="checkbox"
                            checked={dataSelectionCategories.exerciseShorts}
                            onChange={() => toggleCategory('exerciseShorts')}
                            className="w-4 h-4 rounded text-amber-500 focus:ring-0 cursor-pointer"
                          />
                          <span>Exercise Shorts (مشقی شارٹ سوالات)</span>
                        </label>
                      </div>

                      {/* Topic Questions Section */}
                      <div className="p-2 bg-blue-50 rounded border border-blue-200 space-y-1.5">
                        <div className="text-[10px] font-black uppercase text-blue-800 tracking-wider flex items-center gap-1">
                          <span>📘</span>
                          <span>Topic Questions (ٹاپک وائز مواد)</span>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none hover:text-blue-800 text-slate-800">
                          <input
                            type="checkbox"
                            checked={dataSelectionCategories.topicMcqs}
                            onChange={() => toggleCategory('topicMcqs')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span>Topic MCQs (ٹاپک وائز MCQs)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none hover:text-blue-800 text-slate-800">
                          <input
                            type="checkbox"
                            checked={dataSelectionCategories.topicShorts}
                            onChange={() => toggleCategory('topicShorts')}
                            className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span>Topic Shorts (ٹاپک وائز شارٹس)</span>
                        </label>
                      </div>

                      {/* Other Standard Categories */}
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none hover:text-blue-600 text-slate-800 pt-1">
                        <input
                          type="checkbox"
                          checked={dataSelectionCategories.pastPapers}
                          onChange={() => toggleCategory('pastPapers')}
                          className="w-4 h-4 rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                        />
                        <span>Past Papers (پاسٹ پیپرز)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none hover:text-blue-600 text-slate-800">
                        <input
                          type="checkbox"
                          checked={dataSelectionCategories.additional}
                          onChange={() => toggleCategory('additional')}
                          className="w-4 h-4 rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                        />
                        <span>Additional (اضافی)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs font-bold select-none hover:text-blue-600 text-slate-800">
                        <input
                          type="checkbox"
                          checked={dataSelectionCategories.conceptual}
                          onChange={() => toggleCategory('conceptual')}
                          className="w-4 h-4 rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                        />
                        <span>Conceptual (تصوراتی)</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              {/* Required Questions */}
              <div className="flex border border-slate-300 rounded overflow-hidden shadow-2xs">
                <span className="bg-[#1890ff] text-white font-bold px-3 py-2 flex items-center whitespace-nowrap text-xs select-none">
                  Required Questions
                </span>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={requiredQuestions}
                  onChange={(e) => setRequiredQuestions(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white px-2 py-2 text-slate-800 font-bold focus:outline-none text-xs text-center"
                  placeholder="100"
                />
              </div>

              {/* Each Question Marks */}
              <div className="flex border border-slate-300 rounded overflow-hidden shadow-2xs">
                <span className="bg-[#1890ff] text-white font-bold px-3 py-2 flex items-center whitespace-nowrap text-xs select-none">
                  Each Quesion Marks
                </span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={eachQuestionMarks}
                  onChange={(e) => setEachQuestionMarks(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white px-2 py-2 text-slate-800 font-bold focus:outline-none text-xs text-center"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Dedicated Exercise & Topic Inclusion Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-gradient-to-r from-amber-50/90 to-blue-50/90 border border-amber-200/90 rounded-lg text-xs shadow-2xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-slate-800 flex items-center gap-1.5 shrink-0">
                  <span className="text-amber-500 font-bold text-sm">⭐</span>
                  <span>مشقی سوالات فلٹر (Exercise Filters):</span>
                </span>

                <button
                  type="button"
                  onClick={() => toggleCategory('exerciseMcqs')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold transition-all cursor-pointer select-none ${
                    dataSelectionCategories.exerciseMcqs
                      ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 shadow-2xs'
                      : 'bg-white hover:bg-amber-50 text-slate-500 border-slate-300 line-through decoration-red-500 decoration-2'
                  }`}
                  title="کلک کریں تاکہ پیپر میں مشقی MCQs شامل یا خارج کیے جا سکیں"
                >
                  <span>{dataSelectionCategories.exerciseMcqs ? '✓' : '✗'}</span>
                  <span>Exercise MCQs (مشقی MCQs)</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCategory('exerciseShorts')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold transition-all cursor-pointer select-none ${
                    dataSelectionCategories.exerciseShorts
                      ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 shadow-2xs'
                      : 'bg-white hover:bg-amber-50 text-slate-500 border-slate-300 line-through decoration-red-500 decoration-2'
                  }`}
                  title="کلک کریں تاکہ پیپر میں مشقی مختصر سوالات شامل یا خارج کیے جا سکیں"
                >
                  <span>{dataSelectionCategories.exerciseShorts ? '✓' : '✗'}</span>
                  <span>Exercise Shorts (مشقی شارٹس)</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCategory('topicMcqs')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold transition-all cursor-pointer select-none ${
                    dataSelectionCategories.topicMcqs
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-2xs'
                      : 'bg-white hover:bg-blue-50 text-slate-500 border-slate-300 line-through decoration-red-500 decoration-2'
                  }`}
                  title="عام ٹاپک کے MCQs شامل یا خارج کریں"
                >
                  <span>{dataSelectionCategories.topicMcqs ? '✓' : '✗'}</span>
                  <span>Topic MCQs (ٹاپک MCQs)</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCategory('topicShorts')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold transition-all cursor-pointer select-none ${
                    dataSelectionCategories.topicShorts
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-2xs'
                      : 'bg-white hover:bg-blue-50 text-slate-500 border-slate-300 line-through decoration-red-500 decoration-2'
                  }`}
                  title="عام ٹاپک کے مختصر سوالات شامل یا خارج کریں"
                >
                  <span>{dataSelectionCategories.topicShorts ? '✓' : '✗'}</span>
                  <span>Topic Shorts (ٹاپک شارٹس)</span>
                </button>
              </div>

              <span className="text-[11px] font-semibold text-slate-500 italic hidden md:inline">
                (بٹن پر کلک کر کے مشقی یا ٹاپک سوالات منتخب / خارج کریں)
              </span>
            </div>

            {/* Row 2: Medium (◐), Choice, Blank Lines Type (☰), Chap Name, Selected Counter */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[300px]">
                {/* Medium */}
                <div className="flex border border-slate-300 rounded overflow-hidden shadow-2xs min-w-[190px]">
                  <span className="bg-[#1890ff] text-white font-bold px-3 py-1.5 flex items-center justify-center text-sm select-none">
                    ◐
                  </span>
                  <select
                    value={mediumType}
                    onChange={(e) => setMediumType(e.target.value)}
                    className="w-full bg-white px-2 py-1.5 text-slate-800 font-bold focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="ENGLISH">ENGLISH MEDIUM</option>
                    <option value="URDU">URDU MEDIUM</option>
                    <option value="DUAL MEDIUM">DUAL MEDIUM</option>
                  </select>
                </div>

                {/* Choice */}
                <div className="flex border border-slate-300 rounded overflow-hidden shadow-2xs w-28">
                  <span className="bg-[#1890ff] text-white font-bold px-2.5 py-1.5 flex items-center whitespace-nowrap text-xs select-none">
                    Choice
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={choiceCount}
                    onChange={(e) => setChoiceCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full bg-white px-2 py-1.5 text-slate-800 font-bold focus:outline-none text-xs text-center"
                    placeholder="0"
                  />
                </div>

                {/* Blank Lines Type */}
                <div className="flex border border-slate-300 rounded overflow-hidden shadow-2xs min-w-[160px]">
                  <span className="bg-[#1890ff] text-white font-bold px-3 py-1.5 flex items-center justify-center text-sm select-none">
                    ☰
                  </span>
                  <select
                    value={blankLinesType}
                    onChange={(e) => setBlankLinesType(e.target.value)}
                    className="w-full bg-white px-2 py-1.5 text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="None">Blank Lines Type</option>
                    <option value="2 Lines">2 Lines</option>
                    <option value="3 Lines">3 Lines</option>
                    <option value="4 Lines">4 Lines</option>
                  </select>
                </div>

                {/* Chap Name checkbox */}
                <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-slate-800 select-none px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors shrink-0">
                  <input
                    type="checkbox"
                    checked={showChapterNameOnPaper}
                    onChange={(e) => setShowChapterNameOnPaper(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="whitespace-nowrap">Chap Name</span>
                </label>
              </div>

              {/* Counter: Selected Questions & Real-Time Pool Breakdown */}
              <div className="flex flex-wrap items-center gap-2 font-bold text-xs text-slate-800 whitespace-nowrap bg-slate-50 px-3 py-1.5 rounded border border-slate-200 shrink-0">
                <span className="text-slate-500 font-semibold">Pool:</span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200 font-mono text-[11px]">
                  {availableQuestions.mcqs} MCQs
                </span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono text-[11px]">
                  {availableQuestions.shorts} Shorts
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 font-mono text-[11px]">
                  {availableQuestions.longs} Longs
                </span>
                <span className="text-slate-300">|</span>
                <span>Selected </span>
                <span className="text-blue-600 font-black mx-1 text-sm">{requiredQuestions}</span>
                <span>From </span>
                <span className="text-red-600 font-black ml-1 text-sm">{availableQuestions.total}</span>
              </div>
            </div>

            {/* Row 3: Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleBackToTopics}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Topics</span>
              </button>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
                  {selectedTopicIds.length} Topics Selected
                </span>
                <button
                  type="button"
                  onClick={handleSearchAndGenerate}
                  disabled={selectedTopicIds.length === 0}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#00a8cc] hover:bg-[#008ba8] text-white font-black text-sm rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Search Questions 🔍</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
