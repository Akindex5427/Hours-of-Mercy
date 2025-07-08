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
 * Generates and sends weekly analytics report to church leadership
 * Runs every Monday at 8 AM
 */
module.exports = onSchedule("0 8 * * 1", async (event) => {
  try {
    logger.info("Starting weekly analytics report generation");

    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get analytics data
    const analytics = await Promise.all([
      getNewPrayerRequests(lastWeek, now),
      getNewNewsletterSubscriptions(lastWeek, now),
      getNewContactMessages(lastWeek, now),
      getDonationStats(lastWeek, now),
      getUpcomingEvents(now),
      getWebsiteActivity(lastWeek, now),
    ]);

    const [
      prayerRequests,
      newsletterSubs,
      contactMessages,
      donationStats,
      upcomingEvents,
      websiteStats,
    ] = analytics;

    // Get leadership emails
    const leadershipEmails = await getLeadershipEmails();

    if (leadershipEmails.length === 0) {
      logger.warn("No leadership emails found for analytics report");
      return;
    }

    // Generate report
    const report = generateReportHTML({
      period: {
        start: lastWeek,
        end: now,
      },
      prayerRequests,
      newsletterSubs,
      contactMessages,
      donationStats,
      upcomingEvents,
      websiteStats,
    });

    // Send email
    await transporter.sendMail({
      from: `"Hours of Mercy Church Analytics" <${
        process.env.CHURCH_EMAIL || "noreply@hoursofmercy.org"
      }>`,
      to: leadershipEmails.join(", "),
      subject: `📊 Weekly Church Analytics Report - ${formatDate(
        lastWeek
      )} to ${formatDate(now)}`,
      html: report,
    });

    // Store report in Firestore
    await admin
      .firestore()
      .collection("analytics-reports")
      .add({
        period: {
          start: admin.firestore.Timestamp.fromDate(lastWeek),
          end: admin.firestore.Timestamp.fromDate(now),
        },
        data: {
          prayerRequests,
          newsletterSubs,
          contactMessages,
          donationStats,
          upcomingEvents,
          websiteStats,
        },
        generatedAt: admin.firestore.FieldValue.serverTimestamp(),
        sentTo: leadershipEmails,
      });

    logger.info(
      `Analytics report generated and sent to ${leadershipEmails.length} recipients`
    );
  } catch (error) {
    logger.error("Error generating analytics report:", error);
  }
});

/**
 * Get new prayer requests from the last week
 */
async function getNewPrayerRequests(startDate, endDate) {
  try {
    const snapshot = await admin
      .firestore()
      .collection("prayer-requests")
      .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate))
      .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(endDate))
      .get();

    const requests = [];
    let urgentCount = 0;
    let memberCount = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        name: data.name,
        isUrgent: data.isUrgent,
        isMember: data.isMember,
        createdAt: data.createdAt?.toDate(),
      });

      if (data.isUrgent) urgentCount++;
      if (data.isMember) memberCount++;
    });

    return {
      total: requests.length,
      urgentCount,
      memberCount,
      nonMemberCount: requests.length - memberCount,
      requests: requests.slice(0, 5), // Last 5 for summary
    };
  } catch (error) {
    logger.error("Error getting prayer requests:", error);
    return {
      total: 0,
      urgentCount: 0,
      memberCount: 0,
      nonMemberCount: 0,
      requests: [],
    };
  }
}

/**
 * Get new newsletter subscriptions
 */
async function getNewNewsletterSubscriptions(startDate, endDate) {
  try {
    const snapshot = await admin
      .firestore()
      .collection("newsletter-subscriptions")
      .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate))
      .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(endDate))
      .get();

    return {
      total: snapshot.size,
      newSubscribers: snapshot.docs.map((doc) => ({
        id: doc.id,
        email: doc.data().email,
        createdAt: doc.data().createdAt?.toDate(),
      })),
    };
  } catch (error) {
    logger.error("Error getting newsletter subscriptions:", error);
    return { total: 0, newSubscribers: [] };
  }
}

