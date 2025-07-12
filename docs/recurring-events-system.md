# Recurring Events System Documentation

## Overview

The recurring events system allows you to create event templates that automatically generate event instances based on recurring patterns. This eliminates the need to manually create every occurrence of repeating events like Sunday worship, prayer meetings, Bible studies, etc.

## How It Works

### 1. Event Templates

Instead of creating individual events, you create **templates** that define:

- Basic event information (title, description, location, etc.)
- Recurring pattern (weekly, monthly, yearly, or custom)
- Start and end dates for the recurrence
- Time and duration

### 2. Dynamic Generation

When users view the calendar or events page:

- The system automatically generates event instances for the requested date range
- These instances are created in real-time based on the templates
- No database storage is needed for individual occurrences

## Supported Recurring Patterns

### Weekly Events

- **Use Case**: Sunday worship, Wednesday prayer, Friday youth meetings
- **Configuration**: Select which days of the week the event occurs
- **Example**: Prayer meeting every Wednesday at 7:00 PM

```javascript
{
  recurringType: "weekly",
  recurringConfig: {
    daysOfWeek: [3] // Wednesday (0 = Sunday, 6 = Saturday)
  }
}
```

### Monthly Events

Two options available:

#### Same Date Each Month

- **Use Case**: First aid training on the 15th of every month
- **Configuration**: Specify the day of the month (1-31)

```javascript
{
  recurringType: "monthly",
  recurringConfig: {
    monthlyType: "date",
    dayOfMonth: 15
  }
}
```

#### Same Weekday Each Month

- **Use Case**: Men's fellowship on the first Saturday, Women's meeting on the third Tuesday
- **Configuration**: Specify day of week and which occurrence in the month

```javascript
{
  recurringType: "monthly",
  recurringConfig: {
    monthlyType: "weekday",
    dayOfWeek: 6, // Saturday
    weekOfMonth: 1 // First Saturday
  }
}
```

### Yearly Events

- **Use Case**: Annual retreat, Christmas service, Easter celebration
- **Configuration**: Specify month and day

```javascript
{
  recurringType: "yearly",
  recurringConfig: {
    month: 8, // September (0-indexed)
    dayOfMonth: 15
  }
}
```

### Custom Intervals

- **Use Case**: Every 2 weeks, every 3 days, etc.
- **Configuration**: Specify interval in days

```javascript
{
  recurringType: "custom",
  recurringConfig: {
    intervalDays: 14 // Every 2 weeks
  }
}
```

## Implementation Guide

### 1. Creating Templates (Admin)

Use the `RecurringEventsAdmin` component to create and manage templates:

```jsx
import RecurringEventsAdmin from "../components/admin/RecurringEventsAdmin";

// In your admin dashboard
<RecurringEventsAdmin />;
```

### 2. Displaying Events (Frontend)

The `EventsPage` automatically includes recurring events:

```jsx
// Events are automatically filtered and include recurring instances
const filteredEvents = (() => {
  let eventsToFilter = [...events, ...recurringEvents];
  // ... filtering logic
})();
```

### 3. Database Seeding

Seed initial templates using the script:

```bash
node scripts/seedRecurringEvents.js
```

## Database Structure

### Recurring Event Templates Collection

```javascript
{
  id: "template-id",
  title: "Sunday Morning Worship",
  description: "Join us for inspiring worship...",
  startTime: "10:00",
  endTime: "12:00",
  location: "Main Sanctuary",
  category: "worship",
  recurringType: "weekly",
  recurringConfig: {
    daysOfWeek: [0] // Sunday
  },
  startDate: "2025-01-01",
  endDate: null, // Ongoing
  isActive: true,
  createdAt: "2025-01-01T00:00:00Z",
  updatedAt: "2025-01-01T00:00:00Z"
}
```

## Advanced Features

### 1. Template Management

- Create, edit, delete, and activate/deactivate templates
- Preview generated events for any month
- Bulk operations for multiple templates

### 2. Event Overrides

For special cases (holidays, cancellations), you can:

- Create one-time events that override recurring events
- Mark recurring instances as cancelled
- Modify specific occurrences without affecting the template

### 3. Category-Based Filtering

Events inherit categories from templates:

- worship, prayer, youth, fellowship, study, outreach, retreat, conference

### 4. Capacity and Registration

Templates support:

- Maximum capacity settings
- Registration requirements
- Contact information for organizers

## Usage Examples

### Example 1: Regular Church Services

```javascript
// Sunday Morning Worship - Every Sunday at 10:00 AM
{
  title: "Sunday Morning Worship",
  recurringType: "weekly",
  recurringConfig: { daysOfWeek: [0] },
  startTime: "10:00",
  endTime: "12:00"
}

// Wednesday Prayer Meeting - Every Wednesday at 7:00 PM
{
  title: "Wednesday Prayer Meeting",
  recurringType: "weekly",
  recurringConfig: { daysOfWeek: [3] },
  startTime: "19:00",
  endTime: "20:00"
}
```

### Example 2: Monthly Meetings

```javascript
// Men's Fellowship - First Saturday of each month
{
  title: "Men's Fellowship Breakfast",
  recurringType: "monthly",
  recurringConfig: {
    monthlyType: "weekday",
    dayOfWeek: 6,
    weekOfMonth: 1
  },
  startTime: "08:00",
  endTime: "10:00"
}
```

### Example 3: Annual Events

```javascript
// Church Retreat - Every September 15th
{
  title: "Annual Church Retreat",
  recurringType: "yearly",
  recurringConfig: {
    month: 8, // September
    dayOfMonth: 15
  },
  startTime: "18:00",
  endTime: "21:00"
}
```

## Benefits

1. **No Manual Entry**: Never manually create recurring events again
2. **Consistency**: All instances follow the same template
3. **Easy Updates**: Change the template to update all future occurrences
4. **Storage Efficient**: Only templates are stored, instances are generated
5. **Flexible Patterns**: Supports complex recurring patterns
6. **Future-Proof**: Automatically generates events far into the future

## Migration from Static Events

To migrate existing static recurring events:

1. Identify patterns in your current events
2. Create templates for each pattern
3. Set appropriate start dates
4. Activate the templates
5. Remove old static events (optional, system handles duplicates)

The system will automatically start generating instances based on your templates, and users will see them alongside any remaining static events.
