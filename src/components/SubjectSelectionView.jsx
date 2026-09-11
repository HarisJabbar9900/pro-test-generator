import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Monitor, Atom, FlaskConical, 
  Dna, Calculator, BookOpen, FileText, Globe, Clock, X, Sparkles, CheckCircle2 
} from 'lucide-react';

const SUBJECT_THEMES = {
  computer: {
    icon: Monitor,
    color: 'cyan',
    accentGradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    iconBg: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white',
    tag: 'Technology'
  },
  physics: {
    icon: Atom,
    color: 'indigo',
    accentGradient: 'from-indigo-600 via-purple-600 to-pink-500',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    tag: 'Science'
  },
  chemistry: {
    icon: FlaskConical,
    color: 'rose',
    accentGradient: 'from-rose-500 via-pink-600 to-red-500',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    tag: 'Science'
  },
  biology: {
    icon: Dna,
    color: 'emerald',
    accentGradient: 'from-emerald-600 via-teal-600 to-green-500',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    tag: 'Pre-Medical'
  },
  math: {
    icon: Calculator,
    color: 'amber',
    accentGradient: 'from-amber-500 via-orange-600 to-yellow-500',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    tag: 'Mathematics'
  },
  english: {
    icon: BookOpen,
    color: 'blue',
    accentGradient: 'from-blue-600 via-indigo-600 to-slate-600',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    tag: 'Languages'
  },
  urdu: {
    icon: FileText,
    color: 'violet',
    accentGradient: 'from-violet-600 via-fuchsia-600 to-purple-600',
    badgeBg: 'bg-violet-50 text-violet-700 border-violet-200',
    iconBg: 'bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    tag: 'National'
  },
  islamiat: {
    icon: BookOpen,
    color: 'teal',
    accentGradient: 'from-teal-600 via-emerald-600 to-cyan-600',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    iconBg: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
    tag: 'Islamic'
  },
  pak: {
    icon: Globe,
    color: 'emerald',
    accentGradient: 'from-green-600 via-emerald-600 to-teal-600',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    tag: 'Social Studies'
  }
};

function getSubjectTheme(sub) {
  const name = (sub.name || '').toLowerCase();
  const id = (sub.id || '').toLowerCase();
  
  if (name.includes('computer') || id.includes('cs')) return SUBJECT_THEMES.computer;
  if (name.includes('physic') || id.includes('phy')) return SUBJECT_THEMES.physics;
  if (name.includes('chem')) return SUBJECT_THEMES.chemistry;
  if (name.includes('bio')) return SUBJECT_THEMES.biology;
  if (name.includes('math')) return SUBJECT_THEMES.math;
  if (name.includes('urdu')) return SUBJECT_THEMES.urdu;
  if (name.includes('eng')) return SUBJECT_THEMES.english;
  if (name.includes('islam')) return SUBJECT_THEMES.islamiat;
  if (name.includes('pak')) return SUBJECT_THEMES.pak;

  return {
    icon: BookOpen,
    color: 'blue',
    accentGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    tag: 'General'
  };
}

