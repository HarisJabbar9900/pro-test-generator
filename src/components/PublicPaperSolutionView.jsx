import React, { useState, useEffect } from 'react';
import { 
  Download, Printer, Share2, Check, ArrowLeft, BookOpen, 
  FileText, Award, Clock, Sparkles, CheckCircle2, HelpCircle
} from 'lucide-react';
import { fetchPaperSolution } from '../utils/qrCodeService';
import { notify } from '../utils/notify';

export default function PublicPaperSolutionView({ paperId, onGoHome }) {
  const [loading, setLoading] = useState(true);
  const [paper, setPaper] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mcqs' | 'shorts' | 'longs'

  useEffect(() => {
    async function loadPaper() {
      if (!paperId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchPaperSolution(paperId);
        setPaper(data);
      } catch (err) {
        console.error("Error loading paper solution:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPaper();
  }, [paperId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    notify.success("لنک کاپی ہو گیا ہے (Share Link Copied)");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-md w-full space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">حل شدہ پیپر لوڈ ہو رہا ہے...</h2>
          <p className="text-xs text-slate-500 font-medium">Loading Official Answer Key & Solved Paper...</p>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 text-center max-w-md w-full space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-900">پیپر نہیں ملا (Paper Not Found)</h2>
          <p className="text-xs text-slate-500">
            معذرت، اس QR Code سے منسلک پیپر ابھی کلاؤڈ پر دستیاب نہیں ہے یا اس کا لنک تبدیل ہو چکا ہے۔
          </p>
          <button
            type="button"
            onClick={onGoHome || (() => window.location.href = '/')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ہوم پیج پر جائیں (Go Home)</span>
          </button>
        </div>
      </div>
    );
  }

  const { config = {}, mcqs = [], shortQuestions = [], longQuestions = [] } = paper;

  const getMcqLetter = (q) => {
    if (typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < 4) {
      return ['A', 'B', 'C', 'D'][q.correctIndex];
    }
    const a = (q.answer || '').toString().trim().toUpperCase().replace(/[\(\)\[\]\.\:\s]/g, '');
    if (a === 'A' || a === '1' || a === 'الف') return 'A';
    if (a === 'B' || a === '2' || a === 'ب') return 'B';
    if (a === 'C' || a === '3' || a === 'ج') return 'C';
    if (a === 'D' || a === '4' || a === 'د') return 'D';
    return 'A';
  };

  const getMcqCorrectIndex = (q) => {
    if (typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < (q.options?.length || 4)) {
      return q.correctIndex;
    }
    const letter = getMcqLetter(q);
    return { 'A': 0, 'B': 1, 'C': 2, 'D': 3 }[letter] ?? 0;
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-16">
      
      {/* TOP FIXED APP HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs px-3 sm:px-6 py-3 no-print">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
              ✓
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                Official Answer Key & Solved Paper
              </span>
              <span className="text-[10px] sm:text-[11px] text-blue-600 font-bold">
                تصدیق شدہ امتحانی جوابات و حل شدہ پرچہ
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Share Link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 sm:px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT CANVAS */}
      <main className="max-w-4xl mx-auto px-3 sm:px-6 pt-5 sm:pt-7 space-y-5">

        {/* PAPER HEADER CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"></div>

          <div className="space-y-1">
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              {config.instituteName || config.academyName || 'AL-ZIA SCIENCE ACADEMY'}
            </h1>
            <h2 className="text-xs sm:text-sm font-black text-blue-700 uppercase tracking-wider">
              {config.examTitle || 'EXAMINATION TEST PAPER'}
            </h2>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-xs font-bold text-slate-700">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">مضمون (Subject)</span>
              <span className="text-blue-900 font-black">{config.subject || 'Computer Science'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">جماعت (Class)</span>
              <span className="text-blue-900 font-black">{config.gradeClass || '9th Class'}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">کل نمبر (Total Marks)</span>
              <span className="text-blue-900 font-black font-mono">{config.totalMarks || 50} Marks</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 block font-semibold">وقت (Time Allowed)</span>
              <span className="text-blue-900 font-black">{config.timeAllowed || '60 Mins'}</span>
            </div>
          </div>

          {config.syllabus && (
            <div className="p-2 rounded-xl bg-blue-50/60 border border-blue-100 text-xs font-bold text-blue-950 flex items-center justify-center gap-1.5">
              <span>نصاب (Syllabus):</span>
              <span className="font-semibold text-blue-800">{config.syllabus}</span>
            </div>
          )}
        </div>

        {/* FILTER TABS (NO-PRINT) */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 shadow-2xs no-print overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'all' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            تمام حل شدہ سوالات (All Questions)
          </button>
          {mcqs.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('mcqs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'mcqs' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              معروضی جوابات ({mcqs.length} MCQs Key)
            </button>
          )}
          {shortQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('shorts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'shorts' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              مختصر سوالات ({shortQuestions.length} Shorts)
            </button>
          )}
          {longQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('longs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'longs' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              تفصیلی سوالات ({longQuestions.length} Longs)
            </button>
          )}
        </div>

        {/* SECTION 1: MCQs ANSWER KEY & REVIEW */}
        {mcqs.length > 0 && (activeTab === 'all' || activeTab === 'mcqs') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  حصہ اول: معروضی سوالات کے جوابات (Part I: Objective MCQs Key)
                </h3>
              </div>
              <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
                {mcqs.length} MCQs
              </span>
            </div>

            {/* QUICK ANSWER KEY MATRIX */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <span className="text-xs font-black text-slate-700 block">
                فوری جوابات کی گرڈ (Quick Answer Grid):
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 text-center font-mono">
                {mcqs.map((q, idx) => {
                  const letter = getMcqLetter(q);
                  return (
                    <div key={idx} className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] text-slate-400 block font-sans font-bold">Q{idx + 1}</span>
                      <span className="text-sm font-black text-emerald-700">({letter})</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DETAILED MCQs LIST WITH CORRECT ANSWERS */}
            <div className="space-y-3 pt-2">
              {mcqs.map((q, idx) => {
                const cIdx = getMcqCorrectIndex(q);
                return (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">{q.question}</p>
                        {q.questionUrdu && (
                          <p className="text-xs sm:text-sm font-urdu font-semibold text-slate-800 text-right mt-1" dir="rtl">
                            {q.questionUrdu}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Options Grid */}
                    {Array.isArray(q.options) && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-8 pt-1 text-xs">
                        {q.options.map((opt, optIdx) => {
                          const isCorrect = optIdx === cIdx;
                          const letter = ['(A)', '(B)', '(C)', '(D)'][optIdx];
                          return (
                            <div 
                              key={optIdx} 
                              className={`p-2 rounded-lg border flex items-center justify-between gap-2 font-medium ${
                                isCorrect 
                                  ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold' 
                                  : 'bg-white border-slate-200 text-slate-700'
                              }`}
                            >
                              <span><strong className="font-mono mr-1">{letter}</strong> {opt}</span>
                              {isCorrect && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white shrink-0">
                                  درست جواب ✓
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION 2: SHORT QUESTIONS WITH MODEL ANSWERS */}
        {shortQuestions.length > 0 && (activeTab === 'all' || activeTab === 'shorts') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  حصہ دوم: مختصر سوالات اور ماڈل جوابات (Part II: Short Questions & Solutions)
                </h3>
              </div>
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                {shortQuestions.length} Questions
              </span>
            </div>

            <div className="space-y-3.5">
              {shortQuestions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-bold text-xs shrink-0">
                      Q.{idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{q.question}</p>
                      {q.questionUrdu && (
                        <p className="text-xs sm:text-sm font-urdu font-semibold text-slate-800 text-right mt-1" dir="rtl">
                          {q.questionUrdu}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Model Answer Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-emerald-700 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>ماڈل جواب (Model Answer / Solution):</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap pl-5">
                      {q.answer || q.answerUrdu || q.solution || "اس سوال کا تفصیلی جواب کتاب کے متعلقہ ٹاپک اور امتحانی پیٹرن کے مطابق حل کریں۔"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: LONG QUESTIONS WITH DETAILED SOLUTIONS */}
        {longQuestions.length > 0 && (activeTab === 'all' || activeTab === 'longs') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  حصہ سوم: تفصیلی سوالات اور حل (Part III: Long Questions & Comprehensive Answers)
                </h3>
              </div>
              <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {longQuestions.length} Questions
              </span>
            </div>

            <div className="space-y-4">
              {longQuestions.map((q, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-start gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-bold text-xs shrink-0">
                      Long Q.{idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-black text-slate-900">{q.question}</p>
                      {q.questionUrdu && (
                        <p className="text-xs sm:text-sm font-urdu font-bold text-slate-800 text-right mt-1" dir="rtl">
                          {q.questionUrdu}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Long Answer Box */}
                  <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-purple-800 uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>جامع حل و مارکنگ گائیڈ (Comprehensive Solution):</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap pl-5">
                      {q.answer || q.answerUrdu || q.solution || "امتحانی معیار کے مطابق مکمل تعریف، اہم نکات، ڈایاگرام اور مثالیں شامل کریں۔"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM BRAND FOOTER */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 text-center text-xs text-slate-500 font-medium space-y-1">
          <p>© {new Date().getFullYear()} {config.instituteName || config.academyName || 'AL-ZIA SCIENCE ACADEMY'} • All Rights Reserved</p>
          <p className="text-[11px] text-slate-400">Powered by Pro Test Maker Automated Examination System</p>
        </div>

      </main>

    </div>
  );
}
