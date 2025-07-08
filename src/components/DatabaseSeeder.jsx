// Database Seeding Component for Admin Use
import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from "@mui/material";
import {
  CloudUpload,
  CheckCircle,
  Group,
  Event,
  RecordVoiceOver,
  FavoriteOutlined,
  Email,
  Warning,
} from "@mui/icons-material";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

const DatabaseSeeder = () => {
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Sample data (same as in seed-firestore.js but in component)
  const staffData = [
    {
      id: "pastor-john-smith",
      name: "Pastor John Smith",
      title: "Senior Pastor",
      department: "Leadership",
      email: "pastor.john@hoursofmercy.org",
      phone: "(708) 555-0124",
      bio: "Pastor John has been serving Christ Apostolic Church Hours of Mercy for over 15 years. He holds a Master of Divinity from Chicago Theological Seminary and is passionate about teaching God's Word and shepherding the flock.",
      education: [
        "M.Div., Chicago Theological Seminary",
        "B.A. Theology, Moody Bible Institute",
      ],
      experience: [
        "15+ years in pastoral ministry",
        "Former missionary to Nigeria",
        "Church planting experience",
      ],
      specialties: [
        "Expository preaching",
        "Pastoral counseling",
        "Church leadership",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2009",
      isActive: true,
    },
    {
      id: "pastor-mary-johnson",
      name: "Pastor Mary Johnson",
      title: "Associate Pastor",
      department: "Pastoral Care",
      email: "pastor.mary@hoursofmercy.org",
      phone: "(708) 555-0125",
      bio: "Pastor Mary oversees our pastoral care ministry and women's fellowship. She has a heart for prayer and helping people grow in their relationship with Jesus Christ.",
      education: [
        "M.A. Christian Counseling, Trinity Seminary",
        "B.S. Psychology, Wheaton College",
      ],
      experience: [
        "12 years in ministry",
        "Licensed Christian counselor",
        "Women's ministry leader",
      ],
      specialties: [
        "Pastoral counseling",
        "Women's ministry",
        "Prayer ministry",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2012",
      isActive: true,
    },
    {
      id: "pastor-david-wilson",
      name: "Pastor David Wilson",
      title: "Youth Pastor",
      department: "Youth Ministry",
      email: "pastor.david@hoursofmercy.org",
      phone: "(708) 555-0126",
      bio: "Pastor David leads our youth ministry with energy and passion. He loves connecting with young people and helping them discover their purpose in God's plan.",
      education: [
        "B.A. Youth Ministry, North Central University",
        "Certificate in Biblical Studies",
      ],
      experience: [
        "8 years in youth ministry",
        "Former youth camp director",
        "Mentorship program developer",
      ],
      specialties: [
        "Youth evangelism",
        "Leadership development",
        "Community outreach",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2017",
      isActive: true,
    },
  ];

  const eventsData = [
    {
      title: "Sunday Morning Worship",
      description:
        "Join us every Sunday for uplifting worship, powerful preaching, and fellowship with believers.",
      date: new Date("2025-07-06T08:00:00"),
      endDate: new Date("2025-07-06T12:00:00"),
      time: "8:00 AM & 11:00 AM",
      location: "Main Sanctuary",
      address: "1480 Lincoln Ave, Dolton, IL",
      category: "worship",
      isRecurring: true,
      recurringType: "weekly",
      organizer: "Pastor John Smith",
      capacity: 300,
      registrationRequired: false,
      imageUrl: "/api/placeholder/400/250",
      tags: ["worship", "sermon", "fellowship"],
      status: "published",
    },
    {
      title: "Youth Conference 2025",
      description:
        "A powerful three-day conference for young people ages 13-25.",
      date: new Date("2025-07-15T09:00:00"),
      endDate: new Date("2025-07-17T21:00:00"),
      time: "July 15-17, All Day",
      location: "Main Sanctuary & Fellowship Hall",
      address: "1480 Lincoln Ave, Dolton, IL",
      category: "youth",
      isRecurring: false,
      organizer: "Pastor David Wilson",
      capacity: 150,
      registrationRequired: true,
      registrationFee: 25.0,
      imageUrl: "/api/placeholder/400/250",
      tags: ["youth", "conference", "speakers", "workshops"],
      status: "published",
    },
  ];

  const sermonsData = [
    {
      title: "Walking by Faith, Not by Sight",
      speaker: "Pastor John Smith",
      date: new Date("2025-06-29T11:00:00"),
      series: "Living by Faith",
      description:
        "Discovering what it means to trust God completely, even when we cannot see the way ahead.",
      scripture: "2 Corinthians 5:7",
      duration: "45 minutes",
      audioUrl: "https://example.com/sermons/walking-by-faith.mp3",
      videoUrl: "https://example.com/sermons/walking-by-faith.mp4",
      thumbnailUrl: "/api/placeholder/300/200",
      category: "faith",
      tags: ["faith", "trust", "spiritual-growth"],
      notes:
        "In this powerful message, Pastor John explores what it means to live by faith in an uncertain world.",
      views: 245,
      likes: 18,
      status: "published",
    },
    {
      title: "The Power of Prayer",
      speaker: "Pastor Mary Johnson",
      date: new Date("2025-06-26T19:00:00"),
      series: "Foundations of Faith",
      description:
        "Understanding the incredible privilege and power we have in prayer.",
      scripture: "James 5:16",
      duration: "35 minutes",
      audioUrl: "https://example.com/sermons/power-of-prayer.mp3",
      videoUrl: "https://example.com/sermons/power-of-prayer.mp4",
      thumbnailUrl: "/api/placeholder/300/200",
      category: "prayer",
      tags: ["prayer", "spiritual-discipline", "relationship-with-god"],
      notes:
        "Pastor Mary shares practical insights on developing a more effective prayer life.",
      views: 189,
      likes: 22,
      status: "published",
    },
  ];

  const addProgress = (message, type = "info") => {
    setProgress((prev) => [
      ...prev,
      { message, type, time: new Date().toLocaleTimeString() },
    ]);
  };

  const seedDatabase = async () => {
    setSeeding(true);
    setProgress([]);
    setError(null);
    setSuccess(false);

    try {
      addProgress("🌱 Starting database seeding...", "info");

      // Seed Staff
      addProgress("📋 Seeding Staff Directory...", "info");
      for (const staff of staffData) {
        await setDoc(doc(db, "staff", staff.id), {
          ...staff,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        addProgress(`✅ Added staff member: ${staff.name}`, "success");
      }

      // Seed Events
      addProgress("📅 Seeding Events...", "info");
      for (const event of eventsData) {
        await addDoc(collection(db, "events"), {
          ...event,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        addProgress(`✅ Added event: ${event.title}`, "success");
      }

      // Seed Sermons
      addProgress("🎤 Seeding Sermons...", "info");
      for (const sermon of sermonsData) {
        await addDoc(collection(db, "sermons"), {
          ...sermon,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        addProgress(`✅ Added sermon: ${sermon.title}`, "success");
      }

      // Add sample prayer request
      addProgress("🙏 Adding sample prayer request...", "info");
      await addDoc(collection(db, "prayerRequests"), {
        firstName: "Sample",
        lastName: "User",
        email: "sample@example.com",
        prayerRequest: "This is a sample prayer request for testing purposes.",
        requestType: "general",
        isUrgent: false,
        isAnonymous: false,
        allowSharing: true,
        status: "pending",
        submittedAt: new Date().toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      addProgress(`✅ Added sample prayer request`, "success");

      // Add sample newsletter subscription
      addProgress("📧 Adding sample newsletter subscription...", "info");
      await addDoc(collection(db, "newsletterSubscriptions"), {
        email: "sample@example.com",
        name: "Sample User",
        subscribedAt: new Date(),
        isActive: true,
        preferences: {
          weeklyUpdates: true,
          eventNotifications: true,
          sermonNotifications: true,
        },
        source: "seeder",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      addProgress(`✅ Added sample newsletter subscription`, "success");

      addProgress("🎉 Database seeding completed successfully!", "success");
      setSuccess(true);
    } catch (err) {
      console.error("Seeding error:", err);

      // Provide specific guidance for common errors
      let errorMessage = `Error seeding database: ${err.message}`;

      if (err.message.includes("Missing or insufficient permissions")) {
        errorMessage =
          "Firebase Permission Error: Please update your Firestore security rules to allow writes. See FIREBASE_PERMISSIONS_FIX.md for detailed instructions.";
        addProgress("🔒 Permission Error Detected", "error");
        addProgress(
          "📋 Solution: Update Firestore rules to allow writes",
          "info"
        );
        addProgress(
          "📁 Check FIREBASE_PERMISSIONS_FIX.md for instructions",
          "info"
        );
      }

      setError(errorMessage);
      addProgress(`❌ Error: ${err.message}`, "error");
    } finally {
      setSeeding(false);
    }
  };

  const collections = [
    {
      name: "Staff Directory",
      icon: <Group />,
      count: staffData.length,
      color: "primary",
    },
    {
      name: "Events",
      icon: <Event />,
      count: eventsData.length,
      color: "secondary",
    },
    {
      name: "Sermons",
      icon: <RecordVoiceOver />,
      count: sermonsData.length,
      color: "success",
    },
    {
      name: "Prayer Requests",
      icon: <FavoriteOutlined />,
      count: 1,
      color: "info",
    },
    { name: "Newsletter Subs", icon: <Email />, count: 1, color: "warning" },
  ];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Card>
        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CloudUpload />
            Database Seeder
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            This tool will populate your Firestore database with sample data for
            testing and demonstration purposes.
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>⚠️ Important:</strong> This will add sample data to your
              Firebase database. Only run this in a test environment or if you
              want demo data.
            </Typography>
          </Alert>

          {/* Collections Preview */}
          <Typography variant="h6" gutterBottom>
            What will be added:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {collections.map((collection, index) => (
              <Chip
                key={index}
                icon={collection.icon}
                label={`${collection.name} (${collection.count})`}
                color={collection.color}
                variant="outlined"
              />
            ))}
          </Box>

          {/* Action Button */}
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={seedDatabase}
            disabled={seeding}
            startIcon={
              seeding ? <CircularProgress size={20} /> : <CloudUpload />
            }
            sx={{ mb: 3 }}
          >
            {seeding ? "Seeding Database..." : "Seed Database"}
          </Button>

          {/* Error Display */}
          {error && (
            <>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>

              {/* Permission Error Troubleshooting */}
              {error.includes("permission") && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    🔧 Quick Fix for Permissions Error:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    1. Go to <strong>Firebase Console</strong> →{" "}
                    <strong>Firestore Database</strong> → <strong>Rules</strong>
                  </Typography>
                  <Typography variant="body2" paragraph>
                    2. Replace the rules with:{" "}
                    <code>{"allow read, write: if true;"}</code>
                  </Typography>
                  <Typography variant="body2">
                    3. Click <strong>Publish</strong> and try again
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    href="https://console.firebase.google.com/project/the-project-f1728/firestore/rules"
                    target="_blank"
                    sx={{ mt: 1 }}
                  >
                    Open Firebase Rules
                  </Button>
                </Alert>
              )}
            </>
          )}

          {/* Success Display */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              🎉 Database seeding completed! Check your Firebase Console to see
              the data.
            </Alert>
          )}

          {/* Progress Log */}
          {progress.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Progress Log:
              </Typography>
              <Box
                sx={{
                  maxHeight: 300,
                  overflow: "auto",
                  bgcolor: "grey.50",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                <List dense>
                  {progress.map((item, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        {item.type === "success" ? (
                          <CheckCircle
                            sx={{ fontSize: 16, color: "success.main" }}
                          />
                        ) : item.type === "error" ? (
                          <Warning sx={{ fontSize: 16, color: "error.main" }} />
                        ) : (
                          <CircularProgress size={16} />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.message}
                        secondary={item.time}
                        primaryTypographyProps={{
                          variant: "body2",
                          color:
                            item.type === "error"
                              ? "error.main"
                              : "text.primary",
                        }}
                        secondaryTypographyProps={{ variant: "caption" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DatabaseSeeder;
