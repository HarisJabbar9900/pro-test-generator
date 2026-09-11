// Question Bank Service & LocalStorage Repository
import { CHAPTER_1_NEW_TOPICS, CHAPTER_1_EXERCISE_LONGS } from './chapter1TopicsData.js';
import { CHAPTER_2_NEW_TOPICS } from './chapter2TopicsData.js';
import { CLASS_11_CHAPTER_1_TOPICS } from './class11Chapter1Data.js';
import { CLASS_11_CHAPTER_2_TOPICS } from './class11Chapter2Data.js';
import { CLASS_11_UNITS_3_TO_9_CHAPTERS } from './class11Units3To9Data.js';
const STORAGE_KEY = 'papergen_pro_question_bank_v5';

// Filter out dummy starter sample questions and any topics that have 0 questions
export function stripDummyQuestions(bank) {
  if (!bank || typeof bank !== 'object') return bank;
  const isDummyId = (id) => !id || /^(?:p|c|cs|b|m)\d+-\d+/i.test(id);

  Object.keys(bank).forEach(cls => {
    // Deduplicate subjects with same name within the class
    if (Array.isArray(bank[cls]?.subjects)) {
      const seenSubNames = new Set();
      bank[cls].subjects = bank[cls].subjects.filter(s => {
        const normName = (s.name || '').toLowerCase().trim();
        if (seenSubNames.has(normName)) return false;
        seenSubNames.add(normName);
        return true;
      });
    }

    (bank[cls]?.subjects || []).forEach(sub => {
      if (Array.isArray(sub.chapters)) {
        sub.chapters.forEach(ch => {
          if (Array.isArray(ch.topics)) {
            ch.topics.forEach(top => {
              if (Array.isArray(top.mcqs)) {
                top.mcqs = top.mcqs.filter(q => !isDummyId(q.id));
              } else {
                top.mcqs = [];
              }
              if (Array.isArray(top.shortQuestions)) {
                top.shortQuestions = top.shortQuestions.filter(q => !isDummyId(q.id));
              } else {
                top.shortQuestions = [];
              }
              if (Array.isArray(top.longQuestions)) {
                top.longQuestions = top.longQuestions.filter(q => !isDummyId(q.id));
              } else {
                top.longQuestions = [];
              }
            });

            // Filter out empty dummy topics (only keep topics that have questions)
            ch.topics = ch.topics.filter(top => {
              const totalQ = (top.mcqs?.length || 0) + (top.shortQuestions?.length || 0) + (top.longQuestions?.length || 0);
              return totalQ > 0;
            });
          }
        });

        // Filter out chapters that have no topics
        sub.chapters = sub.chapters.filter(ch => (ch.topics || []).length > 0);
      }
    });
  });
  return bank;
}

// Clean Initial Question Bank without dummy questions or dummy topics
export const INITIAL_QUESTION_BANK = {
  "9th": {
    "className": "9th Class",
    "subjects": [
      { "id": "cs-9", "name": "Computer Science", "icon": "Monitor", "chapters": [] },
      { "id": "phy-9", "name": "Physics", "icon": "Atom", "chapters": [] },
      { "id": "chem-9", "name": "Chemistry", "icon": "FlaskConical", "chapters": [] },
      { "id": "bio-9", "name": "Biology", "icon": "Dna", "chapters": [] },
      { "id": "math-9", "name": "Mathematics", "icon": "Calculator", "chapters": [] },
      { "id": "eng-9", "name": "English", "icon": "BookOpen", "chapters": [] },
      { "id": "urdu-9", "name": "Urdu", "icon": "BookOpen", "chapters": [] },
      { "id": "isl-9", "name": "Islamiat", "icon": "BookOpen", "chapters": [] },
      { "id": "pak-9", "name": "Pak Studies", "icon": "BookOpen", "chapters": [] }
    ]
  },
  "10th": {
    "className": "10th Class",
    "subjects": [
      { "id": "cs-10", "name": "Computer Science", "icon": "Monitor", "chapters": [] },
      { "id": "phy-10", "name": "Physics", "icon": "Atom", "chapters": [] },
      { "id": "chem-10", "name": "Chemistry", "icon": "FlaskConical", "chapters": [] },
      { "id": "bio-10", "name": "Biology", "icon": "Dna", "chapters": [] },
      { "id": "math-10", "name": "Mathematics", "icon": "Calculator", "chapters": [] },
      { "id": "eng-10", "name": "English", "icon": "BookOpen", "chapters": [] },
      { "id": "urdu-10", "name": "Urdu", "icon": "BookOpen", "chapters": [] },
      { "id": "isl-10", "name": "Islamiat", "icon": "BookOpen", "chapters": [] },
      { "id": "pak-10", "name": "Pak Studies", "icon": "BookOpen", "chapters": [] }
    ]
  },
  "11th": {
    "className": "11th Class",
    "subjects": [
      { 
        "id": "cs-11", 
        "name": "Computer Science", 
        "icon": "Monitor", 
        "chapters": [
          {
            "id": "cs-11-ch1",
            "chapterNumber": 1,
            "name": "Software Development",
            "topics": CLASS_11_CHAPTER_1_TOPICS
          },
          {
            "id": "cs-11-ch2",
            "chapterNumber": 2,
            "name": "Python Programming",
            "topics": CLASS_11_CHAPTER_2_TOPICS
          },
          ...CLASS_11_UNITS_3_TO_9_CHAPTERS
        ] 
      },
      { "id": "phy-11", "name": "Physics", "icon": "Atom", "chapters": [] },
      { "id": "chem-11", "name": "Chemistry", "icon": "FlaskConical", "chapters": [] },
      { "id": "bio-11", "name": "Biology", "icon": "Dna", "chapters": [] },
      { "id": "math-11", "name": "Mathematics", "icon": "Calculator", "chapters": [] },
      { "id": "eng-11", "name": "English", "icon": "BookOpen", "chapters": [] },
      { "id": "urdu-11", "name": "Urdu", "icon": "BookOpen", "chapters": [] },
      { "id": "isl-11", "name": "Islamiat", "icon": "BookOpen", "chapters": [] }
    ]
  },
  "12th": {
    "className": "12th Class",
    "subjects": [
      { 
        "id": "cs-12", 
        "name": "Computer Science", 
        "icon": "Monitor", 
        "chapters": [
          {
            "id": "cs-12-ch1",
            "chapterNumber": 1,
            "name": "Computer Networks",
            "topics": CHAPTER_1_NEW_TOPICS
          },
          {
            "id": "cs-12-ch2",
            "chapterNumber": 2,
            "name": "Computational Thinking & Algorithms",
            "topics": CHAPTER_2_NEW_TOPICS
          }
        ] 
      },
      { "id": "phy-12", "name": "Physics", "icon": "Atom", "chapters": [] },
      { "id": "chem-12", "name": "Chemistry", "icon": "FlaskConical", "chapters": [] },
      { "id": "bio-12", "name": "Biology", "icon": "Dna", "chapters": [] },
      { "id": "math-12", "name": "Mathematics", "icon": "Calculator", "chapters": [] },
      { "id": "eng-12", "name": "English", "icon": "BookOpen", "chapters": [] },
      { "id": "urdu-12", "name": "Urdu", "icon": "BookOpen", "chapters": [] },
      { "id": "pak-12", "name": "Pak Studies", "icon": "BookOpen", "chapters": [] }
    ]
  }
};

