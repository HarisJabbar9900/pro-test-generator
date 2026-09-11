import { 
  doc, setDoc, getDoc, onSnapshot, collection, addDoc, 
  query, where, getDocs, deleteDoc 
} from "firebase/firestore";
import { db } from "../firebase";
import { getQuestionBank, saveQuestionBank, stripDummyQuestions } from "./questionBankService";

const BANK_DOC_REF = () => doc(db, "question_banks", "main_bank");

/**
 * Save current Question Bank to Firebase Firestore
 * Overwrites document completely so deleted chapters and topics are removed from Firestore
 */
export async function syncBankToFirebase(bankData) {
  try {
    const dataToSave = bankData || getQuestionBank();
    await setDoc(BANK_DOC_REF(), {
      data: dataToSave,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.warn("Firebase sync warning (offline mode fallback):", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a topic from both main bank and uploaded_materials collection in Firestore
 */
export async function deleteTopicFromFirebase(classId, subjectName, chapterName, topicNumber, updatedBank) {
  try {
    // 1. Overwrite main bank document in Firestore with clean updated bank
    if (updatedBank) {
      await setDoc(BANK_DOC_REF(), {
        data: updatedBank,
        updatedAt: new Date().toISOString()
      });
    }

    // 2. Query and delete from uploaded_materials collection
    if (topicNumber) {
      const colRef = collection(db, "uploaded_materials");
      const q = query(
        colRef, 
        where("gradeClass", "==", classId),
        where("topicNumber", "==", topicNumber)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    }

    return { success: true };
  } catch (error) {
    console.warn("Firebase delete topic error:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a chapter from both main bank and uploaded_materials collection in Firestore
 */
export async function deleteChapterFromFirebase(classId, subjectName, chapterName, updatedBank) {
  try {
    // 1. Overwrite main bank document in Firestore with clean updated bank
    if (updatedBank) {
      await setDoc(BANK_DOC_REF(), {
        data: updatedBank,
        updatedAt: new Date().toISOString()
      });
    }

    // 2. Query and delete from uploaded_materials collection
    if (chapterName) {
      const colRef = collection(db, "uploaded_materials");
      const q = query(
        colRef, 
        where("gradeClass", "==", classId),
        where("chapterName", "==", chapterName)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    }

    return { success: true };
  } catch (error) {
    console.warn("Firebase delete chapter error:", error.message);
    return { success: false, error: error.message };
  }
}


/**
 * Save uploaded file material (MCQs, Shorts, Longs) directly to Firebase Firestore
 */
export async function saveUploadedMaterialToFirebase({
  fileName,
  gradeClass,
  subjectName,
  chapterName,
  topicNumber,
  topicName,
  parsedData
}) {
  try {
    const colRef = collection(db, "uploaded_materials");
    const docRef = await addDoc(colRef, {
      fileName: fileName || "Untitled Document",
      gradeClass: gradeClass || "9th",
      subjectName: subjectName || "General",
      chapterName: chapterName || "Chapter",
      topicNumber: topicNumber || "1.1",
      topicName: topicName || "General Topic",
      mcqs: parsedData?.mcqs || [],
      shortQuestions: parsedData?.shortQuestions || [],
      longQuestions: parsedData?.longQuestions || [],
      totalMcqs: parsedData?.mcqs?.length || 0,
      totalShorts: parsedData?.shortQuestions?.length || 0,
      totalLongs: parsedData?.longQuestions?.length || 0,
      uploadedAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.warn("Could not save uploaded material document to Firebase:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all uploaded documents from Firebase Firestore collection 'uploaded_materials'
 */
export async function fetchUploadedMaterialsFromFirebase() {
  try {
    const colRef = collection(db, "uploaded_materials");
    const snap = await getDocs(colRef);
    const materials = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));
    return { success: true, materials };
  } catch (err) {
    console.warn("Could not fetch uploaded materials from Firebase:", err);
    return { success: false, error: err.message, materials: [] };
  }
}


/**
 * Fetch Question Bank from Firebase Firestore
 */
export async function fetchBankFromFirebase() {
  try {
    const snap = await getDoc(BANK_DOC_REF());
    if (snap.exists() && snap.data()?.data) {
      const cloudBank = stripDummyQuestions(snap.data().data);
      saveQuestionBank(cloudBank);
      return { success: true, bank: cloudBank };
    }
    return { success: false, message: "No cloud bank found" };
  } catch (error) {
    console.warn("Firebase fetch warning:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Real-time listener for cloud changes
 */
export function subscribeToCloudBank(onBankChange) {
  try {
    return onSnapshot(BANK_DOC_REF(), (snap) => {
      if (snap.exists() && snap.data()?.data) {
        const cloudBank = stripDummyQuestions(snap.data().data);
        saveQuestionBank(cloudBank);
        if (onBankChange) {
          onBankChange(cloudBank);
        }
      }
    }, (err) => {
      console.warn("Firebase real-time listener note:", err.message);
    });
  } catch (error) {
    console.warn("Could not subscribe to cloud bank:", error.message);
    return () => {};
  }
}

/**
 * Test live connection to Firebase Firestore Cloud
 */
export async function testFirebaseConnection() {
  try {
    const testDoc = doc(db, "_connection_test", "live_ping");
    await setDoc(testDoc, {
      ping: true,
      projectId: "protestmaker-bf157",
      testedAt: new Date().toISOString()
    });
    return {
      connected: true,
      status: "success",
      message: "Firebase Cloud Firestore successfully connected & verified!"
    };
  } catch (error) {
    console.error("Firebase connection test error:", error);
    if (error.code === 'permission-denied') {
      return {
        connected: false,
        status: "permission_denied",
        message: "Firebase connected, but Firestore Security Rules require write access. (Set rules to Test Mode: allow read, write: if true;)"
      };
    }
    if (error.code === 'unavailable' || error.message?.includes('offline')) {
      return {
        connected: false,
        status: "unavailable",
        message: "Internet check karen ya Firebase Console me Firestore Database enable (Create) karen."
      };
    }
    return {
      connected: false,
      status: "error",
      message: error.message || "Failed to reach Firebase"
    };
  }
}
