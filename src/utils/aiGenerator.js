import { isValidHumanText } from './textValidator.js';

export const URDU_CONCEPT_MAP = {};

export function translateTermToUrdu(engTerm) {
  if (!engTerm) return "";
  // Only return if text actually contains Urdu/Arabic characters
  if (/[\u0600-\u06FF]/.test(engTerm)) {
    return engTerm;
  }
  return "";
}

/**
 * Smart Full Paper Importer (Parses MCQs, Short Questions, and Long Questions)
 */
export function parseFullPastedPaper(rawText, optionsConfig = {}) {
  if (!rawText || typeof rawText !== 'string') {
    return { mcqs: [], shortQuestions: [], longQuestions: [] };
  }

  const {
    mcqMarks = 1,
    shortMarks = 3,
    longMarks = 5
  } = optionsConfig;

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);

  const mcqs = [];
  const shortQuestions = [];
  const longQuestions = [];

  let currentSection = 'mcqs'; // 'mcqs' | 'short' | 'long'

  let currentMcqQ = null;
  let currentMcqOptions = [];

  let currentLongQ = null;
  let currentLongSubParts = [];

  const isMcqHeader = (l) => /^(section\s*a|mcqs?|multiple\s*choice)/i.test(l);
  const isShortHeader = (l) => /^(section\s*b|short\s*questions?|short\s*answers?)/i.test(l);
  const isLongHeader = (l) => /^(section\s*c|long\s*questions?|essay\s*questions?|detailed)/i.test(l);

  const isQuestionNum = (l) => /^(\d+|Q\d+|Q\.\d+|Question\s*\d+)[\.\:\)\-]/i.test(l);
  const isOptionLine = (l) => /^[\(\[\{\s]*([A-Da-d1-4])[\)\]\}\.\:-]\s*/.test(l);
  const isSubPartLine = (l) => /^[\(\[\{\s]*([a-z1-4])[\)\]\}\.\:-]\s*/i.test(l);

  const flushCurrentMcq = () => {
    if (currentMcqQ && currentMcqOptions.length >= 2) {
      const cleanOpts = [...currentMcqOptions];
      while (cleanOpts.length < 4) cleanOpts.push(`Option ${cleanOpts.length + 1}`);
      mcqs.push({
        id: `mcq-${mcqs.length + 1}`,
        question: currentMcqQ,
        options: cleanOpts.slice(0, 4),
        correctIndex: 0,
        answerKey: "Correct Option",
        marks: mcqMarks
      });
    }
    currentMcqQ = null;
    currentMcqOptions = [];
  };

  const flushCurrentLong = () => {
    if (currentLongQ) {
      longQuestions.push({
        id: `long-${longQuestions.length + 1}`,
        question: currentLongQ,
        subParts: [...currentLongSubParts],
        answerKey: `Full ${longMarks} Marks for detailed explanation.`,
        marks: longMarks
      });
    }
    currentLongQ = null;
    currentLongSubParts = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isMcqHeader(line)) {
      flushCurrentMcq();
      flushCurrentLong();
      currentSection = 'mcqs';
      continue;
    } else if (isShortHeader(line)) {
      flushCurrentMcq();
      flushCurrentLong();
      currentSection = 'short';
      continue;
    } else if (isLongHeader(line)) {
      flushCurrentMcq();
      flushCurrentLong();
      currentSection = 'long';
      continue;
    }

    if (currentSection === 'mcqs') {
      if (isQuestionNum(line)) {
        flushCurrentMcq();
        currentMcqQ = line.replace(/^(\d+|Q\d+|Q\.\d+|Question\s*\d+)[\.\:\)\-]\s*/i, '').trim();
      } else if (isOptionLine(line)) {
        const cleanOpt = line.replace(/^[\(\[\{\s]*([A-Da-d1-4])[\)\]\}\.\:-]\s*/, '').trim();
        if (cleanOpt) currentMcqOptions.push(cleanOpt);
      } else if (currentMcqQ) {
        if (currentMcqOptions.length === 0) currentMcqQ += " " + line;
        else currentMcqOptions[currentMcqOptions.length - 1] += " " + line;
      }
    } else if (currentSection === 'short') {
      if (isQuestionNum(line)) {
        const qText = line.replace(/^(\d+|Q\d+|Q\.\d+|Question\s*\d+)[\.\:\)\-]\s*/i, '').trim();
        shortQuestions.push({
          id: `short-${shortQuestions.length + 1}`,
          question: qText,
          answerKey: `Full ${shortMarks} Marks for textbook definition.`,
          marks: shortMarks
        });
      } else if (shortQuestions.length > 0) {
        shortQuestions[shortQuestions.length - 1].question += " " + line;
      }
    } else if (currentSection === 'long') {
      if (isQuestionNum(line)) {
        flushCurrentLong();
        currentLongQ = line.replace(/^(\d+|Q\d+|Q\.\d+|Question\s*\d+)[\.\:\)\-]\s*/i, '').trim();
      } else if (isSubPartLine(line) && currentLongQ) {
        currentLongSubParts.push(line);
      } else if (currentLongQ) {
        currentLongQ += " " + line;
      }
    }
  }

  flushCurrentMcq();
  flushCurrentLong();

  // If section headers were missing, try fallback MCQ detection
  if (mcqs.length === 0 && shortQuestions.length === 0 && longQuestions.length === 0) {
    const fallbackMcqs = parseBulkPastedMcqs(rawText);
    return { mcqs: fallbackMcqs, shortQuestions: [], longQuestions: [] };
  }

  return { mcqs, shortQuestions, longQuestions };
}