// Normalize subject to have chapters with topics
function normalizeSubject(subject) {
  if (!subject) return subject;
  if (!subject.chapters || !Array.isArray(subject.chapters)) {
    // Convert old direct topics array into chapters
    const oldTopics = subject.topics || [];
    subject.chapters = [
      {
        id: `${subject.id}-ch1`,
        chapterNumber: 1,
        name: "General Chapter 1",
        topics: oldTopics.map((t, idx) => ({
          ...t,
          topicNumber: t.topicNumber || `1.${idx + 1}`
        }))
      }
    ];
  }
  return subject;
}

// Merge Chapter 1 new topics (1.7 to 1.16) into any existing bank without duplicates across all classes
export function mergeChapter1NewTopics(bank) {
  if (!bank || typeof bank !== 'object') return { bank, changed: false };

  let changed = false;

  Object.keys(bank).forEach(clsKey => {
    const cls = bank[clsKey];
    if (!cls || !Array.isArray(cls.subjects)) return;

    cls.subjects.forEach(sub => {
      const isCs = sub.id?.includes('computer') || sub.id?.startsWith('cs-') || sub.name?.toLowerCase().includes('computer');
      if (isCs) {
        normalizeSubject(sub);
        if (!sub.chapters) sub.chapters = [];

        // Handle 11th Class Computer Science - Chapter 1: Software Development & Chapter 2: Python Programming
        if (clsKey === '11th') {
          // Chapter 1: Software Development
          let ch11 = sub.chapters.find(c => 
            c.chapterNumber === 1 || 
            (c.name && c.name.toLowerCase().includes('software')) ||
            (c.id && c.id.includes('cs-11-ch1'))
          );
          if (!ch11) {
            ch11 = {
              id: "cs-11-ch1",
              chapterNumber: 1,
              name: "Software Development",
              topics: []
            };
            sub.chapters.unshift(ch11);
            changed = true;
          }
          if (ch11) {
            if (!ch11.topics) ch11.topics = [];
            CLASS_11_CHAPTER_1_TOPICS.forEach(newTopic => {
              const existingTopic = ch11.topics.find(t => 
                t.topicNumber?.trim() === newTopic.topicNumber.trim() || 
                t.name?.toLowerCase().trim() === newTopic.name.toLowerCase().trim() ||
                t.id === newTopic.id
              );
              if (!existingTopic) {
                ch11.topics.push(JSON.parse(JSON.stringify(newTopic)));
                changed = true;
              } else {
                if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                  existingTopic.id = newTopic.id;
                  changed = true;
                }
                if (!existingTopic.mcqs) existingTopic.mcqs = [];
                const existingMcqSet = new Set(existingTopic.mcqs.map(m => m.question?.trim().toLowerCase()));
                (newTopic.mcqs || []).forEach(m => {
                  if (!existingMcqSet.has(m.question?.trim().toLowerCase())) {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                    changed = true;
                  }
                });

                if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
                const existingShortSet = new Set(existingTopic.shortQuestions.map(s => s.question?.trim().toLowerCase()));
                (newTopic.shortQuestions || []).forEach(s => {
                  if (!existingShortSet.has(s.question?.trim().toLowerCase())) {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                    changed = true;
                  }
                });
              }
            });
          }

          // Chapter 2: Python Programming
          let ch11_2 = sub.chapters.find(c => 
            c.chapterNumber === 2 || 
            (c.name && c.name.toLowerCase().includes('python')) ||
            (c.id && c.id.includes('cs-11-ch2'))
          );
          if (!ch11_2) {
            ch11_2 = {
              id: "cs-11-ch2",
              chapterNumber: 2,
              name: "Python Programming",
              topics: []
            };
            const ch1Idx = sub.chapters.indexOf(ch11);
            if (ch1Idx !== -1) {
              sub.chapters.splice(ch1Idx + 1, 0, ch11_2);
            } else {
              sub.chapters.push(ch11_2);
            }
            changed = true;
          }
          if (ch11_2) {
            if (!ch11_2.name || !ch11_2.name.includes("Python")) {
              ch11_2.name = "Python Programming";
              ch11_2.chapterNumber = 2;
              changed = true;
            }
            if (!ch11_2.topics) ch11_2.topics = [];
            CLASS_11_CHAPTER_2_TOPICS.forEach(newTopic => {
              const existingTopic = ch11_2.topics.find(t => 
                t.topicNumber?.trim() === newTopic.topicNumber.trim() || 
                t.name?.toLowerCase().trim() === newTopic.name.toLowerCase().trim() ||
                t.id === newTopic.id
              );
              if (!existingTopic) {
                ch11_2.topics.push(JSON.parse(JSON.stringify(newTopic)));
                changed = true;
              } else {
                if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                  existingTopic.id = newTopic.id;
                  changed = true;
                }
                if (!existingTopic.mcqs) existingTopic.mcqs = [];
                const existingMcqSet = new Set(existingTopic.mcqs.map(m => m.question?.trim().toLowerCase()));
                (newTopic.mcqs || []).forEach(m => {
                  if (!existingMcqSet.has(m.question?.trim().toLowerCase())) {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                    changed = true;
                  }
                });

                if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
                const existingShortSet = new Set(existingTopic.shortQuestions.map(s => s.question?.trim().toLowerCase()));
                (newTopic.shortQuestions || []).forEach(s => {
                  if (!existingShortSet.has(s.question?.trim().toLowerCase())) {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                    changed = true;
                  }
                });
              }
            });
          }

          // Units 3 to 9
          CLASS_11_UNITS_3_TO_9_CHAPTERS.forEach(newChapter => {
            let existingCh = sub.chapters.find(c =>
              c.chapterNumber === newChapter.chapterNumber ||
              c.id === newChapter.id ||
              (c.name && newChapter.name && c.name.toLowerCase().trim() === newChapter.name.toLowerCase().trim())
            );

            if (!existingCh) {
              sub.chapters.push(JSON.parse(JSON.stringify(newChapter)));
              changed = true;
            } else {
              if (existingCh.name !== newChapter.name) {
                existingCh.name = newChapter.name;
                changed = true;
              }
              if (!existingCh.id) {
                existingCh.id = newChapter.id;
                changed = true;
              }
              if (!existingCh.topics) existingCh.topics = [];

              // Clean up legacy unstructured placeholder topics if any
              existingCh.topics = existingCh.topics.filter(t => t.topicNumber !== 'Exercise' && !t.id?.includes('topic-exercise'));

              (newChapter.topics || []).forEach(newTopic => {
                const existingTopic = existingCh.topics.find(t =>
                  t.topicNumber?.trim() === newTopic.topicNumber?.trim() ||
                  t.id === newTopic.id ||
                  (t.name && newTopic.name && t.name.toLowerCase().trim() === newTopic.name.toLowerCase().trim())
                );

                if (!existingTopic) {
                  existingCh.topics.push(JSON.parse(JSON.stringify(newTopic)));
                  changed = true;
                } else {
                  if (!existingTopic.id || existingTopic.id !== newTopic.id) {
                    existingTopic.id = newTopic.id;
                    changed = true;
                  }
                  if (existingTopic.name !== newTopic.name) {
                    existingTopic.name = newTopic.name;
                    changed = true;
                  }
                  if (newTopic.isExercise) {
                    existingTopic.isExercise = true;
                    existingTopic.category = 'exercise';
                  } else {
                    delete existingTopic.isExercise;
                    delete existingTopic.category;
                  }

                  if (!existingTopic.mcqs) existingTopic.mcqs = [];
                  const existingMcqSet = new Set(existingTopic.mcqs.map(m => m.question?.trim().toLowerCase()));
                  (newTopic.mcqs || []).forEach(m => {
                    if (!existingMcqSet.has(m.question?.trim().toLowerCase())) {
                      existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                      changed = true;
                    }
                  });

                  if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
                  const existingShortSet = new Set(existingTopic.shortQuestions.map(s => s.question?.trim().toLowerCase()));
                  (newTopic.shortQuestions || []).forEach(s => {
                    if (!existingShortSet.has(s.question?.trim().toLowerCase())) {
                      existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                      changed = true;
                    }
                  });
                }
              });
            }
          });

          // Keep chapters ordered numerically
          sub.chapters.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));

          return;
        }

        let ch1 = sub.chapters.find(c => 
          c.chapterNumber === 1 || 
          (c.name && c.name.toLowerCase().includes('network')) ||
          (c.name && c.name.toLowerCase().includes('chap#1'))
        );

        if (!ch1 && clsKey === '12th') {
          ch1 = {
            id: `${sub.id}-ch1`,
            chapterNumber: 1,
            name: "Computer Networks",
            topics: []
          };
          sub.chapters.unshift(ch1);
          changed = true;
        }

        if (ch1 && clsKey === '12th') {
          if (!ch1.topics) ch1.topics = [];

          CHAPTER_1_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch1.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim() || 
              t.name?.toLowerCase().trim() === newTopic.name.toLowerCase().trim()
            );

            if (!existingTopic) {
              ch1.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              // Ensure topic ID is assigned
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              // Topic exists - ensure MCQs and short questions are populated
              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              const existingMcqSet = new Set(existingTopic.mcqs.map(m => m.question?.trim().toLowerCase()));
              (newTopic.mcqs || []).forEach(m => {
                if (!existingMcqSet.has(m.question?.trim().toLowerCase())) {
                  existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              const existingShortSet = new Set(existingTopic.shortQuestions.map(s => s.question?.trim().toLowerCase()));
              (newTopic.shortQuestions || []).forEach(s => {
                if (!existingShortSet.has(s.question?.trim().toLowerCase())) {
                  existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  changed = true;
                }
              });

              if (!existingTopic.longQuestions) existingTopic.longQuestions = [];
              const existingLongSet = new Set(existingTopic.longQuestions.map(l => (l.question || '').toLowerCase().trim()));
              (newTopic.longQuestions || []).forEach(l => {
                const norm = (l.question || '').toLowerCase().trim();
                if (!existingLongSet.has(norm)) {
                  existingTopic.longQuestions.push(JSON.parse(JSON.stringify(l)));
                  changed = true;
                }
              });
            }
          });

          // Merge Chapter 1 Exercise Long Questions strictly 1 per topic (no duplicates across chapter)
          CHAPTER_1_EXERCISE_LONGS.forEach(lq => {
            const matchedTopic = ch1.topics.find(t => 
              (t.topicNumber || '').trim() === lq.topicNumber.trim() || 
              (t.topicNumber || '').trim() === `Topic ${lq.topicNumber}`.trim() ||
              (t.name || '').toLowerCase().includes(lq.topicNumber.toLowerCase())
            );
            if (matchedTopic) {
              if (!matchedTopic.longQuestions) matchedTopic.longQuestions = [];
              const normQ = lq.question.split('||')[0].trim().toLowerCase();
              const exists = matchedTopic.longQuestions.some(existing => {
                const exNorm = (existing.question || '').split('||')[0].trim().toLowerCase();
                return exNorm === normQ || existing.id === lq.id;
              });
              if (!exists) {
                matchedTopic.longQuestions.push({
                  id: lq.id,
                  question: lq.question,
                  marks: lq.marks || 8
                });
                changed = true;
              }
            }
          });

          // Strictly deduplicate all MCQs, Shorts, and Longs in Chapter 1 topics so nothing repeats
          const seenCh1Mcqs = new Set();
          const seenCh1Shorts = new Set();
          const seenCh1Longs = new Set();
          ch1.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              const origLen = t.mcqs.length;
              t.mcqs = t.mcqs.filter(m => {
                const k = (m.question || '').split('||')[0].trim().toLowerCase();
                if (!k || seenCh1Mcqs.has(k)) return false;
                seenCh1Mcqs.add(k);
                return true;
              });
              if (t.mcqs.length !== origLen) changed = true;
            }
            if (Array.isArray(t.shortQuestions)) {
              const origLen = t.shortQuestions.length;
              t.shortQuestions = t.shortQuestions.filter(s => {
                const k = (s.question || '').split('||')[0].trim().toLowerCase();
                if (!k || seenCh1Shorts.has(k)) return false;
                seenCh1Shorts.add(k);
                return true;
              });
              if (t.shortQuestions.length !== origLen) changed = true;
            }
            if (Array.isArray(t.longQuestions)) {
              const origLen = t.longQuestions.length;
              t.longQuestions = t.longQuestions.filter(l => {
                const k = (l.question || '').split('||')[0].trim().toLowerCase();
                if (!k || seenCh1Longs.has(k)) return false;
                seenCh1Longs.add(k);
                return true;
              });
              if (t.longQuestions.length !== origLen) changed = true;
            }
          });

          // Ensure every single topic in ch1 has a unique, non-empty id
          ch1.topics.forEach((top, idx) => {
            if (!top.id) {
              top.id = `cs-ch1-topic-${top.topicNumber ? top.topicNumber.replace(/\s+/g, '-') : (idx + 1)}`;
              changed = true;
            }
          });

          // Sort numerically: 1.1, 1.2, ..., 1.16
          ch1.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            if (aParts[0] !== bParts[0]) return aParts[0] - bParts[0];
            return (aParts[1] || 0) - (bParts[1] || 0);
          });
        }

        // =====================================================================
        // CHAPTER 2: COMPUTATIONAL THINKING & ALGORITHMS
        // =====================================================================
        let ch2 = sub.chapters.find(c => 
          c.chapterNumber === 2 || 
          (c.name && c.name.toLowerCase().includes('computational')) ||
          (c.name && c.name.toLowerCase().includes('algorithm')) ||
          (c.name && c.name.toLowerCase().includes('chap#2'))
        );

        if (!ch2 && clsKey === '12th') {
          ch2 = {
            id: `${sub.id}-ch2`,
            chapterNumber: 2,
            name: "Computational Thinking & Algorithms",
            topics: []
          };
          sub.chapters.push(ch2);
          changed = true;
        }

        if (ch2 && clsKey === '12th') {
          if (!ch2.name || !ch2.name.includes("Computational")) {
            ch2.name = "Computational Thinking & Algorithms";
            ch2.chapterNumber = 2;
            changed = true;
          }
          if (!ch2.topics) ch2.topics = [];

          CHAPTER_2_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch2.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim() || 
              t.name?.toLowerCase().trim() === newTopic.name.toLowerCase().trim()
            );

            if (!existingTopic) {
              ch2.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              const existingMcqSet = new Set(existingTopic.mcqs.map(m => m.question?.trim().toLowerCase()));
              (newTopic.mcqs || []).forEach(m => {
                if (!existingMcqSet.has(m.question?.trim().toLowerCase())) {
                  existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              const existingShortSet = new Set(existingTopic.shortQuestions.map(s => s.question?.trim().toLowerCase()));
              (newTopic.shortQuestions || []).forEach(s => {
                if (!existingShortSet.has(s.question?.trim().toLowerCase())) {
                  existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  changed = true;
                }
              });
            }
          });

          // Ensure every single topic in ch2 has a unique, non-empty id
          ch2.topics.forEach((top, idx) => {
            if (!top.id) {
              top.id = `cs-ch2-topic-${top.topicNumber ? top.topicNumber.replace(/\s+/g, '-') : (idx + 1)}`;
              changed = true;
            }
          });

          // Sort numerically: 2.1, 2.2, ..., 2.12
          ch2.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            if (aParts[0] !== bParts[0]) return aParts[0] - bParts[0];
            return (aParts[1] || 0) - (bParts[1] || 0);
          });
        }

        // Keep chapters sorted by chapterNumber
        sub.chapters.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
      }
    });
  });

  return { bank, changed };
}

