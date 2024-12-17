// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClTQpGBK8CqpGCY6kzVJ1Ms2mTbZUhBxg",
  authDomain: "ionots-5caab.firebaseapp.com",
  projectId: "ionots-5caab",
  storageBucket: "ionots-5caab.firebasestorage.app",
  messagingSenderId: "131939238640",
  appId: "1:131939238640:web:089b792377f8a0caf93835",
  measurementId: "G-P7B0WSH3YF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
