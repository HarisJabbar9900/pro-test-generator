import React, { useState } from 'react';
import { 
  Send, Save, Newspaper, Users, Settings, Trash2, 
  Copy, Clock, PenTool, BookOpen, FileSignature, ArrowRight, 
  Cloud, Layers, ShieldCheck, ChevronRight, ListChecks, FileText,
  Sparkles, Database, Award, Landmark, Languages, Calendar,
  Printer, Download, Zap, Flame, CheckCircle2, Check, ExternalLink,
  GraduationCap, Timer, X, Sliders, CheckSquare, Square, Edit3, RotateCcw
} from 'lucide-react';
import { notify } from '../utils/notify';
import { getUserStats } from '../utils/userActivityTracker';
import { isSuperAdmin } from '../utils/pricingPlansService';

const DEFAULT_TEST_PRESETS = [
  {
    id: 'chapter_test',
    title: 'Chapter Test',
    titleUrdu: 'باب وار امتحانی ٹیسٹ',
    marks: 25,
    time: '35 Mins',
    mcqCount: 5,
    mcqMarks: 1,
    shortCount: 5,
    shortMarks: 2,
    longCount: 2,
    longMarks: 5,
    desc: '5 MCQs + 5 Shorts + 2 Longs',
    descUrdu: '5 معروضی + 5 مختصر + 2 تفصیلی',
    badge: 'Weekly / Class Test',
    gradient: 'from-blue-600 via-indigo-600 to-indigo-700',
    iconName: 'Zap'
  },
  {
    id: 'half_book',
    title: 'Half-Book Exam',
    titleUrdu: 'ہاف بک مڈٹرم امتحان',
    marks: 50,
    time: '75 Mins',
    mcqCount: 10,
    mcqMarks: 1,
    shortCount: 10,
    shortMarks: 2,
    longCount: 4,
    longMarks: 5,
    desc: '10 MCQs + 10 Shorts + 4 Longs',
    descUrdu: '10 معروضی + 10 مختصر + 4 تفصیلی',
    badge: 'Midterm Standard',
    gradient: 'from-teal-600 via-emerald-600 to-green-700',
    iconName: 'Flame'
  },
  {
    id: 'grand_mock',
    title: 'Grand Board Mock',
    titleUrdu: 'گرینڈ بورڈ ماک پیپر',
    marks: 75,
    time: '2.5 Hours',
    mcqCount: 15,
    mcqMarks: 1,
    shortCount: 15,
    shortMarks: 2,
    longCount: 6,
    longMarks: 5,
    desc: '15 MCQs + 15 Shorts + 6 Longs',
    descUrdu: '15 معروضی + 15 مختصر + 6 تفصیلی',
    badge: 'Pre-Board Grand Exam',
    gradient: 'from-purple-600 via-violet-600 to-indigo-700',
    iconName: 'Award'
  },
  {
    id: 'mcqs_quiz',
    title: 'Objective Quiz',
    titleUrdu: 'معروضی کوئز و ببل شیٹ',
    marks: 20,
    time: '20 Mins',
    mcqCount: 20,
    mcqMarks: 1,
    shortCount: 0,
    shortMarks: 0,
    longCount: 0,
    longMarks: 0,
    desc: '20 MCQs with OMR Sheet',
    descUrdu: '20 معروضی + او ایم آر شیٹ',
    badge: 'OMR Bubble Sheet',
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    iconName: 'ListChecks'
  }
];

const getPresetIcon = (iconName) => {
  switch (iconName) {
    case 'Flame': return Flame;
    case 'Award': return Award;
    case 'ListChecks': return ListChecks;
    case 'Zap':
    default: return Zap;
  }
};

