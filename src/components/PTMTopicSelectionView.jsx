import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRight, Search, CheckSquare, Square, 
  RefreshCw, FileText, Layers, BookOpen, CheckCircle2, ChevronRight, Edit3,
  ChevronDown, ChevronUp, Sliders, Plus, Minus, Check, Sparkles, Filter, 
  Award, Globe, HelpCircle, FileSpreadsheet, Zap
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

  // Question Type Mode:
  // 'ALL': Complete Paper (Combine: MCQs + Shorts + Longs)
  // 'MCQ_SHORT': Objective + Shorts (MCQs + Shorts)
  // 'SUBJECTIVE': Subjective Paper (Shorts + Longs)
  // 'MCQ': MCQs Only
  // 'SHORT': Short Questions Only
  // 'LONG': Long Questions Only
  const [questionType, setQuestionType] = useState('ALL');

  // Dedicated Counts and Marks for each question type
  const [mcqCount, setMcqCount] = useState(10);
  const [mcqMarks, setMcqMarks] = useState(1);
  const [shortCount, setShortCount] = useState(5);
  const [shortMarks, setShortMarks] = useState(2);
  const [longCount, setLongCount] = useState(2);
  const [longMarks, setLongMarks] = useState(5);

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

  // Active state checkers based on chosen question type mode
  const isMcqActive = questionType === 'ALL' || questionType === 'MCQ_SHORT' || questionType === 'MCQ';
  const isShortActive = questionType === 'ALL' || questionType === 'MCQ_SHORT' || questionType === 'SUBJECTIVE' || questionType === 'SHORT';
  const isLongActive = questionType === 'ALL' || questionType === 'SUBJECTIVE' || questionType === 'LONG';

  // Effective questions selected for paper
  const effectiveMcqCount = isMcqActive ? mcqCount : 0;
  const effectiveShortCount = isShortActive ? shortCount : 0;
  const effectiveLongCount = isLongActive ? longCount : 0;

  const totalSelectedQuestions = effectiveMcqCount + effectiveShortCount + effectiveLongCount;
  const totalPaperMarks = (effectiveMcqCount * mcqMarks) + (effectiveShortCount * shortMarks) + (effectiveLongCount * longMarks);

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

    let activeTotal = 0;
    if (questionType === 'ALL') activeTotal = m + s + l;
    else if (questionType === 'MCQ_SHORT') activeTotal = m + s;
    else if (questionType === 'SUBJECTIVE') activeTotal = s + l;
    else if (questionType === 'MCQ') activeTotal = m;
    else if (questionType === 'SHORT') activeTotal = s;
    else if (questionType === 'LONG') activeTotal = l;

    return { mcqs: m, shorts: s, longs: l, total: activeTotal };
  }, [currentChapters, selectedTopicIds, questionType, dataSelectionCategories]);

  // Compute clean syllabus text for the summary
  const syllabusSummary = useMemo(() => {
    return computeSyllabusText(currentChapters, selectedTopicIds, {
      questionType,
      mcqCount: effectiveMcqCount,
      shortCount: effectiveShortCount,
      longCount: effectiveLongCount
    });
  }, [currentChapters, selectedTopicIds, questionType, effectiveMcqCount, effectiveShortCount, effectiveLongCount]);

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

    if (totalSelectedQuestions <= 0) {
      notify.warning("براہ کرم کم از کم 1 سوال منتخب کریں (Please select at least 1 question).");
      return;
    }

    onGeneratePaper({
      selectedTopicIds,
      questionType,
      dataSelectionCategories: { ...dataSelectionCategories },
      mcqCount: effectiveMcqCount,
      mcqMarks,
      shortCount: effectiveShortCount,
      shortMarks,
      longCount: effectiveLongCount,
      longMarks,
      totalMarks: totalPaperMarks,
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
        <div className="space-y-4 sm:space-y-5 animate-fadeIn pb-24">
          
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
              <span>Classes</span>
              <span className="text-slate-400">/</span>
              <span>{selectedClass}</span>
              <span className="text-slate-400">/</span>
              <span className="text-blue-700 font-bold">Topics</span>
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

              <span className="text-xs font-bold text-slate-600 shrink-0">
                {selectedTopicIds.length} / {allTopicIds.length} Topics Selected
              </span>

              {selectedTopicIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleProceedToCriteria}
                  className="hidden sm:flex px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-lg shadow-sm transition-all items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  title="Continue to Question Criteria"
                >
                  <span>Next: Criteria</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
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

          {/* SINGLE UNIFIED BOTTOM FLOATING ACTION BAR: CONTINUE TO QUESTION CRITERIA */}
          <div className="fixed bottom-3 left-3 right-3 sm:static sm:bottom-auto sm:left-auto sm:right-auto z-40 p-2.5 sm:p-4 bg-white/95 backdrop-blur-md border border-slate-300/90 rounded-2xl shadow-2xl sm:shadow-xl flex items-center justify-between gap-2.5 animate-fadeIn">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0 shadow-xs">
                ✓
              </div>
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                    {selectedTopicIds.length} of {allTopicIds.length} Selected
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate">
                  Pool: <strong className="text-blue-600 font-mono font-bold">{availableQuestions.total}</strong> Qs Ready
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={selectedTopicIds.length === 0}
              onClick={handleProceedToCriteria}
              className="px-4 sm:px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
            >
              <span className="hidden sm:inline">Continue to Question Criteria (سوالات کی ترتیب)</span>
              <span className="sm:hidden">Next: Criteria</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
              <span>Classes</span>
              <span className="text-slate-400">/</span>
              <span>{selectedClass}</span>
              <span className="text-slate-400">/</span>
              <span>Topics</span>
              <span className="text-slate-400">/</span>
              <span className="text-blue-700 font-bold">Criteria</span>
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

            <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleSearchAndGenerate}
                disabled={selectedTopicIds.length === 0}
                className="px-5 py-2 bg-gradient-to-r from-[#00a8cc] to-teal-500 hover:from-[#008ba8] hover:to-teal-600 text-white rounded-lg text-xs font-black transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <span>Generate Paper 🔍</span>
              </button>
            </div>
          </div>

          {/* EXECUTIVE QUESTION SELECTION & PAPER CONFIGURATION CONTAINER */}
          <div className="p-4 sm:p-6 lg:p-7 space-y-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm">
            
            {/* Header: Title, Urdu translation & Live Totals */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Question Selection & Paper Configuration</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 font-sans">
                    پیپر کی اقسام، سوالات کی تعداد اور امتحانی ضوابط متعین کریں (Configure question types, counts, marks & exam rules)
                  </p>
                </div>
              </div>

              {/* Live Mini Badge Summary */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
                <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                  Total: <strong className="text-blue-600 font-black">{totalSelectedQuestions}</strong> Questions
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-2xs">
                  {totalPaperMarks} Total Marks
                </span>
              </div>
            </div>

            {/* 1. QUESTION TYPE / PATTERN SELECTOR (COMBINED / ALL MODES) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 tracking-wide uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. پیپر کا پیٹرن منتخب کریں (Select Question Paper Mode)</span>
                </label>
                <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
                  مطلوبہ سوالات کی اقسام شامل کرنے کے لیے آپشن منتخب کریں
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
                {/* Mode 1: Complete Paper (Combine) */}
                <button
                  type="button"
                  onClick={() => setQuestionType('ALL')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                    questionType === 'ALL'
                      ? 'border-blue-600 bg-blue-50/80 text-blue-950 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black">مکمل پیپر (Combine)</span>
                    {questionType === 'ALL' && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold leading-tight">
                    MCQs + Shorts + Longs
                  </span>
                </button>

                {/* Mode 2: Objective + Shorts */}
                <button
                  type="button"
                  onClick={() => setQuestionType('MCQ_SHORT')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                    questionType === 'MCQ_SHORT'
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 shadow-xs ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black">معروضی + مختصر</span>
                    {questionType === 'MCQ_SHORT' && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold leading-tight">
                    MCQs + Shorts Only
                  </span>
                </button>

                {/* Mode 3: Subjective Only (Shorts + Longs) */}
                <button
                  type="button"
                  onClick={() => setQuestionType('SUBJECTIVE')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                    questionType === 'SUBJECTIVE'
                      ? 'border-purple-600 bg-purple-50/80 text-purple-950 shadow-xs ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black">انشائیہ پیپر (Subjective)</span>
                    {questionType === 'SUBJECTIVE' && <Check className="w-3.5 h-3.5 text-purple-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold leading-tight">
                    Shorts + Longs Only
                  </span>
                </button>

                {/* Mode 4: MCQs Only */}
                <button
                  type="button"
                  onClick={() => setQuestionType('MCQ')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                    questionType === 'MCQ'
                      ? 'border-cyan-600 bg-cyan-50/80 text-cyan-950 shadow-xs ring-2 ring-cyan-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black">صرف معروضی (MCQs)</span>
                    {questionType === 'MCQ' && <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold leading-tight">
                    Objective Only
                  </span>
                </button>

                {/* Mode 5: Shorts Only */}
                <button
                  type="button"
                  onClick={() => setQuestionType('SHORT')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                    questionType === 'SHORT'
                      ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 shadow-xs ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black">صرف مختصر سوالات</span>
                    {questionType === 'SHORT' && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold leading-tight">
                    Short Questions Only
                  </span>
                </button>

                {/* Mode 6: Longs Only */}
                <button
                  type="button"
                  onClick={() => setQuestionType('LONG')}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 relative ${
                    questionType === 'LONG'
                      ? 'border-amber-600 bg-amber-50/80 text-amber-950 shadow-xs ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-black">صرف تفصیلی سوالات</span>
                    {questionType === 'LONG' && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold leading-tight">
                    Long Questions Only
                  </span>
                </button>
              </div>
            </div>

            {/* 2. DEDICATED QUESTION COUNTS & MARKS CONFIGURATION CARDS */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-800 tracking-wide uppercase flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>2. سوالات کی تعداد اور مارکس کی ترتیب (Customize Quantities & Marks)</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                
                {/* CARD 1: MCQs CONFIGURATION */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isMcqActive 
                    ? 'bg-gradient-to-b from-blue-50/40 via-white to-white border-blue-300/80 shadow-xs' 
                    : 'bg-slate-50/60 border-slate-200 opacity-50'
                }`}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-black text-slate-900">MCQs (معروضی سوالات)</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-mono">
                      {availableQuestions.mcqs} Available
                    </span>
                  </div>

                  {isMcqActive ? (
                    <div className="pt-3 space-y-3">
                      {/* Count Stepper */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-600">تعداد (Count):</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Max: {availableQuestions.mcqs}</span>
                        </div>
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setMcqCount(prev => Math.max(0, prev - 1))}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer select-none"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={Math.max(100, availableQuestions.mcqs)}
                            value={mcqCount}
                            onChange={(e) => setMcqCount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full text-center py-1.5 text-sm font-black text-slate-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setMcqCount(prev => prev + 1)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer select-none"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Quick Count Presets */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {[5, 10, 15, 20].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setMcqCount(val)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                mcqCount === val
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Marks Each */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-600">ہر سوال کے نمبر:</span>
                        <div className="flex items-center gap-1.5">
                          {[1, 2].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setMcqMarks(m)}
                              className={`px-2.5 py-1 rounded-md text-xs font-black border transition-all cursor-pointer ${
                                mcqMarks === m
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {m} {m === 1 ? 'Mark' : 'Marks'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="p-2 rounded-lg bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs font-bold text-blue-950">
                        <span>MCQs Subtotal:</span>
                        <span className="font-mono text-sm font-black text-blue-700">
                          {effectiveMcqCount} × {mcqMarks} = {effectiveMcqCount * mcqMarks} Marks
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400 font-semibold italic">
                      اس پیٹرن میں معروضی سوالات شامل نہیں ہیں
                    </div>
                  )}
                </div>

                {/* CARD 2: SHORT QUESTIONS CONFIGURATION */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isShortActive 
                    ? 'bg-gradient-to-b from-indigo-50/40 via-white to-white border-indigo-300/80 shadow-xs' 
                    : 'bg-slate-50/60 border-slate-200 opacity-50'
                }`}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span className="text-xs font-black text-slate-900">Shorts (مختصر سوالات)</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono">
                      {availableQuestions.shorts} Available
                    </span>
                  </div>

                  {isShortActive ? (
                    <div className="pt-3 space-y-3">
                      {/* Count Stepper */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-600">تعداد (Count):</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Max: {availableQuestions.shorts}</span>
                        </div>
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setShortCount(prev => Math.max(0, prev - 1))}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer select-none"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={Math.max(100, availableQuestions.shorts)}
                            value={shortCount}
                            onChange={(e) => setShortCount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full text-center py-1.5 text-sm font-black text-slate-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShortCount(prev => prev + 1)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer select-none"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Quick Count Presets */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {[3, 5, 8, 10].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setShortCount(val)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                shortCount === val
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Marks Each */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-600">ہر سوال کے نمبر:</span>
                        <div className="flex items-center gap-1.5">
                          {[2, 3, 4].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setShortMarks(m)}
                              className={`px-2.5 py-1 rounded-md text-xs font-black border transition-all cursor-pointer ${
                                shortMarks === m
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {m}M
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs font-bold text-indigo-950">
                        <span>Shorts Subtotal:</span>
                        <span className="font-mono text-sm font-black text-indigo-700">
                          {effectiveShortCount} × {shortMarks} = {effectiveShortCount * shortMarks} Marks
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400 font-semibold italic">
                      اس پیٹرن میں مختصر سوالات شامل نہیں ہیں
                    </div>
                  )}
                </div>

                {/* CARD 3: LONG QUESTIONS CONFIGURATION */}
                <div className={`p-4 rounded-xl border transition-all ${
                  isLongActive 
                    ? 'bg-gradient-to-b from-purple-50/40 via-white to-white border-purple-300/80 shadow-xs' 
                    : 'bg-slate-50/60 border-slate-200 opacity-50'
                }`}>
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span className="text-xs font-black text-slate-900">Longs (تفصیلی سوالات)</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-mono">
                      {availableQuestions.longs} Available
                    </span>
                  </div>

                  {isLongActive ? (
                    <div className="pt-3 space-y-3">
                      {/* Count Stepper */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-600">تعداد (Count):</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Max: {availableQuestions.longs}</span>
                        </div>
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setLongCount(prev => Math.max(0, prev - 1))}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer select-none"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            max={Math.max(50, availableQuestions.longs)}
                            value={longCount}
                            onChange={(e) => setLongCount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-full text-center py-1.5 text-sm font-black text-slate-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setLongCount(prev => prev + 1)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer select-none"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {/* Quick Count Presets */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {[1, 2, 3, 4].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setLongCount(val)}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                                longCount === val
                                  ? 'bg-purple-600 text-white border-purple-600'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Marks Each */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-xs font-bold text-slate-600">ہر سوال کے نمبر:</span>
                        <div className="flex items-center gap-1.5">
                          {[4, 5, 8, 10].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setLongMarks(m)}
                              className={`px-2 py-1 rounded-md text-xs font-black border transition-all cursor-pointer ${
                                longMarks === m
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              {m}M
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="p-2 rounded-lg bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs font-bold text-purple-950">
                        <span>Longs Subtotal:</span>
                        <span className="font-mono text-sm font-black text-purple-700">
                          {effectiveLongCount} × {longMarks} = {effectiveLongCount * longMarks} Marks
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400 font-semibold italic">
                      اس پیٹرن میں تفصیلی سوالات شامل نہیں ہیں
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* LIVE TOTAL SUMMARY BANNER */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xs">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-300">منتخب شدہ بریک ڈاؤن:</span>
                {isMcqActive && (
                  <span className="px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30 font-mono text-[11px]">
                    {effectiveMcqCount} MCQs ({effectiveMcqCount * mcqMarks}M)
                  </span>
                )}
                {isShortActive && (
                  <span className="px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-mono text-[11px]">
                    {effectiveShortCount} Shorts ({effectiveShortCount * shortMarks}M)
                  </span>
                )}
                {isLongActive && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30 font-mono text-[11px]">
                    {effectiveLongCount} Longs ({effectiveLongCount * longMarks}M)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">کل پیپر کے سوالات و نمبرات</div>
                  <div className="text-sm sm:text-base font-black text-cyan-300">
                    {totalSelectedQuestions} Questions | {totalPaperMarks} Total Marks
                  </div>
                </div>
              </div>
            </div>

            {/* 3. QUESTION POOL & CATEGORY FILTERS (REPLACING HARSH YELLOW BOX) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-black text-slate-800">
                    سوالات کی اقسام و ذرائع فلٹر (Question Pool & Category Inclusion)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-semibold italic">
                  (بٹن پر کلک کر کے مشقی یا ٹاپک سوالات شامل / خارج کریں)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Exercise MCQs */}
                <button
                  type="button"
                  onClick={() => toggleCategory('exerciseMcqs')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
                    dataSelectionCategories.exerciseMcqs
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-700 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-400 border-slate-300 line-through decoration-red-500 decoration-2'
                  }`}
                  title="کلک کریں تاکہ پیپر میں مشقی MCQs شامل یا خارج کیے جا سکیں"
                >
                  <span>{dataSelectionCategories.exerciseMcqs ? '✓' : '✗'}</span>
                  <span>Exercise MCQs (مشقی MCQs)</span>
                </button>

                {/* Exercise Shorts */}
                <button
                  type="button"
                  onClick={() => toggleCategory('exerciseShorts')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
                    dataSelectionCategories.exerciseShorts
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-400 border-slate-300 line-through decoration-red-500 decoration-2'
                  }`}
                  title="کلک کریں تاکہ پیپر میں مشقی مختصر سوالات شامل یا خارج کیے جا سکیں"
                >
                  <span>{dataSelectionCategories.exerciseShorts ? '✓' : '✗'}</span>
                  <span>Exercise Shorts (مشقی شارٹس)</span>
                </button>

                {/* Topic MCQs */}
                <button
                  type="button"
                  onClick={() => toggleCategory('topicMcqs')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
                    dataSelectionCategories.topicMcqs
                      ? 'bg-cyan-700 hover:bg-cyan-800 text-white border-cyan-800 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-400 border-slate-300 line-through decoration-red-500 decoration-2'
                  }`}
                  title="عام ٹاپک کے MCQs شامل یا خارج کریں"
                >
                  <span>{dataSelectionCategories.topicMcqs ? '✓' : '✗'}</span>
                  <span>Topic MCQs (ٹاپک MCQs)</span>
                </button>

                {/* Topic Shorts */}
                <button
                  type="button"
                  onClick={() => toggleCategory('topicShorts')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer select-none ${
                    dataSelectionCategories.topicShorts
                      ? 'bg-teal-700 hover:bg-teal-800 text-white border-teal-800 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-400 border-slate-300 line-through decoration-red-500 decoration-2'
                  }`}
                  title="عام ٹاپک کے مختصر سوالات شامل یا خارج کریں"
                >
                  <span>{dataSelectionCategories.topicShorts ? '✓' : '✗'}</span>
                  <span>Topic Shorts (ٹاپک شارٹس)</span>
                </button>

                {/* More Categories Popover Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDataSelectionDropdown(!showDataSelectionDropdown)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <span>مزید کیٹیگریز (Data Types)</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  {/* Popover Menu */}
                  {showDataSelectionDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={() => setShowDataSelectionDropdown(false)} 
                      />
                      <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-4 space-y-3 min-w-[280px] text-slate-800">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-700">Question Categories</span>
                          <button
                            type="button"
                            onClick={toggleSelectAllCategories}
                            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                          >
                            {isAllCategoriesSelected ? "Deselect All" : "Select All"}
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold select-none text-slate-800 hover:text-blue-600">
                            <input
                              type="checkbox"
                              checked={dataSelectionCategories.pastPapers}
                              onChange={() => toggleCategory('pastPapers')}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                            />
                            <span>Past Papers (پاسٹ پیپرز)</span>
                          </label>

                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold select-none text-slate-800 hover:text-blue-600">
                            <input
                              type="checkbox"
                              checked={dataSelectionCategories.additional}
                              onChange={() => toggleCategory('additional')}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                            />
                            <span>Additional (اضافی مواد)</span>
                          </label>

                          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-bold select-none text-slate-800 hover:text-blue-600">
                            <input
                              type="checkbox"
                              checked={dataSelectionCategories.conceptual}
                              onChange={() => toggleCategory('conceptual')}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                            />
                            <span>Conceptual (تصوراتی سوالات)</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 4. PAPER FORMATTING & EXAM RULES GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {/* Medium */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span>پیپر کی زبان (Medium):</span>
                </label>
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                  <select
                    value={mediumType}
                    onChange={(e) => setMediumType(e.target.value)}
                    className="w-full bg-white px-3 py-2 text-slate-800 font-bold focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="ENGLISH">ENGLISH MEDIUM</option>
                    <option value="URDU">URDU MEDIUM (اردو میڈیم)</option>
                    <option value="DUAL MEDIUM">DUAL MEDIUM (دونوں زبانیں)</option>
                  </select>
                </div>
              </div>

              {/* Choice */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>اختیاری سوالات (Choice):</span>
                </label>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setChoiceCount(prev => Math.max(0, prev - 1))}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer select-none"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={choiceCount}
                    onChange={(e) => setChoiceCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-2 text-xs font-bold text-slate-900 focus:outline-none"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() => setChoiceCount(prev => prev + 1)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black cursor-pointer select-none"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Blank Lines Type */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>خالی لائنیں (Answer Lines):</span>
                </label>
                <div className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                  <select
                    value={blankLinesType}
                    onChange={(e) => setBlankLinesType(e.target.value)}
                    className="w-full bg-white px-3 py-2 text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
                  >
                    <option value="None">None (No Lines)</option>
                    <option value="2 Lines">2 Lines (دو لائنیں)</option>
                    <option value="3 Lines">3 Lines (تین لائنیں)</option>
                    <option value="4 Lines">4 Lines (چار لائنیں)</option>
                  </select>
                </div>
              </div>

              {/* Show Chapter Name */}
              <div className="flex flex-col gap-1 justify-end">
                <label 
                  onClick={() => setShowChapterNameOnPaper(!showChapterNameOnPaper)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border cursor-pointer select-none transition-all shadow-2xs h-[38px] ${
                    showChapterNameOnPaper
                      ? 'bg-blue-50/80 border-blue-400 text-blue-900 font-black'
                      : 'bg-white border-slate-300 text-slate-700 font-bold hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={showChapterNameOnPaper}
                    onChange={(e) => setShowChapterNameOnPaper(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="truncate">پیپر پر سبق کا نام دکھائیں</span>
                </label>
              </div>
            </div>

            {/* 5. ACTION & POOL SUMMARY BAR */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
              <button
                type="button"
                onClick={handleBackToTopics}
                className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Topics (ٹاپکس میں واپسی)</span>
              </button>

              {/* Center/Pool Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 font-bold text-xs text-slate-700">
                <span className="text-slate-500 font-semibold text-[11px]">Pool:</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[11px]">
                  {availableQuestions.mcqs} MCQs
                </span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono text-[11px]">
                  {availableQuestions.shorts} Shorts
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 font-mono text-[11px]">
                  {availableQuestions.longs} Longs
                </span>
              </div>

              {/* Generate Paper CTA Button */}
              <button
                type="button"
                onClick={handleSearchAndGenerate}
                disabled={selectedTopicIds.length === 0 || totalSelectedQuestions === 0}
                className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:to-cyan-600 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Paper (پیپر تیار کریں) 🚀</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
