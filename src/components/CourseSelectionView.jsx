import React from 'react';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, BookOpen, CheckCircle2, 
  Sparkles, Award, FileCheck, Layers
} from 'lucide-react';

export default function CourseSelectionView({ 
  onSelectCourse, 
  onBackToDashboard,
  hasActiveDraft = false,
  onResumeDraft
}) {
  const pectaaCourse = {
    id: 'PECTAA',
    title: 'PECTAA',
    subtitle: 'Punjab Educational Curriculum & Textbook Assessment Authority',
    tagline: 'Transformation, Innovation and Excellence',
    features: [
      'Standard National Curriculum (SNC) Aligned',
      'Class 9, 10, 11 & 12 Complete Question Banks',
      'Includes MCQs, Short & Long Conceptual Questions',
      'Dual-Medium Support (Urdu & English)'
    ]
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="p-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 text-slate-600 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Step 1: Choose Curriculum
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Select Course
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-0.5">
              Select an authorized educational board or publisher to generate test papers.
            </p>
          </div>
        </div>
        
        <div className="text-xs font-semibold text-slate-500 self-start sm:self-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
          <span className="text-slate-500">Dashboard</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-800 font-bold">Courses</span>
        </div>
      </div>

      {/* ACTIVE DRAFT BANNER IF AVAILABLE */}
      {hasActiveDraft && onResumeDraft && (
        <div className="max-w-md mx-auto p-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl shadow-md flex items-center justify-between gap-3 animate-fadeIn border border-blue-400/30">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📝</span>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">Active Draft Available</p>
              <p className="text-xs font-bold">Resume your previous generated paper</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onResumeDraft}
            className="px-3.5 py-1.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-black rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Resume Paper →
          </button>
        </div>
      )}

      {/* PECTAA COURSE CARD - COMPACT & CENTERED */}
      <div className="max-w-md mx-auto pt-2">
        {/* PECTAA (ACTIVE AUTHORIZED) */}
        <div 
          onClick={() => onSelectCourse(pectaaCourse.id)}
          className="group relative cursor-pointer select-none rounded-2xl bg-white border-2 border-emerald-500 hover:border-emerald-600 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden flex flex-col justify-between"
        >
          {/* Top Decorative Gradient Ribbon */}
          <div className="h-2 w-full bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600"></div>

          <div className="p-5 sm:p-6 flex flex-col h-full justify-between">
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-1.5 mb-3">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Authorized Publisher
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-900 text-white shadow-2xs">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  ACTIVE
                </span>
              </div>

              {/* Insignia / Emblem */}
              <div className="flex justify-center my-3">
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border-2 border-emerald-200 shadow-xs flex items-center justify-center group-hover:scale-105 group-hover:border-emerald-400 transition-all p-2">
                    <svg className="w-14 h-12 text-emerald-800" viewBox="0 0 100 80" fill="currentColor">
                      <path d="M50 15 L45 35 L30 32 L50 48 L70 32 L55 35 Z" opacity="0.85" />
                      <path d="M50 8 L38 20 L20 22 L10 32 L26 34 L12 45 L30 44 L50 62 L70 44 L88 45 L74 34 L90 32 L80 22 L62 20 Z" />
                      <polygon points="50,45 42,68 50,75 58,68" fill="#064e3b" />
                      <circle cx="50" cy="14" r="5" fill="#064e3b" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-600 text-white p-1.5 rounded-lg shadow border-2 border-white">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Title & Tagline */}
              <div className="text-center mt-2">
                <h2 className="text-2xl font-black text-slate-900 tracking-wide group-hover:text-emerald-700 transition-colors">
                  PECTAA
                </h2>
                <p className="text-xs font-bold text-emerald-700 mt-0.5 uppercase tracking-wider">
                  Transformation, Innovation & Excellence
                </p>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Punjab Educational Curriculum & Textbook Assessment Authority
                </p>
              </div>

              {/* Mini Features List */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Standard National Curriculum (SNC) Aligned</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Class 9, 10, 11 & 12 Complete Question Banks</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Includes MCQs, Short & Long Conceptual Questions</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dual-Medium Support (Urdu & English)</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-5 pt-2">
              <button 
                type="button"
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 group-hover:shadow-emerald-600/30 transition-all"
              >
                <span>Select PECTAA & Proceed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
