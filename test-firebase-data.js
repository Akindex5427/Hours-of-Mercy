// Test Firebase connection and data
import { db } from "./firebase-server-config.js";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

async function testFirebaseData() {
  try {
    console.log("Testing Firebase data...");

    // Test staff collection
    console.log("Checking staff collection...");
    const staffSnapshot = await getDocs(collection(db, "staff"));
    console.log("Staff documents:", staffSnapshot.size);

    // Test configuration collection
    console.log("Checking configuration collection...");
    const configSnapshot = await getDocs(collection(db, "configuration"));
    console.log("Configuration documents:", configSnapshot.size);

    // Test church_info collection
    console.log("Checking church_info collection...");
    const churchInfoSnapshot = await getDocs(collection(db, "church_info"));
    console.log("Church info documents:", churchInfoSnapshot.size);

    // Check specific config documents
    const contactSubjectsDoc = await getDoc(
      doc(db, "configuration", "contact_subjects")
    );
    console.log("Contact subjects exists:", contactSubjectsDoc.exists());

    if (staffSnapshot.size === 0) {
      console.log(
        "🚨 No staff data found in Firebase! Need to run seed script."
      );
    }

    if (configSnapshot.size === 0) {
      console.log(
        "🚨 No configuration data found in Firebase! Need to run seed script."
      );
    }
  } catch (error) {
    console.error("Firebase test failed:", error);
  }
}

testFirebaseData();
