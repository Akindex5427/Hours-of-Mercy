import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./config";
import dayjs from "dayjs";

const COLLECTION_NAME = "recurring_event_templates";

// Service for managing recurring event templates
export const recurringEventsService = {
  // Get all recurring event templates
  async getTemplates() {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy("title"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting recurring event templates:", error);
      throw error;
    }
  },

  // Add a new recurring event template
  async addTemplate(template) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...template,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding recurring event template:", error);
      throw error;
    }
  },

  // Update a recurring event template
  async updateTemplate(id, updates) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating recurring event template:", error);
      throw error;
    }
  },

  // Delete a recurring event template
  async deleteTemplate(id) {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
      console.error("Error deleting recurring event template:", error);
      throw error;
    }
  },

  // Get active recurring event templates
  async getActiveTemplates() {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where("isActive", "==", true),
        orderBy("title")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error getting active recurring event templates:", error);
      throw error;
    }
  },
};

// Generate event instances from templates for a specific date range
export const generateRecurringEventInstances = (
  templates,
  startDate,
  endDate
) => {
  const instances = [];
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  templates.forEach((template) => {
    if (!template.isActive) return;

    const templateStart = dayjs(template.startDate);
    const templateEnd = template.endDate ? dayjs(template.endDate) : null;

    // Check if template is valid for the date range
    if (templateEnd && templateStart.isAfter(end)) return;
    if (templateEnd && templateEnd.isBefore(start)) return;

    const eventInstances = generateInstancesForTemplate(template, start, end);
    instances.push(...eventInstances);
  });

  return instances;
};

// Generate instances for a single template
const generateInstancesForTemplate = (template, startDate, endDate) => {
  const instances = [];
  let currentDate = dayjs(template.startDate);

  // Ensure we start from the requested range
  if (currentDate.isBefore(startDate)) {
    currentDate = startDate;
    // Adjust to next valid occurrence
    currentDate = getNextOccurrence(template, currentDate);
  }

  while (
    (currentDate && currentDate.isBefore(endDate)) ||
    currentDate.isSame(endDate, "day")
  ) {
    // Check if template end date is reached
    if (template.endDate && currentDate.isAfter(dayjs(template.endDate))) {
      break;
    }

    // Check if this date matches the recurring pattern
    if (matchesRecurringPattern(template, currentDate)) {
      instances.push(createEventInstance(template, currentDate));
    }

    // Get next occurrence
    const nextDate = getNextOccurrence(template, currentDate.add(1, "day"));
    if (
      !nextDate ||
      nextDate.isSame(currentDate) ||
      nextDate.isBefore(currentDate)
    ) {
      break; // Prevent infinite loop
    }
    currentDate = nextDate;
  }

  return instances;
};

// Check if a date matches the recurring pattern
const matchesRecurringPattern = (template, date) => {
  const { recurringType, recurringConfig } = template;

  switch (recurringType) {
    case "daily":
      return true; // Every day

    case "weekly":
      // Check if day of week matches
      return recurringConfig.daysOfWeek.includes(date.day());

    case "monthly":
      if (recurringConfig.monthlyType === "date") {
        // Same date each month (e.g., 15th of every month)
        return date.date() === recurringConfig.dayOfMonth;
      } else if (recurringConfig.monthlyType === "weekday") {
        // Specific weekday of the month (e.g., 2nd Sunday)
        const weekOfMonth = Math.ceil(date.date() / 7);
        return (
          date.day() === recurringConfig.dayOfWeek &&
          weekOfMonth === recurringConfig.weekOfMonth
        );
      }
      return false;

    case "yearly":
      // Same date every year
      return (
        date.month() === recurringConfig.month &&
        date.date() === recurringConfig.dayOfMonth
      );

    case "custom":
      // Custom interval (e.g., every 2 weeks)
      const startDate = dayjs(template.startDate);
      const daysDiff = date.diff(startDate, "day");
      return daysDiff >= 0 && daysDiff % recurringConfig.intervalDays === 0;

    default:
      return false;
  }
};

// Get the next occurrence after a given date
const getNextOccurrence = (template, afterDate) => {
  const { recurringType, recurringConfig } = template;
  let nextDate = afterDate;

  switch (recurringType) {
    case "daily":
      return nextDate;

    case "weekly":
      // Find next matching day of week
      for (let i = 0; i < 7; i++) {
        if (recurringConfig.daysOfWeek.includes(nextDate.day())) {
          return nextDate;
        }
        nextDate = nextDate.add(1, "day");
      }
      return null;

    case "monthly":
      if (recurringConfig.monthlyType === "date") {
        // Next occurrence of the same date
        let targetDate = nextDate.date(recurringConfig.dayOfMonth);
        if (targetDate.isBefore(nextDate)) {
          targetDate = targetDate.add(1, "month");
        }
        return targetDate;
      } else if (recurringConfig.monthlyType === "weekday") {
        // Next occurrence of specific weekday of month
        return findNextWeekdayOfMonth(
          nextDate,
          recurringConfig.dayOfWeek,
          recurringConfig.weekOfMonth
        );
      }
      return null;

    case "yearly":
      let targetDate = nextDate
        .month(recurringConfig.month)
        .date(recurringConfig.dayOfMonth);
      if (targetDate.isBefore(nextDate)) {
        targetDate = targetDate.add(1, "year");
      }
      return targetDate;

    case "custom":
      const startDate = dayjs(template.startDate);
      const daysSinceStart = nextDate.diff(startDate, "day");
      const remainder = daysSinceStart % recurringConfig.intervalDays;
      return remainder === 0
        ? nextDate
        : nextDate.add(recurringConfig.intervalDays - remainder, "day");

    default:
      return null;
  }
};

