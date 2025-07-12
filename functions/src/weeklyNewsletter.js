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
 * Sends weekly newsletter to all subscribers
 * Runs every Sunday at 8 AM
 * Schedule format: "minute hour day-of-month month day-of-week"
 * 0 8 * * 0 = Every Sunday at 8:00 AM
 */
module.exports = onSchedule("0 8 * * 0", async (event) => {
  try {
    logger.info("Starting weekly newsletter job");

    // Get all active newsletter subscribers
    const subscribersSnapshot = await admin
      .firestore()
      .collection("newsletterSubscriptions")
      .where("isActive", "==", true)
      .get();

    if (subscribersSnapshot.empty) {
      logger.info("No active subscribers found");
      return;
    }

    // Get content for newsletter
    const content = await generateNewsletterContent();

    // Send emails to all subscribers
    const emailPromises = [];
    subscribersSnapshot.forEach((doc) => {
      const subscriber = doc.data();
      emailPromises.push(sendNewsletterEmail(subscriber, content));
    });

    await Promise.all(emailPromises);
    logger.info(`Newsletter sent to ${emailPromises.length} subscribers`);

    // Log the newsletter send
    await admin
      .firestore()
      .collection("newsletterLogs")
      .add({
        type: "weekly_newsletter",
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        subscriberCount: emailPromises.length,
        content: {
          subject: content.subject,
          eventCount: content.events.length,
          sermonCount: content.sermons.length,
        },
      });
  } catch (error) {
    logger.error("Error sending weekly newsletter:", error);
  }
});

/**
 * Generate newsletter content dynamically
 */
async function generateNewsletterContent() {
  const now = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(now.getDate() + 7);

  // Get upcoming events for the next week
  const eventsSnapshot = await admin
    .firestore()
    .collection("events")
    .where("date", ">=", admin.firestore.Timestamp.fromDate(now))
    .where("date", "<=", admin.firestore.Timestamp.fromDate(nextWeek))
    .orderBy("date", "asc")
    .get();

  const events = [];
  eventsSnapshot.forEach((doc) => {
    events.push(doc.data());
  });

  // Get recent sermons (last 2 weeks)
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(now.getDate() - 14);

  const sermonsSnapshot = await admin
    .firestore()
    .collection("sermons")
    .where("date", ">=", admin.firestore.Timestamp.fromDate(twoWeeksAgo))
    .orderBy("date", "desc")
    .limit(3)
    .get();

  const sermons = [];
  sermonsSnapshot.forEach((doc) => {
    sermons.push(doc.data());
  });

  // Generate subject line with current date
  const dateStr = now.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return {
    subject: `Hours of Mercy Weekly Update - ${dateStr}`,
    events,
    sermons,
    date: dateStr,
  };
}

/**
 * Send newsletter email to individual subscriber
 */
async function sendNewsletterEmail(subscriber, content) {
  const { subject, events, sermons, date } = content;

  // Generate events HTML
  const eventsHtml =
    events.length > 0
      ? `
    <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <h3 style="color: #1976d2; margin: 0 0 15px 0;">📅 This Week's Events</h3>
      ${events
        .map((event) => {
          const eventDate = new Date(event.date?.toDate());
          return `
          <div style="border-left: 3px solid #1976d2; padding-left: 15px; margin: 15px 0;">
            <h4 style="margin: 0; color: #1976d2;">${event.title}</h4>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">
              ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }
          )}
            </p>
            <p style="margin: 5px 0; color: #333;">${
              event.description || ""
            }</p>
          </div>
        `;
        })
        .join("")}
    </div>
  `
      : "";

  // Generate sermons HTML
  const sermonsHtml =
    sermons.length > 0
      ? `
    <div style="background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e0e0e0;">
      <h3 style="color: #1976d2; margin: 0 0 15px 0;">🎤 Recent Sermons</h3>
      ${sermons
        .map((sermon) => {
          const sermonDate = new Date(sermon.date?.toDate());
          return `
          <div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
            <h4 style="margin: 0; color: #1976d2;">${sermon.title}</h4>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">
              ${sermonDate.toLocaleDateString()} - ${sermon.speaker}
            </p>
            <p style="margin: 5px 0; color: #333;">${
              sermon.description || ""
            }</p>
            ${
              sermon.videoUrl
                ? `
              <a href="${sermon.videoUrl}" 
                 style="color: #1976d2; text-decoration: none; font-weight: bold;">
                🎥 Watch Sermon
              </a>
            `
                : ""
            }
          </div>
        `;
        })
        .join("")}
    </div>
  `
      : "";

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: #1976d2; color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Hours of Mercy</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Weekly Newsletter - ${date}</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <h2 style="color: #1976d2; margin: 0 0 20px 0;">Peace and Blessings,</h2>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          We hope this message finds you well and blessed. Here's what's happening 
          at Hours of Mercy this week:
        </p>

        ${eventsHtml}
        ${sermonsHtml}

        <!-- Service Times -->
        <div style="background: #e3f2fd; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">⏰ Service Times</h3>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>Sunday Worship: 8:00 AM & 11:00 AM</li>
            <li>Wednesday Prayer Meeting: 7:00 PM</li>
            <li>Friday Bible Study: 7:30 PM</li>
          </ul>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://your-church-website.com" 
             style="background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Visit Our Website
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #666;">
        <p style="margin: 0 0 10px 0;">
          <strong>Hours of Mercy - Christ Apostolic Church</strong><br>
          14801 Lincoln Ave, Dolton, Illinois 60419<br>
          (708) 555-0123 | hoursofmercyministries@gmail.com
        </p>
        <p style="margin: 10px 0 0 0; font-size: 12px;">
          You're receiving this because you subscribed to our newsletter.
        </p>
      </div>
    </div>
  `;

  // Send email
  await transporter.sendMail({
    from: `"Hours of Mercy Church" <${
      process.env.CHURCH_EMAIL || "noreply@hoursofmercy.org"
    }>`,
    to: subscriber.email,
    subject: subject,
    html: htmlContent,
  });

  logger.info(`Newsletter sent to: ${subscriber.email}`);
}
