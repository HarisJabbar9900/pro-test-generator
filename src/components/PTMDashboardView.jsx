import React from 'react';
import { 
  Send, Save, Newspaper, Users, Settings, Trash2, 
  Copy, Clock, PenTool, BookOpen, FileSignature, ArrowRight, 
  Cloud, Layers, ShieldCheck, ChevronRight, ListChecks, FileText,
  Sparkles, Database, Award, Landmark, Languages, Calendar,
  Printer, Download, Zap, Flame, CheckCircle2, Check, ExternalLink,
  GraduationCap, Timer
} from 'lucide-react';
import { notify } from '../utils/notify';
import { getUserStats } from '../utils/userActivityTracker';
import { isSuperAdmin } from '../utils/pricingPlansService';

const TEST_PRESETS = [
  {
    id: 'chapter_test',
    title: 'Chapter Test',
    titleUrdu: 'باب وار امتحانی ٹیسٹ',
    marks: 25,
    time: '35 Mins',
    desc: '5 MCQs + 5 Shorts + 1 Long',
    descUrdu: '5 معروضی + 5 مختصر + 1 تفصیلی',
    badge: 'Weekly / Class Test',
    gradient: 'from-blue-600 via-indigo-600 to-indigo-700',
    icon: Zap
  },
  {
    id: 'half_book',
    title: 'Half-Book Exam',
    titleUrdu: 'ہاف بک مڈٹرم امتحان',
    marks: 50,
    time: '75 Mins',
    desc: '10 MCQs + 10 Shorts + 2 Longs',
    descUrdu: '10 معروضی + 10 مختصر + 2 تفصیلی',
    badge: 'Midterm Standard',
    gradient: 'from-teal-600 via-emerald-600 to-green-700',
    icon: Flame
  },
  {
    id: 'grand_mock',
    title: 'Grand Board Mock',
    titleUrdu: 'گرینڈ بورڈ ماک پیپر',
    marks: 75,
    time: '2.5 Hours',
    desc: 'Full BISE Annual Pattern',
    descUrdu: 'مکمل بورڈ پیٹرن و تقسیم',
    badge: 'Pre-Board Grand Exam',
    gradient: 'from-purple-600 via-violet-600 to-indigo-700',
    icon: Award
  },
  {
    id: 'mcqs_quiz',
    title: 'Objective Quiz',
    titleUrdu: 'معروضی کوئز و ببل شیٹ',
    marks: 20,
    time: '20 Mins',
    desc: '20 MCQs with OMR Sheet',
    descUrdu: '20 معروضی + او ایم آر شیٹ',
    badge: 'OMR Bubble Sheet',
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    icon: ListChecks
  }
];

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
  setPaperConfig
}) {
  const isSuper = isSuperAdmin(currentUser);
  const isUrdu = appLanguage === 'ur';
  const userStats = getUserStats(currentUser?.email);

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

  const handleApplyPreset = (preset) => {
    if (typeof setPaperConfig === 'function') {
      setPaperConfig(prev => ({
        ...prev,
        examTitle: `${preset.title} (${preset.marks} Marks)`,
        timeAllowed: preset.time,
        totalMarks: preset.marks,
        presetType: preset.id
      }));
    }
    notify.success(`${preset.title} (${preset.marks} Marks) Selected!`, {
      description: isUrdu
        ? 'ٹیسٹ کا سانچہ سیٹ ہو چکا ہے۔ اب مطلوبہ عنوانات منتخب کر کے پرچہ تیار کریں۔'
        : 'Exam preset loaded. Select your chapters/topics to generate instantly.'
    });
    if (typeof onGoToGenerate === 'function') {
      onGoToGenerate();
    }
  };

  const recentPapers = (savedPapers || []).slice(0, 3);

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto font-sans min-h-full flex-1 flex flex-col justify-between w-full">
      <div className="space-y-6 sm:space-y-8">
      
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
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto relative z-10">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
            <div className="text-base sm:text-lg font-black text-amber-300 leading-tight">
              {daysToMatric} <span className="text-[10px] text-white/70 font-semibold uppercase">Days</span>
            </div>
            <div className="text-[9px] font-bold text-white/80">
              {isUrdu ? 'میٹرک بورڈ 2026' : 'Matric Annual'}
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs text-center">
            <div className="text-base sm:text-lg font-black text-cyan-300 leading-tight">
              {daysToInter} <span className="text-[10px] text-white/70 font-semibold uppercase">Days</span>
            </div>
            <div className="text-[9px] font-bold text-white/80">
              {isUrdu ? 'انٹر بورڈ 2026' : 'Inter Annual'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleNav('model_papers')}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>{isUrdu ? 'ماڈل پیپرز' : 'Model Papers'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 1. TOP 5 SPECIFIC USER METRIC CARDS (DEDICATED TO THIS USER) */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider">
              {currentUser?.name ? `${currentUser.name} • Faculty Dashboard` : 'Teacher Overview'}
            </span>
            {isUrdu && (
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                اساتذہ ڈیش بورڈ
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isSuper && (
              <button
                type="button"
                onClick={() => handleNav('user_management')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 transition-all cursor-pointer shadow-2xs"
                title="User Management (تمام رجسٹرڈ اساتذہ اور پاسورڈز دیکھیں)"
              >
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>{isUrdu ? 'یوزر مینجمنٹ • User Management' : 'User Management'}</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          {/* User Card 1: Generate Paper (Royal Blue / Cyan Gradient) */}
          <div 
            onClick={onGoToGenerate}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-xs">
                  Instant
                </div>
                <div className="text-sm font-bold mt-1 text-white/95 leading-snug">
                  Generate Paper
                  {isUrdu && <span className="block text-xs font-bold text-cyan-100">امتحانی پرچہ تیار کریں</span>}
                </div>
                <p className="text-[11px] text-white/75 font-medium mt-0.5 leading-tight">
                  Custom Exam Builder
                  {isUrdu && <span className="block text-[10px] text-white/80">فوری ٹیسٹ بنانے کا نظام</span>}
                </p>
              </div>
              <Send className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>{isUrdu ? 'Generate Now • ابھی بنائیں' : 'Generate Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Card 2: My Saved Papers (Emerald / Teal Gradient) */}
          <div 
            onClick={() => handleNav('saved_papers')}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">{savedPapers?.length || 0}</div>
                <div className="text-sm font-bold mt-1 text-white/95 leading-snug">
                  My Saved Papers
                  {isUrdu && <span className="block text-xs font-bold text-emerald-100">محفوظ شدہ پرچے</span>}
                </div>
                <p className="text-[11px] text-white/75 font-medium mt-0.5 leading-tight">
                  Ready to Print & PDF
                  {isUrdu && <span className="block text-[10px] text-white/80">پرنٹ اور پی ڈی ایف کے لیے تیار</span>}
                </p>
              </div>
              <Save className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>{isUrdu ? 'Open Saved Papers • پرچے دیکھیں' : 'Open Saved Papers'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Card 3: Total Papers Created (Amber / Golden Gradient) */}
          <div 
            onClick={() => handleNav('papers_history')}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                  {userTotalCreated}
                </div>
                <div className="text-sm font-bold mt-1 text-white leading-snug">
                  Created Papers
                  {isUrdu && <span className="block text-xs font-bold text-amber-100">کل تیار کردہ پیپرز</span>}
                </div>
                <p className="text-[11px] text-white/80 font-medium mt-0.5 leading-tight">
                  My Generated Archives
                  {isUrdu && <span className="block text-[10px] text-white/80">بنائے گئے ٹیسٹوں کی تاریخ</span>}
                </p>
              </div>
              <Copy className="w-14 h-14 sm:w-16 sm:h-16 text-white/20 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>{isUrdu ? 'View Paper History • تاریخچہ کھولیں' : 'View Paper History'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Card 4: Paper Quota Remaining (Warm Rose / Coral Gradient) */}
          <div 
            onClick={() => handleNav('pricing_plans')}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                  {isUnlimited ? '∞' : remainingQuota}
                </div>
                <div className="text-sm font-bold mt-1 text-white/95 leading-snug">
                  Remaining Quota
                  {isUrdu && <span className="block text-xs font-bold text-rose-100">پیپرز کی باقی گنجائش</span>}
                </div>
                <p className="text-[11px] text-white/75 font-medium mt-0.5 leading-tight">
                  {isUnlimited 
                    ? (isSuper ? 'Unlimited Generations (Admin)' : 'Unlimited Paper Generations') 
                    : `Of ${userMaxLimit} Papers Limit`}
                  {isUrdu && (
                    <span className="block text-[10px] text-white/80">
                      {isUnlimited ? 'لامحدود پیپرز بنانے کی سہولت' : `کل ${userMaxLimit} پیپرز میں سے باقی`}
                    </span>
                  )}
                </p>
              </div>
              <Layers className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>{isSuper ? 'Admin Quota' : (isUnlimited ? (isUrdu ? 'Active Plan • فعال پلان' : 'Active Plan') : (isUrdu ? 'Manage Plan • پلان اپگریڈ' : 'Manage Subscription'))}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* User Card 5: My Plan & Profile Status (Deep Purple / Indigo Gradient) */}
          <div 
            onClick={() => handleNav('pricing')}
            className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-800 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
          >
            <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
              <div>
                <div className="text-base sm:text-lg font-black tracking-tight drop-shadow-xs leading-snug line-clamp-2">
                  {isSuper ? 'Super Admin' : (currentUser?.package && currentUser?.package !== 'None' ? currentUser.package : 'Basic Plan')}
                </div>
                <div className="text-xs font-bold mt-1 text-white/90 leading-snug">
                  {currentUser?.institute || 'Educators Academy'}
                  {isUrdu && <span className="block text-[10px] text-purple-200">منسلک ادارہ</span>}
                </div>

                {/* Expiry Date Badge inside Card 5 */}
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/25 backdrop-blur-xs text-[11px] font-bold text-amber-200 border border-white/10">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isUrdu ? 'میعاد ختم:' : 'Expires:'} {currentUser?.expiryDate || '31-12-2026'}</span>
                </div>
              </div>
              <ShieldCheck className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
            </div>
            <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
              <span>{isUrdu ? 'View Plan Details • تفصیلات' : 'View Plan Details'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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

      {/* 2. ⚡ INSTANT 1-CLICK EXAM PRESETS (ELITE FEATURE) */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>1-Click Instant Exam Presets</span>
              {isUrdu && <span className="text-xs font-bold text-amber-600 font-sans">• فوری 1-کلک امتحانی سانچے</span>}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {isUrdu 
                ? 'وقت کی بچت کریں! ایک کلک میں بورڈ پیٹرن، نمبرز اور وقت کی پہلے سے تصدیق شدہ سیٹنگز لاگو کریں۔' 
                : 'Save time! 1-click verified exam templates with pre-configured marks, time limit, and section ratios.'}
            </p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 self-start sm:self-auto bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            {isUrdu ? 'تیز ترین پرچہ سازی • Fast Track' : '⚡ 1-Click Setup'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {TEST_PRESETS.map((preset) => {
            const IconComponent = preset.icon;
            return (
              <div
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className="bg-white hover:bg-slate-50/90 rounded-2xl p-4 border border-slate-200/90 hover:border-blue-400 shadow-2xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${preset.gradient} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black border border-slate-200">
                        {preset.marks} Marks
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                        ⏱️ {preset.time}
                      </span>
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
                <ChevronRight className="w-3 h-3" />
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
                <ChevronRight className="w-3 h-3" />
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
                <ChevronRight className="w-3 h-3" />
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

          {/* Tool 6: Study Scheme */}
          <div 
            onClick={() => notify.info(isUrdu ? "اسٹڈی و پیئرنگ اسکیم: پنجاب بورڈز 2025-2026" : "Study Scheme: Punjab Boards 2025-2026")}
            className="bg-white hover:bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:border-teal-400 shadow-2xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between min-h-[145px] group relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-500/25 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-black tracking-wide shrink-0 shadow-2xs">
                {isUrdu ? 'بورڈ اسکیم' : 'Pairing'}
              </span>
            </div>

            <div className="mt-3">
              <h3 className="text-sm font-black text-slate-800 group-hover:text-teal-600 transition-colors tracking-tight leading-snug">
                Study Scheme
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5 leading-tight">
                Official Punjab Boards Pairing Scheme
              </p>
              {isUrdu && (
                <p className="text-[11px] text-teal-800 font-semibold mt-1 leading-tight">
                  امتحانی تقسیم اور باب وار نمبرز کی سرکاری اسکیم
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 text-[11px] font-bold text-slate-600 group-hover:text-teal-700 transition-colors">
              <span>{isUrdu ? 'View Scheme • پیئرنگ اسکیم دیکھیں' : 'View Scheme'}</span>
              <div className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-teal-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all group-hover:translate-x-0.5 shadow-2xs">
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

    </div>
  );
}
