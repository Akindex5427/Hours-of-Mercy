import { recurringEvents } from "../data/recurringEvents";

/**
 * Get events for a specific date
 * @param {Date} selectedDate - The date to get events for
 * @param {string} categoryFilter - Category to filter by ('all' for no filter)
 * @param {Array} databaseEvents - Events from database/Firestore
 * @returns {Array} Array of events for the selected date
 */
export const getEventsForDate = (
  selectedDate,
  categoryFilter = "all",
  databaseEvents = []
) => {
  const dayOfWeek = selectedDate.getDay();
  const dateString = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD format

  let events = [];

  // 1. Get recurring events for this day of week
  const recurringEventsForDay = recurringEvents
    .filter((event) => event.dayOfWeek === dayOfWeek)
    .filter(
      (event) => categoryFilter === "all" || event.category === categoryFilter
    )
    .map((event) => ({
      ...event,
      date: dateString,
      isRecurring: true,
      fullDate: selectedDate,
    }));

  // 2. Get database events for this specific date
  const databaseEventsForDay = databaseEvents
    .filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    })
    .filter(
      (event) => categoryFilter === "all" || event.category === categoryFilter
    )
    .map((event) => ({
      ...event,
      isRecurring: false,
      fullDate: selectedDate,
    }));

  // 3. Combine both types of events
  events = [...recurringEventsForDay, ...databaseEventsForDay];

  // 4. Sort by start time
  events.sort((a, b) => {
    const timeA = a.startTime || "00:00";
    const timeB = b.startTime || "00:00";
    return timeA.localeCompare(timeB);
  });

  return events;
};

/**
 * Format time for display
 * @param {string} time24 - Time in 24-hour format (HH:MM)
 * @returns {string} Time in 12-hour format
 */
export const formatTime = (time24) => {
  if (!time24) return "";

  const [hours, minutes] = time24.split(":");
  const hour12 =
    parseInt(hours) === 0
      ? 12
      : parseInt(hours) > 12
      ? parseInt(hours) - 12
      : parseInt(hours);
  const ampm = parseInt(hours) >= 12 ? "PM" : "AM";

  return `${hour12}:${minutes} ${ampm}`;
};

/**
 * Get events for a specific day of week (for preview)
 * @param {number} dayOfWeek - Day of week (0 = Sunday, 1 = Monday, etc.)
 * @param {string} categoryFilter - Category to filter by
 * @returns {Array} Array of recurring events for this day
 */
export const getRecurringEventsForDay = (dayOfWeek, categoryFilter = "all") => {
  return recurringEvents
    .filter((event) => event.dayOfWeek === dayOfWeek)
    .filter(
      (event) => categoryFilter === "all" || event.category === categoryFilter
    );
};

/**
 * Get next occurrence of a specific day
 * @param {number} targetDay - Day of week (0 = Sunday, 1 = Monday, etc.)
 * @returns {Date} Next occurrence of that day
 */
export const getNextOccurrenceOfDay = (targetDay) => {
  const today = new Date();
  const currentDay = today.getDay();
  const daysUntil = (targetDay - currentDay + 7) % 7;
  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + (daysUntil === 0 ? 7 : daysUntil));
  return nextDate;
};
