import React from 'react';
import { 
  Send, Save, Newspaper, Users, Settings, Trash2, 
  Copy, Clock, PenTool, BookOpen, FileSignature, ArrowRight, 
  Cloud, Layers, ShieldCheck, ChevronRight, ListChecks, FileText
} from 'lucide-react';
import { notify } from '../utils/notify';
import { getUserStats } from '../utils/userActivityTracker';

export default function PTMDashboardView({
  onGoToGenerate,
  onGoToUpload,
  onGoToDirectory,
  onGoToSettings,
  onNavigate,
  bank,
  selectedClass,
  savedPapers = [],
  currentUser = null
}) {
  const userStats = getUserStats(currentUser?.email);

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
    if (typeof onNavigate === 'function') {
      onNavigate(target);
    } else if (target === 'generate_paper') {
      onGoToGenerate();
    } else if (target === 'default_paper_settings') {
      onGoToSettings?.();
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto font-sans min-h-full flex-1 flex flex-col justify-between w-full">
      <div className="space-y-4 sm:space-y-6">
      
      {/* 1. TOP 5 VIBRANT EXECUTIVE METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* Card 1: Generate Paper (Royal Blue / Cyan Gradient) */}
        <div 
          onClick={onGoToGenerate}
          className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
        >
          <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">4</div>
              <div className="text-sm font-bold mt-1 text-white/95">Generate Paper</div>
              <p className="text-[11px] text-white/75 font-medium mt-0.5">Instant Exam Builder</p>
            </div>
            <Send className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
          </div>
          <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
            <span>Generate Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Saved Papers (Emerald / Teal Gradient) */}
        <div 
          onClick={() => handleNav('saved_papers')}
          className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
        >
          <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">{savedPapers?.length || 0}</div>
              <div className="text-sm font-bold mt-1 text-white/95">Saved Papers</div>
              <p className="text-[11px] text-white/75 font-medium mt-0.5">Ready to Print & Export</p>
            </div>
            <Save className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
          </div>
          <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
            <span>Open Now</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: MCQs Questions (Amber / Golden Gradient) */}
        <div 
          onClick={() => currentUser?.isAdmin ? (onGoToUpload ? onGoToUpload() : handleNav('upload_material')) : onGoToGenerate()}
          className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
        >
          <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                {totalBankMcqs}
              </div>
              <div className="text-sm font-bold mt-1 text-white">MCQs Questions</div>
              <p className="text-[11px] text-white/80 font-medium mt-0.5">Total Uploaded Bank</p>
            </div>
            <ListChecks className="w-14 h-14 sm:w-16 sm:h-16 text-white/20 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
          </div>
          <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
            <span>{currentUser?.isAdmin ? 'Upload / Manage MCQs' : 'Use in Paper'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Short Questions (Warm Rose / Coral Gradient) */}
        <div 
          onClick={() => currentUser?.isAdmin ? (onGoToUpload ? onGoToUpload() : handleNav('upload_material')) : onGoToGenerate()}
          className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-orange-500 via-rose-500 to-red-600 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
        >
          <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                {totalBankShorts}
              </div>
              <div className="text-sm font-bold mt-1 text-white/95">Short Questions</div>
              <p className="text-[11px] text-white/75 font-medium mt-0.5">Total Uploaded Bank</p>
            </div>
            <FileText className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" />
          </div>
          <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
            <span>{currentUser?.isAdmin ? 'Upload / Manage Shorts' : 'Use in Paper'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 5: Long Questions (Deep Purple / Indigo Gradient) */}
        <div 
          onClick={() => currentUser?.isAdmin ? (onGoToUpload ? onGoToUpload() : handleNav('upload_material')) : onGoToGenerate()}
          className="rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-800 text-white flex flex-col justify-between relative group cursor-pointer border border-white/15"
        >
          <div className="p-4 sm:p-5 flex items-start justify-between relative z-10">
            <div>
              <div className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-xs">
                {totalBankLongs}
              </div>
              <div className="text-sm font-bold mt-1 text-white/95">Long Questions</div>
              <p className="text-[11px] text-white/75 font-medium mt-0.5">Total Uploaded Bank</p>
            </div>
            <BookOpen className="w-14 h-14 sm:w-16 sm:h-16 text-white/15 absolute right-3 top-3 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
          </div>
          <div className="w-full py-2.5 px-4 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white text-xs font-bold flex items-center justify-between transition-colors border-t border-white/15">
            <span>{currentUser?.isAdmin ? 'Upload / Manage Longs' : 'Use in Paper'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 2. REFINED PROFESSIONAL DASHBOARD UTILITY TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Tool 1: Default Settings */}
        <div 
          onClick={onGoToSettings}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-400/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-3 group relative"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
              <Settings className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors truncate">
                Default Settings
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                <span className="font-black text-slate-900">27</span> Configurations
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-blue-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 2: Deleted Papers */}
        <div 
          onClick={() => notify.info("Deleted Papers Archive is empty.")}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-rose-400/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-3 group relative"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-rose-600 transition-colors truncate">
                Deleted Papers
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                <span className="font-black text-slate-900">0</span> Papers
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-rose-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 3: Paper History */}
        <div 
          onClick={() => handleNav('papers_history')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-emerald-400/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-3 group relative"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Copy className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors truncate">
                Paper History
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                <span className="font-black text-slate-900">4</span> Archive Records
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-emerald-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 4: Login History / My Activity */}
        <div 
          onClick={() => handleNav('login_history')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-amber-400/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-3 group relative"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
              <Clock className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-amber-600 transition-colors truncate">
                {currentUser?.isAdmin ? 'User Management & Audit' : 'My Activity & Stats'}
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                {currentUser?.isAdmin ? (
                  <>
                    <span className="font-black text-slate-900">Live</span> Accounts & Quotas
                  </>
                ) : (
                  <>
                    <span className="font-black text-slate-900">{userStats.loginCount}</span> Logins • <span className="font-black text-slate-900">{Math.max(userStats.createdCount, savedPapers.length)}</span> Papers
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-amber-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 5: Draft Papers */}
        <div 
          onClick={() => handleNav('saved_papers')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-purple-400/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-3 group relative"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <PenTool className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-purple-600 transition-colors truncate">
                Draft Papers
              </h3>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                <span className="font-black text-slate-900">1</span> Unsaved Paper
              </p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-purple-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 6: Study Scheme (With 'Old' Badge) */}
        <div 
          onClick={() => notify.info("Study Scheme: Punjab Boards 2024-2025")}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-teal-400/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-3 group relative"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-teal-600 transition-colors">
                  Study Scheme
                </h3>
                <span className="px-1.5 py-0.5 bg-cyan-100 text-cyan-800 border border-cyan-300 text-[9px] font-black rounded-full">Old</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate">Punjab Boards</p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-teal-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 7: Smart Syllabus (With 'New' Badge - No Text Truncation!) */}
        <div 
          onClick={() => notify.info("Smart Syllabus: Punjab Boards (2025-26)")}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-indigo-400/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-3 group relative"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Newspaper className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                  Smart Syllabus
                </h3>
                <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full shadow-2xs">New</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate">Punjab (2025-26)</p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-indigo-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Tool 8: Model Papers (With 'New' Badge) */}
        <div 
          onClick={() => handleNav('model_papers')}
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-orange-400/80 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-between gap-3 group relative"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
              <FileSignature className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-slate-800 tracking-tight group-hover:text-orange-600 transition-colors">
                  Model Papers
                </h3>
                <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[9px] font-black rounded-full shadow-2xs">New</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate">Full Book Samples</p>
            </div>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-orange-600 text-slate-400 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
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