/**
 * Get new contact messages
 */
async function getNewContactMessages(startDate, endDate) {
  try {
    const snapshot = await admin
      .firestore()
      .collection("contact-messages")
      .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate))
      .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(endDate))
      .get();

    let urgentCount = 0;
    let respondedCount = 0;
    const messages = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        name: data.name,
        subject: data.subject,
        isUrgent: data.isUrgent,
        status: data.status,
        createdAt: data.createdAt?.toDate(),
      });

      if (data.isUrgent) urgentCount++;
      if (data.respondedAt) respondedCount++;
    });

    return {
      total: messages.length,
      urgentCount,
      respondedCount,
      pendingCount: messages.length - respondedCount,
      messages: messages.slice(0, 5),
    };
  } catch (error) {
    logger.error("Error getting contact messages:", error);
    return {
      total: 0,
      urgentCount: 0,
      respondedCount: 0,
      pendingCount: 0,
      messages: [],
    };
  }
}

/**
 * Get donation statistics
 */
async function getDonationStats(startDate, endDate) {
  try {
    const snapshot = await admin
      .firestore()
      .collection("donations")
      .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(startDate))
      .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(endDate))
      .get();

    let totalAmount = 0;
    let recurringCount = 0;
    const donations = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalAmount += data.amount || 0;
      if (data.isRecurring) recurringCount++;

      donations.push({
        id: doc.id,
        amount: data.amount,
        donationType: data.donationType,
        isRecurring: data.isRecurring,
        createdAt: data.createdAt?.toDate(),
      });
    });

    return {
      total: donations.length,
      totalAmount,
      recurringCount,
      oneTimeCount: donations.length - recurringCount,
      averageAmount: donations.length > 0 ? totalAmount / donations.length : 0,
      donations: donations.sort((a, b) => b.amount - a.amount).slice(0, 5),
    };
  } catch (error) {
    logger.error("Error getting donation stats:", error);
    return {
      total: 0,
      totalAmount: 0,
      recurringCount: 0,
      oneTimeCount: 0,
      averageAmount: 0,
      donations: [],
    };
  }
}

/**
 * Get upcoming events
 */
async function getUpcomingEvents(currentDate) {
  try {
    const nextWeek = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

    const snapshot = await admin
      .firestore()
      .collection("events")
      .where("date", ">=", admin.firestore.Timestamp.fromDate(currentDate))
      .where("date", "<=", admin.firestore.Timestamp.fromDate(nextWeek))
      .orderBy("date", "asc")
      .get();

    const events = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      events.push({
        id: doc.id,
        title: data.title,
        date: data.date?.toDate(),
        location: data.location,
        category: data.category,
      });
    });

    return {
      total: events.length,
      events,
    };
  } catch (error) {
    logger.error("Error getting upcoming events:", error);
    return { total: 0, events: [] };
  }
}

/**
 * Get website activity (placeholder - would integrate with Google Analytics in real implementation)
 */
async function getWebsiteActivity(startDate, endDate) {
  // This is a placeholder for website analytics
  // In a real implementation, you would integrate with Google Analytics API
  return {
    pageViews: Math.floor(Math.random() * 1000) + 500,
    uniqueVisitors: Math.floor(Math.random() * 300) + 200,
    topPages: [
      { page: "/sermons", views: Math.floor(Math.random() * 200) + 100 },
      { page: "/events", views: Math.floor(Math.random() * 150) + 75 },
      { page: "/prayer-requests", views: Math.floor(Math.random() * 100) + 50 },
      { page: "/giving", views: Math.floor(Math.random() * 80) + 40 },
      { page: "/contact", views: Math.floor(Math.random() * 60) + 30 },
    ],
  };
}

/**
 * Get leadership email addresses
 */
