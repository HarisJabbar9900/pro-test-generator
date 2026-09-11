import React, { useState } from 'react';
import { ClipboardList, PlusCircle, X, Check } from 'lucide-react';
import { parseFullPastedPaper } from '../utils/aiGenerator';

export default function FullPaperImportModal({
  isOpen,
  onClose,
  onImportParsedPaper
}) {
  const [bulkMcqText, setBulkMcqText] = useState('');
  const [importSuccessCount, setImportSuccessCount] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleImport = (e) => {
    e.preventDefault();
    if (!bulkMcqText || !bulkMcqText.trim()) return;

    const parsedPaper = parseFullPastedPaper(bulkMcqText);
    const totalCount = (parsedPaper.mcqs?.length || 0) + (parsedPaper.shortQuestions?.length || 0) + (parsedPaper.longQuestions?.length || 0);

    if (totalCount > 0 && typeof onImportParsedPaper === 'function') {
      onImportParsedPaper(parsedPaper);
      setImportSuccessCount(totalCount);
      setTimeout(() => {
        setImportSuccessCount(null);
        setBulkMcqText('');
        onClose();
      }, 1200);
    } else {
      setErrorMsg("Could not parse questions. Make sure questions start with 1. and MCQs have options A), B), C), D).");
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md no-print">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative text-white animate-in fade-in zoom-in duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100">Paste & Import Full Paper (MCQs + Short + Long)</h3>
            <p className="text-xs text-slate-400">Paste your questions below — 100% formatted onto board paper instantly!</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleImport} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Paste MCQs, Short Questions, and Long Questions (Supports Section Headers):
            </label>
            <textarea
              rows={10}
              value={bulkMcqText}
              onChange={(e) => { setBulkMcqText(e.target.value); setErrorMsg(''); }}
              placeholder={`MCQs:\n1. Which software manages computer hardware?\nA) Operating System\nB) Compiler\nC) Word Processor\nD) Browser\n\nShort Questions:\n1. Define Operating System.\n2. What is Graphical User Interface (GUI)?\n\nLong Questions:\n1. Explain the primary functions of an Operating System in detail.\na) Memory Management\nb) Process Management`}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed shadow-inner"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-400">
              ⚡ 100% Offline! Automatically sorts into Section A, B, and C!
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl transition-all"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-1.5"
              >
                {importSuccessCount !== null ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Imported {importSuccessCount} Questions!</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Import Full Paper Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}
