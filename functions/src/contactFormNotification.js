const { onCall } = require("firebase-functions/v2/https");
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
 * Callable function to handle contact form submissions
 * Stores the message in Firestore and sends email notification
 */
module.exports = onCall(async (request) => {
  try {
    const { name, email, phone, subject, message, isUrgent } = request.data;

    // Validate required fields
    if (!name || !email || !message) {
      throw new Error(
        "Missing required fields: name, email, and message are required"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    logger.info("Processing contact form submission", {
      name,
      email,
      subject: subject || "General Inquiry",
      isUrgent: isUrgent || false,
    });

    // Store the contact form submission in Firestore
    const contactDoc = await admin
      .firestore()
      .collection("contact-messages")
      .add({
        name,
        email,
        phone: phone || null,
        subject: subject || "General Inquiry",
        message,
        isUrgent: isUrgent || false,
        status: "new",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        readAt: null,
        respondedAt: null,
      });

    // Get staff emails for notification
    const staffSnapshot = await admin
      .firestore()
      .collection("staff")
      .where("department", "in", ["pastoral", "administrative"])
      .get();

    const staffEmails = [];
    staffSnapshot.forEach((doc) => {
      const staff = doc.data();
      if (staff.email) {
        staffEmails.push(staff.email);
      }
    });

    // If no staff emails found, use default
    if (staffEmails.length === 0) {
      staffEmails.push(
        process.env.DEFAULT_NOTIFICATION_EMAIL || "contact@hoursofmercy.org"
      );
    }

    // Prepare email notification
    const emailSubject = isUrgent
      ? `🚨 URGENT Contact Form - ${subject || "General Inquiry"}`
      : `📧 New Contact Form - ${subject || "General Inquiry"}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2; text-align: center;">
          ${isUrgent ? "🚨 URGENT " : "📧 "}Contact Form Submission
        </h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Contact Information:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Phone:</strong> ${
            phone ? `<a href="tel:${phone}">${phone}</a>` : "Not provided"
          }</p>
          <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
        </div>

        <div style="background: #fff; padding: 20px; border-left: 4px solid #1976d2; margin: 20px 0;">
          <h3>Message:</h3>
          <p style="font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>

        ${
          isUrgent
            ? `
          <div style="background: #fff3e0; padding: 15px; border-left: 4px solid #ff9800; margin: 20px 0;">
            <p style="color: #e65100; font-weight: bold; margin: 0;">⚠️ This message has been marked as URGENT</p>
          </div>
        `
            : ""
        }

        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Message ID:</strong> ${contactDoc.id}</p>
          <p><strong>Quick Reply:</strong> <a href="mailto:${email}?subject=Re: ${encodeURIComponent(
      subject || "Your inquiry"
    )}" style="color: #1976d2;">Reply to ${name}</a></p>
        </div>

        <hr style="margin: 30px 0;">
        <p style="text-align: center; color: #666; font-size: 14px;">
          This notification was sent automatically from the Hours of Mercy website contact form.
        </p>
      </div>
    `;

    // Send email notifications to staff
    const emailPromises = staffEmails.map((staffEmail) => {
      return transporter.sendMail({
        from: `"Hours of Mercy Church" <${
          process.env.CHURCH_EMAIL || "noreply@hoursofmercy.org"
        }>`,
        to: staffEmail,
        replyTo: email, // Allow staff to reply directly to the sender
        subject: emailSubject,
        html: htmlContent,
      });
    });

    await Promise.all(emailPromises);

    // Send confirmation email to the sender
    const confirmationSubject =
      "Thank you for contacting Hours of Mercy Church";
    const confirmationContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #1976d2; margin: 0;">Thank You for Reaching Out!</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Hours of Mercy Church</p>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.6;">
            Dear ${name},<br><br>
            Thank you for contacting us! We have received your message and will respond as soon as possible.
            ${
              isUrgent
                ? " Since you marked this as urgent, we will prioritize your request."
                : ""
            }
          </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">Your Message Summary:</h3>
          <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">In the Meantime</h3>
          <p style="margin: 0; line-height: 1.6;">
            • Feel free to join us for Sunday service at 10:00 AM<br>
            • Check out our latest sermons and events on our website<br>
            • Follow us on social media for daily inspiration<br>
            • Submit prayer requests if you need immediate spiritual support
          </p>
        </div>

        <div style="text-align: center; padding: 20px; background: white; border-radius: 8px;">
          <p style="margin: 0; color: #666;">
            📍 Christ Apostolic Church Hours of Mercy<br>
            1480 Lincoln Ave, Dolton, Illinois, USA<br><br>
            📧 ${process.env.CHURCH_EMAIL || "contact@hoursofmercy.org"}<br>
            📞 Call us for urgent matters
          </p>
        </div>

        <div style="text-align: center; padding: 20px;">
          <p style="margin: 0; color: #1976d2; font-style: italic;">
            "Come to me, all you who are weary and burdened, and I will give you rest." - Matthew 11:28
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Hours of Mercy Church" <${
        process.env.CHURCH_EMAIL || "noreply@hoursofmercy.org"
      }>`,
      to: email,
      subject: confirmationSubject,
      html: confirmationContent,
    });

    logger.info(
      `Contact form processed successfully. Notifications sent to ${staffEmails.length} staff members`
    );

    return {
      success: true,
      message:
        "Your message has been sent successfully! We'll get back to you soon.",
      messageId: contactDoc.id,
    };
  } catch (error) {
    logger.error("Error processing contact form:", error);
    throw new Error(
      error.message || "Failed to send message. Please try again later."
    );
  }
});
