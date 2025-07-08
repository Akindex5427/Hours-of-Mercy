// Audit Logging Service for Firebase
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "./config";

// Audit logging service
export const auditService = {
  // Log admin actions
  logAdminAction: async (action, details = {}) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "adminLogs"), {
        action,
        details,
        userId: user.uid,
        userEmail: user.email,
        userDisplayName: user.displayName || "Unknown",
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        ipAddress: "pending", // Would need server-side logging for real IP
      });
    } catch (error) {
      console.error("Failed to log admin action:", error);
    }
  },

  // Log user actions
  logUserAction: async (action, details = {}) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "userLogs"), {
        action,
        details,
        userId: user.uid,
        userEmail: user.email,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to log user action:", error);
    }
  },

  // Log security events
  logSecurityEvent: async (event, details = {}) => {
    try {
      await addDoc(collection(db, "securityLogs"), {
        event,
        details,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        userId: auth.currentUser?.uid || "anonymous",
        userEmail: auth.currentUser?.email || "anonymous",
      });
    } catch (error) {
      console.error("Failed to log security event:", error);
    }
  },

  // Get recent admin logs (admin only)
  getAdminLogs: async (limitCount = 50) => {
    try {
      const q = query(
        collection(db, "adminLogs"),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Failed to get admin logs:", error);
      return [];
    }
  },

  // Get recent security logs (admin only)
  getSecurityLogs: async (limitCount = 50) => {
    try {
      const q = query(
        collection(db, "securityLogs"),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Failed to get security logs:", error);
      return [];
    }
  },
};

// Audit action types
export const AUDIT_ACTIONS = {
  // Admin actions
  ADMIN_LOGIN: "admin_login",
  ADMIN_LOGOUT: "admin_logout",
  MEMBER_CREATED: "member_created",
  MEMBER_UPDATED: "member_updated",
  MEMBER_DELETED: "member_deleted",
  CONTACT_VIEWED: "contact_viewed",
  CONTACT_UPDATED: "contact_updated",
  PRAYER_REQUEST_VIEWED: "prayer_request_viewed",
  DATABASE_SEEDED: "database_seeded",
  CLOUD_FUNCTION_TESTED: "cloud_function_tested",

  // User actions
  USER_REGISTERED: "user_registered",
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  PROFILE_UPDATED: "profile_updated",
  PRAYER_REQUEST_SUBMITTED: "prayer_request_submitted",
  CONTACT_FORM_SUBMITTED: "contact_form_submitted",
  NEWSLETTER_SUBSCRIBED: "newsletter_subscribed",

  // Security events
  UNAUTHORIZED_ACCESS_ATTEMPT: "unauthorized_access_attempt",
  INVALID_ADMIN_CODE: "invalid_admin_code",
  SUCCESSFUL_ADMIN_VERIFICATION: "successful_admin_verification",
  FAILED_LOGIN_ATTEMPT: "failed_login_attempt",
  SUSPICIOUS_ACTIVITY: "suspicious_activity",
};

// Helper function to log with predefined actions
export const logAuditEvent = {
  adminLogin: () => auditService.logAdminAction(AUDIT_ACTIONS.ADMIN_LOGIN),
  adminLogout: () => auditService.logAdminAction(AUDIT_ACTIONS.ADMIN_LOGOUT),

  memberCreated: (memberData) =>
    auditService.logAdminAction(AUDIT_ACTIONS.MEMBER_CREATED, {
      memberEmail: memberData.email,
      memberName: `${memberData.firstName} ${memberData.lastName}`,
    }),

  memberUpdated: (memberId, changes) =>
    auditService.logAdminAction(AUDIT_ACTIONS.MEMBER_UPDATED, {
      memberId,
      changes: Object.keys(changes),
    }),

  memberDeleted: (memberId, memberEmail) =>
    auditService.logAdminAction(AUDIT_ACTIONS.MEMBER_DELETED, {
      memberId,
      memberEmail,
    }),

  contactViewed: (contactId) =>
    auditService.logAdminAction(AUDIT_ACTIONS.CONTACT_VIEWED, { contactId }),

  contactUpdated: (contactId, newStatus) =>
    auditService.logAdminAction(AUDIT_ACTIONS.CONTACT_UPDATED, {
      contactId,
      newStatus,
    }),

  prayerRequestViewed: (requestId) =>
    auditService.logAdminAction(AUDIT_ACTIONS.PRAYER_REQUEST_VIEWED, {
      requestId,
    }),

  databaseSeeded: (collections) =>
    auditService.logAdminAction(AUDIT_ACTIONS.DATABASE_SEEDED, {
      collections: collections.join(", "),
    }),

  cloudFunctionTested: (functionName, result) =>
    auditService.logAdminAction(AUDIT_ACTIONS.CLOUD_FUNCTION_TESTED, {
      functionName,
      success: result.success,
    }),

  userRegistered: (userData) =>
    auditService.logUserAction(AUDIT_ACTIONS.USER_REGISTERED, {
      userEmail: userData.email,
    }),

  userLogin: () => auditService.logUserAction(AUDIT_ACTIONS.USER_LOGIN),
  userLogout: () => auditService.logUserAction(AUDIT_ACTIONS.USER_LOGOUT),

  profileUpdated: (changes) =>
    auditService.logUserAction(AUDIT_ACTIONS.PROFILE_UPDATED, {
      changes: Object.keys(changes),
    }),

  prayerRequestSubmitted: (requestType, isUrgent) =>
    auditService.logUserAction(AUDIT_ACTIONS.PRAYER_REQUEST_SUBMITTED, {
      requestType,
      isUrgent,
    }),

  contactFormSubmitted: (subject) =>
    auditService.logUserAction(AUDIT_ACTIONS.CONTACT_FORM_SUBMITTED, {
      subject,
    }),

  newsletterSubscribed: () =>
    auditService.logUserAction(AUDIT_ACTIONS.NEWSLETTER_SUBSCRIBED),

  // Security events
  unauthorizedAccess: (attemptedAction) =>
    auditService.logSecurityEvent(AUDIT_ACTIONS.UNAUTHORIZED_ACCESS_ATTEMPT, {
      attemptedAction,
    }),

  invalidAdminCode: (enteredCode) =>
    auditService.logSecurityEvent(AUDIT_ACTIONS.INVALID_ADMIN_CODE, {
      enteredCodeLength: enteredCode.length,
    }),

  successfulAdminVerification: () =>
    auditService.logSecurityEvent(AUDIT_ACTIONS.SUCCESSFUL_ADMIN_VERIFICATION),

  failedLoginAttempt: (email, errorCode) =>
    auditService.logSecurityEvent(AUDIT_ACTIONS.FAILED_LOGIN_ATTEMPT, {
      email,
      errorCode,
    }),

  suspiciousActivity: (description) =>
    auditService.logSecurityEvent(AUDIT_ACTIONS.SUSPICIOUS_ACTIVITY, {
      description,
    }),
};
