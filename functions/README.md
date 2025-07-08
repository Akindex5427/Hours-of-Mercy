# Hours of Mercy Church - Firebase Cloud Functions

This directory contains Firebase Cloud Functions for the Hours of Mercy Church website. These functions provide automated email notifications, payment processing, analytics, and other server-side functionality.

## 📁 Directory Structure

```
functions/
├── src/                          # Individual function modules
│   ├── prayerRequestNotification.js    # Prayer request email notifications
│   ├── eventReminders.js              # Daily event reminder emails
│   ├── newsletterWelcome.js            # Welcome emails for new subscribers
│   ├── contactFormNotification.js      # Contact form processing
│   ├── stripeWebhook.js               # Donation payment processing
│   └── analyticsReport.js             # Weekly analytics reports
├── index.js                     # Main functions entry point
├── package.json                # Dependencies and scripts
├── .eslintrc.json             # ESLint configuration
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd functions
npm install
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
# See CLOUD_FUNCTIONS_DEPLOYMENT.md for detailed setup
```

### 3. Deploy Functions

```bash
# Make sure you're in the project root directory
cd ..

# Deploy all functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:sendPrayerRequestNotification
```

## 🔧 Available Functions

### Trigger-Based Functions

#### 1. **Prayer Request Notifications**

- **File**: `src/prayerRequestNotification.js`
- **Trigger**: New document in `prayer-requests` collection
- **Purpose**: Automatically sends email notifications to pastoral staff when someone submits a prayer request
- **Features**:
  - Urgent request highlighting
  - Member vs. visitor identification
  - Staff notification tracking
  - Rich HTML email templates

#### 2. **Newsletter Welcome Emails**

- **File**: `src/newsletterWelcome.js`
- **Trigger**: New document in `newsletter-subscriptions` collection
- **Purpose**: Sends welcome email to new newsletter subscribers
- **Features**:
  - Includes upcoming events
  - Features latest sermon
  - Church information and service times
  - Social media integration

### Scheduled Functions

#### 3. **Event Reminders**

- **File**: `src/eventReminders.js`
- **Schedule**: Daily at 9:00 AM (`0 9 * * *`)
- **Purpose**: Sends email reminders for events happening tomorrow
- **Features**:
  - Batched email sending to avoid rate limits
  - Event details with time and location
  - Subscriber management
  - Activity logging

#### 4. **Analytics Reports**

- **File**: `src/analyticsReport.js`
- **Schedule**: Weekly on Mondays at 8:00 AM (`0 8 * * 1`)
- **Purpose**: Generates comprehensive weekly reports for church leadership
- **Includes**:
  - Prayer request statistics
  - Newsletter subscription metrics
  - Contact message summaries
  - Donation analytics
  - Website activity (placeholder for Google Analytics)
  - Upcoming events overview

### Callable Functions

#### 5. **Contact Form Processing**

- **File**: `src/contactFormNotification.js`
- **Trigger**: Called from React app
- **Purpose**: Handles contact form submissions with email notifications
- **Features**:
  - Form validation
  - Staff notifications
  - Auto-reply to sender
  - Urgent message flagging
  - Message storage in Firestore

### HTTP Functions

#### 6. **Stripe Webhook Handler**

- **File**: `src/stripeWebhook.js`
- **Trigger**: HTTP POST from Stripe
- **Purpose**: Processes donation payments and manages recurring subscriptions
- **Features**:
  - Payment success/failure handling
  - Donation thank you emails
  - Recurring subscription management
  - Large donation notifications
  - Monthly donation statistics

#### 7. **Health Check**

- **File**: `index.js`
- **Trigger**: HTTP GET request
- **Purpose**: Simple health check for monitoring
- **Endpoint**: `/healthCheck`

## 📧 Email Configuration

### Gmail Setup (Recommended)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:

   - Go to Google Account → Security → App passwords
   - Select "Mail" and "Other (custom name)"
   - Enter "Church Website" as the name
   - Copy the 16-character password

3. Configure environment variables:

```bash
CHURCH_EMAIL=your-church-email@gmail.com
CHURCH_EMAIL_PASSWORD=your-16-character-app-password
```

### Alternative Email Providers

The functions use Nodemailer, which supports various email providers:

- Gmail (recommended)
- Outlook/Hotmail
- Yahoo
- Custom SMTP servers

## 🔐 Security & Environment Variables

### Required Environment Variables

```bash
# Email Configuration
CHURCH_EMAIL=your-church-email@gmail.com
CHURCH_EMAIL_PASSWORD=your-app-password

# Notification Recipients
DEFAULT_NOTIFICATION_EMAIL=pastor@hoursofmercy.org
ADMIN_EMAIL=admin@hoursofmercy.org

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Optional
WEBSITE_URL=https://your-domain.com
DEBUG_MODE=false
```

### Setting in Firebase

```bash
# Set environment variables in Firebase
firebase functions:config:set email.address="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"

# View current configuration
firebase functions:config:get
```

## 🧪 Testing

### Local Testing

```bash
# Start Firebase emulators
firebase emulators:start --only functions

# Test functions locally
npm run serve
```

### Production Testing

Use the Cloud Functions Test component in the admin dashboard (`/admin`) to test deployed functions.

### Manual Testing

```bash
# Test health check
curl https://your-region-the-project-f1728.cloudfunctions.net/healthCheck

# Test callable function (requires authentication)
# Use the React app's test interface
```

## 📊 Monitoring & Logs

### View Logs

```bash
# All function logs
firebase functions:log

# Specific function logs
firebase functions:log --only sendPrayerRequestNotification

# Follow logs in real-time
firebase functions:log --follow
```

### Firebase Console

Monitor functions at: https://console.firebase.google.com/project/the-project-f1728/functions

## 🚨 Troubleshooting

### Common Issues

#### Email Sending Failures

- Verify Gmail App Password is correct
- Check 2-Factor Authentication is enabled
- Ensure environment variables are set correctly

#### Permission Errors

- Check Firestore security rules
- Verify function IAM roles
- Ensure proper authentication

#### Deployment Issues

- Check Firebase CLI authentication
- Verify project selection
- Try deploying functions individually

### Debug Mode

Enable debug logging:

```bash
firebase functions:config:set debug.enabled=true
firebase deploy --only functions
```

## 📈 Performance & Cost

### Optimization Tips

- Monitor function invocations in Firebase Console
- Set up billing alerts
- Use appropriate memory allocation
- Implement connection pooling for external services

### Scaling Considerations

- Functions automatically scale with demand
- Email rate limits apply (Gmail: 500-2000 emails/day)
- Monitor costs with Firebase pricing calculator

## 🔄 Maintenance

### Regular Tasks

- Monitor function logs weekly
- Check email delivery reports
- Update dependencies monthly
- Review performance metrics

### Updates

- Keep Firebase SDK updated
- Monitor Node.js version compatibility
- Review Firebase pricing changes
- Update security rules as needed

## 📚 Documentation Links

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Firebase Console](https://console.firebase.google.com/project/the-project-f1728)

## 🆘 Support

For technical support:

1. Check function logs in Firebase Console
2. Review this documentation
3. Test functions using the admin dashboard
4. Contact the development team

---

**Note**: This is a production system handling real church communications. Always test thoroughly in development before deploying changes.
