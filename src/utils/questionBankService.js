// Question Bank Service & LocalStorage Repository
import { CHAPTER_1_NEW_TOPICS, CHAPTER_1_EXERCISE_LONGS } from './chapter1TopicsData.js';
import { CHAPTER_2_NEW_TOPICS } from './chapter2TopicsData.js';
import { CHAPTER_3_NEW_TOPICS } from './chapter3TopicsData.js';
import { CHAPTER_4_NEW_TOPICS } from './chapter4TopicsData.js';
import { CHAPTER_5_NEW_TOPICS } from './chapter5TopicsData.js';
import { CHAPTER_6_NEW_TOPICS } from './chapter6TopicsData.js';
import { CHAPTER_7_NEW_TOPICS } from './chapter7TopicsData.js';
import { CHAPTER_8_NEW_TOPICS } from './chapter8TopicsData.js';
import { CHAPTER_9_NEW_TOPICS } from './chapter9TopicsData.js';
import { CLASS_11_CHAPTER_1_TOPICS } from './class11Chapter1Data.js';
import { CLASS_11_CHAPTER_2_TOPICS } from './class11Chapter2Data.js';
import { CLASS_11_CHAPTER_3_TOPICS } from './class11Chapter3Data.js';
import { CLASS_11_UNITS_3_TO_9_CHAPTERS } from './class11Units3To9Data.js';
import { CLASS_11_OFFICIAL_EXERCISES } from './class11OfficialExercises.js';
const STORAGE_KEY = 'papergen_pro_question_bank_v10';

