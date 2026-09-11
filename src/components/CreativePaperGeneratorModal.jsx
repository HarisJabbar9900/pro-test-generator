import React, { useState, useMemo } from 'react';
import { 
  X, CheckSquare, Square, Search, RefreshCw, Sparkles, 
  HelpCircle, CheckCircle, ChevronDown, ChevronRight, FileText
} from 'lucide-react';
import { isExerciseQuestion } from '../utils/questionBankService';

export default function CreativePaperGeneratorModal({
  isOpen,
  onClose,
  selectedClass,
  currentSubject,
  currentChapters = [],
  onGeneratePaper,
  initialTopicIds = []
}) {
  if (!isOpen) return null;

  // Selected topics Set
  const [selectedTopics, setSelectedTopics] = useState(() => {
    if (initialTopicIds && initialTopicIds.length > 0) {
      return new Set(initialTopicIds);
    }
    // Default to all topics of all chapters
    const all = new Set();
    currentChapters.forEach(ch => {
      (ch.topics || []).forEach(t => all.add(t.id));
    });
    return all;
  });

  // Filter bar states matching exact CTM screenshot
  const [questionType, setQuestionType] = useState('ALL'); // 'ALL' | 'MCQ' | 'SHORT' | 'LONG'
  const [requiredMcqs, setRequiredMcqs] = useState(10);
  const [eachMcqMarks, setEachMcqMarks] = useState(1);
  const [requiredShorts, setRequiredShorts] = useState(5);
  const [eachShortMarks, setEachShortMarks] = useState(2);
  const [requiredLongs, setRequiredLongs] = useState(2);
  const [eachLongMarks, setEachLongMarks] = useState(5);
  const [mediumType, setMediumType] = useState('DUAL MEDIUM'); // 'DUAL MEDIUM' | 'ENGLISH' | 'URDU'
  const [choiceCount, setChoiceCount] = useState(0);
  const [blankLinesType, setBlankLinesType] = useState('None'); // 'None' | '2 Lines' | '3 Lines'
  const [showChapterNameOnPaper, setShowChapterNameOnPaper] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Data Selection Popover State with Exercise MCQs & Shorts
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

  // Total topics available
  const allTopicIds = useMemo(() => {
    const ids = [];
    currentChapters.forEach(ch => {
      (ch.topics || []).forEach(t => ids.push(t.id));
    });
    return ids;
  }, [currentChapters]);

  const isAllSelected = allTopicIds.length > 0 && selectedTopics.size === allTopicIds.length;

  // Master Toggle: Select All Chapters
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedTopics(new Set());
    } else {
      setSelectedTopics(new Set(allTopicIds));
    }
  };

  // Chapter Toggle
  const handleToggleChapter = (chapter) => {
    const chTopicIds = (chapter.topics || []).map(t => t.id);
    const areAllChSelected = chTopicIds.every(id => selectedTopics.has(id));

    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (areAllChSelected) {
        chTopicIds.forEach(id => next.delete(id));
      } else {
        chTopicIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  // Topic Toggle
  const handleToggleTopic = (topicId) => {
    setSelectedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
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
        if (selectedTopics.has(t.id)) {
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
    return { mcqs: m, shorts: s, longs: l, total: m + s + l };
  }, [currentChapters, selectedTopics, dataSelectionCategories]);

  // Handle Generate Paper Submit
  const handleGenerateClick = () => {
    onGeneratePaper({
      selectedTopicIds: Array.from(selectedTopics),
      questionType,
      dataSelectionCategories: { ...dataSelectionCategories },
      mcqCount: requiredMcqs,
      mcqMarks: eachMcqMarks,
      shortCount: requiredShorts,
      shortMarks: eachShortMarks,
      longCount: requiredLongs,
      longMarks: eachLongMarks,
      language: mediumType === 'DUAL MEDIUM' ? 'English + Urdu (Bilingual)' : mediumType === 'URDU' ? 'Urdu' : 'English',
      showAnswerLines: blankLinesType !== 'None',
      showChapterName: showChapterNameOnPaper,
      choiceCount
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-slate-900 rounded-lg w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col border border-slate-300 font-sans">
        
        {/* TOP CYAN HEADER BAR (EXACT SCREENSHOT MATCH) */}
        <div className="bg-[#00a8cc] px-4 py-2 text-white flex items-center justify-between shadow-sm">
          {/* Master Select All Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer font-bold text-sm select-none">
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={handleToggleSelectAll}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-0 cursor-pointer"
            />
            <span>Select All Chapters</span>
          </label>

          {/* Subject & Class Title */}
          <div className="text-center font-black text-sm sm:text-base tracking-wide uppercase truncate max-w-md px-2">
            {selectedClass} - {currentSubject?.name || "Subject"} (SNC)
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 rounded transition-all cursor-pointer text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY CONTAINER: CHAPTERS & TOPICS LIST */}
        <div className="p-4 bg-[#f8fafc] border-b border-slate-200">
          
          <div className="bg-white border border-slate-300 rounded-lg p-3 max-h-56 overflow-y-auto custom-scrollbar space-y-3 shadow-inner">
            {currentChapters.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                Is subject mein koi chapter ya topic upload nahi hai. Pehle "Material Upload" tab se upload karein.
              </div>
            ) : (
              currentChapters.map(ch => {
                const chTopicIds = (ch.topics || []).map(t => t.id);
                const areAllChSelected = chTopicIds.length > 0 && chTopicIds.every(id => selectedTopics.has(id));
                const isSomeChSelected = chTopicIds.some(id => selectedTopics.has(id));

                return (
                  <div key={ch.id} className="space-y-1.5">
                    {/* Chapter Checkbox Header (Cyan / Bold Text) */}
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-black text-[#007799] select-none hover:text-[#005577]">
                      <input
                        type="checkbox"
                        checked={areAllChSelected}
                        ref={el => { if (el) el.indeterminate = !areAllChSelected && isSomeChSelected; }}
                        onChange={() => handleToggleChapter(ch)}
                        className="w-4 h-4 rounded text-[#007799] focus:ring-0 cursor-pointer"
                      />
                      <span>Chap#{ch.chapterNumber}: {ch.name}</span>
                    </label>

                    {/* Topics Checkbox Sub-items (Indented) */}
                    <div className="pl-6 space-y-1">
                      {(ch.topics || []).map(topic => {
                        const isChecked = selectedTopics.has(topic.id);
                        return (
                          <label
                            key={topic.id}
                            className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 hover:text-indigo-600 select-none"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleTopic(topic.id)}
                              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-0 cursor-pointer"
                            />
                            <span>{topic.topicNumber} {topic.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* CONFIGURATION FILTERS & SELECTION ROW (EXACT MATCH TO USER SCREENSHOT) */}
        <div className="p-4 space-y-3 bg-white border-t border-slate-200">
          
          {/* Row 1: Question Type, Selection Type, Required Questions, Each Question Marks */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
            {/* Question Type */}
            <div className="flex border border-slate-300 rounded overflow-hidden shadow-2xs">
              <span className="bg-[#1890ff] text-white font-bold px-3 py-1.5 flex items-center whitespace-nowrap text-xs select-none">
                Question Type
              </span>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full bg-white px-2 py-1.5 text-slate-800 font-semibold focus:outline-none text-xs cursor-pointer"
              >
                <option value="ALL">Question Type</option>
                <option value="MCQ">MCQs</option>
                <option value="SHORT">Short Questions</option>
                <option value="LONG">Long Questions</option>
              </select>
            </div>

            {/* Selection & Data Selection Type with Dropdown Popover */}
            <div className="relative flex border border-slate-300 rounded shadow-2xs">
              <span className="bg-[#1890ff] text-white font-bold px-3 py-1.5 flex items-center whitespace-nowrap text-xs select-none">
                Selection
              </span>
              <button
                type="button"
                onClick={() => setShowDataSelectionDropdown(!showDataSelectionDropdown)}
                className="w-full bg-white px-2.5 py-1.5 text-slate-800 font-semibold focus:outline-none text-xs flex items-center justify-between gap-1 cursor-pointer select-none"
              >
                <span className="truncate">Data Selection Type</span>
                <span className="text-[10px] text-slate-500 font-bold shrink-0">⬍</span>
              </button>

              {/* Dropdown Popover Menu */}
              {showDataSelectionDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setShowDataSelectionDropdown(false)} 
                  />
                  <div className="absolute left-0 top-full mt-1.5 bg-white border border-slate-300 rounded-md shadow-2xl z-50 p-3 space-y-2.5 min-w-[270px] animate-fadeIn text-slate-800">
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
                        <span>Exercise Shorts (مشقی شارٹس)</span>
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

                    {/* Other Categories */}
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
              <span className="bg-[#1890ff] text-white font-bold px-3 py-1.5 flex items-center whitespace-nowrap text-xs select-none">
                Required Questions
              </span>
              <input
                type="number"
                min="1"
                max="100"
                value={requiredMcqs}
                onChange={(e) => setRequiredMcqs(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white px-2 py-1.5 text-slate-800 font-bold focus:outline-none text-xs text-center"
                placeholder="100"
              />
            </div>

            {/* Each Question Marks */}
            <div className="flex border border-slate-300 rounded overflow-hidden shadow-2xs">
              <span className="bg-[#1890ff] text-white font-bold px-3 py-1.5 flex items-center whitespace-nowrap text-xs select-none">
                Each Quesion Marks
              </span>
              <input
                type="number"
                min="1"
                max="20"
                value={eachMcqMarks}
                onChange={(e) => setEachMcqMarks(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full bg-white px-2 py-1.5 text-slate-800 font-bold focus:outline-none text-xs text-center"
                placeholder="1"
              />
            </div>
          </div>

          {/* Quick Exercise Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gradient-to-r from-amber-50/90 to-blue-50/90 border border-amber-200 rounded-lg text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-black text-slate-800 flex items-center gap-1 shrink-0">
                <span className="text-amber-500">⭐</span>
                <span>Exercise Filters:</span>
              </span>
              <button
                type="button"
                onClick={() => toggleCategory('exerciseMcqs')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                  dataSelectionCategories.exerciseMcqs ? 'bg-amber-600 text-white border-amber-700' : 'bg-white text-slate-500 border-slate-300 line-through'
                }`}
              >
                {dataSelectionCategories.exerciseMcqs ? '✓' : '✗'} Ex. MCQs
              </button>
              <button
                type="button"
                onClick={() => toggleCategory('exerciseShorts')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                  dataSelectionCategories.exerciseShorts ? 'bg-amber-600 text-white border-amber-700' : 'bg-white text-slate-500 border-slate-300 line-through'
                }`}
              >
                {dataSelectionCategories.exerciseShorts ? '✓' : '✗'} Ex. Shorts
              </button>
              <button
                type="button"
                onClick={() => toggleCategory('topicMcqs')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                  dataSelectionCategories.topicMcqs ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-500 border-slate-300 line-through'
                }`}
              >
                {dataSelectionCategories.topicMcqs ? '✓' : '✗'} Topic MCQs
              </button>
              <button
                type="button"
                onClick={() => toggleCategory('topicShorts')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border transition-all cursor-pointer ${
                  dataSelectionCategories.topicShorts ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-slate-500 border-slate-300 line-through'
                }`}
              >
                {dataSelectionCategories.topicShorts ? '✓' : '✗'} Topic Shorts
              </button>
            </div>
            <span className="text-[10px] text-slate-500 italic hidden sm:inline">
              (مشقی یا ٹاپک سوالات شامل/خارج کریں)
            </span>
          </div>

          {/* Row 2: Medium (◐ ENGLISH MEDIUM), Choice, Blank Lines Type (☰), Chap Name, Selected Counter */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs items-center">
            {/* Medium Selector (◐ ENGLISH MEDIUM) */}
            <div className="sm:col-span-4 flex border border-slate-300 rounded overflow-hidden shadow-2xs">
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

            {/* Choice input */}
            <div className="sm:col-span-2 flex border border-slate-300 rounded overflow-hidden shadow-2xs">
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
            <div className="sm:col-span-3 flex border border-slate-300 rounded overflow-hidden shadow-2xs">
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
            <div className="sm:col-span-1 flex items-center justify-center">
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs text-slate-800 select-none">
                <input
                  type="checkbox"
                  checked={showChapterNameOnPaper}
                  onChange={(e) => setShowChapterNameOnPaper(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span className="whitespace-nowrap">Chap Name</span>
              </label>
            </div>

            {/* Counter: Selected 0 Question(s) From 0 */}
            <div className="sm:col-span-2 flex items-center justify-end font-bold text-xs text-slate-800 whitespace-nowrap">
              <span>Selected </span>
              <span className="text-blue-600 font-black mx-1 text-sm">{requiredMcqs}</span>
              <span>Question(s) From </span>
              <span className="text-red-600 font-black ml-1 text-sm">{availableQuestions.total}</span>
            </div>
          </div>

          {/* Row 3: Search Questions Cyan Button */}
          <div className="pt-2 flex items-center justify-start">
            <button
              type="button"
              onClick={handleGenerateClick}
              disabled={selectedTopics.size === 0}
              className="px-6 py-2 bg-[#00a8cc] hover:bg-[#008ba8] text-white font-black text-sm rounded shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Search Questions 🔍</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
