# Firebase Cloud Functions Setup and Deployment Guide

## Overview

This guide will help you deploy and configure Firebase Cloud Functions for the Hours of Mercy Church website.

## Prerequisites

- Firebase CLI installed globally (`npm install -g firebase-tools`)
- Firebase project set up and configured
- Environment variables configured

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the functions directory with these variables:

```bash
# Email Configuration (Gmail with App Password recommended)
CHURCH_EMAIL=your-church-email@gmail.com
CHURCH_EMAIL_PASSWORD=your-app-password

# Notification Recipients
DEFAULT_NOTIFICATION_EMAIL=pastor@hoursofmercy.org
ADMIN_EMAIL=admin@hoursofmercy.org

# Stripe Configuration (for donation processing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### Setting Environment Variables in Firebase

```bash
# Set individual environment variables
firebase functions:config:set email.address="your-church-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:set stripe.secret_key="sk_test_your_stripe_secret_key"
firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret"
firebase functions:config:set notifications.default_email="pastor@hoursofmercy.org"
firebase functions:config:set notifications.admin_email="admin@hoursofmercy.org"

# View current configuration
firebase functions:config:get
```

## Deployment Steps

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Set Up Firebase CLI Authentication

```bash
firebase login
firebase use --add
# Select your project: the-project-f1728
```

### 3. Deploy Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Deploy specific function
firebase deploy --only functions:sendPrayerRequestNotification

# Deploy with specific project
firebase deploy --only functions --project the-project-f1728
```

### 4. Test Functions

```bash
# Start local emulator for testing
firebase emulators:start --only functions

# Test in local environment
npm run serve
```

## Function Descriptions

### 1. Prayer Request Notifications (`sendPrayerRequestNotification`)

- **Trigger**: Document created in `prayer-requests` collection
- **Purpose**: Sends email notifications to pastoral staff
- **Configuration**: Requires email settings

### 2. Event Reminders (`sendEventReminders`)

- **Trigger**: Scheduled (daily at 9 AM)
- **Purpose**: Sends event reminders to newsletter subscribers
- **Schedule**: `0 9 * * *` (daily at 9:00 AM)

### 3. Newsletter Welcome (`sendNewsletterWelcome`)

- **Trigger**: Document created in `newsletter-subscriptions` collection
- **Purpose**: Sends welcome email to new subscribers
- **Features**: Includes upcoming events and latest sermon

### 4. Contact Form Processing (`sendContactFormNotification`)

- **Trigger**: Callable function
- **Purpose**: Handles contact form submissions
- **Features**: Stores in Firestore and sends notifications

### 5. Stripe Webhook (`processStripeWebhook`)

- **Trigger**: HTTP request from Stripe
- **Purpose**: Processes donation payments
- **Features**: Thank you emails, donation tracking

### 6. Analytics Report (`generateAnalyticsReport`)

- **Trigger**: Scheduled (weekly on Mondays at 8 AM)
- **Purpose**: Generates weekly reports for leadership
- **Schedule**: `0 8 * * 1` (Mondays at 8:00 AM)

## Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication

1. Go to your Google Account settings
2. Select "Security" from the left panel
3. Enable "2-Step Verification"

### Step 2: Generate App Password

1. Go to "App passwords" in Security settings
2. Select "Mail" as the app
3. Select "Other" for device and enter "Church Website"
4. Copy the generated 16-character password

### Step 3: Configure Environment

Use the generated app password (not your regular Gmail password) in the `CHURCH_EMAIL_PASSWORD` environment variable.

## Monitoring and Logs

### View Function Logs

```bash
# View all function logs
firebase functions:log

# View logs for specific function
firebase functions:log --only sendPrayerRequestNotification

# Follow logs in real-time
firebase functions:log --follow
```

### Firebase Console

Monitor functions in the Firebase Console:

- Go to https://console.firebase.google.com/project/the-project-f1728
- Navigate to "Functions" section
- View logs, metrics, and configuration

## Troubleshooting

### Common Issues

#### 1. Permission Errors

```bash
Error: Permission denied
```

**Solution**: Ensure you're logged in with the correct account

```bash
firebase login
firebase use the-project-f1728
```

#### 2. Email Sending Failures

```bash
Error: Invalid login
```

**Solutions**:

- Verify Gmail App Password is correct
- Check that 2-Factor Authentication is enabled
- Ensure email environment variables are set

#### 3. Firestore Permission Errors

```bash
Error: Missing or insufficient permissions
```

**Solutions**:

- Check Firestore security rules
- Ensure functions have proper IAM roles
- Verify service account permissions

#### 4. Deployment Timeouts

```bash
Error: Functions deploy timeout
```

**Solutions**:

- Deploy functions individually
- Check internet connection
- Retry deployment

### Debug Mode

Enable debug logging for functions:

```bash
# Set debug environment
firebase functions:config:set debug.enabled=true
firebase deploy --only functions

# View debug logs
firebase functions:log --only yourFunctionName
```

## Security Considerations

### Firestore Security Rules

Update your `firestore.rules` to allow functions to read/write:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow functions to read/write all documents
    match /{document=**} {
      allow read, write: if request.auth != null ||
        request.auth.token.firebase.sign_in_provider == 'custom';
    }
  }
}
```

### Environment Variables

Never commit environment variables to version control:

- Use Firebase Functions config
- Set sensitive data through CLI
- Use different values for development/production

## Performance Optimization

### Cold Start Reduction

- Use Firebase Functions v2 for better performance
- Implement connection pooling for external services
- Minimize function dependencies

### Cost Management

- Monitor function invocations in Firebase Console
- Set up billing alerts
- Optimize function runtime and memory usage

## Integration with React App

### Using Callable Functions

```javascript
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase/config";

const sendContactForm = httpsCallable(functions, "sendContactFormNotification");

try {
  const result = await sendContactForm({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello from the website!",
  });
  console.log(result.data);
} catch (error) {
  console.error("Error:", error);
}
```

### Testing Functions Locally

Use the Cloud Functions Test component in the admin dashboard to test functions directly from your React app.

## Support and Maintenance

### Regular Tasks

1. Monitor function logs weekly
2. Check email delivery reports
3. Update environment variables as needed
4. Review and optimize function performance

### Updates and Upgrades

1. Keep Firebase SDK updated
2. Monitor Node.js version compatibility
3. Review Firebase pricing changes
4. Update security rules as needed

For questions or issues, refer to:

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Console](https://console.firebase.google.com/project/the-project-f1728)
- Contact the development team
