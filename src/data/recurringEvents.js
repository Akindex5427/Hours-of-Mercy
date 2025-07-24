// Static recurring events that happen weekly
export const recurringEvents = [
  {
    id: "sunday-worship",
    title: "Sunday Worship Service",
    category: "worship",
    dayOfWeek: 0, // Sunday = 0, Monday = 1, etc.
    startTime: "10:00",
    endTime: "12:00",
    description:
      "Join us for our main worship service with praise, worship, and the Word of God.",
    location: "Main Sanctuary",
    recurring: true,
    recurringType: "weekly",
  },
  {
    id: "sunday-school",
    title: "Sunday School",
    category: "education",
    dayOfWeek: 0, // Sunday
    startTime: "08:00",
    endTime: "09:30",
    description: "Bible study and fellowship for all ages.",
    location: "Fellowship Hall",
    recurring: true,
    recurringType: "weekly",
  },
  {
    id: "wednesday-prayer",
    title: "Hours of Mercy Prayer Meeting",
    category: "prayer",
    dayOfWeek: 3, // Wednesday
    startTime: "18:00",
    endTime: "20:00",
    description:
      "Come together for prayer, intercession, and seeking God's face.",
    location: "Prayer Room",
    recurring: true,
    recurringType: "weekly",
  },
  {
    id: "friday-vigil",
    title: "Friday Night Vigil",
    category: "prayer",
    dayOfWeek: 5, // Friday
    startTime: "22:00",
    endTime: "00:00",
    description: "Late night prayer and worship vigil.",
    location: "Main Sanctuary",
    recurring: true,
    recurringType: "weekly",
  },
];

// Event categories for filtering
export const eventCategories = [
  { value: "all", label: "All Events", color: "#1e3a8a" },
  { value: "worship", label: "Worship Services", color: "#059669" },
  { value: "prayer", label: "Prayer Meetings", color: "#dc2626" },
  { value: "education", label: "Bible Study", color: "#7c3aed" },
  { value: "youth", label: "Youth Ministry", color: "#ea580c" },
  { value: "special", label: "Special Events", color: "#0891b2" },
  { value: "ministry", label: "Ministry Events", color: "#be123c" },
];
