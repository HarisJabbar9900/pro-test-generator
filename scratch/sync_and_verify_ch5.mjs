import { db } from '../src/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { CHAPTER_5_NEW_TOPICS } from '../src/utils/chapter5TopicsData.js';

async function main() {
  console.log("Fetching question_banks/main_bank from Firestore...");
  const bankRef = doc(db, "question_banks", "main_bank");
  const snap = await getDoc(bankRef);
  if (!snap.exists()) {
    console.error("No main_bank document found!");
    process.exit(1);
  }

  const payload = snap.data();
  const data = payload.data || payload;

  if (!data['12th']) {
    console.error("No 12th class found in bank data!");
    process.exit(1);
  }

  const subs = Array.isArray(data['12th'].subjects) ? data['12th'].subjects : Object.values(data['12th'].subjects);
  const cs = subs.find(s => s.id === 'cs-12' || s.id === '12th-cs' || s.name?.toLowerCase().includes('computer'));

  if (!cs) {
    console.error("No computer science subject found in 12th class!");
    process.exit(1);
  }

  console.log("Found 12th Class Computer Science. Finding Chapter 5...");
  let ch5 = (cs.chapters || []).find(c => c.chapterNumber === 5 || c.name?.toLowerCase().includes('testing'));

  if (!ch5) {
    console.log("Chapter 5 not found in chapters list, creating it...");
    ch5 = {
      id: "cs-12-ch5",
      chapterNumber: 5,
      name: "Code Testing and Debugging",
      topics: JSON.parse(JSON.stringify(CHAPTER_5_NEW_TOPICS))
    };
    if (!cs.chapters) cs.chapters = [];
    cs.chapters.push(ch5);
  } else {
    ch5.name = "Code Testing and Debugging";
    ch5.chapterNumber = 5;
    ch5.topics = JSON.parse(JSON.stringify(CHAPTER_5_NEW_TOPICS));
  }

  let totalMcqs = 0;
  let topicMcqs = 0;
  let exerciseMcqs = 0;
  let totalShorts = 0;
  let topicShorts = 0;
  let exerciseShorts = 0;

  ch5.topics.forEach(t => {
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
  console.log(`Grade 12 — Chapter 5 Verification:`);
  console.log(`Topic MCQs: ${topicMcqs}`);
  console.log(`Exercise MCQs: ${exerciseMcqs}`);
  console.log(`TOTAL MCQs: ${totalMcqs}`);
  console.log(`Topic Short Questions: ${topicShorts}`);
  console.log(`Exercise Short Questions: ${exerciseShorts}`);
  console.log(`TOTAL Short Questions: ${totalShorts}`);
  console.log(`GRAND TOTAL: ${totalMcqs + totalShorts}`);
  console.log(`===========================================`);

  if (topicMcqs !== 30) {
    console.error(`ERROR: Expected 30 Topic MCQs, got ${topicMcqs}`);
    process.exit(1);
  }

  if (topicShorts !== 24) {
    console.error(`ERROR: Expected 24 Topic Shorts, got ${topicShorts}`);
    process.exit(1);
  }

  await setDoc(bankRef, {
    ...payload,
    data,
    updatedAt: new Date().toISOString()
  });

  console.log("Firestore successfully updated and verified with 30 Topic MCQs & 24 Topic Shorts for Unit 5!");
  process.exit(0);
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
