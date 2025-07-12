// Simple seed test
import { db } from "./firebase-server-config.js";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

async function testSeed() {
  try {
    console.log("🚀 Starting simple seed test...");

    // Test configuration seeding
    const testConfig = {
      id: "test_config",
      data: {
        test: true,
        message: "This is a test configuration",
      },
    };

    await setDoc(doc(db, "configuration", testConfig.id), {
      ...testConfig.data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Test configuration added successfully!");

    // Test staff seeding
    const testStaff = {
      id: "test-staff",
      name: "Test Staff Member",
      title: "Test Title",
      email: "test@hoursofmercy.org",
    };

    await setDoc(doc(db, "staff", testStaff.id), {
      ...testStaff,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Test staff added successfully!");
    console.log("🎉 Simple seed test completed!");
  } catch (error) {
    console.error("❌ Seed test failed:", error);
  }
}

testSeed();
