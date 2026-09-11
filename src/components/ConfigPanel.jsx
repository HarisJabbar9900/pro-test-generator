import React, { useState, useMemo } from 'react';
import { 
  Sliders, Sparkles, HelpCircle, CheckSquare, FileQuestion, 
  Minus, Plus, BookOpen, Layers, Check, Settings, Shuffle, ArrowRight, 
  UploadCloud, FileText, ChevronDown, ChevronRight, Hash, Eye
} from 'lucide-react';

export default function ConfigPanel({
  selectedClass,
  setSelectedClass,
  availableClasses = ["9th", "10th", "11th", "12th"],
  currentSubjects = [],
  selectedSubjectId,
  setSelectedSubjectId,
  currentChapters = [],
  selectedTopicIds = [],
  setSelectedTopicIds,
  topicConfigs = {},
  setTopicConfigs,
  mcqCount,
  setMcqCount,
  mcqMarks,
  setMcqMarks,
  shortCount,
  setShortCount,
  shortMarks,
  setShortMarks,
  longCount,
  setLongCount,
  longMarks,
  setLongMarks,
  isRandom,
  setIsRandom,
  onGeneratePaper,
  totalPaperMarks,
  onOpenManualPicker
}) {
  // Currently expanded chapters in the accordion
  const [expandedChapterIds, setExpandedChapterIds] = useState(() => {
    return currentChapters[0]?.id ? [currentChapters[0].id] : [];
  });

  // Toggle chapter expansion
  const toggleChapter = (chapterId) => {
    if (expandedChapterIds.includes(chapterId)) {
      setExpandedChapterIds(expandedChapterIds.filter(id => id !== chapterId));
    } else {
      setExpandedChapterIds([...expandedChapterIds, chapterId]);
    }
  };

  // Helper to ensure robust unique topic IDs
  const getTopicIdentifier = (ch, t) => t.id || `${ch.id}-topic-${t.topicNumber || t.name}`;

  // Toggle topic selection
  const toggleTopic = (topicId) => {
    if (!topicId) return;
    if (selectedTopicIds.includes(topicId)) {
      setSelectedTopicIds(selectedTopicIds.filter(id => id !== topicId));
    } else {
      setSelectedTopicIds([...selectedTopicIds, topicId]);
    }
  };

  // Select all topics in a chapter
  const selectAllTopicsInChapter = (chapter) => {
    const chTopicIds = (chapter.topics || []).map(t => getTopicIdentifier(chapter, t));
    const allSelected = chTopicIds.length > 0 && chTopicIds.every(id => selectedTopicIds.includes(id));
    if (allSelected) {
      setSelectedTopicIds(selectedTopicIds.filter(id => !chTopicIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedTopicIds, ...chTopicIds]));
      setSelectedTopicIds(merged);
    }
  };

  // Active topic questions preview in accordion
  const [previewTopicId, setPreviewTopicId] = useState(null);

  // Calculate available counts across selected topics
  const { totalAvailMcqs, totalAvailShorts, totalAvailLongs } = useMemo(() => {
    let m = 0, s = 0, l = 0;
    currentChapters.forEach(ch => {
      (ch.topics || []).forEach(t => {
        const tid = getTopicIdentifier(ch, t);
        if (selectedTopicIds.includes(tid)) {
          m += (t.mcqs?.length || 0);
          s += (t.shortQuestions?.length || 0);
          l += (t.longQuestions?.length || 0);
        }
      });
    });
    return { totalAvailMcqs: m, totalAvailShorts: s, totalAvailLongs: l };
  }, [currentChapters, selectedTopicIds]);

  return (
    <div className="flex flex-col gap-4 text-slate-800">
      
      {/* 1. Class Selector Buttons (9th to 12th) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            1. Select Class
          </span>
          <span className="text-xs text-slate-500 font-semibold">{selectedClass} Class</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {availableClasses.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                selectedClass === cls
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cls} Class
            </button>
          ))}
        </div>
      </div>

      {/* 2. Subjects List */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            2. Select Subject
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {currentSubjects.length} Subjects
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {currentSubjects.map(sub => {
            const isSelected = (selectedSubjectId === sub.id);

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectId(sub.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PEHLE SE UPLOAD SHUDA MATERIAL (CHAPTERS & TOPICS) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              3. Upload Shuda Material (Chapters & Topics)
            </span>
            <p className="text-[11px] text-slate-500">
              Aapka upload kiya gaya material neeche mojood hai. Jo topics paper mein dalne hain unhein tick karein:
            </p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
            {selectedTopicIds.length} Selected
          </span>
        </div>

        {/* Chapters Accordion */}
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1 custom-scrollbar">
          {currentChapters.map(ch => {
            const isExpanded = expandedChapterIds.includes(ch.id);
            const chTopics = ch.topics || [];
            const selectedInCh = chTopics.filter(t => selectedTopicIds.includes(t.id));
            const allSelected = chTopics.length > 0 && selectedInCh.length === chTopics.length;

            // Total questions in this chapter
            const chTotalMcqs = chTopics.reduce((sum, t) => sum + (t.mcqs?.length || 0), 0);
            const chTotalShorts = chTopics.reduce((sum, t) => sum + (t.shortQuestions?.length || 0), 0);
            const chTotalLongs = chTopics.reduce((sum, t) => sum + (t.longQuestions?.length || 0), 0);

            return (
              <div
                key={ch.id}
                className="bg-slate-50/70 rounded-xl border border-slate-200 overflow-hidden transition-all"
              >
                {/* Chapter Header Row */}
                <div 
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 select-none"
                  onClick={() => toggleChapter(ch.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectAllTopicsInChapter(ch);
                      }}
                      title="Select all topics in this chapter"
                      className={`p-1 rounded text-[10px] font-bold border transition-all ${
                        allSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : selectedInCh.length > 0
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                          : 'bg-white text-slate-400 border-slate-300'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                    </button>

                    <div className="overflow-hidden">
                      <div className="font-bold text-xs text-slate-800 line-clamp-1 flex items-center gap-1.5">
                        <span className="text-amber-700 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">Ch {ch.chapterNumber}:</span>
                        <span>{ch.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{chTopics.length} Topics</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-blue-600 font-medium">{chTotalMcqs} MCQs</span>
                        <span className="text-emerald-600 font-medium">{chTotalShorts} Shorts</span>
                        <span className="text-amber-600 font-medium">{chTotalLongs} Longs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Topics Grid inside Chapter */}
                {isExpanded && (
                  <div className="p-2.5 bg-white border-t border-slate-200 space-y-2">
                    {chTopics.map(topic => {
                      const topicId = getTopicIdentifier(chapter, topic);
                      const isChecked = selectedTopicIds.includes(topicId);
                      const mCount = topic.mcqs?.length || 0;
                      const sCount = topic.shortQuestions?.length || 0;
                      const lCount = topic.longQuestions?.length || 0;
                      const isPreviewOpen = (previewTopicId === topicId);

                      return (
                        <div
                          key={topicId}
                          className={`rounded-xl p-2.5 transition-all border ${
                            isChecked
                              ? 'bg-indigo-50/70 border-indigo-300 text-slate-900'
                              : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <label className="flex items-center gap-2 cursor-pointer flex-1 overflow-hidden">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleTopic(topicId)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                              <span className="font-bold text-amber-800 text-xs shrink-0 font-mono px-1.5 py-0.5 rounded bg-amber-100 border border-amber-300">
                                {topic.topicNumber}
                              </span>
                              <span className="font-semibold text-xs text-slate-800 line-clamp-1">
                                {topic.name}
                              </span>
                            </label>

                            {/* Question Count Badges & Eye Button */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                                {mCount} MCQs
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                                {sCount} Shorts
                              </span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                                {lCount} Longs
                              </span>

                              {/* View Questions Button */}
                              {(mCount > 0 || sCount > 0 || lCount > 0) && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewTopicId(isPreviewOpen ? null : topic.id);
                                  }}
                                  title="Is topic ke upload shuda questions dekhein"
                                  className={`p-1 rounded-md text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                                    isPreviewOpen 
                                      ? 'bg-indigo-600 text-white border-indigo-600' 
                                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-300 hover:bg-slate-50'
                                  }`}
                                >
                                  <Eye className="w-3 h-3" />
                                  <span className="text-[10px] hidden sm:inline">{isPreviewOpen ? 'Hide' : 'View'}</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Expandable Preview of Uploaded Questions for this Topic */}
                          {isPreviewOpen && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-200 space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg animate-fadeIn">
                              <div className="font-bold text-indigo-700 text-[11px] uppercase tracking-wider flex items-center justify-between">
                                <span>Topic {topic.topicNumber} Ka Upload Shuda Material:</span>
                                <span className="text-[10px] text-slate-500 font-normal">{mCount} MCQs, {sCount} Shorts, {lCount} Longs</span>
                              </div>

                              {/* MCQs Preview */}
                              {mCount > 0 && (
                                <div className="space-y-1">
                                  <span className="text-[10px] font-bold text-blue-700 uppercase">MCQs:</span>
                                  {topic.mcqs.slice(0, 3).map((m, idx) => (
                                    <div key={idx} className="p-1.5 rounded bg-white border border-slate-200 text-[11px]">
                                      <div className="font-medium text-slate-800">{idx + 1}. {m.question}</div>
                                      <div className="text-[10px] text-slate-500 mt-0.5">
                                        Options: {m.options?.join(', ')} • Correct: <span className="text-emerald-700 font-bold">{m.correctAnswer}</span>
                                      </div>
                                    </div>
                                  ))}
                                  {mCount > 3 && (
                                    <div className="text-[10px] text-slate-400 italic">...aur {mCount - 3} mazeed MCQs</div>
                                  )}
                                </div>
                              )}

                              {/* Short Questions Preview */}
                              {sCount > 0 && (
                                <div className="space-y-1 pt-1">
                                  <span className="text-[10px] font-bold text-emerald-700 uppercase">Short Questions:</span>
                                  {topic.shortQuestions.slice(0, 3).map((s, idx) => (
                                    <div key={idx} className="p-1.5 rounded bg-white border border-slate-200 text-[11px] text-slate-800">
                                      {idx + 1}. {s.question}
                                    </div>
                                  ))}
                                  {sCount > 3 && (
                                    <div className="text-[10px] text-slate-400 italic">...aur {sCount - 3} mazeed Short questions</div>
                                  )}
                                </div>
                              )}

                              {/* Long Questions Preview */}
                              {lCount > 0 && (
                                <div className="space-y-1 pt-1">
                                  <span className="text-[10px] font-bold text-amber-700 uppercase">Long Questions:</span>
                                  {topic.longQuestions.slice(0, 2).map((l, idx) => (
                                    <div key={idx} className="p-1.5 rounded bg-white border border-slate-200 text-[11px] text-slate-800">
                                      {idx + 1}. {l.question}
                                    </div>
                                  ))}
                                  {lCount > 2 && (
                                    <div className="text-[10px] text-slate-400 italic">...aur {lCount - 2} mazeed Long questions</div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}

                    {chTopics.length === 0 && (
                      <div className="text-center py-3 text-xs text-slate-400">
                        Is chapter mein abhi koi topics/questions nahi hain.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {currentChapters.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200 p-4">
              Is subject mein abhi koi material upload nahi hua. Material upload karne ke liye upar Navbar mein "2. Material Upload Karein" tab par jayein.
            </div>
          )}
        </div>
      </div>

      {/* 4. PAPER GENERATION MODE (AUTO OR MANUAL PICKER) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-1">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              4. Choose Questions (Auto vs Manual)
            </span>
            <p className="text-[11px] text-slate-500">
              Sawal khud chunein ya auto quantity specify karein:
            </p>
          </div>
        </div>

        {/* Big Manual Question Checklist Button */}
        <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-indigo-600" />
              <span>📋 Sawalat Khud Chunein (Checklist Mode)</span>
            </div>
            <p className="text-[11px] text-indigo-700/80 mt-0.5">
              Har MCQs, Short aur Long sawal samne aayega, apni marzi se tick karein.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenManualPicker}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 active:scale-95"
          >
            <span>Open Checklist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Shuffle className="w-3.5 h-3.5 text-blue-600" />
            <span>⚡ Ya Auto Mode (Quantity Specify Karein):</span>
          </span>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isRandom}
              onChange={(e) => setIsRandom(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600"
            />
            <span>Shuffle Pick</span>
          </label>
        </div>

        {/* Section A: MCQs Counter */}
        <div className="p-3 bg-slate-50 rounded-xl border border-indigo-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Section A: MCQs</span>
            <span className="text-indigo-600 font-semibold text-[11px]">
              (Available in selected topics: {totalAvailMcqs})
            </span>
            <span className="text-emerald-600 font-extrabold text-[11px]">
              {mcqCount * mcqMarks} Marks
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Quantity:</label>
              <div className="flex items-center bg-white rounded-lg border border-slate-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setMcqCount(Math.max(0, mcqCount - 1))}
                  className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max={totalAvailMcqs}
                  value={mcqCount}
                  onChange={(e) => setMcqCount(Math.min(totalAvailMcqs, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full text-center bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setMcqCount(Math.min(totalAvailMcqs, mcqCount + 1))}
                  disabled={mcqCount >= totalAvailMcqs}
                  className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Marks / MCQ:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={mcqMarks}
                onChange={(e) => setMcqMarks(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 py-1 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section B: Short Questions Counter */}
        <div className="p-3 bg-slate-50 rounded-xl border border-blue-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Section B: Short Questions</span>
            <span className="text-blue-600 font-semibold text-[11px]">
              (Available in selected topics: {totalAvailShorts})
            </span>
            <span className="text-emerald-600 font-extrabold text-[11px]">
              {shortCount * shortMarks} Marks
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Quantity:</label>
              <div className="flex items-center bg-white rounded-lg border border-slate-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShortCount(Math.max(0, shortCount - 1))}
                  className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max={totalAvailShorts}
                  value={shortCount}
                  onChange={(e) => setShortCount(Math.min(totalAvailShorts, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full text-center bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShortCount(Math.min(totalAvailShorts, shortCount + 1))}
                  disabled={shortCount >= totalAvailShorts}
                  className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Marks / Short:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={shortMarks}
                onChange={(e) => setShortMarks(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 py-1 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section C: Long Questions Counter */}
        <div className="p-3 bg-slate-50 rounded-xl border border-amber-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Section C: Long / Essay</span>
            <span className="text-amber-600 font-semibold text-[11px]">
              (Available in selected topics: {totalAvailLongs})
            </span>
            <span className="text-emerald-600 font-extrabold text-[11px]">
              {longCount * longMarks} Marks
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Quantity:</label>
              <div className="flex items-center bg-white rounded-lg border border-slate-300 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setLongCount(Math.max(0, longCount - 1))}
                  className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max={totalAvailLongs}
                  value={longCount}
                  onChange={(e) => setLongCount(Math.min(totalAvailLongs, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full text-center bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setLongCount(Math.min(totalAvailLongs, longCount + 1))}
                  disabled={longCount >= totalAvailLongs}
                  className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-500 block mb-1">Marks / Long:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={longMarks}
                onChange={(e) => setLongMarks(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 py-1 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Paper Total Marks Summary */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-600 font-semibold uppercase">Total Paper Marks:</span>
          <span className="text-sm font-extrabold text-indigo-700">{totalPaperMarks} Marks</span>
        </div>

        {/* Big Action Button */}
        <button
          type="button"
          onClick={onGeneratePaper}
          disabled={selectedTopicIds.length === 0}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4 text-indigo-200 animate-pulse" />
          <span>⚡ Generate Paper from Selected Topics</span>
        </button>
      </div>

    </div>
  );
}
