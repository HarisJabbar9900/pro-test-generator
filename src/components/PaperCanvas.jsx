import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Trash2, ArrowUp, ArrowDown, RefreshCw, 
  Eye, ZoomIn, ZoomOut, Printer, Key, RotateCcw, Columns,
  MessageCircle, ShieldCheck, Layers, Share2, QrCode,
  FileText, Download
} from 'lucide-react';
import SwapQuestionModal from './SwapQuestionModal';
import TeacherAnswerKeyModal from './TeacherAnswerKeyModal';
import WhatsAppShareModal from './WhatsAppShareModal';
import { generateMultiSets } from '../utils/multiSetHelper';
import { notify } from '../utils/notify';
import { isSuperAdmin } from '../utils/pricingPlansService';
import { getOrCreatePaperId, syncPaperForQrAccess, generateQrCodeDataUrl } from '../utils/qrCodeService';
import { formatPaperFileName } from '../utils/syllabusHelper';

const EMPTY_PAPER_DATA = Object.freeze({ mcqs: [], shortQuestions: [], longQuestions: [] });
const EMPTY_CONFIG = Object.freeze({});

// ============================================================
// ACADEMY WATERMARK LOGO EMBLEM (Official Seal & Crest)
// ============================================================
function AcademyWatermarkLogo({ name, logoUrl, size = 380 }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt="Academy Logo Watermark"
        className="object-contain filter grayscale contrast-125 pointer-events-none"
        style={{ width: `${size}px`, height: `${size}px`, maxHeight: `${size}px` }}
      />
    );
  }

  // Calculate intelligent initials from school/academy name
  const cleanName = (name || 'ACADEMY').trim();
  let initials = 'PTM';
  if (cleanName.toUpperCase().includes('AL-ZIA')) {
    initials = 'AZ';
  } else {
    const words = cleanName.split(/\s+/).filter(Boolean);
    if (words.length >= 3) {
      initials = (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
    } else if (words.length === 2) {
      initials = (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
      initials = words[0].substring(0, Math.min(words[0].length, 3)).toUpperCase();
    }
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="pointer-events-none"
      fill="currentColor"
    >
      {/* Outer Concentric Stamp Borders */}
      <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2.5" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="currentColor" strokeWidth="2.5" />

      {/* Laurel Wreath Leaves (Left) */}
      <g opacity="0.9">
        <path d="M 46 62 C 39 55 28 58 30 68 C 32 78 45 78 46 68 Z" />
        <path d="M 38 82 C 30 77 20 83 23 93 C 26 102 39 99 39 88 Z" />
        <path d="M 37 106 C 29 103 21 113 26 122 C 31 130 44 125 42 113 Z" />
        <path d="M 45 130 C 37 130 32 143 40 150 C 47 155 57 145 52 135 Z" />
        <path d="M 61 149 C 55 152 53 167 63 170 C 71 172 78 158 70 151 Z" />

        {/* Laurel Wreath Leaves (Right) */}
        <path d="M 154 62 C 161 55 172 58 170 68 C 168 78 155 78 154 68 Z" />
        <path d="M 162 82 C 170 77 180 83 177 93 C 174 102 161 99 161 88 Z" />
        <path d="M 163 106 C 171 103 179 113 174 122 C 169 130 156 125 158 113 Z" />
        <path d="M 155 130 C 163 130 168 143 160 150 C 153 155 143 145 148 135 Z" />
        <path d="M 139 149 C 145 152 147 167 137 170 C 129 172 122 158 130 151 Z" />
      </g>

      {/* Graduation Cap at Top */}
      <path d="M 100 24 L 126 36 L 100 48 L 74 36 Z" />
      <path d="M 88 43 L 88 51 C 88 56 112 56 112 51 L 112 43 Z" />
      <path d="M 122 39 L 127 54" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />

      {/* Heraldic Shield in Center */}
      <path
        d="M 100 52 Q 134 52 138 80 Q 138 124 100 150 Q 62 124 62 80 Q 66 52 100 52 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        d="M 100 58 Q 128 58 131 82 Q 131 119 100 142 Q 69 119 69 82 Q 72 58 100 58 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 2.5"
      />

      {/* Open Book of Knowledge in Shield */}
      <path
        d="M 80 80 Q 90 77 100 81 Q 110 77 120 80 L 120 92 Q 110 89 100 93 Q 90 89 80 92 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <line x1="100" y1="81" x2="100" y2="93" stroke="currentColor" strokeWidth="2.5" />

      {/* Academy Monogram Initials in Shield Center */}
      <text
        x="100"
        y="126"
        textAnchor="middle"
        fontSize={initials.length > 2 ? "24" : "30"}
        fontWeight="900"
        fontFamily="serif"
        letterSpacing="0.08em"
        fill="currentColor"
      >
        {initials}
      </text>

      {/* Bottom Ribbon / Scroll with "EXCELLENCE" */}
      <path
        d="M 68 156 L 100 150 L 132 156 L 126 166 L 100 160 L 74 166 Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  );
}

export default function PaperCanvas({
  config,
  paperConfig: propPaperConfig,
  setConfig,
  setPaperConfig: propSetPaperConfig,
  data,
  paperData: propPaperData,
  setPaperData,
  onResetPaper,
  onOpenGeneratorModal,
  selectedClass,
  selectedSubject,
  language: propLanguageDirect,
  currentLanguage: propLanguageCurrent,
  availableBankQuestions = { mcqs: [], shortQuestions: [], longQuestions: [] },
  onAddQuestion,
  onExportDocx,
  onSavePaper,
  currentUser = null,
  userSubscribed = true
}) {
  const paperConfig = config || propPaperConfig || EMPTY_CONFIG;
  const setPaperConfig = setConfig || propSetPaperConfig || (() => {});
  const paperData = data || propPaperData || EMPTY_PAPER_DATA;
  const propLanguage = propLanguageCurrent || propLanguageDirect || "English";

  const {
    academyName,
    tagline,
    subject,
    gradeClass: rawGradeClass,
    timeAllowed,
    topMargin = 15,
    questionGap = 2, // Dynamic Gap range slider (0px to 24px)
    fontSize = 10,   // Dynamic Font Size range slider (8pt to 14pt)
    englishFont = 'Inter',
    showInstructions,
    instructions,
    watermarkText: configWatermarkText,
    showWatermark: configShowWatermark,
    watermarkType = 'Text Watermark',
    logoUrl = paperConfig.logoUrl,
    theme,
    showAnswerKey,
    headerLayout = 'Layout 13',
    headerFontStyle = 'Default',
    headerFontSize = 30,
    paperFontColor = 'Black'
  } = paperConfig;

  const gradeClass = rawGradeClass || (selectedClass ? `${selectedClass} Class` : '11th Class');

  // Multi-Set Cheating Protection States (Sets A, B, C, D)
  const [isMultiSetEnabled, setIsMultiSetEnabled] = useState(false);
  const [activeSetKey, setActiveSetKey] = useState('A'); // 'A' | 'B' | 'C' | 'D'
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Generate 4 deterministic sets from base paperData
  const multiSets = useMemo(() => {
    return generateMultiSets(paperData);
  }, [paperData]);

  // Active dataset to display on canvas
  const currentActiveData = (isMultiSetEnabled && multiSets && multiSets[activeSetKey])
    ? multiSets[activeSetKey]
    : paperData;

  // Zoom level state (default 100% on desktop, fit on mobile)
  const calculateFitZoom = () => {
    if (typeof window === 'undefined') return 100;
    const padding = 32;
    const availableWidth = window.innerWidth - padding;
    const paperWidth = 794;
    return Math.min(100, Math.max(30, Math.floor((availableWidth / paperWidth) * 100)));
  };

  const [zoomLevel, setZoomLevel] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return calculateFitZoom();
    }
    return 100;
  });
  const [activeMcqLayout, setActiveMcqLayout] = useState(paperConfig.mcqLayout || '1 Column');
  const [mcqCols, setMcqCols] = useState(Number(paperConfig.mcqOptionsCols) || 2); // 1, 2, or 4
  const [contentFormat, setContentFormat] = useState(paperConfig.contentFormat || 'standard'); // 'standard' or 'table'
  const [showAnswerLines] = useState(false); // Student answer writing lines

  // Scroll to top immediately when PaperCanvas mounts to eliminate blank screen on mobile
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Dynamically observe paper's actual DOM height so container height perfectly collapses
  // when scaled down, removing all dead whitespace below the paper on mobile
  const paperRef = useRef(null);
  const [paperHeight, setPaperHeight] = useState(1123);

  useEffect(() => {
    if (!paperRef.current) return;
    const updateHeight = () => {
      if (paperRef.current) {
        const h = paperRef.current.offsetHeight || 1123;
        setPaperHeight(h);
      }
    };
    updateHeight();
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(updateHeight);
      ro.observe(paperRef.current);
      return () => ro.disconnect();
    }
  }, [currentActiveData, paperConfig, fontSize, questionGap, topMargin]);

  // Sync with paperConfig if changed from Settings
  useEffect(() => {
    if (paperConfig.mcqLayout) {
      setActiveMcqLayout(paperConfig.mcqLayout);
    }
  }, [paperConfig.mcqLayout]);

  useEffect(() => {
    if (paperConfig.mcqOptionsCols) {
      setMcqCols(Number(paperConfig.mcqOptionsCols) || 2);
    }
  }, [paperConfig.mcqOptionsCols]);

  useEffect(() => {
    if (paperConfig.contentFormat) {
      setContentFormat(paperConfig.contentFormat);
    }
  }, [paperConfig.contentFormat]);

  // Solution QR Code State (Free scan-to-solve PDF download)
  const [showSolutionQr, setShowSolutionQr] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [paperSolutionId, setPaperSolutionId] = useState('');

  // Auto-generate QR code and sync paper solution to cloud
  useEffect(() => {
    let isMounted = true;
    const pid = getOrCreatePaperId(paperData);
    setPaperSolutionId(pid);

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const solutionUrl = `${baseUrl}/?paper_solution=${pid}`;

    generateQrCodeDataUrl(solutionUrl).then(dataUrl => {
      if (isMounted && dataUrl) {
        setQrDataUrl(dataUrl);
      }
    });

    // Background sync to Firestore for instant mobile scanner access
    syncPaperForQrAccess(pid, paperData, paperConfig).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [paperData, paperConfig]);

  // Teacher Answer Key States
  const [showTeacherMcqKey, setShowTeacherMcqKey] = useState(false);
  const [showAnswerKeyModal, setShowAnswerKeyModal] = useState(false);

  // Helper to detect correct MCQ option index (0 = A, 1 = B, 2 = C, 3 = D)
  const getMcqCorrectIndex = (q) => {
    if (!q) return -1;
    if (typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < (q.options?.length || 4)) {
      return q.correctIndex;
    }
    const raw = (q.answer || q.correctAnswer || q.answerKey || '').toString().trim();
    if (!raw) return -1;

    const cleaned = raw.toUpperCase().replace(/[()[\]:.\s]/g, '');
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

  // Allow teacher to click any option to mark it as the correct answer
  const handleSetMcqAnswer = (qIdx, optIdx) => {
    const letters = ['A', 'B', 'C', 'D'];
    setPaperData(prev => {
      const list = [...(prev.mcqs || [])];
      list[qIdx] = {
        ...list[qIdx],
        correctIndex: optIdx,
        answer: letters[optIdx]
      };
      return { ...prev, mcqs: list };
    });
  };

  // Swap modal state
  const [swapModalState, setSwapModalState] = useState({
    isOpen: false,
    sectionKey: 'mcqs',
    questionIndex: 0,
    currentQuestion: null
  });

  const openSwapModal = (sectionKey, questionIndex, currentQuestion) => {
    setSwapModalState({
      isOpen: true,
      sectionKey,
      questionIndex,
      currentQuestion
    });
  };

  const handleApplyReplacement = (sectionKey, questionIndex, newQuestion) => {
    setPaperData(prev => {
      const list = [...(prev[sectionKey] || [])];
      list[questionIndex] = { ...newQuestion, marks: list[questionIndex]?.marks || newQuestion.marks };
      return { ...prev, [sectionKey]: list };
    });
  };

  // Quick Watermark Toggle Local State (ensures 0ms instant UI and DOM toggle)
  const [localWatermarkOverride, setLocalWatermarkOverride] = useState(null);
  const isWatermarkEnabled = localWatermarkOverride !== null 
    ? localWatermarkOverride 
    : (configShowWatermark !== false && watermarkType !== 'None');

  const isLogoWatermark = watermarkType === 'Picture Watermark' || watermarkType === 'Logo Watermark' || watermarkType === 'Logo Only';

  const effectiveWatermark = (configWatermarkText && configWatermarkText !== 'PRO TEST MAKER')
    ? configWatermarkText
    : (academyName && academyName !== 'PRO TEST MAKER' 
        ? academyName 
        : (configWatermarkText || academyName || 'AL-ZIA SCIENCE ACADEMY'));

  // Dynamic scaled dimensions & negative margin compensation to eliminate unscaled dead whitespace below paper
  const currentScale = zoomLevel / 100;
  const scaledPaperHeight = Math.round(paperHeight * currentScale);
  const scaledPaperWidth = Math.round(794 * currentScale);
  const marginBottomCompensation = currentScale < 1 ? -Math.round(paperHeight * (1 - currentScale)) : 0;

  // Helper to resolve font color hex
  const getHeaderColorHex = (colorName) => {
    switch (colorName) {
      case 'Dark Navy (#0f172a)': return '#0f172a';
      case 'Deep Blue (#1e3a8a)': return '#1e3a8a';
      case 'Charcoal Gray (#334155)': return '#334155';
      default: return '#000000';
    }
  };
  const activeColor = getHeaderColorHex(paperFontColor);

  const getHeaderFontClass = () => {
    switch (headerFontStyle) {
      case 'Bold Serif': return 'font-serif font-black';
      case 'Modern Sans': return 'font-sans font-bold tracking-tight';
      case 'Formal Italic': return 'font-serif italic font-bold';
      case 'All Caps Heavy': return 'font-sans font-black uppercase tracking-widest';
      default: return 'font-sans font-black uppercase tracking-wider';
    }
  };
  const headerFontClass = getHeaderFontClass();

  // Helper to test if string contains genuine Urdu/Arabic characters
  const hasUrdu = (str) => typeof str === 'string' && /[\u0600-\u06FF]/.test(str);

  // Active language resolution
  const activeLanguage = propLanguage || paperConfig.language || "English";
  const isUrdu = activeLanguage === "Urdu";
  const isBlend = activeLanguage.includes("Blend") || activeLanguage.includes("Bilingual") || activeLanguage.includes("English + Urdu");

  const urduLetters = ["(الف)", "(ب)", "(ج)", "(د)"];
  const engLetters = ["(A)", "(B)", "(C)", "(D)"];

  // Dynamic spacing styles based on slider value
  const isUltraTight = questionGap <= 2;

  // Helper to extract clean English & Urdu strings
  const parseQuestionText = (text) => {
    if (!text) return { eng: '', urdu: '' };

    let eng = '';
    let urdu = '';

    if (text.includes("||")) {
      const parts = text.split("||");
      eng = parts[0].trim();
      urdu = parts[1].trim();
    } else if (hasUrdu(text)) {
      // Pure Urdu text or Urdu-first text
      eng = '';
      urdu = text.trim();
    } else {
      // Pure English question (DO NOT duplicate into urdu)
      eng = text.trim();
      urdu = '';
    }

    // Strictly strip any parenthetical English remnants from Urdu string
    if (urdu) {
      urdu = urdu.replace(/\s*\([A-Za-z0-9\s/,-]+\)/g, '').trim();
    }

    return { eng, urdu };
  };

  // Helper for options in bilingual / Urdu mode
  const parseOptionText = (optText) => {
    if (!optText) return { eng: '', urdu: '' };

    let eng = '';
    let urdu = '';

    if (optText.includes("||")) {
      const parts = optText.split("||");
      eng = parts[0].trim();
      urdu = parts[1].trim();
    } else if (hasUrdu(optText)) {
      eng = '';
      urdu = optText.trim();
    } else {
      // Pure English option (DO NOT duplicate into urdu)
      eng = optText.trim();
      urdu = '';
    }

    if (urdu) {
      urdu = urdu.replace(/\s*\([A-Za-z0-9\s/,-]+\)/g, '').trim();
    }

    return { eng, urdu };
  };

  // Render question prompt with side-by-side English (left) and Urdu (right)
  const renderQuestionPrompt = (qText, qIdx, sectionKey) => {
    const { eng, urdu } = parseQuestionText(qText);
    const hasActualUrdu = hasUrdu(urdu);
    const hasActualEng = Boolean(eng && eng.trim());

    // Only render bilingual 2-row layout if BOTH genuine English and genuine Urdu text exist
    if (isBlend && hasActualEng && hasActualUrdu) {
      return (
        <div className="w-full flex flex-col gap-0 my-0">
          {/* Top/Left Row: English (LTR, Left-aligned) */}
          <div className="flex justify-between items-start font-semibold text-slate-900 leading-snug">
            <div className="flex items-start gap-1.5 text-left">
              <span className="font-bold text-slate-900">Q{qIdx + 1}.</span>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateQuestionText(sectionKey, qIdx, `${e.target.innerText} || ${urdu}`)}
                className="focus:outline-none rounded"
              >
                {eng}
              </div>
            </div>
          </div>

          {/* Bottom/Right Row: Urdu (RTL, Right-aligned, Jameel Noori Nastaleeq) */}
          <div className="flex justify-end items-center font-bold text-slate-900 font-serif-urdu text-right leading-tight" dir="rtl">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900">سوال {qIdx + 1}:</span>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateQuestionText(sectionKey, qIdx, `${eng} || ${e.target.innerText}`)}
                className="focus:outline-none rounded"
              >
                {urdu}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Urdu mode or question text is purely Urdu
    if (isUrdu || (hasActualUrdu && !hasActualEng)) {
      return (
        <div className="flex items-start gap-1.5 w-full text-right font-bold text-slate-900 font-serif-urdu leading-tight" dir="rtl">
          <span className="font-bold">سوال {qIdx + 1}:</span>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateQuestionText(sectionKey, qIdx, e.target.innerText)}
            className="focus:outline-none rounded w-full"
          >
            {urdu || qText}
          </div>
        </div>
      );
    }

    // Default English single row (Clean, zero duplicate!)
    return (
      <div className="flex items-start gap-1.5 w-full text-left font-semibold text-slate-900 leading-snug">
        <span className="font-bold">Q{qIdx + 1}.</span>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateQuestionText(sectionKey, qIdx, e.target.innerText)}
          className="focus:outline-none rounded w-full"
        >
          {eng || qText}
        </div>
      </div>
    );
  };

  // Convert number to lower-case Roman numeral (1 -> i, 2 -> ii, etc.)
  const toRoman = (num) => {
    const romanNumerals = [
      '', 'i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x',
      'xi', 'xii', 'xiii', 'xiv', 'xv', 'xvi', 'xvii', 'xviii', 'xix', 'xx',
      'xxi', 'xxii', 'xxiii', 'xxiv', 'xxv', 'xxvi', 'xxvii', 'xxviii', 'xxix', 'xxx'
    ];
    return romanNumerals[num] || String(num);
  };

  // Render question prompt without question number prefix (used in Board Table format where Q# is a separate column)
  const renderQuestionPromptWithoutNum = (qText, qIdx, sectionKey) => {
    const { eng, urdu } = parseQuestionText(qText);
    const hasActualUrdu = hasUrdu(urdu);
    const hasActualEng = Boolean(eng && eng.trim());

    if (isBlend && hasActualEng && hasActualUrdu) {
      return (
        <div className="w-full flex flex-col gap-0.5">
          <div className="text-left font-semibold text-slate-900 leading-snug break-words">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateQuestionText(sectionKey, qIdx, `${e.target.innerText} || ${urdu}`)}
              className="focus:outline-none rounded break-words"
            >
              {eng}
            </div>
          </div>
          <div className="text-right font-bold text-slate-900 font-serif-urdu leading-tight break-words" dir="rtl">
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateQuestionText(sectionKey, qIdx, `${eng} || ${e.target.innerText}`)}
              className="focus:outline-none rounded break-words"
            >
              {urdu}
            </div>
          </div>
        </div>
      );
    }

    if (isUrdu || (hasActualUrdu && !hasActualEng)) {
      return (
        <div className="w-full text-right font-bold text-slate-900 font-serif-urdu leading-tight break-words" dir="rtl">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateQuestionText(sectionKey, qIdx, e.target.innerText)}
            className="focus:outline-none rounded w-full break-words"
          >
            {urdu || qText}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full text-left font-semibold text-slate-900 leading-snug break-words">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateQuestionText(sectionKey, qIdx, e.target.innerText)}
          className="focus:outline-none rounded w-full break-words"
        >
          {eng || qText}
        </div>
      </div>
    );
  };

  // Render option cell content in Board Table format
  const renderTableOptionContent = (optText, oIdx, qIdx, currentMcq) => {
    const { eng, urdu } = parseOptionText(optText);
    const hasActualUrdu = hasUrdu(urdu);
    const hasActualEng = Boolean(eng && eng.trim());
    const isCorrect = getMcqCorrectIndex(currentMcq) === oIdx;
    const isTeacherKeyActive = showTeacherMcqKey;

    const highlightClass = isTeacherKeyActive && isCorrect
      ? 'bg-emerald-100 font-black text-emerald-950 px-1 py-0.5 rounded border border-emerald-500'
      : '';

    if (isBlend && hasActualEng && hasActualUrdu) {
      return (
        <div className={`flex flex-col gap-0.5 justify-center items-center text-center ${highlightClass}`}>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateMcqOption(qIdx, oIdx, `${e.target.innerText} || ${urdu}`)}
            className="focus:outline-none rounded font-medium text-slate-800 leading-tight w-full break-words"
          >
            {eng}
          </span>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateMcqOption(qIdx, oIdx, `${eng} || ${e.target.innerText}`)}
            className="focus:outline-none rounded font-bold text-slate-900 font-serif-urdu leading-tight w-full break-words"
            dir="rtl"
          >
            {urdu}
          </span>
          {isTeacherKeyActive && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSetMcqAnswer(qIdx, oIdx);
              }}
              className={`no-print mt-0.5 px-1 py-0.2 rounded text-[9px] font-black cursor-pointer ${
                isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-emerald-100'
              }`}
            >
              {isCorrect ? '✓ Key' : 'Mark'}
            </button>
          )}
        </div>
      );
    }

    const isUrduOption = isUrdu || (hasActualUrdu && !hasActualEng);
    const textToDisplay = isUrduOption ? (urdu || optText) : (eng || optText);

    return (
      <div className={`flex flex-col justify-center items-center text-center ${highlightClass}`}>
        <span
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateMcqOption(qIdx, oIdx, e.target.innerText)}
          className={`focus:outline-none rounded leading-tight w-full break-words ${isUrduOption ? 'font-serif-urdu font-bold' : 'font-medium text-slate-800'} ${!textToDisplay?.trim() ? 'border-b border-dashed border-amber-400 text-amber-600 italic px-1' : ''}`}
          dir={isUrduOption ? 'rtl' : 'ltr'}
        >
          {textToDisplay?.trim() || "[Edit]"}
        </span>
        {isTeacherKeyActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSetMcqAnswer(qIdx, oIdx);
            }}
            className={`no-print mt-0.5 px-1 py-0.2 rounded text-[9px] font-black cursor-pointer ${
              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-emerald-100'
            }`}
          >
            {isCorrect ? '✓ Key' : 'Mark'}
          </button>
        )}
      </div>
    );
  };

  // Render option choice with English on left and Urdu on right
  const renderOptionChoice = (optText, oIdx, qIdx, currentMcq) => {
    const { eng, urdu } = parseOptionText(optText);
    const hasActualUrdu = hasUrdu(urdu);
    const hasActualEng = Boolean(eng && eng.trim());

    const isCorrect = getMcqCorrectIndex(currentMcq) === oIdx;
    const isTeacherKeyActive = showTeacherMcqKey;

    // Highlight container class when Teacher Mode is ON and this option is correct
    const highlightClass = isTeacherKeyActive && isCorrect
      ? 'bg-emerald-100/90 text-emerald-950 font-bold border-2 border-emerald-500 rounded px-1 py-0.5 shadow-2xs'
      : '';

    // Only render bilingual split if BOTH genuine English and genuine Urdu text exist
    if (isBlend && hasActualEng && hasActualUrdu) {
      return (
        <div
          className={`flex items-start justify-between w-full rounded transition-all ${highlightClass}`}
          style={{
            padding: isUltraTight ? '0px 2px' : '2px 4px',
            lineHeight: '1.2'
          }}
        >
          {/* English option left */}
          <span className="text-left font-medium text-slate-800 flex items-start flex-1 min-w-0">
            <span className="font-bold mr-1 shrink-0 leading-tight">{engLetters[oIdx % 4]}</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateMcqOption(qIdx, oIdx, `${e.target.innerText} || ${urdu}`)}
              className="leading-tight"
            >
              {eng}
            </span>
          </span>

          {/* Urdu option right */}
          <span className="text-right font-bold text-slate-900 font-serif-urdu flex items-start gap-1.5 flex-1 min-w-0 justify-end" dir="rtl">
            <span className="font-bold ml-1 shrink-0 leading-tight">{urduLetters[oIdx % 4]}</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => updateMcqOption(qIdx, oIdx, `${eng} || ${e.target.innerText}`)}
              className="leading-tight"
            >
              {urdu}
            </span>

            {/* Teacher Key Action Button / Badge */}
            {isTeacherKeyActive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetMcqAnswer(qIdx, oIdx);
                }}
                className={`no-print mr-2 px-1.5 py-0.5 rounded text-[10px] font-black tracking-tight shrink-0 transition-all cursor-pointer ${
                  isCorrect
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-200 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900 border border-slate-300'
                }`}
                title={isCorrect ? "Correct Option Selected" : "Click to mark as correct answer"}
              >
                {isCorrect ? '✓ Key' : 'Mark'}
              </button>
            )}
          </span>
        </div>
      );
    }

    // Single language option (Urdu if Urdu mode or pure Urdu text, otherwise clean English)
    const isUrduOption = isUrdu || (hasActualUrdu && !hasActualEng);
    const letter = isUrduOption ? urduLetters[oIdx % 4] : engLetters[oIdx % 4];
    const textToDisplay = isUrduOption ? (urdu || optText) : (eng || optText);

    return (
      <div
        className={`flex items-start justify-between gap-1.5 rounded transition-all ${highlightClass} ${isUrduOption ? 'text-right font-serif-urdu font-bold' : 'text-left'}`}
        dir={isUrduOption ? 'rtl' : 'ltr'}
        style={{
          padding: isUltraTight ? '0px 2px' : '2px 4px',
          lineHeight: '1.2'
        }}
      >
        <div className="flex items-start gap-1.5 min-w-0 flex-1">
          <span className="font-bold shrink-0 leading-tight">{letter}</span>
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => updateMcqOption(qIdx, oIdx, e.target.innerText)}
            className={`focus:outline-none rounded min-w-[30px] leading-tight ${!textToDisplay?.trim() ? 'border-b border-dashed border-amber-400/80 text-amber-600 italic px-1' : ''}`}
          >
            {textToDisplay?.trim() || "[Click to edit option]"}
          </span>
        </div>

        {/* Teacher Key Action Button / Badge */}
        {isTeacherKeyActive && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSetMcqAnswer(qIdx, oIdx);
            }}
            className={`no-print px-1.5 py-0.5 rounded text-[10px] font-black tracking-tight shrink-0 transition-all cursor-pointer ${
              isCorrect
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900 border border-slate-300'
            }`}
            title={isCorrect ? "Correct Option Selected" : "Click to mark as correct answer"}
          >
            {isCorrect ? '✓ Key' : 'Mark'}
          </button>
        )}
      </div>
    );
  };

  // Section titles
  const getSectionTitle = (type) => {
    if (type === 'mcqs') {
      if (isUrdu) return "حصہ اول: کثیر الانتخابی سوالات (MCQs)";
      if (isBlend) return "SECTION A: MULTIPLE CHOICE QUESTIONS (MCQs) / حصہ اول: کثیر الانتخابی سوالات";
      return "SECTION A: MULTIPLE CHOICE QUESTIONS (MCQs)";
    }
    if (type === 'short') {
      if (isUrdu) return "حصہ دوم: مختصر سوالات";
      if (isBlend) return "SECTION B: SHORT ANSWER QUESTIONS / حصہ دوم: مختصر سوالات";
      return "SECTION B: SHORT ANSWER QUESTIONS";
    }
    if (type === 'long') {
      if (isUrdu) return "حصہ سوم: تفصیلی سوالات";
      if (isBlend) return "SECTION C: ESSAY QUESTIONS / حصہ سوم: تفصیلی سوالات";
      return "SECTION C: ESSAY & COMPREHENSIVE QUESTIONS";
    }
    if (type === 'obj') {
      if (isUrdu) return "حصہ چہارم: معروضی سوالات";
      if (isBlend) return "SECTION D: OBJECTIVE ASSESSMENT / حصہ چہارم: معروضی سوالات";
      return "SECTION D: OBJECTIVE ASSESSMENT";
    }
  };

  // Calculate actual total marks from question objects
  const actualCalculatedMarks = React.useMemo(() => {
    let sum = 0;
    if (currentActiveData?.mcqs) currentActiveData.mcqs.forEach(q => sum += (q.marks || 1));
    if (currentActiveData?.shortQuestions) currentActiveData.shortQuestions.forEach(q => sum += (q.marks || 3));
    if (currentActiveData?.longQuestions) currentActiveData.longQuestions.forEach(q => sum += (q.marks || 5));
    if (currentActiveData?.trueFalse) currentActiveData.trueFalse.forEach(q => sum += (q.marks || 1));
    if (currentActiveData?.fillBlanks) currentActiveData.fillBlanks.forEach(q => sum += (q.marks || 1));
    return sum;
  }, [currentActiveData]);

  // Handlers for question updates
  const updateQuestionText = (sectionKey, index, newText) => {
    setPaperData(prev => {
      const list = [...prev[sectionKey]];
      list[index] = { ...list[index], question: newText };
      return { ...prev, [sectionKey]: list };
    });
  };

  const updateMcqOption = (mcqIndex, optIndex, newOptText) => {
    setPaperData(prev => {
      const list = [...prev.mcqs];
      const opts = [...list[mcqIndex].options];
      opts[optIndex] = newOptText;
      list[mcqIndex] = { ...list[mcqIndex].options, options: opts };
      return { ...prev, mcqs: list };
    });
  };

  const deleteQuestion = (sectionKey, index) => {
    setPaperData(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter((_, i) => i !== index)
    }));
  };

  const moveQuestion = (sectionKey, index, direction) => {
    setPaperData(prev => {
      const list = [...prev[sectionKey]];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, [sectionKey]: list };
    });
  };

  const handlePrintPaper = () => {
    if (currentUser && !isSuperAdmin(currentUser) && !userSubscribed) {
      notify.error("سبسکرپشن درکار ہے (Subscription Required)", {
        description: "پیپر پرنٹ کرنے کے لیے فعال پیکیج درکار ہے۔ براہ کرم پیکیج حاصل کریں۔"
      });
      return;
    }

    const paperTitle = formatPaperFileName({
      ...paperConfig,
      gradeClass: paperConfig.gradeClass || selectedClass,
      subject: paperConfig.subject || selectedSubject
    });
    const oldTitle = document.title;
    document.title = paperTitle;

    const currentZ = zoomLevel;
    setZoomLevel(100);

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setZoomLevel(currentZ);
        document.title = oldTitle;
      }, 700);
    }, 150);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      
      {/* CREATIVE TEST MAKER STYLE TOP ACTION BAR (RESPONSIVE FOR MOBILE & DESKTOP) */}
      <div className="no-print w-full bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-2 sm:px-4 sm:py-2.5 shadow-xs mb-2">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          
          {/* Left Group: Questions & Teacher Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* Question's Menu */}
            <button
              type="button"
              onClick={onOpenGeneratorModal}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
              title="Open Topics Checklist & Paper Criteria Dialog"
            >
              <span>☰ Questions Menu</span>
            </button>

            {/* Teacher MCQs Answer Key Toggle Button */}
            <button
              type="button"
              onClick={() => setShowTeacherMcqKey(!showTeacherMcqKey)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                showTeacherMcqKey
                  ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-300'
                  : 'bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 hover:border-amber-300'
              }`}
              title="Teacher MCQs Solution & Answer Key Mode"
            >
              <Key className="w-3.5 h-3.5" />
              <span>{showTeacherMcqKey ? 'Hide Answers' : 'MCQs Key'}</span>
            </button>

            {/* Full Answer Key Sheet Modal Button */}
            <button
              type="button"
              onClick={() => setShowAnswerKeyModal(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
              title="View & Print Full Answer Key Table"
            >
              <span>📋 Key Sheet</span>
            </button>
          </div>

          {/* Right/Center Group: Zoom & Discard Controls */}
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 px-2 py-1 rounded-xl shadow-2xs shrink-0">
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.max(30, prev - 10))}
                className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 font-bold transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-slate-800 text-xs px-1 min-w-[36px] text-center select-none">
                {zoomLevel}%
              </span>
              <button
                type="button"
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 font-bold transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-slate-300 mx-1"></div>

              <button
                type="button"
                onClick={() => setZoomLevel(calculateFitZoom())}
                className="px-1.5 sm:px-2 py-0.5 rounded-lg hover:bg-white text-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                title="Fit to Screen Width"
              >
                Fit Screen
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className={`px-1.5 sm:px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  zoomLevel === 100 ? 'bg-white text-blue-600 shadow-2xs' : 'hover:bg-white text-slate-600'
                }`}
                title="Reset to 100% Zoom"
              >
                100%
              </button>
            </div>

            {/* Cancel / Discard Paper */}
            <button
              type="button"
              onClick={onResetPaper}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-2xs shrink-0"
              title="Cancel & Reset Paper"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          </div>

        </div>
      </div>

      {/* PAPER ACTION DECK DIRECTLY WITH PAPER */}
      <div className="no-print w-full max-w-[794px] bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-xs mb-2 space-y-2.5">
        {/* Tier 1: Direct Edit & Multi-Set Cheating Protection */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
            <span>✍️ Direct Edit: Click any text to edit directly</span>
          </div>

          {/* Multi-Set Selector */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300/80 p-0.5 sm:p-1 rounded-xl shadow-2xs">
            <button
              type="button"
              onClick={() => setIsMultiSetEnabled(!isMultiSetEnabled)}
              className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                isMultiSetEnabled
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Toggle Cheating Protection Multi-Set Paper (Code A, B, C, D)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Set: {isMultiSetEnabled ? 'ON' : 'OFF'}</span>
            </button>

            {isMultiSetEnabled && (
              <div className="flex items-center gap-1 ml-1 border-l border-slate-300/80 pl-1">
                {['A', 'B', 'C', 'D'].map(sk => {
                  const sObj = multiSets[sk];
                  const isSel = activeSetKey === sk;
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => setActiveSetKey(sk)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-black transition-all cursor-pointer ${
                        isSel
                          ? 'bg-purple-700 text-white shadow-2xs ring-1 ring-purple-400'
                          : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                      }`}
                      title={`Switch to ${sObj?.name} (Code ${sObj?.code})`}
                    >
                      {sk} ({sObj?.code})
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tier 2: Layout Options & Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Paper Content Format Toggle: Standard List vs Board Table */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-300/80 px-2 py-1 rounded-xl shadow-2xs">
              <span className="text-[11px] font-bold text-slate-700">Format:</span>
              <button
                type="button"
                onClick={() => {
                  setContentFormat('standard');
                  setPaperConfig?.(prev => ({ ...prev, contentFormat: 'standard' }));
                  notify.info("سٹینڈرڈ لسٹ فارمیٹ فعال ہو گیا");
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  contentFormat === 'standard'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
                title="Standard List Format (روایتی لسٹ فارمیٹ)"
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => {
                  setContentFormat('table');
                  setPaperConfig?.(prev => ({ ...prev, contentFormat: 'table' }));
                  notify.info("آفیشل بورڈ ٹیبل فارمیٹ فعال ہو گیا (Board Table View)");
                }}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  contentFormat === 'table'
                    ? 'bg-emerald-600 text-white shadow-2xs ring-1 ring-emerald-400'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
                title="Official Board Tabular Format (بورڈ طرز کا جدول / ٹیبل)"
              >
                📋 Board Table
              </button>
            </div>

            {/* Quick MCQs Layout Toggle: 1 Col vs 2 Col */}
            {contentFormat !== 'table' && (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-300/80 px-2 py-1 rounded-xl shadow-2xs">
                <span className="text-[11px] font-bold text-slate-700">MCQs:</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMcqLayout('1 Column');
                    setPaperConfig?.(prev => ({ ...prev, mcqLayout: '1 Column' }));
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMcqLayout === '1 Column'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                  title="1 Column Full Width (Standard)"
                >
                  1 Col
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMcqLayout('2 Columns');
                    setPaperConfig?.(prev => ({ ...prev, mcqLayout: '2 Columns' }));
                  }}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMcqLayout === '2 Columns'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-white hover:text-slate-900'
                  }`}
                  title="2 Columns Side-by-Side (پیپر اور پرنٹ میں 2 کالمز)"
                >
                  2 Col
                </button>
              </div>
            )}

            {/* Quick Watermark Switcher: Text vs Logo vs Off */}
            <button
              type="button"
              onClick={() => {
                // Cycle: 'Text Watermark' -> 'Picture Watermark' -> 'None'
                let nextType;
                if (!isWatermarkEnabled || watermarkType === 'None') {
                  nextType = 'Text Watermark';
                } else if (watermarkType === 'Text Watermark') {
                  nextType = 'Picture Watermark';
                } else {
                  nextType = 'None';
                }

                const isEnabled = nextType !== 'None';
                setLocalWatermarkOverride(isEnabled);
                setPaperConfig?.(prev => ({ 
                  ...prev, 
                  showWatermark: isEnabled, 
                  watermarkType: nextType,
                  watermarkText: (prev?.watermarkText && prev.watermarkText !== 'PRO TEST MAKER')
                    ? prev.watermarkText
                    : (prev?.academyName || 'AL-ZIA SCIENCE ACADEMY')
                }));

                if (nextType === 'Text Watermark') {
                  notify.info("ٹیکسٹ واٹر مارک منتخب کیا گیا (Text Watermark Active)");
                } else if (nextType === 'Picture Watermark') {
                  notify.info("لوگو واٹر مارک منتخب کیا گیا (Logo Watermark Active)");
                } else {
                  notify.info("واٹر مارک بند کر دیا گیا (Watermark: OFF)");
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
                !isWatermarkEnabled || watermarkType === 'None'
                  ? 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                  : watermarkType === 'Picture Watermark' || watermarkType === 'Logo Watermark'
                  ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
                  : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
              }`}
              title="Click to switch: Text Watermark -> Logo Watermark -> Off"
            >
              <span>
                {!isWatermarkEnabled || watermarkType === 'None'
                  ? '⚪ Watermark: OFF'
                  : watermarkType === 'Picture Watermark' || watermarkType === 'Logo Watermark'
                  ? '🖼️ Watermark: Logo'
                  : '📝 Watermark: Text'}
              </span>
            </button>

            {/* Solution QR Code Toggle Button */}
            <button
              type="button"
              onClick={() => {
                setShowSolutionQr(prev => {
                  const next = !prev;
                  notify.info(next ? "پیپر پر کیو آر کوڈ فعال ہو گیا (Solution QR Code Enabled)" : "کیو آر کوڈ بند کر دیا گیا (QR Code Disabled)");
                  return next;
                });
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border ${
                showSolutionQr
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 hover:bg-indigo-100'
                  : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
              }`}
              title="Toggle Solution & Answer Key QR Code on Paper Header"
            >
              <QrCode className="w-3.5 h-3.5 shrink-0 text-indigo-600" />
              <span>QR Code: {showSolutionQr ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* A4 PAPER SHEET CONTAINER (WITH RESPONSIVE ZOOM CONTAINER) */}
      <div 
        className="a4-paper-wrapper w-full flex justify-center overflow-x-auto pb-3 sm:pb-6 transition-all"
        style={{
          minHeight: `${scaledPaperHeight}px`
        }}
      >
        <div
          className="a4-paper-zoom-container"
          style={{
            width: `${scaledPaperWidth}px`,
            height: `${scaledPaperHeight}px`,
            transition: 'width 0.15s ease, height 0.15s ease',
            position: 'relative',
            display: 'block',
            margin: '0 auto',
            flexShrink: 0
          }}
        >
          <div
            id="printable-paper"
            ref={paperRef}
            className={`a4-paper theme-${theme} relative ${isUrdu ? 'lang-urdu' : ''}`}
            style={{ 
              width: '794px',
              minWidth: '794px',
              maxWidth: '794px',
              margin: '0',
              marginBottom: `${marginBottomCompensation}px`,
              transform: `scale(${currentScale})`, 
              transformOrigin: 'top left',
              paddingTop: `${topMargin}mm`,
              fontSize: `${fontSize}pt`,
              fontFamily: `'${englishFont}', system-ui, sans-serif`
            }}
          >
          
          {/* Watermark Layer (Page 1 + Page 2 centered: Text vs Logo mode) */}
          {isWatermarkEnabled && (
            <div className="paper-watermarks-layer">
              {/* PAGE 1 */}
              {isLogoWatermark ? (
                <div className="watermark-logo-container">
                  <AcademyWatermarkLogo 
                    name={effectiveWatermark} 
                    logoUrl={logoUrl || paperConfig.logoUrl} 
                    size={380} 
                  />
                </div>
              ) : (
                <div className="watermark-container">
                  <div className="watermark-name-text">
                    {effectiveWatermark}
                  </div>
                  {tagline && (
                    <div className="watermark-tagline-text">
                      {tagline}
                    </div>
                  )}
                </div>
              )}

              {/* PAGE 2 */}
              {isLogoWatermark ? (
                <div className="watermark-logo-container watermark-page-2">
                  <AcademyWatermarkLogo 
                    name={effectiveWatermark} 
                    logoUrl={logoUrl || paperConfig.logoUrl} 
                    size={380} 
                  />
                </div>
              ) : (
                <div className="watermark-container watermark-page-2">
                  <div className="watermark-name-text">
                    {effectiveWatermark}
                  </div>
                  {tagline && (
                    <div className="watermark-tagline-text">
                      {tagline}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Answer Key Active Banner */}
          {showAnswerKey && (
            <div className="no-print bg-emerald-600 text-white text-xs font-bold text-center py-1.5 px-4 rounded-md mb-4 shadow-md flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              <span>TEACHER ANSWER KEY & EVALUATION RUBRIC MODE ACTIVE</span>
            </div>
          )}

          {/* Multi-Set Paper Code Banner (Printed on paper header) */}
          {isMultiSetEnabled && (
            <div className="flex items-center justify-between border-2 border-current px-3 py-1 mb-2 bg-slate-50/70 text-xs font-black">
              <span className="flex items-center gap-2 uppercase tracking-wider">
                <span className="no-print">🛡️</span>
                <span>EXAM PAPER CODE: <strong className="font-mono text-sm underline decoration-2">{multiSets[activeSetKey]?.code || '101'}</strong></span>
              </span>
              <span className="px-3 py-0.5 rounded bg-black text-white text-[11px] font-black uppercase tracking-wider">
                {multiSets[activeSetKey]?.name || 'SET A'} (CHEATING PROTECTED)
              </span>
            </div>
          )}

          {/* DYNAMIC PAPER HEADER SUPPORTING 8+ LAYOUTS, FONT SIZES, AND COLORS */}
          <header className="paper-header-root relative">
            {/* Top Right Official Solution QR Code Badge (Free Scan-to-Solve PDF) */}
            {showSolutionQr && qrDataUrl && (
              <div 
                className="solution-qr-badge absolute top-1 right-1 z-20 flex flex-col items-center justify-center p-1 bg-white border border-current rounded shadow-2xs select-none pointer-events-auto"
                style={{ width: '60px' }}
                title="Scan with phone camera to view Answer Key & Solved Paper PDF"
              >
                <img 
                  src={qrDataUrl} 
                  alt="Solution QR Code" 
                  className="w-11 h-11 object-contain block"
                />
                <span className="text-[5.5px] font-black uppercase tracking-tighter text-center leading-none mt-0.5" style={{ color: activeColor }}>
                  Scan For Key & PDF
                </span>
              </div>
            )}
          {(() => {
            const commonStyle = { color: activeColor };

            const renderThreeColBox = (borderStyle = "border-black") => (
              <div style={commonStyle}>
                {/* Dedicated Spacious Candidate Bar with Bottom-Aligned Writing Lines */}
                <div className={`border-b ${borderStyle} py-3 px-3 my-1.5 flex items-end justify-between text-xs font-semibold gap-3 sm:gap-4 w-full`}>
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

                <div className={`grid grid-cols-12 text-[0.82em]`}>
                  <div className={`col-span-4 border-r-2 ${borderStyle} divide-y ${borderStyle}`}>
                    <div className="p-1.5 flex items-center justify-between">
                      <span className="font-bold">Paper Type:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, paperType: e.target.innerText }))}
                        className="font-semibold"
                      >
                        {paperConfig.paperType || "Subjective + Objective"}
                      </span>
                    </div>
                    <div className="p-1.5 flex items-center justify-between">
                      <span className="font-bold">Paper Time:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, timeAllowed: e.target.innerText }))}
                        className="font-semibold"
                      >
                        {timeAllowed || "60 Mins"}
                      </span>
                    </div>
                  </div>

                  <div className={`col-span-4 border-r-2 ${borderStyle} flex flex-col items-center justify-center p-1.5 text-center divide-y ${borderStyle}/30`}>
                    <div className="py-0.5">
                      <span 
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, examTitle: e.target.innerText }))}
                        className="font-black uppercase tracking-wider text-xs block"
                      >
                        {paperConfig.examTitle || "ANNUAL EXAMINATION"}
                      </span>
                    </div>
                    <div className="py-0.5 text-xs font-black">
                      Total Marks: {actualCalculatedMarks}
                    </div>
                  </div>

                  <div className={`col-span-4 p-1.5 flex flex-col justify-center gap-1 text-[0.85em]`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Class:</span>
                      <span className="font-semibold">{gradeClass}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Subject:</span>
                      <span className="font-semibold">{subject}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Max Marks:</span>
                      <span className="font-black text-xs">{actualCalculatedMarks}</span>
                    </div>
                  </div>
                </div>

                {/* Syllabus / Topics Strip */}
                {paperConfig.syllabus && (
                  <div className={`border-t-2 ${borderStyle} p-1.5 text-xs font-semibold flex items-center gap-2`}>
                    <span className="font-bold shrink-0">Syllabus / Topics:</span>
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                      className="font-bold text-blue-900 border-b border-dashed border-current/50 cursor-text"
                      title="Click to edit test syllabus / topics"
                    >
                      {paperConfig.syllabus}
                    </span>
                  </div>
                )}
              </div>
            );

            if (headerLayout === 'Layout 1') {
              return (
                <div className="text-center mb-3 pb-2 border-b-2 border-current space-y-1 bg-white" style={commonStyle}>
                  <h1 
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                    className={`${headerFontClass}`}
                    style={{ fontSize: `${Math.min(headerFontSize, 32)}px`, color: activeColor }}
                  >
                    {academyName || "PRO TEST MAKER"}
                  </h1>
                  <p 
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                    className="text-xs italic opacity-80"
                  >
                    {tagline || "One Stop Test Solution"}
                  </p>

                  {/* Student Name & Roll No Row - Extra Spacious Above and Below */}
                  <div className="flex items-end justify-between text-xs font-semibold border-t border-b border-current/50 py-3.5 px-3 my-2.5 gap-3 sm:gap-4 w-full">
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

                  <div className="flex items-center justify-between text-xs font-semibold pt-1">
                    <span>Class: {gradeClass}</span>
                    <span>Subject: {subject}</span>
                    <span>Time Allowed: {timeAllowed || "60 Mins"}</span>
                    <span>Total Marks: {actualCalculatedMarks}</span>
                  </div>

                  {/* Syllabus / Topics Strip */}
                  {paperConfig.syllabus && (
                    <div className="text-xs font-semibold pt-1 border-t border-current/30 flex items-center justify-center gap-2">
                      <span className="font-bold">Syllabus / Topics:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="font-bold text-blue-900 border-b border-dashed border-current/50 cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            if (headerLayout === 'Layout 2') {
              return (
                <div className="mb-3 border-b-2 border-current pb-2.5 bg-white" style={commonStyle}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                        PTM
                      </div>
                      <div>
                        <h1 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                          className={`${headerFontClass}`}
                          style={{ fontSize: `${Math.min(headerFontSize, 28)}px`, color: activeColor }}
                        >
                          {academyName || "AL-ZIA SCIENCE ACADEMY"}
                        </h1>
                        <p 
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                          className="text-xs italic opacity-80"
                        >
                          {tagline || "One Stop Test Solution"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-xs font-bold space-y-0.5 border-l-2 border-current pl-4">
                      <div 
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, examTitle: e.target.innerText }))}
                        className="uppercase tracking-wide cursor-text"
                      >
                        {paperConfig.examTitle || "EXAMINATION ASSESSMENT"}
                      </div>
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

                  {/* Exam Details */}
                  <div className="flex items-center justify-between border-t border-current/20 mt-1.5 pt-1.5 text-xs font-bold opacity-90">
                    <span>Subject: {subject}</span>
                    <span>
                      Class: <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, gradeClass: e.target.innerText.trim() }))}
                        className="outline-none cursor-text font-bold"
                        title="Click to edit class"
                      >{gradeClass}</span>
                    </span>
                    <span>Time: {timeAllowed || "60 Mins"}</span>
                    <span>Max Marks: {actualCalculatedMarks}</span>
                  </div>

                  {/* Syllabus / Topics Strip */}
                  {paperConfig.syllabus && (
                    <div className="border-t border-current/20 pt-1.5 text-xs font-semibold flex items-center justify-center gap-2">
                      <span className="font-bold shrink-0">Syllabus:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="font-bold text-blue-900 border-b border-dashed border-current/50 cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            if (headerLayout === 'Layout 3') {
              return (
                <div className="mb-3 border-2 border-current bg-white" style={commonStyle}>
                  <div className="p-2 text-center border-b-2 border-current bg-slate-50/50">
                    <h1
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                      className={`${headerFontClass}`}
                      style={{ fontSize: `${Math.min(headerFontSize, 28)}px`, color: activeColor }}
                    >
                      {academyName || "PRO TEST MAKER"}
                    </h1>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                      className="text-xs font-semibold opacity-75"
                    >
                      {tagline || "One Stop Test Solution"}
                    </p>
                  </div>
                  <div className="grid grid-cols-12 divide-x-2 divide-current text-xs">
                    <div className="col-span-6 p-3 space-y-2.5 text-left">
                      <div className="flex items-end gap-2">
                        <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
                        <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
                      </div>
                      <div className="flex items-end justify-between gap-3 text-xs font-semibold">
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
                      <span className="uppercase text-xs tracking-wider">{paperConfig.examTitle || "ANNUAL ASSESSMENT TEST"}</span>
                      <span className="text-xs font-black mt-1">Total Marks: {actualCalculatedMarks}</span>
                    </div>
                    <div className="col-span-3 p-2 space-y-1 text-right font-semibold">
                      <div><span className="font-bold">Subject:</span> {subject}</div>
                      <div><span className="font-bold">Class:</span> {gradeClass}</div>
                      <div><span className="font-bold">Time:</span> {timeAllowed || "60 Mins"}</div>
                    </div>
                  </div>

                  {/* Syllabus / Topics Strip */}
                  {paperConfig.syllabus && (
                    <div className="border-t-2 border-current p-1.5 text-xs font-semibold flex items-center gap-2 bg-slate-50/50">
                      <span className="font-bold shrink-0">Syllabus / Topics:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="font-bold text-blue-900 border-b border-dashed border-current/50 cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            if (headerLayout === 'Layout 4') {
              return (
                <div className="mb-3 space-y-2 bg-white" style={commonStyle}>
                  <div className="flex items-baseline justify-between">
                    <h1
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                      className={`${headerFontClass}`}
                      style={{ fontSize: `${Math.min(headerFontSize, 26)}px`, color: activeColor }}
                    >
                      {academyName || "PRO TEST MAKER"}
                    </h1>
                    <span className="text-xs font-bold uppercase tracking-wider border-b-2 border-current pb-0.5">
                      {paperConfig.examTitle || "Class Test Examination"}
                    </span>
                  </div>

                  {/* Student Name & Roll No Row - Extra Spacious Above and Below */}
                  <div className="flex items-end justify-between text-xs font-semibold border-t border-b border-current/50 py-3.5 px-3 my-2 gap-3 sm:gap-4 w-full">
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

                  {/* Exam Details - Date Removed */}
                  <div className="flex items-center justify-between text-xs opacity-85 border-b border-current/30 py-1 font-semibold">
                    <span>Subject: {subject}</span>
                    <span>Class: {gradeClass}</span>
                    <span>Time: {timeAllowed || "60 Mins"}</span>
                    <span className="font-black">Total Marks: {actualCalculatedMarks}</span>
                  </div>

                  {/* Syllabus / Topics Strip */}
                  {paperConfig.syllabus && (
                    <div className="text-xs font-semibold flex items-center gap-2 pt-0.5">
                      <span className="font-bold shrink-0">Syllabus / Topics:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="font-bold text-blue-900 border-b border-dashed border-current/50 cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            if (headerLayout === 'Layout 5') {
              return (
                <div className="mb-3 border-2 border-current p-2.5 space-y-2 bg-white" style={commonStyle}>
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-full border-2 border-current flex items-center justify-center font-black text-[11px] shrink-0">
                      LOGO
                    </div>
                    <div className="text-center flex-1 px-3">
                      <h1
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                        className={`${headerFontClass}`}
                        style={{ fontSize: `${Math.min(headerFontSize, 28)}px`, color: activeColor }}
                      >
                        {academyName || "PRO TEST MAKER"}
                      </h1>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                        className="text-xs italic opacity-75"
                      >
                        {tagline || "One Stop Test Solution"}
                      </p>
                    </div>
                    <div className="w-11 h-11 rounded-full border-2 border-current flex items-center justify-center font-black text-[11px] shrink-0">
                      CREST
                    </div>
                  </div>

                  {/* Student Name Section - Extra Spacious Above and Below */}
                  <div className="border-t border-b border-current my-2.5 py-3.5 px-3 flex items-end justify-between text-xs font-semibold bg-slate-50/50 gap-3 sm:gap-4 w-full">
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

                  {/* Exam row */}
                  <div className="grid grid-cols-4 border-t border-current pt-1 text-xs text-center font-semibold">
                    <div><span className="font-bold">Class:</span> {gradeClass}</div>
                    <div><span className="font-bold">Subject:</span> {subject}</div>
                    <div><span className="font-bold">Time Allowed:</span> {timeAllowed || "60 Mins"}</div>
                    <div><span className="font-bold">Total Marks:</span> {actualCalculatedMarks}</div>
                  </div>

                  {/* Syllabus / Topics Strip */}
                  {paperConfig.syllabus && (
                    <div className="border-t border-current/40 pt-1 text-xs text-center font-semibold mt-1">
                      <span className="font-bold">Syllabus / Topics: </span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="font-bold text-blue-900 border-b border-dashed border-current/50 cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            if (headerLayout === 'Layout 6') {
              return (
                <div className="mb-3 border border-current p-2 text-xs space-y-1.5 bg-white" style={commonStyle}>
                  <div className="flex items-center justify-between border-b border-current/40 pb-1">
                    <div className="flex items-center gap-2">
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                        className="font-black text-sm uppercase"
                      >
                        {academyName || "PRO TEST MAKER"}
                      </span>
                      <span className="opacity-50">|</span>
                      <span className="font-semibold">{subject} ({gradeClass})</span>
                    </div>
                    <div className="flex items-center gap-3 font-bold">
                      <span>Time: {timeAllowed || "60m"}</span>
                      <span>Marks: {actualCalculatedMarks}</span>
                    </div>
                  </div>

                  {/* Spacious Candidate Bar without Date */}
                  <div className="flex items-end justify-between gap-3 sm:gap-4 py-3 px-1 my-1 w-full">
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
                  {paperConfig.syllabus && (
                    <div className="border-t border-current/30 pt-1 flex items-center gap-2 text-xs font-semibold">
                      <span className="font-bold shrink-0">Syllabus / Topics:</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="font-bold text-blue-900 truncate cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            if (headerLayout === 'Layout 7') {
              return (
                <div className="mb-3 border-4 border-current p-1.5 relative bg-white" style={commonStyle}>
                  <div className="border border-current p-2.5 text-center space-y-1.5">
                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-70">
                      • CENTRAL EXAMINATION COUNCIL •
                    </div>
                    <h1
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                      className={`${headerFontClass}`}
                      style={{ fontSize: `${Math.min(headerFontSize, 30)}px`, color: activeColor }}
                    >
                      {academyName || "PRO TEST MAKER"}
                    </h1>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                      className="text-xs italic opacity-85"
                    >
                      {tagline || "One Stop Test Solution"}
                    </p>

                    {/* Student Name and Candidate Info - Extra Spacious Above and Below, Date Removed */}
                    <div className="border-t border-b border-current py-3.5 px-3 my-2 flex items-end justify-between text-xs font-semibold gap-3 sm:gap-4 text-left bg-slate-50/30 w-full">
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

                    <div className="flex items-center justify-around border-t border-current pt-1.5 text-xs font-semibold">
                      <span>Class: {gradeClass}</span>
                      <span>Subject: {subject}</span>
                      <span>Time: {timeAllowed || "60 Mins"}</span>
                      <span>Marks: {actualCalculatedMarks}</span>
                    </div>

                    {/* Syllabus / Topics Strip */}
                    {paperConfig.syllabus && (
                      <div className="border-t border-current pt-1 text-xs font-semibold flex items-center justify-center gap-2">
                        <span className="font-bold">Syllabus / Topics:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                          className="font-bold text-blue-900 border-b border-dashed border-current/50 cursor-text"
                          title="Click to edit test syllabus / topics"
                        >
                          {paperConfig.syllabus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            if (headerLayout === 'Layout 8') {
              return (
                <div className="mb-3 border-2 border-current bg-white" style={commonStyle}>
                  <div className="p-2 border-b-2 border-current flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h1
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                        className={`${headerFontClass}`}
                        style={{ fontSize: `${Math.min(headerFontSize, 28)}px`, color: activeColor }}
                      >
                        {academyName || "PRO TEST MAKER"}
                      </h1>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                        className="text-xs opacity-80"
                      >
                        {tagline || "One Stop Test Solution"}
                      </p>
                      <div className="flex items-end gap-2 mt-3.5 pt-1 text-xs font-semibold">
                        <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Student Name:</span>
                        <span className="w-72 sm:w-96 max-w-full border-b-2 border-current/70 mb-0.5"></span>
                      </div>
                    </div>
                    <div className="border-2 border-current p-2 text-center text-xs shrink-0 bg-slate-50/70">
                      <div className="font-bold text-[10px] tracking-wider">CANDIDATE ROLL NO</div>
                      <div className="font-mono tracking-widest font-black text-sm mt-1">[ _ _ _ _ _ ]</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 divide-x divide-current text-xs p-1.5 font-semibold text-center bg-slate-50/40">
                    <div>Subject: {subject}</div>
                    <div>Class: {gradeClass}</div>
                    <div>Time: {timeAllowed || "60 Mins"}</div>
                    <div>Total Marks: {actualCalculatedMarks}</div>
                  </div>

                  {/* Syllabus Strip */}
                  {paperConfig.syllabus && (
                    <div className="border-t border-current p-1.5 text-xs font-semibold text-center bg-slate-50/60">
                      <span className="font-bold">Syllabus / Topics: </span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="font-bold text-blue-900 border-b border-dashed border-current/50 cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            // LAYOUT 9: Punjab Board Official BISE Style
            if (headerLayout === 'Layout 9') {
              return (
                <div className="mb-3 border-2 border-current bg-white" style={commonStyle}>
                  <div className="border-b-2 border-current p-2.5 text-center bg-slate-50/40">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-80">
                      <span>⭐</span>
                      <span>BOARD OF INTERMEDIATE & SECONDARY EDUCATION • STANDARD ASSESSMENT</span>
                      <span>⭐</span>
                    </div>
                    <h1
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                      className={`${headerFontClass} mt-1`}
                      style={{ fontSize: `${Math.min(headerFontSize, 29)}px`, color: activeColor }}
                    >
                      {academyName || "PRO TEST MAKER"}
                    </h1>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                      className="text-xs italic opacity-80 mt-0.5"
                    >
                      {tagline || "Affiliated Examination Series"}
                    </p>
                  </div>

                  {/* Deep spacious candidate block with ample writing room */}
                  <div className="border-b-2 border-current p-3.5 bg-white text-xs font-semibold w-full">
                    <div className="flex items-end gap-3">
                      <span className="font-bold shrink-0 whitespace-nowrap leading-none pb-0.5">Candidate Name:</span>
                      <span className="flex-1 border-b-2 border-current/70 mb-0.5 min-w-[40px]"></span>
                      <span className="font-bold shrink-0 ml-2 whitespace-nowrap leading-none pb-0.5">Roll No:</span>
                      <span className="w-24 sm:w-28 border-b-2 border-current/70 mb-0.5 text-center font-mono"></span>
                    </div>
                  </div>

                  {/* 4 Metadata Pillars */}
                  <div className="grid grid-cols-4 divide-x-2 divide-current text-xs font-bold text-center bg-slate-50/60 py-2">
                    <div><span className="opacity-70 font-normal">Subject:</span> {subject}</div>
                    <div><span className="opacity-70 font-normal">Class:</span> {gradeClass}</div>
                    <div><span className="opacity-70 font-normal">Time:</span> {timeAllowed || "60 Mins"}</div>
                    <div><span className="opacity-70 font-normal">Max Marks:</span> {actualCalculatedMarks}</div>
                  </div>

                  {paperConfig.syllabus && (
                    <div className="border-t-2 border-current p-1.5 text-xs font-semibold bg-white text-center">
                      <span className="font-bold shrink-0">Syllabus / Topics: </span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="text-blue-900 font-bold border-b border-dashed border-current/50 cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            // LAYOUT 10: Royal Crown Academy Luxury
            if (headerLayout === 'Layout 10') {
              return (
                <div className="mb-3 border-2 border-current p-1.5 bg-white relative" style={commonStyle}>
                  <div className="border border-current p-3 text-center space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-base opacity-75">✦ 👑 ✦</span>
                      <h1
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                        className={`${headerFontClass}`}
                        style={{ fontSize: `${Math.min(headerFontSize, 30)}px`, color: activeColor }}
                      >
                        {academyName || "PRO TEST MAKER"}
                      </h1>
                      <span className="text-base opacity-75">✦ 👑 ✦</span>
                    </div>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                      className="text-xs italic opacity-85 font-serif"
                    >
                      {tagline || "One Stop Test Solution"}
                    </p>

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
                      <span className="px-2 py-0.5 border border-current rounded-md">
                        Class: <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setPaperConfig(prev => ({ ...prev, gradeClass: e.target.innerText.trim() }))}
                          className="outline-none cursor-text font-bold"
                          title="Click to edit class"
                        >{gradeClass}</span>
                      </span>
                      <span className="px-2 py-0.5 border border-current rounded-md">Subject: {subject}</span>
                      <span className="px-2 py-0.5 border border-current rounded-md">Time: {timeAllowed || "60 Mins"}</span>
                      <span className="px-2 py-0.5 border border-current rounded-md">Marks: {actualCalculatedMarks}</span>
                    </div>

                    {paperConfig.syllabus && (
                      <div className="border-t border-current pt-1.5 text-xs font-semibold flex items-center justify-center gap-2">
                        <span className="font-bold shrink-0">Syllabus:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                          className="text-blue-900 font-bold border-b border-dashed border-current/50 cursor-text"
                          title="Click to edit test syllabus / topics"
                        >
                          {paperConfig.syllabus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // LAYOUT 11: Modern Cambridge Minimalist
            if (headerLayout === 'Layout 11') {
              return (
                <div className="mb-3 border-b-2 border-current pb-2 space-y-2 bg-white" style={commonStyle}>
                  <div className="flex items-start justify-between gap-4 pb-2 border-b border-current/40">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-60">INTERNATIONAL ASSESSMENT SERIES</div>
                      <h1
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                        className={`${headerFontClass} mt-0.5`}
                        style={{ fontSize: `${Math.min(headerFontSize, 28)}px`, color: activeColor }}
                      >
                        {academyName || "PRO TEST MAKER"}
                      </h1>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                        className="text-xs italic opacity-80"
                      >
                        {tagline || "One Stop Test Solution"}
                      </p>
                    </div>
                    <div className="border-2 border-current p-2 text-right text-xs shrink-0 font-bold space-y-0.5 bg-slate-50">
                      <div className="uppercase tracking-wider">PAPER 1 • THEORY</div>
                      <div className="text-sm font-black">{actualCalculatedMarks} MARKS</div>
                      <div className="text-[10px] opacity-75">Time: {timeAllowed || "60 Mins"}</div>
                    </div>
                  </div>

                  {/* Wide Candidate identification row with deep writing space */}
                  <div className="py-3.5 px-1 flex items-end justify-between text-xs font-semibold gap-3 sm:gap-4 w-full">
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
                    <span>Subject: {subject}</span>
                    <span>Class: {gradeClass}</span>
                    {paperConfig.syllabus && (
                      <span className="flex items-center gap-1">
                        <span className="font-bold">Syllabus:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                          className="text-blue-900 font-bold border-b border-dashed border-current/50 cursor-text"
                          title="Click to edit test syllabus / topics"
                        >
                          {paperConfig.syllabus}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              );
            }

            // LAYOUT 12: Dual Boxed Institutional Grid
            if (headerLayout === 'Layout 12') {
              return (
                <div className="mb-3 grid grid-cols-12 border-2 border-current text-xs bg-white" style={commonStyle}>
                  <div className="col-span-7 p-3 border-r-2 border-current space-y-1.5">
                    <h1
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                      className={`${headerFontClass}`}
                      style={{ fontSize: `${Math.min(headerFontSize, 26)}px`, color: activeColor }}
                    >
                      {academyName || "PRO TEST MAKER"}
                    </h1>
                    <p
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                      className="text-xs italic opacity-80"
                    >
                      {tagline || "One Stop Test Solution"}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold border-t border-current/40">
                      <div><span className="font-bold">Subject:</span> {subject}</div>
                      <div><span className="font-bold">Class:</span> {gradeClass}</div>
                      <div><span className="font-bold">Time:</span> {timeAllowed || "60 Mins"}</div>
                      <div><span className="font-bold">Total Marks:</span> {actualCalculatedMarks}</div>
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

                  {paperConfig.syllabus && (
                    <div className="col-span-12 border-t-2 border-current p-1.5 text-xs font-semibold text-center bg-slate-50/70">
                      <span className="font-bold">Syllabus / Topics: </span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setPaperConfig(prev => ({ ...prev, syllabus: e.target.innerText }))}
                        className="text-blue-900 font-bold border-b border-dashed border-current/50 cursor-text"
                        title="Click to edit test syllabus / topics"
                      >
                        {paperConfig.syllabus}
                      </span>
                    </div>
                  )}
                </div>
              );
            }

            // DEFAULT: LAYOUT 13 (Creative Developers Dashed Border Header)
            return (
              <div className="mb-3 border-2 border-dashed border-current bg-white p-2" style={commonStyle}>
                <div className="text-center pb-2.5 border-b border-dashed border-current flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 via-green-500 to-amber-400 p-0.5 shadow-2xs flex items-center justify-center shrink-0">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center font-black text-xs text-slate-800">
                        🎨
                      </div>
                    </div>
                    <h1
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setPaperConfig(prev => ({ ...prev, academyName: e.target.innerText }))}
                      className={`${headerFontClass} tracking-wider uppercase leading-none`}
                      style={{ fontSize: `${Math.min(headerFontSize, 32)}px`, color: activeColor }}
                    >
                      {academyName || "PRO TEST MAKER"}
                    </h1>
                  </div>
                  <p
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => setPaperConfig(prev => ({ ...prev, tagline: e.target.innerText }))}
                    className="text-[0.95em] italic font-serif opacity-75 mt-1 tracking-wide"
                  >
                    {tagline || "One Stop Test Solution"}
                  </p>
                </div>
                {renderThreeColBox("border-current")}
              </div>
            );
          })()}
          </header>

          {/* GENERAL INSTRUCTIONS (Only if enabled in config) */}
          {showInstructions && instructions && instructions.length > 0 && (
            <div className="mb-2 bg-slate-50 p-1.5 rounded border border-slate-300 text-[0.85em]">
              <h4 className="font-bold text-slate-900 mb-0.5 uppercase tracking-wider text-[0.85em]">
                {isUrdu ? 'عام ہدایات:' : 'General Instructions:'}
              </h4>
              <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                {instructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ul>
            </div>
          )}

          {/* QUESTION SECTIONS WITH DYNAMIC GAP RANGE SLIDER STYLING */}
          {(() => {
            const activeMcqs = currentActiveData?.mcqs || [];
            const activeShortQuestions = currentActiveData?.shortQuestions || [];
            const activeLongQuestions = currentActiveData?.longQuestions || [];

            return (
              <div className="questions-container flex flex-col" style={{ gap: `${Math.max(2, questionGap)}px` }}>
                
                {/* SECTION A: MCQs */}
                {activeMcqs.length > 0 && (
                  <div className="section-block">
                    <div className="section-title-wrapper flex flex-wrap items-center justify-between border-b-2 border-slate-900 pb-0.5 mb-1 gap-2">
                      <h3 className="section-title text-[0.9em] font-bold text-slate-900 uppercase">
                        {getSectionTitle('mcqs')}
                      </h3>
                      <span className="text-[0.85em] font-bold text-slate-900 shrink-0 whitespace-nowrap">
                        [{activeMcqs.length} x {activeMcqs[0]?.marks || 1} = {activeMcqs.reduce((acc, q) => acc + (q.marks || 1), 0)} Marks]
                      </span>
                    </div>

                    {/* Questions List */}
                    {(() => {
                      const renderMcqCard = (q, idx) => (
                        <div
                          key={q.id || idx}
                          className={`question-card relative group hover:bg-slate-50/90 rounded transition-all break-inside-avoid page-break-inside-avoid ${
                            activeMcqLayout === '2 Columns' ? 'p-1.5 rounded-md border border-slate-200/50 bg-white/40' : ''
                          }`}
                          style={{ padding: activeMcqLayout === '2 Columns' ? '4px 6px' : `${Math.min(questionGap, 1)}px 0` }}
                        >
                          {/* Action Toolbar on Hover */}
                          <div className="no-print absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white border border-slate-300 rounded shadow px-1 py-0.5 z-10 transition-opacity">
                            <button onClick={() => openSwapModal('mcqs', idx, q)} title="Sawal Badal Dein (Swap MCQ)" className="p-1 hover:text-amber-600 flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200"><RefreshCw className="w-2.5 h-2.5" /> Swap</button>
                            <button onClick={() => moveQuestion('mcqs', idx, -1)} title="Move Up" className="p-1 hover:text-indigo-600"><ArrowUp className="w-3 h-3" /></button>
                            <button onClick={() => moveQuestion('mcqs', idx, 1)} title="Move Down" className="p-1 hover:text-indigo-600"><ArrowDown className="w-3 h-3" /></button>
                            <button onClick={() => deleteQuestion('mcqs', idx)} title="Delete Question" className="p-1 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                          </div>

                          {/* Clean Side-by-Side Question Prompt (English Left, Urdu Right) */}
                          {renderQuestionPrompt(q.question, idx, 'mcqs')}

                          {/* Dynamic MCQ Options Layout with Ultra-Compact Option Gaps */}
                          <div
                            className={`grid items-start text-[0.95em] text-slate-800 ${
                              activeMcqLayout === '2 Columns'
                                ? (mcqCols === 1 ? 'grid-cols-1' : 'grid-cols-2')
                                : (mcqCols === 4 ? 'grid-cols-4' : mcqCols === 1 ? 'grid-cols-1' : 'grid-cols-2')
                            }`}
                            style={{ gap: `${Math.min(questionGap, 2)}px 8px`, marginTop: `${Math.min(questionGap, 1)}px` }}
                          >
                            {q.options.map((opt, oIdx) => (
                              <React.Fragment key={oIdx}>
                                {renderOptionChoice(opt, oIdx, idx, q)}
                              </React.Fragment>
                            ))}
                          </div>

                          {/* Teacher Mode: Show Detected Correct Key */}
                          {showTeacherMcqKey && (
                            <div className="no-print mt-1 p-1 bg-emerald-50 border border-emerald-200 rounded text-[11px] flex flex-wrap items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                                <span>🔑 Correct Key:</span>
                                <span className={`px-1.5 py-0.2 rounded font-black text-xs ${
                                  getMcqCorrectIndex(q) >= 0 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                                }`}>
                                  {getMcqCorrectIndex(q) >= 0 ? `Option (${['A', 'B', 'C', 'D'][getMcqCorrectIndex(q)]})` : 'Not Set'}
                                </span>
                                {getMcqCorrectIndex(q) >= 0 && q.options?.[getMcqCorrectIndex(q)] && (
                                  <span className="font-semibold text-slate-700 italic">
                                    "{q.options[getMcqCorrectIndex(q)]}"
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 italic">
                                (Click "Mark" on any option to set as correct answer)
                              </span>
                            </div>
                          )}
                        </div>
                      );

                      if (contentFormat === 'table') {
                        return (
                          <div className="w-full my-1 board-table-wrapper">
                            <table 
                              className="board-paper-table text-[0.95em]"
                              style={{ width: '100%', maxWidth: '100%', tableLayout: 'fixed' }}
                            >
                              <colgroup>
                                <col style={{ width: '5%' }} />
                                <col style={{ width: '37%' }} />
                                <col style={{ width: '14.5%' }} />
                                <col style={{ width: '14.5%' }} />
                                <col style={{ width: '14.5%' }} />
                                <col style={{ width: '14.5%' }} />
                              </colgroup>
                              <thead>
                                <tr>
                                  <th style={{ width: '5%' }}>
                                    <div className="board-cell-inner text-center">Q.#</div>
                                  </th>
                                  <th style={{ width: '37%' }}>
                                    <div className="board-cell-inner text-left pl-1">
                                      {isBlend ? 'Question Statement / سوال' : isUrdu ? 'سوال' : 'Question Statement'}
                                    </div>
                                  </th>
                                  <th style={{ width: '14.5%' }}>
                                    <div className="board-cell-inner text-center">(A) الف</div>
                                  </th>
                                  <th style={{ width: '14.5%' }}>
                                    <div className="board-cell-inner text-center">(B) ب</div>
                                  </th>
                                  <th style={{ width: '14.5%' }}>
                                    <div className="board-cell-inner text-center">(C) ج</div>
                                  </th>
                                  <th style={{ width: '14.5%' }}>
                                    <div className="board-cell-inner text-center">(D) د</div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {activeMcqs.map((q, idx) => (
                                  <tr key={q.id || idx} className="relative group hover:bg-slate-50/80 transition-colors">
                                    <td className="text-center font-bold text-slate-900 bg-slate-50/50 align-middle">
                                      <div className="board-cell-inner text-center">
                                        <span>{idx + 1}</span>
                                        {/* Action Toolbar on Hover */}
                                        <div className="no-print absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white border border-slate-300 rounded shadow-md px-1 py-0.5 z-20 transition-opacity">
                                          <button onClick={() => openSwapModal('mcqs', idx, q)} title="Sawal Badal Dein (Swap MCQ)" className="p-1 hover:text-amber-600 flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200"><RefreshCw className="w-2.5 h-2.5" /> Swap</button>
                                          <button onClick={() => moveQuestion('mcqs', idx, -1)} title="Move Up" className="p-1 hover:text-indigo-600"><ArrowUp className="w-3 h-3" /></button>
                                          <button onClick={() => moveQuestion('mcqs', idx, 1)} title="Move Down" className="p-1 hover:text-indigo-600"><ArrowDown className="w-3 h-3" /></button>
                                          <button onClick={() => deleteQuestion('mcqs', idx)} title="Delete Question" className="p-1 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="align-middle">
                                      <div className="board-cell-inner text-left">
                                        {renderQuestionPromptWithoutNum(q.question, idx, 'mcqs')}
                                      </div>
                                    </td>
                                    <td className="align-middle text-center">
                                      <div className="board-cell-inner text-center">
                                        {renderTableOptionContent(q.options?.[0] || '', 0, idx, q)}
                                      </div>
                                    </td>
                                    <td className="align-middle text-center">
                                      <div className="board-cell-inner text-center">
                                        {renderTableOptionContent(q.options?.[1] || '', 1, idx, q)}
                                      </div>
                                    </td>
                                    <td className="align-middle text-center">
                                      <div className="board-cell-inner text-center">
                                        {renderTableOptionContent(q.options?.[2] || '', 2, idx, q)}
                                      </div>
                                    </td>
                                    <td className="align-middle text-center">
                                      <div className="board-cell-inner text-center">
                                        {renderTableOptionContent(q.options?.[3] || '', 3, idx, q)}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        );
                      }

                      if (activeMcqLayout === '2 Columns') {
                        return (
                          <div className="questions-list grid grid-cols-2 print:grid-cols-2 gap-x-5 items-start">
                            {/* Left Column: Odd questions (Q1, Q3, Q5...) */}
                            <div className="flex flex-col" style={{ gap: `${Math.max(questionGap, 4)}px` }}>
                              {activeMcqs.map((q, idx) => idx % 2 === 0 ? renderMcqCard(q, idx) : null)}
                            </div>
                            {/* Right Column: Even questions (Q2, Q4, Q6...) */}
                            <div className="flex flex-col" style={{ gap: `${Math.max(questionGap, 4)}px` }}>
                              {activeMcqs.map((q, idx) => idx % 2 === 1 ? renderMcqCard(q, idx) : null)}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div 
                          className="questions-list flex flex-col"
                          style={{ gap: `${questionGap}px` }}
                        >
                          {activeMcqs.map((q, idx) => renderMcqCard(q, idx))}
                        </div>
                      );
                    })()}

                    {/* Teacher Quick Marking Grid at bottom of MCQs section */}
                    {showTeacherMcqKey && activeMcqs.length > 0 && (
                      <div className="no-print mt-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-xl shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1">
                              <Key className="w-3.5 h-3.5 text-emerald-700" /> MCQs Answer Key (Teacher Copy)
                            </span>
                            <span className="text-[10px] bg-emerald-200 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                              {activeMcqs.length} Questions
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowAnswerKeyModal(true)}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <span>Full Key Sheet Table 📋</span>
                          </button>
                        </div>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 text-center text-xs">
                          {activeMcqs.map((mq, mIdx) => {
                            const cIdx = getMcqCorrectIndex(mq);
                            const letter = cIdx >= 0 ? ['A', 'B', 'C', 'D'][cIdx] : '?';
                            return (
                              <div key={mIdx} className="bg-white border border-emerald-200 rounded p-1 shadow-2xs">
                                <div className="text-[10px] text-slate-500 font-bold">Q{mIdx + 1}</div>
                                <div className={`font-black text-xs ${letter !== '?' ? 'text-emerald-700' : 'text-amber-600'}`}>
                                  {letter}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Add MCQ button */}
                    <div className="no-print mt-1 text-center">
                      <button
                        onClick={() => onAddQuestion('mcqs')}
                        className="px-3 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold border border-slate-300 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add MCQ
                      </button>
                    </div>

                  </div>
                )}

                {/* SECTION B: SHORT QUESTIONS */}
                {activeShortQuestions.length > 0 && (
                  <div className="section-block">
                    <div className="section-title-wrapper flex flex-wrap items-center justify-between border-b-2 border-slate-900 pb-0.5 mb-1 gap-2">
                      <h3 className="section-title text-[0.9em] font-bold text-slate-900 uppercase">
                        {getSectionTitle('short')}
                      </h3>
                      <span className="text-[0.85em] font-bold text-slate-900 shrink-0 whitespace-nowrap">
                        [{activeShortQuestions.length} x {activeShortQuestions[0]?.marks || 3} = {activeShortQuestions.reduce((acc, q) => acc + (q.marks || 3), 0)} Marks]
                      </span>
                    </div>

                    {contentFormat === 'table' ? (
                      <div className="w-full my-1 board-table-wrapper">
                        <table 
                          className="board-paper-table text-[0.95em]"
                          style={{ width: '100%', maxWidth: '100%', tableLayout: 'fixed' }}
                        >
                          <colgroup>
                            <col style={{ width: '6.5%' }} />
                            <col style={{ width: '84.5%' }} />
                            <col style={{ width: '9%' }} />
                          </colgroup>
                          <thead>
                            <tr>
                              <th style={{ width: '6.5%' }}>
                                <div className="board-cell-inner text-center">Q.#</div>
                              </th>
                              <th style={{ width: '84.5%' }}>
                                <div className="board-cell-inner text-left pl-1">
                                  {isBlend ? 'Short Question Statement / مختصر سوال' : isUrdu ? 'مختصر سوال' : 'Short Question Statement'}
                                </div>
                              </th>
                              <th style={{ width: '9%' }}>
                                <div className="board-cell-inner text-center">Marks</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeShortQuestions.map((q, idx) => (
                              <tr key={q.id || idx} className="relative group hover:bg-slate-50/80 transition-colors">
                                <td className="text-center font-bold text-slate-900 bg-slate-50/50 align-middle">
                                  <div className="board-cell-inner text-center">
                                    <span>({toRoman(idx + 1)})</span>
                                    {/* Action Toolbar on Hover */}
                                    <div className="no-print absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white border border-slate-300 rounded shadow-md px-1 py-0.5 z-20 transition-opacity">
                                      <button onClick={() => openSwapModal('shortQuestions', idx, q)} title="Sawal Badal Dein (Swap Short Question)" className="p-1 hover:text-amber-600 flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200"><RefreshCw className="w-2.5 h-2.5" /> Swap</button>
                                      <button onClick={() => moveQuestion('shortQuestions', idx, -1)} title="Move Up" className="p-1 hover:text-indigo-600"><ArrowUp className="w-3 h-3" /></button>
                                      <button onClick={() => moveQuestion('shortQuestions', idx, 1)} title="Move Down" className="p-1 hover:text-indigo-600"><ArrowDown className="w-3 h-3" /></button>
                                      <button onClick={() => deleteQuestion('shortQuestions', idx)} title="Delete Question" className="p-1 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">
                                  <div className="board-cell-inner text-left">
                                    {renderQuestionPromptWithoutNum(q.question, idx, 'shortQuestions')}
                                    {/* Teacher Answer Key */}
                                    {showAnswerKey && q.answerKey && (
                                      <div className="mt-1 p-1 bg-emerald-50 border border-emerald-300 rounded text-[0.85em] text-emerald-900">
                                        <span className="font-bold text-emerald-800">Model Answer: </span>
                                        {q.answerKey}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="text-center font-bold text-slate-900 align-middle">
                                  <div className="board-cell-inner text-center">
                                    {q.marks || 3}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="questions-list flex flex-col" style={{ gap: `${questionGap}px` }}>
                        {activeShortQuestions.map((q, idx) => (
                          <div
                            key={q.id || idx}
                            className="question-card relative group hover:bg-slate-50/90 rounded transition-all"
                            style={{ padding: `${Math.min(questionGap, 2)}px 0` }}
                          >
                            
                            {/* Action Toolbar on Hover */}
                            <div className="no-print absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white border border-slate-300 rounded shadow px-1 py-0.5 z-10 transition-opacity">
                              <button onClick={() => openSwapModal('shortQuestions', idx, q)} title="Sawal Badal Dein (Swap Short Question)" className="p-1 hover:text-amber-600 flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200"><RefreshCw className="w-2.5 h-2.5" /> Swap</button>
                              <button onClick={() => moveQuestion('shortQuestions', idx, -1)} title="Move Up" className="p-1 hover:text-indigo-600"><ArrowUp className="w-3 h-3" /></button>
                              <button onClick={() => moveQuestion('shortQuestions', idx, 1)} title="Move Down" className="p-1 hover:text-indigo-600"><ArrowDown className="w-3 h-3" /></button>
                              <button onClick={() => deleteQuestion('shortQuestions', idx)} title="Delete Question" className="p-1 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                            </div>

                            {/* Side-by-Side Question Prompt */}
                            {renderQuestionPrompt(q.question, idx, 'shortQuestions')}

                            {/* Blank Student Answer Lines */}
                            {showAnswerLines && (
                              <div className="answer-ruled-lines">
                                <div className="answer-ruled-line"></div>
                                <div className="answer-ruled-line"></div>
                                <div className="answer-ruled-line"></div>
                              </div>
                            )}

                            {/* Teacher Answer Key */}
                            {showAnswerKey && q.answerKey && (
                              <div className="mt-1 p-1 bg-emerald-50 border border-emerald-300 rounded text-[0.85em] text-emerald-900">
                                <span className="font-bold text-emerald-800">Model Answer: </span>
                                {q.answerKey}
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Short Question button */}
                    <div className="no-print mt-1 text-center">
                      <button
                        onClick={() => onAddQuestion('shortQuestions')}
                        className="px-3 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold border border-slate-300 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Short Question
                      </button>
                    </div>

                  </div>
                )}

                {/* SECTION C: ESSAY & COMPREHENSIVE QUESTIONS */}
                {activeLongQuestions.length > 0 && (
                  <div className="section-block">
                    <div className="section-title-wrapper flex flex-wrap items-center justify-between border-b-2 border-slate-900 pb-0.5 mb-1 gap-2">
                      <h3 className="section-title text-[0.9em] font-bold text-slate-900 uppercase">
                        {getSectionTitle('long')}
                      </h3>
                      <span className="text-[0.85em] font-bold text-slate-900 shrink-0 whitespace-nowrap">
                        [{activeLongQuestions.length} x {activeLongQuestions[0]?.marks || 5} = {activeLongQuestions.reduce((acc, q) => acc + (q.marks || 5), 0)} Marks]
                      </span>
                    </div>

                    {contentFormat === 'table' ? (
                      <div className="w-full my-1 board-table-wrapper">
                        <table 
                          className="board-paper-table text-[0.95em]"
                          style={{ width: '100%', maxWidth: '100%', tableLayout: 'fixed' }}
                        >
                          <colgroup>
                            <col style={{ width: '6.5%' }} />
                            <col style={{ width: '84.5%' }} />
                            <col style={{ width: '9%' }} />
                          </colgroup>
                          <thead>
                            <tr>
                              <th style={{ width: '6.5%' }}>
                                <div className="board-cell-inner text-center">Q.#</div>
                              </th>
                              <th style={{ width: '84.5%' }}>
                                <div className="board-cell-inner text-left pl-1">
                                  {isBlend ? 'Comprehensive Question Statement / تفصیلی سوال' : isUrdu ? 'تفصیلی سوال' : 'Comprehensive Question Statement'}
                                </div>
                              </th>
                              <th style={{ width: '9%' }}>
                                <div className="board-cell-inner text-center">Marks</div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeLongQuestions.map((q, idx) => (
                              <tr key={q.id || idx} className="relative group hover:bg-slate-50/80 transition-colors">
                                <td className="text-center font-bold text-slate-900 bg-slate-50/50 align-middle">
                                  <div className="board-cell-inner text-center">
                                    <span>Q.{activeShortQuestions.length > 0 ? (idx + 3) : (idx + 1)}</span>
                                    {/* Action Toolbar on Hover */}
                                    <div className="no-print absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white border border-slate-300 rounded shadow-md px-1 py-0.5 z-20 transition-opacity">
                                      <button onClick={() => openSwapModal('longQuestions', idx, q)} title="Sawal Badal Dein (Swap Long Question)" className="p-1 hover:text-amber-600 flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200"><RefreshCw className="w-2.5 h-2.5" /> Swap</button>
                                      <button onClick={() => moveQuestion('longQuestions', idx, -1)} title="Move Up" className="p-1 hover:text-indigo-600"><ArrowUp className="w-3 h-3" /></button>
                                      <button onClick={() => moveQuestion('longQuestions', idx, 1)} title="Move Down" className="p-1 hover:text-indigo-600"><ArrowDown className="w-3 h-3" /></button>
                                      <button onClick={() => deleteQuestion('longQuestions', idx)} title="Delete Question" className="p-1 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                                    </div>
                                  </div>
                                </td>
                                <td className="align-middle">
                                  <div className="board-cell-inner text-left">
                                    {renderQuestionPromptWithoutNum(q.question, idx, 'longQuestions')}
                                    {/* Sub Parts */}
                                    {q.subParts && q.subParts.length > 0 && (
                                      <div className="space-y-0.5 text-[0.9em] text-slate-800 mt-1 pl-2 border-l-2 border-slate-200">
                                        {q.subParts.map((sub, sIdx) => {
                                          const { eng, urdu } = parseQuestionText(sub);
                                          return (
                                            <div key={sIdx} className="flex justify-between items-center italic">
                                              <span>{eng}</span>
                                              {urdu && <span className="font-serif-urdu font-bold text-right" dir="rtl">{urdu}</span>}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                    {/* Teacher Answer Key */}
                                    {showAnswerKey && q.answerKey && (
                                      <div className="mt-1 p-1 bg-emerald-50 border border-emerald-300 rounded text-[0.85em] text-emerald-900">
                                        <span className="font-bold text-emerald-800">Evaluation Rubric: </span>
                                        {q.answerKey}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="text-center font-bold text-slate-900 align-middle">
                                  <div className="board-cell-inner text-center">
                                    {q.marks || 5}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="questions-list flex flex-col" style={{ gap: `${questionGap}px` }}>
                        {activeLongQuestions.map((q, idx) => (
                          <div
                            key={q.id || idx}
                            className="question-card relative group hover:bg-slate-50/90 rounded transition-all"
                            style={{ padding: `${Math.min(questionGap, 2)}px 0` }}
                          >
                            
                            {/* Action Toolbar on Hover */}
                            <div className="no-print absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 flex items-center gap-1 bg-white border border-slate-300 rounded shadow px-1 py-0.5 z-10 transition-opacity">
                              <button onClick={() => openSwapModal('longQuestions', idx, q)} title="Sawal Badal Dein (Swap Long Question)" className="p-1 hover:text-amber-600 flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1 rounded border border-amber-200"><RefreshCw className="w-2.5 h-2.5" /> Swap</button>
                              <button onClick={() => moveQuestion('longQuestions', idx, -1)} title="Move Up" className="p-1 hover:text-indigo-600"><ArrowUp className="w-3 h-3" /></button>
                              <button onClick={() => moveQuestion('longQuestions', idx, 1)} title="Move Down" className="p-1 hover:text-indigo-600"><ArrowDown className="w-3 h-3" /></button>
                              <button onClick={() => deleteQuestion('longQuestions', idx)} title="Delete Question" className="p-1 hover:text-rose-600"><Trash2 className="w-3 h-3" /></button>
                            </div>

                            {/* Side-by-Side Question Prompt */}
                            {renderQuestionPrompt(q.question, idx, 'longQuestions')}

                            {/* Sub Parts */}
                            {q.subParts && q.subParts.length > 0 && (
                              <div className="space-y-0.5 text-[0.9em] text-slate-800 mt-0.5">
                                {q.subParts.map((sub, sIdx) => {
                                  const { eng, urdu } = parseQuestionText(sub);
                                  return (
                                    <div key={sIdx} className="flex justify-between items-center italic">
                                      <span>{eng}</span>
                                      {urdu && <span className="font-serif-urdu font-bold text-right" dir="rtl">{urdu}</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Blank Student Answer Lines */}
                            {showAnswerLines && (
                              <div className="answer-ruled-lines">
                                <div className="answer-ruled-line"></div>
                                <div className="answer-ruled-line"></div>
                                <div className="answer-ruled-line"></div>
                                <div className="answer-ruled-line"></div>
                              </div>
                            )}

                            {/* Teacher Answer Key */}
                            {showAnswerKey && q.answerKey && (
                              <div className="mt-1 p-1 bg-emerald-50 border border-emerald-300 rounded text-[0.85em] text-emerald-900">
                                <span className="font-bold text-emerald-800">Evaluation Rubric: </span>
                                {q.answerKey}
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Long Question button */}
                    <div className="no-print mt-1 text-center">
                      <button
                        onClick={() => onAddQuestion('longQuestions')}
                        className="px-3 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold border border-slate-300 inline-flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Long Question
                      </button>
                    </div>

                  </div>
                )}

                {/* Quick Add Section Toolbar (no-print) when any section is empty */}
                {(activeMcqs.length === 0 || activeShortQuestions.length === 0 || activeLongQuestions.length === 0) && (
                  <div className="no-print mt-3 pt-2.5 border-t border-dashed border-slate-300 flex flex-wrap items-center justify-center gap-2 text-xs">
                    <span className="font-bold text-slate-500 mr-1">+ Paper Section Shamil Karein:</span>
                    {activeMcqs.length === 0 && (
                      <button
                        type="button"
                        onClick={() => onAddQuestion && onAddQuestion('mcqs')}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> + Add MCQs (Section A)
                      </button>
                    )}
                    {activeShortQuestions.length === 0 && (
                      <button
                        type="button"
                        onClick={() => onAddQuestion && onAddQuestion('shortQuestions')}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> + Add Short Questions (Section B)
                      </button>
                    )}
                    {activeLongQuestions.length === 0 && (
                      <button
                        type="button"
                        onClick={() => onAddQuestion && onAddQuestion('longQuestions')}
                        className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> + Add Long Questions (Section C)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onAddQuestion && onAddQuestion('all')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-md font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Pick Questions Manually
                    </button>
                  </div>
                )}

              </div>
            );
          })()}

          {/* FOOTER OF PAPER */}
          <footer className="mt-4 pt-1.5 border-t border-slate-300 text-center text-[0.75em] text-slate-500 font-medium flex justify-between items-center">
            <span>{isUrdu ? '*** ختم شد ***' : '*** END OF EXAMINATION PAPER ***'}</span>
            <span>Prepared with PaperGen AI Pro</span>
          </footer>

        </div>
      </div>
    </div>

      {/* BOTTOM PAPER ACTION CONTROLS (CONVENIENT FOR SCROLLED VIEW) */}
      <div className="no-print w-full flex items-center justify-center gap-3 pt-2 pb-4 flex-wrap">
        <button
          type="button"
          onClick={() => setShowWhatsAppModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          title="1-Click WhatsApp Share (پیپر اور سلیبس واٹس ایپ پر شیئر کریں)"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Share</span>
        </button>
        <button
          type="button"
          onClick={handlePrintPaper}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          title="Download PDF / Print Paper (Ctrl+P) - Saves with Class, Chapter & Topic in filename"
        >
          <Printer className="w-4 h-4" />
          <span>Download PDF / Print</span>
        </button>
        <button
          type="button"
          onClick={onExportDocx}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          title="Download editable Microsoft Word (.doc) paper - Saves with Class, Chapter & Topic in filename"
        >
          <FileText className="w-4 h-4" />
          <span>Download Word (.doc)</span>
        </button>
      </div>

      {/* SWAP QUESTION MODAL (POPUP) */}
      <SwapQuestionModal
        isOpen={swapModalState.isOpen}
        onClose={() => setSwapModalState(prev => ({ ...prev, isOpen: false }))}
        sectionKey={swapModalState.sectionKey}
        questionIndex={swapModalState.questionIndex}
        currentQuestion={swapModalState.currentQuestion}
        availableQuestions={availableBankQuestions[swapModalState.sectionKey] || []}
        onSelectReplacement={handleApplyReplacement}
      />

      {/* TEACHER MCQs ANSWER KEY MODAL */}
      <TeacherAnswerKeyModal
        isOpen={showAnswerKeyModal}
        onClose={() => setShowAnswerKeyModal(false)}
        paperConfig={paperConfig}
        mcqs={currentActiveData?.mcqs || []}
        isMultiSet={isMultiSetEnabled}
        multiSets={multiSets}
        activeSet={activeSetKey}
      />

      {/* 1-CLICK WHATSAPP SHARE MODAL */}
      <WhatsAppShareModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        paperConfig={paperConfig}
        paperData={currentActiveData}
        activeSet={activeSetKey}
        isMultiSet={isMultiSetEnabled}
      />

    </div>
  );
}
