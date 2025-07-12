// Simple Firebase connection test
import { db } from "./firebase-server-config.js";
import { collection, getDocs } from "firebase/firestore";

async function testConnection() {
  try {
    console.log("Testing Firebase connection...");
    const testCollection = collection(db, "test");
    const snapshot = await getDocs(testCollection);
    console.log("Firebase connection successful!");
    console.log("Test collection contains", snapshot.size, "documents");
  } catch (error) {
    console.error("Firebase connection failed:", error);
  }
}

testConnection();
