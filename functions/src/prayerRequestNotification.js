const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Configure email transporter (you'll need to set up your email service)
// For development, you can use Gmail with an app password
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.CHURCH_EMAIL || "your-church-email@gmail.com",
    pass: process.env.CHURCH_EMAIL_PASSWORD || "your-app-password",
  },
});

/**
 * Sends email notifications when a new prayer request is submitted
 * Triggers when a document is created in the 'prayer-requests' collection
 */
module.exports = onDocumentCreated(
  "prayer-requests/{documentId}",
  async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        logger.warn("No data associated with the event");
        return;
      }

      const prayerRequest = snapshot.data();
      const documentId = event.params.documentId;

      logger.info(`New prayer request received: ${documentId}`, {
        requesterName: prayerRequest.name,
        isUrgent: prayerRequest.isUrgent,
        timestamp: prayerRequest.createdAt,
      });

      // Get church staff emails from Firestore
      const staffSnapshot = await admin
        .firestore()
        .collection("staff")
        .where("department", "==", "pastoral")
        .get();

      const staffEmails = [];
      staffSnapshot.forEach((doc) => {
        const staff = doc.data();
        if (staff.email) {
          staffEmails.push(staff.email);
        }
      });

      // If no staff emails found, use a default
      if (staffEmails.length === 0) {
        staffEmails.push(
          process.env.DEFAULT_NOTIFICATION_EMAIL || "pastor@hoursofmercy.org"
        );
      }

      // Prepare email content
      const subject = prayerRequest.isUrgent
        ? "🙏 URGENT Prayer Request - Hours of Mercy"
        : "🙏 New Prayer Request - Hours of Mercy";

      const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2; text-align: center;">
          ${prayerRequest.isUrgent ? "URGENT " : ""}Prayer Request
        </h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Requester Information:</h3>
          <p><strong>Name:</strong> ${prayerRequest.name}</p>
          <p><strong>Email:</strong> ${
            prayerRequest.email || "Not provided"
          }</p>
          <p><strong>Phone:</strong> ${
            prayerRequest.phone || "Not provided"
          }</p>
          <p><strong>Member:</strong> ${
            prayerRequest.isMember ? "Yes" : "No"
          }</p>
        </div>

        <div style="background: #fff; padding: 20px; border-left: 4px solid #1976d2; margin: 20px 0;">
          <h3>Prayer Request:</h3>
          <p style="font-size: 16px; line-height: 1.6;">${
            prayerRequest.request
          }</p>
        </div>

        ${
          prayerRequest.isUrgent
            ? `
          <div style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0;">
            <p style="color: #e65100; font-weight: bold; margin: 0;">⚠️ This request has been marked as URGENT</p>
          </div>
        `
            : ""
        }

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Submitted:</strong> ${new Date(
            prayerRequest.createdAt?.toDate()
          ).toLocaleString()}</p>
          <p><strong>Request ID:</strong> ${documentId}</p>
        </div>

        <hr style="margin: 30px 0;">
        <p style="text-align: center; color: #666; font-size: 14px;">
          This notification was sent automatically from the Hours of Mercy website prayer request system.
        </p>
      </div>
    `;

      // Send email to all staff members
      const emailPromises = staffEmails.map((email) => {
        return transporter.sendMail({
          from: `"Hours of Mercy Church" <${
            process.env.CHURCH_EMAIL || "noreply@hoursofmercy.org"
          }>`,
          to: email,
          subject: subject,
          html: htmlContent,
        });
      });

      await Promise.all(emailPromises);

      // Update the prayer request document to mark as notified
      await snapshot.ref.update({
        staffNotified: true,
        staffNotifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info(
        `Prayer request notifications sent successfully to ${staffEmails.length} recipients`
      );
    } catch (error) {
      logger.error("Error sending prayer request notification:", error);
      // Don't throw the error to avoid infinite retries
    }
  }
);
