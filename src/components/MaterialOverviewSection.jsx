import React, { useState } from 'react';
import { 
  FolderTree, BookOpen, Layers, Hash, Trash2, Search, 
  FileText, ArrowRight, AlertTriangle, CheckCircle2, Cloud,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { deleteTopicFromChapter, deleteChapterFromSubject } from '../utils/questionBankService';
import { deleteTopicFromFirebase, deleteChapterFromFirebase } from '../utils/firebaseBankService';
import { confirmAction } from '../utils/confirmDialog';

export default function MaterialOverviewSection({
  bank,
  selectedClass,
  setSelectedClass,
  onBankUpdated,
  onGoToGenerator,
  onGoToUpload
}) {
  const [activeClass, setActiveClass] = useState(selectedClass || '9th');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  // Accordion state: which chapters are expanded/open dropdowns
  const [expandedChapterIds, setExpandedChapterIds] = useState([]);

  const toggleChapterDropdown = (chapterId) => {
    setExpandedChapterIds(prev => 
      prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
    );
  };

  const expandAllChapters = (chapters) => {
    setExpandedChapterIds(chapters.map(c => c.id));
  };

  const collapseAllChapters = () => {
    setExpandedChapterIds([]);
  };

  const currentClassData = bank[activeClass] || { subjects: [] };
  const subjects = currentClassData.subjects || [];

  // Active subject filter (default to first subject if not set or invalid)
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  // Handler to delete a topic
  const handleDeleteTopic = async (chapterId, topicId, topicName, topicNumber) => {
    confirmAction({
      title: "Delete Topic",
      message: `Kya aap waqai Topic "${topicNumber}: ${topicName}" ko Question Bank aur Firebase se delete karna chahte hain?`,
      confirmText: "Delete Topic",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        const res = deleteTopicFromChapter(activeClass, activeSubject.id, chapterId, topicId);
        if (res.success) {
          onBankUpdated(res.bank);
          await deleteTopicFromFirebase(activeClass, activeSubject.id, chapterId, topicId).catch(err => console.warn(err));
        }
      }
    });
  };

  // Handler to delete a chapter
  const handleDeleteChapter = async (chapterId, chapterName) => {
    confirmAction({
      title: "Delete Chapter",
      message: `Kya aap waqai Chapter "${chapterName}" aur iske saare topics delete karna chahte hain?`,
      confirmText: "Delete Chapter",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        const res = deleteChapterFromSubject(activeClass, activeSubject.id, chapterId);
        if (res.success) {
          onBankUpdated(res.bank);
          await deleteChapterFromFirebase(activeClass, activeSubject.id, chapterId).catch(err => console.warn(err));
        }
      }
    });
  };

  // Filter chapters and topics by search query
  const filteredChapters = (activeSubject?.chapters || []).map(ch => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return ch;

    const chMatches = (ch.name || '').toLowerCase().includes(q) || String(ch.chapterNumber).includes(q);
    const matchingTopics = (ch.topics || []).filter(t => 
      (t.name || '').toLowerCase().includes(q) || (t.topicNumber || '').toLowerCase().includes(q)
    );

    if (chMatches) return ch;
    if (matchingTopics.length > 0) return { ...ch, topics: matchingTopics };
    return null;
  }).filter(Boolean);

  // Total topics count for this subject
  const totalTopicsInSubject = (activeSubject?.chapters || []).reduce(
    (sum, ch) => sum + (ch.topics?.length || 0), 0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn text-slate-800 space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-indigo-50/80 via-white to-blue-50/80 border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
            <FolderTree className="w-4 h-4" />
            <span>Class-wise & Subject-wise Question Bank Catalog</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Uploaded Material Directory (Topics List)
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Yahan aap dekh sakte hain ke har Class aur Subject mein konse Chapter aur Topics upload ho chuke hain taake koi duplicate topic number ya naam dobara upload na ho.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGoToUpload}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Naya Topic Upload Karein</span>
          </button>
          <button
            onClick={onGoToGenerator}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Test Paper Banayein</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CLASS & SUBJECT SELECTOR BAR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        
        {/* Class Selection Tabs */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            1. Class Chunein:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['9th', '10th', '11th', '12th'].map(cls => {
              const isSelected = (activeClass === cls);
              const clsSubjects = bank[cls]?.subjects || [];
              const clsTotalTopics = clsSubjects.reduce(
                (sum, s) => sum + (s.chapters || []).reduce((cSum, ch) => cSum + (ch.topics?.length || 0), 0), 0
              );

              return (
                <button
                  key={cls}
                  onClick={() => {
                    setActiveClass(cls);
                    setSelectedClass(cls);
                    const firstSub = bank[cls]?.subjects[0];
                    setSelectedSubjectId(firstSub?.id || null);
                  }}
                  className={`p-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <span className="text-sm">{cls} Class</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {clsTotalTopics} Topics
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Selection Tabs */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Subject Chunein ({subjects.length} Available):
            </label>
            {activeSubject && (
              <span className="text-xs text-indigo-600 font-semibold">
                Selected: <strong className="text-slate-900">{activeSubject.name}</strong> ({totalTopicsInSubject} Topics Uploaded)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {subjects.map(sub => {
              const isSelected = (activeSubject?.id === sub.id);
              const subTopicsCount = (sub.chapters || []).reduce(
                (sum, ch) => sum + (ch.topics?.length || 0), 0
              );

              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{sub.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {subTopicsCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* SEARCH BAR & COUNTERS WITH EXPAND/COLLAPSE ALL */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search Topic Number ya Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span>Chapters: <strong className="text-slate-900">{filteredChapters.length}</strong></span>
          <span>•</span>
          <span>Topics Uploaded: <strong className="text-indigo-600 font-bold">{totalTopicsInSubject}</strong></span>
          <span>•</span>
          {/* Expand / Collapse All */}
          <button
            onClick={() => expandAllChapters(filteredChapters)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
          >
            Expand All
          </button>
          <span>/</span>
          <button
            onClick={collapseAllChapters}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* CHAPTERS & TOPICS ACCORDION / DROPDOWN LIST (COMPACT FIT-CONTENT) */}
      <div className="flex flex-col items-start gap-3">
        {filteredChapters.length === 0 ? (
          <div className="w-full text-center py-16 bg-white border border-dashed border-slate-300 rounded-2xl p-6 shadow-sm">
            <FolderTree className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Koi Upload Shuda Topic Nahi Mila</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery 
                ? `Search query "${searchQuery}" se koi topic match nahi hua.` 
                : `${activeClass} Class ke subject "${activeSubject?.name || ''}" mein abhi koi material upload nahi hua.`}
            </p>
            <button
              onClick={onGoToUpload}
              className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>+ Is Subject Mein Material Upload Karein</span>
            </button>
          </div>
        ) : (
          filteredChapters.map(ch => {
            const chTopics = ch.topics || [];
            // If user searched, auto-expand, otherwise respect user dropdown toggle
            const isExpanded = searchQuery.trim().length > 0 || expandedChapterIds.includes(ch.id);

            return (
              <div
                key={ch.id}
                className="inline-block max-w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                {/* Chapter Title Bar (CLICKABLE DROPDOWN HEADER - FIT CONTENT) */}
                <div 
                  onClick={() => toggleChapterDropdown(ch.id)}
                  className="bg-slate-50 hover:bg-slate-100/80 px-4 py-2.5 flex items-center gap-3 cursor-pointer transition-colors select-none"
                >
                  <div className="flex items-center gap-2">
                    {/* Expand/Collapse Chevron */}
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold text-xs">
                      Ch {ch.chapterNumber}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap">
                      {ch.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold border transition-all whitespace-nowrap ${
                      isExpanded 
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}>
                      {chTopics.length} Topics {isExpanded ? '▲' : '▼'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChapter(ch.id, ch.name);
                      }}
                      title="Delete Entire Chapter"
                      className="p-1 text-slate-400 hover:text-rose-600 transition-all rounded hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Topics Dropdown Container (FIT CONTENT CHIPS) */}
                {isExpanded && (
                  <div className="p-3 bg-slate-50/50 border-t border-slate-200 animate-fadeIn">
                    {chTopics.length === 0 ? (
                      <div className="text-xs text-slate-400 italic py-1">
                        Is chapter mein abhi koi topics upload nahi kiye gaye.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {chTopics.map(top => (
                          <div
                            key={top.id}
                            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl px-3 py-1.5 transition-all group shadow-2xs"
                          >
                            {/* Topic Number Badge */}
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-mono font-bold text-xs shrink-0">
                              {top.topicNumber}
                            </span>

                            {/* Topic Name */}
                            <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 whitespace-nowrap">
                              {top.name}
                            </span>

                            {/* Real-time Questions Badges */}
                            <div className="flex items-center gap-1 font-mono text-[10px]">
                              <span className={`px-1.5 py-0.5 rounded font-bold ${
                                (top.mcqs?.length || 0) > 0 ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {top.mcqs?.length || 0} MCQs
                              </span>
                              <span className={`px-1.5 py-0.5 rounded font-bold ${
                                (top.shortQuestions?.length || 0) > 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {top.shortQuestions?.length || 0} Shorts
                              </span>
                              <span className={`px-1.5 py-0.5 rounded font-bold ${
                                (top.longQuestions?.length || 0) > 0 ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {top.longQuestions?.length || 0} Longs
                              </span>
                            </div>

                            <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span className="hidden sm:inline">Active</span>
                            </span>

                            {/* Delete Topic Action */}
                            <button
                              onClick={() => handleDeleteTopic(ch.id, top.id, top.name, top.topicNumber)}
                              title="Delete this topic"
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-all shrink-0 cursor-pointer ml-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
