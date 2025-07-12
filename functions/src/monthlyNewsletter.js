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
 * Sends monthly newsletter to all subscribers
 * Runs on the first day of each month at 10 AM
 * Schedule format: "minute hour day-of-month month day-of-week"
 * 0 10 1 * * = First day of every month at 10:00 AM
 */
module.exports = onSchedule("0 10 1 * *", async (event) => {
  try {
    logger.info("Starting monthly newsletter job");

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

    // Get content for monthly newsletter
    const content = await generateMonthlyContent();

    // Send emails to all subscribers
    const emailPromises = [];
    subscribersSnapshot.forEach((doc) => {
      const subscriber = doc.data();
      emailPromises.push(sendMonthlyNewsletterEmail(subscriber, content));
    });

    await Promise.all(emailPromises);
    logger.info(
      `Monthly newsletter sent to ${emailPromises.length} subscribers`
    );

    // Log the newsletter send
    await admin
      .firestore()
      .collection("newsletterLogs")
      .add({
        type: "monthly_newsletter",
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        subscriberCount: emailPromises.length,
        content: {
          subject: content.subject,
          eventCount: content.events.length,
          sermonCount: content.sermons.length,
          memberCount: content.memberStats.total,
        },
      });
  } catch (error) {
    logger.error("Error sending monthly newsletter:", error);
  }
});

/**
 * Generate monthly newsletter content
 */
async function generateMonthlyContent() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Get month name
  const monthName = now.toLocaleDateString("en-US", { month: "long" });

  // Get first day of current month
  const monthStart = new Date(currentYear, currentMonth, 1);

  // Get last day of current month
  const monthEnd = new Date(currentYear, currentMonth + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);

  // Get next month's events
  const nextMonthStart = new Date(currentYear, currentMonth + 1, 1);
  const nextMonthEnd = new Date(currentYear, currentMonth + 2, 0);
  nextMonthEnd.setHours(23, 59, 59, 999);

  // Get events for next month
  const eventsSnapshot = await admin
    .firestore()
    .collection("events")
    .where("date", ">=", admin.firestore.Timestamp.fromDate(nextMonthStart))
    .where("date", "<=", admin.firestore.Timestamp.fromDate(nextMonthEnd))
    .orderBy("date", "asc")
    .get();

  const events = [];
  eventsSnapshot.forEach((doc) => {
    events.push(doc.data());
  });

  // Get sermons from the past month
  const sermonsSnapshot = await admin
    .firestore()
    .collection("sermons")
    .where("date", ">=", admin.firestore.Timestamp.fromDate(monthStart))
    .where("date", "<=", admin.firestore.Timestamp.fromDate(monthEnd))
    .orderBy("date", "desc")
    .get();

  const sermons = [];
  sermonsSnapshot.forEach((doc) => {
    sermons.push(doc.data());
  });

  // Get member statistics
  const memberStats = await getMemberStatistics();

  // Get prayer requests count (for ministry highlight)
  const prayerRequestsSnapshot = await admin
    .firestore()
    .collection("prayerRequests")
    .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(monthStart))
    .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(monthEnd))
    .get();

  return {
    subject: `${monthName} ${currentYear} - Hours of Mercy Monthly Update`,
    events,
    sermons,
    memberStats,
    prayerRequestsCount: prayerRequestsSnapshot.size,
    monthName,
    year: currentYear,
  };
}

/**
 * Get member statistics for the monthly report
 */
async function getMemberStatistics() {
  try {
    const membersSnapshot = await admin.firestore().collection("members").get();

    const totalMembers = membersSnapshot.size;

    // Get new members this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const newMembersSnapshot = await admin
      .firestore()
      .collection("members")
      .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(monthStart))
      .get();

    return {
      total: totalMembers,
      newThisMonth: newMembersSnapshot.size,
    };
  } catch (error) {
    logger.error("Error getting member statistics:", error);
    return { total: 0, newThisMonth: 0 };
  }
}

/**
 * Send monthly newsletter email to individual subscriber
 */
