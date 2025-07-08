// Firebase Authentication service functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth } from "./config";
import { memberService } from "./firestore";
import { logAuditEvent } from "./audit";

// Authentication service
export const authService = {
  // Register new user with email and password
  registerWithEmailAndPassword: async (email, password, userData) => {
    try {
      // Create Firebase Auth account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update display name in Firebase Auth
      await updateProfile(user, {
        displayName: `${userData.firstName} ${userData.lastName}`,
      });

      // Create member profile in Firestore
      await memberService.createMemberProfile(user.uid, {
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || "",
        displayName: `${userData.firstName} ${userData.lastName}`,
        emailVerified: user.emailVerified,
      });

      // Log user registration
      await logAuditEvent.userRegistered({
        email: user.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  // Sign in with email and password
  signInWithEmailAndPassword: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Log successful login
      await logAuditEvent.userLogin();

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      };
    } catch (error) {
      console.error("Sign in error:", error);
      // Log failed login attempt
      await logAuditEvent.failedLoginAttempt(email, error.code);
      throw error;
    }
  },

  // Sign out current user
  signOut: async () => {
    try {
      // Log user logout before signing out
      await logAuditEvent.userLogout();
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  },

  // Update user password
  updatePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      await updatePassword(user, newPassword);
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  },

  // Re-authenticate user (required for sensitive operations)
  reauthenticateUser: async (currentPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.error("Re-authentication error:", error);
      throw error;
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};

// Error message helper
export const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/requires-recent-login":
      return "Please log in again to perform this action.";
    default:
      return error.message || "An error occurred. Please try again.";
  }
};
