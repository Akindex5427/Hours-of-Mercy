// Firebase configuration for server-side operations (no analytics)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBdctpPLqgEdQx3PrlmgsD4_T4fq7fcinU",
  authDomain: "the-project-f1728.firebaseapp.com",
  projectId: "the-project-f1728",
  storageBucket: "the-project-f1728.firebasestorage.app",
  messagingSenderId: "800459592558",
  appId: "1:800459592558:web:469d73bd7c2bbc0ace277f",
  measurementId: "G-P5NDLWL5NZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (server-side only)
export const db = getFirestore(app);

export default app;