// Retrieve bank from localStorage or set initial
export function getQuestionBank() {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    let parsed;
    if (!raw) {
      parsed = JSON.parse(JSON.stringify(INITIAL_QUESTION_BANK));
    } else {
      parsed = stripDummyQuestions(JSON.parse(raw));
    }
    
    // Normalize each subject in all classes
    Object.keys(parsed).forEach(cls => {
      if (parsed[cls]?.subjects) {
        parsed[cls].subjects.forEach(normalizeSubject);
      }
    });

    // Ensure all standard classes and standard subjects exist, without injecting any dummy chapters or topics
    let hasMergedUpdates = false;
    Object.keys(INITIAL_QUESTION_BANK).forEach(cls => {
      if (!parsed[cls]) {
        parsed[cls] = JSON.parse(JSON.stringify(INITIAL_QUESTION_BANK[cls]));
        hasMergedUpdates = true;
      } else {
        if (!parsed[cls].subjects) parsed[cls].subjects = [];
        const initSubjects = INITIAL_QUESTION_BANK[cls].subjects || [];
        initSubjects.forEach(initSub => {
          let existingSub = parsed[cls].subjects.find(s => 
            s.id === initSub.id || s.name.toLowerCase().trim() === initSub.name.toLowerCase().trim()
          );
          if (!existingSub) {
            parsed[cls].subjects.push(JSON.parse(JSON.stringify(initSub)));
            hasMergedUpdates = true;
          }
        });
      }
    });

    // Merge Chapter 1 new topics (1.7 to 1.16)
    const { changed: ch1Changed } = mergeChapter1NewTopics(parsed);

    if (hasMergedUpdates || ch1Changed || !raw) {
      saveQuestionBank(parsed);
    }

    return parsed;
  } catch (err) {
    console.error("Failed to load question bank:", err);
    return INITIAL_QUESTION_BANK;
  }
}

