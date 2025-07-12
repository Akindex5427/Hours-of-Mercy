// Firebase Data Seeding Script
// Run this script to populate your Firestore database with sample data

import { db } from "./firebase-server-config.js";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

// Sample Staff Directory Data
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
    socialMedia: {
      twitter: "@pastorjohnsmith",
      facebook: "pastor.john.smith",
    },
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
    specialties: ["Pastoral counseling", "Women's ministry", "Prayer ministry"],
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
  {
    id: "minister-sarah-brown",
    name: "Minister Sarah Brown",
    title: "Worship Leader",
    department: "Worship Ministry",
    email: "worship@hoursofmercy.org",
    phone: "(708) 555-0127",
    bio: "Minister Sarah leads our worship team and is passionate about creating an atmosphere where people can encounter God through music and praise.",
    education: [
      "B.M. Music Ministry, Berklee College",
      "Certificate in Worship Leadership",
    ],
    experience: [
      "10 years in worship ministry",
      "Professional musician",
      "Choir director",
    ],
    specialties: ["Vocal training", "Music arrangement", "Worship leading"],
    avatar: "/api/placeholder/150/150",
    joinDate: "2015",
    isActive: true,
  },
  {
    id: "brother-robert-davis",
    name: "Brother Robert Davis",
    title: "Church Administrator",
    department: "Administration",
    email: "admin@hoursofmercy.org",
    phone: "(708) 555-0128",
    bio: "Brother Robert oversees the administrative operations of the church, ensuring everything runs smoothly so our ministry can focus on serving God and our community.",
    education: ["M.B.A. Non-Profit Management", "B.S. Business Administration"],
    experience: [
      "20+ years in administration",
      "Non-profit management",
      "Financial oversight",
    ],
    specialties: [
      "Operations management",
      "Financial administration",
      "Facility management",
    ],
    avatar: "/api/placeholder/150/150",
    joinDate: "2010",
    isActive: true,
  },
  {
    id: "sister-lisa-thompson",
    name: "Sister Lisa Thompson",
    title: "Children's Ministry Director",
    department: "Children's Ministry",
    email: "children@hoursofmercy.org",
    phone: "(708) 555-0129",
    bio: "Sister Lisa has a special calling to work with children and loves helping them learn about Jesus in fun and engaging ways.",
    education: [
      "B.A. Elementary Education",
      "Certificate in Children's Ministry",
    ],
    experience: [
      "15 years in children's ministry",
      "Former elementary teacher",
      "VBS coordinator",
    ],
    specialties: [
      "Child development",
      "Bible teaching",
      "Program coordination",
    ],
    avatar: "/api/placeholder/150/150",
    joinDate: "2013",
    isActive: true,
  },
];

