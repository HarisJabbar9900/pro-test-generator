import { db } from '../src/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { mergeChapter1NewTopics } from '../src/utils/questionBankService.js';
import { CHAPTER_6_NEW_TOPICS } from '../src/utils/chapter6TopicsData.js';

async function main() {
  const bankRef = doc(db, "question_banks", "main_bank");
  const snap = await getDoc(bankRef);
  if (!snap.exists()) {
    console.error("Firestore main_bank does not exist!");
    process.exit(1);
  }
  const data = snap.data().data;

  console.log("Running mergeChapter1NewTopics on Firestore main_bank...");
  mergeChapter1NewTopics(data);

  const cls12 = data['12th'];
  if (!cls12) {
    console.error("12th class not found in Firestore!");
    process.exit(1);
  }

  const subs = Object.values(cls12.subjects);
  const cs = subs.find(s => s.id === 'cs-12' || s.name?.includes('Computer'));

  if (!cs) {
    console.error("Computer Science subject not found in 12th grade!");
    process.exit(1);
  }

  const ch6 = cs.chapters.find(c => c.chapterNumber === 6);
  if (!ch6) {
    console.error("Grade 12 Chapter 6 not found!");
    process.exit(1);
  }

  // Ensure ch6 topics are updated with CHAPTER_6_NEW_TOPICS
  ch6.topics = JSON.parse(JSON.stringify(CHAPTER_6_NEW_TOPICS));

  let totalMcqs = 0;
  let topicMcqs = 0;
  let exerciseMcqs = 0;

  let totalShorts = 0;
  let topicShorts = 0;
  let exerciseShorts = 0;

  ch6.topics.forEach(t => {
    (t.mcqs || []).forEach(m => {
      totalMcqs++;
      if (m.isExercise || m.category === 'exercise') {
        exerciseMcqs++;
      } else {
        topicMcqs++;
      }
    });

    (t.shortQuestions || []).forEach(s => {
      totalShorts++;
      if (s.isExercise || s.category === 'exercise') {
        exerciseShorts++;
      } else {
        topicShorts++;
      }
    });
  });

  console.log(`===========================================`);
  console.log(`Grade 12 - Chapter 6 Verification:`);
  console.log(`MCQs -> Topic: ${topicMcqs}, Exercise: ${exerciseMcqs}, TOTAL: ${totalMcqs}`);
  console.log(`Shorts -> Topic: ${topicShorts}, Exercise: ${exerciseShorts}, TOTAL: ${totalShorts}`);
  console.log(`===========================================`);

  ch6.topics.forEach(t => {
    const tTopicMcqs = (t.mcqs || []).filter(m => !m.isExercise && m.category !== 'exercise').length;
    const tExMcqs = (t.mcqs || []).filter(m => m.isExercise || m.category === 'exercise').length;
    const tExShorts = (t.shortQuestions || []).filter(s => s.isExercise || s.category === 'exercise').length;
    console.log(`Topic ${t.topicNumber}: ${t.name} -> ${tTopicMcqs} topic MCQs, ${tExMcqs} ex MCQs (${t.mcqs?.length} total), ${tExShorts} ex Shorts`);
  });

  if (totalMcqs !== 40) {
    console.error(`ERROR: Expected 40 MCQs (30 topic + 10 exercise), got ${totalMcqs}`);
    process.exit(1);
  }

  if (exerciseMcqs !== 10) {
    console.error(`ERROR: Expected 10 Exercise MCQs, got ${exerciseMcqs}`);
    process.exit(1);
  }

  if (topicMcqs !== 30) {
    console.error(`ERROR: Expected 30 Topic MCQs, got ${topicMcqs}`);
    process.exit(1);
  }

  if (totalShorts !== 31) {
    console.error(`ERROR: Expected 31 Shorts (21 topic + 10 exercise), got ${totalShorts}`);
    process.exit(1);
  }

  if (exerciseShorts !== 10) {
    console.error(`ERROR: Expected 10 Exercise Shorts, got ${exerciseShorts}`);
    process.exit(1);
  }

  if (topicShorts !== 21) {
    console.error(`ERROR: Expected 21 Topic Shorts, got ${topicShorts}`);
    process.exit(1);
  }

  await setDoc(bankRef, {
    data,
    updatedAt: new Date().toISOString()
  });

  console.log("Firestore successfully written and verified with 40 MCQs (30 Topic + 10 Exercise) and 31 Shorts (21 Topic + 10 Exercise) for Grade 12 Chapter 6!");
  process.exit(0);
}

main().catch(console.error);