// Save bank to localStorage
export function saveQuestionBank(bank) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
  } catch (err) {
    console.error("Failed to save question bank to localStorage:", err);
  }
}

// Add Class to Bank
export function addClassToBank(classKey, className) {
  const bank = getQuestionBank();
  const key = classKey.trim();
  if (!key || bank[key]) return { success: false, message: "Class already exists or key is invalid" };

  bank[key] = {
    className: className?.trim() || `${key} Class`,
    subjects: []
  };
  saveQuestionBank(bank);
  return { success: true, bank };
}

// Delete Class from Bank
export function deleteClassFromBank(classKey) {
  const bank = getQuestionBank();
  if (!bank[classKey]) return bank;
  delete bank[classKey];
  saveQuestionBank(bank);
  return bank;
}

// Add Subject to a Class
export function addSubjectToClass(classId, subjectName, icon = "BookOpen") {
  const bank = getQuestionBank();
  if (!bank[classId]) return null;

  const newSubjectId = `${classId}-${subjectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
  const newSubject = {
    id: newSubjectId,
    name: subjectName,
    icon,
    chapters: []
  };

  bank[classId].subjects.push(newSubject);
  saveQuestionBank(bank);
  return bank;
}

// Delete Subject
export function deleteSubjectFromClass(classId, subjectId) {
  const bank = getQuestionBank();
  if (!bank[classId]) return bank;

  bank[classId].subjects = bank[classId].subjects.filter(s => s.id !== subjectId);
  saveQuestionBank(bank);
  return bank;
}

// Add Chapter to Subject
export function addChapterToSubject(classId, subjectId, chapterNumber, chapterName) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return null;

  normalizeSubject(subject);

  const num = Number(chapterNumber) || (subject.chapters.length + 1);
  const newChapter = {
    id: `${subjectId}-ch-${Date.now()}`,
    chapterNumber: num,
    name: chapterName,
    topics: []
  };

  subject.chapters.push(newChapter);
  saveQuestionBank(bank);
  return bank;
}

// Delete Chapter
export function deleteChapterFromSubject(classId, subjectId, chapterId) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return bank;

  normalizeSubject(subject);
  subject.chapters = subject.chapters.filter(c => c.id !== chapterId);
  saveQuestionBank(bank);
  return bank;
}

// Add Topic with explicit topicNumber (e.g., "1.1") and topicName
export function addTopicToChapter(classId, subjectId, chapterId, topicNumber, topicName) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return null;

  normalizeSubject(subject);
  const chapter = subject.chapters.find(c => c.id === chapterId);
  if (!chapter) return null;

  const tNum = topicNumber ? topicNumber.trim() : `${chapter.chapterNumber || 1}.${chapter.topics.length + 1}`;
  const newTopic = {
    id: `${chapterId}-t-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    topicNumber: tNum,
    name: topicName.trim(),
    mcqs: [],
    shortQuestions: [],
    longQuestions: []
  };

  chapter.topics.push(newTopic);
  saveQuestionBank(bank);
  return { bank, topicId: newTopic.id };
}

