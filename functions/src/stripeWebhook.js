const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");

/**
 * Handles Stripe webhook events for donation processing
 * Processes successful payments and updates donation records
 */
module.exports = onRequest(async (req, res) => {
  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const sig = req.get("stripe-signature");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      logger.error("Stripe webhook secret not configured");
      res.status(500).json({ error: "Webhook secret not configured" });
      return;
    }

    // In a real implementation, you would verify the webhook signature here
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    // For now, we'll work with the raw event data
    const event = req.body;

    logger.info(`Received Stripe webhook: ${event.type}`);

    switch (event.type) {
      case "payment_intent.succeeded":
        await handleSuccessfulPayment(event.data.object);
        break;

      case "payment_intent.payment_failed":
        await handleFailedPayment(event.data.object);
        break;

      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionCanceled(event.data.object);
        break;

      default:
        logger.info(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error("Error processing Stripe webhook:", error);
    res.status(400).json({ error: "Webhook processing failed" });
  }
});

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(paymentIntent) {
  try {
    const { id, amount, currency, metadata } = paymentIntent;

    // Create donation record
    const donationData = {
      stripePaymentId: id,
      amount: amount / 100, // Convert from cents
      currency: currency.toUpperCase(),
      status: "completed",
      donorEmail: metadata.donor_email || null,
      donorName: metadata.donor_name || null,
      donorPhone: metadata.donor_phone || null,
      isAnonymous: metadata.is_anonymous === "true",
      donationType: metadata.donation_type || "general",
      dedicatedTo: metadata.dedicated_to || null,
      message: metadata.message || null,
      isRecurring: metadata.is_recurring === "true",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const donationRef = await admin
      .firestore()
      .collection("donations")
      .add(donationData);

    logger.info(`Donation record created: ${donationRef.id}`, {
      amount: donationData.amount,
      currency: donationData.currency,
      donorEmail: donationData.donorEmail,
    });

    // Send thank you email if donor provided email
    if (donationData.donorEmail && !donationData.isAnonymous) {
      await sendDonationThankYou(donationData, donationRef.id);
    }

    // Notify church staff of large donations
    if (donationData.amount >= 500) {
      await notifyStaffOfLargeDonation(donationData, donationRef.id);
    }

    // Update donation statistics
    await updateDonationStats(donationData);
  } catch (error) {
    logger.error("Error handling successful payment:", error);
  }
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(paymentIntent) {
  try {
    const { id, amount, currency, metadata, last_payment_error } =
      paymentIntent;

    // Create failed donation record for tracking
    await admin
      .firestore()
      .collection("failed-donations")
      .add({
        stripePaymentId: id,
        amount: amount / 100,
        currency: currency.toUpperCase(),
        donorEmail: metadata.donor_email || null,
        donorName: metadata.donor_name || null,
        failureReason: last_payment_error?.message || "Unknown error",
        failureCode: last_payment_error?.code || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    logger.info(`Failed donation recorded: ${id}`, {
      amount: amount / 100,
      reason: last_payment_error?.message,
    });
  } catch (error) {
    logger.error("Error handling failed payment:", error);
  }
}

/**
 * Handle recurring subscription creation
 */
async function handleSubscriptionCreated(subscription) {
  try {
    const { id, customer, items, metadata } = subscription;

    await admin
      .firestore()
      .collection("recurring-donations")
      .add({
        stripeSubscriptionId: id,
        stripeCustomerId: customer,
        amount: items.data[0]?.price?.unit_amount / 100 || 0,
        currency: items.data[0]?.price?.currency?.toUpperCase() || "USD",
        interval: items.data[0]?.price?.recurring?.interval || "month",
        status: "active",
        donorEmail: metadata.donor_email || null,
        donorName: metadata.donor_name || null,
        donationType: metadata.donation_type || "general",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    logger.info(`Recurring donation created: ${id}`);
  } catch (error) {
    logger.error("Error handling subscription creation:", error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCanceled(subscription) {
  try {
    const { id } = subscription;

    // Update the recurring donation status
    const recurringDonationsRef = admin
      .firestore()
      .collection("recurring-donations");
    const snapshot = await recurringDonationsRef
      .where("stripeSubscriptionId", "==", id)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.update({
        status: "canceled",
        canceledAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    logger.info(`Recurring donation canceled: ${id}`);
  } catch (error) {
    logger.error("Error handling subscription cancellation:", error);
  }
}

/**
 * Send thank you email to donor
 */
async function sendDonationThankYou(donationData, donationId) {
  try {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.CHURCH_EMAIL || "your-church-email@gmail.com",
        pass: process.env.CHURCH_EMAIL_PASSWORD || "your-app-password",
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="text-align: center; padding: 30px; background: white; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #1976d2; margin: 0;">Thank You for Your Generous Gift! 🙏</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Hours of Mercy Church</p>
        </div>

        <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; font-size: 16px; line-height: 1.6;">
            Dear ${donationData.donorName || "Friend"},<br><br>
            Thank you for your generous donation of $${donationData.amount.toFixed(
              2
            )}! 
            Your gift makes a real difference in our ministry and helps us continue serving our community.
          </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">Donation Details</h3>
          <p><strong>Amount:</strong> $${donationData.amount.toFixed(2)} ${
      donationData.currency
    }</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Transaction ID:</strong> ${donationId}</p>
          ${
            donationData.donationType !== "general"
              ? `<p><strong>Purpose:</strong> ${donationData.donationType}</p>`
              : ""
          }
          ${
            donationData.dedicatedTo
              ? `<p><strong>Dedicated To:</strong> ${donationData.dedicatedTo}</p>`
              : ""
          }
          ${
            donationData.isRecurring
              ? "<p><strong>Type:</strong> Recurring Monthly Donation</p>"
              : ""
          }
        </div>

        ${
          donationData.message
            ? `
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin: 0 0 15px 0;">Your Message</h3>
            <p style="font-style: italic; margin: 0;">"${donationData.message}"</p>
          </div>
        `
            : ""
        }

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1976d2; margin: 0 0 15px 0;">How Your Gift Helps</h3>
          <p style="margin: 0; line-height: 1.6;">
            Your donation supports our ministry in many ways:<br>
            • Community outreach and assistance programs<br>
            • Youth and children's ministries<br>
            • Worship and facility maintenance<br>
            • Educational programs and Bible studies<br>
            • Missions and evangelism efforts
          </p>
        </div>

        <div style="text-align: center; padding: 20px; background: white; border-radius: 8px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This serves as your donation receipt. Please keep it for your tax records.<br>
            Hours of Mercy Church is a registered 501(c)(3) organization.
          </p>
        </div>

        <div style="text-align: center; padding: 20px;">
          <p style="margin: 0; color: #1976d2; font-style: italic;">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Hours of Mercy Church" <${
        process.env.CHURCH_EMAIL || "noreply@hoursofmercy.org"
      }>`,
      to: donationData.donorEmail,
      subject: "Thank you for your generous donation! 🙏",
      html: htmlContent,
    });

    logger.info(`Thank you email sent to: ${donationData.donorEmail}`);
  } catch (error) {
    logger.error("Error sending donation thank you email:", error);
  }
}

/**
 * Notify staff of large donations
 */
async function notifyStaffOfLargeDonation(donationData, donationId) {
  try {
    // Get pastoral staff emails
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

    if (staffEmails.length === 0) return;

    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.CHURCH_EMAIL || "your-church-email@gmail.com",
        pass: process.env.CHURCH_EMAIL_PASSWORD || "your-app-password",
      },
    });

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1976d2;">🎉 Large Donation Received!</h2>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
          <p><strong>Amount:</strong> $${donationData.amount.toFixed(2)} ${
      donationData.currency
    }</p>
          <p><strong>Donor:</strong> ${
            donationData.isAnonymous
              ? "Anonymous"
              : donationData.donorName || "Not provided"
          }</p>
          <p><strong>Email:</strong> ${
            donationData.isAnonymous
              ? "Hidden"
              : donationData.donorEmail || "Not provided"
          }</p>
          <p><strong>Type:</strong> ${donationData.donationType}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Donation ID:</strong> ${donationId}</p>
          ${
            donationData.message
              ? `<p><strong>Message:</strong> "${donationData.message}"</p>`
              : ""
          }
        </div>
      </div>
    `;

    const emailPromises = staffEmails.map((email) => {
      return transporter.sendMail({
        from: `"Hours of Mercy Church" <${
          process.env.CHURCH_EMAIL || "noreply@hoursofmercy.org"
        }>`,
        to: email,
        subject: `🎉 Large Donation Received: $${donationData.amount.toFixed(
          2
        )}`,
        html: htmlContent,
      });
    });

    await Promise.all(emailPromises);
  } catch (error) {
    logger.error("Error notifying staff of large donation:", error);
  }
}

/**
 * Update donation statistics
 */
async function updateDonationStats(donationData) {
  try {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const statsDocId = `${year}-${month.toString().padStart(2, "0")}`;

    const statsRef = admin
      .firestore()
      .collection("donation-stats")
      .doc(statsDocId);

    await statsRef.set(
      {
        year,
        month,
        totalAmount: admin.firestore.FieldValue.increment(donationData.amount),
        totalCount: admin.firestore.FieldValue.increment(1),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    logger.error("Error updating donation stats:", error);
  }
}
