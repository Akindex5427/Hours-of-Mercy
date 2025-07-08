# 🎯 Firebase Sample Data Documentation

## 📊 Complete Database Seeding for Christ Apostolic Church Hours of Mercy

This documentation outlines all the sample data that has been created for your Firestore database. You can populate your database using either the script or the admin interface.

---

## 🚀 How to Populate Your Database

### Method 1: Using the Admin Interface (Recommended)

1. Start your development server: `npm run dev`
2. Navigate to: `http://localhost:5173/admin`
3. Click "Seed Database" button
4. Watch the progress as data is added to your Firestore

### Method 2: Using the Script

1. Open `seed-firestore.js`
2. Uncomment the last line: `seedFirestoreData()`
3. Run: `node seed-firestore.js`

---

## 📋 Sample Data Overview

### 1. Staff Directory (6 Members)

**Collection:** `staff`

| Name                 | Title                        | Department          | Phone          |
| -------------------- | ---------------------------- | ------------------- | -------------- |
| Pastor John Smith    | Senior Pastor                | Leadership          | (708) 555-0124 |
| Pastor Mary Johnson  | Associate Pastor             | Pastoral Care       | (708) 555-0125 |
| Pastor David Wilson  | Youth Pastor                 | Youth Ministry      | (708) 555-0126 |
| Minister Sarah Brown | Worship Leader               | Worship Ministry    | (708) 555-0127 |
| Brother Robert Davis | Church Administrator         | Administration      | (708) 555-0128 |
| Sister Lisa Thompson | Children's Ministry Director | Children's Ministry | (708) 555-0129 |

**Staff Data Includes:**

- ✅ Complete contact information
- ✅ Educational background
- ✅ Ministry experience
- ✅ Specialties and skills
- ✅ Biography and join date
- ✅ Department categorization

---

### 2. Events System (6 Events)

**Collection:** `events`

| Event                        | Date                    | Type      | Capacity  |
| ---------------------------- | ----------------------- | --------- | --------- |
| Sunday Morning Worship       | Weekly (Sun 8AM & 11AM) | Recurring | 300       |
| Wednesday Prayer Meeting     | Weekly (Wed 7PM)        | Recurring | 100       |
| Youth Conference 2025        | July 15-17, 2025        | Special   | 150       |
| Women's Fellowship Breakfast | Monthly (2nd Sat 9AM)   | Recurring | 50        |
| Community Food Drive         | July 20, 2025           | Outreach  | Unlimited |
| Men's Ministry Retreat       | Aug 15-17, 2025         | Retreat   | 40        |

**Event Data Includes:**

- ✅ Detailed descriptions
- ✅ Location and address information
- ✅ Registration requirements
- ✅ Capacity limits
- ✅ Recurring event patterns
- ✅ Categories and tags
- ✅ Organizer information

---

### 3. Sermon Archive (5 Sermons)

**Collection:** `sermons`

| Title                          | Speaker              | Date          | Series               | Duration |
| ------------------------------ | -------------------- | ------------- | -------------------- | -------- |
| Walking by Faith, Not by Sight | Pastor John Smith    | June 29, 2025 | Living by Faith      | 45 min   |
| The Power of Prayer            | Pastor Mary Johnson  | June 26, 2025 | Foundations of Faith | 35 min   |
| God's Love Never Fails         | Pastor John Smith    | June 22, 2025 | The Heart of God     | 42 min   |
| Finding Purpose in God's Plan  | Pastor David Wilson  | June 19, 2025 | Youth Night          | 30 min   |
| Worship in Spirit and Truth    | Minister Sarah Brown | June 15, 2025 | Heart of Worship     | 38 min   |

**Sermon Data Includes:**

- ✅ Complete sermon metadata
- ✅ Scripture references
- ✅ Audio/video URLs (placeholder)
- ✅ Sermon series organization
- ✅ Categories and tags
- ✅ View counts and engagement
- ✅ Download links for notes

---

### 4. Prayer Requests (5 Requests)

**Collection:** `prayerRequests`

| Type             | Status   | Submitted     | Priority |
| ---------------- | -------- | ------------- | -------- |
| Healing          | Active   | July 1, 2025  | Urgent   |
| Spiritual Growth | Active   | June 30, 2025 | Normal   |
| Financial        | Active   | June 28, 2025 | Normal   |
| Family           | Answered | June 25, 2025 | Normal   |
| Guidance         | Active   | July 2, 2025  | Normal   |

**Prayer Request Data Includes:**

- ✅ Detailed prayer needs
- ✅ Contact information
- ✅ Privacy preferences
- ✅ Category classification
- ✅ Status tracking
- ✅ Follow-up dates
- ✅ Prayer team assignments

---

### 5. Newsletter Subscriptions (5 Subscribers)

**Collection:** `newsletterSubscriptions`

| Email                      | Name           | Status       | Preferences      |
| -------------------------- | -------------- | ------------ | ---------------- |
| john.doe@example.com       | John Doe       | Active       | All updates      |
| mary.smith@example.com     | Mary Smith     | Active       | All updates      |
| robert.johnson@example.com | Robert Johnson | Active       | Events & Sermons |
| susan.brown@example.com    | Susan Brown    | Active       | Weekly & Events  |
| james.wilson@example.com   | James Wilson   | Unsubscribed | -                |

**Newsletter Data Includes:**

- ✅ Subscriber contact information
- ✅ Subscription preferences
- ✅ Subscription source tracking
- ✅ Active/inactive status
- ✅ Subscription dates
- ✅ Unsubscribe tracking

---

## 🔧 Database Structure

### Field Types Used:

- **Timestamps:** `createdAt`, `updatedAt`, `submittedAt`
- **Booleans:** `isActive`, `isUrgent`, `isAnonymous`
- **Arrays:** `education[]`, `experience[]`, `tags[]`
- **Objects:** `preferences{}`, `downloads{}`
- **Numbers:** `capacity`, `views`, `likes`
- **Strings:** Standard text fields
- **Dates:** JavaScript Date objects

### Security Considerations:

- Prayer requests contain sensitive personal information
- Email addresses require privacy protection
- Admin access needed for staff management
- Public read access for events, sermons, staff

---

## 📈 Usage Analytics

### Expected Data Growth:

- **Staff:** Stable (6-12 members)
- **Events:** 20-50 events per year
- **Sermons:** 100+ sermons per year
- **Prayer Requests:** 200+ requests per year
- **Newsletter:** 500+ subscribers

### Performance Optimization:

- Indexed fields: `date`, `status`, `category`
- Paginated queries for large collections
- Efficient filtering and sorting

---

## 🛠️ Admin Features

### Database Seeder Includes:

- ✅ Progress tracking
- ✅ Error handling
- ✅ Success confirmation
- ✅ Real-time updates
- ✅ Collection counting

### Admin Dashboard Features:

- 📊 Database management
- 🔧 Quick actions
- 📈 Feature overview
- 🔒 Security information
- 🔗 Firebase Console access

---

## 🎉 Next Steps

1. **Run the seeder** to populate your database
2. **Test all features** with real data
3. **Customize the sample data** to match your church
4. **Set up Firestore security rules** for production
5. **Configure Firebase hosting** for deployment

Your Firebase integration is now complete with comprehensive sample data! 🔥