// Delete Topic
export function deleteTopicFromChapter(classId, subjectId, chapterId, topicId) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return bank;

  normalizeSubject(subject);
  const chapter = subject.chapters.find(c => c.id === chapterId);
  if (!chapter) return bank;

  chapter.topics = chapter.topics.filter(t => t.id !== topicId);
  saveQuestionBank(bank);
  return bank;
}

// Bulk Save Extracted Questions (from Word / TXT) directly into a Topic
export function importParsedQuestionsToTopic(classId, subjectId, chapterId, topicId, { mcqs = [], shortQuestions = [], longQuestions = [] }) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return { success: false, message: "Subject not found" };

  normalizeSubject(subject);
  const chapter = subject.chapters.find(c => c.id === chapterId);
  if (!chapter) return { success: false, message: "Chapter not found" };

  const topic = chapter.topics.find(t => t.id === topicId);
  if (!topic) return { success: false, message: "Target topic not found" };

  if (mcqs.length > 0) {
    topic.mcqs = [...(topic.mcqs || []), ...mcqs];
  }
  if (shortQuestions.length > 0) {
    topic.shortQuestions = [...(topic.shortQuestions || []), ...shortQuestions];
  }
  if (longQuestions.length > 0) {
    topic.longQuestions = [...(topic.longQuestions || []), ...longQuestions];
  }

  saveQuestionBank(bank);
  return { 
    success: true, 
    bank, 
    counts: { 
      mcqs: mcqs.length, 
      shortQuestions: shortQuestions.length, 
      longQuestions: longQuestions.length,
      total: mcqs.length + shortQuestions.length + longQuestions.length
    } 
  };
}

