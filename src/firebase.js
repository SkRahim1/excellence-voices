import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyANSnox_vpsSxeh2gQen3RLM6GWwBuZpHc",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "excellence-voices.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "excellence-voices",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "excellence-voices.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "913710073561",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:913710073561:web:63d7bb6b307d0ec3ad60c8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
