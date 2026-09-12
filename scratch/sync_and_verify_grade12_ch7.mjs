import { db } from '../src/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { mergeChapter1NewTopics } from '../src/utils/questionBankService.js';
import { CHAPTER_7_NEW_TOPICS } from '../src/utils/chapter7TopicsData.js';

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

  const ch7 = cs.chapters.find(c => c.chapterNumber === 7);
  if (!ch7) {
    console.error("Grade 12 Chapter 7 not found!");
    process.exit(1);
  }

  // Ensure ch7 topics are updated with CHAPTER_7_NEW_TOPICS
  ch7.topics = JSON.parse(JSON.stringify(CHAPTER_7_NEW_TOPICS));

  let totalMcqs = 0;
  let topicMcqs = 0;
  let exerciseMcqs = 0;

  let totalShorts = 0;
  let topicShorts = 0;
  let exerciseShorts = 0;

  ch7.topics.forEach(t => {
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
  console.log(`Grade 12 - Chapter 7 Verification:`);
  console.log(`MCQs -> Topic: ${topicMcqs}, Exercise: ${exerciseMcqs}, TOTAL: ${totalMcqs}`);
  console.log(`Shorts -> Topic: ${topicShorts}, Exercise: ${exerciseShorts}, TOTAL: ${totalShorts}`);
  console.log(`===========================================`);

  ch7.topics.forEach(t => {
    const tTopicMcqs = (t.mcqs || []).filter(m => !m.isExercise && m.category !== 'exercise').length;
    const tExMcqs = (t.mcqs || []).filter(m => m.isExercise || m.category === 'exercise').length;
    const tExShorts = (t.shortQuestions || []).filter(s => s.isExercise || s.category === 'exercise').length;
    console.log(`Topic ${t.topicNumber}: ${t.name} -> ${tTopicMcqs} topic MCQs, ${tExMcqs} ex MCQs (${t.mcqs?.length} total), ${tExShorts} ex Shorts`);
  });

  if (totalMcqs !== 37) {
    console.error(`ERROR: Expected 37 MCQs (27 topic + 10 exercise), got ${totalMcqs}`);
    process.exit(1);
  }

  if (exerciseMcqs !== 10) {
    console.error(`ERROR: Expected 10 Exercise MCQs, got ${exerciseMcqs}`);
    process.exit(1);
  }

  if (topicMcqs !== 27) {
    console.error(`ERROR: Expected 27 Topic MCQs, got ${topicMcqs}`);
    process.exit(1);
  }

  if (totalShorts !== 10) {
    console.error(`ERROR: Expected 10 Exercise Shorts, got ${totalShorts}`);
    process.exit(1);
  }

  await setDoc(bankRef, {
    data,
    updatedAt: new Date().toISOString()
  });

  console.log("Firestore successfully written and verified with 37 MCQs (27 Topic + 10 Exercise) and 10 Shorts for Grade 12 Chapter 7!");
  process.exit(0);
}

main().catch(console.error);
