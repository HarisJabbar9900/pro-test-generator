import { db } from '../src/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { mergeChapter1NewTopics } from '../src/utils/questionBankService.js';

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

  const ch9 = cs.chapters.find(c => c.chapterNumber === 9);
  if (!ch9) {
    console.error("Grade 12 Chapter 9 not found!");
    process.exit(1);
  }

  let totalMcqs = 0;
  let topicMcqs = 0;
  let exerciseMcqs = 0;

  let totalShorts = 0;
  let topicShorts = 0;
  let exerciseShorts = 0;

  ch9.topics.forEach(t => {
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
  console.log(`Grade 12 - Chapter 9 Verification:`);
  console.log(`MCQs -> Topic: ${topicMcqs}, Exercise: ${exerciseMcqs}, TOTAL: ${totalMcqs}`);
  console.log(`Shorts -> Topic: ${topicShorts}, Exercise: ${exerciseShorts}, TOTAL: ${totalShorts}`);
  console.log(`===========================================`);

  if (totalMcqs !== 40) {
    console.error(`ERROR: Expected 40 MCQs (30 topic + 10 exercise), got ${totalMcqs}`);
    process.exit(1);
  }

  if (totalShorts !== 43) {
    console.error(`ERROR: Expected 43 Shorts (33 topic + 10 exercise), got ${totalShorts}`);
    process.exit(1);
  }

  await setDoc(bankRef, {
    data,
    updatedAt: new Date().toISOString()
  });

  console.log("Firestore successfully written and verified with 40 MCQs and 43 Shorts for Grade 12 Chapter 9!");
  process.exit(0);
}

main().catch(console.error);
