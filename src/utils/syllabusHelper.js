/**
 * Utility helper to compute the syllabus / chapter / topic range for a test paper.
 * Examples:
 * - Full Chapter:
 *   - "Chapter 1 (Full Chapter)"
 *   - "Chapter 1 (Full Chapter - MCQs)"
 *   - "Chapter 1 (Full Chapter - Short Questions)"
 *   - "Chapter 1 (Full Chapter - Long Questions)"
 * - Partial Chapter:
 *   - "Chapter 1 (Topic: 1.1 to 1.4)"
 *   - "Chapter 1 (Topic: 1.1 to 1.4 - MCQs)"
 * - Multiple Chapters:
 *   - "Chapter 1, Chapter 2 (Full Chapter - MCQs)"
 *   - "Chapter 1 (Full Chapter), Chapter 2 (Topic: 2.1 to 2.3)"
 * - Full Book:
 *   - "Full Book (Complete Syllabus)"
 *   - "Full Book (MCQs)"
 */
export function computeSyllabusText(chapters = [], selectedTopicIds = [], options = {}) {
  // 1. Normalize options (supports string questionType or object with counts / type)
  let qType = null;
  let mcqCount = 0;
  let shortCount = 0;
  let longCount = 0;

  if (typeof options === 'string') {
    qType = options;
  } else if (options && typeof options === 'object') {
    qType = options.questionType || null;
    mcqCount = options.mcqCount ?? (options.mcqs?.length ?? 0);
    shortCount = options.shortCount ?? (options.shortQuestions?.length ?? 0);
    longCount = options.longCount ?? (options.longQuestions?.length ?? 0);
  }

  // 2. Determine question type suffix if paper is exclusively one type
  let typeSuffix = '';
  if (qType === 'MCQ' || (mcqCount > 0 && shortCount === 0 && longCount === 0)) {
    typeSuffix = 'MCQs';
  } else if (qType === 'SHORT' || (shortCount > 0 && mcqCount === 0 && longCount === 0)) {
    typeSuffix = 'Short Questions';
  } else if (qType === 'LONG' || (longCount > 0 && mcqCount === 0 && shortCount === 0)) {
    typeSuffix = 'Long Questions';
  }

  const getTid = (ch, t) => t.id || `${ch.id || ch.chapterNumber || 'ch'}-topic-${t.topicNumber || t.name}`;

  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return typeSuffix ? `Chapter 1 (Full Chapter - ${typeSuffix})` : 'Chapter 1 (Full Chapter)';
  }

  if (!selectedTopicIds || selectedTopicIds.length === 0) {
    return typeSuffix ? `Full Book (${typeSuffix})` : 'Full Book (Complete Syllabus)';
  }

  const selectedSet = new Set(selectedTopicIds);

  // 3. Check if ALL topics across ALL chapters are selected (Full Book)
  let totalBookTopics = 0;
  let totalMatchedBookTopics = 0;
  chapters.forEach(ch => {
    const chTopics = ch.topics || [];
    totalBookTopics += chTopics.length;
    chTopics.forEach(t => {
      if (selectedSet.has(getTid(ch, t))) {
        totalMatchedBookTopics++;
      }
    });
  });

  if (totalBookTopics > 0 && totalMatchedBookTopics === totalBookTopics && chapters.length > 1) {
    return typeSuffix ? `Full Book (${typeSuffix})` : 'Full Book (Complete Syllabus)';
  }

  const chapterEntries = [];

  // 4. Evaluate each chapter individually
  chapters.forEach(ch => {
    const chTopics = ch.topics || [];
    const matchedTopics = chTopics.filter(t => selectedSet.has(getTid(ch, t)));
    if (matchedTopics.length === 0) return;

    const chNum = ch.chapterNumber || ch.id || '1';

    // If ALL topics in this chapter are selected (or chapter has 0 topics) -> FULL CHAPTER!
    const isFullChapter = chTopics.length === 0 || matchedTopics.length === chTopics.length;

    if (isFullChapter) {
      chapterEntries.push({
        chNum,
        isFull: true,
        text: 'Full Chapter'
      });
      return;
    }

    // Partial chapter selection: check if matched topics are contiguous
    const indices = matchedTopics
      .map(t => chTopics.findIndex(orig => getTid(ch, orig) === getTid(ch, t)))
      .filter(idx => idx !== -1)
      .sort((a, b) => a - b);

    const isContiguous = indices.length > 1 && (indices[indices.length - 1] - indices[0] === indices.length - 1);

    if (isContiguous) {
      const startTopic = chTopics[indices[0]];
      const endTopic = chTopics[indices[indices.length - 1]];
      const startNum = startTopic.topicNumber || `${chNum}.${indices[0] + 1}`;
      const endNum = endTopic.topicNumber || `${chNum}.${indices[indices.length - 1] + 1}`;
      chapterEntries.push({
        chNum,
        isFull: false,
        text: `Topic: ${startNum} to ${endNum}`
      });
    } else if (matchedTopics.length === 1) {
      const singleNum = matchedTopics[0].topicNumber || `${chNum}.1`;
      chapterEntries.push({
        chNum,
        isFull: false,
        text: `Topic: ${singleNum}`
      });
    } else {
      // Discrete non-contiguous topics
      const topicNumbers = matchedTopics
        .map(t => t.topicNumber || t.name)
        .filter(Boolean);
      chapterEntries.push({
        chNum,
        isFull: false,
        text: `Topics: ${topicNumbers.join(', ')}`
      });
    }
  });

  if (chapterEntries.length === 0) {
    return typeSuffix ? `Complete Syllabus (${typeSuffix})` : 'Complete Syllabus';
  }

  // 5. Build final clean syllabus text
  // Case A: Exactly 1 chapter selected
  if (chapterEntries.length === 1) {
    const entry = chapterEntries[0];
    if (entry.isFull) {
      return typeSuffix 
        ? `Chapter ${entry.chNum} (Full Chapter - ${typeSuffix})`
        : `Chapter ${entry.chNum} (Full Chapter)`;
    } else {
      return typeSuffix
        ? `Chapter ${entry.chNum} (${entry.text} - ${typeSuffix})`
        : `Chapter ${entry.chNum} (${entry.text})`;
    }
  }

  // Case B: Multiple chapters selected, all are full
  const allFull = chapterEntries.every(e => e.isFull);
  if (allFull) {
    const chList = chapterEntries.map(e => `Chapter ${e.chNum}`).join(', ');
    return typeSuffix
      ? `${chList} (Full Chapter - ${typeSuffix})`
      : `${chList} (Full Chapter)`;
  }

  // Case C: Mixed chapters (some full, some partial)
  const formattedEntries = chapterEntries.map(e => `Chapter ${e.chNum} (${e.text})`);
  const joined = formattedEntries.join(', ');
  return typeSuffix ? `${joined} - ${typeSuffix}` : joined;
}

