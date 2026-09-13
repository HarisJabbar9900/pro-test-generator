import { 
  Send, Save, Newspaper, Users, Settings, Trash2, 
  Copy, Clock, PenTool, BookOpen, FileSignature, ArrowRight, 
  Cloud, Layers, ShieldCheck, ChevronRight, ListChecks, FileText,
  Sparkles, Database, Award, Landmark, Languages
} from 'lucide-react';
import { notify } from '../utils/notify';
import { getUserStats } from '../utils/userActivityTracker';
import { isSuperAdmin } from '../utils/pricingPlansService';

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
  onToggleLanguage
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

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto font-sans min-h-full flex-1 flex flex-col justify-between w-full">
      <div className="space-y-5 sm:space-y-7">
      
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
            {/* Quick in-page Urdu toggle */}
            <button
              type="button"
              onClick={onToggleLanguage}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs ${
                isUrdu 
                  ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 ring-2 ring-emerald-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title={isUrdu ? "اردو فعال ہے (Switch to English)" : "اردو زبان فعال کریں (Switch to Urdu)"}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'اردو فعال (Urdu)' : 'اردو میں دیکھیں'}</span>
            </button>

            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {isSuper ? (isUrdu ? 'سپر ایڈمن (Super Admin)' : 'Super Admin') : (currentUser?.package || (isUrdu ? 'تصدیق شدہ استاد' : 'Verified Faculty'))}
            </span>
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
                <div className="text-3xl sm:text-4xl font-black tracking-tight drop-shadow-xs truncate max-w-[170px]">
                  {isSuper ? 'Super Admin' : (currentUser?.package && currentUser?.package !== 'None' ? currentUser.package.split(' ')[0] : 'Faculty')}
                </div>
                <div className="text-sm font-bold mt-1 text-white/95 leading-snug">
                  {isSuper ? 'Admin Console' : 'My Faculty Plan'}
                  {isUrdu && <span className="block text-xs font-bold text-purple-100">میرا اسکول و پیکیج پلان</span>}
                </div>
                <p className="text-[11px] text-white/75 font-medium mt-0.5 truncate max-w-[150px] leading-tight">
                  {currentUser?.institute || 'Educators Academy'}
                  {isUrdu && <span className="block text-[10px] text-white/80">منسلک ادارہ</span>}
                </p>
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

      {/* 2. REFINED PROFESSIONAL DASHBOARD UTILITY & ACADEMIC HUB */}
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

      {/* 3. QUESTION BANK MASTER CONTENT & STATISTICS (SHOWN BELOW THE LOWER CARDS) */}
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

      </div>

      {/* 4. FOOTER (PINNED TO BOTTOM) */}
      <footer className="mt-auto pt-6 pb-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-semibold select-none">
        <div>
          Copyright © 2026 <span className="text-blue-600 font-bold">PRO TEST MAKER</span> • Developed by <span className="text-slate-800 font-bold">Haris Jabbar</span>. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