// Sample Events Data
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
    title: "Wednesday Prayer Meeting",
    description:
      "Come together for a time of prayer, worship, and Bible study. Bring your prayer requests and experience the power of corporate prayer.",
    date: new Date("2025-07-09T19:00:00"),
    endDate: new Date("2025-07-09T20:30:00"),
    time: "7:00 PM",
    location: "Fellowship Hall",
    address: "1480 Lincoln Ave, Dolton, IL",
    category: "prayer",
    isRecurring: true,
    recurringType: "weekly",
    organizer: "Pastor Mary Johnson",
    capacity: 100,
    registrationRequired: false,
    imageUrl: "/api/placeholder/400/250",
    tags: ["prayer", "bible-study", "fellowship"],
    status: "published",
  },
  {
    title: "Youth Conference 2025",
    description:
      "A powerful three-day conference for young people ages 13-25. Special guest speakers, worship, workshops, and fellowship.",
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
  {
    title: "Women's Fellowship Breakfast",
    description:
      "Ladies, join us for a time of fellowship, encouragement, and sharing over a delicious breakfast.",
    date: new Date("2025-07-12T09:00:00"),
    endDate: new Date("2025-07-12T11:00:00"),
    time: "9:00 AM - 11:00 AM",
    location: "Fellowship Hall",
    address: "1480 Lincoln Ave, Dolton, IL",
    category: "fellowship",
    isRecurring: true,
    recurringType: "monthly",
    organizer: "Pastor Mary Johnson",
    capacity: 50,
    registrationRequired: true,
    imageUrl: "/api/placeholder/400/250",
    tags: ["women", "fellowship", "breakfast"],
    status: "published",
  },
  {
    title: "Community Food Drive",
    description:
      "Help us serve our community by donating non-perishable food items. Together we can make a difference.",
    date: new Date("2025-07-20T10:00:00"),
    endDate: new Date("2025-07-20T16:00:00"),
    time: "10:00 AM - 4:00 PM",
    location: "Church Parking Lot",
    address: "1480 Lincoln Ave, Dolton, IL",
    category: "outreach",
    isRecurring: false,
    organizer: "Community Outreach Team",
    capacity: null,
    registrationRequired: false,
    imageUrl: "/api/placeholder/400/250",
    tags: ["outreach", "community", "food-drive", "service"],
    status: "published",
  },
  {
    title: "Men's Ministry Retreat",
    description:
      "A weekend retreat for men to grow in faith, build brotherhood, and be challenged in their walk with God.",
    date: new Date("2025-08-15T18:00:00"),
    endDate: new Date("2025-08-17T15:00:00"),
    time: "August 15-17",
    location: "Camp Maranatha",
    address: "Wisconsin Dells, WI",
    category: "retreat",
    isRecurring: true,
    recurringType: "yearly",
    organizer: "Men's Ministry Team",
    capacity: 40,
    registrationRequired: true,
    registrationFee: 150.0,
    imageUrl: "/api/placeholder/400/250",
    tags: ["men", "retreat", "fellowship", "spiritual-growth"],
    status: "published",
  },
];