/**
 * Formats a clean, descriptive, filesystem-safe filename for a test paper:
 * Format: [Class]_[Subject]_[Chapter_and_Topic_or_Syllabus]_Test_Paper.[extension]
 * Example: "12th_Class_Computer_Science_Chapter_1_Full_Chapter_Test_Paper.pdf"
 */
export function formatPaperFileName(paperConfig = {}, extension = '') {
  // 1. Resolve Class / Grade
  const rawClass = paperConfig?.gradeClass || paperConfig?.selectedClass || '';
  let classPart = '';
  if (rawClass) {
    const cleanClass = rawClass.replace(/Class/i, '').trim();
    classPart = cleanClass ? `${cleanClass}_Class` : 'Class';
  }

  // 2. Resolve Subject
  const rawSubject = paperConfig?.subject || 'Paper';
  const subjectPart = rawSubject
    .replace(/[:*?"<>|\\/]/g, '')
    .replace(/\s+/g, '_')
    .trim();

  // 3. Resolve Chapter & Topic / Syllabus
  let rawSyllabus = (paperConfig?.syllabus || '').trim();
  if (!rawSyllabus || rawSyllabus.toLowerCase().includes('complete syllabus') || rawSyllabus.toLowerCase().includes('full book')) {
    rawSyllabus = 'Full_Book';
  }

  // Clean filesystem illegal characters (: * ? " < > | / \) and normalize
  const cleanSyllabus = rawSyllabus
    .replace(/[:*?"<>|\\/]/g, '-')
    .replace(/[()]/g, '')
    .replace(/[\s-]+/g, '_')
    .replace(/^_+|_+$/g, '');

  // 4. Combine parts: Class_Subject_Chapter_Topic_Test_Paper
  const parts = [classPart, subjectPart, cleanSyllabus, 'Test_Paper'].filter(Boolean);
  let baseName = parts.join('_').replace(/_+/g, '_');

  if (extension) {
    const ext = extension.startsWith('.') ? extension : `.${extension}`;
    return `${baseName}${ext}`;
  }
  return baseName;
}

