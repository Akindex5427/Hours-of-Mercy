#!/usr/bin/env node

// Script to seed the Firebase database with sermon data
// This will transfer all static sermon data from SermonPage to Firebase

import { seedFirestoreData } from "./seed-firestore.js";

console.log("🌱 Starting Firebase seeding process...");
console.log("📋 This will add all sermon data from SermonPage to Firestore");

// Run the seeding
seedFirestoreData()
  .then(() => {
    console.log("✅ Successfully seeded Firebase with sermon data!");
    console.log("🎉 SermonPage will now display data from Firestore");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error seeding Firebase:", error);
    process.exit(1);
  });
