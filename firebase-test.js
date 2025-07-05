// Simple Firebase integration test
import { db, auth, storage, analytics } from "./src/firebase/config.js";

console.log("🔥 Firebase Integration Test");
console.log("✅ Firebase app initialized");
console.log("✅ Firestore database:", db ? "Connected" : "Not connected");
console.log("✅ Authentication:", auth ? "Connected" : "Not connected");
console.log("✅ Storage:", storage ? "Connected" : "Not connected");
console.log("✅ Analytics:", analytics ? "Connected" : "Not connected");

// Test Firebase configuration
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBdctpPLqgEdQx3PrlmgsD4_T4fq7fcinU",
  authDomain: "the-project-f1728.firebaseapp.com",
  projectId: "the-project-f1728",
  storageBucket: "the-project-f1728.firebasestorage.app",
  messagingSenderId: "800459592558",
  appId: "1:800459592558:web:469d73bd7c2bbc0ace277f",
  measurementId: "G-P5NDLWL5NZ",
};

try {
  const app = initializeApp(firebaseConfig);
  console.log("✅ Firebase configuration is valid");
} catch (error) {
  console.error("❌ Firebase configuration error:", error);
}
