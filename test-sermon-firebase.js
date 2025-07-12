// Test script to verify Firebase sermon data integration
// This file demonstrates how the SermonPage will work with Firebase data

import { sermonsService } from "./src/firebase/firestore.js";

const testFirebaseSermons = async () => {
  try {
    console.log("Testing Firebase sermon data...");
    const sermons = await sermonsService.getRecentSermons(5);
    console.log("Firebase sermons loaded:", sermons);

    if (sermons.length > 0) {
      console.log("✅ SUCCESS: Firebase sermons are loading correctly");
      console.log("Sample sermon data structure:");
      console.log(JSON.stringify(sermons[0], null, 2));
    } else {
      console.log("⚠️  WARNING: No sermons found in Firebase");
    }
  } catch (error) {
    console.error("❌ ERROR: Failed to load sermons from Firebase:", error);
  }
};

export default testFirebaseSermons;