// Sample Sermons Data
const sermonsData = [
  // Original Firebase data
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
    downloads: {
      audio: "https://example.com/downloads/walking-by-faith-audio.mp3",
      notes: "https://example.com/downloads/walking-by-faith-notes.pdf",
    },
    views: 245,
    likes: 18,
    status: "published",
  },
  // SermonPage static data converted to Firebase format
  {
    title: "Walking in God's Mercy",
    speaker: "Pastor John Smith",
    date: new Date("2025-06-29T11:00:00"),
    series: "Hours of Grace",
    description:
      "Discover how God's mercy is new every morning and how we can walk in His grace daily.",
    scripture: "Lamentations 3:22-23",
    duration: "45:32",
    audioUrl: "/sermons/walking-in-mercy.mp3",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/400/225",
    category: "mercy",
    tags: ["Mercy", "Grace", "Daily Walk"],
    notes:
      "Discover how God's mercy is new every morning and how we can walk in His grace daily.",
    downloads: {
      audio: "/sermons/walking-in-mercy.mp3",
      notes: "/sermons/walking-in-mercy-notes.pdf",
    },
    views: 0,
    likes: 0,
    status: "published",
  },
  {
    title: "The Power of Prayer",
    speaker: "Pastor Mary Johnson",
    date: new Date("2025-06-26T19:00:00"),
    series: "Foundations of Faith",
    description:
      "Understanding the incredible privilege and power we have in prayer and how to develop a deeper prayer life.",
    scripture: "James 5:16",
    duration: "35 minutes",
    audioUrl: "https://example.com/sermons/power-of-prayer.mp3",
    videoUrl: "https://example.com/sermons/power-of-prayer.mp4",
    thumbnailUrl: "/api/placeholder/300/200",
    category: "prayer",
    tags: ["prayer", "spiritual-discipline", "relationship-with-god"],
    notes:
      "Pastor Mary shares practical insights on developing a more effective prayer life.",
    downloads: {
      audio: "https://example.com/downloads/power-of-prayer-audio.mp3",
      notes: "https://example.com/downloads/power-of-prayer-notes.pdf",
    },
    views: 189,
    likes: 22,
    status: "published",
  },
  // Additional SermonPage sermon with different description
  {
    title: "The Power of Prayer (Lord's Prayer)",
    speaker: "Pastor Mary Johnson",
    date: new Date("2025-06-22T11:00:00"),
    series: "Foundations of Faith",
    description:
      "Understanding the Lord's Prayer and developing a powerful prayer life.",
    scripture: "Matthew 6:9-13",
    duration: "38:15",
    audioUrl: "/sermons/power-of-prayer.mp3",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/400/225",
    category: "prayer",
    tags: ["Prayer", "Faith", "Spiritual Growth"],
    notes:
      "Understanding the Lord's Prayer and developing a powerful prayer life.",
    downloads: {
      audio: "/sermons/power-of-prayer.mp3",
      notes: "/sermons/power-of-prayer-notes.pdf",
    },
    views: 0,
    likes: 0,
    status: "published",
  },
  {
    title: "Faith That Moves Mountains",
    speaker: "Pastor David Wilson",
    date: new Date("2025-06-15T11:00:00"),
    series: "Foundations of Faith",
    description:
      "Exploring the power of faith and how to overcome life's challenges.",
    scripture: "Matthew 17:20",
    duration: "42:18",
    audioUrl: "/sermons/faith-moves-mountains.mp3",
    thumbnailUrl: "/api/placeholder/400/225",
    category: "faith",
    tags: ["Faith", "Overcoming", "Mountains"],
    notes:
      "Exploring the power of faith and how to overcome life's challenges.",
    downloads: {
      audio: "/sermons/faith-moves-mountains.mp3",
      notes: "/sermons/faith-moves-mountains-notes.pdf",
    },
    views: 0,
    likes: 0,
    status: "published",
  },
  {
    title: "Love Your Neighbor",
    speaker: "Pastor Sarah Brown",
    date: new Date("2025-06-08T11:00:00"),
    series: "Living Like Jesus",
    description: "Practical ways to show Christ's love to those around us.",
    scripture: "Mark 12:31",
    duration: "35:45",
    audioUrl: "/sermons/love-your-neighbor.mp3",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "/api/placeholder/400/225",
    category: "love",
    tags: ["Love", "Community", "Service"],
    notes: "Practical ways to show Christ's love to those around us.",
    downloads: {
      audio: "/sermons/love-your-neighbor.mp3",
      notes: "/sermons/love-your-neighbor-notes.pdf",
    },
    views: 0,
    likes: 0,
    status: "published",
  },
  {
    title: "God's Love Never Fails",
    speaker: "Pastor John Smith",
    date: new Date("2025-06-22T11:00:00"),
    series: "The Heart of God",
    description:
      "Exploring the unchanging, unconditional love of God and how it transforms our lives.",
    scripture: "1 Corinthians 13:8",
    duration: "42 minutes",
    audioUrl: "https://example.com/sermons/gods-love-never-fails.mp3",
    videoUrl: "https://example.com/sermons/gods-love-never-fails.mp4",
    thumbnailUrl: "/api/placeholder/300/200",
    category: "love",
    tags: ["love", "grace", "salvation", "god-character"],
    notes:
      "A beautiful message about the depth and consistency of God's love for His people.",
    downloads: {
      audio: "https://example.com/downloads/gods-love-audio.mp3",
      notes: "https://example.com/downloads/gods-love-notes.pdf",
    },
    views: 312,
    likes: 28,
    status: "published",
  },
  {
    title: "Finding Purpose in God's Plan",
    speaker: "Pastor David Wilson",
    date: new Date("2025-06-19T19:00:00"),
    series: "Youth Night",
    description:
      "A special message for young people about discovering God's unique purpose for their lives.",
    scripture: "Jeremiah 29:11",
    duration: "30 minutes",
    audioUrl: "https://example.com/sermons/finding-purpose.mp3",
    videoUrl: "https://example.com/sermons/finding-purpose.mp4",
    thumbnailUrl: "/api/placeholder/300/200",
    category: "purpose",
    tags: ["purpose", "youth", "calling", "future"],
    notes:
      "Pastor David encourages young people to seek God's will for their lives.",
    downloads: {
      audio: "https://example.com/downloads/finding-purpose-audio.mp3",
      notes: "https://example.com/downloads/finding-purpose-notes.pdf",
    },
    views: 156,
    likes: 15,
    status: "published",
  },
  {
    title: "Worship in Spirit and Truth",
    speaker: "Minister Sarah Brown",
    date: new Date("2025-06-15T11:00:00"),
    series: "Heart of Worship",
    description:
      "Understanding what true worship means and how to cultivate a heart of worship in our daily lives.",
    scripture: "John 4:23-24",
    duration: "38 minutes",
    audioUrl: "https://example.com/sermons/worship-spirit-truth.mp3",
    videoUrl: "https://example.com/sermons/worship-spirit-truth.mp4",
    thumbnailUrl: "/api/placeholder/300/200",
    category: "worship",
    tags: ["worship", "lifestyle", "authenticity"],
    notes:
      "Minister Sarah teaches about authentic worship that goes beyond Sunday mornings.",
    downloads: {
      audio: "https://example.com/downloads/worship-spirit-truth-audio.mp3",
      notes: "https://example.com/downloads/worship-spirit-truth-notes.pdf",
    },
    views: 203,
    likes: 19,
    status: "published",
  },
];

