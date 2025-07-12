// Firestore database service functions
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

// Staff Directory Functions
export const staffService = {
  // Get all staff members
  getAllStaff: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "staff"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching staff:", error);
      throw error;
    }
  },

  // Add new staff member
  addStaff: async (staffData) => {
    try {
      const docRef = await addDoc(collection(db, "staff"), {
        ...staffData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding staff:", error);
      throw error;
    }
  },

  // Update staff member
  updateStaff: async (staffId, updateData) => {
    try {
      const staffRef = doc(db, "staff", staffId);
      await updateDoc(staffRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating staff:", error);
      throw error;
    }
  },

  // Delete staff member
  deleteStaff: async (staffId) => {
    try {
      await deleteDoc(doc(db, "staff", staffId));
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw error;
    }
  },
};

// Events Functions
export const eventsService = {
  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const eventsRef = collection(db, "events");
      const q = query(
        eventsRef,
        where("date", ">=", new Date()),
        orderBy("date", "asc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to JavaScript Date, then to string
          date: data.date?.toDate
            ? data.date.toDate().toLocaleDateString()
            : data.date,
          // Handle createdAt and updatedAt if they exist
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt,
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : data.updatedAt,
        };
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  },

  // Add new event
  addEvent: async (eventData) => {
    try {
      const docRef = await addDoc(collection(db, "events"), {
        ...eventData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  },

  // Get all events
  getAllEvents: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  },
};

// Sermons Functions
export const sermonsService = {
  // Get recent sermons
  getRecentSermons: async (limitCount = 10) => {
    try {
      const sermonsRef = collection(db, "sermons");
      const q = query(sermonsRef, orderBy("date", "desc"), limit(limitCount));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to JavaScript Date
          date: data.date?.toDate
            ? data.date.toDate().toLocaleDateString()
            : data.date,
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt,
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : data.updatedAt,
        };
      });
    } catch (error) {
      console.error("Error fetching sermons:", error);
      throw error;
    }
  },

  // Add new sermon
  addSermon: async (sermonData) => {
    try {
      const docRef = await addDoc(collection(db, "sermons"), {
        ...sermonData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding sermon:", error);
      throw error;
    }
  },

  // Get sermon by ID
  getSermonById: async (sermonId) => {
    try {
      const sermonRef = doc(db, "sermons", sermonId);
      const sermonSnap = await getDoc(sermonRef);
      if (sermonSnap.exists()) {
        return { id: sermonSnap.id, ...sermonSnap.data() };
      } else {
        throw new Error("Sermon not found");
      }
    } catch (error) {
      console.error("Error fetching sermon:", error);
      throw error;
    }
  },
};

// Prayer Requests Functions
export const prayerRequestsService = {
  // Add prayer request
  addPrayerRequest: async (requestData) => {
    try {
      const docRef = await addDoc(collection(db, "prayerRequests"), {
        ...requestData,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding prayer request:", error);
      throw error;
    }
  },

  // Get prayer requests (for admin)
  getPrayerRequests: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "prayerRequests"));
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamps to JavaScript Dates
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt,
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : data.updatedAt,
        };
      });
    } catch (error) {
      console.error("Error fetching prayer requests:", error);
      throw error;
    }
  },

  // Update prayer request status
  updatePrayerRequestStatus: async (requestId, status) => {
    try {
      const requestRef = doc(db, "prayerRequests", requestId);
      await updateDoc(requestRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating prayer request:", error);
      throw error;
    }
  },
};

// Newsletter Subscriptions
export const newsletterService = {
  // Subscribe to newsletter
  subscribe: async (email, name = "") => {
    try {
      const docRef = await addDoc(collection(db, "newsletterSubscriptions"), {
        email,
        name,
        subscribedAt: serverTimestamp(),
        isActive: true,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  },

  // Get all subscribers (for admin)
  getSubscribers: async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "newsletterSubscriptions")
      );
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to JavaScript Date
          subscribedAt: data.subscribedAt?.toDate
            ? data.subscribedAt.toDate()
            : data.subscribedAt,
        };
      });
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      throw error;
    }
  },
};