// Add Question (MCQ / Short / Long)
export function addQuestionToTopic(classId, subjectId, chapterId, topicId, type, qData) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return null;

  normalizeSubject(subject);
  const chapter = subject.chapters.find(c => c.id === chapterId);
  const topic = chapter?.topics.find(t => t.id === topicId);
  if (!topic) return null;

  const id = `q-${Date.now()}-${Math.floor(Math.random()*1000)}`;

  if (type === 'mcqs') {
    topic.mcqs.push({
      id,
      question: qData.question,
      options: qData.options || ["", "", "", ""],
      answer: qData.answer || "A",
      marks: Number(qData.marks) || 1
    });
  } else if (type === 'shortQuestions') {
    topic.shortQuestions.push({
      id,
      question: qData.question,
      marks: Number(qData.marks) || 2
    });
  } else if (type === 'longQuestions') {
    topic.longQuestions.push({
      id,
      question: qData.question,
      marks: Number(qData.marks) || 5
    });
  }

  saveQuestionBank(bank);
  return bank;
}

// Delete Question
export function deleteQuestionFromTopic(classId, subjectId, chapterId, topicId, type, questionId) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return bank;

  normalizeSubject(subject);
  const chapter = subject.chapters.find(c => c.id === chapterId);
  const topic = chapter?.topics.find(t => t.id === topicId);
  if (!topic || !topic[type]) return bank;

  topic[type] = topic[type].filter(q => q.id !== questionId);
  saveQuestionBank(bank);
  return bank;
}

// Update Question (MCQ / Short / Long) in a Topic
export function updateQuestionInTopic(classId, subjectId, chapterId, topicId, type, questionId, updatedData) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return { success: false, message: "Subject not found" };

  normalizeSubject(subject);
  const chapter = subject.chapters.find(c => c.id === chapterId);
  const topic = chapter?.topics.find(t => t.id === topicId);
  if (!topic || !Array.isArray(topic[type])) return { success: false, message: "Topic not found" };

  const qIdx = topic[type].findIndex(q => q.id === questionId);
  if (qIdx === -1) return { success: false, message: "Question not found" };

  topic[type][qIdx] = {
    ...topic[type][qIdx],
    ...updatedData
  };

  saveQuestionBank(bank);
  return { success: true, bank, updatedQuestion: topic[type][qIdx] };
}

