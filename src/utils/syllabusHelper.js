/**
 * Utility helper to compute the syllabus / chapter / topic range for a test paper.
 * Example outputs:
 * - "Chapter 1 (Topic: 1.1 to 1.6)"
 * - "Chapter 1 (Topic: 1.1 to 1.4), Chapter 2 (Topic: 2.1 to 2.3)"
 * - "Chapter 1 (Topics: 1.1, 1.3, 1.5)"
 */
export function computeSyllabusText(chapters = [], selectedTopicIds = []) {
  if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
    return 'Chapter 1 (Topic: 1.1 to 1.6)';
  }

  if (!selectedTopicIds || selectedTopicIds.length === 0) {
    return 'Full Book / Complete Syllabus';
  }

  const selectedSet = new Set(selectedTopicIds);
  const chapterEntries = [];

  const getTid = (ch, t) => t.id || `${ch.id || ch.chapterNumber || 'ch'}-topic-${t.topicNumber || t.name}`;

  chapters.forEach(ch => {
    const chTopics = ch.topics || [];
    const matchedTopics = chTopics.filter(t => selectedSet.has(getTid(ch, t)));
    if (matchedTopics.length === 0) return;

    const chNum = ch.chapterNumber || ch.id || '1';

    // If all topics in the chapter are selected (and more than 1 topic exists)
    if (matchedTopics.length === chTopics.length && chTopics.length > 1) {
      const firstNum = matchedTopics[0].topicNumber || `${chNum}.1`;
      const lastNum = matchedTopics[matchedTopics.length - 1].topicNumber || `${chNum}.${matchedTopics.length}`;
      chapterEntries.push(`Chapter ${chNum} (Topic: ${firstNum} to ${lastNum})`);
      return;
    }

    // Check if matched topics are contiguous within the chapter's topic array
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
      chapterEntries.push(`Chapter ${chNum} (Topic: ${startNum} to ${endNum})`);
    } else if (matchedTopics.length === 1) {
      const singleNum = matchedTopics[0].topicNumber || `${chNum}.1`;
      chapterEntries.push(`Chapter ${chNum} (Topic: ${singleNum})`);
    } else {
      // Discrete topics
      const topicNumbers = matchedTopics
        .map(t => t.topicNumber || t.name)
        .filter(Boolean);
      chapterEntries.push(`Chapter ${chNum} (Topics: ${topicNumbers.join(', ')})`);
    }
  });

  return chapterEntries.length > 0 ? chapterEntries.join(', ') : 'Complete Syllabus';
}