// Sample Prayer Requests Data (for admin viewing - these would normally be private)
const prayerRequestsData = [
  {
    firstName: "Sarah",
    lastName: "M.",
    email: "sarah.m@example.com",
    phone: "(555) 123-4567",
    prayerRequest:
      "Please pray for my mother who is battling cancer. We need strength and healing during this difficult time.",
    requestType: "healing",
    isUrgent: true,
    isAnonymous: false,
    allowSharing: true,
    status: "active",
    submittedAt: new Date("2025-07-01T14:30:00").toISOString(),
    followUpDate: new Date("2025-07-08T14:30:00").toISOString(),
    assignedPrayerTeam: "Healing Ministry",
  },
  {
    firstName: "Michael",
    lastName: "",
    email: "michael.j@example.com",
    prayerRequest:
      "I'm struggling with anxiety and depression. Please pray for peace and God's guidance in my life.",
    requestType: "spiritual",
    isUrgent: false,
    isAnonymous: true,
    allowSharing: false,
    status: "active",
    submittedAt: new Date("2025-06-30T10:15:00").toISOString(),
    assignedPrayerTeam: "Pastoral Care",
  },
  {
    firstName: "Jennifer",
    lastName: "Wilson",
    email: "jwilson@example.com",
    phone: "(555) 987-6543",
    prayerRequest:
      "My husband lost his job last month. We're struggling financially and need God's provision and wisdom.",
    requestType: "financial",
    isUrgent: false,
    isAnonymous: false,
    allowSharing: true,
    status: "active",
    submittedAt: new Date("2025-06-28T16:45:00").toISOString(),
    assignedPrayerTeam: "General Prayer",
  },
  {
    firstName: "David",
    lastName: "Thompson",
    email: "dthompson@example.com",
    prayerRequest:
      "Please pray for my teenage son who has been rebellious and making poor choices. We need God's intervention.",
    requestType: "family",
    isUrgent: false,
    isAnonymous: false,
    allowSharing: true,
    status: "answered",
    submittedAt: new Date("2025-06-25T09:20:00").toISOString(),
    answeredDate: new Date("2025-07-03T12:00:00").toISOString(),
    testimony:
      "Praise God! My son came to me last night and apologized. We had our first real conversation in months.",
    assignedPrayerTeam: "Family Ministry",
  },
  {
    firstName: "Maria",
    lastName: "Rodriguez",
    email: "maria.r@example.com",
    prayerRequest:
      "I'm seeking God's will for my career. I have two job opportunities and need wisdom to choose the right path.",
    requestType: "guidance",
    isUrgent: false,
    isAnonymous: false,
    allowSharing: true,
    status: "active",
    submittedAt: new Date("2025-07-02T11:30:00").toISOString(),
    assignedPrayerTeam: "General Prayer",
  },
];