export default function SubjectSelectionView({
  selectedClass,
  subjects = [],
  onSelectSubject,
  onBack
}) {
  const [comingSoonSubject, setComingSoonSubject] = useState(null);

  const handleSubjectClick = (sub, subTotal) => {
    if (subTotal <= 0) {
      setComingSoonSubject(sub);
      return;
    }
    onSelectSubject(sub.id);
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-7 relative">
      
      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
            title="Go Back to Classes"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Select Subject
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black">
                {selectedClass} Class
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Choose a subject to build tests, select topics, and browse the question bank
            </p>
          </div>
        </div>

        {/* BREADCRUMB */}
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <button 
            type="button"
            onClick={onBack} 
            className="text-blue-600 hover:underline cursor-pointer font-bold"
          >
            Classes
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-slate-800 font-black">{selectedClass} Class</span>
          <span className="text-slate-400">/</span>
          <span className="text-blue-700 font-bold">Subjects</span>
        </div>
      </div>

      {/* PROFESSIONAL SUBJECT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-1">
        {subjects.map((sub) => {
          const subMcqs = (sub.chapters || []).reduce((acc, ch) => acc + (ch.topics || []).reduce((tAcc, t) => tAcc + (t.mcqs?.length || 0), 0), 0);
          const subShorts = (sub.chapters || []).reduce((acc, ch) => acc + (ch.topics || []).reduce((tAcc, t) => tAcc + (t.shortQuestions?.length || 0), 0), 0);
          const subLongs = (sub.chapters || []).reduce((acc, ch) => acc + (ch.topics || []).reduce((tAcc, t) => tAcc + (t.longQuestions?.length || 0), 0), 0);
          const subTotal = subMcqs + subShorts + subLongs;
          const chCount = sub.chapters?.length || 0;
          const isReady = subTotal > 0;

          const theme = getSubjectTheme(sub);
          const IconComponent = theme.icon;

          return (
            <div
              key={sub.id}
              onClick={() => handleSubjectClick(sub, subTotal)}
              className={`group relative cursor-pointer select-none rounded-2xl bg-white p-5 sm:p-6 shadow-xs hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border overflow-hidden flex flex-col justify-between min-h-[270px] ${
                isReady
                  ? 'border-slate-200 hover:border-blue-400'
                  : 'border-amber-200/90 hover:border-amber-400 bg-linear-to-b from-white via-white to-amber-50/20'
              }`}
            >
              {/* Top Accent Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${theme.accentGradient}`} />

              {/* Card Header Row */}
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full border shadow-2xs ${theme.badgeBg}`}>
                    {theme.tag}
                  </span>
                  {isReady ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Data Entry</span>
                    </span>
                  )}
                </div>

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-xs ${theme.iconBg}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              {/* Card Main Body */}
              <div className="my-2 space-y-1.5">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                  {sub.name}
                </h2>

                <p className="text-[11px] font-semibold text-slate-400">
                  Single National Curriculum • {selectedClass} Class
                </p>

                {/* Chapters & Questions Statistics Pill */}
                <div className="pt-2">
                  {isReady ? (
                    <div className="space-y-1.5">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold shadow-2xs">
                        <span>📚 {chCount} Chapters ({subTotal} Questions)</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono font-bold text-slate-600">
                        <span className="px-1.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200">{subMcqs} MCQs</span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">{subShorts} Shorts</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">{subLongs} Longs</span>
                      </div>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                      <span>⏳ Data Entry Underway</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Bottom Interactive Action Bar */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${isReady ? 'text-slate-700 group-hover:text-blue-600' : 'text-amber-700 group-hover:text-amber-800'}`}>
                  <span>{isReady ? 'Enter Subject' : 'Data Entry Ongoing'}</span>
                </span>
                
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:translate-x-1 ${isReady ? 'bg-slate-100 group-hover:bg-blue-600 text-slate-500 group-hover:text-white' : 'bg-amber-100 text-amber-700 group-hover:bg-amber-500 group-hover:text-white'}`}>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Subtle Ambient Hover Backdrop */}
              <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/20 transition-colors pointer-events-none rounded-2xl" />
            </div>
          );
        })}
      </div>

      {/* BILINGUAL "SUBJECT DATA ENTRY IN PROGRESS" MODAL */}
      {comingSoonSubject && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setComingSoonSubject(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scaleUp relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Gradient Banner */}
            <div className={`p-6 bg-gradient-to-r ${getSubjectTheme(comingSoonSubject).accentGradient} text-white relative overflow-hidden`}>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
                    <Clock className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-white/80 block">
                      Under Active Data Entry
                    </span>
                    <h3 className="text-2xl font-black tracking-tight text-white">
                      {comingSoonSubject.name}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setComingSoonSubject(null)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content: English & Urdu */}
            <div className="p-6 space-y-5">
              {/* English Section */}
              <div className="space-y-1.5 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <h4 className="text-base font-black text-slate-900 tracking-tight">
                    Data Entry in Progress!
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We are currently uploading, digitizing, and verifying the comprehensive question bank (MCQs, Short & Long questions) for <strong>{comingSoonSubject.name} ({selectedClass} Class)</strong> under the Single National Curriculum (SNC). It will be available very soon!
                </p>
              </div>

              {/* Urdu Section */}
              <div className="space-y-1.5 bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl text-right" dir="rtl">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-lg font-black font-urdu text-amber-950">
                    ڈیٹا انٹری پر کام جاری ہے!
                  </h4>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-200/80 text-amber-900">
                    عنقریب دستیاب
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-urdu text-amber-900 leading-relaxed">
                  اس مضمون (<strong>{comingSoonSubject.name}</strong>) کے تمام اسباق کے مصدقہ سوالات (معروضی، مختصر اور تفصیلی سوالات مع حل) کی ڈیٹا انٹری پر کام جاری ہے۔ آپ بہت جلد اس مضمون کا مکمل کوئسچن پول حاصل کر سکیں گے اور باآسانی امتحانی پرچہ جات تیار کر سکیں گے۔
                </p>
              </div>

              {/* Verified Feature Points */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>SNC 2024–2025 Aligned</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-200/70">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified Question Pool</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setComingSoonSubject(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close / بند کریں
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
