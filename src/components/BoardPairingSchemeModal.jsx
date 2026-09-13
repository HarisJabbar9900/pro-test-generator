import React, { useState, useMemo } from 'react';
import { 
  X, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileText, 
  Clock, 
  BookOpen, 
  Copy, 
  Check, 
  Printer, 
  ChevronRight, 
  ShieldCheck, 
  BarChart3,
  Flame,
  ArrowRight,
  GitMerge,
  Zap,
  CheckCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import { 
  BOARD_AUTHORITIES, 
  AVAILABLE_SCHEME_SUBJECTS,
  PAIRING_SCHEMES_DATA, 
  getBoardPairingScheme, 
  generateBoardPairingPaper 
} from '../utils/boardPairingSchemes';
import { notify } from '../utils/notify';
import confetti from 'canvas-confetti';

export default function BoardPairingSchemeModal({
  isOpen,
  onClose,
  bank = {},
  selectedClass: initialClass = '10th',
  selectedSubjectId = 'physics',
  currentUser,
  onApplyBoardPaper, // (paperData, paperConfig) => void
  appLanguage = 'ur'
}) {
  const isUrdu = appLanguage === 'ur';

  // Board selector: 'punjab' | 'federal' | 'sindh' | 'kpk'
  const [activeBoard, setActiveBoard] = useState('punjab');
  const [activeClass, setActiveClass] = useState(() => {
    return initialClass.replace(/\s*class/i, '').trim() || '10th';
  });
  const [activeSubjectId, setActiveSubjectId] = useState(selectedSubjectId || 'physics');
  const [copiedScheme, setCopiedScheme] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState('matrix'); // 'matrix' | 'flow'

  // Available classes
  const classesList = [
    { key: '10th', label: '10th Class (Matric Part-II)', badge: 'SSC-II' },
    { key: '9th', label: '9th Class (Matric Part-I)', badge: 'SSC-I' },
    { key: '12th', label: '12th Class (Inter Part-II)', badge: 'HSSC-II' },
    { key: '11th', label: '11th Class (Inter Part-I)', badge: 'HSSC-I' }
  ];

  // Active scheme data
  const currentScheme = useMemo(() => {
    return getBoardPairingScheme(activeClass, activeSubjectId, activeBoard);
  }, [activeClass, activeSubjectId, activeBoard]);

  const currentBoardMeta = BOARD_AUTHORITIES[activeBoard.toUpperCase()] || BOARD_AUTHORITIES.PUNJAB;

  // Active subject metadata
  const currentSubjectMeta = useMemo(() => {
    return AVAILABLE_SCHEME_SUBJECTS.find(s => s.id === activeSubjectId) || AVAILABLE_SCHEME_SUBJECTS[0];
  }, [activeSubjectId]);

  // Aggregate Chapter-wise Blueprint Matrix
  const chapterMatrix = useMemo(() => {
    if (!currentScheme) return [];
    const map = new Map();

    // 1. Process MCQs
    (currentScheme.mcqs?.distribution || []).forEach(m => {
      const chNum = Number(m.chapter);
      if (!map.has(chNum)) {
        map.set(chNum, {
          chapter: chNum,
          name: m.name || `Unit ${chNum}`,
          mcqs: 0,
          shortGroups: [],
          longQuestions: []
        });
      }
      const entry = map.get(chNum);
      entry.mcqs += (m.count || 0);
      if (m.name && (!entry.name || entry.name.startsWith('Unit '))) entry.name = m.name;
    });

    // 2. Process Short Questions
    (currentScheme.shortQuestions || []).forEach(sq => {
      (sq.breakdown || []).forEach(b => {
        const chNum = Number(b.chapter);
        if (!map.has(chNum)) {
          map.set(chNum, {
            chapter: chNum,
            name: b.name || `Unit ${chNum}`,
            mcqs: 0,
            shortGroups: [],
            longQuestions: []
          });
        }
        const entry = map.get(chNum);
        entry.shortGroups.push({
          qNum: sq.qNum,
          count: b.count,
          marks: (b.count || 0) * (sq.marksEach || 2)
        });
        if (b.name && (!entry.name || entry.name.startsWith('Unit '))) entry.name = b.name;
      });
    });

    // 3. Process Long Questions
    (currentScheme.longQuestions?.questions || []).forEach(lq => {
      const chNum = Number(lq.chapter);
      if (!map.has(chNum)) {
        map.set(chNum, {
          chapter: chNum,
          name: `Unit ${chNum}`,
          mcqs: 0,
          shortGroups: [],
          longQuestions: []
        });
      }
      const entry = map.get(chNum);
      entry.longQuestions.push({
        qNum: lq.qNum,
        topic: lq.topic,
        marks: currentScheme.longQuestions?.marksEach || 8
      });
    });

    // Convert to sorted array & calculate marks & percentages
    const list = Array.from(map.values()).sort((a, b) => a.chapter - b.chapter);
    const totalPossibleMarks = currentScheme.totalMarks || 60;

    return list.map(item => {
      const mcqMarks = item.mcqs * 1;
      const shortMarks = item.shortGroups.reduce((acc, g) => acc + g.marks, 0);
      const longMarks = item.longQuestions.reduce((acc, l) => acc + (l.marks >= 8 ? 4 : l.marks), 0); // approx part share
      const totalChMarks = mcqMarks + shortMarks + longMarks;
      const percentage = Math.min(100, Math.round((totalChMarks / totalPossibleMarks) * 100));

      return {
        ...item,
        mcqMarks,
        shortMarks,
        longMarks,
        totalChMarks,
        percentage
      };
    });
  }, [currentScheme]);

  if (!isOpen) return null;

  // 1-Click Generate Action
  const handleGenerateClick = () => {
    try {
      const result = generateBoardPairingPaper({
        classKey: activeClass,
        subjectId: activeSubjectId,
        boardId: activeBoard,
        bank,
        options: {
          institute: currentUser?.institute || `${currentBoardMeta.name.toUpperCase()} EXAMINATION CENTER`,
          language: 'bilingual'
        }
      });

      if (onApplyBoardPaper) {
        onApplyBoardPaper(result.paperData, result.paperConfig);
      }

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      notify.success(
        isUrdu 
          ? `${currentBoardMeta.name} کے عین مطابق پیپر تیار ہو گیا!` 
          : `${currentBoardMeta.name} pairing paper generated successfully!`,
        {
          description: isUrdu 
            ? `کل نمبر: ${result.paperConfig.totalMarks} | دورانیہ: ${result.paperConfig.timeAllowed}` 
            : `Total Marks: ${result.paperConfig.totalMarks} | Time: ${result.paperConfig.timeAllowed}`
        }
      );

      onClose();
    } catch (err) {
      console.error("Pairing generation error:", err);
      notify.error("پیپر بنانے میں خرابی", { description: err.message });
    }
  };

  // Copy scheme
  const handleCopyScheme = () => {
    if (!currentScheme) return;
    let text = `=== ${currentBoardMeta.fullName} ===\n`;
    text += `CLASS: ${activeClass} Class | SUBJECT: ${currentScheme.subjectName || currentSubjectMeta.name}\n`;
    text += `SESSION: 2025-2026 | TOTAL MARKS: ${currentScheme.totalMarks} | TIME: ${currentScheme.timeAllowed}\n\n`;
    text += `[VISUAL CHAPTER PAIRING MATRIX]\n`;
    chapterMatrix.forEach(row => {
      text += `• Unit ${row.chapter} (${row.name}): ${row.mcqs} MCQs, Shorts: ${row.shortGroups.map(g => `${g.qNum}(${g.count}Q)`).join(', ') || 'None'}, Longs: ${row.longQuestions.map(l => l.qNum).join(', ') || 'None'} (~${row.totalChMarks} Marks)\n`;
    });
    text += `\n[LONG QUESTIONS PAIRING]\n`;
    (currentScheme.longQuestions?.questions || []).forEach(lq => {
      text += `• ${lq.qNum}: ${lq.topic}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedScheme(true);
    notify.success(isUrdu ? "پیئرنگ اسکیم کاپی ہو گئی!" : "Pairing matrix copied to clipboard!");
    setTimeout(() => setCopiedScheme(false), 2500);
  };

  // Calculate section percentages for visual bar
  const totalMarks = currentScheme?.totalMarks || 60;
  const mcqMarks = currentScheme?.objectiveMarks || 12;
  const longMarks = currentScheme?.longQuestions?.totalMarks || 18;
  const shortMarks = totalMarks - mcqMarks - longMarks;
  const mcqPct = Math.round((mcqMarks / totalMarks) * 100);
  const shortPct = Math.round((shortMarks / totalMarks) * 100);
  const longPct = 100 - mcqPct - shortPct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* MODAL HEADER: COMPACT, HIGH-END BRANDED */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-5 flex items-center justify-between gap-3 border-b border-indigo-900/50 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0 font-black">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>{currentScheme?.subjectName || currentSubjectMeta.name}</span>
                  <span className="text-amber-400 font-bold">•</span>
                  <span className="text-amber-300">{activeClass}</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-200 border border-white/15 text-[10px] sm:text-xs font-bold">
                  {currentBoardMeta.badge}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-xs font-black">
                  2025–2026 New Syllabus
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-indigo-200 font-medium truncate mt-0.5">
                {currentBoardMeta.fullName} — 100% Chapter Pairing & Blueprint
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyScheme}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-white/10"
              title="Copy Pairing Matrix"
            >
              {copiedScheme ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span className="hidden sm:inline">{copiedScheme ? 'Copied' : 'Copy Matrix'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* COMPACT INTERACTIVE SELECTOR CONTROLS (BOARD, CLASS & SUBJECT) */}
        <div className="bg-slate-50 border-b border-slate-200 p-2.5 sm:p-3 space-y-2 shrink-0">
          
          {/* 1. BOARD TABS + CLASS PILLS (1 ROW ON TABLET/DESKTOP) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            {/* BOARD TABS */}
            <div className="grid grid-cols-4 gap-1 sm:gap-1.5 p-1 bg-slate-200/70 rounded-xl max-w-xl">
              {[
                { id: 'punjab', label: 'Punjab (PBCC)' },
                { id: 'federal', label: 'Federal (FBISE)' },
                { id: 'sindh', label: 'Sindh (BIEK)' },
                { id: 'kpk', label: 'KPK Boards' }
              ].map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setActiveBoard(b.id)}
                  className={`px-2 py-1.5 rounded-lg text-center text-[11px] sm:text-xs font-black transition-all cursor-pointer truncate ${
                    activeBoard === b.id
                      ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {/* CLASS PILLS */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
              {classesList.map(c => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActiveClass(c.key)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeClass === c.key
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {c.key}
                </button>
              ))}
            </div>
          </div>

          {/* 2. SUBJECT SELECTOR CHIPS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-200/60">
            <span className="text-[11px] font-black text-slate-500 uppercase shrink-0 mr-0.5">
              {isUrdu ? 'مضمون:' : 'Subject:'}
            </span>
            {AVAILABLE_SCHEME_SUBJECTS.map(s => {
              const isActive = activeSubjectId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveSubjectId(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{isUrdu ? s.urdu : s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* VISUAL BLUEPRINT BODY */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 min-h-0 bg-[#f8fafc]">
          
          {/* VISUAL MARKS WEIGHTAGE BAR & QUICK METRICS */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-slate-900">
                  {isUrdu ? '📊 امتحانی نمبروں کی تقسیم (Visual Split)' : '📊 Examination Marks Distribution'}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Total: <strong className="text-slate-900 font-black">{totalMarks} Marks</strong> ({currentScheme?.timeAllowed || '2 Hours'})
                </span>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-bold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveViewMode('matrix')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeViewMode === 'matrix' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600'
                  }`}
                >
                  {isUrdu ? 'باب وار ٹیبل' : 'Chapter Matrix'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveViewMode('flow')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activeViewMode === 'flow' ? 'bg-white text-blue-700 shadow-2xs font-black' : 'text-slate-600'
                  }`}
                >
                  {isUrdu ? 'لانگ پیئرنگ فلو' : 'Long Pairs Flow'}
                </button>
              </div>
            </div>

            {/* SEGMENTED PROGRESS WEIGHTAGE BAR */}
            <div className="space-y-1.5">
              <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200 shadow-inner">
                <div 
                  style={{ width: `${mcqPct}%` }} 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-l-full transition-all duration-500" 
                  title={`Part 1: MCQs (${mcqMarks} Marks ~ ${mcqPct}%)`}
                />
                <div 
                  style={{ width: `${shortPct}%` }} 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500" 
                  title={`Part 2: Short Questions (${shortMarks} Marks ~ ${shortPct}%)`}
                />
                <div 
                  style={{ width: `${longPct}%` }} 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-r-full transition-all duration-500" 
                  title={`Part 3: Long Questions (${longMarks} Marks ~ ${longPct}%)`}
                />
              </div>

              {/* Legend pills */}
              <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold pt-0.5 text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span>Part 1 (MCQs): <strong>{mcqMarks}M ({mcqPct}%)</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  <span>Part 2 (Shorts): <strong>{shortMarks}M ({shortPct}%)</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                  <span>Part 3 (Longs): <strong>{longMarks}M ({longPct}%)</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* VIEW MODE 1: VISUAL CHAPTER MATRIX TABLE (CONCISE, INFORMATIVE, GLANCEABLE) */}
          {activeViewMode === 'matrix' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-3 sm:px-4 w-12 text-center">Unit</th>
                      <th className="py-2.5 px-3 sm:px-4">Chapter Title</th>
                      <th className="py-2.5 px-3 text-center">MCQs</th>
                      <th className="py-2.5 px-3">Short Questions Pairing</th>
                      <th className="py-2.5 px-3">Long Questions Pairing</th>
                      <th className="py-2.5 px-3 sm:px-4 text-center">Weightage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                    {chapterMatrix.map((row) => (
                      <tr key={row.chapter} className="hover:bg-blue-50/40 transition-colors">
                        {/* Unit Number */}
                        <td className="py-2.5 px-3 sm:px-4 text-center font-black text-slate-500">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 inline-flex items-center justify-center text-[11px]">
                            {row.chapter}
                          </span>
                        </td>

                        {/* Chapter Name */}
                        <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                          {row.name}
                        </td>

                        {/* MCQs Badge */}
                        <td className="py-2.5 px-3 text-center">
                          {row.mcqs > 0 ? (
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                              {row.mcqs} MCQ{row.mcqs > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-medium">—</span>
                          )}
                        </td>

                        {/* Short Questions Grouping */}
                        <td className="py-2.5 px-3">
                          {row.shortGroups.length > 0 ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {row.shortGroups.map((g, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold"
                                  title={`${g.qNum}: ${g.count} Short Questions (${g.marks} Marks)`}
                                >
                                  <strong className="text-blue-900 font-black">{g.qNum}:</strong> {g.count} Qs
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-300 font-medium">—</span>
                          )}
                        </td>

                        {/* Long Questions Pairing */}
                        <td className="py-2.5 px-3">
                          {row.longQuestions.length > 0 ? (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {row.longQuestions.map((l, idx) => (
                                <span 
                                  key={idx} 
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold"
                                  title={l.topic}
                                >
                                  <strong className="text-emerald-900 font-black">{l.qNum}</strong>
                                  <span className="text-[10px] text-emerald-700 max-w-[130px] truncate">
                                    ({l.topic.includes('Numerical') ? 'Theory/Num' : 'Long Question'})
                                  </span>
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-300 font-medium">—</span>
                          )}
                        </td>

                        {/* Weightage Percentage Bar */}
                        <td className="py-2.5 px-3 sm:px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-black text-slate-700 text-xs">~{row.totalChMarks}M</span>
                            <span className="text-[10px] text-slate-400 font-semibold">({row.percentage}%)</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW MODE 2: VISUAL LONG QUESTION PAIRING FLOW */}
          {activeViewMode === 'flow' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>⚡ Official Subjective Section II Pairing Formula</span>
                <span className="text-blue-700 font-normal">
                  {currentScheme?.longQuestions?.instruction || 'Attempt required questions'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(currentScheme?.longQuestions?.questions || []).map((lq, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs shadow-2xs">
                          {lq.qNum}
                        </span>
                        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {currentScheme.longQuestions?.marksEach || 8} Marks
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-emerald-50/40 transition-colors">
                        <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                          Paired Unit: Chapter {lq.chapter}
                        </span>
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          {lq.topic}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Standard Choice</span>
                      <span className="text-emerald-700 font-black">100% Board Pattern</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMPACT BOARD STATUTORY NOTES */}
          <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isUrdu ? 'تمام سوالات بورڈ کی سرکاری نئی کتابوں کے نصاب کے عین مطابق تیار کیے جاتے ہیں۔' : 'Conforms with the 2025-2026 textbook revised syllabus.'}</span>
            </div>
            <div className="text-slate-500 text-[11px] font-bold">
              {currentBoardMeta.boardsList.slice(0, 3).join(', ')} + {currentBoardMeta.boardsList.length > 3 ? `${currentBoardMeta.boardsList.length - 3} more` : ''}
            </div>
          </div>
        </div>

        {/* BOTTOM STICKY ACTION BAR */}
        <div className="bg-white border-t border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="text-xs text-slate-500 font-semibold text-center sm:text-left">
            <span>{isUrdu ? 'ایک کلک پر اوپر دی گئی پیئرنگ کے عین مطابق پرچہ کینوس میں کھل جائے گا۔' : '1-Click generates an exact board paper obeying the paired chapters above.'}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 sm:w-auto px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              {isUrdu ? 'بند کریں' : 'Close'}
            </button>

            <button
              type="button"
              onClick={handleGenerateClick}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>
                {isUrdu 
                  ? `⚡ یہ پیپر بنائیں (${totalMarks} نمبر)` 
                  : `⚡ Generate Board Paper (${totalMarks}M)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
