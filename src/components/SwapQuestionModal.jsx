import React, { useState } from 'react';
import { RefreshCw, X, Check, Search, Hash, FileText, BookOpen } from 'lucide-react';

export default function SwapQuestionModal({
  isOpen,
  onClose,
  sectionKey, // 'mcqs' | 'shortQuestions' | 'longQuestions'
  questionIndex,
  currentQuestion,
  availableQuestions = [],
  onSelectReplacement
}) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');

  // Filter out the currently active question and filter by search
  const candidates = availableQuestions.filter(q => {
    const isCurrent = (q.id && q.id === currentQuestion?.id) || q.question === currentQuestion?.question;
    if (isCurrent) return false;

    if (searchQuery.trim()) {
      const s = searchQuery.toLowerCase();
      const text = (q.question || '').toLowerCase();
      const opts = (q.options || []).join(' ').toLowerCase();
      return text.includes(s) || opts.includes(s);
    }
    return true;
  });

  const sectionTitle = sectionKey === 'mcqs' 
    ? 'MCQ' 
    : sectionKey === 'shortQuestions' 
    ? 'Short Question' 
    : 'Long Question';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-xs animate-fadeIn text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sawal Badal Dein (Swap {sectionTitle})
              </h3>
              <p className="text-xs text-slate-500">
                Neeche mojood kisi bhi doosre sawal par click karke foran swap karein.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CURRENT QUESTION PREVIEW */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
            Filhal Paper Mein Yeh Sawal Hai (Current):
          </span>
          <p className="text-slate-800 font-medium line-clamp-2">
            {currentQuestion?.question}
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={`Doosra ${sectionTitle} talash karein...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        {/* CANDIDATES LIST */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2.5 custom-scrollbar bg-slate-50/50">
          {candidates.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Is topic mein badalny ke liye koi mazeed sawal dastyab nahi hain.
            </div>
          ) : (
            candidates.map((cand, idx) => (
              <div
                key={cand.id || idx}
                onClick={() => {
                  onSelectReplacement(sectionKey, questionIndex, cand);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-950 leading-snug">
                      {cand.question}
                    </p>

                    {/* MCQ Options if applicable */}
                    {cand.options && cand.options.length > 0 && (
                      <div className="grid grid-cols-2 gap-1.5 mt-2 text-[11px] text-slate-600">
                        {cand.options.map((opt, oIdx) => (
                          <div key={oIdx} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[10px] line-clamp-1">
                            <span className="font-bold text-slate-500 mr-1">{String.fromCharCode(65 + oIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="shrink-0 px-2.5 py-1 bg-indigo-50 group-hover:bg-indigo-600 text-indigo-700 group-hover:text-white rounded-lg text-xs font-bold border border-indigo-200 group-hover:border-indigo-600 transition-all flex items-center gap-1 shadow-2xs"
                  >
                    <span>Use This</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}