// Sample Newsletter Subscriptions Data
const newsletterSubscriptionsData = [
  {
    email: "john.doe@example.com",
    name: "John Doe",
    subscribedAt: new Date("2025-06-15T08:30:00"),
    isActive: true,
    preferences: {
      weeklyUpdates: true,
      eventNotifications: true,
      prayerRequests: false,
      sermonNotifications: true,
    },
    source: "website",
  },
  {
    email: "mary.smith@example.com",
    name: "Mary Smith",
    subscribedAt: new Date("2025-06-20T14:45:00"),
    isActive: true,
    preferences: {
      weeklyUpdates: true,
      eventNotifications: true,
      prayerRequests: true,
      sermonNotifications: true,
    },
    source: "footer",
  },
  {
    email: "robert.johnson@example.com",
    name: "Robert Johnson",
    subscribedAt: new Date("2025-06-25T10:15:00"),
    isActive: true,
    preferences: {
      weeklyUpdates: false,
      eventNotifications: true,
      prayerRequests: false,
      sermonNotifications: true,
    },
    source: "event",
  },
  {
    email: "susan.brown@example.com",
    name: "Susan Brown",
    subscribedAt: new Date("2025-07-01T16:20:00"),
    isActive: true,
    preferences: {
      weeklyUpdates: true,
      eventNotifications: true,
      prayerRequests: true,
      sermonNotifications: false,
    },
    source: "website",
  },
  {
    email: "james.wilson@example.com",
    name: "James Wilson",
    subscribedAt: new Date("2025-07-03T09:10:00"),
    isActive: false,
    unsubscribedAt: new Date("2025-07-04T12:00:00"),
    preferences: {
      weeklyUpdates: true,
      eventNotifications: false,
      prayerRequests: false,
      sermonNotifications: true,
    },
    source: "footer",
  },
];

// Sample Contact Form Submissions Data
const contactSubmissionsData = [
  {
    firstName: "Michael",
    lastName: "Wilson",
    fullName: "Michael Wilson",
    email: "michael.wilson@example.com",
    phone: "(708) 555-0150",
    subject: "General Inquiry",
    message:
      "Hi, I'm interested in learning more about your church and potentially becoming a member. Could someone contact me to discuss your membership process?",
    status: "new",
    isUrgent: false,
    submittedAt: new Date("2025-07-05T14:30:00"),
  },
  {
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(708) 555-0151",
    subject: "Prayer Request",
    message:
      "Please pray for my family during this difficult time. My father is in the hospital and we would appreciate your prayers for his recovery.",
    status: "read",
    isUrgent: true,
    submittedAt: new Date("2025-07-04T09:15:00"),
  },
  {
    firstName: "David",
    lastName: "Brown",
    fullName: "David Brown",
    email: "david.brown@example.com",
    phone: "",
    subject: "Ministry Interest",
    message:
      "I'm interested in joining the youth ministry team. I have experience working with teenagers and would love to contribute to your youth programs.",
    status: "replied",
    isUrgent: false,
    submittedAt: new Date("2025-07-03T16:45:00"),
  },
  {
    firstName: "Lisa",
    lastName: "Davis",
    fullName: "Lisa Davis",
    email: "lisa.davis@example.com",
    phone: "(708) 555-0152",
    subject: "Event Information",
    message:
      "Could you provide more details about the upcoming Youth Conference? My daughter is interested in attending and I'd like to know about registration and costs.",
    status: "new",
    isUrgent: false,
    submittedAt: new Date("2025-07-02T11:20:00"),
  },
  {
    firstName: "Robert",
    lastName: "Garcia",
    fullName: "Robert Garcia",
    email: "robert.garcia@example.com",
    phone: "(708) 555-0153",
    subject: "Pastoral Care",
    message:
      "My wife and I are going through a difficult period in our marriage and would appreciate pastoral counseling. Could someone from the pastoral team contact us?",
    status: "read",
    isUrgent: true,
    submittedAt: new Date("2025-07-01T08:30:00"),
  },
];