// Helper to identify if a question or its topic represents textbook exercise material
export function isExerciseQuestion(q, topic = null) {
  if (!q) return false;
  if (q.isExercise === true || q.category === 'exercise') return true;
  if (q.id && typeof q.id === 'string' && (q.id.includes('tex') || q.id.includes('exercise') || q.id.includes('ex-'))) return true;

  const qText = (q.question || '').toLowerCase();
  if (qText.includes('(exercise)') || qText.includes('textbook exercise') || qText.includes('مشقی')) return true;

  if (topic) {
    if (topic.isExercise === true || topic.category === 'exercise') return true;
    const tNum = (topic.topicNumber || '').toLowerCase();
    const tName = (topic.name || '').toLowerCase();
    if (tNum.includes('exercise') || tNum.includes('ex') || tName.includes('exercise') || tName.includes('مشق') || tName.includes('textbook')) {
      return true;
    }
  }
  return false;
}

// Generate Paper from Topic Selections (flexible by topic counts or pooled counts)
export function generatePaperFromTopics(classId, subjectId, {
  selectedTopicIds = [],
  chapters = null,
  topicConfigs = {}, // { [topicId]: { mcqs: 2, shorts: 1, longs: 1 } }
  pooledMcqCount = 0,
  pooledMcqMarks = 1,
  pooledShortCount = 0,
  pooledShortMarks = 2,
  pooledLongCount = 0,
  pooledLongMarks = 5,
  useTopicSpecificCounts = false,
  isRandom = true,
  dataSelectionCategories = {},
  includeExerciseMcqs = true,
  includeExerciseShorts = true,
  includeTopicMcqs = true,
  includeTopicShorts = true
}) {
  const bank = getQuestionBank();
  
  // 1. Determine source chapters
  let sourceChapters = [];
  if (Array.isArray(chapters) && chapters.length > 0) {
    sourceChapters = [...chapters];
  } else {
    const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
    if (subject) {
      normalizeSubject(subject);
      sourceChapters = subject.chapters || [];
    }
  }

  // 2. If sourceChapters is empty or doesn't have the selectedTopicIds, scan the entire bank for chapters containing the selected topics!
  const hasSelectedTopic = (chs) => chs.some(c => (c.topics || []).some(t => selectedTopicIds.includes(t.id)));
  if (sourceChapters.length === 0 || (selectedTopicIds.length > 0 && !hasSelectedTopic(sourceChapters))) {
    Object.values(bank).forEach(cls => {
      (cls.subjects || []).forEach(sub => {
        (sub.chapters || []).forEach(ch => {
          if ((ch.topics || []).some(t => selectedTopicIds.length === 0 || selectedTopicIds.includes(t.id))) {
            if (!sourceChapters.some(sc => sc.id === ch.id || sc.name === ch.name)) {
              sourceChapters.push(ch);
            }
          }
        });
      });
    });
  }

  // Collect all topic references
  const allTopics = [];
  sourceChapters.forEach(ch => {
    (ch.topics || []).forEach(t => {
      allTopics.push({ ...t, chapterName: ch.name, chapterNumber: ch.chapterNumber });
    });
  });

  const targetTopics = allTopics.filter(t => 
    selectedTopicIds.length === 0 || selectedTopicIds.includes(t.id)
  );

  // Determine category filters for Exercise vs Topic questions
  const incExMcq = dataSelectionCategories?.exerciseMcqs !== undefined
    ? dataSelectionCategories.exerciseMcqs
    : (dataSelectionCategories?.exercise !== false && includeExerciseMcqs);

  const incExShort = dataSelectionCategories?.exerciseShorts !== undefined
    ? dataSelectionCategories.exerciseShorts
    : (dataSelectionCategories?.exercise !== false && includeExerciseShorts);

  const incTopMcq = dataSelectionCategories?.topicMcqs !== undefined
    ? dataSelectionCategories.topicMcqs
    : includeTopicMcqs;

  const incTopShort = dataSelectionCategories?.topicShorts !== undefined
    ? dataSelectionCategories.topicShorts
    : includeTopicShorts;

  let finalMcqs = [];
  let finalShorts = [];
  let finalLongs = [];

  const shuffle = (arr) => isRandom ? [...arr].sort(() => Math.random() - 0.5) : [...arr];

  if (useTopicSpecificCounts && Object.keys(topicConfigs).length > 0) {
    // Pick per topic
    targetTopics.forEach(t => {
      const conf = topicConfigs[t.id] || { mcqs: 0, shorts: 0, longs: 0 };
      
      const filteredMcqs = (t.mcqs || []).filter(m => {
        const isEx = isExerciseQuestion(m, t);
        if (isEx && !incExMcq) return false;
        if (!isEx && !incTopMcq) return false;
        return true;
      });
      const filteredShorts = (t.shortQuestions || []).filter(s => {
        const isEx = isExerciseQuestion(s, t);
        if (isEx && !incExShort) return false;
        if (!isEx && !incTopShort) return false;
        return true;
      });

      const mPool = shuffle(filteredMcqs);
      const sPool = shuffle(filteredShorts);
      const lPool = shuffle(t.longQuestions || []);

      finalMcqs.push(...mPool.slice(0, conf.mcqs || 0).map(q => ({ ...q, marks: pooledMcqMarks })));
      finalShorts.push(...sPool.slice(0, conf.shorts || 0).map(q => ({ ...q, marks: pooledShortMarks })));
      finalLongs.push(...lPool.slice(0, conf.longs || 0).map(q => ({ ...q, marks: pooledLongMarks })));
    });
  } else {
    // Pick pooled across selected topics
    let poolMcqs = [];
    let poolShorts = [];
    let poolLongs = [];

    targetTopics.forEach(t => {
      (t.mcqs || []).forEach(m => {
        const isEx = isExerciseQuestion(m, t);
        if (isEx && !incExMcq) return;
        if (!isEx && !incTopMcq) return;
        poolMcqs.push(m);
      });
      (t.shortQuestions || []).forEach(s => {
        const isEx = isExerciseQuestion(s, t);
        if (isEx && !incExShort) return;
        if (!isEx && !incTopShort) return;
        poolShorts.push(s);
      });
      poolLongs.push(...(t.longQuestions || []));
    });

    finalMcqs = shuffle(poolMcqs).slice(0, pooledMcqCount).map(q => ({ ...q, marks: pooledMcqMarks }));
    finalShorts = shuffle(poolShorts).slice(0, pooledShortCount).map(q => ({ ...q, marks: pooledShortMarks }));
    finalLongs = shuffle(poolLongs).slice(0, pooledLongCount).map(q => ({ ...q, marks: pooledLongMarks }));
  }

  return {
    mcqs: finalMcqs,
    shortQuestions: finalShorts,
    longQuestions: finalLongs
  };
}