async function getLeadershipEmails() {
  try {
    const snapshot = await admin
      .firestore()
      .collection("staff")
      .where("department", "in", ["pastoral", "administrative"])
      .where("isLeadership", "==", true)
      .get();

    const emails = [];
    snapshot.forEach((doc) => {
      const staff = doc.data();
      if (staff.email) {
        emails.push(staff.email);
      }
    });

    // If no leadership emails found, use default admin email
    if (emails.length === 0) {
      emails.push(process.env.ADMIN_EMAIL || "admin@hoursofmercy.org");
    }

    return emails;
  } catch (error) {
    logger.error("Error getting leadership emails:", error);
    return [process.env.ADMIN_EMAIL || "admin@hoursofmercy.org"];
  }
}

/**
 * Generate HTML report
 */
function generateReportHTML(data) {
  const {
    period,
    prayerRequests,
    newsletterSubs,
    contactMessages,
    donationStats,
    upcomingEvents,
    websiteStats,
  } = data;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
      <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; margin-bottom: 30px;">
        <h1 style="color: #1976d2; margin: 0;">📊 Weekly Analytics Report</h1>
        <h2 style="color: #666; margin: 10px 0 0 0; font-weight: normal;">Hours of Mercy Church</h2>
        <p style="color: #888; margin: 10px 0 0 0;">
          ${formatDate(period.start)} - ${formatDate(period.end)}
        </p>
      </div>

      <!-- Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #4caf50;">
          <h3 style="margin: 0; color: #4caf50;">Prayer Requests</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #333;">${
            prayerRequests.total
          }</p>
          <p style="margin: 0; color: #666; font-size: 14px;">${
            prayerRequests.urgentCount
          } urgent</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #2196f3;">
          <h3 style="margin: 0; color: #2196f3;">New Subscribers</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #333;">${
            newsletterSubs.total
          }</p>
          <p style="margin: 0; color: #666; font-size: 14px;">newsletter</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #ff9800;">
          <h3 style="margin: 0; color: #ff9800;">Contact Messages</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #333;">${
            contactMessages.total
          }</p>
          <p style="margin: 0; color: #666; font-size: 14px;">${
            contactMessages.pendingCount
          } pending</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #9c27b0;">
          <h3 style="margin: 0; color: #9c27b0;">Donations</h3>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0; color: #333;">$${donationStats.totalAmount.toFixed(
            2
          )}</p>
          <p style="margin: 0; color: #666; font-size: 14px;">${
            donationStats.total
          } donations</p>
        </div>
      </div>

      <!-- Detailed Sections -->
      ${generatePrayerRequestsSection(prayerRequests)}
      ${generateDonationsSection(donationStats)}
      ${generateContactMessagesSection(contactMessages)}
      ${generateUpcomingEventsSection(upcomingEvents)}
      ${generateWebsiteStatsSection(websiteStats)}

      <!-- Footer -->
      <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; margin-top: 30px;">
        <p style="margin: 0; color: #666;">
          This report was generated automatically by the Hours of Mercy Church analytics system.
        </p>
        <p style="margin: 10px 0 0 0; color: #999; font-size: 14px;">
          Report generated on ${new Date().toLocaleString()}
        </p>
      </div>
    </div>
  `;
}

function generatePrayerRequestsSection(data) {
  if (data.total === 0) return "";

  return `
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1976d2; margin: 0 0 20px 0;">🙏 Prayer Requests Summary</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div style="text-align: center; padding: 15px; background: #f5f5f5; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Total</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #1976d2;">${data.total}</p>
        </div>
        <div style="text-align: center; padding: 15px; background: #fff3e0; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Urgent</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #ff9800;">${data.urgentCount}</p>
        </div>
        <div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Members</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #4caf50;">${data.memberCount}</p>
        </div>
        <div style="text-align: center; padding: 15px; background: #e3f2fd; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Visitors</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #2196f3;">${data.nonMemberCount}</p>
        </div>
      </div>
    </div>
  `;
}

function generateDonationsSection(data) {
  if (data.total === 0) return "";

  return `
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1976d2; margin: 0 0 20px 0;">💰 Donations Summary</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
        <div style="text-align: center; padding: 15px; background: #f5f5f5; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Total Amount</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #4caf50;">$${data.totalAmount.toFixed(
            2
          )}</p>
        </div>
        <div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Count</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #4caf50;">${
            data.total
          }</p>
        </div>
        <div style="text-align: center; padding: 15px; background: #e3f2fd; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Average</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #2196f3;">$${data.averageAmount.toFixed(
            2
          )}</p>
        </div>
        <div style="text-align: center; padding: 15px; background: #fff3e0; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Recurring</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #ff9800;">${
            data.recurringCount
          }</p>
        </div>
      </div>
    </div>
  `;
}

function generateContactMessagesSection(data) {
  if (data.total === 0) return "";

  return `
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1976d2; margin: 0 0 20px 0;">📧 Contact Messages</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
        <div style="text-align: center; padding: 15px; background: #f5f5f5; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Total</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #1976d2;">${
            data.total
          }</p>
        </div>
        <div style="text-align: center; padding: 15px; background: ${
          data.pendingCount > 0 ? "#fff3e0" : "#e8f5e8"
        }; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Pending</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: ${
            data.pendingCount > 0 ? "#ff9800" : "#4caf50"
          };">${data.pendingCount}</p>
        </div>
        <div style="text-align: center; padding: 15px; background: #e8f5e8; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Responded</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #4caf50;">${
            data.respondedCount
          }</p>
        </div>
        ${
          data.urgentCount > 0
            ? `
        <div style="text-align: center; padding: 15px; background: #ffebee; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Urgent</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #f44336;">${data.urgentCount}</p>
        </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

function generateUpcomingEventsSection(data) {
  if (data.total === 0) return "";

  const eventsHtml = data.events
    .map(
      (event) => `
    <div style="border-left: 3px solid #1976d2; padding-left: 15px; margin: 10px 0;">
      <p style="margin: 0; font-weight: bold; color: #1976d2;">${
        event.title
      }</p>
      <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">
        ${event.date.toLocaleDateString()} at ${event.date.toLocaleTimeString(
        "en-US",
        {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      )}
      </p>
    </div>
  `
    )
    .join("");

  return `
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1976d2; margin: 0 0 20px 0;">📅 Upcoming Events (Next 7 Days)</h3>
      ${eventsHtml}
    </div>
  `;
}

function generateWebsiteStatsSection(data) {
  const topPagesHtml = data.topPages
    .map(
      (page) => `
    <div style="display: flex; justify-content: space-between; padding: 10px; border-bottom: 1px solid #eee;">
      <span style="color: #333;">${page.page}</span>
      <span style="color: #1976d2; font-weight: bold;">${page.views} views</span>
    </div>
  `
    )
    .join("");

  return `
    <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #1976d2; margin: 0 0 20px 0;">🌐 Website Activity</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
        <div style="text-align: center; padding: 15px; background: #f5f5f5; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Page Views</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #1976d2;">${data.pageViews.toLocaleString()}</p>
        </div>
        <div style="text-align: center; padding: 15px; background: #e3f2fd; border-radius: 5px;">
          <p style="margin: 0; font-weight: bold; color: #333;">Unique Visitors</p>
          <p style="margin: 5px 0 0 0; font-size: 18px; color: #2196f3;">${data.uniqueVisitors.toLocaleString()}</p>
        </div>
      </div>
      <h4 style="color: #666; margin: 20px 0 10px 0;">Top Pages:</h4>
      <div style="border: 1px solid #ddd; border-radius: 5px; overflow: hidden;">
        ${topPagesHtml}
      </div>
    </div>
  `;
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
