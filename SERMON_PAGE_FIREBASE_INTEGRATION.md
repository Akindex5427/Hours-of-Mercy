# SermonPage Firebase Integration - Troubleshooting Guide

## Issue Resolution: SermonPage not displaying Firebase data

The `SermonPage.jsx` has been successfully integrated with Firebase Firestore. Here's what was implemented and how to verify it's working:

## Changes Made

### 1. **Firebase Integration**

- ✅ Added `useSermons` hook from `../hooks/useFirestore`
- ✅ Firebase data now loads automatically when component mounts
- ✅ Added loading states and error handling
- ✅ Fallback to static data if Firebase is unavailable

### 2. **Data Structure Compatibility**

The Firebase sermon data structure differs slightly from the static data:

**Firebase Data Fields:**

- `speaker` (instead of `pastor`)
- `thumbnailUrl` (instead of `thumbnail`)
- `date` (converted from Firestore Timestamp)
- `tags` (array, may be undefined)
- `series` (may be undefined)

**Compatibility Updates:**

```jsx
// Support both pastor and speaker fields
{sermon.pastor || sermon.speaker}

// Support both thumbnail and thumbnailUrl
image={sermon.thumbnail || sermon.thumbnailUrl || "/api/placeholder/400/225"}

// Handle missing fields gracefully
{sermon.duration || "N/A"}
{sermon.scripture || "Scripture reference not available"}
{sermon.series || "General"}
{(sermon.tags || []).map(...)}
```

### 3. **Filter Logic Updates**

Updated video/audio filtering to work with Firebase data:

```jsx
// Video filter: has videoUrl or type is video
if (selectedTab === 2) return sermon.type === "video" || sermon.videoUrl;

// Audio filter: has audioUrl but no videoUrl, or type is audio
if (selectedTab === 3)
  return sermon.type === "audio" || (sermon.audioUrl && !sermon.videoUrl);
```

## How to Verify It's Working

### 1. **Check Firebase Data**

Ensure sermons are seeded in Firestore:

```bash
node seed-firestore.js
```

### 2. **Browser Console Debug**

The SermonPage includes debug logging:

```javascript
console.log("SermonPage Debug:", { sermons, loading, error });
console.log("Display sermons:", displaySermons);
```

### 3. **Expected Behavior**

- **Loading**: Shows spinner while fetching from Firebase
- **Success**: Displays Firebase sermon data
- **Error**: Shows error alert but falls back to static data
- **Empty**: Falls back to static data if no Firebase data

### 4. **Data Priority**

```javascript
// Use Firebase data if available, otherwise use static data
const displaySermons = sermons && sermons.length > 0 ? sermons : staticSermons;
```

## Common Issues & Solutions

### Issue 1: "No sermons showing"

**Solution:** Check browser console for Firebase errors or authentication issues.

### Issue 2: "Only static data showing"

**Solution:**

1. Verify Firebase configuration in `.env.local`
2. Check Firestore rules allow reading sermons
3. Run the seed script to populate data

### Issue 3: "Missing fields (duration, speaker, etc.)"

**Solution:** The component now handles missing fields gracefully with fallbacks.

### Issue 4: "Video/Audio filters not working"

**Solution:** Updated filter logic now checks for both `type` field and URL presence.

## Firebase Sermon Data Structure

```javascript
{
  id: "auto-generated-id",
  title: "Walking by Faith, Not by Sight",
  speaker: "Pastor John Smith",
  date: "6/29/2025", // Converted from Firestore Timestamp
  series: "Living by Faith",
  description: "Discovering what it means to trust God completely...",
  scripture: "2 Corinthians 5:7",
  duration: "45 minutes",
  audioUrl: "https://example.com/sermons/walking-by-faith.mp3",
  videoUrl: "https://example.com/sermons/walking-by-faith.mp4",
  thumbnailUrl: "/api/placeholder/300/200",
  category: "faith",
  tags: ["faith", "trust", "spiritual-growth"],
  notes: "In this powerful message...",
  views: 245,
  likes: 18,
  status: "published",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## Testing Instructions

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to the Sermons page**

3. **Open browser developer tools** and check the console for debug messages

4. **Verify the following:**
   - Loading spinner appears initially
   - Firebase data loads (check console logs)
   - Sermons display with correct information
   - Search functionality works
   - Video/Audio tabs filter correctly
   - Error handling works if Firebase is down

## Next Steps

If you've added new sermons to Firestore and they're not appearing:

1. **Check the browser console** for any error messages
2. **Verify Firebase rules** allow reading sermons collection
3. **Test the useSermons hook** independently
4. **Check network tab** for failed Firebase requests
5. **Restart the development server** to clear any caching issues

The SermonPage is now fully integrated with Firebase and should automatically display any sermons added to the Firestore database!
