import React, { useState } from 'react';
import { ShieldCheck, X, Save, AlertCircle, Plus, Trash2, Key, Sliders, FileText } from 'lucide-react';
import { saveBotConfig } from '../utils/aiBotService';
import { notify } from '../utils/notify';

export default function AdminBotRulesModal({
  isOpen,
  onClose,
  currentConfig,
  currentUser,
  onConfigSaved
}) {
  const [config, setConfig] = useState(() => ({
    botName: currentConfig?.botName || 'Pro Test Maker Assistant',
    welcomeMessage: currentConfig?.welcomeMessage || '',
    welcomeMessageUrdu: currentConfig?.welcomeMessageUrdu || '',
    systemPrompt: currentConfig?.systemPrompt || '',
    forbiddenKeywords: currentConfig?.forbiddenKeywords || [],
    faqs: currentConfig?.faqs || []
  }));

  const [newForbiddenKeyword, setNewForbiddenKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('prompt'); // 'prompt' | 'forbidden' | 'faqs'
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddForbidden = (e) => {
    e.preventDefault();
    if (!newForbiddenKeyword.trim()) return;
    const clean = newForbiddenKeyword.trim().toLowerCase();
    if (!config.forbiddenKeywords.includes(clean)) {
      setConfig(prev => ({
        ...prev,
        forbiddenKeywords: [...prev.forbiddenKeywords, clean]
      }));
    }
    setNewForbiddenKeyword('');
  };

  const handleRemoveForbidden = (kw) => {
    setConfig(prev => ({
      ...prev,
      forbiddenKeywords: prev.forbiddenKeywords.filter(k => k !== kw)
    }));
  };

  const handleAddFaq = () => {
    setConfig(prev => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { keywords: ['new keyword'], answer: 'Custom answer explanation for the user.' }
      ]
    }));
  };

  const handleRemoveFaq = (idx) => {
    setConfig(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdateFaq = (idx, field, value) => {
    setConfig(prev => {
      const updated = [...prev.faqs];
      if (field === 'keywords') {
        updated[idx] = {
          ...updated[idx],
          keywords: value.split(',').map(s => s.trim()).filter(Boolean)
        };
      } else {
        updated[idx] = { ...updated[idx], [field]: value };
      }
      return { ...prev, faqs: updated };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await saveBotConfig(config, currentUser);
      notify.success("AI Assistant Rules & Guardrails successfully saved to cloud!");
      if (onConfigSaved) onConfigSaved(saved);
      onClose();
    } catch (err) {
      notify.error(err.message || "Failed to save bot rules.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm no-print animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 relative text-slate-900 max-h-[90vh] flex flex-col justify-between">
        
        {/* HEADER */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-slate-900">AI Assistant Rules & Behavior Control</h3>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black">ADMIN ONLY</span>
              </div>
              <p className="text-xs text-slate-500">Configure what the assistant can say, forbid sensitive keywords, and update FAQ knowledge.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-2 border-b border-slate-100 py-2.5 my-2">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'prompt' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Prompt & Personality</span>
          </button>
          <button
            onClick={() => setActiveTab('forbidden')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'forbidden' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Forbidden Keywords ({config.forbiddenKeywords.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'faqs' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Platform FAQs ({config.faqs.length})</span>
          </button>
        </div>

        {/* BODY CONTENT */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bot Name</label>
                <input
                  type="text"
                  value={config.botName}
                  onChange={(e) => setConfig({ ...config, botName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Welcome Message (English)</label>
                <input
                  type="text"
                  value={config.welcomeMessage}
                  onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Welcome Message (Urdu)</label>
                <input
                  type="text"
                  dir="rtl"
                  value={config.welcomeMessageUrdu}
                  onChange={(e) => setConfig({ ...config, welcomeMessageUrdu: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">System Instructions & Behavior Rules</label>
                <textarea
                  rows={6}
                  value={config.systemPrompt}
                  onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 font-mono text-[11px] leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 'forbidden' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 leading-relaxed">
                <span className="font-bold">🔒 Strict Guardrails:</span> If a user prompt contains any of these sensitive keywords or patterns (e.g. asking for passwords, admin pins, keys), the bot will immediately block the request with a confidentiality refusal notice.
              </div>

              <form onSubmit={handleAddForbidden} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter forbidden word or phrase (e.g. server_ip, bank_pin)..."
                  value={newForbiddenKeyword}
                  onChange={(e) => setNewForbiddenKeyword(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2 pt-2">
                {config.forbiddenKeywords.map((kw, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-rose-100 text-slate-800 hover:text-rose-800 rounded-lg border border-slate-200 text-xs font-semibold group transition-all"
                  >
                    <span>{kw}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveForbidden(kw)}
                      className="text-slate-400 group-hover:text-rose-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-700">Custom Platform Knowledge Base</span>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold flex items-center gap-1 hover:bg-emerald-700"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              {config.faqs.map((faq, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-600 p-1 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Trigger Keywords (comma-separated)</label>
                    <input
                      type="text"
                      value={faq.keywords.join(', ')}
                      onChange={(e) => handleUpdateFaq(idx, 'keywords', e.target.value)}
                      className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg border border-slate-300 font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Official Assistant Answer</label>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(idx, 'answer', e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 font-medium text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving to Cloud..." : "Save Bot Rules"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