export function parseBulkPastedMcqs(rawText, shouldBlendUrdu = true) {
  if (!rawText || typeof rawText !== 'string') return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const parsedMcqs = [];

  let currentQ = null;
  let options = [];

  const isQuestionLine = (line) => {
    return /^(\d+|Q\d+|Q\.\d+|Question\s*\d+)[\.\:\)\-]/i.test(line);
  };

  const isOptionLine = (line) => {
    return /^[\(\[\{\s]*([A-Da-d1-4])[\)\]\}\.\:-]\s*/.test(line);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (isQuestionLine(line)) {
      if (currentQ && options.length >= 2) {
        parsedMcqs.push(buildParsedMcqObj(currentQ, options, parsedMcqs.length + 1, shouldBlendUrdu));
      }
      currentQ = line.replace(/^(\d+|Q\d+|Q\.\d+|Question\s*\d+)[\.\:\)\-]\s*/i, '').trim();
      options = [];
    } else if (isOptionLine(line)) {
      const cleanOpt = line.replace(/^[\(\[\{\s]*([A-Da-d1-4])[\)\]\}\.\:-]\s*/, '').trim();
      if (cleanOpt) {
        options.push(cleanOpt);
      }
    } else if (currentQ && options.length < 4) {
      if (options.length === 0) {
        currentQ += " " + line;
      } else {
        options[options.length - 1] += " " + line;
      }
    }
  }

  if (currentQ && options.length >= 2) {
    parsedMcqs.push(buildParsedMcqObj(currentQ, options, parsedMcqs.length + 1, shouldBlendUrdu));
  }

  return parsedMcqs;
}

function buildParsedMcqObj(qPrompt, optList, index, shouldBlendUrdu) {
  const cleanOpts = [...optList];
  while (cleanOpts.length < 4) {
    cleanOpts.push(`Option ${cleanOpts.length + 1}`);
  }

  return {
    id: `mcq-imported-${index}-${Date.now()}`,
    question: qPrompt,
    options: cleanOpts.slice(0, 4),
    correctIndex: 0,
    answerKey: "Correct Choice",
    marks: 1
  };
}