// Helper function to find next occurrence of specific weekday of month
const findNextWeekdayOfMonth = (startDate, dayOfWeek, weekOfMonth) => {
  let currentMonth = startDate.month();
  let currentYear = startDate.year();

  while (true) {
    const firstDayOfMonth = dayjs()
      .year(currentYear)
      .month(currentMonth)
      .date(1);
    const firstTargetDay = firstDayOfMonth.day(dayOfWeek);

    // Adjust if the first occurrence is before the first day of month
    if (firstTargetDay.isBefore(firstDayOfMonth)) {
      firstTargetDay = firstTargetDay.add(7, "day");
    }

    const targetDate = firstTargetDay.add((weekOfMonth - 1) * 7, "day");

    // Check if target date is still in the same month and after start date
    if (targetDate.month() === currentMonth && targetDate.isAfter(startDate)) {
      return targetDate;
    }

    // Move to next month
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }
};

// Create an event instance from a template for a specific date
const createEventInstance = (template, date) => {
  const startTime = dayjs(template.startTime, "HH:mm");
  const endTime = template.endTime ? dayjs(template.endTime, "HH:mm") : null;

  const eventStart = date
    .hour(startTime.hour())
    .minute(startTime.minute())
    .second(0);

  const eventEnd = endTime
    ? date.hour(endTime.hour()).minute(endTime.minute()).second(0)
    : null;

  return {
    id: `${template.id}-${date.format("YYYY-MM-DD")}`,
    title: template.title,
    description: template.description,
    date: eventStart.toDate(),
    endDate: eventEnd ? eventEnd.toDate() : null,
    time: endTime
      ? `${template.startTime} - ${template.endTime}`
      : template.startTime,
    location: template.location,
    address: template.address,
    category: template.category,
    isRecurring: true,
    recurringType: template.recurringType,
    recurringTemplateId: template.id,
    organizer: template.organizer,
    capacity: template.capacity,
    registrationRequired: template.registrationRequired || false,
    imageUrl: template.imageUrl || "/api/placeholder/400/250",
    tags: template.tags || [],
    status: "published",
    isGenerated: true, // Flag to identify generated instances
  };
};

// Default recurring event templates for seeding
export const defaultRecurringTemplates = [
  {
    title: "Sunday Morning Worship",
    description:
      "Join us for inspiring worship, powerful preaching, and fellowship with our church family.",
    startTime: "10:00",
    endTime: "12:00",
    location: "Main Sanctuary",
    address: "14801 Lincoln Ave, Dolton, IL",
    category: "worship",
    organizer: "Pastor Olawale Sunday",
    capacity: 300,
    registrationRequired: false,
    recurringType: "weekly",
    recurringConfig: {
      daysOfWeek: [0], // Sunday
    },
    startDate: "2025-01-01",
    endDate: null, // Ongoing
    isActive: true,
    imageUrl: "/api/placeholder/400/250",
    tags: ["worship", "sermon", "fellowship"],
  },
  {
    title: "Wednesday Prayer Meeting",
    description:
      "Come together for a time of prayer, worship, and Bible study.",
    startTime: "18:00",
    endTime: "20:00",
    location: "Fellowship Hall",
    address: "14801 Lincoln Ave, Dolton, IL",
    category: "prayer",
    organizer: "Pastor Olawale Sunday",
    capacity: 100,
    registrationRequired: false,
    recurringType: "weekly",
    recurringConfig: {
      daysOfWeek: [3], // Wednesday
    },
    startDate: "2025-01-01",
    endDate: null,
    isActive: true,
    imageUrl: "/api/placeholder/400/250",
    tags: ["prayer", "bible-study", "fellowship"],
  },
  {
    title: "First Friday of the Month Night Vigil",
    description: "Night of worship, prayer, and spiritual renewal.",
    startTime: "22:00",
    endTime: "24:00",
    location: "Church Auditorium",
    address: "14801 Lincoln Ave, Dolton, IL",
    category: "youth",
    organizer: "Pastor Olawale Sunday",
    capacity: 50,
    registrationRequired: false,
    recurringType: "monthly",
    recurringConfig: {
      daysOfWeek: [5], // Friday
    },
    startDate: "2025-01-01",
    endDate: null,
    isActive: true,
    imageUrl: "/api/placeholder/400/250",
    tags: ["prayer", "worship", "fellowship"],
  },
  {
    title: "Friday Night Vigil",
    description: "Friday night worship, prayer, and spiritual renewal.",
    startTime: "22:00",
    endTime: "24:00",
    location: "Fellowship Hall",
    address: "14801 Lincoln Ave, Dolton, IL",
    category: "fellowship",
    organizer: "Pastor Olawale Sunday",
    capacity: 75,
    registrationRequired: true,
    recurringType: "weekly",
    recurringConfig: {
      monthlyType: "weekday",
      dayOfWeek: 5, // Friday
      weekOfMonth: [1, 2, 3, 4], // Every Friday
    },
    startDate: "2025-01-01",
    endDate: null,
    isActive: true,
    imageUrl: "/api/placeholder/400/250",
    tags: ["prayer", "worship", "fellowship"],
  },
];