// Member/User Profile Functions
export const memberService = {
  // Create member profile after Firebase Auth registration
  createMemberProfile: async (uid, memberData) => {
    try {
      const docRef = doc(db, "members", uid);
      await setDoc(docRef, {
        ...memberData,
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        role: "member", // member, staff, admin
        membershipStatus: "active", // active, inactive, pending
        joinedChurch: memberData.joinedChurch || null,
        profileComplete: false,
      });
      return uid;
    } catch (error) {
      console.error("Error creating member profile:", error);
      throw error;
    }
  },

  // Get member profile by UID
  getMemberProfile: async (uid) => {
    try {
      const docRef = doc(db, "members", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          // Convert Firestore Timestamps to JavaScript Dates
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt,
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : data.updatedAt,
          joinedChurch: data.joinedChurch?.toDate
            ? data.joinedChurch.toDate()
            : data.joinedChurch,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching member profile:", error);
      throw error;
    }
  },

  // Update member profile
  updateMemberProfile: async (uid, updateData) => {
    try {
      const docRef = doc(db, "members", uid);
      await updateDoc(docRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating member profile:", error);
      throw error;
    }
  },

  // Get all members (admin only)
  getAllMembers: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "members"));
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamps to JavaScript Dates
          createdAt: data.createdAt?.toDate
            ? data.createdAt.toDate()
            : data.createdAt,
          updatedAt: data.updatedAt?.toDate
            ? data.updatedAt.toDate()
            : data.updatedAt,
          joinedChurch: data.joinedChurch?.toDate
            ? data.joinedChurch.toDate()
            : data.joinedChurch,
        };
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      throw error;
    }
  },

  // Update member status
  updateMemberStatus: async (uid, status) => {
    try {
      const docRef = doc(db, "members", uid);
      await updateDoc(docRef, {
        membershipStatus: status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating member status:", error);
      throw error;
    }
  },

  // Delete member profile
  deleteMemberProfile: async (uid) => {
    try {
      await deleteDoc(doc(db, "members", uid));
    } catch (error) {
      console.error("Error deleting member profile:", error);
      throw error;
    }
  },
};

// Contact Form Functions
export const contactService = {
  // Submit contact form
  submitContactForm: async (contactData) => {
    try {
      const docRef = await addDoc(collection(db, "contactSubmissions"), {
        ...contactData,
        submittedAt: serverTimestamp(),
        status: "new", // new, read, replied
        isUrgent: contactData.isUrgent || false,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error submitting contact form:", error);
      throw error;
    }
  },

  // Get all contact submissions (admin only)
  getAllContactSubmissions: async () => {
    try {
      const q = query(
        collection(db, "contactSubmissions"),
        orderBy("submittedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to JavaScript Date
          submittedAt: data.submittedAt?.toDate
            ? data.submittedAt.toDate()
            : data.submittedAt,
        };
      });
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      throw error;
    }
  },

  // Update contact submission status
  updateContactStatus: async (submissionId, status) => {
    try {
      const docRef = doc(db, "contactSubmissions", submissionId);
      await updateDoc(docRef, {
        status,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating contact status:", error);
      throw error;
    }
  },

  // Get contact submissions by status
  getContactSubmissionsByStatus: async (status) => {
    try {
      const q = query(
        collection(db, "contactSubmissions"),
        where("status", "==", status),
        orderBy("submittedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to JavaScript Date
          submittedAt: data.submittedAt?.toDate
            ? data.submittedAt.toDate()
            : data.submittedAt,
        };
      });
    } catch (error) {
      console.error("Error fetching contact submissions by status:", error);
      throw error;
    }
  },

  // Delete contact submission
  deleteContactSubmission: async (submissionId) => {
    try {
      await deleteDoc(doc(db, "contactSubmissions", submissionId));
    } catch (error) {
      console.error("Error deleting contact submission:", error);
      throw error;
    }
  },
};

// Ministries Service
export const ministriesService = {
  // Get all ministries
  getAllMinistries: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "ministries"));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching ministries:", error);
      throw error;
    }
  },

  // Add new ministry
  addMinistry: async (ministryData) => {
    try {
      const docRef = await addDoc(collection(db, "ministries"), {
        ...ministryData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding ministry:", error);
      throw error;
    }
  },

  // Update ministry
  updateMinistry: async (id, ministryData) => {
    try {
      await updateDoc(doc(db, "ministries", id), {
        ...ministryData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating ministry:", error);
      throw error;
    }
  },

  // Delete ministry
  deleteMinistry: async (id) => {
    try {
      await deleteDoc(doc(db, "ministries", id));
    } catch (error) {
      console.error("Error deleting ministry:", error);
      throw error;
    }
  },
};

// Church Configuration Service (for prayer types, giving options, beliefs, etc.)
export const configService = {
  // Get configuration by type
  getConfig: async (configType) => {
    try {
      const docRef = doc(db, "configuration", configType);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log("No such configuration!");
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ${configType} configuration:`, error);
      throw error;
    }
  },

  // Set configuration
  setConfig: async (configType, configData) => {
    try {
      await setDoc(doc(db, "configuration", configType), {
        ...configData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error setting ${configType} configuration:`, error);
      throw error;
    }
  },

  // Update configuration
  updateConfig: async (configType, configData) => {
    try {
      await updateDoc(doc(db, "configuration", configType), {
        ...configData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error updating ${configType} configuration:`, error);
      throw error;
    }
  },
};

// Church Information Service (for beliefs, values, staff info, etc.)
export const churchInfoService = {
  // Get church information by section
  getChurchInfo: async (section) => {
    try {
      const docRef = doc(db, "church_info", section);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log(`No ${section} information found!`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching ${section} information:`, error);
      throw error;
    }
  },

  // Set church information
  setChurchInfo: async (section, infoData) => {
    try {
      await setDoc(doc(db, "church_info", section), {
        ...infoData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error setting ${section} information:`, error);
      throw error;
    }
  },

  // Update church information
  updateChurchInfo: async (section, infoData) => {
    try {
      await updateDoc(doc(db, "church_info", section), {
        ...infoData,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Error updating ${section} information:`, error);
      throw error;
    }
  },
};

// Real-time listener for live updates
export const setupRealtimeListener = (collectionName, callback) => {
  const collectionRef = collection(db, collectionName);
  return onSnapshot(collectionRef, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
};

// Helper function to convert Firestore timestamp to JavaScript Date
export const firestoreTimestampToDate = (timestamp) => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return timestamp;
};
