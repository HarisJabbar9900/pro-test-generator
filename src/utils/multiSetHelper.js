/**
 * Multi-Set Paper & Answer Key Helper
 * Generates 4 deterministic variations (Sets A, B, C, D) with unique Paper Codes
 * to prevent cheating in examination halls while keeping 100% accurate Answer Keys.
 */

// Simple seeded pseudo-random number generator for deterministic shuffling
function createPrng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Fisher-Yates shuffle with PRNG
function shuffleArray(array, prng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Resolve correct index from an MCQ object
export function getMcqCorrectIndex(q) {
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
}

const LETTERS = ['A', 'B', 'C', 'D'];

/**
 * Generate 4 distinct sets: A (Code 101), B (Code 102), C (Code 103), D (Code 104)
 */
export function generateMultiSets(basePaperData = {}) {
  const mcqs = basePaperData.mcqs || [];
  const shortQuestions = basePaperData.shortQuestions || [];
  const longQuestions = basePaperData.longQuestions || [];

  const setConfigs = [
    { key: 'A', code: '101', name: 'Set A', color: 'emerald', seed: 101, shuffleOptions: false, shuffleOrder: false },
    { key: 'B', code: '102', name: 'Set B', color: 'blue', seed: 202, shuffleOptions: true, shuffleOrder: true },
    { key: 'C', code: '103', name: 'Set C', color: 'purple', seed: 303, shuffleOptions: true, shuffleOrder: true },
    { key: 'D', code: '104', name: 'Set D', color: 'amber', seed: 404, shuffleOptions: true, shuffleOrder: true }
  ];

  const sets = {};

  setConfigs.forEach(cfg => {
    if (cfg.key === 'A') {
      // Set A is the reference set
      sets.A = {
        key: 'A',
        code: cfg.code,
        name: cfg.name,
        color: cfg.color,
        mcqs: mcqs.map((q, idx) => ({
          ...q,
          originalIndex: idx,
          correctIndex: getMcqCorrectIndex(q)
        })),
        shortQuestions: [...shortQuestions],
        longQuestions: [...longQuestions]
      };
      return;
    }

    const prng = createPrng(cfg.seed);

    // 1. Process MCQs: Shuffle question order & shuffle options
    let processedMcqs = mcqs.map((q, origIdx) => {
      const options = Array.isArray(q.options) ? [...q.options] : [];
      const origCorrectIdx = getMcqCorrectIndex(q);

      if (options.length >= 2 && cfg.shuffleOptions) {
        // Create indexed options array
        const indexedOpts = options.map((opt, oIdx) => ({ opt, isCorrect: oIdx === origCorrectIdx }));
        const shuffledOpts = shuffleArray(indexedOpts, prng);
        
        const newOptions = shuffledOpts.map(item => item.opt);
        const newCorrectIdx = shuffledOpts.findIndex(item => item.isCorrect);

        return {
          ...q,
          originalIndex: origIdx,
          options: newOptions,
          correctIndex: newCorrectIdx,
          answer: newCorrectIdx >= 0 ? LETTERS[newCorrectIdx] : q.answer
        };
      }

      return {
        ...q,
        originalIndex: origIdx,
        correctIndex: origCorrectIdx
      };
    });

    if (cfg.shuffleOrder && processedMcqs.length > 1) {
      processedMcqs = shuffleArray(processedMcqs, prng);
    }

    // 2. Shuffle short questions order slightly for Sets B, C, D
    let processedShorts = [...shortQuestions];
    if (cfg.shuffleOrder && processedShorts.length > 2) {
      processedShorts = shuffleArray(processedShorts, prng);
    }

    // 3. Shuffle long questions order slightly
    let processedLongs = [...longQuestions];
    if (cfg.shuffleOrder && processedLongs.length > 2) {
      processedLongs = shuffleArray(processedLongs, prng);
    }

    sets[cfg.key] = {
      key: cfg.key,
      code: cfg.code,
      name: cfg.name,
      color: cfg.color,
      mcqs: processedMcqs,
      shortQuestions: processedShorts,
      longQuestions: processedLongs
    };
  });

  return sets;
}

/**
 * Format Answer Key comparison matrix for all 4 sets
 */
export function buildMultiSetComparisonMatrix(multiSets) {
  if (!multiSets || !multiSets.A) return [];

  const setA = multiSets.A.mcqs || [];
  const setB = multiSets.B?.mcqs || [];
  const setC = multiSets.C?.mcqs || [];
  const setD = multiSets.D?.mcqs || [];

  return setA.map((qA, idx) => {
    const origId = qA.id || idx;

    const findKeyForOrig = (mcqList) => {
      const found = mcqList.find(q => (q.id && q.id === origId) || q.originalIndex === idx);
      if (!found) return { qNum: '-', ansLetter: '-' };
      const pos = mcqList.indexOf(found) + 1;
      const cIdx = typeof found.correctIndex === 'number' && found.correctIndex >= 0 ? found.correctIndex : -1;
      const letter = cIdx >= 0 ? LETTERS[cIdx] : (found.answer || '-');
      return { qNum: pos, ansLetter: letter };
    };

    const cIdxA = typeof qA.correctIndex === 'number' && qA.correctIndex >= 0 ? qA.correctIndex : -1;
    const ansA = cIdxA >= 0 ? LETTERS[cIdxA] : (qA.answer || '-');

    return {
      setA: { qNum: idx + 1, ansLetter: ansA },
      setB: findKeyForOrig(setB),
      setC: findKeyForOrig(setC),
      setD: findKeyForOrig(setD),
      questionText: qA.question || qA.text || `Question ${idx + 1}`
    };
  });
}