async function sendMonthlyNewsletterEmail(subscriber, content) {
  const {
    subject,
    events,
    sermons,
    memberStats,
    prayerRequestsCount,
    monthName,
    year,
  } = content;

  // Generate events HTML for next month
  const eventsHtml =
    events.length > 0
      ? `
    <div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <h3 style="color: #1976d2; margin: 0 0 15px 0;">📅 Upcoming Events Next Month</h3>
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
      : '<div style="background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;"><p style="color: #666; margin: 0;">No special events scheduled for next month. Check back for updates!</p></div>';

  // Generate sermons HTML for past month
  const sermonsHtml =
    sermons.length > 0
      ? `
    <div style="background: #fff; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #e0e0e0;">
      <h3 style="color: #1976d2; margin: 0 0 15px 0;">🎤 ${monthName} Sermons</h3>
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

  // Ministry highlights
  const ministryHighlights = `
    <div style="background: #e3f2fd; padding: 20px; margin: 20px 0; border-radius: 8px;">
      <h3 style="color: #1976d2; margin: 0 0 15px 0;">✨ Ministry Highlights</h3>
      <div style="display: flex; flex-wrap: wrap; gap: 20px;">
        <div style="flex: 1; min-width: 200px; text-align: center;">
          <h4 style="margin: 0; color: #1976d2; font-size: 24px;">${memberStats.total}</h4>
          <p style="margin: 5px 0; color: #333;">Total Members</p>
        </div>
        <div style="flex: 1; min-width: 200px; text-align: center;">
          <h4 style="margin: 0; color: #1976d2; font-size: 24px;">${memberStats.newThisMonth}</h4>
          <p style="margin: 5px 0; color: #333;">New Members This Month</p>
        </div>
        <div style="flex: 1; min-width: 200px; text-align: center;">
          <h4 style="margin: 0; color: #1976d2; font-size: 24px;">${prayerRequestsCount}</h4>
          <p style="margin: 5px 0; color: #333;">Prayer Requests This Month</p>
        </div>
      </div>
    </div>
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: #1976d2; color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 26px;">Hours of Mercy</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Monthly Newsletter - ${monthName} ${year}</p>
      </div>

      <!-- Main Content -->
      <div style="padding: 30px;">
        <h2 style="color: #1976d2; margin: 0 0 20px 0;">Greetings in Christ,</h2>
        <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
          As we reflect on God's faithfulness this month, we're excited to share what's 
          happening in our church community and what's coming up next month.
        </p>

        ${ministryHighlights}
        ${eventsHtml}
        ${sermonsHtml}

        <!-- Monthly Message -->
        <div style="background: #fff8e1; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ff9800;">
          <h3 style="color: #e65100; margin: 0 0 15px 0;">💖 Pastor's Monthly Message</h3>
          <p style="color: #333; line-height: 1.6; margin: 0; font-style: italic;">
            "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; 
            they will run and not grow weary, they will walk and not be faint." - Isaiah 40:31
          </p>
          <p style="color: #333; line-height: 1.6; margin: 15px 0 0 0;">
            May this month be filled with renewed strength and hope as we continue to grow together in faith.
          </p>
        </div>

        <!-- Service Times -->
        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">⏰ Regular Service Times</h3>
          <ul style="color: #333; margin: 0; padding-left: 20px;">
            <li>Sunday Worship: 8:00 AM & 11:00 AM</li>
            <li>Wednesday Prayer Meeting: 7:00 PM</li>
            <li>Friday Bible Study: 7:30 PM</li>
          </ul>
        </div>

        <!-- Call to Action -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://your-church-website.com" 
             style="background: #1976d2; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-right: 10px;">
            Visit Our Website
          </a>
          <a href="https://your-church-website.com/giving" 
             style="background: #4caf50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Support Our Ministry
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
          You're receiving this monthly update because you subscribed to our newsletter.
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

  logger.info(`Monthly newsletter sent to: ${subscriber.email}`);
}
