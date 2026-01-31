import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "found-it-de7ce.appspot.com",
  messagingSenderId: "390827705899",
  appId: "1:390827705899:web:87cedb8d3673692b928c6e",
  measurementId: "G-8Q1RTMQ88P",
};

const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 🗄 Firestore
export const db = getFirestore(app);

// 📦 Storage (THIS WAS MISSING)
export const storage = getStorage(app);

export default app;