export function getBlankInitialPaper(mcqCount = 0, shortCount = 0, longCount = 0, mcqMarks = 1, shortMarks = 3, longMarks = 5) {
  const mcqs = [];
  for (let i = 0; i < mcqCount; i++) {
    mcqs.push({
      id: `mcq-${i + 1}`,
      question: " __________________________________________________",
      options: [
        " __________________",
        " __________________",
        " __________________",
        " __________________"
      ],
      correctIndex: 0,
      answerKey: "",
      marks: mcqMarks
    });
  }

  const shortQuestions = [];
  for (let i = 0; i < shortCount; i++) {
    shortQuestions.push({
      id: `short-${i + 1}`,
      question: " __________________________________________________",
      answerKey: "",
      marks: shortMarks
    });
  }

  const longQuestions = [];
  for (let i = 0; i < longCount; i++) {
    longQuestions.push({
      id: `long-${i + 1}`,
      question: " __________________________________________________",
      subParts: [],
      answerKey: "",
      marks: longMarks
    });
  }

  return {
    mcqs,
    shortQuestions,
    longQuestions,
    trueFalse: [],
    fillBlanks: []
  };
}

export async function generateTestPaper({
  sourceText,
  pdfBase64 = null,
  mcqCount = 10,
  mcqMarks = 1,
  shortCount = 0,
  shortMarks = 3,
  longCount = 0,
  longMarks = 5,
  trueFalseCount = 0,
  trueFalseMarks = 1,
  fillBlanksCount = 0,
  fillBlanksMarks = 1,
  difficulty = "Medium",
  cognitiveLevel = "Understanding",
  language = "English",
  apiKey = ""
}) {
  const cleanKey = apiKey ? apiKey.trim().replace(/^["']|["']$/g, '') : "";

  if (cleanKey && cleanKey.length > 5) {
    try {
      return await generateWithGeminiAPI({
        sourceText,
        pdfBase64,
        mcqCount,
        mcqMarks,
        shortCount,
        shortMarks,
        longCount,
        longMarks,
        trueFalseCount,
        trueFalseMarks,
        fillBlanksCount,
        fillBlanksMarks,
        difficulty,
        cognitiveLevel,
        language,
        apiKey: cleanKey
      });
    } catch (err) {
      console.info("Gemini API call warning, using Real Document Offline Scanner fallback:", err?.message || err);
    }
  }

  return generateOfflinePaper({
    sourceText,
    mcqCount,
    mcqMarks,
    shortCount,
    shortMarks,
    longCount,
    longMarks,
    trueFalseCount,
    trueFalseMarks,
    fillBlanksCount,
    fillBlanksMarks,
    difficulty,
    language
  });
}

export function generateOfflinePaper({
  sourceText,
  mcqCount = 0,
  mcqMarks = 1,
  shortCount = 0,
  shortMarks = 3,
  longCount = 0,
  longMarks = 5,
  trueFalseCount = 0,
  trueFalseMarks = 1,
  fillBlanksCount = 0,
  fillBlanksMarks = 1,
  language = "English"
}) {
  const isBlend = language.includes("Blend") || language.includes("Bilingual");
  const isUrduOnly = language === "Urdu";

  const formatText = (engText, urduText) => {
    if (isUrduOnly) return urduText || engText;
    if (isBlend && urduText) return `${engText} || ${urduText}`;
    return engText;
  };

  const textToScan = sourceText || "";
  
  // 1. Check if user pasted structured bulk questions
  const fullParsed = parseFullPastedPaper(textToScan);

  const hasPastedMcqs = fullParsed.mcqs.length >= mcqCount && mcqCount > 0;
  const hasPastedShorts = fullParsed.shortQuestions.length >= shortCount && shortCount > 0;
  const hasPastedLongs = fullParsed.longQuestions.length >= longCount && longCount > 0;

  if (fullParsed && (hasPastedMcqs && (shortCount === 0 || hasPastedShorts) && (longCount === 0 || hasPastedLongs))) {
    return sanitizeGeneratedOutput({
      mcqs: fullParsed.mcqs,
      shortQuestions: fullParsed.shortQuestions,
      longQuestions: fullParsed.longQuestions,
      trueFalse: [],
      fillBlanks: []
    }, {
      mcqCount, mcqMarks, shortCount, shortMarks, longCount, longMarks,
      trueFalseCount, trueFalseMarks, fillBlanksCount, fillBlanksMarks
    });
  }

  const docFacts = extractTextbookFacts(textToScan);
  const rawSentences = extractSentences(textToScan);

  const usedQuestionTexts = new Set();
  const mcqs = [];

  let factIdx = 0;
  for (let i = mcqs.length; i < mcqCount; i++) {
    const fact = docFacts[factIdx % docFacts.length];
    factIdx++;

    let questionPrompt = fact.question;
    let attempts = 0;
    while (usedQuestionTexts.has(questionPrompt) && attempts < 15) {
      const nextFact = docFacts[factIdx % docFacts.length];
      factIdx++;
      questionPrompt = nextFact.question;
      attempts++;
    }

    usedQuestionTexts.add(questionPrompt);

    mcqs.push({
      id: `mcq-${i + 1}`,
      question: formatText(questionPrompt, fact.questionUrdu),
      options: fact.options,
      correctIndex: fact.correctIndex || 0,
      answerKey: `Board Answer: ${fact.answerKey}`,
      marks: mcqMarks
    });
  }

  const shortQuestions = [];
  for (let i = 0; i < shortCount; i++) {
    const fact = docFacts[(i + 2) % docFacts.length];
    const engQ = fact.shortQuestion || `Explain the key concepts of "${fact.subjectTerm}" based on the textbook.`;
    const urduQ = fact.shortUrdu || `نصابی کتاب کے مطابق "${fact.subjectTerm}" کے بنیادی نکات کی وضاحت کریں۔`;

    shortQuestions.push({
      id: `short-${i + 1}`,
      question: formatText(engQ, urduQ),
      answerKey: `Board Marking Rubric: Full ${shortMarks} marks for clear definition and key textbook points.`,
      marks: shortMarks
    });
  }

  const longQuestions = [];
  for (let i = 0; i < longCount; i++) {
    const fact1 = docFacts[(i * 2) % docFacts.length];
    const fact2 = docFacts[(i * 2 + 1) % docFacts.length] || docFacts[0];

    const engQ = `Provide a detailed explanation of "${fact1.subjectTerm}". Discuss its core structure and principles based on the textbook content.`;
    const urduQ = `"${fact1.subjectTerm}" کی تفصیلی وضاحت کریں۔ نصاب کی روشنی میں اس کے بنیادی ڈھانچے اور اصولوں پر بحث کریں۔`;

    longQuestions.push({
      id: `long-${i + 1}`,
      question: formatText(engQ, urduQ),
      subParts: [
        formatText(`a) Define ${fact1.subjectTerm} and state its main features.`, `الف) ${fact1.subjectTerm} کی تعریف کریں اور اس کی بنیادی خصوصیات تحریر کریں۔`),
        formatText(`b) Explain the operational framework of ${fact2.subjectTerm}.`, `ب) ${fact2.subjectTerm} کے عملی فریم ورک کی تفصیل بیان کریں۔`)
      ],
      answerKey: `Board Marking Rubric: Part (a) 2.5 marks; Part (b) 2.5 marks. Total = ${longMarks} Marks.`,
      marks: longMarks
    });
  }

  return sanitizeGeneratedOutput({
    mcqs,
    shortQuestions,
    longQuestions,
    trueFalse: [],
    fillBlanks: []
  }, {
    mcqCount, mcqMarks, shortCount, shortMarks, longCount, longMarks,
    trueFalseCount, trueFalseMarks, fillBlanksCount, fillBlanksMarks
  });
}

function extractTextbookFacts(text) {
  const facts = [];
  
  const isInstructionSentence = (str) => {
    const lower = str.toLowerCase();
    return (
      lower.includes('create test') ||
      lower.includes('make test') ||
      lower.includes('generate paper') ||
      lower.includes('chapter 1 topic') ||
      lower.includes('chapter 2 topic') ||
      lower.includes('chapter 3 topic') ||
      lower.includes('topic 1.1') ||
      lower.includes('topic 1.2') ||
      lower.startsWith('create') ||
      lower.startsWith('generate') ||
      lower.startsWith('make')
    );
  };

  if (!text || text.trim().length === 0 || isInstructionSentence(text.trim()) || !isValidHumanText(text)) {
    return getFallbackBoardExamFacts();
  }

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 5 && !isInstructionSentence(l));

  for (const line of lines) {
    if (line.includes(':') && !line.startsWith('http')) {
      const parts = line.split(':');
      const term = parts[0].replace(/^[-•*\d.]+\s*/, '').trim();
      const def = parts.slice(1).join(':').trim();

      if (term.length >= 3 && term.length < 40 && def.length > 5) {
        facts.push({
          subjectTerm: term,
          question: `Which of the following is defined as "${def.slice(0, 70)}..."?`,
          questionUrdu: `مندرجہ ذیل میں سے کون سا "${term}" کا درست بیان ہے؟`,
          options: [
            term,
            `System ${term} Process`,
            `Analytical ${term}`,
            `Framework ${term}`
          ],
          correctIndex: 0,
          answerKey: term,
          shortQuestion: `Define "${term}" and explain its importance based on the textbook.`,
          shortUrdu: `"${term}" کی تعریف کریں اور نصاب کی روشنی میں اس کی اہمیت بیان کریں۔`
        });
      }
    }
  }

  const sentences = text
    .split(/(?<=[.?!])\s+/)
    .filter(s => s.trim().length > 25 && s.trim().length < 180 && !isInstructionSentence(s));

  for (let idx = 0; idx < sentences.length; idx++) {
    const s = sentences[idx].trim();
    const words = s.split(/\s+/);
    if (words.length > 4) {
      const mainWord = words.find(w => w.length > 4 && /^[A-Z]/.test(w)) || words[0];
      const cleanWord = mainWord.replace(/[^a-zA-Z]/g, '');

      if (cleanWord.length > 3) {
        facts.push({
          subjectTerm: cleanWord,
          question: `According to the textbook statement: "${s.slice(0, 90)}..." refers to:`,
          questionUrdu: `نصابی کتاب کے مطابق مندرجہ ذیل بیان کس سے متعلق ہے؟`,
          options: [
            cleanWord,
            `Secondary ${cleanWord}`,
            `Alternative Model`,
            `System Process`
          ],
          correctIndex: 0,
          answerKey: cleanWord,
          shortQuestion: `State the main principles related to "${cleanWord}" as discussed in the text.`,
          shortUrdu: `نصاب میں بیان کردہ "${cleanWord}" کے بنیادی اصول تحریر کریں۔`
        });
      }
    }
  }

  if (facts.length === 0) {
    return getFallbackBoardExamFacts();
  }

  return facts;
}

function getFallbackBoardExamFacts() {
  return [
    {
      subjectTerm: "Operating System (OS)",
      question: "Which of the following is system software that manages computer hardware, software resources, and provides common services for computer programs?",
      options: ["Operating System (OS)", "Compiler", "Utility Program", "Word Processor"],
      answerKey: "Operating System (OS)",
      shortQuestion: "Define Operating System (OS) and state its two main functions.",
      shortUrdu: "آپریٹنگ سسٹم (OS) کی تعریف کریں اور اس کے دو بنیادی افعال تحریر کریں۔"
    },
    {
      subjectTerm: "OS Primary Objective",
      question: "What is the primary objective of an Operating System (OS) in computer architecture?",
      options: ["To provide a convenient environment to execute user programs", "To format storage devices", "To design graphics and images", "To connect to internet servers"],
      answerKey: "To provide a convenient environment to execute user programs",
      shortQuestion: "Explain the primary objective of an Operating System.",
      shortUrdu: "آپریٹنگ سسٹم کے بنیادی مقصد کی تفصیل بیان کریں۔"
    },
    {
      subjectTerm: "Multi-user Operating System",
      question: "Which type of Operating System allows multiple users on different terminals to access system resources simultaneously?",
      options: ["Multi-user Operating System", "Single-user Operating System", "Embedded Operating System", "Single-tasking OS"],
      answerKey: "Multi-user Operating System",
      shortQuestion: "Differentiate between Single-user OS and Multi-user OS with examples.",
      shortUrdu: "مثالوں کی مدد سے سنگل یوزر اور ملٹی یوزر آپریٹنگ سسٹم میں فرق بیان کریں۔"
    },
    {
      subjectTerm: "Memory Management",
      question: "Which core function of an Operating System is responsible for allocating and deallocating memory addresses to running processes?",
      options: ["Memory Management", "File Allocation Table", "Processor Cache", "Network Interface"],
      answerKey: "Memory Management",
      shortQuestion: "Describe the Memory Management function of an Operating System.",
      shortUrdu: "آپریٹنگ سسٹم کے میموری مینجمنٹ فنکشن پر مختصر نوٹ لکھیں۔"
    },
    {
      subjectTerm: "Batch Processing OS",
      question: "Which type of Operating System groups similar jobs into batches and executes them sequentially without user interaction?",
      options: ["Batch Processing Operating System", "Real-Time OS", "GUI Operating System", "Mobile Operating System"],
      answerKey: "Batch Processing Operating System",
      shortQuestion: "What is a Batch Processing Operating System? Give one use case.",
      shortUrdu: "بیچ پروسیسنگ آپریٹنگ سسٹم کیا ہے؟ اس کا ایک استعمال تحریر کریں۔"
    },
    {
      subjectTerm: "Graphical User Interface (GUI)",
      question: "Which user interface allows users to interact with the computer using visual elements such as icons, windows, buttons, and menus?",
      options: ["Graphical User Interface (GUI)", "Command Line Interface (CLI)", "Terminal Interface", "Batch Interface"],
      answerKey: "Graphical User Interface (GUI)",
      shortQuestion: "What is Graphical User Interface (GUI)? Name two popular GUI operating systems.",
      shortUrdu: "گرافیکل یوزر انٹرفیس (GUI) کیا ہے؟ دو مشہور GUI آپریٹنگ سسٹمز کے نام لکھیں۔"
    },
    {
      subjectTerm: "Command Line Interface (CLI)",
      question: "Which user interface requires the user to type specific commands at a text prompt to execute tasks?",
      options: ["Command Line Interface (CLI)", "Graphical User Interface (GUI)", "Touchscreen Interface", "Voice User Interface"],
      answerKey: "Command Line Interface (CLI)",
      shortQuestion: "Compare Command Line Interface (CLI) and Graphical User Interface (GUI).",
      shortUrdu: "کمانڈ لائن انٹرفیس (CLI) اور گرافیکل یوزر انٹرفیس (GUI) کا موازنہ کریں۔"
    },
    {
      subjectTerm: "MS-DOS Operating System",
      question: "Which of the following is a classic example of a Command Line Interface (CLI) operating system?",
      options: ["MS-DOS", "Windows 11", "macOS", "Android OS"],
      answerKey: "MS-DOS",
      shortQuestion: "State the main characteristics of the MS-DOS operating system.",
      shortUrdu: "ایم ایس ڈاس (MS-DOS) آپریٹنگ سسٹم کی بنیادی خصوصیات لکھیں۔"
    },
    {
      subjectTerm: "Booting Process",
      question: "Which process loads the core Operating System files into computer RAM when the computer power is switched on?",
      options: ["Booting Process", "Compiling Process", "Formatting Process", "Defragmentation"],
      answerKey: "Booting Process",
      shortQuestion: "Explain the term 'Booting' in Operating System terminology.",
      shortUrdu: "آپریٹنگ سسٹم کے تناظر میں 'بوٹنگ' (Booting) کے عمل کی وضاحت کریں۔"
    },
    {
      subjectTerm: "Kernel",
      question: "What is the central core component of an Operating System that has complete control over everything in the system?",
      options: ["Kernel", "Shell", "Desktop Manager", "File Explorer"],
      answerKey: "Kernel",
      shortQuestion: "What is the role of the Kernel in an Operating System?",
      shortUrdu: "آپریٹنگ سسٹم میں 'کرنل' (Kernel) کا کیا کردار ہے؟"
    }
  ];
}

function extractSentences(text) {
  return text
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && s.length < 250);
}

