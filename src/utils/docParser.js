import { isValidHumanText } from './textValidator.js';
import { validateUploadedFile, sanitizeText } from './securitySanitizer.js';
export { isValidHumanText, validateUploadedFile };

export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64Str = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64Str);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

export function cleanExtractedText(text) {
  if (!text) return '';
  const sanitized = sanitizeText(text);
  return sanitized
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Universal Unified File Parser
 * Supports: .txt, .docx, .doc, .pdf, images (.png, .jpg, .jpeg) via OCR
 */
export async function extractTextFromFile(file) {
  if (!file) return "";

  // Strict security validation (size + extension whitelist)
  const validation = validateUploadedFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  try {
    if (name.endsWith('.txt') || type === 'text/plain') {
      const text = await readAsText(file);
      return cleanExtractedText(text);
    }

    const arrayBuffer = await file.arrayBuffer();

    if (name.endsWith('.docx') || name.endsWith('.doc') || type.includes('word') || type.includes('officedocument')) {
      const text = await extractFromDocxOrDoc(file, arrayBuffer);
      return cleanExtractedText(text);
    }

    if (name.endsWith('.pdf') || type === 'application/pdf') {
      const text = await extractFromPdf(file, arrayBuffer);
      return cleanExtractedText(text);
    }

    if (type.startsWith('image/')) {
      const TesseractMod = await import('tesseract.js');
      const Tesseract = TesseractMod.default || TesseractMod;
      const { data } = await Tesseract.recognize(file, 'eng+urd', {
        logger: () => {}
      });
      return cleanExtractedText(data?.text || "");
    }

    // Fallback: Attempt UTF-8 plain read
    const fallbackText = await readAsText(file);
    if (isValidHumanText(fallbackText)) {
      return cleanExtractedText(fallbackText);
    }
  } catch (err) {
    console.error("Text extraction failed for file:", file.name, err);
  }

  return "";
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || '');
    reader.onerror = () => reject(new Error("File reading error"));
    reader.readAsText(file);
  });
}

async function extractFromDocxOrDoc(file, arrayBuffer) {
  try {
    const mammothMod = await import('mammoth');
    const mammoth = mammothMod.default || mammothMod;
    const buffer = arrayBuffer || (await file.arrayBuffer());
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    if (result && result.value && result.value.trim().length > 10) {
      const cleanVal = result.value.trim();
      if (isValidHumanText(cleanVal)) {
        return cleanVal;
      }
    }
  } catch (mErr) {
    console.warn("Mammoth extraction warning:", mErr);
  }

  return "";
}

async function extractFromPdf(file, arrayBuffer) {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    const pdfWorkerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    if (pdfjsLib.GlobalWorkerOptions && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
    }

    const buffer = arrayBuffer || (await file.arrayBuffer());
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items.map(item => item.str);
      const pageText = pageStrings.join(' ');
      fullText += pageText + '\n\n';
    }

    if (fullText.trim().length > 30 && isValidHumanText(fullText)) {
      return fullText.trim();
    }

    console.info("Performing Tesseract OCR scan on document pages...");
    let ocrText = '';
    const maxOcrPages = Math.min(pdfDoc.numPages, 10);
    const TesseractMod = await import('tesseract.js');
    const Tesseract = TesseractMod.default || TesseractMod;

    for (let pageNum = 1; pageNum <= maxOcrPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport: viewport }).promise;

      const { data } = await Tesseract.recognize(canvas, 'eng+urd', {
        logger: () => {}
      });

      if (data && data.text) {
        ocrText += data.text + '\n\n';
      }
    }

    if (ocrText.trim().length > 10) {
      return ocrText.trim();
    }
  } catch (pdfErr) {
    console.warn("PDF extraction error:", pdfErr);
  }

  return "";
}

/**
 * Intelligent Document Question Parser
 * Splits text into MCQs, Short Questions, and Long Questions
 */
