import React from 'react';
import { FileText, Trash2, Sparkles, ClipboardList } from 'lucide-react';
import { SAMPLE_TEXTS } from '../utils/sampleData';

export default function DocumentInputPanel({
  sourceText,
  setSourceText,
  onLoadSample,
  onLoadSampleText,
  selectedSampleId,
  setSelectedSampleId,
  onOpenImportModal
}) {
  const wordCount = sourceText.trim() ? sourceText.trim().split(/\s+/).length : 0;
  const charCount = sourceText.length;

  const handleSampleClick = (sample) => {
    if (typeof onLoadSample === 'function') {
      onLoadSample(sample);
    } else if (typeof onLoadSampleText === 'function') {
      onLoadSampleText(sample);
    }
    if (typeof setSelectedSampleId === 'function') {
      setSelectedSampleId(sample.id);
    }
  };

  const handleClear = () => {
    setSourceText('');
    if (typeof setSelectedSampleId === 'function') {
      setSelectedSampleId('');
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-100 text-sm">Source Syllabus Text & Test Questions</h2>
            <p className="text-xs text-slate-400">Type topic instructions or paste questions directly into text box</p>
          </div>
        </div>

        {/* Word / Char Counters */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium">
            {wordCount} Words
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
            {charCount} Chars
          </span>
        </div>
      </div>

      {/* Preset Sample Selector & Bulk Paper Importer Button */}
      <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Load Sample:
          </span>
          {SAMPLE_TEXTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleClick(sample)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedSampleId === sample.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {sample.subject}
            </button>
          ))}
        </div>

        {/* Bulk Full Paper Import Modal Button */}
        <button
          onClick={onOpenImportModal}
          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          title="Paste MCQs, Short & Long questions copied from Word, PDF, or Websites and auto-format onto paper"
        >
          <ClipboardList className="w-3.5 h-3.5" />
          <span>Paste & Import Full Paper (MCQs + Short + Long)</span>
        </button>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={9}
          value={sourceText}
          onChange={(e) => {
            setSourceText(e.target.value);
            if (typeof setSelectedSampleId === 'function') {
              setSelectedSampleId('');
            }
          }}
          placeholder="Type topic instructions (e.g. Create test from chapter 1 topic 1.1) or paste your textbook questions here..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y font-mono leading-relaxed shadow-inner"
        />

        {sourceText && (
          <button
            onClick={handleClear}
            title="Clear Text"
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/80 text-slate-400 hover:text-white transition-all border border-slate-700"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}
