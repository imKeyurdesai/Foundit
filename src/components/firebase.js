import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD4qBCmhXChkYdKSFcMuUYdiuKxpMB2BdM",
  authDomain: "found-it-de7ce.firebaseapp.com",
  projectId: "found-it-de7ce",
  storageBucket: "found-it-de7ce.appspot.com",
  messagingSenderId: "390827705899",
  appId: "1:390827705899:web:87cedb8d3673692b928c6e",
  measurementId: "G-8Q1RTMQ88P",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
