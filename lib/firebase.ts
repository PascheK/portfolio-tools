// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrMmBbiKjPGBb0ahRLFw3OgPQp3_-dj_s",
  authDomain: "unops-psc-ims-prod.firebaseapp.com",
  projectId: "unops-psc-ims-prod",
  storageBucket: "unops-psc-ims-prod.firebasestorage.app",
  messagingSenderId: "709651493217",
  appId: "1:709651493217:web:a16aec0dd6c24619239520"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
