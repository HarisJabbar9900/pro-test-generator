import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, Database, CheckCircle2, Cpu } from 'lucide-react';

export default function AppLoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(12);
  const [stepText, setStepText] = useState('Initializing Pro Test Maker Engine...');
  const [stepUrdu, setStepUrdu] = useState('امتحانی انجن اور سیکیورٹی سسٹم لوڈ ہو رہا ہے...');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Stage 1
    const t1 = setTimeout(() => {
      setProgress(42);
      setStepText('Loading Verified Question Bank & Board Syllabi...');
      setStepUrdu('تمام چیپٹرز، ایم سی کیوز اور امتحانی پیٹرن لوڈ ہو رہے ہیں...');
    }, 280);

    // Stage 2
    const t2 = setTimeout(() => {
      setProgress(78);
      setStepText('Syncing Examination Cloud & Faculty Portal...');
      setStepUrdu('کلاؤڈ سیکیورٹی اور امتحانی ڈیٹا کی تصدیق جاری ہے...');
    }, 620);

    // Stage 3
    const t3 = setTimeout(() => {
      setProgress(100);
      setStepText('System Ready! Launching Pro Test Maker...');
      setStepUrdu('سسٹم مکمل تیار ہے! خوش آمدید...');
    }, 980);

    // Stage 4: Fade Out
    const t4 = setTimeout(() => {
      setFadeOut(true);
    }, 1250);

    // Stage 5: Complete Callback
    const t5 = setTimeout(() => {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#0a1124] text-white select-none transition-opacity duration-500 ease-out overflow-hidden ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* AMBIENT GLOW & PARTICLES */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* CENTER LUXURY BRAND CARD */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-4 p-6 sm:p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-slate-700/60 shadow-2xl shadow-blue-950/50 text-center flex flex-col items-center animate-scaleUp">
        
        {/* ANIMATED 3D LOGO EMBLEM */}
        <div className="relative mb-5 group">
          {/* Spinning Conic Glow Ring */}
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 opacity-75 blur-md animate-spin duration-3000"></div>
          
          {/* Solid Logo Container */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-xl flex items-center justify-center border border-white/20">
            <div className="w-full h-full rounded-[14px] bg-[#0c1427] flex flex-col items-center justify-center text-white">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-blue-300">
                PTM
              </span>
              <span className="text-[8px] font-black tracking-widest text-cyan-400 uppercase -mt-0.5">
                PRO
              </span>
            </div>
          </div>

          {/* Active Security Pulse Indicator */}
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-[#0c1427]"></span>
          </span>
        </div>

        {/* BRAND TITLE & EDITION */}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span>PRO TEST MAKER</span>
        </h1>
        <p className="text-[11px] font-bold text-cyan-400 tracking-wider uppercase mt-0.5">
          Examination & Assessment Engine • 2026
        </p>

        {/* URDU BRAND SUBTEXT */}
        <p className="text-xs font-medium text-slate-300 mt-1 font-sans">
          پنجاب اور تمام تعلیمی بورڈز کا جدید ترین پیپر جنریٹر
        </p>

        {/* PROGRESS BAR CONTAINER */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-slate-300 font-sans font-semibold">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Booting Engine</span>
            </span>
            <span className="font-black text-cyan-400 font-mono text-xs">{progress}%</span>
          </div>

          {/* Glowing Track */}
          <div className="w-full h-2 rounded-full bg-slate-800/90 border border-slate-700/80 overflow-hidden p-0.5 shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 shadow-md shadow-cyan-500/50 transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light beam */}
              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* DYNAMIC PROGRESS MESSAGES (ENGLISH & URDU) */}
        <div className="mt-4 min-h-[44px] flex flex-col items-center justify-center">
          <p className="text-xs font-bold text-slate-200 transition-all duration-300 animate-fadeIn">
            {stepText}
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5 transition-all duration-300 animate-fadeIn">
            {stepUrdu}
          </p>
        </div>

        {/* FOOTER BADGES */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 w-full flex items-center justify-between text-[10px] text-slate-400 font-bold">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>End-to-End Encrypted</span>
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>AI Powered</span>
          </span>
        </div>

      </div>
    </div>
  );
}
