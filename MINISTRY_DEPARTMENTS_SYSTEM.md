# Ministry Departments Dynamic Member Count System

## Overview

The Staff Directory page has been enhanced with a dynamic ministry department system that seamlessly integrates with Firebase to display real-time member counts for each department.

## Features

### 🏛️ Predefined Ministry Departments

The system includes 5 core ministry departments:

1. **Leadership** - Church governance and spiritual oversight
2. **Pastoral Care** - Shepherding and caring for congregation members
3. **Youth Ministry** - Ministering to children, teens, and young adults
4. **Worship Ministry** - Leading the congregation in worship and praise
5. **Administration** - Managing church operations and logistics

### 📊 Dynamic Member Counting

- Member counts are automatically calculated from the staff database
- Real-time updates when staff members are added/removed
- Fallback to static data when database is unavailable

### 🔧 Database Integration

- **Firebase Firestore** integration for staff and ministry data
- **useMinistryDepartments** hook for accessing department data
- **useStaff** hook for staff member data
- Automatic error handling and loading states

## Implementation Details

### New React Hooks

#### `useMinistryDepartments()`

```javascript
const {
  departments, // Array of departments with member counts
  loading, // Loading state
  error, // Error state
  seedDepartments, // Function to initialize departments in DB
  predefinedDepartments, // Static department structure
} = useMinistryDepartments();
```

#### Enhanced `useStaff()`

```javascript
const {
  staff, // Array of staff members from Firebase
  loading, // Loading state
  error, // Error state
} = useStaff();
```

### Data Structure

#### Ministry Department Object

```javascript
{
  name: "Leadership",
  description: "Church governance and spiritual oversight",
  responsibilities: [
    "Strategic church direction",
    "Spiritual guidance",
    "Board leadership",
    "Vision casting"
  ],
  color: "primary",
  memberCount: 2,        // Dynamically calculated
  members: [...]         // Array of staff in this department
}
```

#### Staff Member Object

```javascript
{
  id: "staff_id",
  name: "Pastor John Doe",
  title: "Senior Pastor",
  department: "Leadership",  // Links to ministry department
  email: "pastor@church.org",
  phone: "(555) 123-4567",
  bio: "Pastor biography...",
  education: [...],
  experience: [...],
  specialties: [...],
  joinDate: "2020",
  active: true
}
```

## Database Collections

### `staff` Collection

Stores individual staff member records with department assignments.

### `ministries` Collection

Stores ministry department definitions and metadata.

## Usage

### Basic Implementation

```jsx
import { useStaff, useMinistryDepartments } from "../hooks/useFirestore";

const MyComponent = () => {
  const { staff, loading: staffLoading } = useStaff();
  const { departments, loading: deptLoading } = useMinistryDepartments();

  if (staffLoading || deptLoading) return <Loading />;

  return (
    <div>
      {departments.map((dept) => (
        <DepartmentCard
          key={dept.name}
          department={dept}
          memberCount={dept.memberCount}
        />
      ))}
    </div>
  );
};
```

### Seeding Data

```jsx
import { seedAllData } from "../utils/seedStaffData";

// Initialize database with sample data
await seedAllData();
```

## Features

### ✅ What's Working

- **Dynamic member counting** from Firebase staff data
- **Graceful fallbacks** when database is unavailable
- **Real-time updates** via Firebase listeners
- **Professional UI** with Material-UI components
- **Loading states** and error handling
- **Sample data seeding** utilities
- **Admin tools** for database initialization

### 🚀 Benefits

1. **Scalable**: Easily add new departments or staff members
2. **Real-time**: Member counts update automatically
3. **Robust**: Works with or without database connection
4. **Professional**: Modern UI with smooth animations
5. **Maintainable**: Clean separation of concerns
6. **Flexible**: Easy to extend with additional features

## Admin Tools

### StaffDataSeeder Component

Located at `/src/components/admin/StaffDataSeeder.jsx`

Provides admin interface to:

- Seed ministry departments
- Seed sample staff data
- Initialize complete database structure

### Seeding Utilities

Located at `/src/utils/seedStaffData.js`

Functions available:

- `seedMinistryDepartments()` - Creates 5 core departments
- `seedStaffData()` - Creates 7 sample staff members
- `seedAllData()` - Seeds both departments and staff

## File Structure

```
src/
├── components/
│   └── admin/
│       └── StaffDataSeeder.jsx       # Admin seeding interface
├── hooks/
│   └── useFirestore.js               # Enhanced with ministry hooks
├── pages/
│   └── StaffDirectory.jsx            # Enhanced staff directory
├── utils/
│   └── seedStaffData.js              # Database seeding utilities
└── firebase/
    └── firestore.js                  # Firebase service functions
```

## Testing

1. **With Database**: Member counts pull from live Firebase data
2. **Without Database**: Fallback to static sample data
3. **Error Handling**: Graceful degradation with user feedback
4. **Loading States**: Professional loading indicators

## Future Enhancements

- **Department filtering** on staff directory
- **Staff search** by department
- **Department detail pages** with member lists
- **Role-based permissions** for editing
- **Member photo uploads** and management
- **Department analytics** and reporting

This implementation provides a robust, scalable foundation for managing church staff and ministry departments with real-time data integration.
