// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Paste YOUR web app's Firebase configuration here from the console
const firebaseConfig = {
   apiKey: "AIzaSyCXIaiBrD5B4Nr7x5prDJUekoqmxktwRsg",
  authDomain: "college-mark-management.firebaseapp.com",
  projectId: "college-mark-management",
  storageBucket: "college-mark-management.firebasestorage.app",
  messagingSenderId: "111015568139",
  appId: "1:111015568139:web:73c26562ea174ff6a0380e",
  measurementId: "G-2ML2K1PNWX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);