// Sample Ministries Data
const ministriesData = [
  {
    title: "Youth Ministry",
    description: "Empowering the next generation through faith and fellowship.",
    icon: "school",
    targetAge: "13-25",
    meetingTime: "Sundays 6:00 PM",
    leader: "Pastor David Wilson",
    activities: [
      "Bible Study",
      "Games",
      "Community Service",
      "Youth Conference",
    ],
    contact: "youth@hoursofmercy.org",
    isActive: true,
  },
  {
    title: "Women's Fellowship",
    description: "Building strong relationships among women of faith.",
    icon: "group",
    targetAge: "18+",
    meetingTime: "Second Saturday of each month, 9:00 AM",
    leader: "Minister Sarah Brown",
    activities: [
      "Bible Study",
      "Prayer",
      "Community Outreach",
      "Fellowship Breakfast",
    ],
    contact: "women@hoursofmercy.org",
    isActive: true,
  },
  {
    title: "Men's Ministry",
    description: "Growing together as men of God and leaders.",
    icon: "people",
    targetAge: "18+",
    meetingTime: "First Saturday of each month, 7:00 AM",
    leader: "Deacon Michael Davis",
    activities: ["Bible Study", "Prayer", "Mentorship", "Community Service"],
    contact: "men@hoursofmercy.org",
    isActive: true,
  },
  {
    title: "Community Outreach",
    description: "Serving our community with love and compassion.",
    icon: "volunteer_activism",
    targetAge: "All Ages",
    meetingTime: "Ongoing",
    leader: "Pastor Mary Johnson",
    activities: [
      "Food Bank",
      "Homeless Ministry",
      "Prison Outreach",
      "Hospital Visits",
    ],
    contact: "outreach@hoursofmercy.org",
    isActive: true,
  },
  {
    title: "Children's Ministry",
    description: "Teaching children about God's love in age-appropriate ways.",
    icon: "child_care",
    targetAge: "0-12",
    meetingTime: "Sundays during service",
    leader: "Sister Jennifer Williams",
    activities: ["Sunday School", "Children's Church", "VBS", "Family Events"],
    contact: "children@hoursofmercy.org",
    isActive: true,
  },
  {
    title: "Senior Saints",
    description: "Fellowship and spiritual growth for our mature members.",
    icon: "elderly",
    targetAge: "60+",
    meetingTime: "Third Thursday of each month, 2:00 PM",
    leader: "Elder Robert Johnson",
    activities: [
      "Bible Study",
      "Fellowship",
      "Health Ministry",
      "Wisdom Sharing",
    ],
    contact: "seniors@hoursofmercy.org",
    isActive: true,
  },
  {
    title: "Music Ministry",
    description: "Worshiping God through music and song.",
    icon: "music_note",
    targetAge: "All Ages",
    meetingTime: "Thursdays 7:00 PM (Choir), Sundays 9:30 AM (Praise Team)",
    leader: "Minister of Music Lisa Thompson",
    activities: ["Choir", "Praise Team", "Instrumentalists", "Special Events"],
    contact: "music@hoursofmercy.org",
    isActive: true,
  },
];