// Export Bank as JSON
export function exportBankJSON() {
  const bank = getQuestionBank();
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bank, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `question_bank_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Restore Bank from JSON
export function importBankJSON(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed && (parsed["9th"] || parsed["10th"] || parsed["11th"] || parsed["12th"])) {
      saveQuestionBank(parsed);
      return { success: true, bank: parsed };
    }
    return { success: false, error: "Invalid backup format: Must contain class definitions." };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Bulk Import MCQs Parser
export function bulkImportMCQs(classId, subjectId, topicId, rawText) {
  const bank = getQuestionBank();
  const subject = bank[classId]?.subjects.find(s => s.id === subjectId);
  if (!subject) return { success: false, count: 0 };

  normalizeSubject(subject);
  let targetTopic = null;
  for (const ch of subject.chapters) {
    const t = ch.topics?.find(top => top.id === topicId);
    if (t) {
      targetTopic = t;
      break;
    }
  }

  if (!targetTopic || !rawText) return { success: false, count: 0 };

  const parsed = [];
  const blocks = rawText.split(/(?=\n\s*(?:Q\d+[:.]|\d+[\.\)]))\s*/gi);

  blocks.forEach(block => {
    const trimmed = block.trim();
    if (!trimmed || trimmed.length < 5) return;

    let answer = "A";
    const ansMatch = trimmed.match(/(?:Ans(?:wer)?|Correct)\s*[:=\-]?\s*\(?([A-Da-d])\)?/i);
    if (ansMatch) {
      answer = ansMatch[1].toUpperCase();
    }

    const textWithoutAns = trimmed.replace(/(?:Ans(?:wer)?|Correct)\s*[:=\-]?\s*\(?[A-Da-d]\)?/i, '').trim();
    const optMatches = textWithoutAns.match(/(?:[\(\[]?([A-Da-d])[\)\]\.]|\b([A-Da-d])[\.\)])\s*([^\n\(\[A-D]+)/g);

    let options = [];
    let questionText = textWithoutAns;

    if (optMatches && optMatches.length >= 2) {
      const firstOptIndex = textWithoutAns.search(/(?:[\(\[]?[A-Da-d][\)\]\.]|\b[A-Da-d][\.\)])\s*/);
      if (firstOptIndex > 0) {
        questionText = textWithoutAns.substring(0, firstOptIndex).replace(/^\s*(?:Q\d+[:.]|\d+[\.\)])\s*/i, '').trim();
      }
      options = optMatches.slice(0, 4).map(o => {
        return o.replace(/^\s*(?:[\(\[]?[A-Da-d][\)\]\.]|\b[A-Da-d][\.\)])\s*/i, '').trim();
      });
      while (options.length < 4) {
        options.push(`Option ${String.fromCharCode(65 + options.length)}`);
      }
    } else {
      const lines = textWithoutAns.split('\n').map(l => l.trim()).filter(Boolean);
      if (lines.length >= 2) {
        questionText = lines[0].replace(/^\s*(?:Q\d+[:.]|\d+[\.\)])\s*/i, '');
        options = lines.slice(1, 5);
        while (options.length < 4) {
          options.push(`Option ${String.fromCharCode(65 + options.length)}`);
        }
      } else {
        questionText = textWithoutAns;
        options = ["Option A", "Option B", "Option C", "Option D"];
      }
    }

    if (questionText) {
      parsed.push({
        id: `bulk-${Date.now()}-${Math.floor(Math.random()*10000)}`,
        question: questionText,
        options,
        answer,
        marks: 1
      });
    }
  });

  if (parsed.length > 0) {
    targetTopic.mcqs = [...(targetTopic.mcqs || []), ...parsed];
    saveQuestionBank(bank);
    return { success: true, count: parsed.length, bank };
  }

  return { success: false, count: 0 };
}