// Canonical builder for 11th Class Computer Science - All 9 Units
export function buildCleanClass11Chapters(existingChapters = []) {
  const baseChapters = [
    {
      id: "cs-11-ch1",
      chapterNumber: 1,
      name: "Software Development",
      topics: JSON.parse(JSON.stringify(CLASS_11_CHAPTER_1_TOPICS))
    },
    {
      id: "cs-11-ch2",
      chapterNumber: 2,
      name: "Python Programming",
      topics: JSON.parse(JSON.stringify(CLASS_11_CHAPTER_2_TOPICS))
    },
    {
      id: "cs-11-ch3",
      chapterNumber: 3,
      name: "Algorithms & Problem Solving",
      topics: JSON.parse(JSON.stringify(CLASS_11_CHAPTER_3_TOPICS))
    },
    ...JSON.parse(JSON.stringify(CLASS_11_UNITS_3_TO_9_CHAPTERS.filter(c => c.chapterNumber > 3)))
  ];

  // 1. Reset any stray exercise flags on base topic questions
  baseChapters.forEach(ch => {
    (ch.topics || []).forEach(t => {
      (t.mcqs || []).forEach(m => {
        m.category = 'topic';
        m.isExercise = false;
      });
      (t.shortQuestions || []).forEach(s => {
        s.category = 'topic';
        s.isExercise = false;
      });
      (t.longQuestions || []).forEach(l => {
        l.category = 'topic';
        l.isExercise = false;
      });
    });

    // 2. Inject exact official exercise questions into their designated topic
    const exData = CLASS_11_OFFICIAL_EXERCISES[ch.chapterNumber];
    if (exData) {
      (exData.mcqs || []).forEach(m => {
        const topic = ch.topics.find(t => t.topicNumber?.trim() === m.topicNumber?.trim());
        if (topic) {
          if (!topic.mcqs) topic.mcqs = [];
          const idx = topic.mcqs.findIndex(x => x.id === m.id || x.question?.trim().toLowerCase() === m.question?.trim().toLowerCase());
          if (idx !== -1) {
            topic.mcqs[idx] = JSON.parse(JSON.stringify(m));
          } else {
            topic.mcqs.push(JSON.parse(JSON.stringify(m)));
          }
        }
      });

      (exData.shortQuestions || []).forEach(s => {
        const topic = ch.topics.find(t => t.topicNumber?.trim() === s.topicNumber?.trim());
        if (topic) {
          if (!topic.shortQuestions) topic.shortQuestions = [];
          const idx = topic.shortQuestions.findIndex(x => x.id === s.id || x.question?.trim().toLowerCase() === s.question?.trim().toLowerCase());
          if (idx !== -1) {
            topic.shortQuestions[idx] = JSON.parse(JSON.stringify(s));
          } else {
            topic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
          }
        }
      });

      (exData.longQuestions || []).forEach(l => {
        const topic = ch.topics.find(t => t.topicNumber?.trim() === l.topicNumber?.trim());
        if (topic) {
          if (!topic.longQuestions) topic.longQuestions = [];
          const idx = topic.longQuestions.findIndex(x => x.id === l.id || x.question?.trim().toLowerCase() === l.question?.trim().toLowerCase());
          if (idx !== -1) {
            topic.longQuestions[idx] = JSON.parse(JSON.stringify(l));
          } else {
            topic.longQuestions.push(JSON.parse(JSON.stringify(l)));
          }
        }
      });
    }
  });

  // 3. Preserve any user custom questions from existingChapters
  if (Array.isArray(existingChapters)) {
    existingChapters.forEach(ech => {
      const targetCh = baseChapters.find(c => c.chapterNumber === ech.chapterNumber);
      if (!targetCh) return;
      (ech.topics || []).forEach(et => {
        const targetTopic = targetCh.topics.find(t => t.topicNumber?.trim() === et.topicNumber?.trim());
        if (!targetTopic) return;

        const customMcqs = (et.mcqs || []).filter(m => m.isCustom || m.custom || m.id?.startsWith('custom-'));
        const customShorts = (et.shortQuestions || []).filter(s => s.isCustom || s.custom || s.id?.startsWith('custom-'));
        const customLongs = (et.longQuestions || []).filter(l => l.isCustom || l.custom || l.id?.startsWith('custom-'));

        customMcqs.forEach(cm => {
          if (!targetTopic.mcqs.some(m => m.id === cm.id)) targetTopic.mcqs.push(cm);
        });
        customShorts.forEach(cs => {
          if (!targetTopic.shortQuestions.some(s => s.id === cs.id)) targetTopic.shortQuestions.push(cs);
        });
        if (customLongs.length > 0) {
          if (!targetTopic.longQuestions) targetTopic.longQuestions = [];
          customLongs.forEach(cl => {
            if (!targetTopic.longQuestions.some(l => l.id === cl.id)) targetTopic.longQuestions.push(cl);
          });
        }
      });
    });
  }

  // 4. Clean numerical sort of topics
  baseChapters.forEach(ch => {
    (ch.topics || []).sort((a, b) => {
      const parseNum = (str) => {
        const parts = (str || '').split('.').map(Number);
        return (parts[0] || 0) * 100 + (parts[1] || 0);
      };
      return parseNum(a.topicNumber) - parseNum(b.topicNumber);
    });
  });

  return baseChapters;
}

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
          }
        });
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
        "chapters": buildCleanClass11Chapters()
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
          },
          {
            "id": "cs-12-ch3",
            "chapterNumber": 3,
            "name": "Object Oriented Programming Using Python",
            "topics": CHAPTER_3_NEW_TOPICS
          },
          {
            "id": "cs-12-ch4",
            "chapterNumber": 4,
            "name": "Applications of Python",
            "topics": CHAPTER_4_NEW_TOPICS
          },
          {
            "id": "cs-12-ch5",
            "chapterNumber": 5,
            "name": "Code Testing and Debugging",
            "topics": CHAPTER_5_NEW_TOPICS
          },
          {
            "id": "cs-12-ch6",
            "chapterNumber": 6,
            "name": "Data Science and Machine Learning",
            "topics": CHAPTER_6_NEW_TOPICS
          },
          {
            "id": "cs-12-ch7",
            "chapterNumber": 7,
            "name": "Hypothesis Testing",
            "topics": CHAPTER_7_NEW_TOPICS
          },
          {
            "id": "cs-12-ch8",
            "chapterNumber": 8,
            "name": "Applications of Computer Science",
            "topics": CHAPTER_8_NEW_TOPICS
          },
          {
            "id": "cs-12-ch9",
            "chapterNumber": 9,
            "name": "Cybersecurity and Safe Digital Collaboration",
            "topics": CHAPTER_9_NEW_TOPICS
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

        // Handle 11th Class Computer Science - Canonical 9 Units Architecture
        if (clsKey === '11th') {
          sub.chapters = buildCleanClass11Chapters(sub.chapters);
          changed = true;
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

              // Topic exists - ensure MCQs and short questions are populated and exercise category is synced
              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  } else if (m.category === 'topic' && (existingMcq.category === 'exercise' || existingMcq.isExercise)) {
                    existingMcq.category = 'topic';
                    existingMcq.isExercise = false;
                    changed = true;
                  }
                } else {
                  existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  } else if (s.category === 'topic' && (existingShort.category === 'exercise' || existingShort.isExercise)) {
                    existingShort.category = 'topic';
                    existingShort.isExercise = false;
                    changed = true;
                  }
                } else {
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
                  marks: lq.marks || 8,
                  category: 'exercise',
                  isExercise: true
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

          // Strictly sanitize and enforce EXACTLY the 10 official textbook exercise MCQs and 10 Shorts
          const OFFICIAL_CH1_EX_MCQ_KEYS = new Set([
            'a computer network is:',
            'a network that covers a small geographical area, such as a school or office, is:',
            'the device used to connect a computer to a network is:',
            'the main function of a router is to:',
            'the device that converts digital signals for internet transmission is:',
            'the topology that uses a central hub or switch is:',
            'the topology that provides the highest reliability is:',
            'the osi model contains:',
            'the protocol mainly used to view web pages is:',
            'dns is used to:'
          ]);
          const OFFICIAL_CH1_EX_MCQ_IDS = new Set([
            'ch1-t1.1-ex-m1', 'ch1-t1.3-ex-m1', 'ch1-t1.4-ex-m1', 'ch1-t1.4-ex-m2', 'ch1-t1.4-ex-m3',
            'ch1-t1.5-ex-m1', 'ch1-t1.5-ex-m2', 'ch1-t1.6-ex-m1', 'ch1-t1.7-ex-m1', 'ch1-t1.7-ex-m2'
          ]);

          const OFFICIAL_CH1_EX_SHORT_KEYS = new Set([
            'what is a computer network?',
            'write two uses of computer networks.',
            'what is network architecture?',
            'name any two components of a computer network.',
            'what is the osi model?',
            'write the name of any two network topologies.',
            'what is a local area network (lan)?',
            'what is the function of a router?',
            'what is a network protocol?',
            'what is the purpose of dns?'
          ]);
          const OFFICIAL_CH1_EX_SHORT_IDS = new Set([
            'ch1-t1.1-ex-s1', 'ch1-t1.1-ex-s2', 'ch1-t1.2-ex-s1', 'ch1-t1.2-ex-s2', 'ch1-t1.3-ex-s1',
            'ch1-t1.4-ex-s1', 'ch1-t1.5-ex-s1', 'ch1-t1.6-ex-s1', 'ch1-t1.7-ex-s1', 'ch1-t1.7-ex-s2'
          ]);

          ch1.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              // Purge stale duplicate MCQs with id containing -ex-m that are not official
              const prevLen = t.mcqs.length;
              t.mcqs = t.mcqs.filter(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isExId = typeof m.id === 'string' && m.id.includes('-ex-m');
                if (isExId && !OFFICIAL_CH1_EX_MCQ_IDS.has(m.id) && !OFFICIAL_CH1_EX_MCQ_KEYS.has(normQ)) {
                  return false;
                }
                return true;
              });
              if (t.mcqs.length !== prevLen) changed = true;

              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH1_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH1_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
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

          // Remove old synthetic topic 2.12 if present
          const preTopicCount = ch2.topics.length;
          ch2.topics = ch2.topics.filter(t => t.topicNumber !== '2.12');
          if (ch2.topics.length !== preTopicCount) changed = true;

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
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  } else if (m.category === 'topic' && (existingMcq.category === 'exercise' || existingMcq.isExercise)) {
                    existingMcq.category = 'topic';
                    existingMcq.isExercise = false;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise') {
                    existingTopic.mcqs.unshift(JSON.parse(JSON.stringify(m)));
                  } else {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  }
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  } else if (s.category === 'topic' && (existingShort.category === 'exercise' || existingShort.isExercise)) {
                    existingShort.category = 'topic';
                    existingShort.isExercise = false;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise') {
                    existingTopic.shortQuestions.unshift(JSON.parse(JSON.stringify(s)));
                  } else {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  }
                  changed = true;
                }
              });
            }
          });

          // Strictly enforce that ONLY the 11 official textbook exercise MCQs and 10 Shorts in Chapter 2 are marked as exercise
          const OFFICIAL_CH2_EX_MCQ_KEYS = new Set([
            'breaking a large, complex problem into smaller, simpler, and more manageable parts is called:',
            'what is the main purpose of evaluating an algorithm after arriving at a solution?',
            'logic in computer science is defined as:',
            'which of the following is a valid proposition in logic?',
            'how many rows are required in a truth table for a logical expression containing 3 propositions (n = 3)?',
            'two logical statements are said to be propositionally equivalent if:',
            'a logical expression is classified as unsatisfiable when:',
            'predicate logic is more expressive than propositional logic because it allows us to:',
            'which symbol represents the universal quantifier, meaning "for all"?',
            'in a predicate logic representation of a library system, borrows(x, y) represents:',
            'deriving a specific, guaranteed conclusion from general rules using "if-then" statements is called:'
          ]);

          const OFFICIAL_CH2_EX_SHORT_KEYS = new Set([
            'what is meant by computational thinking?',
            'why is computational thinking important in problem solving?',
            'what is decomposition in problem solving?',
            'what is an algorithm?',
            'what is logic in computer science?',
            'what is a proposition?',
            'what are truth values?',
            'what is a truth table?',
            'what is propositional satisfiability?',
            'what is a predicate in predicate logic?'
          ]);

          ch2.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH2_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH2_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
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

          // Sort numerically: 2.1, 2.2, ..., 2.11
          ch2.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            if (aParts[0] !== bParts[0]) return aParts[0] - bParts[0];
            return (aParts[1] || 0) - (bParts[1] || 0);
          });
        }

        // =====================================================================
        // CHAPTER 3: OBJECT ORIENTED PROGRAMMING USING PYTHON
        // =====================================================================
        let ch3 = sub.chapters.find(c => 
          c.chapterNumber === 3 || 
          (c.name && c.name.toLowerCase().includes('object oriented')) ||
          (c.name && c.name.toLowerCase().includes('oop'))
        );

        if (!ch3 && clsKey === '12th') {
          ch3 = {
            id: `${sub.id}-ch3`,
            chapterNumber: 3,
            name: "Object Oriented Programming Using Python",
            topics: []
          };
          sub.chapters.push(ch3);
          changed = true;
        }

        if (ch3 && clsKey === '12th') {
          if (!ch3.name || !ch3.name.includes("Object Oriented")) {
            ch3.name = "Object Oriented Programming Using Python";
            ch3.chapterNumber = 3;
            changed = true;
          }
          if (!ch3.topics) ch3.topics = [];
          const preCh3Count = ch3.topics.length;
          ch3.topics = ch3.topics.filter(t => t.topicNumber !== 'Exercise');
          if (ch3.topics.length !== preCh3Count) changed = true;

          CHAPTER_3_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch3.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim() || 
              t.name?.toLowerCase().trim() === newTopic.name.toLowerCase().trim()
            );

            if (!existingTopic) {
              ch3.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise') {
                    existingTopic.mcqs.unshift(JSON.parse(JSON.stringify(m)));
                  } else {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  }
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise') {
                    existingTopic.shortQuestions.unshift(JSON.parse(JSON.stringify(s)));
                  } else {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  }
                  changed = true;
                }
              });
            }
          });

          // Strictly enforce that ONLY the 10 official textbook exercise MCQs and 10 Shorts in Chapter 3 are marked as exercise
          const OFFICIAL_CH3_EX_MCQ_KEYS = new Set([
            'the oop concept that hides data inside a class is:',
            'classes and objects in object-oriented programming are best described as:',
            'the main idea behind encapsulation in oop is:',
            'inheritance in oop means:',
            'polymorphism in oop is best defined as:',
            'an example of inheritance in python is:',
            'the purpose of polymorphism in programming is:',
            'the keyword used to define a class in python is:',
            'encapsulation is best described as:',
            'inheritance allows a class to:'
          ]);

          const OFFICIAL_CH3_EX_SHORT_KEYS = new Set([
            'what is object-oriented programming (oop)?',
            'what is the purpose of a class in python?',
            'what is the difference between a class and an object?',
            'what is purpose of __init__ ?',
            'what is encapsulation in oop, and why is it important?',
            'how does encapsulation help in keeping data secure and private?',
            'what is inheritance in oop, and how does it help in reusing functionality?',
            'how does inheritance enable the extension of functionality in python?',
            'what is polymorphism in oop, and how does it make code more flexible?',
            'how does polymorphism help in creating adaptable and reusable code?'
          ]);

          ch3.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH3_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH3_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }
          });

          // Sort numerically: 3.1, 3.2
          ch3.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            if (aParts[0] !== bParts[0]) return aParts[0] - bParts[0];
            return (aParts[1] || 0) - (bParts[1] || 0);
          });
        }

        // =====================================================================
        // CHAPTER 4: APPLICATIONS OF PYTHON
        // =====================================================================
        let ch4 = sub.chapters.find(c => 
          c.chapterNumber === 4 || 
          (c.name && c.name.toLowerCase().includes('applications of python')) ||
          (c.name && c.name.toLowerCase().includes('tkinter')) ||
          (c.name && c.name.toLowerCase().includes('gui'))
        );

        if (!ch4 && clsKey === '12th') {
          ch4 = {
            id: `${sub.id}-ch4`,
            chapterNumber: 4,
            name: "Applications of Python",
            topics: []
          };
          sub.chapters.push(ch4);
          changed = true;
        }

        if (ch4 && clsKey === '12th') {
          if (!ch4.name || !ch4.name.includes("Applications of Python")) {
            ch4.name = "Applications of Python";
            ch4.chapterNumber = 4;
            changed = true;
          }
          if (!ch4.topics) ch4.topics = [];

          CHAPTER_4_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch4.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim() || 
              t.name?.toLowerCase().trim() === newTopic.name.toLowerCase().trim()
            );

            if (!existingTopic) {
              ch4.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise') {
                    existingTopic.mcqs.unshift(JSON.parse(JSON.stringify(m)));
                  } else {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  }
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise') {
                    existingTopic.shortQuestions.unshift(JSON.parse(JSON.stringify(s)));
                  } else {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  }
                  changed = true;
                }
              });
            }
          });

          // Strictly enforce that ONLY the 10 official textbook exercise MCQs and 10 Shorts in Chapter 4 are marked as exercise
          const OFFICIAL_CH4_EX_MCQ_KEYS = new Set([
            'the main purpose of a gui in python programming is to:',
            "python's built-in gui toolkit is:",
            'the tkinter widget used to display text is:',
            'the pack() method in tkinter is used to:',
            'the methods used to organize widgets in tkinter include:',
            'event-driven programming in tkinter means:',
            'the tkinter widget used to get user input is:',
            'the tkinter layout manager that allows precise positioning of widgets using coordinates is:',
            'the tkinter option that connects a button click to a function is:',
            'crud operations in databases stand for:'
          ]);

          const OFFICIAL_CH4_EX_SHORT_KEYS = new Set([
            'what is a gui and why is it important in application development?',
            "what is tkinter and why is it python's built-in gui toolkit?",
            'how do you create a window and add frames in tkinter?',
            'name two common widgets used in tkinter.',
            'what is the purpose of layout management in tkinter?',
            'how does the pack() method organize elements in tkinter?',
            'what is event-driven programming and how is it used in tkinter?',
            'how do you handle user input in tkinter?',
            'what is the crud operation in database management?',
            'how do you connect python to a database like sqlite?'
          ]);

          ch4.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH4_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH4_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }
          });

          // Sort numerically: 4.1, 4.2
          ch4.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            if (aParts[0] !== bParts[0]) return aParts[0] - bParts[0];
            return (aParts[1] || 0) - (bParts[1] || 0);
          });
        }

        // =====================================================================
        // CHAPTER 5: CODE TESTING AND DEBUGGING
        // =====================================================================
        let ch5 = sub.chapters.find(c => 
          c.chapterNumber === 5 || 
          (c.name && c.name.toLowerCase().includes('code testing')) ||
          (c.name && c.name.toLowerCase().includes('testing and debugging')) ||
          (c.name && c.name.toLowerCase().includes('chap#5'))
        );

        if (!ch5 && clsKey === '12th') {
          ch5 = {
            id: `${sub.id}-ch5`,
            chapterNumber: 5,
            name: "Code Testing and Debugging",
            topics: []
          };
          sub.chapters.push(ch5);
          changed = true;
        }

        if (ch5 && clsKey === '12th') {
          if (!ch5.name || !ch5.name.includes("Code Testing")) {
            ch5.name = "Code Testing and Debugging";
            ch5.chapterNumber = 5;
            changed = true;
          }
          if (!ch5.topics) ch5.topics = [];

          // Remove any stale sub-topics (like 5.2.1, 5.2.2, etc.) and restrict strictly to 5.1, 5.2, 5.3
          const preCh5Count = ch5.topics.length;
          ch5.topics = ch5.topics.filter(t => {
            const parts = (t.topicNumber || '').trim().split('.');
            return parts.length <= 2;
          });
          if (ch5.topics.length !== preCh5Count) changed = true;

          CHAPTER_5_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch5.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim()
            );

            if (!existingTopic) {
              ch5.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              existingTopic.name = newTopic.name;
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise') {
                    existingTopic.mcqs.unshift(JSON.parse(JSON.stringify(m)));
                  } else {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  }
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise') {
                    existingTopic.shortQuestions.unshift(JSON.parse(JSON.stringify(s)));
                  } else {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  }
                  changed = true;
                }
              });
            }
          });

          // Strictly enforce that ONLY the 10 official textbook exercise MCQs and 10 Shorts in Chapter 5 are marked as exercise
          const OFFICIAL_CH5_EX_MCQ_KEYS = new Set([
            'testing is essential for reliable applications because it helps to:',
            'common types of programming errors include:',
            'unit testing focuses on:',
            'the python module used for unit testing is:',
            'the main purpose of using testing tools like unittest and pytest is:',
            'breakpoints in debugging are used to:',
            'watch expressions in debugging are used to:',
            'step-by-step debugging is used to:',
            'the python keyword pair used for exception handling is:',
            'profiling in programming is used to:'
          ]);

          const OFFICIAL_CH5_EX_SHORT_KEYS = new Set([
            'why is testing essential for ensuring reliable applications?',
            'what are some common types of programming errors and bugs?',
            'what is unit testing, and why is it important in programming?',
            "how do python's unittest and pytest modules help in unit testing?",
            'what is the purpose of writing and executing test cases?',
            'how do you set breakpoints in ides like pycharm or vs code?',
            'what is the role of monitoring variable values with watch expressions during debugging?',
            'what is the step-by-step debugging process in ides?',
            'how does exception handling help in managing multiple exception types effectively?',
            'what tools can be used for profiling and measuring performance in python?'
          ]);

          ch5.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH5_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH5_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }
          });

          // Sort numerically: 5.1, 5.2, 5.3
          ch5.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
              const av = aParts[i] || 0;
              const bv = bParts[i] || 0;
              if (av !== bv) return av - bv;
            }
            return 0;
          });
        }

        // =====================================================================
        // CHAPTER 6: DATA SCIENCE AND MACHINE LEARNING
        // =====================================================================
        let ch6 = sub.chapters.find(c => 
          c.chapterNumber === 6 || 
          (c.name && c.name.toLowerCase().includes('data science')) ||
          (c.name && c.name.toLowerCase().includes('machine learning')) ||
          (c.name && c.name.toLowerCase().includes('chap#6'))
        );

        if (!ch6 && clsKey === '12th') {
          ch6 = {
            id: `${sub.id}-ch6`,
            chapterNumber: 6,
            name: "Data Science and Machine Learning",
            topics: []
          };
          sub.chapters.push(ch6);
          changed = true;
        }

        if (ch6 && clsKey === '12th') {
          if (!ch6.name || !ch6.name.includes("Data Science")) {
            ch6.name = "Data Science and Machine Learning";
            ch6.chapterNumber = 6;
            changed = true;
          }
          if (!ch6.topics) ch6.topics = [];

          // Remove any stale sub-topics (e.g. 6.2.1, 6.4.1) and keep strictly 6.1, 6.2, etc.
          const preCh6Count = ch6.topics.length;
          ch6.topics = ch6.topics.filter(t => {
            const parts = (t.topicNumber || '').trim().split('.');
            return parts.length <= 2;
          });
          if (ch6.topics.length !== preCh6Count) changed = true;

          CHAPTER_6_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch6.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim()
            );

            if (!existingTopic) {
              ch6.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              existingTopic.name = newTopic.name;
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise') {
                    existingTopic.mcqs.unshift(JSON.parse(JSON.stringify(m)));
                  } else {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  }
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise') {
                    existingTopic.shortQuestions.unshift(JSON.parse(JSON.stringify(s)));
                  } else {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  }
                  changed = true;
                }
              });
            }
          });

          // Strictly enforce that ONLY the 10 official textbook exercise MCQs and 10 Shorts in Chapter 6 are marked as exercise
          const OFFICIAL_CH6_EX_MCQ_KEYS = new Set([
            'data science is mainly concerned with:',
            'data organised in rows and columns is called:',
            'an example of unstructured data is:',
            'machine learning allows systems to:',
            'the type of machine learning that uses labelled data is:',
            'the machine learning method that learns through rewards and penalties is:',
            'feature engineering is used to:',
            'the metric that measures the overall correctness of a model is:',
            'train-test split is used to:',
            'a commonly used tool for machine learning and data analysis is:'
          ]);

          const OFFICIAL_CH6_EX_SHORT_KEYS = new Set([
            'what is data science?',
            'what are the two main types of data?',
            'what is the difference between structured and unstructured data?',
            'name two common data collection methods.',
            'what is machine learning?',
            'what is supervised learning?',
            'what is the purpose of feature selection in machine learning?',
            'what does accuracy measure in a model?',
            'what is the difference between prediction and causality?',
            'name any one tool used for machine learning.'
          ]);

          ch6.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH6_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH6_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }
          });

          // Sort numerically: 6.1, 6.2, 6.3, 6.4, 6.6, 6.7, 6.9, 6.10
          ch6.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
              const av = aParts[i] || 0;
              const bv = bParts[i] || 0;
              if (av !== bv) return av - bv;
            }
            return 0;
          });
        }

        // =====================================================================
        // CHAPTER 7: HYPOTHESIS TESTING
        // =====================================================================
        let ch7 = sub.chapters.find(c => 
          c.chapterNumber === 7 || 
          (c.name && c.name.toLowerCase().includes('hypothesis')) ||
          (c.name && c.name.toLowerCase().includes('chap#7'))
        );

        if (!ch7 && clsKey === '12th') {
          ch7 = {
            id: `${sub.id}-ch7`,
            chapterNumber: 7,
            name: "Hypothesis Testing",
            topics: []
          };
          sub.chapters.push(ch7);
          changed = true;
        }

        if (ch7 && clsKey === '12th') {
          if (!ch7.name || !ch7.name.includes("Hypothesis")) {
            ch7.name = "Hypothesis Testing";
            ch7.chapterNumber = 7;
            changed = true;
          }
          if (!ch7.topics) ch7.topics = [];

          // Remove any stale sub-topics (e.g. 7.1.1) and keep strictly 7.1, 7.2, etc.
          const preCh7Count = ch7.topics.length;
          ch7.topics = ch7.topics.filter(t => {
            const parts = (t.topicNumber || '').trim().split('.');
            return parts.length <= 2;
          });
          if (ch7.topics.length !== preCh7Count) changed = true;

          CHAPTER_7_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch7.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim()
            );

            if (!existingTopic) {
              ch7.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              existingTopic.name = newTopic.name;
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise') {
                    existingTopic.mcqs.unshift(JSON.parse(JSON.stringify(m)));
                  } else {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  }
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise') {
                    existingTopic.shortQuestions.unshift(JSON.parse(JSON.stringify(s)));
                  } else {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  }
                  changed = true;
                }
              });
            }
          });

          // Strictly enforce that ONLY the 10 official textbook exercise MCQs and 10 Shorts in Chapter 7 are marked as exercise
          const OFFICIAL_CH7_EX_MCQ_KEYS = new Set([
            'a hypothesis is:',
            'the null hypothesis represents:',
            'the symbol used for the null hypothesis is:',
            'a p-value is used for:',
            'if (p-value < α), the decision is to:',
            'if (p-value < a), the decision is to:',
            'the critical region is the:',
            'an example of a test statistic is:',
            'data visualisation is used to:',
            'a chart useful for comparison is:',
            'bias in data means:'
          ]);

          const OFFICIAL_CH7_EX_SHORT_KEYS = new Set([
            'what is a hypothesis?',
            'what is a research question?',
            'define null hypothesis (h₀).',
            'define null hypothesis (h0).',
            'what is a test statistic?',
            'what is meant by p-value?',
            'what is a critical region?',
            'what are the basic steps in hypothesis testing?',
            'why is data visualization important?',
            'what is bias in data collection?',
            'why is ethical use of data important?'
          ]);

          ch7.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH7_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH7_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }
          });

          // Sort numerically: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6
          ch7.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
              const av = aParts[i] || 0;
              const bv = bParts[i] || 0;
              if (av !== bv) return av - bv;
            }
            return 0;
          });
        }

        // =====================================================================
        // CHAPTER 8: APPLICATIONS OF COMPUTER SCIENCE
        // =====================================================================
        let ch8 = sub.chapters.find(c => 
          c.chapterNumber === 8 || 
          (c.name && c.name.toLowerCase().includes('applications of computer science')) ||
          (c.name && c.name.toLowerCase().includes('chap#8'))
        );

        if (!ch8 && clsKey === '12th') {
          ch8 = {
            id: `${sub.id}-ch8`,
            chapterNumber: 8,
            name: "Applications of Computer Science",
            topics: []
          };
          sub.chapters.push(ch8);
          changed = true;
        }

        if (ch8 && clsKey === '12th') {
          if (!ch8.name || !ch8.name.includes("Applications of Computer")) {
            ch8.name = "Applications of Computer Science";
            ch8.chapterNumber = 8;
            changed = true;
          }
          if (!ch8.topics) ch8.topics = [];

          // Remove any stale sub-topics (e.g. 8.1.1) and keep strictly 8.1, 8.2, etc.
          const preCh8Count = ch8.topics.length;
          ch8.topics = ch8.topics.filter(t => {
            const parts = (t.topicNumber || '').trim().split('.');
            return parts.length <= 2;
          });
          if (ch8.topics.length !== preCh8Count) changed = true;

          CHAPTER_8_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch8.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim()
            );

            if (!existingTopic) {
              ch8.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              existingTopic.name = newTopic.name;
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise') {
                    existingTopic.mcqs.unshift(JSON.parse(JSON.stringify(m)));
                  } else {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  }
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise') {
                    existingTopic.shortQuestions.unshift(JSON.parse(JSON.stringify(s)));
                  } else {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  }
                  changed = true;
                }
              });
            }
          });

          // Strictly enforce that ONLY the 10 official textbook exercise MCQs and 10 Shorts in Chapter 8 are marked as exercise
          const OFFICIAL_CH8_EX_MCQ_KEYS = new Set([
            'artificial intelligence (ai) is best described as:',
            'the internet of things (iot) is mainly used to:',
            'an example of cloud computing is:',
            'blockchain technology is known for:',
            'an ethical issue in ai systems is:',
            'the purpose of ai governance policies is to:',
            'in agriculture, iot and ai can work together to:',
            'transparency in agriculture supply chains can be improved using:',
            'responsible technology development should:',
            'cultural awareness in ai design ensures:'
          ]);

          const OFFICIAL_CH8_EX_SHORT_KEYS = new Set([
            'what is artificial intelligence (ai) and how is it used in daily life?',
            'how does the internet of things (iot) connect smart devices together?',
            'what are the main advantages of using cloud computing?',
            'how does blockchain ensure security and transparency in transactions?',
            'why is it important to consider ethics while developing ai systems?',
            'what role do stakeholders play in the design and regulation of ai technologies?',
            'how can emerging technologies help solve national challenges in pakistan?',
            'what is the importance of cultural awareness when designing technological solutions?',
            'how can ai, iot, and cloud work together to improve agriculture?',
            'why are laws and policies necessary for the responsible and safe use of technology?'
          ]);

          ch8.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH8_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH8_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }
          });

          // Sort numerically: 8.1, 8.2, 8.3, 8.4
          ch8.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
              const av = aParts[i] || 0;
              const bv = bParts[i] || 0;
              if (av !== bv) return av - bv;
            }
            return 0;
          });
        }

        // =====================================================================
        // CHAPTER 9: CYBERSECURITY AND SAFE DIGITAL COLLABORATION
        // =====================================================================
        let ch9 = sub.chapters.find(c => 
          c.chapterNumber === 9 || 
          (c.name && c.name.toLowerCase().includes('cybersecurity')) ||
          (c.name && c.name.toLowerCase().includes('chap#9'))
        );

        if (!ch9 && clsKey === '12th') {
          ch9 = {
            id: `${sub.id}-ch9`,
            chapterNumber: 9,
            name: "Cybersecurity and Safe Digital Collaboration",
            topics: []
          };
          sub.chapters.push(ch9);
          changed = true;
        }

        if (ch9 && clsKey === '12th') {
          if (!ch9.name || !ch9.name.includes("Cybersecurity")) {
            ch9.name = "Cybersecurity and Safe Digital Collaboration";
            ch9.chapterNumber = 9;
            changed = true;
          }
          if (!ch9.topics) ch9.topics = [];

          // Remove any stale sub-topics (e.g. 9.1.1) and keep strictly 9.1, 9.2, etc.
          const preCh9Count = ch9.topics.length;
          ch9.topics = ch9.topics.filter(t => {
            const parts = (t.topicNumber || '').trim().split('.');
            return parts.length <= 2;
          });
          if (ch9.topics.length !== preCh9Count) changed = true;

          CHAPTER_9_NEW_TOPICS.forEach(newTopic => {
            const existingTopic = ch9.topics.find(t => 
              t.topicNumber?.trim() === newTopic.topicNumber.trim()
            );

            if (!existingTopic) {
              ch9.topics.push(JSON.parse(JSON.stringify(newTopic)));
              changed = true;
            } else {
              existingTopic.name = newTopic.name;
              if (!existingTopic.id || (newTopic.id && existingTopic.id !== newTopic.id)) {
                existingTopic.id = newTopic.id;
                changed = true;
              }

              if (!existingTopic.mcqs) existingTopic.mcqs = [];
              (newTopic.mcqs || []).forEach(m => {
                const normQ = (m.question || '').trim().toLowerCase();
                const existingMcq = existingTopic.mcqs.find(em => (em.question || '').trim().toLowerCase() === normQ);
                if (existingMcq) {
                  if (m.category === 'exercise' && (existingMcq.category !== 'exercise' || !existingMcq.isExercise)) {
                    existingMcq.category = 'exercise';
                    existingMcq.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise') {
                    existingTopic.mcqs.unshift(JSON.parse(JSON.stringify(m)));
                  } else {
                    existingTopic.mcqs.push(JSON.parse(JSON.stringify(m)));
                  }
                  changed = true;
                }
              });

              if (!existingTopic.shortQuestions) existingTopic.shortQuestions = [];
              (newTopic.shortQuestions || []).forEach(s => {
                const normQ = (s.question || '').trim().toLowerCase();
                const existingShort = existingTopic.shortQuestions.find(es => (es.question || '').trim().toLowerCase() === normQ);
                if (existingShort) {
                  if (s.category === 'exercise' && (existingShort.category !== 'exercise' || !existingShort.isExercise)) {
                    existingShort.category = 'exercise';
                    existingShort.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise') {
                    existingTopic.shortQuestions.unshift(JSON.parse(JSON.stringify(s)));
                  } else {
                    existingTopic.shortQuestions.push(JSON.parse(JSON.stringify(s)));
                  }
                  changed = true;
                }
              });
            }
          });

          // Strictly enforce that ONLY the 10 official textbook exercise MCQs and 10 Shorts in Chapter 9 are marked as exercise
          const OFFICIAL_CH9_EX_MCQ_KEYS = new Set([
            'the following helps keep online accounts secure:',
            'the main danger of downloading unknown software is:',
            'the tool that adds an extra layer of login security is:',
            'the cyber threat that tricks users into giving personal information is:',
            'the purpose of a firewall is to:',
            'encryption is used to:',
            'a commonly used platform for online collaboration is:',
            'digital etiquette means:',
            'e-waste means:',
            'the international law that protects user privacy is:'
          ]);

          const OFFICIAL_CH9_EX_SHORT_KEYS = new Set([
            'what is the role of strong passwords in protecting data?',
            'how can downloading suspicious software affect a computer?',
            'why is it important to install software updates and security patches?',
            'what are common types of cyber threats, such as phishing or ransomware?',
            'how does two-factor authentication (2fa) improve online security?',
            'who is responsible for managing privacy and security settings on online platforms?',
            'what is intellectual property, and why should it be respected in digital use?',
            'how does e-waste impact the environment, and what is sustainable computing?',
            'where do international data protection laws like gdpr apply?',
            'what is entrepreneurship?'
          ]);

          ch9.topics.forEach(t => {
            if (Array.isArray(t.mcqs)) {
              t.mcqs.forEach(m => {
                const normQ = (m.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH9_EX_MCQ_KEYS.has(normQ);
                if (isOfficial) {
                  if (m.category !== 'exercise' || !m.isExercise) {
                    m.category = 'exercise';
                    m.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (m.category === 'exercise' || m.isExercise || (typeof m.id === 'string' && m.id.includes('-ex-'))) {
                    m.category = 'topic';
                    m.isExercise = false;
                    if (typeof m.id === 'string' && m.id.includes('-ex-')) {
                      m.id = m.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }

            if (Array.isArray(t.shortQuestions)) {
              t.shortQuestions.forEach(s => {
                const normQ = (s.question || '').toLowerCase().trim();
                const isOfficial = OFFICIAL_CH9_EX_SHORT_KEYS.has(normQ);
                if (isOfficial) {
                  if (s.category !== 'exercise' || !s.isExercise) {
                    s.category = 'exercise';
                    s.isExercise = true;
                    changed = true;
                  }
                } else {
                  if (s.category === 'exercise' || s.isExercise || (typeof s.id === 'string' && s.id.includes('-ex-'))) {
                    s.category = 'topic';
                    s.isExercise = false;
                    if (typeof s.id === 'string' && s.id.includes('-ex-')) {
                      s.id = s.id.replace('-ex-', '-');
                    }
                    changed = true;
                  }
                }
              });
            }
          });

          // Sort numerically: 9.1, 9.2, 9.3, 9.4, 9.5
          ch9.topics.sort((a, b) => {
            const aParts = (a.topicNumber || '0').split('.').map(Number);
            const bParts = (b.topicNumber || '0').split('.').map(Number);
            for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
              const av = aParts[i] || 0;
              const bv = bParts[i] || 0;
              if (av !== bv) return av - bv;
            }
            return 0;
          });
        }

        // Keep chapters sorted by chapterNumber
        sub.chapters.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
      }
    });
  });

  return { bank, changed };
}

let _memoryCachedBank = null;

export function clearBankCache() {
  _memoryCachedBank = null;
}

// Retrieve bank from memory cache (instantaneous) or localStorage on first load
export function getQuestionBank(forceReload = false) {
  if (_memoryCachedBank && !forceReload) {
    return _memoryCachedBank;
  }
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

    _memoryCachedBank = parsed;

    if (hasMergedUpdates || ch1Changed || !raw) {
      saveQuestionBank(parsed);
    }

    return _memoryCachedBank;
  } catch (err) {
    console.error("Failed to load question bank:", err);
    return INITIAL_QUESTION_BANK;
  }
}

// Save bank to memory cache and localStorage
export function saveQuestionBank(bank) {
  _memoryCachedBank = bank;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bank));
    }
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
  subject.chapters.sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0));
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
  if (q.category === 'topic' || q.isExercise === false) return false;
  if (q.isExercise === true || q.category === 'exercise') return true;
  if (q.id && typeof q.id === 'string' && (q.id.includes('tex') || q.id.includes('exercise') || q.id.includes('-ex-') || q.id.endsWith('-ex'))) return true;

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
