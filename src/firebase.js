// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDtYGLClMx59niZ5X8W6x3g7Xpi7z5yObI",
  authDomain: "protestmaker-bf157.firebaseapp.com",
  projectId: "protestmaker-bf157",
  storageBucket: "protestmaker-bf157.firebasestorage.app",
  messagingSenderId: "935449801691",
  appId: "1:935449801691:web:d2690be651f33d994dadfe",
  measurementId: "G-0HH7R08X2D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore & Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics conditionally
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