// Sample Configuration Data
const configurationData = [
  {
    id: "prayer_types",
    data: {
      types: [
        {
          value: "healing",
          label: "Physical Healing",
          description: "Prayers for health and recovery",
        },
        {
          value: "spiritual",
          label: "Spiritual Growth",
          description: "Guidance and spiritual matters",
        },
        {
          value: "family",
          label: "Family & Relationships",
          description: "Marriage, children, and family issues",
        },
        {
          value: "financial",
          label: "Financial Provision",
          description: "Employment, bills, and financial needs",
        },
        {
          value: "guidance",
          label: "Guidance & Decisions",
          description: "Seeking God's direction",
        },
        {
          value: "salvation",
          label: "Salvation",
          description: "For loved ones to know Christ",
        },
        {
          value: "general",
          label: "General Prayer",
          description: "Other prayer needs",
        },
      ],
    },
  },
  {
    id: "giving_options",
    data: {
      options: [
        {
          type: "tithe",
          title: "Tithes",
          description: "Faithful giving of 10% as commanded in Scripture",
          suggested: true,
        },
        {
          type: "offering",
          title: "General Offering",
          description: "Support for church operations and ministry",
          suggested: true,
        },
        {
          type: "missions",
          title: "Missions",
          description: "Supporting missionaries and global outreach",
          suggested: false,
        },
        {
          type: "building",
          title: "Building Fund",
          description: "Church facility improvements and expansion",
          suggested: false,
        },
        {
          type: "youth",
          title: "Youth Ministry",
          description: "Supporting programs for young people",
          suggested: false,
        },
        {
          type: "community",
          title: "Community Outreach",
          description: "Local community service and assistance",
          suggested: false,
        },
      ],
      quickAmounts: [25, 50, 100, 250, 500, 1000],
    },
  },
  {
    id: "giving_amounts",
    data: [25, 50, 100, 250, 500, 1000],
  },
  {
    id: "giving_benefits",
    data: [
      "Support the growth of God's kingdom",
      "Help fund community outreach programs",
      "Maintain and improve church facilities",
      "Support pastoral care and counseling",
      "Fund youth and children's programs",
      "Enable missionary work and evangelism",
    ],
  },
  {
    id: "contact_subjects",
    data: {
      subjects: [
        "General Inquiry",
        "Prayer Request",
        "Pastoral Care",
        "Ministry Information",
        "Event Information",
        "Volunteer Opportunities",
        "Technical Support",
        "Other",
      ],
    },
  },
  {
    id: "sermon_series",
    data: [
      {
        name: "Hours of Grace",
        count: 8,
        description: "Exploring God's mercy and grace in our daily lives",
      },
      {
        name: "Foundations of Faith",
        count: 12,
        description: "Building strong spiritual foundations",
      },
      {
        name: "Living Like Jesus",
        count: 6,
        description: "Practical Christianity in action",
      },
    ],
  },
];

// Sample Church Information Data
const churchInfoData = [
  {
    id: "beliefs",
    data: {
      beliefs: [
        "We believe in the Trinity: Father, Son, and Holy Spirit",
        "We believe in salvation through faith in Jesus Christ alone",
        "We believe in the authority and inspiration of Scripture",
        "We believe in the power of prayer and the gifts of the Spirit",
        "We believe in the importance of fellowship and community",
        "We believe in evangelism and missions",
      ],
    },
  },
  {
    id: "values",
    data: {
      values: [
        {
          title: "Faith",
          description: "Living by faith and trusting in God's promises",
        },
        {
          title: "Love",
          description: "Showing Christ's love to everyone we encounter",
        },
        {
          title: "Unity",
          description: "Coming together as one body in Christ",
        },
        {
          title: "Service",
          description: "Serving God and others with our gifts and talents",
        },
        {
          title: "Growth",
          description: "Continuously growing in our relationship with God",
        },
        {
          title: "Excellence",
          description: "Doing everything with excellence for God's glory",
        },
      ],
    },
  },
  {
    id: "contact_info",
    data: {
      address: "1480 Lincoln Ave, Dolton, Illinois 60419",
      phone: "(708) 555-0124",
      email: "info@hoursofmercy.org",
      website: "www.hoursofmercy.org",
      hours: {
        office: "Monday - Friday: 9:00 AM - 5:00 PM",
        sunday: "Sunday Services: 8:00 AM & 11:00 AM",
        wednesday: "Wednesday Prayer: 7:00 PM",
      },
    },
  },
  {
    id: "service_schedule",
    data: {
      services: [
        {
          name: "Sunday Morning Worship",
          time: "8:00 AM & 11:00 AM",
          description: "Traditional and Contemporary Services",
        },
        {
          name: "Sunday School",
          time: "9:30 AM",
          description: "All ages - various classes available",
        },
        {
          name: "Wednesday Prayer Meeting",
          time: "7:00 PM",
          description: "Community prayer and Bible study",
        },
        {
          name: "Friday Night Prayer",
          time: "7:00 PM",
          description: "Intensive prayer and intercession",
        },
      ],
    },
  },
  {
    id: "prayer_promises",
    data: {
      promises: [
        '"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you." - Matthew 7:7',
        '"The prayer of a righteous person is powerful and effective." - James 5:16',
        '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." - Philippians 4:6',
        '"Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours." - Mark 11:24',
      ],
    },
  },
];