export function parseDocumentIntoQuestions(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { mcqs: [], shortQuestions: [], longQuestions: [] };
  }

  const clean = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean);

  let currentSection = 'auto'; // 'mcqs' | 'short' | 'long' | 'auto'

  const mcqs = [];
  const shortQuestions = [];
  const longQuestions = [];

  // 1. Check if document has clear section delimiters
  const sectionDelimiters = {
    mcqs: /(?:SECTION\s*[-–:]?\s*A|MULTIPLE\s*CHOICE|OBJECTIVE\s*(?:PART|TYPE)?|\bMCQS?\b|حصہ\s*اول|کثیر\s*الانتخابی)/i,
    short: /(?:SECTION\s*[-–:]?\s*B|SHORT\s*QUESTIONS?|SUBJECTIVE\s*(?:PART|TYPE)?(?:\s*[-–:]?\s*I)?|مختصر\s*سوالات|حصہ\s*دوم)/i,
    long: /(?:SECTION\s*[-–:]?\s*C|LONG\s*QUESTIONS?|DETAILED\s*QUESTIONS?|ESSAY\s*QUESTIONS?|حصہ\s*سوم|تفصیلی\s*سوالات|انشائیہ)/i
  };

  // Split into chunks by question numbering like: 1., 2), Q1:, Q.1, سوال نمبر
  const questionBlocks = [];
  let currentBlock = [];

  lines.forEach(line => {
    // Check section header
    if (sectionDelimiters.mcqs.test(line)) {
      currentSection = 'mcqs';
      return;
    }
    if (sectionDelimiters.short.test(line)) {
      currentSection = 'short';
      return;
    }
    if (sectionDelimiters.long.test(line)) {
      currentSection = 'long';
      return;
    }

    // Skip general exam metadata lines (like "Total Marks: 50", "Time Allowed: 60 mins")
    if (/(?:Total\s*Marks|Time\s*Allowed|Roll\s*No|Class\s*[:\d]|Subject\s*[:\w]|Name\s*[:\w])/i.test(line)) {
      return;
    }

    const isQuestionStart = /^(?:Q(?:uestion)?[\s.]*\d+[:.]?|\d+[\.\)]|سوال\s*نمبر\s*[\d١-٩]+)/i.test(line);

    if (isQuestionStart && currentBlock.length > 0) {
      questionBlocks.push({ section: currentSection, text: currentBlock.join('\n') });
      currentBlock = [line];
    } else {
      currentBlock.push(line);
    }
  });

  if (currentBlock.length > 0) {
    questionBlocks.push({ section: currentSection, text: currentBlock.join('\n') });
  }

  // Parse each block
  questionBlocks.forEach((block, bIdx) => {
    const text = block.text.trim();
    if (text.length < 5) return;

    // Check if it has options: (A) ... (B) ... (C) ... (D) ... or A) ... B) ...
    const hasOptions = /(?:[\(\[]?[A-Da-d][\)\]\.]|\b[A-Da-d][\.\)])\s+[^\n]{1,}/.test(text);

    if (hasOptions || block.section === 'mcqs') {
      // Parse as MCQ
      let answer = "";
      const ansRegex = /(?:Ans(?:wer)?|Correct(?:\s*Answer)?|Key|جواب|درست\s*جواب)\s*[:=\-.]?\s*\(?([A-Da-d]|الف|ب|ج|د)\)?/i;
      const ansMatch = text.match(ansRegex);
      if (ansMatch) {
        answer = ansMatch[1].toUpperCase();
      }

      const textWithoutAns = text.replace(ansRegex, '').trim();

      // Find all markers: (A), (B), (C), (D) or (الف), (ب), (ج), (د) or A., B., C., D.
      const markerRegex = /(?:^|[\r\n\t]|\s{2,}|\s(?=\([A-Da-d]\))|\s(?=\((?:الف|ب|ج|د)\))|(?<=\n)\s*|\s(?=[A-Da-d][\.\)]))(?:\(([A-Da-d]|الف|ب|ج|د)\)|\[([A-Da-d]|الف|ب|ج|د)\]|([A-Da-d]|الف|ب|ج|د)[\.\):])\s*/gi;

      const matches = [];
      let m;
      while ((m = markerRegex.exec(textWithoutAns)) !== null) {
        const letter = (m[1] || m[2] || m[3] || '').toUpperCase();
        matches.push({
          letter,
          index: m.index,
          endIndex: m.index + m[0].length
        });
      }

      let options = [];
      let questionText = textWithoutAns;

      if (matches.length >= 2) {
        const firstMarker = matches[0];
        const qRaw = textWithoutAns.substring(0, firstMarker.index);
        questionText = qRaw.replace(/^\s*(?:Q(?:uestion)?[\s.]*\d+[:.]?|\d+[\.\)]|سوال\s*نمبر\s*[\d١-٩]+[:.]?)\s*/i, '').trim();

        for (let i = 0; i < matches.length; i++) {
          const current = matches[i];
          const next = matches[i + 1];
          const optRaw = next ? textWithoutAns.substring(current.endIndex, next.index) : textWithoutAns.substring(current.endIndex);
          const cleanOpt = optRaw.trim().replace(/\s+/g, ' ');
          if (cleanOpt) {
            options.push(cleanOpt);
          }
        }
      } else {
        const blkLines = textWithoutAns.split('\n').map(l => l.trim()).filter(Boolean);
        questionText = blkLines[0].replace(/^\s*(?:Q(?:uestion)?[\s.]*\d+[:.]?|\d+[\.\)]|سوال\s*نمبر\s*[\d١-٩]+[:.]?)\s*/i, '');
        options = blkLines.slice(1, 5);
      }

      // Ensure 4 options
      while (options.length < 4) {
        options.push(`Option ${String.fromCharCode(65 + options.length)}`);
      }
      options = options.slice(0, 4);

      if (questionText) {
        // Calculate correctIndex from answer
        let correctIndex = -1;
        if (answer) {
          const up = answer.toUpperCase();
          if (up === 'A' || up === 'الف' || up === '1') correctIndex = 0;
          else if (up === 'B' || up === 'ب' || up === '2') correctIndex = 1;
          else if (up === 'C' || up === 'ج' || up === '3') correctIndex = 2;
          else if (up === 'D' || up === 'د' || up === '4') correctIndex = 3;
        }

        mcqs.push({
          id: `file-m-${Date.now()}-${bIdx}-${Math.floor(Math.random() * 1000)}`,
          question: questionText,
          options,
          answer,
          correctIndex,
          answerKey: correctIndex >= 0 && options[correctIndex] ? options[correctIndex] : answer,
          marks: 1
        });
      }

    } else if (block.section === 'long' || /(?:Explain\s+in\s+detail|Prove\s+that|Derive|Write\s+a\s+detailed\s+note|تفصیل\s+سے|وضاحت\s+کریں)/i.test(text) || text.length > 200) {
      // Parse as Long Question
      const qText = text.replace(/^\s*(?:Q(?:uestion)?[\s.]*\d+[:.]?|\d+[\.\)]|سوال\s*نمبر\s*[\d١-٩]+[:.]?)\s*/i, '').trim();
      if (qText) {
        longQuestions.push({
          id: `file-l-${Date.now()}-${bIdx}-${Math.floor(Math.random() * 1000)}`,
          question: qText,
          marks: 5
        });
      }

    } else {
      // Parse as Short Question
      const qText = text.replace(/^\s*(?:Q(?:uestion)?[\s.]*\d+[:.]?|\d+[\.\)]|سوال\s*نمبر\s*[\d١-٩]+[:.]?)\s*/i, '').trim();
      if (qText) {
        shortQuestions.push({
          id: `file-s-${Date.now()}-${bIdx}-${Math.floor(Math.random() * 1000)}`,
          question: qText,
          marks: 2
        });
      }
    }
  });

  const isLikelyExercise = /(?:EXERCISE|TEXTBOOK\s*EXERCISE|REVIEW\s*QUESTIONS?|مشقی\s*سوالات|مشق\s*نمبر)/i.test(rawText);

  return { mcqs, shortQuestions, longQuestions, isLikelyExercise };
}
