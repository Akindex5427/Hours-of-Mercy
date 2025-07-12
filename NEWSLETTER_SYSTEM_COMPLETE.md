# Complete Newsletter System Documentation

## Newsletter System Overview

Your Christ Apostolic Church website now has a comprehensive newsletter system with multiple automated email campaigns:

### 1. **Newsletter Subscription Process**

- **Location**: Footer component on every page
- **Process**: Users enter their email and are automatically subscribed
- **Storage**: Emails stored in Firestore `newsletterSubscriptions` collection
- **Welcome Email**: Automatically sent upon subscription

### 2. **Automated Email Campaigns**

#### **Daily Event Reminders**

- **Schedule**: Every day at 9:00 AM
- **Function**: `sendEventReminders`
- **Purpose**: Sends email reminders for events happening tomorrow
- **Content**: Event details, time, location, and church info
- **Trigger**: Firebase Cloud Scheduler (`0 9 * * *`)

#### **Weekly Newsletter**

- **Schedule**: Every Sunday at 8:00 AM
- **Function**: `sendWeeklyNewsletter`
- **Purpose**: Weekly roundup of church activities and upcoming events
- **Content**:
  - This week's upcoming events
  - Recent sermons (last 2 weeks)
  - Church service times
  - Call-to-action buttons
- **Trigger**: Firebase Cloud Scheduler (`0 8 * * 0`)

#### **Monthly Newsletter**

- **Schedule**: 1st day of each month at 10:00 AM
- **Function**: `sendMonthlyNewsletter`
- **Purpose**: Monthly summary and next month's preview
- **Content**:
  - Ministry highlights and statistics
  - Next month's events
  - Past month's sermons
  - Member statistics
  - Pastor's monthly message
  - Financial/donation links
- **Trigger**: Firebase Cloud Scheduler (`0 10 1 * *`)

#### **Welcome Email**

- **Schedule**: Immediately upon subscription
- **Function**: `sendNewsletterWelcome`
- **Purpose**: Welcome new subscribers
- **Content**:
  - Welcome message
  - Upcoming events (next 7 days)
  - Latest sermon
  - Church contact info
- **Trigger**: Firestore document creation

### 3. **Technical Implementation**

#### **Cloud Functions**

- **Platform**: Firebase Cloud Functions (serverless)
- **Email Service**: Nodemailer with Gmail SMTP
- **Scheduling**: Firebase Cloud Scheduler
- **Database**: Firestore for subscriber management

#### **Email Templates**

- **Format**: HTML with responsive design
- **Branding**: Church colors and logo
- **Personalization**: Subscriber name and email
- **Unsubscribe**: Information included in every email

### 4. **Subscriber Management**

#### **Database Structure** (`newsletterSubscriptions`)

```javascript
{
  email: "subscriber@email.com",
  name: "Optional Name",
  subscribedAt: timestamp,
  isActive: true,
  welcomeEmailSent: true,
  welcomeEmailSentAt: timestamp
}
```

#### **Admin Features**

- View all subscribers
- Track email delivery status
- Monitor subscription analytics
- Manage active/inactive subscribers

### 5. **Email Delivery Schedule**

| Day     | Time           | Email Type         | Content                |
| ------- | -------------- | ------------------ | ---------------------- |
| Daily   | 9:00 AM        | Event Reminders    | Tomorrow's events      |
| Sunday  | 8:00 AM        | Weekly Newsletter  | Week's activities      |
| Monthly | 10:00 AM (1st) | Monthly Newsletter | Month summary          |
| Instant | Any time       | Welcome Email      | New subscriber welcome |

### 6. **Content Sources**

All email content is dynamically generated from your Firestore database:

- **Events**: `events` collection
- **Sermons**: `sermons` collection
- **Members**: `members` collection
- **Prayer Requests**: `prayerRequests` collection

### 7. **Deployment Status**

✅ **Currently Active Functions:**

- `sendEventReminders` - Daily at 9 AM
- `sendWeeklyNewsletter` - Sundays at 8 AM
- `sendMonthlyNewsletter` - 1st of month at 10 AM
- `sendNewsletterWelcome` - Instant on subscription

### 8. **Next Steps**

To deploy all functions:

```bash
cd functions
firebase deploy --only functions
```

To test functions:

- Use the Admin Dashboard → Cloud Functions Test Interface
- Monitor logs in Firebase Console
- Check email delivery in Gmail/SMTP logs

### 9. **Email Content Examples**

- **Daily**: "Tomorrow's Service Reminder" with event details
- **Weekly**: "This Week at Hours of Mercy" with events and sermons
- **Monthly**: "Monthly Update" with statistics and highlights
- **Welcome**: "Welcome to Hours of Mercy" with church introduction

This system provides comprehensive, automated communication with your church community while requiring minimal manual intervention.
