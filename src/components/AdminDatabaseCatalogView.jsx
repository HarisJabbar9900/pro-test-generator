import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, Layers, BookOpen, FolderTree, CheckCircle2, 
  Search, RefreshCw, ChevronDown, ChevronUp, ChevronRight, FileText, 
  ExternalLink, Sparkles, Filter, Hash, AlertCircle, ArrowUpRight, Cloud, X
} from 'lucide-react';
import { fetchUploadedMaterialsFromFirebase } from '../utils/firebaseBankService';

export default function AdminDatabaseCatalogView({
  bank = {},
  onSelectTopic,
  onRefreshDatabase,
  isRefreshing = false
}) {
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyWithQuestions, setOnlyWithQuestions] = useState(false);
  const [expandedClasses, setExpandedClasses] = useState(['9th', '10th', '11th', '12th']);
  const [expandedSubjects, setExpandedSubjects] = useState([]);
  
  // Uploaded documents from Firestore uploaded_materials collection
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showDocsSection, setShowDocsSection] = useState(false);

  // Load uploaded materials from Firestore
  useEffect(() => {
    let isMounted = true;
    setLoadingDocs(true);
    fetchUploadedMaterialsFromFirebase().then(res => {
      if (isMounted && res.success) {
        setUploadedDocs(res.materials || []);
      }
      if (isMounted) setLoadingDocs(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Compute Overall Database Statistics
  const overallStats = useMemo(() => {
    const classKeys = Object.keys(bank);
    let totalSubjects = 0;
    let totalChapters = 0;
    let totalTopics = 0;
    let totalMcqs = 0;
    let totalShorts = 0;
    let totalLongs = 0;

    const classBreakdowns = {};

    classKeys.forEach(cls => {
      const clsData = bank[cls] || { subjects: [] };
      const subs = clsData.subjects || [];
      totalSubjects += subs.length;

      let clsChs = 0;
      let clsTops = 0;
      let clsM = 0;
      let clsS = 0;
      let clsL = 0;

      subs.forEach(sub => {
        const chs = sub.chapters || [];
        clsChs += chs.length;
        totalChapters += chs.length;

        chs.forEach(ch => {
          const tops = ch.topics || [];
          clsTops += tops.length;
          totalTopics += tops.length;

          tops.forEach(t => {
            const m = t.mcqs?.length || 0;
            const s = t.shortQuestions?.length || 0;
            const l = t.longQuestions?.length || 0;
            clsM += m;
            clsS += s;
            clsL += l;
            totalMcqs += m;
            totalShorts += s;
            totalLongs += l;
          });
        });
      });

      classBreakdowns[cls] = {
        className: clsData.className || `${cls} Class`,
        subjectsCount: subs.length,
        chaptersCount: clsChs,
        topicsCount: clsTops,
        mcqs: clsM,
        shorts: clsS,
        longs: clsL,
        totalQuestions: clsM + clsS + clsL
      };
    });

    return {
      classesCount: classKeys.length,
      totalSubjects,
      totalChapters,
      totalTopics,
      totalMcqs,
      totalShorts,
      totalLongs,
      grandTotalQuestions: totalMcqs + totalShorts + totalLongs,
      classBreakdowns
    };
  }, [bank]);

  // Sort classes in natural sequence: 9th, 10th, 11th, 12th...
  const sortedClassKeys = useMemo(() => {
    const naturalOrder = ['9th', '10th', '11th', '12th'];
    return Object.keys(bank).sort((a, b) => {
      const idxA = naturalOrder.indexOf(a);
      const idxB = naturalOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [bank]);

  // Toggle class accordion
  const toggleClassExpand = (clsKey) => {
    setExpandedClasses(prev => 
      prev.includes(clsKey) ? prev.filter(k => k !== clsKey) : [...prev, clsKey]
    );
  };

  // Toggle subject accordion
  const toggleSubjectExpand = (subId) => {
    setExpandedSubjects(prev => 
      prev.includes(subId) ? prev.filter(id => id !== subId) : [...prev, subId]
    );
  };

  const expandAll = () => {
    setExpandedClasses(Object.keys(bank));
    const allSubIds = [];
    Object.keys(bank).forEach(cls => {
      (bank[cls]?.subjects || []).forEach(sub => allSubIds.push(sub.id));
    });
    setExpandedSubjects(allSubIds);
  };

  const collapseAll = () => {
    setExpandedClasses([]);
    setExpandedSubjects([]);
  };

  // Filtered classes & content
  const filteredClasses = useMemo(() => {
    const classKeys = Object.keys(bank);
    const q = searchQuery.toLowerCase().trim();

    return classKeys.filter(clsKey => {
      if (selectedClassFilter !== 'ALL' && selectedClassFilter !== clsKey) {
        return false;
      }
      return true;
    }).map(clsKey => {
      const clsData = bank[clsKey] || { subjects: [] };
      const matchingSubjects = (clsData.subjects || []).map(sub => {
        const subNameMatches = !q || sub.name?.toLowerCase().includes(q);

        const matchingChapters = (sub.chapters || []).map(ch => {
          const chNameMatches = !q || ch.name?.toLowerCase().includes(q) || String(ch.chapterNumber).includes(q);

          const matchingTopics = (ch.topics || []).filter(t => {
            const hasQ = (t.mcqs?.length || 0) + (t.shortQuestions?.length || 0) + (t.longQuestions?.length || 0) > 0;
            if (onlyWithQuestions && !hasQ) return false;

            if (!q) return true;
            if (subNameMatches || chNameMatches) return true;
            return (
              (t.name || '').toLowerCase().includes(q) || 
              (t.topicNumber || '').toLowerCase().includes(q)
            );
          });

          if (matchingTopics.length > 0 || (!onlyWithQuestions && (subNameMatches || chNameMatches))) {
            return {
              ...ch,
              topics: matchingTopics
            };
          }
          return null;
        }).filter(Boolean);

        if (matchingChapters.length > 0 || (!onlyWithQuestions && subNameMatches)) {
          return {
            ...sub,
            chapters: matchingChapters
          };
        }
        return null;
      }).filter(Boolean);

      return {
        key: clsKey,
        className: clsData.className || `${clsKey} Class`,
        subjects: matchingSubjects
      };
    }).filter(c => c.subjects.length > 0 || !q);
  }, [bank, selectedClassFilter, searchQuery, onlyWithQuestions]);

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-slate-800 animate-fadeIn">
      
      {/* TOP HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-800/40">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
              <Database className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
              Live Database Catalog
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              Firebase Synced
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Question Bank Database Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Aapke database mein mojood tamam <strong>Classes</strong>, <strong>Subjects</strong>, <strong>Chapters</strong>, <strong>Topics</strong> aur <strong>Questions (MCQs, Shorts, Longs)</strong> ka live real-time record.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onRefreshDatabase}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live DB'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDocsSection(!showDocsSection)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              showDocsSection 
                ? 'bg-cyan-500 text-slate-900 border-cyan-400' 
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Uploaded Files ({uploadedDocs.length})</span>
          </button>
        </div>
      </div>

      {/* 8-CARD LIVE KPI DASHBOARD ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Card 1: Classes */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Classes</span>
          <span className="text-2xl font-black text-slate-900 mt-0.5 block">{overallStats.classesCount}</span>
          <span className="text-[10px] text-blue-600 font-semibold block">In Database</span>
        </div>

        {/* Card 2: Subjects */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Subjects</span>
          <span className="text-2xl font-black text-blue-600 mt-0.5 block">{overallStats.totalSubjects}</span>
          <span className="text-[10px] text-slate-500 font-semibold block">Across Classes</span>
        </div>

        {/* Card 3: Chapters */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Chapters</span>
          <span className="text-2xl font-black text-indigo-600 mt-0.5 block">{overallStats.totalChapters}</span>
          <span className="text-[10px] text-slate-500 font-semibold block">Total Registered</span>
        </div>

        {/* Card 4: Topics */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 block uppercase">Topics</span>
          <span className="text-2xl font-black text-purple-600 mt-0.5 block">{overallStats.totalTopics}</span>
          <span className="text-[10px] text-slate-500 font-semibold block">Configured</span>
        </div>

        {/* Card 5: Real-time MCQs */}
        <div className="bg-white p-3.5 rounded-xl border border-cyan-200 shadow-2xs bg-cyan-50/30">
          <span className="text-[11px] font-bold text-cyan-800 block uppercase">Total MCQs</span>
          <span className="text-2xl font-black text-cyan-600 mt-0.5 block">{overallStats.totalMcqs}</span>
          <span className="text-[10px] text-cyan-700 font-semibold block">Live Questions</span>
        </div>

        {/* Card 6: Real-time Shorts */}
        <div className="bg-white p-3.5 rounded-xl border border-indigo-200 shadow-2xs bg-indigo-50/30">
          <span className="text-[11px] font-bold text-indigo-800 block uppercase">Short Qs</span>
          <span className="text-2xl font-black text-indigo-600 mt-0.5 block">{overallStats.totalShorts}</span>
          <span className="text-[10px] text-indigo-700 font-semibold block">Live Questions</span>
        </div>

        {/* Card 7: Real-time Longs */}
        <div className="bg-white p-3.5 rounded-xl border border-purple-200 shadow-2xs bg-purple-50/30">
          <span className="text-[11px] font-bold text-purple-800 block uppercase">Long Qs</span>
          <span className="text-2xl font-black text-purple-600 mt-0.5 block">{overallStats.totalLongs}</span>
          <span className="text-[10px] text-purple-700 font-semibold block">Live Questions</span>
        </div>

        {/* Card 8: Grand Total Questions */}
        <div className="bg-white p-3.5 rounded-xl border border-emerald-300 shadow-2xs bg-emerald-50/40">
          <span className="text-[11px] font-bold text-emerald-800 block uppercase">Grand Total</span>
          <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{overallStats.grandTotalQuestions}</span>
          <span className="text-[10px] text-emerald-700 font-semibold block">All Questions</span>
        </div>
      </div>

      {/* OPTIONAL: UPLOADED RAW DOCUMENTS HISTORY SECTION */}
      {showDocsSection && (
        <div className="bg-white rounded-2xl border border-cyan-200 shadow-sm p-5 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-cyan-100 text-cyan-800 rounded-lg">
                <FileText className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-black text-slate-800">
                Uploaded Files History in Firestore (uploaded_materials collection)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-bold">
              {uploadedDocs.length} Total Uploaded Documents
            </span>
          </div>

          {loadingDocs ? (
            <div className="py-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-cyan-600" />
              <span>Fetching uploaded files list from Firebase Firestore...</span>
            </div>
          ) : uploadedDocs.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 italic">
              Abhi tak koi file document Firestore mein upload nahi hui.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2.5 px-3">File Name</th>
                    <th className="py-2.5 px-3">Class</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-3">Chapter</th>
                    <th className="py-2.5 px-3">Topic</th>
                    <th className="py-2.5 px-3 text-center">MCQs</th>
                    <th className="py-2.5 px-3 text-center">Shorts</th>
                    <th className="py-2.5 px-3 text-center">Longs</th>
                    <th className="py-2.5 px-3">Upload Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {uploadedDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate max-w-[180px]">{doc.fileName}</span>
                      </td>
                      <td className="py-2 px-3 font-semibold text-blue-700">{doc.gradeClass}</td>
                      <td className="py-2 px-3 font-medium text-slate-800">{doc.subjectName}</td>
                      <td className="py-2 px-3 text-slate-600 truncate max-w-[160px]">{doc.chapterName}</td>
                      <td className="py-2 px-3 text-slate-700 truncate max-w-[180px]">
                        <span className="font-mono font-bold bg-amber-50 text-amber-800 px-1 rounded border border-amber-200 mr-1">
                          {doc.topicNumber}
                        </span>
                        {doc.topicName}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-cyan-700">
                        {doc.totalMcqs || doc.mcqs?.length || 0}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-indigo-700">
                        {doc.totalShorts || doc.shortQuestions?.length || 0}
                      </td>
                      <td className="py-2 px-3 text-center font-mono font-bold text-purple-700">
                        {doc.totalLongs || doc.longQuestions?.length || 0}
                      </td>
                      <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">
                        {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString('en-GB') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR (CLEAN 2-TIER MODERN SAAS BAR) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        
        {/* ROW 1: FILTER CLASS TABS */}
        <div className="p-3 bg-slate-50/70 flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-1 select-none">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Filter Class:</span>
            </span>

            {/* All Classes Pill */}
            <button
              type="button"
              onClick={() => setSelectedClassFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                selectedClassFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>All Classes</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                selectedClassFilter === 'ALL' ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {overallStats.classesCount}
              </span>
            </button>

            {/* Individual Class Pills Sorted 9th, 10th, 11th, 12th */}
            {sortedClassKeys.map(clsKey => {
              const b = overallStats.classBreakdowns[clsKey] || {};
              const isSelected = selectedClassFilter === clsKey;
              return (
                <button
                  key={clsKey}
                  type="button"
                  onClick={() => setSelectedClassFilter(clsKey)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{clsKey} Class</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-black ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {b.totalQuestions || 0} Qs
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs font-medium text-slate-400 hidden lg:block">
            Showing <strong className="text-slate-700">{filteredClasses.length}</strong> of {overallStats.classesCount} classes
          </div>
        </div>

        {/* ROW 2: SEARCH INPUT + ADVANCED FILTERS & EXPAND/COLLAPSE */}
        <div className="p-3 flex items-center justify-between flex-wrap gap-3 bg-white">
          {/* Search Box - Wide & Roomy with Clear Button */}
          <div className="relative flex-1 min-w-[260px] max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search subject, chapter, or topic name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Toggle Only With Questions */}
            <label className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer select-none transition-all ${
              onlyWithQuestions
                ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
            }`}>
              <input
                type="checkbox"
                checked={onlyWithQuestions}
                onChange={(e) => setOnlyWithQuestions(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span>With Questions Only</span>
            </label>

            {/* Expand / Collapse Segmented Button Group */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-2xs">
              <button
                type="button"
                onClick={expandAll}
                className="px-3 py-1.5 hover:bg-white text-slate-700 text-xs font-bold transition-colors cursor-pointer border-r border-slate-200 flex items-center gap-1"
                title="Expand all classes & chapters"
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Expand All</span>
              </button>
              <button
                type="button"
                onClick={collapseAll}
                className="px-3 py-1.5 hover:bg-white text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                title="Collapse all"
              >
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                <span>Collapse</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* DETAILED HIERARCHY TREE / CARDS ACCORDION */}
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
            <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No Matching Content Found</h3>
            <p className="text-xs mt-1">Try clearing search filters or add new classes/subjects from the manager.</p>
          </div>
        ) : (
          filteredClasses.map(clsObj => {
            const isClsExpanded = expandedClasses.includes(clsObj.key);
            const breakdown = overallStats.classBreakdowns[clsObj.key] || {};

            return (
              <div 
                key={clsObj.key}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Class Header Bar */}
                <div 
                  onClick={() => toggleClassExpand(clsObj.key)}
                  className="bg-slate-900 hover:bg-slate-800 text-white p-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                      {isClsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                        <span>{clsObj.className}</span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30">
                          {clsObj.subjects.length} Subjects Added
                        </span>
                      </h2>
                    </div>
                  </div>

                  {/* Class Live Counter Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {breakdown.chaptersCount || 0} Chapters
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {breakdown.topicsCount || 0} Topics
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                      {breakdown.mcqs || 0} MCQs
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                      {breakdown.shorts || 0} Shorts
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-bold">
                      {breakdown.longs || 0} Longs
                    </span>
                  </div>
                </div>

                {/* Class Subjects Content */}
                {isClsExpanded && (
                  <div className="p-4 sm:p-5 space-y-4 bg-slate-50/40 divide-y divide-slate-100">
                    {clsObj.subjects.length === 0 ? (
                      <div className="text-xs text-slate-400 italic py-2">
                        Is class mein abhi koi subject nahi hai.
                      </div>
                    ) : (
                      clsObj.subjects.map(sub => {
                        const isSubExpanded = expandedSubjects.includes(sub.id);

                        // Subject counts
                        let subMcqs = 0, subShorts = 0, subLongs = 0, subTopicsCount = 0;
                        (sub.chapters || []).forEach(ch => {
                          const tList = ch.topics || [];
                          subTopicsCount += tList.length;
                          tList.forEach(t => {
                            subMcqs += (t.mcqs?.length || 0);
                            subShorts += (t.shortQuestions?.length || 0);
                            subLongs += (t.longQuestions?.length || 0);
                          });
                        });
                        const subTotalQs = subMcqs + subShorts + subLongs;

                        return (
                          <div key={sub.id} className="pt-3 first:pt-0">
                            {/* Subject Row Header */}
                            <div 
                              onClick={() => toggleSubjectExpand(sub.id)}
                              className="bg-white p-3 rounded-xl border border-slate-200 hover:border-blue-300 transition-all flex flex-wrap items-center justify-between gap-2 cursor-pointer select-none shadow-2xs"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-5 h-5 rounded bg-blue-50 text-blue-600 flex items-center justify-center">
                                  {isSubExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </div>
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                <h3 className="font-bold text-sm text-slate-900">
                                  {sub.name}
                                </h3>
                                <span className="text-[11px] text-slate-500 font-semibold">
                                  ({sub.chapters?.length || 0} Chapters • {subTopicsCount} Topics)
                                </span>
                              </div>

                              <div className="flex items-center gap-2 font-mono text-[11px]">
                                <span className={`px-2 py-0.5 rounded font-bold ${
                                  subMcqs > 0 ? 'bg-cyan-50 text-cyan-700 border border-cyan-200' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {subMcqs} MCQs
                                </span>
                                <span className={`px-2 py-0.5 rounded font-bold ${
                                  subShorts > 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {subShorts} Shorts
                                </span>
                                <span className={`px-2 py-0.5 rounded font-bold ${
                                  subLongs > 0 ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-slate-400'
                                }`}>
                                  {subLongs} Longs
                                </span>
                                <span className="text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                                  {subTotalQs} Total Qs
                                </span>
                              </div>
                            </div>

                            {/* Chapters & Topics Accordion Body */}
                            {isSubExpanded && (
                              <div className="mt-2 ml-4 pl-3 border-l-2 border-blue-200 space-y-3">
                                {(sub.chapters || []).length === 0 ? (
                                  <div className="text-xs text-slate-400 italic py-1">
                                    Is subject mein abhi koi chapter nahi hai.
                                  </div>
                                ) : (
                                  (sub.chapters || []).map(ch => {
                                    const chTopics = ch.topics || [];
                                    const chM = chTopics.reduce((acc, t) => acc + (t.mcqs?.length || 0), 0);
                                    const chS = chTopics.reduce((acc, t) => acc + (t.shortQuestions?.length || 0), 0);
                                    const chL = chTopics.reduce((acc, t) => acc + (t.longQuestions?.length || 0), 0);

                                    return (
                                      <div key={ch.id} className="bg-white rounded-xl border border-slate-200 p-3 space-y-2.5 shadow-2xs">
                                        {/* Chapter Info */}
                                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-xs bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                                              Ch #{ch.chapterNumber}
                                            </span>
                                            <h4 className="font-bold text-xs text-slate-900">
                                              {ch.name}
                                            </h4>
                                            <span className="text-[10px] text-slate-500 font-semibold">
                                              ({chTopics.length} Topics)
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                            <span className="text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200 font-bold">{chM} M</span>
                                            <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 font-bold">{chS} S</span>
                                            <span className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-bold">{chL} L</span>
                                          </div>
                                        </div>

                                        {/* Topics Grid */}
                                        {chTopics.length === 0 ? (
                                          <div className="text-[11px] text-slate-400 italic">
                                            Is chapter mein abhi koi topic nahi hai.
                                          </div>
                                        ) : (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {chTopics.map(t => {
                                              const mCount = t.mcqs?.length || 0;
                                              const sCount = t.shortQuestions?.length || 0;
                                              const lCount = t.longQuestions?.length || 0;
                                              const totalQ = mCount + sCount + lCount;

                                              return (
                                                <div 
                                                  key={t.id}
                                                  className={`p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                                                    totalQ > 0 
                                                      ? 'bg-blue-50/40 border-blue-200 hover:border-blue-400' 
                                                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                  }`}
                                                >
                                                  <div className="flex items-start justify-between gap-1.5">
                                                    <div className="min-w-0">
                                                      <div className="flex items-center gap-1.5">
                                                        <span className="font-mono font-bold text-[10px] bg-white border border-slate-300 px-1 rounded text-slate-800">
                                                          {t.topicNumber}
                                                        </span>
                                                        <span className="font-bold text-xs text-slate-900 truncate block">
                                                          {t.name}
                                                        </span>
                                                      </div>
                                                    </div>

                                                    {totalQ > 0 ? (
                                                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0 flex items-center gap-0.5">
                                                        <CheckCircle2 className="w-2.5 h-2.5" />
                                                        Active
                                                      </span>
                                                    ) : (
                                                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600 shrink-0">
                                                        Empty
                                                      </span>
                                                    )}
                                                  </div>

                                                  {/* Questions Badges & Action Button */}
                                                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                                    <div className="flex items-center gap-1 font-mono text-[10px]">
                                                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                                                        mCount > 0 ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' : 'text-slate-400'
                                                      }`}>
                                                        {mCount} M
                                                      </span>
                                                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                                                        sCount > 0 ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'text-slate-400'
                                                      }`}>
                                                        {sCount} S
                                                      </span>
                                                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                                                        lCount > 0 ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'text-slate-400'
                                                      }`}>
                                                        {lCount} L
                                                      </span>
                                                    </div>

                                                    {/* Quick Select & Manage Button */}
                                                    {onSelectTopic && (
                                                      <button
                                                        type="button"
                                                        onClick={() => onSelectTopic(clsObj.key, sub.id, ch.id, t.id)}
                                                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 cursor-pointer ml-1 shrink-0"
                                                        title="Select this topic in manager"
                                                      >
                                                        <span>Manage</span>
                                                        <ArrowUpRight className="w-3 h-3" />
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
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
