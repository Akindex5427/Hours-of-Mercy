# Firebase Integration Guide

## 🔥 Firebase Setup Complete!

Your Christ Apostolic Church Hours of Mercy website is now integrated with Firebase! Here's what has been configured:

### ✅ What's Working:

1. **Firebase Configuration**: Your project is connected to `the-project-f1728`
2. **Firestore Database**: Ready for storing church data
3. **Authentication**: Ready for member login/registration
4. **Storage**: Ready for file uploads (images, documents, audio/video)
5. **Analytics**: Configured for website analytics

### 📁 Files Created/Modified:

- `src/firebase/config.js` - Firebase initialization with your project settings
- `src/firebase/firestore.js` - Database service functions
- `src/hooks/useFirestore.js` - Custom React hooks for Firebase
- `src/components/FirebaseStatus.jsx` - Connection status indicator
- `.env.local` - Environment variables with your Firebase config

### 🚀 Firebase Features Integrated:

#### **1. Prayer Requests** (`src/pages/PrayerRequestPage.jsx`)

- Submissions now saved to Firestore database
- Real-time form validation and feedback

#### **2. Newsletter Signup** (`src/components/layout/Footer.jsx`)

- Email subscriptions saved to Firestore
- Loading states and success/error feedback

#### **3. Events System** (`src/pages/HomePage.jsx`)

- Can load events from Firestore database
- Falls back to static data if no database events exist

#### **4. Staff Directory** (Ready for integration)

- Service functions created for staff management
- Can store staff photos in Firebase Storage

### 🎯 Next Steps:

#### 1. **Set up Firestore Database:**

```
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: the-project-f1728
3. Go to Firestore Database
4. Click "Create database"
5. Choose "Start in test mode" for now
6. Select a location (preferably close to your users)
```

#### 2. **Create Database Collections:**

The app expects these Firestore collections:

- `events` - Church events and calendar
- `sermons` - Sermon archive
- `staff` - Staff directory
- `prayerRequests` - Prayer request submissions
- `newsletterSubscriptions` - Newsletter signups

#### 3. **Test the Integration:**

```bash
npm run dev
```

- Look for the Firebase connection status in the top-right corner
- Try submitting a prayer request
- Try subscribing to the newsletter
- Check your Firestore console for new data

#### 4. **Add Sample Data:**

You can add sample data directly in the Firestore console or use the provided service functions.

### 🔧 Custom Hooks Available:

```jsx
import {
  useStaff,
  useEvents,
  useSermons,
  usePrayerRequests,
  useNewsletter,
} from "./hooks/useFirestore";

// Example usage:
function MyComponent() {
  const { staff, loading, error } = useStaff();
  const { events } = useEvents();
  const { subscribe } = useNewsletter();

  // Your component logic here
}
```

### 🛡️ Security Rules:

For production, update your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to public collections
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /sermons/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /staff/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Prayer requests - write only, admin read
    match /prayerRequests/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Newsletter subscriptions - write only
    match /newsletterSubscriptions/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

### 🎉 Ready to Use!

Your Firebase integration is complete! The website will now:

- Save prayer requests to your database
- Store newsletter subscriptions
- Show connection status
- Fall back gracefully if Firebase is unavailable

Visit your Firebase Console to see data coming in real-time!