export default function PTMDashboardView({
  onGoToGenerate,
  onGoToUpload,
  onGoToDirectory,
  onGoToSettings,
  onNavigate,
  bank,
  selectedClass,
  savedPapers = [],
  currentUser = null,
  appLanguage = 'en',
  onToggleLanguage,
  onOpenSavedPaper,
  onDeleteSavedPaper,
  onExportDocx,
  paperConfig,
  setPaperConfig,
  onGenerateFromPreset,
  onOpenPresetInManualMode,
  hasActiveDraft = false,
  onResumeDraft,
  onDiscardDraft,
  activeDraftInfo = null,
  onOpenPairingSchemeModal
}) {
  const isSuper = isSuperAdmin(currentUser);
  const isUrdu = appLanguage === 'ur';
  const userStats = getUserStats(currentUser?.email);

  // Persistent Custom Presets (Admin Customizable)
  const [presets, setPresets] = useState(() => {
    try {
      const saved = localStorage.getItem('ptm_custom_test_presets');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_TEST_PRESETS;
  });

  // Admin Preset Editor Modal State
  const [editingPreset, setEditingPreset] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    titleUrdu: '',
    badge: '',
    time: '',
    mcqCount: 5,
    mcqMarks: 1,
    shortCount: 5,
    shortMarks: 2,
    longCount: 2,
    longMarks: 5
  });

  // Test Generator Modal State
  const [activePresetModal, setActivePresetModal] = useState(null);
  const [modalClass, setModalClass] = useState(selectedClass || '10th');
  const [modalSubjectId, setModalSubjectId] = useState('');
  const [modalScope, setModalScope] = useState('full'); // 'full' | 'single' | 'first_half' | 'second_half' | 'custom'
  const [modalSelectedChapterId, setModalSelectedChapterId] = useState('');
  const [modalCustomChapterIds, setModalCustomChapterIds] = useState([]);
  const [modalLanguage, setModalLanguage] = useState('bilingual'); // 'bilingual' | 'en' | 'ur'
  const [modalExamTitle, setModalExamTitle] = useState('');

  // On-the-fly customizable question counts inside Generator Modal
  const [modalMcqCount, setModalMcqCount] = useState(5);
  const [modalShortCount, setModalShortCount] = useState(5);
  const [modalLongCount, setModalLongCount] = useState(2);
  const [modalTime, setModalTime] = useState('35 Mins');

  // Compute specific user metrics
  const userTotalCreated = Math.max(userStats.createdCount || 0, savedPapers?.length || 0);
  const isUnlimited = isSuper || Number(currentUser?.maxPapers) === -1;
  const userMaxLimit = Number(currentUser?.maxPapers) || 50;
  const remainingQuota = isUnlimited ? 'Unlimited' : Math.max(0, userMaxLimit - (savedPapers?.length || 0));

  // Compute total uploaded questions across all classes & subjects in the question bank
  let totalBankMcqs = 0;
  let totalBankShorts = 0;
  let totalBankLongs = 0;
  let totalBankTopics = 0;
  let totalBankSubjects = 0;

  Object.keys(bank || {}).forEach(clsKey => {
    const clsObj = bank[clsKey] || {};
    const subs = clsObj.subjects || [];
    totalBankSubjects += subs.length;
    subs.forEach(sub => {
      (sub.chapters || []).forEach(ch => {
        totalBankTopics += (ch.topics || []).length;
        (ch.topics || []).forEach(t => {
          totalBankMcqs += (t.mcqs?.length || 0);
          totalBankShorts += (t.shortQuestions?.length || 0);
          totalBankLongs += (t.longQuestions?.length || 0);
        });
      });
    });
  });

  const totalQuestions = totalBankMcqs + totalBankShorts + totalBankLongs;

  // Calculate days to upcoming BISE Exams dynamically
  const now = new Date();
  const currentYear = now.getFullYear();
  let matricDate = new Date(`${currentYear}-03-01`);
  if (now > matricDate) matricDate = new Date(`${currentYear + 1}-03-01`);
  const daysToMatric = Math.max(1, Math.ceil((matricDate - now) / (1000 * 60 * 60 * 24)));

  let interDate = new Date(`${currentYear}-04-15`);
  if (now > interDate) interDate = new Date(`${currentYear + 1}-04-15`);
  const daysToInter = Math.max(1, Math.ceil((interDate - now) / (1000 * 60 * 60 * 24)));

  const handleNav = (target) => {
    const cleanTarget = target === 'pricing_plans' ? 'pricing' : target;
    if (typeof onNavigate === 'function') {
      onNavigate(cleanTarget);
    } else if (cleanTarget === 'generate_paper') {
      onGoToGenerate();
    } else if (cleanTarget === 'default_paper_settings') {
      onGoToSettings?.();
    }
  };

  // Open Admin Edit Preset Modal
  const handleStartEditPreset = (preset, e) => {
    e?.stopPropagation();
    setEditingPreset(preset);
    setEditForm({
      title: preset.title || '',
      titleUrdu: preset.titleUrdu || '',
      badge: preset.badge || '',
      time: preset.time || '',
      mcqCount: preset.mcqCount ?? 5,
      mcqMarks: preset.mcqMarks ?? 1,
      shortCount: preset.shortCount ?? 5,
      shortMarks: preset.shortMarks ?? 2,
      longCount: preset.longCount ?? 2,
      longMarks: preset.longMarks ?? 5
    });
  };

  // Save Admin Custom Preset Changes
  const handleSaveCustomPreset = (e) => {
    e?.preventDefault();
    if (!editingPreset) return;

    const mcqCount = Math.max(0, parseInt(editForm.mcqCount) || 0);
    const mcqMarks = Math.max(1, parseInt(editForm.mcqMarks) || 1);
    const shortCount = Math.max(0, parseInt(editForm.shortCount) || 0);
    const shortMarks = Math.max(1, parseInt(editForm.shortMarks) || 2);
    const longCount = Math.max(0, parseInt(editForm.longCount) || 0);
    const longMarks = Math.max(1, parseInt(editForm.longMarks) || 5);
    const totalMarks = (mcqCount * mcqMarks) + (shortCount * shortMarks) + (longCount * longMarks);

    const updatedList = presets.map(p => {
      if (p.id === editingPreset.id) {
        return {
          ...p,
          title: editForm.title.trim() || p.title,
          titleUrdu: editForm.titleUrdu.trim() || p.titleUrdu,
          badge: editForm.badge.trim() || p.badge,
          time: editForm.time.trim() || p.time,
          marks: totalMarks,
          mcqCount: mcqCount,
          mcqMarks: mcqMarks,
          shortCount: shortCount,
          shortMarks: shortMarks,
          longCount: longCount,
          longMarks: longMarks,
          desc: `${mcqCount} MCQs + ${shortCount} Shorts + ${longCount} Longs`,
          descUrdu: `${mcqCount} معروضی + ${shortCount} مختصر + ${longCount} تفصیلی`
        };
      }
      return p;
    });

    setPresets(updatedList);
    try {
      localStorage.setItem('ptm_custom_test_presets', JSON.stringify(updatedList));
    } catch (err) {}

    notify.success(`امتحانی سانچہ "${editForm.title || editingPreset.title}" کامیابی سے محفوظ ہو گیا!`, {
      description: `کل نمبر: ${totalMarks} Marks • معروضی: ${mcqCount} • مختصر: ${shortCount} • لانگ: ${longCount}`
    });

    setEditingPreset(null);
  };

  // Reset Presets to Official Defaults
  const handleResetPresetsToDefault = () => {
    setPresets(DEFAULT_TEST_PRESETS);
    try {
      localStorage.removeItem('ptm_custom_test_presets');
    } catch (err) {}
    notify.info("تمام امتحانی سانچے سرکاری بورڈ اسٹینڈرڈ پر بحال کر دیے گئے۔ (Presets Reset)");
    setEditingPreset(null);
  };

  // Open the interactive configuration modal for any preset
  const handleOpenPresetModal = (preset) => {
    setActivePresetModal(preset);
    const targetClass = selectedClass || '10th';
    setModalClass(targetClass);

    const availableSubs = bank?.[targetClass]?.subjects || [];
    const initialSubject = availableSubs[0] || {};
    setModalSubjectId(initialSubject.id || '');

    const initialChapters = initialSubject.chapters || [];
    if (preset.id === 'chapter_test') {
      setModalScope('single');
      setModalSelectedChapterId(initialChapters[0]?.id || '');
    } else if (preset.id === 'half_book') {
      setModalScope('first_half');
    } else if (preset.id === 'grand_mock') {
      setModalScope('full');
    } else if (preset.id === 'mcqs_quiz') {
      setModalScope('full');
    }

    setModalCustomChapterIds([]);
    setModalLanguage('bilingual');
    setModalExamTitle(`${preset.title} (${preset.marks} Marks)`);

    // Load question counts from preset
    setModalMcqCount(preset.mcqCount ?? 5);
    setModalShortCount(preset.shortCount ?? 5);
    setModalLongCount(preset.longCount ?? 2);
    setModalTime(preset.time || '35 Mins');
  };

  // Contextual data for current modal selection
  const availableModalSubjects = bank?.[modalClass]?.subjects || [];
  const currentModalSubject = availableModalSubjects.find(s => s.id === modalSubjectId) || availableModalSubjects[0] || {};
  const currentModalChapters = currentModalSubject?.chapters || [];
  const halfPoint = Math.ceil((currentModalChapters.length || 1) / 2);
  const firstHalfChapters = currentModalChapters.slice(0, halfPoint);
  const secondHalfChapters = currentModalChapters.slice(halfPoint);

  // Live total marks inside generator modal
  const liveModalMarks = (modalMcqCount * (activePresetModal?.mcqMarks || 1)) + 
                         (modalShortCount * (activePresetModal?.shortMarks || 2)) + 
                         (modalLongCount * (activePresetModal?.longMarks || 5));

  const handleExecuteGenerate = () => {
    if (!activePresetModal) return;

    let targetChapterIds = [];
    let syllabusDesc = '';

    if (activePresetModal.id === 'chapter_test' || modalScope === 'single') {
      const chosenCh = currentModalChapters.find(c => c.id === modalSelectedChapterId) || currentModalChapters[0];
      if (chosenCh) {
        targetChapterIds = [chosenCh.id];
        syllabusDesc = `Chapter ${chosenCh.chapterNumber || 1}: ${chosenCh.name}`;
      }
    } else if (modalScope === 'first_half') {
      targetChapterIds = firstHalfChapters.map(c => c.id);
      syllabusDesc = `First Half (Chapters 1 to ${halfPoint})`;
    } else if (modalScope === 'second_half') {
      targetChapterIds = secondHalfChapters.map(c => c.id);
      syllabusDesc = `Second Half (Chapters ${halfPoint + 1} to ${currentModalChapters.length})`;
    } else if (modalScope === 'custom') {
      targetChapterIds = modalCustomChapterIds.length > 0 ? modalCustomChapterIds : currentModalChapters.map(c => c.id);
      syllabusDesc = `Selected Chapters (${targetChapterIds.length} Chapters)`;
    } else {
      // Full Book
      targetChapterIds = currentModalChapters.map(c => c.id);
      syllabusDesc = 'Complete Syllabus (Full Book)';
    }

    if (typeof onGenerateFromPreset === 'function') {
      onGenerateFromPreset({
        preset: activePresetModal,
        classKey: modalClass,
        subjectId: currentModalSubject?.id || modalSubjectId,
        chapterIds: targetChapterIds,
        language: modalLanguage,
        customTitle: modalExamTitle || `${activePresetModal.title} (${liveModalMarks} Marks)`,
        syllabus: syllabusDesc,
        mcqCount: modalMcqCount,
        mcqMarks: activePresetModal.mcqMarks || 1,
        shortCount: modalShortCount,
        shortMarks: activePresetModal.shortMarks || 2,
        longCount: modalLongCount,
        longMarks: activePresetModal.longMarks || 5,
        timeAllowed: modalTime,
        totalMarks: liveModalMarks
      });
      setActivePresetModal(null);
    } else {
      if (typeof onGoToGenerate === 'function') onGoToGenerate();
      setActivePresetModal(null);
    }
  };

  const handleExecuteManualMode = () => {
    if (typeof onOpenPresetInManualMode === 'function') {
      onOpenPresetInManualMode({
        preset: activePresetModal,
        classKey: modalClass,
        subjectId: currentModalSubject?.id || modalSubjectId
      });
    } else if (typeof onGoToGenerate === 'function') {
      onGoToGenerate();
    }
    setActivePresetModal(null);
  };

  const recentPapers = (savedPapers || []).slice(0, 3);

  return (
    <div className="p-2.5 sm:p-6 pb-24 sm:pb-8 max-w-7xl mx-auto font-sans min-h-full flex-1 flex flex-col justify-between w-full">
      <div className="space-y-3.5 sm:space-y-8">
      
      {/* ACTIVE DRAFT BANNER (PRESERVED GENERATED PAPER) */}
      {hasActiveDraft && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn border border-blue-400/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 shadow-inner">
              📝
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>{isUrdu ? 'ڈرافٹ پیپر محفوظ ہے' : 'Active Paper Draft In Memory'}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {activeDraftInfo?.subject || 'Examination Paper'} ({activeDraftInfo?.gradeClass || 'Current Class'})
                {activeDraftInfo?.totalMarks ? ` • ${activeDraftInfo.totalMarks} Marks` : ''}
              </h3>
              <p className="text-xs text-blue-100 font-medium mt-0.5">
                {isUrdu 
                  ? 'آپ کا پچھلا تیار کردہ پیپر محفوظ ہے۔ آپ اسے دوبارہ دیکھ سکتے ہیں یا نیا پیپر بنا سکتے ہیں۔' 
                  : 'Your generated paper is safely preserved in drafts. Resume editing or print anytime without losing questions.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {onDiscardDraft && (
              <button
                type="button"
                onClick={onDiscardDraft}
                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
                title="Discard Draft"
              >
                {isUrdu ? 'ڈرافٹ ختم کریں' : 'Discard Draft'}
              </button>
            )}
            <button
              type="button"
              onClick={onResumeDraft}
              className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>{isUrdu ? '⚡ جاری پیپر کھولیں • Resume Paper' : '⚡ Resume Active Paper'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 0. LIVE BISE BOARD EXAM COUNTDOWN & PAIRING NOTIFICATION TICKER */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-3.5 sm:p-4 border border-indigo-500/25 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-400">
            <Timer className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-blue-300">
                BISE Exam Season 2026
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                {isUrdu ? '100% مستند پیئرنگ اسکیم فعال' : '100% Pairing Scheme Synchronized'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 font-medium">
              {isUrdu 
                ? 'پنجاب اور فیڈرل بورڈ کے سالانہ امتحانات کی تیاری کے لیے مکمل سوالیہ بینک اور 25% کانسپچوئل (SLO) سوالات دستیاب ہیں۔' 
                : 'Punjab Boards & FBISE annual paper pattern ready with 25% SLO conceptual assessment framework.'}
            </p>
          </div>
        </div>

        {/* Live Countdown Badges */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 self-stretch md:self-auto relative z-10 w-full md:w-auto">
          {/* Days Sub-Row (side-by-side on mobile) */}
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center flex-1 sm:flex-initial">
              <div className="text-base sm:text-lg font-black text-amber-300 leading-tight">
                {daysToMatric} <span className="text-[10px] text-white/70 font-semibold uppercase">Days</span>
              </div>
              <div className="text-[9px] font-bold text-white/80">
                {isUrdu ? 'میٹرک بورڈ 2026' : 'Matric Annual'}
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center flex-1 sm:flex-initial">
              <div className="text-base sm:text-lg font-black text-cyan-300 leading-tight">
                {daysToInter} <span className="text-[10px] text-white/70 font-semibold uppercase">Days</span>
              </div>
              <div className="text-[9px] font-bold text-white/80">
                {isUrdu ? 'انٹر بورڈ 2026' : 'Inter Annual'}
              </div>
            </div>
          </div>

          {/* Action Buttons Sub-Row (side-by-side on mobile, never cut off) */}
          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => handleNav('model_papers')}
              className="px-3 py-2 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <span>{isUrdu ? 'ماڈل پیپرز' : 'Model Papers'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {onOpenPairingSchemeModal && (
              <button
                type="button"
                onClick={onOpenPairingSchemeModal}
                className="px-3 py-2 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <Award className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span className="truncate">{isUrdu ? 'پیئرنگ اسکیم 2026' : 'Pairing Scheme 2026'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. TOP 5 SPECIFIC USER METRIC CARDS (DEDICATED TO THIS USER) */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-4">
          
          {/* User Card 1: Generate Paper (Full Width on mobile, compact on desktop) */}
          <div 
            onClick={onGoToGenerate}
            className="col-span-2 sm:col-span-1 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-3.5 sm:p-5 flex items-center sm:items-start justify-between relative z-10">
              <div>
                <div className="text-2xl sm:text-4xl font-black tracking-tight drop-shadow-xs">
                  Instant
                </div>
                <div className="text-sm font-bold mt-0.5 sm:mt-1 text-white/95 leading-snug">
                  Generate Paper
                  {isUrdu && <span className="block text-xs font-bold text-cyan-100">امتحانی پرچہ تیار کریں</span>}
                </div>
                <p className="text-[11px] text-white/75 font-medium mt-0.5 leading-tight">
                  Custom Exam Builder
                  {isUrdu && <span className="block text-[10px] text-white/80">فوری ٹیسٹ بنانے کا نظام</span>}
                </p>
              </div>
              <Send className="w-12 h-12 sm:w-16 sm:h-16 text-white/20 sm:text-white/15 sm:absolute sm:right-3 sm:top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shrink-0" />
            </div>
            <div className="w-full py-2 sm:py-2.5 px-3.5 sm:px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>{isUrdu ? 'Generate Now • ابھی بنائیں' : 'Generate Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Card 2: My Saved Papers (Emerald / Teal Gradient) */}
          <div 
            onClick={() => handleNav('saved_papers')}
            className="col-span-1 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-3 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-xs">{savedPapers?.length || 0}</div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-white/95 leading-snug">
                  My Saved Papers
                  {isUrdu && <span className="block text-[10px] sm:text-xs font-bold text-emerald-100">محفوظ شدہ پرچے</span>}
                </div>
                <p className="text-[10px] sm:text-[11px] text-white/75 font-medium mt-0.5 leading-tight line-clamp-1 sm:line-clamp-none">
                  Ready to Print & PDF
                  {isUrdu && <span className="block text-[9px] sm:text-[10px] text-white/80">پرنٹ کے لیے تیار</span>}
                </p>
              </div>
              <Save className="w-8 h-8 sm:w-16 sm:h-16 text-white/15 absolute right-2 top-2 sm:right-3 sm:top-3 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span className="truncate">{isUrdu ? 'Open Saved • پرچے' : 'Open Saved Papers'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Card 3: Total Papers Created (Amber / Golden Gradient) */}
          <div 
            onClick={() => handleNav('papers_history')}
            className="col-span-1 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-3 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-xs">
                  {userTotalCreated}
                </div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-white leading-snug">
                  Created Papers
                  {isUrdu && <span className="block text-[10px] sm:text-xs font-bold text-amber-100">کل تیار کردہ پیپرز</span>}
                </div>
                <p className="text-[10px] sm:text-[11px] text-white/80 font-medium mt-0.5 leading-tight line-clamp-1 sm:line-clamp-none">
                  Generated Archives
                  {isUrdu && <span className="block text-[9px] sm:text-[10px] text-white/80">تاریخچہ</span>}
                </p>
              </div>
              <Copy className="w-8 h-8 sm:w-16 sm:h-16 text-white/20 absolute right-2 top-2 sm:right-3 sm:top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span className="truncate">{isUrdu ? 'History • تاریخچہ' : 'View History'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Card 4: Paper Quota Remaining (Warm Rose / Coral Gradient) */}
          <div 
            onClick={() => handleNav('pricing_plans')}
            className="col-span-1 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-3 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight drop-shadow-xs">
                  {isUnlimited ? '∞' : remainingQuota}
                </div>
                <div className="text-xs sm:text-sm font-bold mt-1 text-white/95 leading-snug">
                  Remaining Quota
                  {isUrdu && <span className="block text-[10px] sm:text-xs font-bold text-rose-100">باقی گنجائش</span>}
                </div>
                <p className="text-[10px] sm:text-[11px] text-white/75 font-medium mt-0.5 leading-tight line-clamp-1 sm:line-clamp-none">
                  {isUnlimited 
                    ? (isSuper ? 'Admin Unlimited' : 'Unlimited Plan') 
                    : `Limit: ${userMaxLimit}`}
                  {isUrdu && (
                    <span className="block text-[9px] sm:text-[10px] text-white/80">
                      {isUnlimited ? 'لامحدود سہولت' : `کل: ${userMaxLimit}`}
                    </span>
                  )}
                </p>
              </div>
              <Layers className="w-8 h-8 sm:w-16 sm:h-16 text-white/15 absolute right-2 top-2 sm:right-3 sm:top-3 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span className="truncate">{isSuper ? 'Admin Quota' : (isUnlimited ? 'Active Plan' : 'Manage Plan')}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Card 5: My Plan & Profile Status (Deep Purple / Indigo Gradient) */}
          <div 
            onClick={() => handleNav('pricing')}
            className="col-span-1 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-800 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-3 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-sm sm:text-lg font-black tracking-tight drop-shadow-xs leading-snug line-clamp-1">
                  {isSuper ? 'Super Admin' : (currentUser?.package && currentUser?.package !== 'None' ? currentUser.package : 'Basic Plan')}
                </div>
                <div className="text-[11px] sm:text-xs font-bold mt-1 text-white/90 leading-snug truncate">
                  {currentUser?.institute || 'Educators Academy'}
                  {isUrdu && <span className="block text-[9px] text-purple-200">ادارہ</span>}
                </div>

                {/* Expiry Date Badge inside Card 5 */}
                <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-black/25 backdrop-blur-xs text-[10px] sm:text-[11px] font-bold text-amber-200 border border-white/10 truncate max-w-full">
                  <Calendar className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="truncate">{currentUser?.expiryDate || '31-12-2026'}</span>
                </div>
              </div>
              <ShieldCheck className="w-8 h-8 sm:w-16 sm:h-16 text-white/15 absolute right-2 top-2 sm:right-3 sm:top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2 sm:py-2.5 px-3 sm:px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-[11px] sm:text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span className="truncate">{isUrdu ? 'Plan Details • تفصیل' : 'Plan Details'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* ADMIN CONTROL: USER MANAGEMENT BANNER */}
      {isSuper && (
        <div 
          onClick={() => handleNav('user_management')}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.005] group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-xs">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight">
                  User Management • یوزر مینجمنٹ
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider border border-white/25 shadow-2xs">
                  Admin Portal
                </span>
              </div>
              <p className="text-xs text-white/90 mt-0.5 font-medium">
                {isUrdu 
                  ? 'تمام رجسٹرڈ اساتذہ، ان کے پاسورڈز، اسکول کا نام، فیس کی منظوری اور لائیو اسٹیٹس چیک کریں' 
                  : 'View all registered teachers, passwords, approve subscription packages, and control user access.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl border border-white/25 text-xs font-bold shrink-0 transition-colors">
            <span>{isUrdu ? 'یوزر مینجمنٹ کھولیں' : 'Open User Management'}</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      )}

      {/* 2. ⚡ 1-CLICK INSTANT EXAM PRESETS WITH ADMIN CUSTOMIZATION */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>1-Click Instant Exam Presets</span>
              {isUrdu && <span className="text-xs font-bold text-amber-600 font-sans">• فوری 1-کلک امتحانی سانچے</span>}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {isUrdu 
                ? 'وقت کی بچت کریں! کسی بھی سانچے پر کلک کر کے پرچہ بنائیں، یا بطور ایڈمن سوالات و نمبرز اپنی مرضی کے مطابق سیٹ کریں۔' 
                : 'Click any template to generate a complete exam paper, or customize marks & question ratios as Admin.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isSuper && (
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 flex items-center gap-1 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-purple-600" />
                Admin Customizable
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              {isUrdu ? 'تیز ترین پرچہ سازی • Fast Track' : '⚡ 1-Click Setup'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {presets.map((preset) => {
            const IconComponent = getPresetIcon(preset.iconName);
            return (
              <div
                key={preset.id}
                onClick={() => handleOpenPresetModal(preset)}
                className="bg-white hover:bg-slate-50/90 rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${preset.gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Admin Quick Edit Button */}
                      {isSuper && (
                        <button
                          type="button"
                          onClick={(e) => handleStartEditPreset(preset, e)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-purple-100 text-slate-500 hover:text-purple-700 transition-colors border border-slate-200/80 cursor-pointer shadow-2xs"
                          title="Edit this Preset (سانچے کے نمبرز اور سوالات تبدیل کریں)"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <div className="flex flex-col items-end">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black border border-slate-200">
                          {preset.marks} Marks
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                          ⏱️ {preset.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <span className="text-[9px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                      {preset.badge}
                    </span>
                    <h3 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors mt-1.5 leading-snug">
                      {preset.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      {preset.desc}
                    </p>
                    {isUrdu && (
                      <p className="text-[10px] font-bold text-slate-700 mt-1">
                        {preset.titleUrdu} • {preset.descUrdu}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>{isUrdu ? 'یہ سانچہ منتخب کریں' : 'Use Template'}</span>
                  <div className="w-5 h-5 rounded-full bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. 📄 RECENT PAPERS QUICK ACTIONS (INSTANT PRINT, DOCX, OPEN) */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Recent Papers Quick Actions</span>
              {isUrdu && <span className="text-xs font-bold text-emerald-600 font-sans">• حالیہ پرچے (فوری پرنٹ و ڈاؤنلوڈ)</span>}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {isUrdu 
                ? 'حال ہی میں بنائے گئے پرچے یہاں سے براہِ راست پرنٹ اور مائیکروسافٹ ورڈ (.doc) میں ڈاؤنلوڈ کریں۔' 
                : 'Quickly print, download in MS Word format, or re-open your most recent examination papers.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleNav('saved_papers')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer hover:underline"
          >
            <span>{isUrdu ? `تمام محفوظ پرچے دیکھیں (${savedPapers.length})` : `View All Papers (${savedPapers.length})`}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {recentPapers.map((paper) => (
              <div 
                key={paper.id}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-extrabold border border-blue-200">
                        {paper.subject}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {paper.gradeClass}
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-slate-800 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                      {paper.totalMarks || 50} Marks
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-2.5 line-clamp-2 leading-snug">
                    {paper.title || `${paper.subject} Examination Paper`}
                  </h3>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-medium">
                    <span>MCQs: <strong>{paper.mcqCount || paper.paperData?.mcqs?.length || 0}</strong></span>
                    <span>Shorts: <strong>{paper.shortCount || paper.paperData?.shortQuestions?.length || 0}</strong></span>
                    <span>Longs: <strong>{paper.longCount || paper.paperData?.longQuestions?.length || 0}</strong></span>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 font-medium">
                    📅 {paper.savedAt || paper.date}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenSavedPaper) {
                        onOpenSavedPaper(paper);
                        setTimeout(() => window.print(), 400);
                      }
                    }}
                    className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                    title="Print this paper directly"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'پرنٹ' : 'Print'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenSavedPaper) {
                        onOpenSavedPaper(paper);
                        setTimeout(() => {
                          if (onExportDocx) onExportDocx();
                        }, 300);
                      }
                    }}
                    className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1"
                    title="Download Word Document (.doc)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'ورڈ' : 'Word'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenSavedPaper && onOpenSavedPaper(paper)}
                    className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer"
                    title="Open in Canvas to edit"
                  >
                    <span>{isUrdu ? 'کھولیں' : 'Edit'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-700">
                {isUrdu ? 'ابھی تک کوئی پرچہ محفوظ نہیں کیا گیا۔' : 'No saved papers yet in your archive.'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isUrdu 
                  ? 'اوپر دیے گئے "1-Click Presets" یا "Generate Paper" کے ذریعے اپنا پہلا پرچہ فوری بنائیں!' 
                  : 'Use the 1-Click Presets or click Generate Paper above to create and print your first test paper!'}
              </p>
            </div>
            <button
              type="button"
              onClick={onGoToGenerate}
              className="mt-1 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isUrdu ? 'پہلا پرچہ بنائیں • Create Test' : 'Create First Test Now'}
            </button>
          </div>
        )}
      </div>

      {/* 4. REFINED PROFESSIONAL DASHBOARD UTILITY & ACADEMIC HUB */}
      <div className="space-y-3.5 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Quick Academic & Management Hub</span>
              {isUrdu && <span className="text-xs font-bold text-orange-600 font-sans">• فوری تعلیمی اور انتظامی سہولیات</span>}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {isUrdu 
                ? 'امتحانی ترتیبات، پرانوں پرچوں کا ریکارڈ، بورڈ کا نصاب اور ماڈل پیپرز ایک کلک پر دستیاب ہیں۔' 
                : 'Instant access to default configurations, archives, syllabus, and model paper suites.'}
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 self-start sm:self-auto bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/80">
            {isUrdu ? '8 اہم سہولیات • 8 Quick Modules' : '8 Quick Modules'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Tool 1: Default Settings */}
          <div 
            onClick={onGoToSettings}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-cyan-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/25 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-black tracking-wide shrink-0 shadow-2xs">
                {isUrdu ? '27 ترتیبات' : '27 Configs'}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                Default Settings
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                Header Layout, Watermarks & Styling
              </p>
              {isUrdu && (
                <p className="text-[11px] text-cyan-700 font-semibold mt-1 leading-tight">
                  امتحانی ہیڈر، مونوگرام اور واٹر مارک کا ڈیزائن
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-cyan-700 transition-colors">
              <span>{isUrdu ? 'Configure System • ترتیبات بدلیں' : 'Configure System'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-cyan-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Tool 2: Deleted Papers */}
          <div 
            onClick={() => notify.info(isUrdu ? "ری سائیکل بن خالی ہے (Deleted Papers Archive is empty)." : "Deleted Papers Archive is empty.")}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-rose-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/25 group-hover:scale-110 transition-transform duration-300">
                <Trash2 className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black tracking-wide shrink-0 shadow-2xs">
                {isUrdu ? 'ری سائیکل بن' : 'Recycle Bin'}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-rose-600 transition-colors tracking-tight leading-snug">
                Deleted Papers
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                Paper Recovery & Trash Archive
              </p>
              {isUrdu && (
                <p className="text-[11px] text-rose-700 font-semibold mt-1 leading-tight">
                  ڈیلیٹ شدہ پرچوں کی بحالی اور محفوظ ریکارڈ
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-rose-700 transition-colors">
              <span>{isUrdu ? '0 Items • ری سائیکل بن خالی ہے' : '0 Items in Bin'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-rose-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Tool 3: Paper History */}
          <div 
            onClick={() => handleNav('papers_history')}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                <Copy className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black tracking-wide shrink-0 shadow-2xs">
                {isUrdu ? `${userTotalCreated} پرچے` : `${userTotalCreated} Records`}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight leading-snug">
                Paper History
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                Generated Archives & Print Logs
              </p>
              {isUrdu && (
                <p className="text-[11px] text-emerald-700 font-semibold mt-1 leading-tight">
                  تاریخ کے مطابق تیار کردہ تمام پرچوں کی فہرست
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-emerald-700 transition-colors">
              <span>{isUrdu ? 'View Archives • سابقہ ریکارڈ دیکھیں' : 'View Archives'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Tool 4: Past Papers (5-Year Board Solved Archive) */}
          <div 
            onClick={() => handleNav('past_papers')}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300">
                <Landmark className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black tracking-wide shrink-0 shadow-2xs">
                {isUrdu ? '5 سالہ ریکارڈ' : '5 Years'}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors tracking-tight leading-snug">
                Past Papers
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                FBISE & Punjab Boards 5-Year Solved
              </p>
              {isUrdu && (
                <p className="text-[11px] text-amber-800 font-semibold mt-1 leading-tight">
                  فیڈرل اور تمام پنجاب بورڈز کے حل شدہ پرچے
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-amber-700 transition-colors">
              <span>{isUrdu ? 'Browse Past Papers • بورڈ پرچے کھولیں' : 'Browse Past Papers'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-amber-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Tool 5: Draft Papers */}
          <div 
            onClick={() => handleNav('saved_papers')}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-purple-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                <PenTool className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-black tracking-wide shrink-0 shadow-2xs">
                {isUrdu ? `${savedPapers.length || 0} ڈرافٹ محفوظ` : `${savedPapers.length || 0} Saved`}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-purple-600 transition-colors tracking-tight leading-snug">
                Draft Papers
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                Continue In-Progress Test Sheets
              </p>
              {isUrdu && (
                <p className="text-[11px] text-purple-700 font-semibold mt-1 leading-tight">
                  جہاں کام چھوڑا تھا، وہیں سے آگے جاری رکھیں
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-purple-700 transition-colors">
              <span>{isUrdu ? 'Open Drafts • ڈرافٹ مکمل کریں' : 'Open Drafts'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-purple-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Tool 6: Board Pairing Schemes (All Boards) */}
          <div 
            onClick={onOpenPairingSchemeModal}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black tracking-wide uppercase shadow-sm shadow-emerald-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                {isUrdu ? 'تمام بورڈز 2026' : 'ALL BOARDS'}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors tracking-tight leading-snug">
                Board Pairing Schemes
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                Punjab (PBCC) • Federal • Sindh • KPK
              </p>
              {isUrdu && (
                <p className="text-[11px] text-emerald-800 font-semibold mt-1 leading-tight">
                  تمام بورڈز کی آفیشل پیئرنگ اسکیم اور 1-کلک پرچہ
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-emerald-700 transition-colors">
              <span>{isUrdu ? 'Open Scheme • پیئرنگ اسکیم کھولیں' : 'Open Pairing Scheme'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Tool 7: Smart Syllabus */}
          <div 
            onClick={() => notify.info(isUrdu ? "سمارٹ نصاب: پنجاب ٹیکسٹ بک بورڈ (2025-26)" : "Smart Syllabus: Punjab Boards (2025-26)")}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-indigo-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/25 group-hover:scale-110 transition-transform duration-300">
                <Newspaper className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black tracking-wide shrink-0 shadow-2xs">
                2025 - 2026
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight leading-snug">
                Smart Syllabus
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                Curriculum Scope & PCTB Guidelines
              </p>
              {isUrdu && (
                <p className="text-[11px] text-blue-700 font-semibold mt-1 leading-tight">
                  پنجاب ٹیکسٹ بک بورڈ کے مطابق سلیبس کی حدود
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-blue-700 transition-colors">
              <span>{isUrdu ? 'Curriculum Scope • نصاب دیکھیں' : 'Curriculum Scope'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Tool 8: Model Papers */}
          <div 
            onClick={() => handleNav('model_papers')}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-orange-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-orange-500/25 group-hover:scale-110 transition-transform duration-300">
                <FileSignature className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black tracking-wide uppercase shadow-sm shadow-rose-500/30 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                {isUrdu ? 'نیا 2026' : 'NEW 2026'}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-orange-600 transition-colors tracking-tight leading-snug">
                Model Papers
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                Board Standard Solved Full Papers
              </p>
              {isUrdu && (
                <p className="text-[11px] text-orange-700 font-semibold mt-1 leading-tight">
                  بورڈ پیٹرن پر حل شدہ مکمل ماڈل پیپرز
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-orange-700 transition-colors">
              <span>{isUrdu ? 'Official Papers • ماڈل ٹیسٹ دیکھیں' : 'Official Papers'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-orange-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 5. QUESTION BANK MASTER CONTENT & STATISTICS (SHOWN BELOW THE LOWER CARDS) */}
      <div className="space-y-3.5 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              <span>Master Question Bank & Syllabus Coverage</span>
              {isUrdu && <span className="text-xs font-bold text-indigo-600 font-sans">• امتحانی سوالات کا مستند ذخیرہ</span>}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {isUrdu 
                ? 'کلاؤڈ ڈیٹابیس میں موجود بورڈ کے تمام مضامین کے منظور شدہ کثیر الانتخابی، مختصر اور تفصیلی سوالات۔' 
                : 'Curated board curriculum questions available in the cloud database for test generation.'}
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 self-start sm:self-auto bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
            {isUrdu ? `${totalQuestions} کل سوالات کا بینک` : `${totalQuestions} Total Questions Bank`}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          
          {/* Question Bank Card 1: MCQs Questions */}
          <div 
            onClick={() => currentUser?.isAdmin ? (onGoToUpload ? onGoToUpload() : handleNav('upload_material')) : onGoToGenerate()}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                  {totalBankMcqs}
                </div>
                <div className="text-sm font-bold mt-1 text-white">
                  MCQs Questions
                  {isUrdu && <span className="block text-[11px] font-medium text-white/90">معروضی سوالات (کثیر الانتخابی)</span>}
                </div>
                <p className="text-[11px] text-white/80 font-medium mt-0.5">
                  {isUrdu ? 'کل موجود معروضی بینک' : 'Total Uploaded Bank'}
                </p>
              </div>
              <ListChecks className="w-14 h-14 sm:w-16 sm:h-16 text-white/20 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>
                {currentUser?.isAdmin 
                  ? (isUrdu ? 'Upload / Manage MCQs • اپلوڈ کریں' : 'Upload / Manage MCQs') 
                  : (isUrdu ? 'Select in Paper • ٹیسٹ میں شامل کریں' : 'Select in Paper')}
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Question Bank Card 2: Short Questions */}
          <div 
            onClick={() => currentUser?.isAdmin ? (onGoToUpload ? onGoToUpload() : handleNav('upload_material')) : onGoToGenerate()}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                  {totalBankShorts}
                </div>
                <div className="text-sm font-bold mt-1 text-white/95">
                  Short Questions
                  {isUrdu && <span className="block text-[11px] font-medium text-white/90">مختصر امتحانی سوالات</span>}
                </div>
                <p className="text-[11px] text-white/75 font-medium mt-0.5">
                  {isUrdu ? 'کل موجود مختصر بینک' : 'Total Uploaded Bank'}
                </p>
              </div>
              <FileText className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>
                {currentUser?.isAdmin 
                  ? (isUrdu ? 'Upload / Manage Shorts • اپلوڈ کریں' : 'Upload / Manage Shorts') 
                  : (isUrdu ? 'Select in Paper • ٹیسٹ میں شامل کریں' : 'Select in Paper')}
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Question Bank Card 3: Long Questions */}
          <div 
            onClick={() => currentUser?.isAdmin ? (onGoToUpload ? onGoToUpload() : handleNav('upload_material')) : onGoToGenerate()}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-800 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                  {totalBankLongs}
                </div>
                <div className="text-sm font-bold mt-1 text-white/95">
                  Long Questions
                  {isUrdu && <span className="block text-[11px] font-medium text-white/90">انشائیہ و تفصیلی سوالات</span>}
                </div>
                <p className="text-[11px] text-white/75 font-medium mt-0.5">
                  {isUrdu ? 'کل موجود انشائیہ بینک' : 'Total Uploaded Bank'}
                </p>
              </div>
              <BookOpen className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>
                {currentUser?.isAdmin 
                  ? (isUrdu ? 'Upload / Manage Longs • اپلوڈ کریں' : 'Upload / Manage Longs') 
                  : (isUrdu ? 'Select in Paper • ٹیسٹ میں شامل کریں' : 'Select in Paper')}
              </span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Question Bank Card 4: Complete Bank Coverage */}
          <div 
            onClick={onGoToGenerate}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                  {totalQuestions}
                </div>
                <div className="text-sm font-bold mt-1 text-white/95">
                  Question Bank
                  {isUrdu && <span className="block text-[11px] font-medium text-white/90">مجموعی امتحانی ذخیرہ</span>}
                </div>
                <p className="text-[11px] text-white/75 font-medium mt-0.5">
                  {isUrdu ? 'تمام مضامین کا بینک' : 'Across All Subjects'}
                </p>
              </div>
              <Layers className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>{isUrdu ? 'Use in Exam Builder • نیا ٹیسٹ بنائیں' : 'Use in Exam Builder'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>
      </div>

      {/* 6. PLATFORM QUALITY & ACADEMIC TRUST METRICS STRIP */}
      <div className="pt-2">
        <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded-full border border-cyan-400/20">
                Gold Standard Examination Platform
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight mt-1">
                Pakistan's Most Advanced Question Paper Management System
              </h3>
              {isUrdu && (
                <p className="text-xs text-indigo-200 mt-0.5">
                  پاکستان کا سب سے جدید اور خودکار امتحانی پرچہ ساز نظام • اسکولز اور اکیڈمیز کی اولین پسند
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-xl border border-emerald-400/20">
                <CheckCircle2 className="w-4 h-4" />
                Verified ISO/Board Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">9 Punjab Boards + FBISE</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  100% synchronized with Lahore, Rawalpindi, Multan, Gujranwala, Faisalabad & Federal syllabus.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">100% SLO Assessment</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Knowledge, Understanding & Application based question tagging compliant with new board policy.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <FileSignature className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Zero-Typing Bilingual Engine</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Native Jameel Noori Nastaliq & MathJax equations pre-rendered. No manual Urdu typing needed.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">500+ Top Academies</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                  Trusted daily by prominent colleges, franchise school networks, and tuition systems across Pakistan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>

      {/* 7. FOOTER (PINNED TO BOTTOM) */}
      <footer className="mt-auto pt-6 pb-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-semibold select-none">
        <div>
          Copyright © 2026 <span className="text-blue-600 font-bold">PRO TEST MAKER</span> • Developed by <span className="text-slate-800 font-bold">Haris Jabbar</span>. All rights reserved.
        </div>
      </footer>

      {/* 8. INTERACTIVE 1-CLICK TEST PRESET CONFIGURATOR MODAL */}
      {activePresetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className={`p-4 sm:p-5 bg-gradient-to-r ${activePresetModal.gradient} text-white relative flex items-start justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-inner">
                  {React.createElement(getPresetIcon(activePresetModal.iconName), { className: "w-6 h-6 text-white" })}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                      {activePresetModal.badge}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/20 text-amber-200 text-xs font-black">
                      {liveModalMarks} Marks • ⏱️ {modalTime}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight mt-1 text-white">
                    {activePresetModal.title}
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    {isUrdu ? activePresetModal.titleUrdu : activePresetModal.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActivePresetModal(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800 font-sans">
              
              {/* Question Ratio Specification & Live Adjuster Bar */}
              <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                    <span>⚡ Marks & Questions Breakdown (نمبرز اور سوالات کی تقسیم):</span>
                  </span>
                  <span className="font-black text-blue-700 text-xs bg-white px-2.5 py-0.5 rounded-lg border border-blue-200 shadow-2xs">
                    Total: {liveModalMarks} Marks
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block">MCQs (1 M)</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => setModalMcqCount(prev => Math.max(0, prev - 1))}
                        className="w-5 h-5 rounded-md bg-slate-100 hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center cursor-pointer"
                      >-</button>
                      <span className="font-black text-xs text-slate-800 w-5">{modalMcqCount}</span>
                      <button
                        type="button"
                        onClick={() => setModalMcqCount(prev => prev + 1)}
                        className="w-5 h-5 rounded-md bg-slate-100 hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center cursor-pointer"
                      >+</button>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block">Shorts (2 M)</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => setModalShortCount(prev => Math.max(0, prev - 1))}
                        className="w-5 h-5 rounded-md bg-slate-100 hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center cursor-pointer"
                      >-</button>
                      <span className="font-black text-xs text-slate-800 w-5">{modalShortCount}</span>
                      <button
                        type="button"
                        onClick={() => setModalShortCount(prev => prev + 1)}
                        className="w-5 h-5 rounded-md bg-slate-100 hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center cursor-pointer"
                      >+</button>
                    </div>
                  </div>

                  <div className="bg-white p-2 rounded-xl border border-blue-100 shadow-2xs">
                    <span className="text-[10px] text-slate-500 font-bold block">Longs (5 M)</span>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <button
                        type="button"
                        onClick={() => setModalLongCount(prev => Math.max(0, prev - 1))}
                        className="w-5 h-5 rounded-md bg-slate-100 hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center cursor-pointer"
                      >-</button>
                      <span className="font-black text-xs text-slate-800 w-5">{modalLongCount}</span>
                      <button
                        type="button"
                        onClick={() => setModalLongCount(prev => prev + 1)}
                        className="w-5 h-5 rounded-md bg-slate-100 hover:bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center cursor-pointer"
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 1: Select Class */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                  <span>1. Select Class (کلاس کا انتخاب کریں):</span>
                  <span className="text-[11px] text-blue-600 font-bold">Current: {modalClass}</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['9th', '10th', '11th', '12th'].map((cls) => (
                    <button
                      key={cls}
                      type="button"
                      onClick={() => {
                        setModalClass(cls);
                        const newSubs = bank?.[cls]?.subjects || [];
                        const firstSub = newSubs[0] || {};
                        setModalSubjectId(firstSub.id || '');
                        setModalSelectedChapterId(firstSub.chapters?.[0]?.id || '');
                      }}
                      className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                        modalClass === cls 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cls} Class
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
                  <span>2. Select Subject (مضمون منتخب کریں):</span>
                  <span className="text-[11px] text-blue-600 font-bold">{currentModalSubject?.name || 'Subject'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableModalSubjects.length > 0 ? (
                    availableModalSubjects.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setModalSubjectId(sub.id);
                          setModalSelectedChapterId(sub.chapters?.[0]?.id || '');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          (currentModalSubject?.id === sub.id || modalSubjectId === sub.id)
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400 italic py-1">No subjects found for this class.</div>
                  )}
                </div>
              </div>

              {/* Step 3: Syllabus Scope based on Preset */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-700 block">
                  3. Syllabus / Chapters Scope (نصاب کی حد):
                </label>

                {/* Scope selector for Chapter Test */}
                {activePresetModal.id === 'chapter_test' && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">Select single chapter for this test:</span>
                    <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                      {currentModalChapters.map((ch, idx) => (
                        <div
                          key={ch.id}
                          onClick={() => setModalSelectedChapterId(ch.id)}
                          className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all flex items-center justify-between ${
                            modalSelectedChapterId === ch.id 
                              ? 'bg-blue-50 border-blue-400 text-blue-800 shadow-2xs' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black">
                              {ch.chapterNumber || idx + 1}
                            </span>
                            <span>{ch.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {(ch.topics || []).length} Topics
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Scope selector for Half-Book Exam */}
                {activePresetModal.id === 'half_book' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div
                      onClick={() => setModalScope('first_half')}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        modalScope === 'first_half'
                          ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs flex items-center justify-between">
                        <span>First Half Book</span>
                        {modalScope === 'first_half' && <Check className="w-4 h-4 text-teal-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Chapters 1 to {halfPoint} ({firstHalfChapters.length} Chapters)
                      </p>
                    </div>

                    <div
                      onClick={() => setModalScope('second_half')}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        modalScope === 'second_half'
                          ? 'bg-teal-50 border-teal-500 text-teal-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs flex items-center justify-between">
                        <span>Second Half Book</span>
                        {modalScope === 'second_half' && <Check className="w-4 h-4 text-teal-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Chapters {halfPoint + 1} to {currentModalChapters.length} ({secondHalfChapters.length} Chapters)
                      </p>
                    </div>
                  </div>
                )}

                {/* Scope selector for Grand Board Mock & MCQs Quiz */}
                {(activePresetModal.id === 'grand_mock' || activePresetModal.id === 'mcqs_quiz') && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div
                      onClick={() => setModalScope('full')}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        modalScope === 'full'
                          ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs flex items-center justify-between">
                        <span>Full Book (All Chapters)</span>
                        {modalScope === 'full' && <Check className="w-4 h-4 text-purple-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Board Standard Pattern covering all {currentModalChapters.length} chapters.
                      </p>
                    </div>

                    <div
                      onClick={() => setModalScope('custom')}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        modalScope === 'custom'
                          ? 'bg-purple-50 border-purple-500 text-purple-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div className="font-black text-xs flex items-center justify-between">
                        <span>Custom Chapters</span>
                        {modalScope === 'custom' && <Check className="w-4 h-4 text-purple-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Select specific chapters for custom term exam.
                      </p>
                    </div>
                  </div>
                )}

                {/* Custom Chapter Checkboxes (when Custom is selected) */}
                {modalScope === 'custom' && (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 max-h-32 overflow-y-auto space-y-1">
                    {currentModalChapters.map(ch => {
                      const isChecked = modalCustomChapterIds.includes(ch.id);
                      return (
                        <div
                          key={ch.id}
                          onClick={() => {
                            setModalCustomChapterIds(prev => 
                              isChecked ? prev.filter(id => id !== ch.id) : [...prev, ch.id]
                            );
                          }}
                          className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg cursor-pointer text-xs font-semibold text-slate-700"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span>Chapter {ch.chapterNumber}: {ch.name}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Step 4: Language Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-slate-700 block">
                  4. Paper Language (پرچے کی زبان):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'bilingual', label: 'Bilingual (اردو + English)' },
                    { id: 'en', label: 'English Only' },
                    { id: 'ur', label: 'Urdu Only (اردو)' }
                  ].map(lang => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setModalLanguage(lang.id)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        modalLanguage === lang.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 5: Custom Title */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-700 block">
                  5. Paper Title / Exam Header:
                </label>
                <input
                  type="text"
                  value={modalExamTitle}
                  onChange={(e) => setModalExamTitle(e.target.value)}
                  placeholder="e.g. Chapter Test 1 - Computer Science"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={handleExecuteManualMode}
                className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize Topics Manually</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActivePresetModal(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteGenerate}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-blue-600/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Generate Exam Paper Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 9. ADMIN DEDICATED PRESET CUSTOMIZATION MODAL */}
      {isSuper && editingPreset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 font-sans">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase">
                      Admin Configurator
                    </span>
                  </div>
                  <h3 className="text-base font-black tracking-tight text-white mt-0.5">
                    Customize Preset: {editingPreset.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingPreset(null)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveCustomPreset} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800">
              
              {/* Dynamic Live Calculated Total Marks Preview */}
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 block">Live Total Marks Formula:</span>
                  <span className="text-slate-700 font-bold">
                    ({editForm.mcqCount} × {editForm.mcqMarks}) + ({editForm.shortCount} × {editForm.shortMarks}) + ({editForm.longCount} × {editForm.longMarks})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-purple-700 leading-none">
                    {(editForm.mcqCount * editForm.mcqMarks) + (editForm.shortCount * editForm.shortMarks) + (editForm.longCount * editForm.longMarks)}
                  </span>
                  <span className="text-[10px] font-bold text-purple-500 block">Total Marks</span>
                </div>
              </div>

              {/* Title & Badge Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">Preset Title (English):</label>
                  <input
                    type="text"
                    required
                    value={editForm.title}
                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">Preset Title (Urdu):</label>
                  <input
                    type="text"
                    value={editForm.titleUrdu}
                    onChange={(e) => setEditForm(prev => ({ ...prev, titleUrdu: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">Badge Label:</label>
                  <input
                    type="text"
                    value={editForm.badge}
                    onChange={(e) => setEditForm(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. Weekly / Class Test"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-700">Time Allowed (وقت):</label>
                  <input
                    type="text"
                    value={editForm.time}
                    onChange={(e) => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g. 35 Mins or 1 Hour"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              {/* MCQs Setting */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-800">
                  <span>1. Multiple Choice Questions (MCQs):</span>
                  <span className="text-purple-600">{editForm.mcqCount * editForm.mcqMarks} Marks</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold block mb-1">Total MCQs Count:</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editForm.mcqCount}
                      onChange={(e) => setEditForm(prev => ({ ...prev, mcqCount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold block mb-1">Marks per MCQ:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.mcqMarks}
                      onChange={(e) => setEditForm(prev => ({ ...prev, mcqMarks: parseInt(e.target.value) || 1 }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Shorts Setting */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-800">
                  <span>2. Short Questions (مختصر سوالات):</span>
                  <span className="text-purple-600">{editForm.shortCount * editForm.shortMarks} Marks</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold block mb-1">Total Shorts Count:</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={editForm.shortCount}
                      onChange={(e) => setEditForm(prev => ({ ...prev, shortCount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold block mb-1">Marks per Short:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={editForm.shortMarks}
                      onChange={(e) => setEditForm(prev => ({ ...prev, shortMarks: parseInt(e.target.value) || 2 }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Longs Setting */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-800">
                  <span>3. Long Questions (تفصیلی سوالات):</span>
                  <span className="text-purple-600">{editForm.longCount * editForm.longMarks} Marks</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold block mb-1">Total Longs Count:</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={editForm.longCount}
                      onChange={(e) => setEditForm(prev => ({ ...prev, longCount: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-bold block mb-1">Marks per Long:</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={editForm.longMarks}
                      onChange={(e) => setEditForm(prev => ({ ...prev, longMarks: parseInt(e.target.value) || 5 }))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-black text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleResetPresetsToDefault}
                  className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Board Defaults</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingPreset(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md shadow-purple-600/25 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Custom Preset</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
