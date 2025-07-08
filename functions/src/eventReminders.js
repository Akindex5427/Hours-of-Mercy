const { onSchedule } = require("firebase-functions/v2/scheduler");
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
 * Sends event reminders to newsletter subscribers
 * Runs every day at 9 AM to check for events happening tomorrow
 */
module.exports = onSchedule("0 9 * * *", async (event) => {
  try {
    logger.info("Starting event reminder job");

    // Calculate tomorrow's date range
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    // Get events happening tomorrow
    const eventsSnapshot = await admin
      .firestore()
      .collection("events")
      .where("date", ">=", admin.firestore.Timestamp.fromDate(tomorrow))
      .where("date", "<=", admin.firestore.Timestamp.fromDate(tomorrowEnd))
      .get();

    if (eventsSnapshot.empty) {
      logger.info("No events tomorrow, skipping reminder emails");
      return;
    }

    const events = [];
    eventsSnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    logger.info(`Found ${events.length} events for tomorrow`);

    // Get newsletter subscribers
    const subscribersSnapshot = await admin
      .firestore()
      .collection("newsletter-subscriptions")
      .where("isActive", "==", true)
      .get();

    if (subscribersSnapshot.empty) {
      logger.info("No active newsletter subscribers found");
      return;
    }

    const subscribers = [];
    subscribersSnapshot.forEach((doc) => {
      const subscriber = doc.data();
      if (subscriber.email) {
        subscribers.push(subscriber.email);
      }
    });

    // Create email content
    const subject = `Tomorrow's Events - Hours of Mercy Church`;

    const eventsHtml = events
      .map((event) => {
        const eventDate = new Date(event.date?.toDate());
        const timeString = eventDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return `
        <div style="background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #1976d2;">
          <h3 style="color: #1976d2; margin: 0 0 10px 0;">${event.title}</h3>
          <p style="margin: 5px 0;"><strong>📅 Time:</strong> ${timeString}</p>
          <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${
            event.location || "Church Sanctuary"
          }</p>
          ${
            event.description
              ? `<p style="margin: 10px 0 0 0; color: #666;">${event.description}</p>`
              : ""
          }
        </div>
      `;
      })
      .join("");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #1976d2; margin: 0;">Hours of Mercy Church</h1>
          <h2 style="color: #666; margin: 10px 0 0 0;">Tomorrow's Events</h2>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center;">
          <p style="margin: 0; font-size: 18px; color: #1976d2;">
            📅 ${tomorrow.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        ${eventsHtml}

        <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center;">
          <p style="margin: 0; color: #666;">
            📍 Christ Apostolic Church Hours of Mercy<br>
            1480 Lincoln Ave, Dolton, Illinois, USA
          </p>
          <p style="margin: 15px 0 0 0; font-size: 14px; color: #999;">
            You're receiving this because you subscribed to our newsletter.
            <a href="mailto:${
              process.env.CHURCH_EMAIL || "contact@hoursofmercy.org"
            }" style="color: #1976d2;">
              Contact us
            </a> to unsubscribe.
          </p>
        </div>
      </div>
    `;

    // Send emails in batches to avoid rate limits
    const batchSize = 50;
    const batches = [];

    for (let i = 0; i < subscribers.length; i += batchSize) {
      batches.push(subscribers.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      const emailPromises = batch.map((email) => {
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

      // Small delay between batches
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Log the reminder activity
    await admin
      .firestore()
      .collection("system-logs")
      .add({
        type: "event-reminders",
        eventsCount: events.length,
        subscribersCount: subscribers.length,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        events: events.map((e) => ({ id: e.id, title: e.title, date: e.date })),
      });

    logger.info(
      `Event reminder emails sent successfully to ${subscribers.length} subscribers for ${events.length} events`
    );
  } catch (error) {
    logger.error("Error sending event reminder emails:", error);
  }
});
