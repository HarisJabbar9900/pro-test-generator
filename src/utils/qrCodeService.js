import QRCode from 'qrcode';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Generate or retrieve persistent paperId
export function getOrCreatePaperId(paperData) {
  if (paperData?.id && !paperData.id.startsWith('draft_')) {
    return paperData.id;
  }
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ptm_${timestamp}_${random}`;
}

// Upload paper and solutions to cloud for QR scan access
export async function syncPaperForQrAccess(paperId, paperData, paperConfig) {
  if (!paperId || !paperData) return null;

  const payload = {
    id: paperId,
    config: {
      examTitle: paperConfig.examTitle || 'Test Paper',
      academyName: paperConfig.academyName || paperConfig.instituteName || '',
      instituteName: paperConfig.instituteName || paperConfig.academyName || '',
      subject: paperConfig.subject || '',
      gradeClass: paperConfig.gradeClass || '',
      syllabus: paperConfig.syllabus || '',
      totalMarks: paperConfig.totalMarks || 50,
      timeAllowed: paperConfig.timeAllowed || '60 Mins',
      language: paperConfig.language || 'English',
      logoUrl: paperConfig.logoUrl || ''
    },
    mcqs: (paperData.mcqs || []).map((m, idx) => ({
      id: m.id || `m_${idx}`,
      question: m.question || '',
      questionUrdu: m.questionUrdu || '',
      options: m.options || [],
      optionsUrdu: m.optionsUrdu || [],
      correctIndex: typeof m.correctIndex === 'number' ? m.correctIndex : -1,
      answer: m.answer || m.correctAnswer || m.answerKey || '',
      answerUrdu: m.answerUrdu || '',
      marks: m.marks || 1
    })),
    shortQuestions: (paperData.shortQuestions || []).map((s, idx) => ({
      id: s.id || `s_${idx}`,
      question: s.question || '',
      questionUrdu: s.questionUrdu || '',
      answer: s.answer || s.solution || s.answerKey || s.modelAnswer || '',
      answerUrdu: s.answerUrdu || '',
      marks: s.marks || 2
    })),
    longQuestions: (paperData.longQuestions || []).map((l, idx) => ({
      id: l.id || `l_${idx}`,
      question: l.question || '',
      questionUrdu: l.questionUrdu || '',
      answer: l.answer || l.solution || l.answerKey || l.modelAnswer || '',
      answerUrdu: l.answerUrdu || '',
      marks: l.marks || 5
    })),
    createdAt: new Date().toISOString()
  };

  // 1. Save to localStorage for instant local access
  try {
    localStorage.setItem(`ptm_paper_solution_${paperId}`, JSON.stringify(payload));
  } catch (e) {}

  // 2. Save to Firestore for global phone scan access
  try {
    const docRef = doc(db, 'shared_papers', paperId);
    await setDoc(docRef, payload, { merge: true });
  } catch (err) {
    console.warn("Firestore shared_papers note:", err.message);
  }

  return payload;
}

// Fetch shared paper for solution viewer
export async function fetchPaperSolution(paperId) {
  if (!paperId) return null;

  // 1. Try localStorage first
  try {
    const local = localStorage.getItem(`ptm_paper_solution_${paperId}`);
    if (local) return JSON.parse(local);
  } catch (e) {}

  // 2. Try Firestore
  try {
    const docRef = doc(db, 'shared_papers', paperId);
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
