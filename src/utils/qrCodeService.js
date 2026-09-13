import QRCode from 'qrcode';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { sanitizeSafeId, sanitizeText } from './securitySanitizer';

// Generate or retrieve persistent paperId
export function getOrCreatePaperId(paperData) {
  if (paperData?.id && !paperData.id.startsWith('draft_')) {
    return sanitizeSafeId(paperData.id);
  }
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ptm_${timestamp}_${random}`;
}

// Upload paper and solutions to cloud for QR scan access
export async function syncPaperForQrAccess(paperId, paperData, paperConfig) {
  const safeId = sanitizeSafeId(paperId);
  if (!safeId || !paperData) return null;

  const payload = {
    id: safeId,
    config: {
      examTitle: sanitizeText(paperConfig.examTitle || 'Test Paper'),
      academyName: sanitizeText(paperConfig.academyName || paperConfig.instituteName || ''),
      instituteName: sanitizeText(paperConfig.instituteName || paperConfig.academyName || ''),
      subject: sanitizeText(paperConfig.subject || ''),
      gradeClass: sanitizeText(paperConfig.gradeClass || ''),
      syllabus: sanitizeText(paperConfig.syllabus || ''),
      totalMarks: paperConfig.totalMarks || 50,
      timeAllowed: sanitizeText(paperConfig.timeAllowed || '60 Mins'),
      language: sanitizeText(paperConfig.language || 'English'),
      logoUrl: sanitizeText(paperConfig.logoUrl || '')
    },
    mcqs: (paperData.mcqs || []).map((m, idx) => ({
      id: sanitizeSafeId(m.id || `m_${idx}`),
      question: sanitizeText(m.question || ''),
      questionUrdu: sanitizeText(m.questionUrdu || ''),
      options: (m.options || []).map(opt => sanitizeText(opt)),
      optionsUrdu: (m.optionsUrdu || []).map(opt => sanitizeText(opt)),
      correctIndex: typeof m.correctIndex === 'number' ? m.correctIndex : -1,
      answer: sanitizeText(m.answer || m.correctAnswer || m.answerKey || ''),
      answerUrdu: sanitizeText(m.answerUrdu || ''),
      marks: m.marks || 1
    })),
    shortQuestions: (paperData.shortQuestions || []).map((s, idx) => ({
      id: sanitizeSafeId(s.id || `s_${idx}`),
      question: sanitizeText(s.question || ''),
      questionUrdu: sanitizeText(s.questionUrdu || ''),
      answer: sanitizeText(s.answer || s.solution || s.answerKey || s.modelAnswer || ''),
      answerUrdu: sanitizeText(s.answerUrdu || ''),
      marks: s.marks || 2
    })),
    longQuestions: (paperData.longQuestions || []).map((l, idx) => ({
      id: sanitizeSafeId(l.id || `l_${idx}`),
      question: sanitizeText(l.question || ''),
      questionUrdu: sanitizeText(l.questionUrdu || ''),
      answer: sanitizeText(l.answer || l.solution || l.answerKey || l.modelAnswer || ''),
      answerUrdu: sanitizeText(l.answerUrdu || ''),
      marks: l.marks || 5
    })),
    createdAt: new Date().toISOString()
  };

  // 1. Save to localStorage for instant local access
  try {
    localStorage.setItem(`ptm_paper_solution_${safeId}`, JSON.stringify(payload));
  } catch (e) {}

  // 2. Save to Firestore for global phone scan access
  try {
    const docRef = doc(db, 'shared_papers', safeId);
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn("Firestore shared_papers note:", err.message);
  }

  return payload;
}

// Fetch shared paper for solution viewer
export async function fetchPaperSolution(paperId) {
  const safeId = sanitizeSafeId(paperId);
  if (!safeId) return null;

  // 1. Try localStorage first
  try {
    const local = localStorage.getItem(`ptm_paper_solution_${safeId}`);
    if (local) return JSON.parse(local);
  } catch (e) {}

  // 2. Try Firestore
  try {
    const docRef = doc(db, 'shared_papers', safeId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn("Error fetching paper solution from Firestore:", err.message);
  }

  return null;
}

// Generate base64 QR Code data URL
export async function generateQrCodeDataUrl(url) {
  if (!url || typeof url !== 'string') return '';
  // Defense: only allow safe http/https URLs
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    console.warn("QR Code URL blocked: unsafe protocol:", url);
    return '';
  }

  try {
    return await QRCode.toDataURL(url, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error("QR code generation error:", err);
    return null;
  }
}