// Function to seed all data
async function seedFirestoreData() {
  console.log("🌱 Starting Firebase data seeding...");

  try {
    // Seed Staff Directory
    console.log("📋 Seeding Staff Directory...");
    for (const staff of staffData) {
      await setDoc(doc(db, "staff", staff.id), {
        ...staff,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Added staff member: ${staff.name}`);
    }

    // Seed Events
    console.log("📅 Seeding Events...");
    for (const event of eventsData) {
      await addDoc(collection(db, "events"), {
        ...event,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Added event: ${event.title}`);
    }

    // Seed Sermons
    console.log("🎤 Seeding Sermons...");
    for (const sermon of sermonsData) {
      await addDoc(collection(db, "sermons"), {
        ...sermon,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Added sermon: ${sermon.title}`);
    }

    // Seed Prayer Requests
    console.log("🙏 Seeding Prayer Requests...");
    for (const request of prayerRequestsData) {
      await addDoc(collection(db, "prayerRequests"), {
        ...request,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Added prayer request from: ${request.firstName}`);
    }

    // Seed Newsletter Subscriptions
    console.log("📧 Seeding Newsletter Subscriptions...");
    for (const subscription of newsletterSubscriptionsData) {
      await addDoc(collection(db, "newsletterSubscriptions"), {
        ...subscription,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Added newsletter subscription: ${subscription.email}`);
    }

    // Seed Contact Form Submissions
    console.log("📞 Seeding Contact Form Submissions...");
    for (const submission of contactSubmissionsData) {
      await addDoc(collection(db, "contactSubmissions"), {
        ...submission,
        submittedAt: serverTimestamp(),
      });
      console.log(`✅ Added contact submission from: ${submission.fullName}`);
    }

    // Seed Ministries
    console.log("⛪ Seeding Ministries...");
    for (const ministry of ministriesData) {
      await setDoc(
        doc(db, "ministries", ministry.title.replace(/ /g, "-").toLowerCase()),
        {
          ...ministry,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }
      );
      console.log(`✅ Added ministry: ${ministry.title}`);
    }

    // Seed Configuration
    console.log("⚙️ Seeding Configuration Data...");
    for (const config of configurationData) {
      await setDoc(doc(db, "configuration", config.id), {
        ...config.data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Added configuration: ${config.id}`);
    }

    // Seed Church Information
    console.log("🏛️ Seeding Church Information...");
    for (const info of churchInfoData) {
      await setDoc(doc(db, "churchInfo", info.id), {
        ...info.data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✅ Added church info: ${info.id}`);
    }

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`📋 Staff Members: ${staffData.length}`);
    console.log(`📅 Events: ${eventsData.length}`);
    console.log(`🎤 Sermons: ${sermonsData.length}`);
    console.log(`🙏 Prayer Requests: ${prayerRequestsData.length}`);
    console.log(
      `📧 Newsletter Subscriptions: ${newsletterSubscriptionsData.length}`
    );
    console.log(
      `📬 Contact Form Submissions: ${contactSubmissionsData.length}`
    );
    console.log(`⛪ Ministries: ${ministriesData.length}`);
    console.log(`⚙️ Configuration Entries: ${configurationData.length}`);
    console.log(`🏛️ Church Information Entries: ${churchInfoData.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Export the seeding function and data
export {
  seedFirestoreData,
  staffData,
  eventsData,
  sermonsData,
  prayerRequestsData,
  newsletterSubscriptionsData,
  contactSubmissionsData,
  ministriesData,
  configurationData,
  churchInfoData,
};

// Run the seeding when this file is executed
seedFirestoreData();
