import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckSquare, Square, X, Check, Search, Filter, BookOpen, 
  HelpCircle, FileText, Layers, Hash, Sparkles
} from 'lucide-react';
import { isExerciseQuestion } from '../utils/questionBankService';

export default function ManualQuestionPickerModal({
  isOpen,
  onClose,
  initialTab = 'all',
  currentChapters = [],
  selectedTopicIds = [],
  onApplySelection,
  currentPaperData = { mcqs: [], shortQuestions: [], longQuestions: [] },
  defaultMarks = { mcqMarks: 1, shortMarks: 2, longMarks: 5 }
}) {
  // Active section tab: 'all' | 'mcqs' | 'shortQuestions' | 'longQuestions'
  const [activeTab, setActiveTab] = useState(initialTab || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopicId, setFilterTopicId] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'exercise' | 'topic'

  // Flatten all available questions from the question bank (from selected topics or all topics)
  const availableData = useMemo(() => {
    const mcqs = [];
    const shortQuestions = [];
    const longQuestions = [];

    currentChapters.forEach(ch => {
      (ch.topics || []).forEach(t => {
        const topicId = t.id || `${ch.id}-topic-${t.topicNumber || t.name}`;
        // Flexible matching for topic IDs
        const isTopicActive = selectedTopicIds.length === 0 || selectedTopicIds.some(sid => 
          sid === topicId || 
          sid === t.id ||
          (t.topicNumber && (sid.includes(`t${t.topicNumber}`) || sid.includes(`topic-${t.topicNumber}`)))
        );

        (t.mcqs || []).forEach(m => {
          mcqs.push({
            ...m,
            topicId: topicId,
            topicName: t.name,
            topicNumber: t.topicNumber,
            chapterNumber: ch.chapterNumber,
            chapterName: ch.name,
            isFromActiveTopic: isTopicActive,
            isExercise: isExerciseQuestion(m, t)
          });
        });

        (t.shortQuestions || []).forEach(s => {
          shortQuestions.push({
            ...s,
            topicId: topicId,
            topicName: t.name,
            topicNumber: t.topicNumber,
            chapterNumber: ch.chapterNumber,
            chapterName: ch.name,
            isFromActiveTopic: isTopicActive,
            isExercise: isExerciseQuestion(s, t)
          });
        });

        (t.longQuestions || []).forEach(l => {
          longQuestions.push({
            ...l,
            topicId: topicId,
            topicName: t.name,
            topicNumber: t.topicNumber,
            chapterNumber: ch.chapterNumber,
            chapterName: ch.name,
            isFromActiveTopic: isTopicActive,
            isExercise: isExerciseQuestion(l, t)
          });
        });
      });
    });

    // Fallback: If bank has 0 questions for current selection, also include questions already present in currentPaperData
    if (mcqs.length === 0 && (currentPaperData?.mcqs?.length > 0)) {
      (currentPaperData.mcqs || []).forEach(m => {
        mcqs.push({
          ...m,
          topicId: m.topicId || 'active-paper',
          topicName: m.topicName || 'Paper Questions',
          topicNumber: m.topicNumber || '',
          isFromActiveTopic: true
        });
      });
    }
    if (shortQuestions.length === 0 && (currentPaperData?.shortQuestions?.length > 0)) {
      (currentPaperData.shortQuestions || []).forEach(s => {
        shortQuestions.push({
          ...s,
          topicId: s.topicId || 'active-paper',
          topicName: s.topicName || 'Paper Questions',
          topicNumber: s.topicNumber || '',
          isFromActiveTopic: true
        });
      });
    }
    if (longQuestions.length === 0 && (currentPaperData?.longQuestions?.length > 0)) {
      (currentPaperData.longQuestions || []).forEach(l => {
        longQuestions.push({
          ...l,
          topicId: l.topicId || 'active-paper',
          topicName: l.topicName || 'Paper Questions',
          topicNumber: l.topicNumber || '',
          isFromActiveTopic: true
        });
      });
    }

    return { mcqs, shortQuestions, longQuestions };
  }, [currentChapters, selectedTopicIds, currentPaperData]);

  // Check if any active topic matched
  const hasActiveTopicMatches = useMemo(() => {
    return availableData.mcqs.some(m => m.isFromActiveTopic) ||
           availableData.shortQuestions.some(s => s.isFromActiveTopic) ||
           availableData.longQuestions.some(l => l.isFromActiveTopic);
  }, [availableData]);

  // Initial checked IDs from currentPaperData
  const [selectedMcqIds, setSelectedMcqIds] = useState(() => {
    return new Set((currentPaperData.mcqs || []).map(q => q.id || q.question));
  });

  const [selectedShortIds, setSelectedShortIds] = useState(() => {
    return new Set((currentPaperData.shortQuestions || []).map(q => q.id || q.question));
  });

  const [selectedLongIds, setSelectedLongIds] = useState(() => {
    return new Set((currentPaperData.longQuestions || []).map(q => q.id || q.question));
  });

  // Toggle single item selection
  const toggleMcq = (id) => {
    setSelectedMcqIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleShort = (id) => {
    setSelectedShortIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLong = (id) => {
    setSelectedLongIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filtered lists based on search, topic filter, and category filter (exercise vs topic)
  const filterList = React.useCallback((list) => {
    return list.filter(item => {
      // Category filter (Exercise vs Topic)
      if (filterCategory === 'exercise' && !item.isExercise) return false;
      if (filterCategory === 'topic' && item.isExercise) return false;

      // Topic filter
      if (filterTopicId !== 'all') {
        if (item.topicId !== filterTopicId) return false;
      } else if (hasActiveTopicMatches && selectedTopicIds.length > 0 && !item.isFromActiveTopic) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const questionText = (item.question || '').toLowerCase();
        const optionsText = (item.options || []).join(' ').toLowerCase();
        return questionText.includes(q) || optionsText.includes(q);
      }
      return true;
    });
  }, [filterTopicId, hasActiveTopicMatches, selectedTopicIds, searchQuery, filterCategory]);

  const filteredMcqs = useMemo(() => filterList(availableData.mcqs), [availableData.mcqs, filterList]);
  const filteredShorts = useMemo(() => filterList(availableData.shortQuestions), [availableData.shortQuestions, filterList]);
  const filteredLongs = useMemo(() => filterList(availableData.longQuestions), [availableData.longQuestions, filterList]);

  // Counts of currently filtered & selected items
  const selectedFilteredMcqsCount = useMemo(() => {
    return filteredMcqs.filter(m => selectedMcqIds.has(m.id || m.question)).length;
  }, [filteredMcqs, selectedMcqIds]);

  const selectedFilteredShortsCount = useMemo(() => {
    return filteredShorts.filter(s => selectedShortIds.has(s.id || s.question)).length;
  }, [filteredShorts, selectedShortIds]);

  const selectedFilteredLongsCount = useMemo(() => {
    return filteredLongs.filter(l => selectedLongIds.has(l.id || l.question)).length;
  }, [filteredLongs, selectedLongIds]);

  // Check if all questions currently shown in view are selected
  const isAllShownSelected = useMemo(() => {
    const checkList = [];
    if (activeTab === 'all' || activeTab === 'mcqs') {
      filteredMcqs.forEach(m => checkList.push(selectedMcqIds.has(m.id || m.question)));
    }
    if (activeTab === 'all' || activeTab === 'shortQuestions') {
      filteredShorts.forEach(s => checkList.push(selectedShortIds.has(s.id || s.question)));
    }
    if (activeTab === 'all' || activeTab === 'longQuestions') {
      filteredLongs.forEach(l => checkList.push(selectedLongIds.has(l.id || l.question)));
    }
    return checkList.length > 0 && checkList.every(Boolean);
  }, [activeTab, filteredMcqs, filteredShorts, filteredLongs, selectedMcqIds, selectedShortIds, selectedLongIds]);

  // Toggle select all / unselect all for current filtered list in view
  const handleToggleSelectAllInView = () => {
    if (isAllShownSelected) {
      // Unselect all shown in current view
      if (activeTab === 'all' || activeTab === 'mcqs') {
        setSelectedMcqIds(prev => {
          const next = new Set(prev);
          filteredMcqs.forEach(m => next.delete(m.id || m.question));
          return next;
        });
      }
      if (activeTab === 'all' || activeTab === 'shortQuestions') {
        setSelectedShortIds(prev => {
          const next = new Set(prev);
          filteredShorts.forEach(s => next.delete(s.id || s.question));
          return next;
        });
      }
      if (activeTab === 'all' || activeTab === 'longQuestions') {
        setSelectedLongIds(prev => {
          const next = new Set(prev);
          filteredLongs.forEach(l => next.delete(l.id || l.question));
          return next;
        });
      }
    } else {
      // Select all shown in current view
      if (activeTab === 'all' || activeTab === 'mcqs') {
        setSelectedMcqIds(prev => {
          const next = new Set(prev);
          filteredMcqs.forEach(m => next.add(m.id || m.question));
          return next;
        });
      }
      if (activeTab === 'all' || activeTab === 'shortQuestions') {
        setSelectedShortIds(prev => {
          const next = new Set(prev);
          filteredShorts.forEach(s => next.add(s.id || s.question));
          return next;
        });
      }
      if (activeTab === 'all' || activeTab === 'longQuestions') {
        setSelectedLongIds(prev => {
          const next = new Set(prev);
          filteredLongs.forEach(l => next.add(l.id || l.question));
          return next;
        });
      }
    }
  };
  const handleSelectAllInView = handleToggleSelectAllInView;

  const handleClearAll = () => {
    if (activeTab === 'all') {
      setSelectedMcqIds(new Set());
      setSelectedShortIds(new Set());
      setSelectedLongIds(new Set());
    } else if (activeTab === 'mcqs') {
      setSelectedMcqIds(new Set());
    } else if (activeTab === 'shortQuestions') {
      setSelectedShortIds(new Set());
    } else if (activeTab === 'longQuestions') {
      setSelectedLongIds(new Set());
    }
  };

  // Synchronize active tab and selected IDs whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      setSelectedMcqIds(new Set((currentPaperData.mcqs || []).map(q => q.id || q.question)));
      setSelectedShortIds(new Set((currentPaperData.shortQuestions || []).map(q => q.id || q.question)));
      setSelectedLongIds(new Set((currentPaperData.longQuestions || []).map(q => q.id || q.question)));
    }
  }, [isOpen, initialTab, currentPaperData]);

  // Submit and apply selection to PaperCanvas
  const handleApply = () => {
    const findMcq = (id) => availableData.mcqs.find(m => (m.id || m.question) === id) || (currentPaperData.mcqs || []).find(m => (m.id || m.question) === id);
    const findShort = (id) => availableData.shortQuestions.find(s => (s.id || s.question) === id) || (currentPaperData.shortQuestions || []).find(s => (s.id || s.question) === id);
    const findLong = (id) => availableData.longQuestions.find(l => (l.id || l.question) === id) || (currentPaperData.longQuestions || []).find(l => (l.id || l.question) === id);

    const finalMcqs = Array.from(selectedMcqIds)
      .map(id => findMcq(id))
      .filter(Boolean)
      .map(m => ({ ...m, marks: m.marks || defaultMarks.mcqMarks || 1 }));

    const finalShorts = Array.from(selectedShortIds)
      .map(id => findShort(id))
      .filter(Boolean)
      .map(s => ({ ...s, marks: s.marks || defaultMarks.shortMarks || 2 }));

    const finalLongs = Array.from(selectedLongIds)
      .map(id => findLong(id))
      .filter(Boolean)
      .map(l => ({ ...l, marks: l.marks || defaultMarks.longMarks || 5 }));

    onApplySelection({
      mcqs: finalMcqs,
      shortQuestions: finalShorts,
      longQuestions: finalLongs
    });

    onClose();
  };

  // All topics for dropdown filter
  const allTopicOptions = useMemo(() => {
    const list = [];
    currentChapters.forEach(ch => {
      (ch.topics || []).forEach(t => {
        const topicId = t.id || `${ch.id}-topic-${t.topicNumber || t.name}`;
        list.push({
          id: topicId,
          label: `Ch ${ch.chapterNumber} - ${t.topicNumber}: ${t.name}`,
          isSelectedInPanel: selectedTopicIds.includes(topicId)
        });
      });
    });
    return list;
  }, [currentChapters, selectedTopicIds]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl h-[95vh] sm:h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        
        {/* MODAL HEADER */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-white flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="truncate">📋 Manual Question Picker</span>
                <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold shrink-0">
                  {selectedMcqIds.size + selectedShortIds.size + selectedLongIds.size} Selected
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 hidden xs:block truncate">
                Pick questions to include directly in the generated paper.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS BAR: ROW 1 (TABS & ACTIONS) & ROW 2 (SEARCH & FILTERS) */}
        <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-slate-200 bg-slate-50 flex flex-col gap-2.5">
          
          {/* Row 1: Section Tabs (Left) and Quick Select Buttons (Right) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* Section Tabs */}
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 gap-1 shadow-2xs overflow-x-auto max-w-full">
              {[
                { 
                  id: 'all', 
                  label: 'All Questions', 
                  badge: `${selectedMcqIds.size + selectedShortIds.size + selectedLongIds.size}`
                },
                { 
                  id: 'mcqs', 
                  label: 'MCQs', 
                  badge: `${selectedMcqIds.size}${availableData.mcqs.length > 0 ? `/${availableData.mcqs.length}` : ''}`,
                  color: 'text-blue-600'
                },
                { 
                  id: 'shortQuestions', 
                  label: 'Short Questions', 
                  badge: `${selectedShortIds.size}${availableData.shortQuestions.length > 0 ? `/${availableData.shortQuestions.length}` : ''}`,
                  color: 'text-emerald-600'
                },
                { 
                  id: 'longQuestions', 
                  label: 'Long Questions', 
                  badge: `${selectedLongIds.size}${availableData.longQuestions.length > 0 ? `/${availableData.longQuestions.length}` : ''}`,
                  color: 'text-amber-600'
                }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 select-none ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-indigo-800 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {tab.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Quick Select Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={handleToggleSelectAllInView}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 whitespace-nowrap ${
                  isAllShownSelected
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900'
                    : 'bg-white border-slate-300 text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
                title={isAllShownSelected ? "Unselect all shown questions" : "Select all shown questions"}
              >
                <CheckSquare className={`w-3.5 h-3.5 ${isAllShownSelected ? 'text-indigo-700' : 'text-indigo-600'}`} />
                <span>{isAllShownSelected ? 'Unselect All Shown' : 'Select All Shown'}</span>
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-300 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 whitespace-nowrap"
              >
                <X className="w-3.5 h-3.5 text-rose-500" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Row 2: Search Input & Topic Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search question text or option keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl pl-9 pr-8 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Topic Filter Dropdown & Category Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full sm:w-auto bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs cursor-pointer"
              >
                <option value="all">⭐ تمام سوالات (All)</option>
                <option value="exercise">⭐ صرف مشقی سوالات (Exercise Only)</option>
                <option value="topic">📘 صرف عام ٹاپک (Topic Only)</option>
              </select>

              <select
                value={filterTopicId}
                onChange={(e) => setFilterTopicId(e.target.value)}
                className="w-full sm:w-auto min-w-[200px] max-w-[320px] bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 shadow-2xs cursor-pointer truncate"
              >
                <option value="all">
                  {selectedTopicIds.length > 0 ? 'Selected Topics Only' : 'All Topics'}
                </option>
                {allTopicOptions.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>

              {(searchQuery || filterTopicId !== 'all' || filterCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setFilterTopicId('all'); setFilterCategory('all'); }}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/80 transition-all cursor-pointer whitespace-nowrap"
                  title="Reset Filter"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

        </div>

        {/* QUESTIONS LIST CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50">
          
          {/* 1. MCQS SECTION */}
          {(activeTab === 'all' || activeTab === 'mcqs') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Hash className="w-4 h-4" /> Section A: MCQs
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    ({selectedFilteredMcqsCount} of {filteredMcqs.length} selected)
                  </span>
                </div>
              </div>

              {filteredMcqs.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                  Koi MCQs dastyab nahi hain.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMcqs.map((mcq, idx) => {
                    const itemId = mcq.id || mcq.question;
                    const isChecked = selectedMcqIds.has(itemId);

                    return (
                      <div
                        key={itemId || idx}
                        onClick={() => toggleMcq(itemId)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="pt-0.5 shrink-0 text-blue-600">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">
                              Topic {mcq.topicNumber}
                            </span>
                            {mcq.isExercise && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold shrink-0">
                                ⭐ مشقی سوال
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {mcq.topicName}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-900 leading-snug mb-2">
                            {mcq.question}
                          </p>

                          {/* Options */}
                          <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                            {(mcq.options || []).map((opt, oIdx) => (
                              <div key={oIdx} className="bg-slate-50 px-2 py-1 rounded border border-slate-200 line-clamp-1">
                                <span className="font-bold text-slate-500 mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. SHORT QUESTIONS SECTION */}
          {(activeTab === 'all' || activeTab === 'shortQuestions') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Section B: Short Questions
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    ({selectedFilteredShortsCount} of {filteredShorts.length} selected)
                  </span>
                </div>
              </div>

              {filteredShorts.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
                  Koi Short Questions dastyab nahi hain.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredShorts.map((short, idx) => {
                    const itemId = short.id || short.question;
                    const isChecked = selectedShortIds.has(itemId);

                    return (
                      <div
                        key={itemId || idx}
                        onClick={() => toggleShort(itemId)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="pt-0.5 shrink-0 text-emerald-600">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">
                              Topic {short.topicNumber}
                            </span>
                            {short.isExercise && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold shrink-0">
                                ⭐ مشقی سوال
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {short.topicName}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-900 leading-snug">
                            {short.question}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 3. LONG QUESTIONS SECTION */}
          {(activeTab === 'all' || activeTab === 'longQuestions') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Section C: Long Questions
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    ({selectedFilteredLongsCount} of {filteredLongs.length} selected)
                  </span>
                </div>
              </div>

              {filteredLongs.length === 0 ? (
                <div className="text-center py-8 px-4 text-xs text-slate-500 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center gap-2">
                  <BookOpen className="w-8 h-8 text-slate-300" />
                  <p className="font-bold text-slate-700">No Long Questions in Current Selection</p>
                  <p className="text-[11px] text-slate-400 max-w-sm">
                    {(searchQuery || filterTopicId !== 'all')
                      ? 'Try clearing the search query or switching the topic filter to see all questions.'
                      : 'No long questions have been uploaded yet for this topic. You can add them from the Upload Material section.'}
                  </p>
                  {(searchQuery || filterTopicId !== 'all') && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(''); setFilterTopicId('all'); }}
                      className="mt-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold hover:bg-indigo-100 transition-colors"
                    >
                      Show All Topics
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredLongs.map((long, idx) => {
                    const itemId = long.id || long.question;
                    const isChecked = selectedLongIds.has(itemId);

                    return (
                      <div
                        key={itemId || idx}
                        onClick={() => toggleLong(itemId)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                          isChecked
                            ? 'bg-amber-50/80 border-amber-400 shadow-xs'
                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <div className="pt-0.5 shrink-0 text-amber-600">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-amber-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold">
                              Topic {long.topicNumber}
                            </span>
                            {long.isExercise && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold shrink-0">
                                ⭐ مشقی سوال
                              </span>
                            )}
                            <span className="text-[10px] text-slate-500 line-clamp-1">
                              {long.topicName}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-900 leading-snug">
                            {long.question}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* MODAL FOOTER WITH TOTALS & APPLY BUTTON */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Selected:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
              {selectedMcqIds.size} MCQs
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              {selectedShortIds.size} Shorts
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
              {selectedLongIds.size} Longs
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer text-center border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={selectedMcqIds.size === 0 && selectedShortIds.size === 0 && selectedLongIds.size === 0}
              className="flex-2 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed text-center"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Insert Selected Questions</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
