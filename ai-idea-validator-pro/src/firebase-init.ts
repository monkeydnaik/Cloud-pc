import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBhKyJzan8TkUQPzDs-tL1Cb_4kEvG77OQ",
  authDomain: "ai-idea-validotor.firebaseapp.com",
  projectId: "ai-idea-validotor",
  storageBucket: "ai-idea-validotor.firebasestorage.app",
  messagingSenderId: "405201642452",
  appId: "1:405201642452:web:546840f25983296ebf2c41",
  measurementId: "G-PLCHB035H1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
