const { onRequest } = require("firebase-functions/v2/https");
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
exports.sendPrayerRequestNotification = require("./src/prayerRequestNotification");
exports.sendEventReminders = require("./src/eventReminders");
exports.sendNewsletterWelcome = require("./src/newsletterWelcome");
exports.sendContactFormNotification = require("./src/contactFormNotification");
exports.processStripeWebhook = require("./src/stripeWebhook");
exports.generateAnalyticsReport = require("./src/analyticsReport");

// Simple health check function
exports.healthCheck = onRequest((req, res) => {
  cors(req, res, () => {
    logger.info("Health check requested");
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      message: "Hours of Mercy Church Cloud Functions are running!",
    });
  });
});

// Test function for debugging
exports.testFunction = onRequest((req, res) => {
  cors(req, res, () => {
    logger.info("Test function called");
    res.json({
      message: "Test function working!",
      timestamp: new Date().toISOString(),
      requestMethod: req.method,
      userAgent: req.get("User-Agent"),
    });
  });
});