function sanitizeGeneratedOutput(data, config) {
  return {
    mcqs: Array.isArray(data.mcqs) ? data.mcqs.slice(0, config.mcqCount) : [],
    shortQuestions: Array.isArray(data.shortQuestions) ? data.shortQuestions.slice(0, config.shortCount) : [],
    longQuestions: Array.isArray(data.longQuestions) ? data.longQuestions.slice(0, config.longCount) : [],
    trueFalse: Array.isArray(data.trueFalse) ? data.trueFalse.slice(0, config.trueFalseCount) : [],
    fillBlanks: Array.isArray(data.fillBlanks) ? data.fillBlanks.slice(0, config.fillBlanksCount) : []
  };
}

async function generateWithGeminiAPI({
  sourceText,
  pdfBase64,
  mcqCount,
  mcqMarks,
  shortCount,
  shortMarks,
  longCount,
  longMarks,
  trueFalseCount,
  trueFalseMarks,
  fillBlanksCount,
  fillBlanksMarks,
  difficulty,
  cognitiveLevel,
  language,
  apiKey
}) {
  const isBlend = language.includes("Blend") || language.includes("Bilingual");
  const isUrduOnly = language === "Urdu";

  const parts = [];

  if (pdfBase64) {
    parts.push({
      inlineData: {
        mimeType: "application/pdf",
        data: pdfBase64
      }
    });
  }

  const prompt = `You are a Senior Board Examination Controller and Master Assessment Paper Setter (BISE / Federal Board Standard).
Your task is to scan the textbook document content below and construct an authentic, high-yield, Board-Exam-level examination paper.

USER TOPIC INSTRUCTION (CHAPTER NUMBER, TOPIC NUMBER & NAME):
"""
${sourceText ? sourceText : "Generate an important Board Exam paper based on the attached textbook document."}
"""

REQUIREMENTS:
- MCQs Count: ${mcqCount} (Each ${mcqMarks} mark(s))
- Short Answer Questions Count: ${shortCount} (Each ${shortMarks} mark(s))
- Long / Essay Questions Count: ${longCount} (Each ${longMarks} mark(s))

Output MUST be a single raw JSON object matching this schema:
{
  "mcqs": [{"id": "mcq-1", "question": "Question English", "options": ["A", "B", "C", "D"], "correctIndex": 0, "answerKey": "Answer", "marks": ${mcqMarks}}],
  "shortQuestions": [{"id": "short-1", "question": "Question English", "answerKey": "Answer", "marks": ${shortMarks}}],
  "longQuestions": [{"id": "long-1", "question": "Question English", "subParts": ["a) Sub English"], "answerKey": "Answer", "marks": ${longMarks}}]
}`;

  parts.push({ text: prompt });

  const modelUrls = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`
  ];

  for (const url of modelUrls) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          return sanitizeGeneratedOutput(JSON.parse(cleanJson), {
            mcqCount, mcqMarks, shortCount, shortMarks, longCount, longMarks,
            trueFalseCount, trueFalseMarks, fillBlanksCount, fillBlanksMarks
          });
        }
      }
    } catch (e) {
      // Continue to next endpoint candidate
    }
  }

  throw new Error("Gemini API call failed");
}

