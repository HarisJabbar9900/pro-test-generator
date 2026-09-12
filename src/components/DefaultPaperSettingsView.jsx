import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle2, Sliders, Eye, Sparkles, Building2, 
  RotateCcw, Info, ArrowRight, Layout 
} from 'lucide-react';
import { notify } from '../utils/notify';

export const HEADER_LAYOUTS = [
  { id: 'Layout 1', name: 'Layout 1 (Classic Double Border Center)', desc: 'Official center alignment with double solid borders and centered logo' },
  { id: 'Layout 2', name: 'Layout 2 (Modern Split / Side-by-Side)', desc: 'Logo on left, academy title in center, exam metadata on right' },
  { id: 'Layout 3', name: 'Layout 3 (Board / Official Boxed Grid)', desc: 'Solid boxed grid with separated student and exam detail sections' },
  { id: 'Layout 4', name: 'Layout 4 (Minimalist Clean Header)', desc: 'Clean, modern header with subtle underline separator' },
  { id: 'Layout 5', name: 'Layout 5 (Dual Logo Academy Style)', desc: 'Academy logo on left and Examination Board crest on right' },
  { id: 'Layout 6', name: 'Layout 6 (Compact Single-Line Header)', desc: 'Space-saving compact header designed to maximize question area' },
  { id: 'Layout 7', name: 'Layout 7 (Bordered Certificate Style)', desc: 'Ornate corner borders with classic formal examination styling' },
  { id: 'Layout 8', name: 'Layout 8 (Formal Examination Series)', desc: 'Comprehensive board exam header with candidate OMR / roll number box' },
  { id: 'Layout 9', name: 'Layout 9 (Punjab Board Official BISE Style)', desc: 'Standard Pakistani board examination header with candidate grid & crest' },
  { id: 'Layout 10', name: 'Layout 10 (Royal Crown Academy Luxury)', desc: 'Ornate decorative borders, royal crest, and spacious student name bar' },
  { id: 'Layout 11', name: 'Layout 11 (Modern Cambridge Minimalist)', desc: 'Clean, contemporary international school layout with ample writing space' },
  { id: 'Layout 12', name: 'Layout 12 (Dual Boxed Institutional Grid)', desc: 'Side-by-side boxed structure with dedicated Invigilator & Student signature' },
  { id: 'Layout 13', name: 'Layout 13 (Creative Developers Standard)', desc: 'Signature dashed border box with 3-column metadata table' }
];

