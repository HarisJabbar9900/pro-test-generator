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
  HelpCircle,
  BarChart3,
  Flame,
  ArrowRight
} from 'lucide-react';
import { 
  BOARD_AUTHORITIES, 
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
  selectedClass: initialClass = '12th',
  selectedSubjectId = 'computer_science',
  currentUser,
  onApplyBoardPaper, // (paperData, paperConfig) => void
  appLanguage = 'ur'
}) {
  const isUrdu = appLanguage === 'ur';

  // Board selector: 'punjab' | 'federal' | 'sindh' | 'kpk'
  const [activeBoard, setActiveBoard] = useState('punjab');
  const [activeClass, setActiveClass] = useState(() => {
    return initialClass.replace(/\s*class/i, '').trim() || '12th';
  });
  const [copiedScheme, setCopiedScheme] = useState(false);

  // Available classes
  const classesList = [
    { key: '12th', label: '12th Class (Inter Part-II)', badge: 'HSSC-II' },
    { key: '11th', label: '11th Class (Inter Part-I)', badge: 'HSSC-I' },
    { key: '10th', label: '10th Class (Matric Part-II)', badge: 'SSC-II' },
    { key: '9th', label: '9th Class (Matric Part-I)', badge: 'SSC-I' }
  ];

  // Active scheme data
  const currentScheme = useMemo(() => {
    return getBoardPairingScheme(activeClass, selectedSubjectId, activeBoard);
  }, [activeClass, selectedSubjectId, activeBoard]);

  const currentBoardMeta = BOARD_AUTHORITIES[activeBoard.toUpperCase()] || BOARD_AUTHORITIES.PUNJAB;

  if (!isOpen) return null;

  // Handle generating the actual 100% board paper
  const handleGenerateClick = () => {
    try {
      const result = generateBoardPairingPaper({
        classKey: activeClass,
        subjectId: selectedSubjectId,
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

  // Copy textual pairing scheme
  const handleCopyScheme = () => {
    if (!currentScheme) return;
    let text = `=== ${currentBoardMeta.fullName} ===\n`;
    text += `CLASS: ${activeClass} Class | SUBJECT: Computer Science\n`;
    text += `SESSION: 2025-2026 | TOTAL MARKS: ${currentScheme.totalMarks} | TIME: ${currentScheme.timeAllowed}\n\n`;
    text += `[PART 1: MCQs (${currentScheme.objectiveMarks} Marks)]\n`;
    (currentScheme.mcqs?.distribution || []).forEach(m => {
      text += `• Chapter ${m.chapter}: ${m.count} MCQ(s) - ${m.name}\n`;
    });
    text += `\n[PART 2: SHORT QUESTIONS (${currentScheme.subjectiveMarks - (currentScheme.longQuestions?.totalMarks || 24)} Marks)]\n`;
    (currentScheme.shortQuestions || []).forEach(sq => {
      text += `• ${sq.title}: ${sq.instruction}\n`;
      (sq.breakdown || []).forEach(b => {
        text += `   - ${b.name}: ${b.count} Questions\n`;
      });
    });
    text += `\n[PART 3: LONG QUESTIONS (${currentScheme.longQuestions?.totalMarks || 24} Marks)]\n`;
    text += `• ${currentScheme.longQuestions?.instruction}\n`;
    (currentScheme.longQuestions?.questions || []).forEach(lq => {
      text += `   - ${lq.qNum}: ${lq.topic}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopiedScheme(true);
    notify.success(isUrdu ? "پیئرنگ اسکیم کاپی ہو گئی!" : "Pairing scheme copied to clipboard!");
    setTimeout(() => setCopiedScheme(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 flex items-start justify-between gap-4 border-b border-indigo-900/50 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 mt-0.5">
              <Award className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>{isUrdu ? 'آفیشل بورڈ پیئرنگ اسکیم' : 'Official Board Pairing Schemes'}</span>
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-black tracking-wider uppercase">
                  Session 2025 - 2026
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] sm:text-xs font-bold">
                  100% Board Standard
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 font-medium mt-1 leading-relaxed">
                {isUrdu 
                  ? 'پنجاب، فیڈرل، سندھ اور کے پی کے بورڈز کے عین مطابق پیئرنگ اسکیم اور 1-کلک پر مکمل بورڈ پرچہ جنریٹر۔' 
                  : 'Authentic pairing schemes for Punjab PBCC, Federal FBISE, Sindh, and KPK Boards with 1-click test generator.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer shrink-0"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BOARD SELECTOR & CLASS TABS BAR */}
        <div className="bg-slate-50 border-b border-slate-200/90 p-3 sm:p-4 space-y-3 shrink-0">
          
          {/* BOARD TABS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'punjab', label: 'Punjab Boards', tag: 'PBCC (9 Boards)', color: 'border-emerald-500 text-emerald-700 bg-emerald-50' },
              { id: 'federal', label: 'Federal Board', tag: 'FBISE (SLO Based)', color: 'border-blue-500 text-blue-700 bg-blue-50' },
              { id: 'sindh', label: 'Sindh Boards', tag: 'BIEK / BSEK', color: 'border-amber-500 text-amber-700 bg-amber-50' },
              { id: 'kpk', label: 'KPK Boards', tag: 'Peshawar / Mardan', color: 'border-rose-500 text-rose-700 bg-rose-50' }
            ].map(b => {
              const isActive = activeBoard === b.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setActiveBoard(b.id)}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                    isActive 
                      ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-500/20' 
                      : 'bg-white/60 hover:bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs sm:text-sm font-black ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>
                      {b.label}
                    </span>
                    {isActive && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                    {b.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CLASS SELECTOR PILLS */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-200/60">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
              <span className="text-xs font-black text-slate-600 uppercase mr-1">
                {isUrdu ? 'کلاس منتخب کریں:' : 'Class:'}
              </span>
              {classesList.map(c => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setActiveClass(c.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    activeClass === c.key
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyScheme}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Copy Scheme"
              >
                {copiedScheme ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span className="hidden sm:inline">{copiedScheme ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Print Scheme"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
        </div>

        {/* SCROLLABLE BLUEPRINT CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 min-h-0 bg-[#f8fafc]">
          
          {/* SCHEME HEADER SUMMARY BANNER */}
          {currentScheme && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black">
                    {currentBoardMeta.fullName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                    Computer Science • {activeClass} Class
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  {currentScheme.description}
                </p>
              </div>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-2 shrink-0 w-full sm:w-auto">
                <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-2.5 text-center min-w-[80px]">
                  <div className="text-lg sm:text-xl font-black text-blue-700">{currentScheme.totalMarks}</div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase">Total Marks</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 text-center min-w-[80px]">
                  <div className="text-lg sm:text-xl font-black text-emerald-700">{currentScheme.objectiveMarks}M</div>
                  <div className="text-[10px] font-bold text-emerald-600 uppercase">MCQs</div>
                </div>
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-center min-w-[80px]">
                  <div className="text-lg sm:text-xl font-black text-amber-700">{currentScheme.subjectiveMarks}M</div>
                  <div className="text-[10px] font-bold text-amber-600 uppercase">Subjective</div>
                </div>
              </div>
            </div>
          )}

          {/* 1. OBJECTIVE SECTION (MCQS) DISTRIBUTION */}
          {currentScheme?.mcqs && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-black text-xs">
                    Q1
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      PART 1: OBJECTIVE — MULTIPLE CHOICE QUESTIONS
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Total: {currentScheme.mcqs.total} MCQs (1 Mark each = {currentScheme.mcqs.total} Marks)
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-black text-xs border border-amber-200">
                  {currentScheme.objectiveMarks} Marks
                </span>
              </div>

              {/* MCQs Table Breakdown */}
              <div className="p-3 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {(currentScheme.mcqs.distribution || []).map((m, idx) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/50 hover:border-amber-300 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          Unit {m.chapter}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 mt-1 truncate" title={m.name}>
                          {m.name}
                        </h4>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center shrink-0 border border-amber-200">
                        {m.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. SUBJECTIVE SECTION I (SHORT QUESTIONS) PAIRING */}
          {currentScheme?.shortQuestions && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                    Sec I
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      PART 2: SECTION I — SHORT QUESTIONS (مختصر سوالات)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Exact chapter groupings and compulsory internal choices
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-5 space-y-4">
                {(currentScheme.shortQuestions || []).map((group, gIdx) => (
                  <div key={gIdx} className="p-3.5 sm:p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-black">
                          {group.qNum}
                        </span>
                        <h4 className="text-xs sm:text-sm font-black text-slate-800">
                          {group.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                          {group.instruction}
                        </span>
                        <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {group.totalMarks} Marks
                        </span>
                      </div>
                    </div>

                    {/* Chapter Breakdown Pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {(group.breakdown || []).map((b, bIdx) => (
                        <div key={bIdx} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 truncate" title={b.name}>
                            {b.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-black">
                            {b.count} Qs
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SUBJECTIVE SECTION II (LONG QUESTIONS) PAIRING */}
          {currentScheme?.longQuestions && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-3.5 sm:p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    Sec II
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      PART 2: SECTION II — LONG QUESTIONS (انشائیہ تفصیلی سوالات)
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {currentScheme.longQuestions.instruction}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-black text-xs border border-emerald-200">
                  {currentScheme.longQuestions.totalMarks} Marks
                </span>
              </div>

              <div className="p-3 sm:p-5 space-y-2.5">
                {(currentScheme.longQuestions.questions || []).map((lq, lIdx) => (
                  <div 
                    key={lIdx}
                    className="p-3 sm:p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-start gap-3"
                  >
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200 mt-0.5">
                      {lq.qNum}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Unit {lq.chapter}
                        </span>
                        <span className="text-xs font-black text-emerald-700">
                          {currentScheme.longQuestions.marksEach} Marks
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1 leading-snug">
                        {lq.topic}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LIST OF BOARDS COVERED */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800 font-bold block mb-1">
              📌 Included Board Jurisdictions:
            </strong>
            <span>{currentBoardMeta.boardsList.join(' • ')}</span>
          </div>
        </div>

        {/* BOTTOM ACTION BAR */}
        <div className="bg-white border-t border-slate-200 p-3 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
            <span>{isUrdu ? '1-کلک پر بورڈ کے عین مطابق پرچہ تیار ہو جائے گا۔' : 'Generates complete board paper obeying chapter pairing rules.'}</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-bold transition-all cursor-pointer"
            >
              {isUrdu ? 'بند کریں' : 'Close'}
            </button>

            <button
              type="button"
              onClick={handleGenerateClick}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs sm:text-sm font-black shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>
                {isUrdu 
                  ? `⚡ بورڈ پیئرنگ پرچہ بنائیں (${currentScheme?.totalMarks || 75} نمبر)` 
                  : `⚡ Generate Full Board Paper (${currentScheme?.totalMarks || 75}M)`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
