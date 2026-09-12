import { db } from '../src/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { buildCleanClass11Chapters } from '../src/utils/questionBankService.js';

async function main() {
  const bankRef = doc(db, "question_banks", "main_bank");
  const snap = await getDoc(bankRef);
  if (!snap.exists()) {
    console.error("Firestore main_bank does not exist!");
    process.exit(1);
  }
  const data = snap.data().data;

  const subs = Object.values(data['11th'].subjects);
  const cs = subs.find(s => s.id === 'cs-11' || s.name?.includes('Computer'));

  if (!cs) {
    console.error("Computer Science subject not found in 11th grade!");
    process.exit(1);
  }

  console.log("Running buildCleanClass11Chapters...");
  cs.chapters = buildCleanClass11Chapters(cs.chapters);

  const ch7 = cs.chapters.find(c => c.chapterNumber === 7);
  if (!ch7) {
    console.error("Chapter 7 not found!");
    process.exit(1);
  }

  let totalMcqs = 0;
  let topicMcqs = 0;
  let exerciseMcqs = 0;

  ch7.topics.forEach(t => {
    (t.mcqs || []).forEach(m => {
      totalMcqs++;
      if (m.isExercise || m.category === 'exercise') {
        exerciseMcqs++;
      } else {
        topicMcqs++;
      }
    });
  });

  console.log(`===========================================`);
  console.log(`Chapter 7 (Legal & Ethical Aspects) Verification:`);
  console.log(`Topic MCQs: ${topicMcqs}`);
  console.log(`Exercise MCQs: ${exerciseMcqs}`);
  console.log(`TOTAL MCQS: ${totalMcqs}`);
  console.log(`===========================================`);

  if (totalMcqs !== 44) {
    console.error(`ERROR: Expected 44 (35 topic + 9 exercise), got ${totalMcqs}`);
    process.exit(1);
  }

  await setDoc(bankRef, {
    data,
    updatedAt: new Date().toISOString()
  });

  console.log("Firestore successfully written and verified with 44 MCQs for Chapter 7!");
  process.exit(0);
}

main().catch(console.error);
