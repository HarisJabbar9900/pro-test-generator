import React from 'react';
import { Building2, Plus, Trash2, Table, ArrowUpFromLine, Type } from 'lucide-react';

export default function HeaderConfigPanel({
  config,
  setConfig,
  paperConfig: propPaperConfig,
  setPaperConfig: propSetPaperConfig
}) {
  const paperConfig = config || propPaperConfig || {};
  const setPaperConfig = setConfig || propSetPaperConfig || (() => {});

  const updateConfig = (key, value) => {
    setPaperConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleAddInstruction = () => {
    setPaperConfig(prev => ({
      ...prev,
      instructions: [...prev.instructions, "New general instruction for students."]
    }));
  };

  const handleUpdateInstruction = (index, value) => {
    setPaperConfig(prev => {
      const updated = [...prev.instructions];
      updated[index] = value;
      return { ...prev, instructions: updated };
    });
  };

  const handleRemoveInstruction = (index) => {
    setPaperConfig(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col gap-4 text-slate-800">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-sm">Paper Header & Typography Setup</h2>
          <p className="text-xs text-slate-500">Academy Name, Letterhead Margin, Font Options & Display Toggles</p>
        </div>
      </div>

      {/* Typography Setup */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-600" />
            English Paper Typography Font
          </label>
          <span className="text-[10px] text-emerald-700 font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
            Urdu Font: Jameel Noori Nastaleeq Active
          </span>
        </div>
        <select
          value={paperConfig.englishFont || 'Inter'}
          onChange={(e) => updateConfig('englishFont', e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
        >
          <option value="Inter">Inter (Clean Modern Sans)</option>
          <option value="Times New Roman">Times New Roman (Classic Board Exam)</option>
          <option value="Georgia">Georgia (Scholar Serif)</option>
          <option value="Roboto">Roboto (Standard Academic)</option>
          <option value="Outfit">Outfit (Contemporary)</option>
          <option value="Courier New">Courier New (Monospace / Tech)</option>
        </select>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Academy / School / Institution Name</label>
          <input
            type="text"
            value={paperConfig.academyName}
            onChange={(e) => updateConfig('academyName', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Academy Tagline / Subtitle</label>
          <input
            type="text"
            value={paperConfig.tagline}
            onChange={(e) => updateConfig('tagline', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Exam / Test Paper Title</label>
          <input
            type="text"
            value={paperConfig.examTitle}
            onChange={(e) => updateConfig('examTitle', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-indigo-700 font-bold focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Subject Name</label>
          <input
            type="text"
            value={paperConfig.subject}
            onChange={(e) => updateConfig('subject', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Class / Grade Level</label>
          <select
            value={
              paperConfig.gradeClass?.startsWith('11th') ? '11th Class' :
              paperConfig.gradeClass?.startsWith('12th') ? '12th Class' :
              paperConfig.gradeClass?.startsWith('10th') ? '10th Class' :
              paperConfig.gradeClass?.startsWith('9th') ? '9th Class' :
              paperConfig.gradeClass?.startsWith('8th') ? '8th Class' :
              paperConfig.gradeClass?.startsWith('5th') ? '5th Class' :
              (paperConfig.gradeClass || '11th Class')
            }
            onChange={(e) => updateConfig('gradeClass', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer focus:bg-white"
          >
            <option value="9th Class">9th Class (Matric Part-I)</option>
            <option value="10th Class">10th Class (Matric Part-II)</option>
            <option value="11th Class">11th Class (F.Sc / ICS / FA Part-I)</option>
            <option value="12th Class">12th Class (F.Sc / ICS / FA Part-II)</option>
            <option value="8th Class">8th Class (Middle Board)</option>
            <option value="5th Class">5th Class (Primary Board)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Time Allowed & Date</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={paperConfig.timeAllowed}
              onChange={(e) => updateConfig('timeAllowed', e.target.value)}
              placeholder="e.g. 60 Mins"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
            <input
              type="date"
              value={paperConfig.date}
              onChange={(e) => updateConfig('date', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1">Paper Language</label>
          <select
            value={paperConfig.language || 'English'}
            onChange={(e) => updateConfig('language', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer focus:bg-white"
          >
            <option value="English">English (Standard Single Language)</option>
            <option value="Urdu">Urdu (اردو میڈیم)</option>
            <option value="English + Urdu Blend (Bilingual)">English + Urdu Blend (Bilingual Dual Column)</option>
          </select>
        </div>

      </div>

      {/* Visibility Toggles */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col gap-2.5">
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <Table className="w-4 h-4 text-indigo-600" /> Paper Layout & Visibility Toggles
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          
          {/* Hide / Show Instructions */}
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
            <input
              type="checkbox"
              checked={paperConfig.showInstructions}
              onChange={(e) => updateConfig('showInstructions', e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-0"
            />
            <span>Show General Instructions block</span>
          </label>

          {/* Hide / Show Individual MCQ Marks */}
          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
            <input
              type="checkbox"
              checked={paperConfig.showMcqIndividualMarks}
              onChange={(e) => updateConfig('showMcqIndividualMarks', e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-0"
            />
            <span>Show per-MCQ "(1 Mark)" tag</span>
          </label>

        </div>
      </div>

      {/* General Instructions Section (If enabled) */}
      {paperConfig.showInstructions && (
        <div className="border-t border-slate-200 pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">General Instructions Bullet Points</span>
            <button
              onClick={handleAddInstruction}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-indigo-700 rounded-lg text-xs font-medium border border-slate-200 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Rule
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {paperConfig.instructions.map((inst, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold w-4 text-right">{index + 1}.</span>
                <input
                  type="text"
                  value={inst}
                  onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
                <button
                  onClick={() => handleRemoveInstruction(index)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