export default function DefaultPaperSettingsView({
  paperConfig = {},
  setPaperConfig,
  onGoToGenerate,
  onResumeCurrentDraft,
  hasActiveDraft = false
}) {
  const [formData, setFormData] = useState({
    headerLayout: paperConfig.headerLayout === 'Layout 42' ? 'Layout 13' : (paperConfig.headerLayout || 'Layout 13'),
    headerFontStyle: paperConfig.headerFontStyle || 'Default',
    headerFontSize: paperConfig.headerFontSize || 30,
    headingFontSize: paperConfig.headingFontSize || 12,
    textFontSize: paperConfig.textFontSize || 11,
    textFormatting: paperConfig.textFormatting || 'Normal',
    paperFontColor: paperConfig.paperFontColor || 'Black',
    watermarkType: paperConfig.watermarkType || 'Text Watermark',
    academyName: paperConfig.academyName || 'AL-ZIA SCIENCE ACADEMY',
    tagline: paperConfig.tagline || 'One Stop Test Solution',
    syllabus: paperConfig.syllabus || '',
    watermarkText: (paperConfig.watermarkText && paperConfig.watermarkText !== 'PRO TEST MAKER') ? paperConfig.watermarkText : 'AL-ZIA SCIENCE ACADEMY',
    showWatermark: paperConfig.showWatermark !== false,
    mcqLayout: paperConfig.mcqLayout || '1 Column',
    mcqOptionsCols: String(paperConfig.mcqOptionsCols || 2)
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saved'

  // Keep formData in sync when paperConfig is updated
  useEffect(() => {
    if (paperConfig && Object.keys(paperConfig).length > 0) {
      setFormData(prev => ({
        ...prev,
        ...paperConfig,
        headerLayout: paperConfig.headerLayout === 'Layout 42' ? 'Layout 13' : (paperConfig.headerLayout || prev.headerLayout || 'Layout 13'),
        academyName: paperConfig.academyName || prev.academyName || 'AL-ZIA SCIENCE ACADEMY',
        tagline: paperConfig.tagline || prev.tagline || 'One Stop Test Solution',
        syllabus: paperConfig.syllabus || prev.syllabus || ''
      }));
    }
  }, [paperConfig]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'watermarkType' && value === 'Text Watermark') {
        if (!prev.watermarkText || prev.watermarkText === 'PRO TEST MAKER') {
          next.watermarkText = 'AL-ZIA SCIENCE ACADEMY';
        }
      }
      return next;
    });
  };

  // Auto-save any changes without requiring the user to manually click submit
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const updated = {
        ...formData,
        fontSize: Number(formData.textFontSize) || 11,
        mcqLayout: formData.mcqLayout || '1 Column',
        mcqOptionsCols: Number(formData.mcqOptionsCols) || 2
      };

      setPaperConfig(prev => ({
        ...prev,
        ...updated
      }));

      try {
        localStorage.setItem('ptm_default_paper_settings', JSON.stringify(formData));
      } catch (err) {
        console.warn("Could not persist paper settings:", err);
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 350);

    return () => clearTimeout(timer);
  }, [formData, setPaperConfig]);

  const handleSave = (e) => {
    e?.preventDefault();
    
    // 1. Update Global State
    const updated = {
      ...formData,
      fontSize: Number(formData.textFontSize) || 11,
      mcqLayout: formData.mcqLayout || '1 Column',
      mcqOptionsCols: Number(formData.mcqOptionsCols) || 2
    };

    setPaperConfig(prev => ({
      ...prev,
      ...updated
    }));

    // 2. Persist to LocalStorage for future sessions
    try {
      localStorage.setItem('ptm_default_paper_settings', JSON.stringify(formData));
    } catch (err) {
      console.warn("Could not persist paper settings:", err);
    }

    setSavedSuccess(true);
    setSaveStatus('saved');
    notify.success("Paper Settings & Header updated successfully!");

    setTimeout(() => {
      setSavedSuccess(false);
      setSaveStatus('idle');
    }, 3500);
  };

  // Helper to get color code
  const getColorHex = (colorName) => {
    switch (colorName) {
      case 'Dark Navy (#0f172a)': return '#0f172a';
      case 'Deep Blue (#1e3a8a)': return '#1e3a8a';
      case 'Charcoal Gray (#334155)': return '#334155';
      default: return '#000000';
    }
  };

  const fontColorHex = getColorHex(formData.paperFontColor);

  return (
    <div className="p-3 sm:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6 font-sans select-none">
      
      {/* 1. TOP HEADER & BREADCRUMB */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Default Paper Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
            (Here you can set the Paper's text size, line height, layout and much more.)
          </p>
        </div>

        <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 self-start sm:self-center">
          <span className="text-blue-600 hover:underline cursor-pointer" onClick={onGoToGenerate}>Home</span>
          <span>/</span>
          <span className="text-slate-700">Default Paper Settings</span>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION TOAST */}
      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Settings updated successfully! All future and generated papers will follow these configurations.</span>
          </div>
          <button 
            type="button" 
            onClick={() => setSavedSuccess(false)}
            className="text-emerald-700 hover:text-emerald-950 font-black ml-3"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. FORM GRID (EXACT 4-COLUMN RESPONSIVE LAYOUT AS IN SCREENSHOT) */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ROW 1: 4 Dropdowns / Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Paper Header Layout */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Paper Header Layout:
            </label>
            <select
              value={formData.headerLayout}
              onChange={(e) => handleChange('headerLayout', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-2xs"
            >
              {HEADER_LAYOUTS.map(layout => (
                <option key={layout.id} value={layout.id}>
                  {layout.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Header Font Style */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Header Font Style:
            </label>
            <select
              value={formData.headerFontStyle}
              onChange={(e) => handleChange('headerFontStyle', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-2xs"
            >
              <option value="Default">Default</option>
              <option value="Bold Serif">Bold Serif</option>
              <option value="Modern Sans">Modern Sans</option>
              <option value="Formal Italic">Formal Italic</option>
              <option value="All Caps Heavy">All Caps Heavy</option>
            </select>
          </div>

          {/* 3. Header Font Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Header Font Size:
            </label>
            <input
              type="number"
              min="14"
              max="48"
              value={formData.headerFontSize}
              onChange={(e) => handleChange('headerFontSize', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-2xs"
            />
          </div>

          {/* 4. Heading Font Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Heading Font Size:
            </label>
            <input
              type="number"
              min="8"
              max="24"
              value={formData.headingFontSize}
              onChange={(e) => handleChange('headingFontSize', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-2xs"
            />
          </div>

        </div>

        {/* ROW 2: 4 Dropdowns / Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 5. Text Font Size */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Text Font Size:
            </label>
            <input
              type="number"
              min="8"
              max="18"
              value={formData.textFontSize}
              onChange={(e) => handleChange('textFontSize', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-2xs"
            />
          </div>

          {/* 6. Text Formatting */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Text Formatting:
            </label>
            <select
              value={formData.textFormatting}
              onChange={(e) => handleChange('textFormatting', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-2xs"
            >
              <option value="Normal">Normal</option>
              <option value="Bold Questions">Bold Questions</option>
              <option value="Compact Spacing">Compact Spacing</option>
              <option value="High Contrast">High Contrast</option>
            </select>
          </div>

          {/* 7. Paper Font Color */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Paper Font Color:
            </label>
            <select
              value={formData.paperFontColor}
              onChange={(e) => handleChange('paperFontColor', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-2xs"
            >
              <option value="Black">Black</option>
              <option value="Dark Navy (#0f172a)">Dark Navy (#0f172a)</option>
              <option value="Deep Blue (#1e3a8a)">Deep Blue (#1e3a8a)</option>
              <option value="Charcoal Gray (#334155)">Charcoal Gray (#334155)</option>
            </select>
          </div>

          {/* 8. Watermark */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Watermark:
            </label>
            <select
              value={formData.watermarkType}
              onChange={(e) => handleChange('watermarkType', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer shadow-2xs"
            >
              <option value="Text Watermark">Text Watermark (AL-ZIA SCIENCE ACADEMY)</option>
              <option value="Picture Watermark">Picture Watermark</option>
              <option value="Custom Academy Logo">Custom Academy Logo</option>
              <option value="None">None</option>
            </select>

            {formData.watermarkType === 'Text Watermark' && (
              <div className="mt-2 space-y-1">
                <label className="text-[11px] font-bold text-blue-900 flex items-center justify-between">
                  <span>Watermark Text:</span>
                  <span className="text-[10px] text-emerald-700 font-extrabold bg-emerald-100 px-1.5 py-0.2 rounded">AL-ZIA ACTIVE</span>
                </label>
                <input
                  type="text"
                  value={formData.watermarkText}
                  onChange={(e) => handleChange('watermarkText', e.target.value)}
                  placeholder="AL-ZIA SCIENCE ACADEMY"
                  className="w-full px-2.5 py-1.5 bg-blue-50/50 border border-blue-300 focus:border-blue-500 rounded-lg text-xs font-bold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-2xs"
                />
              </div>
            )}
          </div>

        </div>

        {/* ROW 3: MCQs Paper & Print Layout (1 Column vs 2 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200/90 shadow-2xs">
          
          {/* MCQs Section Layout (1 Column vs 2 Columns) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-950 flex items-center justify-between">
              <span>MCQs Paper & Print Layout (کالمز لے آؤٹ):</span>
              <span className="text-[10px] text-blue-700 font-bold bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                {formData.mcqLayout === '2 Columns' ? '2 Columns Active' : 'Standard 1 Column'}
              </span>
            </label>
            <select
              value={formData.mcqLayout}
              onChange={(e) => handleChange('mcqLayout', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-blue-300 hover:border-blue-400 focus:border-blue-600 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer shadow-2xs"
            >
              <option value="1 Column">1 Column (Full Width - سنگل کالم)</option>
              <option value="2 Columns">2 Columns (Double Column Side-by-Side - 2 کالمز پیپر اور پرنٹ)</option>
            </select>
            <p className="text-[11px] text-slate-600 font-medium">
              پیپر اور پرنٹ میں MCQs کو 2 کالمز میں تقسیم کر کے پیپر کی جگہ بچائیں (Save Paper Space).
            </p>
          </div>

          {/* MCQs Choices / Options Columns */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-950 block">
              MCQs Options Format (A, B, C, D آپشنز کا لے آؤٹ):
            </label>
            <select
              value={formData.mcqOptionsCols}
              onChange={(e) => handleChange('mcqOptionsCols', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-blue-300 hover:border-blue-400 focus:border-blue-600 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer shadow-2xs"
            >
              <option value="2">2 Columns (A/B, C/D - موزوں ترین)</option>
              <option value="4">4 Columns (A B C D ایک ہی لائن میں)</option>
              <option value="1">1 Column (اوپر سے نیچے لسٹ)</option>
            </select>
            <p className="text-[11px] text-slate-600 font-medium">
              ہر سوال کے اندر موجود آپشنز (الف، ب، ج، د / A, B, C, D) کے کالمز کی ترتیب۔
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className={`px-6 py-2.5 ${saveStatus === 'saved' ? 'bg-emerald-700' : 'bg-[#28a745] hover:bg-[#218838]'} text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer flex items-center gap-2`}
          >
            {saveStatus === 'saved' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings Saved!</span>
              </>
            ) : (
              <span>Save / Update Settings</span>
            )}
          </button>
          {saveStatus === 'saved' && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" /> Auto-saved in real-time
            </span>
          )}
        </div>

      </form>

      {/* 4. LIVE INTERACTIVE HEADER PREVIEW */}
      <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Live Paper Header Preview: <span className="text-blue-600 font-extrabold">{formData.headerLayout}</span>
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Font: {formData.headerFontSize}pt • Color: {formData.paperFontColor}
          </span>
        </div>

        {/* PREVIEW CONTAINER */}
        <div 
          className="bg-white rounded-xl border border-slate-300 p-2.5 sm:p-6 shadow-xs overflow-x-auto relative"
          style={{ color: fontColorHex }}
        >
          <div className="min-w-[620px]">
            {/* RENDER SELECTED LAYOUT PREVIEW */}
            <PreviewHeaderRenderer
              layoutId={formData.headerLayout}
              academyName={formData.academyName}
              tagline={formData.tagline}
              syllabus={formData.syllabus}
              headerFontSize={formData.headerFontSize}
              headingFontSize={formData.headingFontSize}
              headerFontStyle={formData.headerFontStyle}
              fontColor={fontColorHex}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium px-1 sm:hidden">
          <span>👈 Scroll horizontally to preview full paper header 👉</span>
        </div>
      </div>

      {/* 5. ACADEMY & INSTITUTION TITLE DETAILS */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4 mt-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Building2 className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Academy Name, Tagline & Syllabus Configuration
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Institution / Academy Name</label>
            <input
              type="text"
              value={formData.academyName}
              onChange={(e) => handleChange('academyName', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Tagline / Subtitle</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Default Syllabus / Topics</label>
            <input
              type="text"
              value={formData.syllabus}
              onChange={(e) => handleChange('syllabus', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
          <div className="text-xs">
            {saveStatus === 'saved' && (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Header details saved & applied to current paper!</span>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSave}
              className={`px-4 py-2 ${saveStatus === 'saved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1.5`}
            >
              {saveStatus === 'saved' ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Header Details Saved!</span>
                </>
              ) : (
                <span>Save Header Details</span>
              )}
            </button>

            {hasActiveDraft && typeof onResumeCurrentDraft === 'function' && (
              <button
                type="button"
                onClick={() => {
                  handleSave();
                  onResumeCurrentDraft();
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                title="Save header and immediately return to your active paper"
              >
                <span>Save & Return to Paper</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// LIVE PREVIEW RENDERER SUPPORTING ALL 8+ HEADER LAYOUTS
// -------------------------------------------------------------
function PreviewHeaderRenderer({
  layoutId,
  academyName,
  tagline,
  syllabus,
  headerFontSize,
  headingFontSize,
  headerFontStyle,
  fontColor
}) {
  const getStyleClass = () => {
    switch (headerFontStyle) {
      case 'Bold Serif': return 'font-serif font-black';
      case 'Modern Sans': return 'font-sans font-bold tracking-tight';
      case 'Formal Italic': return 'font-serif italic font-bold';
      case 'All Caps Heavy': return 'font-sans font-black uppercase tracking-widest';
      default: return 'font-sans font-black uppercase tracking-wider';
    }
  };

  const styleClass = getStyleClass();

  // -----------------------------------------------------------
  // LAYOUT 1: Classic Double Border Center
  // -----------------------------------------------------------
  if (layoutId === 'Layout 1') {
    return (
      <div className="border-4 border-double border-current p-3 text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🎓</span>
          <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 30)}px` }}>
            {academyName}
          </h2>
        </div>
        <p className="text-xs italic opacity-80">{tagline}</p>
        
        {/* Candidate Identification Section - Extra Spacious with Ample Vertical Room */}
        <div className="border-t-2 border-b-2 border-current py-3 px-3 my-2 flex items-end justify-between text-xs font-semibold gap-3 sm:gap-4 text-left w-full">
          <div className="flex items-end gap-2 flex-1 min-w-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
            <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
            <span className="w-20 sm:w-24 border-b-2 border-current/70 mb-0.5"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
            <span className="w-14 sm:w-16 border-b-2 border-current/70 mb-0.5"></span>
          </div>
        </div>

        {/* Exam Metadata Grid - Clean 4 Pillars without Date */}
        <div className="grid grid-cols-4 border-t border-current/40 pt-2 text-xs font-semibold">
          <div><span className="font-bold">Class:</span> 9th Class</div>
          <div><span className="font-bold">Subject:</span> Computer Science</div>
          <div><span className="font-bold">Time Allowed:</span> 60 Mins</div>
          <div><span className="font-bold">Max Marks:</span> 50</div>
        </div>

        {/* Syllabus Strip */}
        {syllabus && (
          <div className="border-t border-current/20 pt-1.5 text-xs font-semibold">
            <span className="font-bold">Syllabus:</span> {syllabus}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 2: Modern Side-by-Side Logo Split
  // -----------------------------------------------------------
  if (layoutId === 'Layout 2') {
    return (
      <div className="border-b-2 border-current pb-2.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-sm shrink-0">
              PTM
            </div>
            <div>
              <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 28)}px` }}>
                {academyName}
              </h2>
              <p className="text-xs italic opacity-80">{tagline}</p>
            </div>
          </div>
          <div className="text-right text-xs font-bold space-y-0.5 border-l-2 border-current pl-4">
            <div className="uppercase tracking-wide">EXAMINATION ASSESSMENT</div>
            <div className="text-[11px] font-semibold opacity-75">Academic Session 2025-26</div>
          </div>
        </div>

        {/* Student Name & Roll No Row - Extra Spacious */}
        <div className="flex items-end justify-between border-t border-b border-current/50 my-2.5 py-3 px-2 text-xs font-semibold gap-3 sm:gap-4 w-full">
          <div className="flex items-end gap-2 flex-1 min-w-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
            <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
            <span className="w-20 sm:w-24 border-b-2 border-current/70 mb-0.5"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
            <span className="w-14 sm:w-16 border-b-2 border-current/70 mb-0.5"></span>
          </div>
        </div>

        {/* Exam Details without Date */}
        <div className="flex items-center justify-between border-t border-current/20 mt-1.5 pt-1.5 text-xs font-bold opacity-90">
          <span>Subject: Computer Science</span>
          <span>Class: 9th</span>
          <span>Time: 60 Mins</span>
          <span>Max Marks: 50</span>
        </div>

        {/* Syllabus Strip */}
        {syllabus && (
          <div className="border-t border-current/20 mt-1.5 pt-1 text-xs font-semibold">
            <span className="font-bold">Syllabus:</span> {syllabus}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 3: Board / Official Boxed Grid
  // -----------------------------------------------------------
  if (layoutId === 'Layout 3') {
    return (
      <div className="border-2 border-current">
        <div className="p-2 text-center border-b-2 border-current bg-slate-50/50">
          <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 28)}px` }}>
            {academyName}
          </h2>
          <p className="text-xs font-semibold opacity-75">{tagline}</p>
        </div>
        <div className="grid grid-cols-12 divide-x-2 divide-current text-xs">
          <div className="col-span-6 p-3 space-y-2.5 text-left">
            <div className="flex items-end gap-2">
              <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
              <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
            </div>
            <div className="flex items-end justify-between gap-3 text-xs font-semibold pt-1">
              <div className="flex items-end gap-1.5 flex-1">
                <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
                <span className="flex-1 border-b-2 border-current/70 mb-0.5"></span>
              </div>
              <div className="flex items-end gap-1.5 flex-1">
                <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
                <span className="flex-1 border-b-2 border-current/70 mb-0.5"></span>
              </div>
            </div>
          </div>
          <div className="col-span-3 p-2 text-center font-bold flex flex-col items-center justify-center bg-slate-50/40">
            <span className="uppercase text-[11px] tracking-wider">ANNUAL ASSESSMENT TEST</span>
            <span className="text-xs font-black mt-1">Total Marks: 50</span>
          </div>
          <div className="col-span-3 p-2 space-y-1 text-right font-semibold">
            <div><span className="font-bold">Subject:</span> Computer</div>
            <div><span className="font-bold">Class:</span> 9th Class</div>
            <div><span className="font-bold">Time Allowed:</span> 60 Mins</div>
          </div>
        </div>
        {/* Syllabus Strip */}
        {syllabus && (
          <div className="border-t-2 border-current p-1.5 text-xs font-semibold bg-slate-50/50">
            <span className="font-bold">Syllabus:</span> {syllabus}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 4: Minimalist Clean Header
  // -----------------------------------------------------------
  if (layoutId === 'Layout 4') {
    return (
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 26)}px` }}>
            {academyName}
          </h2>
          <span className="text-xs font-bold uppercase tracking-wider border-b-2 border-current pb-0.5">
            Class Test Examination
          </span>
        </div>

        {/* Student Name & Roll No Row - Extra Spacious */}
        <div className="flex items-end justify-between text-xs font-semibold border-t border-b border-current/50 py-3 px-2 my-2 gap-3 sm:gap-4 w-full">
          <div className="flex items-end gap-2 flex-1 min-w-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
            <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
            <span className="w-20 sm:w-24 border-b-2 border-current/70 mb-0.5"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
            <span className="w-14 sm:w-16 border-b-2 border-current/70 mb-0.5"></span>
          </div>
        </div>

        {/* Exam Details without Date */}
        <div className="flex items-center justify-between text-xs opacity-85 border-b border-current/30 py-1.5 font-semibold">
          <span>Subject: Computer Science (9th)</span>
          <span>Paper Time: 60 Mins</span>
          <span>Total Marks: 50</span>
        </div>
        {/* Syllabus Strip */}
        {syllabus && (
          <div className="text-xs font-semibold pt-1">
            <span className="font-bold">Syllabus:</span> {syllabus}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 5: Dual Logo Academy Style
  // -----------------------------------------------------------
  if (layoutId === 'Layout 5') {
    return (
      <div className="border-2 border-current p-2.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="w-11 h-11 rounded-full border-2 border-current flex items-center justify-center font-black text-[11px] shrink-0">
            LOGO
          </div>
          <div className="text-center flex-1 px-3">
            <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 28)}px` }}>
              {academyName}
            </h2>
            <p className="text-xs italic opacity-75">{tagline}</p>
          </div>
          <div className="w-11 h-11 rounded-full border-2 border-current flex items-center justify-center font-black text-[11px] shrink-0">
            CREST
          </div>
        </div>

        {/* Student Name Section - Extra Spacious */}
        <div className="border-t border-b border-current my-2.5 py-3 px-3 flex items-end justify-between text-xs font-semibold bg-slate-50/50 gap-3 sm:gap-4 w-full">
          <div className="flex items-end gap-2 flex-1 min-w-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
            <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
            <span className="w-20 sm:w-24 border-b-2 border-current/70 mb-0.5"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
            <span className="w-14 sm:w-16 border-b-2 border-current/70 mb-0.5"></span>
          </div>
        </div>

        {/* Exam row without Date */}
        <div className="grid grid-cols-4 border-t border-current pt-1.5 text-xs text-center font-semibold">
          <div><span className="font-bold">Class:</span> 9th</div>
          <div><span className="font-bold">Subject:</span> Computer</div>
          <div><span className="font-bold">Time Allowed:</span> 60 Mins</div>
          <div><span className="font-bold">Total Marks:</span> 50</div>
        </div>

        {/* Syllabus Strip */}
        {syllabus && (
          <div className="border-t border-current pt-1 text-xs font-semibold">
            <span className="font-bold">Syllabus:</span> {syllabus}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 6: Compact Single-Line / Two-Row Header
  // -----------------------------------------------------------
  if (layoutId === 'Layout 6') {
    return (
      <div className="border border-current p-2 text-xs space-y-1.5">
        <div className="flex items-center justify-between border-b border-current/40 pb-1.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm uppercase">{academyName}</span>
            <span className="opacity-50">|</span>
            <span className="font-semibold">Subject: Computer Science (9th)</span>
          </div>
          <div className="flex items-center gap-3 font-bold">
            <span>Time: 60m</span>
            <span>Marks: 50</span>
          </div>
        </div>

        <div className="flex items-end justify-between gap-3 sm:gap-4 py-2.5 px-1 w-full">
          <div className="flex items-end gap-2 flex-1 min-w-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
            <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
            <span className="w-20 sm:w-24 border-b-2 border-current/70 mb-0.5"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
            <span className="w-14 sm:w-16 border-b-2 border-current/70 mb-0.5"></span>
          </div>
        </div>
        {/* Syllabus Strip */}
        {syllabus && (
          <div className="border-t border-current/30 pt-1 text-xs font-semibold">
            <span className="font-bold">Syllabus:</span> {syllabus}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 7: Bordered Certificate Style (Reference Layout)
  // -----------------------------------------------------------
  if (layoutId === 'Layout 7') {
    return (
      <div className="border-4 border-current p-1.5 relative">
        <div className="border border-current p-3 text-center space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">
            • CENTRAL EXAMINATION COUNCIL •
          </div>
          <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 30)}px` }}>
            {academyName}
          </h2>
          <p className="text-xs italic opacity-85">{tagline}</p>

          {/* Student Name and Candidate Info - Extra Spacious (NO DATE, MAXIMUM WRITING SPACE) */}
          <div className="border-t border-b border-current py-3 px-3 my-2 flex items-end justify-between text-xs font-semibold gap-3 sm:gap-4 text-left bg-slate-50/30 w-full">
            <div className="flex items-end gap-2 flex-1 min-w-0">
              <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
              <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
            </div>
            <div className="flex items-end gap-2 shrink-0">
              <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
              <span className="w-20 sm:w-24 border-b-2 border-current/70 mb-0.5"></span>
            </div>
            <div className="flex items-end gap-2 shrink-0">
              <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
              <span className="w-14 sm:w-16 border-b-2 border-current/70 mb-0.5"></span>
            </div>
          </div>

          <div className="flex items-center justify-around border-t border-current pt-2 text-xs font-semibold">
            <span><strong className="font-bold">Class:</strong> 9th</span>
            <span><strong className="font-bold">Subject:</strong> Computer Science</span>
            <span><strong className="font-bold">Time Allowed:</strong> 60 Mins</span>
            <span><strong className="font-bold">Maximum Marks:</strong> 50</span>
          </div>

          {/* Syllabus Strip */}
          {syllabus && (
            <div className="border-t border-current pt-1.5 text-xs font-semibold flex items-center justify-center gap-2">
              <span className="font-bold">Syllabus / Topics:</span>
              <span className="font-bold text-blue-900 border-b border-dashed border-current/50">
                {syllabus}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 8: Formal Examination Series
  // -----------------------------------------------------------
  if (layoutId === 'Layout 8') {
    return (
      <div className="border-2 border-current">
        <div className="p-3 border-b-2 border-current flex items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 28)}px` }}>
              {academyName}
            </h2>
            <p className="text-xs opacity-80">{tagline}</p>
            <div className="flex items-end gap-2 mt-3 text-xs font-semibold">
              <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
              <span className="w-64 sm:w-80 max-w-full border-b-2 border-current/70 mb-0.5"></span>
            </div>
          </div>
          <div className="border-2 border-current p-2 text-center text-xs shrink-0 bg-slate-50/70">
            <div className="font-bold text-[10px] tracking-wider">CANDIDATE ROLL NO</div>
            <div className="font-mono tracking-widest font-black text-sm mt-1">[ _ _ _ _ _ ]</div>
          </div>
        </div>

        <div className="grid grid-cols-4 divide-x divide-current text-xs p-1.5 font-semibold text-center bg-slate-50/40">
          <div>Subject: Computer Science</div>
          <div>Class: 9th Class</div>
          <div>Duration: 60 Mins</div>
          <div>Total Marks: 50</div>
        </div>

        {/* Syllabus Strip */}
        {syllabus && (
          <div className="border-t border-current p-1.5 text-xs font-semibold text-center bg-slate-50/60">
            <span className="font-bold">Syllabus:</span> {syllabus}
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 9: Punjab Board Official BISE Style (NEW)
  // -----------------------------------------------------------
  if (layoutId === 'Layout 9') {
    return (
      <div className="border-2 border-current bg-white">
        <div className="border-b-2 border-current p-2.5 text-center bg-slate-50/40">
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <span>⭐</span>
            <span>BOARD OF INTERMEDIATE & SECONDARY EDUCATION • STANDARD ASSESSMENT</span>
            <span>⭐</span>
          </div>
          <h2 className={`${styleClass} mt-1`} style={{ fontSize: `${Math.min(headerFontSize, 29)}px` }}>
            {academyName}
          </h2>
          <p className="text-xs italic opacity-80 mt-0.5">{tagline || "Affiliated Examination Series"}</p>
        </div>

        {/* Deep spacious candidate block with ample writing room */}
        <div className="border-b-2 border-current p-3 bg-white text-xs font-semibold w-full">
          <div className="flex items-end gap-3">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Candidate Name:</span>
            <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
            <span className="font-bold shrink-0 ml-2 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
            <span className="w-24 sm:w-28 border-b-2 border-current/70 mb-0.5 text-center font-mono"></span>
          </div>
        </div>

        {/* 4 Metadata Pillars */}
        <div className="grid grid-cols-4 divide-x-2 divide-current text-xs font-bold text-center bg-slate-50/60 py-1.5">
          <div><span className="opacity-70 font-normal">Subject:</span> Computer</div>
          <div><span className="opacity-70 font-normal">Class:</span> 9th Class</div>
          <div><span className="opacity-70 font-normal">Time:</span> 60 Mins</div>
          <div><span className="opacity-70 font-normal">Max Marks:</span> 50</div>
        </div>

        {syllabus && (
          <div className="border-t-2 border-current p-1.5 text-xs font-semibold bg-white text-center">
            <span className="font-bold">Syllabus / Topics: </span>
            <span className="text-blue-900 font-bold">{syllabus}</span>
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 10: Royal Crown Academy Luxury (NEW)
  // -----------------------------------------------------------
  if (layoutId === 'Layout 10') {
    return (
      <div className="border-2 border-current p-1.5 bg-white relative">
        <div className="border border-current p-3 text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <span className="text-base opacity-75">✦ 👑 ✦</span>
            <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 30)}px` }}>
              {academyName}
            </h2>
            <span className="text-base opacity-75">✦ 👑 ✦</span>
          </div>
          <p className="text-xs italic opacity-85 font-serif">{tagline}</p>

          {/* Deep Padded Candidate Info Bar */}
          <div className="border-t-2 border-b-2 border-current py-3.5 px-3 my-2 flex items-end justify-between text-xs font-semibold gap-3 sm:gap-4 text-left bg-slate-50/30 w-full">
            <div className="flex items-end gap-2 flex-1 min-w-0">
              <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
              <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
            </div>
            <div className="flex items-end gap-2 shrink-0">
              <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
              <span className="w-20 sm:w-24 border-b-2 border-current/70 mb-0.5"></span>
            </div>
            <div className="flex items-end gap-2 shrink-0">
              <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
              <span className="w-14 sm:w-16 border-b-2 border-current/70 mb-0.5"></span>
            </div>
          </div>

          <div className="flex items-center justify-around text-xs font-bold pt-1">
            <span className="px-2 py-0.5 border border-current rounded-md">Class: 9th</span>
            <span className="px-2 py-0.5 border border-current rounded-md">Subject: Computer Science</span>
            <span className="px-2 py-0.5 border border-current rounded-md">Time: 60 Mins</span>
            <span className="px-2 py-0.5 border border-current rounded-md">Marks: 50</span>
          </div>

          {syllabus && (
            <div className="border-t border-current pt-1.5 text-xs font-semibold flex items-center justify-center gap-2">
              <span className="font-bold">Syllabus:</span>
              <span className="text-blue-900 font-bold">{syllabus}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 11: Modern Cambridge Minimalist (NEW)
  // -----------------------------------------------------------
  if (layoutId === 'Layout 11') {
    return (
      <div className="border-b-2 border-current pb-2 space-y-2 bg-white">
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-current/40">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">INTERNATIONAL ASSESSMENT SERIES</div>
            <h2 className={`${styleClass} mt-0.5`} style={{ fontSize: `${Math.min(headerFontSize, 28)}px` }}>
              {academyName}
            </h2>
            <p className="text-xs italic opacity-80">{tagline}</p>
          </div>
          <div className="border-2 border-current p-2 text-right text-xs shrink-0 font-bold space-y-0.5 bg-slate-50">
            <div className="uppercase tracking-wider">PAPER 1 • THEORY</div>
            <div className="text-sm font-black">50 MARKS</div>
            <div className="text-[10px] opacity-75">Time: 60 Mins</div>
          </div>
        </div>

        {/* Wide Candidate identification row with deep writing space */}
        <div className="py-3 px-1 flex items-end justify-between text-xs font-semibold gap-3 sm:gap-4 w-full">
          <div className="flex items-end gap-2 flex-1 min-w-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Candidate Name:</span>
            <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
          </div>
          <div className="flex items-end gap-2 shrink-0">
            <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Candidate Roll No:</span>
            <span className="w-24 sm:w-28 border-b-2 border-current/70 mb-0.5"></span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-bold border-t border-current/30 pt-1">
          <span>Subject: Computer Science</span>
          <span>Class: 9th Class</span>
          {syllabus && <span className="text-blue-900 font-bold">Syllabus: {syllabus}</span>}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 12: Dual Boxed Institutional Grid (NEW)
  // -----------------------------------------------------------
  if (layoutId === 'Layout 12') {
    return (
      <div className="grid grid-cols-12 border-2 border-current text-xs bg-white">
        <div className="col-span-7 p-3 border-r-2 border-current space-y-1.5">
          <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 26)}px` }}>
            {academyName}
          </h2>
          <p className="text-xs italic opacity-80">{tagline}</p>
          <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold border-t border-current/40">
            <div><span className="font-bold">Subject:</span> Computer Science</div>
            <div><span className="font-bold">Class:</span> 9th Class</div>
            <div><span className="font-bold">Time:</span> 60 Mins</div>
            <div><span className="font-bold">Total Marks:</span> 50</div>
          </div>
        </div>

        <div className="col-span-5 p-3 flex flex-col justify-between space-y-2.5 bg-slate-50/50">
          <div className="space-y-1">
            <span className="font-bold block leading-none pb-0.5">Student Full Name:</span>
            <span className="w-full border-b-2 border-current/70 block"></span>
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex items-end gap-1.5 flex-1">
              <span className="font-bold shrink-0 leading-none pb-0.5">Roll No:</span>
              <span className="flex-1 border-b-2 border-current/70 mb-0.5"></span>
            </div>
            <div className="flex items-end gap-1.5 flex-1">
              <span className="font-bold shrink-0 leading-none pb-0.5">Section:</span>
              <span className="flex-1 border-b-2 border-current/70 mb-0.5"></span>
            </div>
          </div>
          <div className="flex items-end gap-2 pt-1 border-t border-current/30 text-[11px]">
            <span className="font-bold shrink-0 leading-none pb-0.5">Invigilator Sign:</span>
            <span className="flex-1 border-b border-current/60 mb-0.5 inline-block"></span>
          </div>
        </div>

        {syllabus && (
          <div className="col-span-12 border-t-2 border-current p-1.5 text-xs font-semibold text-center bg-slate-50/70">
            <span className="font-bold">Syllabus / Topics: </span>
            <span className="text-blue-900 font-bold">{syllabus}</span>
          </div>
        )}
      </div>
    );
  }

  // -----------------------------------------------------------
  // LAYOUT 13: Creative Developers Dashed Box (DEFAULT)
  // -----------------------------------------------------------
  return (
    <div className="border-2 border-dashed border-current p-2">
      <div className="text-center pb-2.5 border-b border-dashed border-current flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 via-green-500 to-amber-400 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-[10px] text-slate-800">
              🎨
            </div>
          </div>
          <h2 className={`${styleClass}`} style={{ fontSize: `${Math.min(headerFontSize, 28)}px` }}>
            {academyName}
          </h2>
        </div>
        <p className="text-xs italic opacity-75 mt-0.5">{tagline}</p>
      </div>

      {/* Dedicated Spacious Candidate Bar with Bottom-Aligned Writing Lines */}
      <div className="border-b border-dashed border-current py-3 px-3 my-1 flex items-end justify-between text-xs font-semibold gap-3 sm:gap-4 w-full">
        <div className="flex items-end gap-2 flex-1 min-w-0">
          <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
          <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
        </div>
        <div className="flex items-end gap-2 shrink-0">
          <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
          <span className="w-20 sm:w-24 border-b-2 border-current/70 mb-0.5"></span>
        </div>
        <div className="flex items-end gap-2 shrink-0">
          <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Section:</span>
          <span className="w-14 sm:w-16 border-b-2 border-current/70 mb-0.5"></span>
        </div>
      </div>

      <div className="grid grid-cols-12 text-xs">
        <div className="col-span-4 border-r-2 border-current divide-y divide-current">
          <div className="p-1.5 flex justify-between">
            <span className="font-bold">Paper Type:</span>
            <span>Subjective + Objective</span>
          </div>
          <div className="p-1.5 flex justify-between">
            <span className="font-bold">Paper Time:</span>
            <span>60 Mins</span>
          </div>
        </div>

        <div className="col-span-4 border-r-2 border-current flex flex-col items-center justify-center p-1.5 text-center divide-y divide-current/30">
          <div className="py-0.5 font-bold uppercase text-[11px]">CLASS TEST EXAMINATION</div>
          <div className="py-0.5 text-xs font-black">
            Total Marks: 50
          </div>
        </div>

        <div className="col-span-4 divide-y divide-current">
          <div className="p-1.5 flex justify-between">
            <span className="font-bold">Class:</span>
            <span>9th Class</span>
          </div>
          <div className="p-1.5 flex justify-between">
            <span className="font-bold">Subject:</span>
            <span>Computer Science</span>
          </div>
          <div className="p-1.5 flex justify-between">
            <span className="font-bold">Maximum Marks:</span>
            <span className="font-bold">50</span>
          </div>
        </div>
      </div>
      
      {/* Syllabus Strip */}
      {syllabus && (
        <div className="border-t border-dashed border-current py-1.5 px-2 text-xs font-semibold flex items-center bg-slate-50/50">
          <span className="font-bold shrink-0 mr-2">Syllabus:</span>
          {syllabus}
        </div>
      )}
    </div>
  );
}
