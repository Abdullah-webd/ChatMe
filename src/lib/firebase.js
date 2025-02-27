import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "dev-learn-450603.firebaseapp.com",
  projectId: "dev-learn-450603",
  storageBucket: "dev-learn-450603.firebasestorage.app",
  messagingSenderId: "76372315703",
  appId: "1:76372315703:web:ef83c7e82bd320ba95b9b2",
  measurementId: "G-RJ8TE59KWY"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth()
export const db = getFirestore()

