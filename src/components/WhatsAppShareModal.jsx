import React, { useState, useMemo } from 'react';
import { X, MessageCircle, Copy, Check, ExternalLink, Share2, FileText, CheckCircle2, Send } from 'lucide-react';
import { notify } from '../utils/notify';

export default function WhatsAppShareModal({
  isOpen,
  onClose,
  paperConfig = {},
  paperData = { mcqs: [], shortQuestions: [], longQuestions: [] },
  activeSet = 'A',
  isMultiSet = false
}) {
  const [copied, setCopied] = useState(false);
  const [includeAnswerKey, setIncludeAnswerKey] = useState(false);
  const [targetPhone, setTargetPhone] = useState('');

  const mcqsCount = paperData.mcqs?.length || 0;
  const shortCount = paperData.shortQuestions?.length || 0;
  const longCount = paperData.longQuestions?.length || 0;

  // Compute total marks
  const totalMarks = useMemo(() => {
    let sum = 0;
    (paperData.mcqs || []).forEach(q => sum += (Number(q.marks) || 1));
    (paperData.shortQuestions || []).forEach(q => sum += (Number(q.marks) || 2));
    (paperData.longQuestions || []).forEach(q => sum += (Number(q.marks) || 4));
    return sum || paperConfig.totalMarks || 50;
  }, [paperData, paperConfig]);

  // Construct formatted WhatsApp message
  const shareMessage = useMemo(() => {
    const instName = paperConfig.instituteName || 'AL-ZIA SCIENCE ACADEMY';
    const examTitle = paperConfig.examTitle || 'EXAMINATION / TEST SESSION';
    const subject = paperConfig.subject || 'Computer Science';
    const gradeClass = paperConfig.gradeClass || 'Class 10';
    const timeAllowed = paperConfig.timeAllowed || '60 Minutes';
    const dateStr = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

    let text = `📄 *${instName.toUpperCase()}*\n`;
    text += `🎯 *${examTitle.toUpperCase()}* (${dateStr})\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📚 *Subject:* ${subject}\n`;
    text += `🎓 *Class / Grade:* ${gradeClass}\n`;
    text += `⏱️ *Time Allowed:* ${timeAllowed}\n`;
    text += `💯 *Total Marks:* ${totalMarks} Marks\n`;
    
    if (isMultiSet) {
      text += `🔒 *Exam Paper Code:* Set ${activeSet} (Cheating Protected Version)\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📋 *Paper Structure & Syllabus:*\n`;
    text += `• Multiple Choice Questions (MCQs): ${mcqsCount}\n`;
    text += `• Short Questions (مختصر سوالات): ${shortCount}\n`;
    text += `• Long / Detailed Questions (تفصیلی سوالات): ${longCount}\n`;

    if (paperConfig.syllabusOrChapters) {
      text += `\n📖 *Syllabus Included:*\n${paperConfig.syllabusOrChapters}\n`;
    }

    if (includeAnswerKey && mcqsCount > 0) {
      text += `\n🔑 *MCQs Answer Key (Set ${activeSet}):*\n`;
      const letters = ['A', 'B', 'C', 'D'];
      const keyItems = (paperData.mcqs || []).map((q, idx) => {
        let l = 'A';
        if (typeof q.correctIndex === 'number' && q.correctIndex >= 0) {
          l = letters[q.correctIndex] || 'A';
        } else if (q.answer) {
          l = q.answer.toString().toUpperCase().trim();
        }
        return `Q${idx + 1}:${l}`;
      });
      text += keyItems.join(' | ') + '\n';
    }

    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `_Generated with PTM Examination & Paper Generation System_\n`;
    text += `_Powered by Central Examination Board Portal_`;

    return text;
  }, [paperConfig, paperData, activeSet, isMultiSet, mcqsCount, shortCount, longCount, totalMarks, includeAnswerKey]);

  if (!isOpen) return null;

  // Handle direct WhatsApp opening
  const handleOpenWhatsApp = () => {
    const encoded = encodeURIComponent(shareMessage);
    let url = `https://api.whatsapp.com/send?text=${encoded}`;
    
    // If specific phone number is entered (e.g. 923001234567)
    if (targetPhone.trim()) {
      const cleanPhone = targetPhone.replace(/[^0-9]/g, '');
      if (cleanPhone) {
        url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
      }
    }

    window.open(url, '_blank');
    notify.success("WhatsApp opening with paper details!");
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    notify.success("WhatsApp message copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with WhatsApp Brand Colors */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/20 flex items-center justify-center text-white shadow-inner">
              <MessageCircle className="w-6 h-6 fill-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">1-Click WhatsApp Share</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 border border-white/30">
                  Direct Share
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">
                Share complete paper summary & syllabus directly via WhatsApp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={e => setIncludeAnswerKey(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span>Include MCQs Answer Key in Message (جوابی کلید شامل کریں)</span>
            </label>

            {isMultiSet && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-black text-[11px]">
                Active: Set {activeSet}
              </span>
            )}
          </div>

          {/* Optional Direct Number Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Specific WhatsApp Number (Optional - مخصوص نمبر پر بھیجیں):
            </label>
            <div className="relative">
              <input
                type="text"
                value={targetPhone}
                onChange={e => setTargetPhone(e.target.value)}
                placeholder="e.g. 923001234567 (Leave blank to choose contact in WhatsApp)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Live Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                WhatsApp Message Preview (پیغام کا پیش منظر):
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Ready to Send
              </span>
            </div>
            
            <div className="p-4 rounded-2xl bg-[#EFEAE2] border border-[#dad2c7] text-slate-800 font-sans text-xs whitespace-pre-wrap leading-relaxed shadow-inner max-h-60 overflow-y-auto">
              <div className="bg-white p-3.5 rounded-xl shadow-xs border border-emerald-100">
                {shareMessage}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-black">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Message Text</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Open in WhatsApp (واٹس ایپ پر شیئر کریں)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
