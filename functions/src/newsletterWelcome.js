const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Configure email transporter
const transporter = nodemailer.createTransporter({
  service: "gmail",
  auth: {
    user: process.env.CHURCH_EMAIL || "your-church-email@gmail.com",
    pass: process.env.CHURCH_EMAIL_PASSWORD || "your-app-password",
  },
});

/**
 * Sends a welcome email when someone subscribes to the newsletter
 * Triggers when a document is created in the 'newsletter-subscriptions' collection
 */
module.exports = onDocumentCreated(
  "newsletter-subscriptions/{documentId}",
  async (event) => {
    try {
      const snapshot = event.data;
      if (!snapshot) {
        logger.warn("No data associated with the event");
        return;
      }

      const subscription = snapshot.data();
      const documentId = event.params.documentId;

      logger.info(`New newsletter subscription: ${documentId}`, {
        email: subscription.email,
        timestamp: subscription.createdAt,
      });

      // Get upcoming events for the welcome email
      const now = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);

      const upcomingEventsSnapshot = await admin
        .firestore()
        .collection("events")
        .where("date", ">=", admin.firestore.Timestamp.fromDate(now))
        .where("date", "<=", admin.firestore.Timestamp.fromDate(nextWeek))
        .orderBy("date", "asc")
        .limit(3)
        .get();

      const upcomingEvents = [];
      upcomingEventsSnapshot.forEach((doc) => {
        upcomingEvents.push(doc.data());
      });

      // Get latest sermon for the welcome email
      const latestSermonSnapshot = await admin
        .firestore()
        .collection("sermons")
        .orderBy("date", "desc")
        .limit(1)
        .get();

      let latestSermon = null;
      if (!latestSermonSnapshot.empty) {
        latestSermon = latestSermonSnapshot.docs[0].data();
      }

      // Create welcome email content
      const subject = "Welcome to Hours of Mercy Church! 🙏";

      const upcomingEventsHtml =
        upcomingEvents.length > 0
          ? `
      <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3 style="color: #1976d2; margin: 0 0 15px 0;">📅 Upcoming Events</h3>
        ${upcomingEvents
          .map((event) => {
            const eventDate = new Date(event.date?.toDate());
            return `
            <div style="border-left: 3px solid #1976d2; padding-left: 15px; margin: 10px 0;">
              <p style="margin: 0; font-weight: bold; color: #1976d2;">${
                event.title
              }</p>
              <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
                ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }
            )}
              </p>
            </div>
          `;
          })
          .join("")}
      </div>
    `
          : "";

      const latestSermonHtml = latestSermon
        ? `
      <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h3 style="color: #1976d2; margin: 0 0 15px 0;">🎙️ Latest Sermon</h3>
        <div style="border-left: 3px solid #1976d2; padding-left: 15px;">
          <p style="margin: 0; font-weight: bold; color: #1976d2;">${
            latestSermon.title
          }</p>
          <p style="margin: 5px 0; color: #666;">Pastor ${
            latestSermon.speaker
          }</p>
          <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
            ${new Date(latestSermon.date?.toDate()).toLocaleDateString()}
          </p>
          ${
            latestSermon.videoUrl
              ? `
            <p style="margin: 10px 0 0 0;">
              <a href="${latestSermon.videoUrl}" style="color: #1976d2; text-decoration: none;">
                ▶️ Watch Online
              </a>
            </p>
          `
              : ""
          }
        </div>
      </div>
    `
        : "";

      const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #1976d2; margin: 0 0 10px 0;">Welcome to Our Church Family! 🙏</h1>
          <h2 style="color: #666; margin: 0; font-weight: normal;">Hours of Mercy Church</h2>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.6;">
            Thank you for subscribing to our newsletter! We're thrilled to have you as part of our community. 
            You'll receive updates about upcoming events, inspiring messages, and ways to get involved in our ministry.
          </p>
        </div>

        ${upcomingEventsHtml}
        ${latestSermonHtml}

        <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">📍 Visit Us</h3>
          <p style="margin: 0; line-height: 1.6;">
            <strong>Christ Apostolic Church Hours of Mercy</strong><br>
            1480 Lincoln Ave<br>
            Dolton, Illinois, USA<br><br>
            
            <strong>Sunday Service:</strong> 10:00 AM<br>
            <strong>Wednesday Bible Study:</strong> 7:00 PM<br>
            <strong>Friday Prayer Meeting:</strong> 7:00 PM
          </p>
        </div>

        <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">🤝 Get Connected</h3>
          <p style="margin: 0; line-height: 1.6;">
            • Join our prayer chain for urgent prayer requests<br>
            • Participate in our community outreach programs<br>
            • Connect with our various ministries and small groups<br>
            • Follow us on social media for daily inspiration
          </p>
        </div>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            Have questions or need prayer? 
            <a href="mailto:${
              process.env.CHURCH_EMAIL || "contact@hoursofmercy.org"
            }" style="color: #1976d2;">
              Contact us anytime
            </a>
          </p>
          <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
            You can unsubscribe from these emails at any time by contacting us.
          </p>
        </div>

        <div style="text-align: center; padding: 20px;">
          <p style="margin: 0; color: #1976d2; font-style: italic;">
            "For where two or three gather in my name, there am I with them." - Matthew 18:20
          </p>
        </div>
      </div>
    `;

      // Send welcome email
      await transporter.sendMail({
        from: `"Hours of Mercy Church" <${
          process.env.CHURCH_EMAIL || "noreply@hoursofmercy.org"
        }>`,
        to: subscription.email,
        subject: subject,
        html: htmlContent,
      });

      // Update the subscription document to mark as welcome email sent
      await snapshot.ref.update({
        welcomeEmailSent: true,
        welcomeEmailSentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info(`Welcome email sent successfully to: ${subscription.email}`);
    } catch (error) {
      logger.error("Error sending welcome email:", error);
      // Don't throw the error to avoid infinite retries
    }
  }
);
