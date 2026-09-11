import React, { useState } from 'react';
import { X, Check, Copy, Printer, Key, BookOpen, Sparkles, Layers, ShieldCheck } from 'lucide-react';
import { buildMultiSetComparisonMatrix } from '../utils/multiSetHelper';

export default function TeacherAnswerKeyModal({
  isOpen,
  onClose,
  paperConfig = {},
  mcqs = [],
  isMultiSet = false,
  multiSets = null,
  activeSet = 'A'
}) {
  const [selectedSetTab, setSelectedSetTab] = useState(activeSet || 'A'); // 'A' | 'B' | 'C' | 'D' | 'matrix'
  const [copied, setCopied] = useState(false);

  // Determine current active MCQs list based on selected set tab
  const currentMcqs = (isMultiSet && multiSets && selectedSetTab !== 'matrix' && multiSets[selectedSetTab])
    ? (multiSets[selectedSetTab].mcqs || [])
    : mcqs;

  const currentSetInfo = (isMultiSet && multiSets && multiSets[selectedSetTab])
    ? multiSets[selectedSetTab]
    : { code: '101', name: 'Set A' };

  const comparisonMatrix = isMultiSet && multiSets ? buildMultiSetComparisonMatrix(multiSets) : [];

  if (!isOpen) return null;

  const engLetters = ["(A)", "(B)", "(C)", "(D)"];
  const urduLetters = ["(الف)", "(ب)", "(ج)", "(د)"];

  const getMcqCorrectIndex = (q) => {
    if (!q) return -1;
    if (typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < (q.options?.length || 4)) {
      return q.correctIndex;
    }
    const raw = (q.answer || q.correctAnswer || q.answerKey || '').toString().trim();
    if (!raw) return -1;

    const cleaned = raw.toUpperCase().replace(/[\(\)\[\]\.\:\s]/g, '');
    if (cleaned === 'A' || cleaned === '1' || cleaned === 'الف') return 0;
    if (cleaned === 'B' || cleaned === '2' || cleaned === 'ب') return 1;
    if (cleaned === 'C' || cleaned === '3' || cleaned === 'ج') return 2;
    if (cleaned === 'D' || cleaned === '4' || cleaned === 'د') return 3;

    if (Array.isArray(q.options)) {
      const idx = q.options.findIndex(opt => {
        const o = (opt || '').toString().toLowerCase().trim();
        const a = raw.toLowerCase().trim();
        return o === a || (a.length > 3 && o.includes(a)) || (o.length > 3 && a.includes(o));
      });
      if (idx !== -1) return idx;
    }

    return -1;
  };

  // Build text version of answer key for clipboard
  const handleCopyText = () => {
    let text = `=== ${paperConfig.examTitle || 'EXAMINATION'} - MCQs ANSWER KEY ===\n`;
    text += `Institute: ${paperConfig.academyName || paperConfig.instituteName || 'AL-ZIA SCIENCE ACADEMY'}\n`;
    text += `Subject: ${paperConfig.subject || 'Computer Science'} | Class: ${paperConfig.gradeClass || ''}\n\n`;

    if (isMultiSet && selectedSetTab === 'matrix' && comparisonMatrix.length > 0) {
      text += `=== 4-SET MASTER COMPARISON MATRIX (SETS A, B, C, D) ===\n`;
      text += `Q# (Set A) | Set A (101) | Set B (102) | Set C (103) | Set D (104)\n`;
      text += `--------------------------------------------------------\n`;
      comparisonMatrix.forEach((row, rIdx) => {
        text += `Q${rIdx + 1} | Ans: ${row.setA.ansLetter} | Q${row.setB.qNum}(${row.setB.ansLetter}) | Q${row.setC.qNum}(${row.setC.ansLetter}) | Q${row.setD.qNum}(${row.setD.ansLetter})\n`;
      });
    } else {
      if (isMultiSet) {
        text += `PAPER SET: ${currentSetInfo.name || selectedSetTab} (PAPER CODE: ${currentSetInfo.code})\n\n`;
      }
      currentMcqs.forEach((q, idx) => {
        const cIdx = getMcqCorrectIndex(q);
        const letter = cIdx >= 0 ? ['A', 'B', 'C', 'D'][cIdx] : 'N/A';
        const optText = cIdx >= 0 && q.options?.[cIdx] ? ` (${q.options[cIdx]})` : '';
        text += `Q${idx + 1}: ${letter}${optText}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Dedicated Print for Answer Key
  const handlePrintKey = () => {
    const printContent = document.getElementById('printable-answer-key');
    if (!printContent) return;

    const printWin = window.open('', '', 'width=800,height=900');
    printWin.document.write(`
      <html>
        <head>
          <title>MCQs Answer Key - ${paperConfig.examTitle || 'Test'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 25px; color: #111; }
            h1 { font-size: 18pt; text-align: center; margin-bottom: 2px; text-transform: uppercase; }
            h2 { font-size: 13pt; text-align: center; color: #047857; margin-top: 0; }
            .meta { text-align: center; font-size: 10pt; color: #555; margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 25px; }
            .box { border: 1.5pt solid #047857; border-radius: 6px; padding: 8px; text-align: center; }
            .box-q { font-size: 9pt; color: #666; font-weight: bold; }
            .box-a { font-size: 14pt; font-weight: 900; color: #047857; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10pt; }
            th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
            th { background-color: #f0fdf4; color: #065f46; }
            .badge { font-weight: bold; color: #047857; }
            .set-badge { display: inline-block; background: #047857; color: #fff; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 9pt; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => {
      printWin.print();
      printWin.close();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800">
        
        {/* MODAL HEADER */}
        <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-black text-slate-900 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="truncate">🔑 MCQs Teacher Answer Key</span>
                <span className="text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold shrink-0">
                  {currentMcqs.length} MCQs
                </span>
                {isMultiSet && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-black flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Multi-Set Mode Active
                  </span>
                )}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium hidden xs:block truncate">
                Teacher solution key for grading and marking.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MULTI-SET TABS BAR */}
        {isMultiSet && multiSets && (
          <div className="bg-slate-100/90 px-3 sm:px-6 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-black text-slate-600 mr-2 shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Select Set:
            </span>
            {['A', 'B', 'C', 'D'].map(setKey => {
              const sInfo = multiSets[setKey];
              if (!sInfo) return null;
              const isSel = selectedSetTab === setKey;
              return (
                <button
                  key={setKey}
                  type="button"
                  onClick={() => setSelectedSetTab(setKey)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                    isSel
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span>{sInfo.name}</span>
                  <span className="ml-1 text-[10px] opacity-80">(Code {sInfo.code})</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedSetTab('matrix')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                selectedSetTab === 'matrix'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <span>🔀 4-Set Master Matrix</span>
            </button>
          </div>
        )}

        {/* MODAL BODY (PRINTABLE CONTAINER) */}
        <div className="p-3 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 flex-1">
          
          <div id="printable-answer-key" className="space-y-5">
            {/* Header info for print */}
            <div className="text-center space-y-1">
              <h1 className="text-xl font-black text-slate-900 uppercase">
                {paperConfig.academyName || paperConfig.instituteName || 'PRO TEST MAKER'}
              </h1>
              <h2 className="text-sm font-bold text-emerald-700 uppercase flex items-center justify-center gap-2">
                <span>{paperConfig.examTitle || 'EXAMINATION'} — MCQs OFFICIAL ANSWER KEY</span>
                {isMultiSet && selectedSetTab !== 'matrix' && (
                  <span className="px-2 py-0.5 bg-emerald-700 text-white text-xs rounded font-black">
                    SET {selectedSetTab} (CODE {currentSetInfo.code})
                  </span>
                )}
              </h2>
              <div className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-4 pt-1">
                <span>Subject: <strong className="text-slate-700">{paperConfig.subject}</strong></span>
                <span>Class: <strong className="text-slate-700">{paperConfig.gradeClass}</strong></span>
                <span>Total MCQs: <strong className="text-slate-700">{currentMcqs.length}</strong></span>
                {isMultiSet && selectedSetTab !== 'matrix' && (
                  <span>Paper Code: <strong className="text-emerald-700 font-mono font-black">{currentSetInfo.code}</strong></span>
                )}
              </div>
            </div>

            {/* IF MASTER MATRIX SELECTED */}
            {isMultiSet && selectedSetTab === 'matrix' ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold flex items-center justify-between">
                  <span>🔀 Master Comparison Table: Track where each question shifted in Sets A, B, C, and D with their respective answer keys.</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-black border-b border-slate-200 text-center">
                        <th className="p-2.5 text-left">Question Statement</th>
                        <th className="p-2.5 bg-emerald-50 text-emerald-900 border-l border-slate-200">Set A (Code 101)</th>
                        <th className="p-2.5 bg-blue-50 text-blue-900 border-l border-slate-200">Set B (Code 102)</th>
                        <th className="p-2.5 bg-purple-50 text-purple-900 border-l border-slate-200">Set C (Code 103)</th>
                        <th className="p-2.5 bg-amber-50 text-amber-900 border-l border-slate-200">Set D (Code 104)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {comparisonMatrix.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 font-medium text-slate-800 max-w-xs truncate">
                            <span className="font-bold text-slate-500 mr-1.5">Q{rIdx + 1}.</span>
                            {row.questionText}
                          </td>
                          <td className="p-2.5 text-center bg-emerald-50/40 font-mono border-l border-slate-200">
                            <span className="font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                              {row.setA.ansLetter}
                            </span>
                          </td>
                          <td className="p-2.5 text-center bg-blue-50/40 font-mono border-l border-slate-200">
                            <span className="text-[11px] text-slate-500 mr-1">Q{row.setB.qNum}:</span>
                            <span className="font-black text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-xs">
                              {row.setB.ansLetter}
                            </span>
                          </td>
                          <td className="p-2.5 text-center bg-purple-50/40 font-mono border-l border-slate-200">
                            <span className="text-[11px] text-slate-500 mr-1">Q{row.setC.qNum}:</span>
                            <span className="font-black text-purple-800 bg-purple-100 px-2 py-0.5 rounded text-xs">
                              {row.setC.ansLetter}
                            </span>
                          </td>
                          <td className="p-2.5 text-center bg-amber-50/40 font-mono border-l border-slate-200">
                            <span className="text-[11px] text-slate-500 mr-1">Q{row.setD.qNum}:</span>
                            <span className="font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-xs">
                              {row.setD.ansLetter}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <>
                {/* Quick Answer Key Badges Grid (Board Style) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider">
                      ⚡ Quick Marking Grid (فوری چیکنگ کلید)
                    </h3>
                    {isMultiSet && (
                      <span className="text-[11px] font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {currentSetInfo.name} — Paper Code: {currentSetInfo.code}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 gap-2 text-center">
                    {currentMcqs.map((q, idx) => {
                      const cIdx = getMcqCorrectIndex(q);
                      const letter = cIdx >= 0 ? ['A', 'B', 'C', 'D'][cIdx] : '?';
                      return (
                        <div
                          key={idx}
                          className={`border rounded-xl p-2 transition-all shadow-2xs ${
                            letter !== '?'
                              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                              : 'bg-amber-50 border-amber-300 text-amber-900'
                          }`}
                        >
                          <div className="text-[10px] text-slate-500 font-bold uppercase">
                            Q{idx + 1}
                          </div>
                          <div className="text-lg font-black mt-0.5">
                            {letter}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Questions & Correct Answers Table */}
                <div>
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                    📋 Detailed Questions & Answers Table
                  </h3>
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <th className="p-2.5 w-12 text-center">#</th>
                          <th className="p-2.5">Question Statement</th>
                          <th className="p-2.5 w-24 text-center">Option</th>
                          <th className="p-2.5">Correct Answer Text</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentMcqs.map((q, idx) => {
                          const cIdx = getMcqCorrectIndex(q);
                          const letter = cIdx >= 0 ? ['A', 'B', 'C', 'D'][cIdx] : 'None';
                          const optText = cIdx >= 0 && q.options?.[cIdx] ? q.options[cIdx] : 'Answer not set';

                          return (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-2.5 text-center font-bold text-slate-500">
                                Q{idx + 1}
                              </td>
                              <td className="p-2.5 font-medium text-slate-800 leading-snug">
                                {q.question}
                              </td>
                              <td className="p-2.5 text-center">
                                <span className={`inline-block px-2.5 py-0.5 rounded-full font-black text-xs ${
                                  letter !== 'None'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-rose-100 text-rose-700 border border-rose-200'
                                }`}>
                                  ({letter})
                                </span>
                              </td>
                              <td className="p-2.5 font-semibold text-emerald-900">
                                {optText}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-3 sm:px-6 py-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Key'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintKey}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Sheet</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs text-center"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
