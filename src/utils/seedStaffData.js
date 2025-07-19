// Seed script for ministry departments and staff data
import { staffService, ministriesService } from "../firebase/firestore";

// Sample staff data for seeding
const sampleStaffData = [
  {
    name: "Peter Olawale Sunday",
    title: "Senior Pastor",
    department: "Leadership",
    email: "pastor.olawale@hoursofmercy.org",
    phone: "(773) 977-9630",
    bio: "Pastor Olawale has been serving Christ Apostolic Church Hours of Mercy for over 15 years. He holds a Master of Divinity from Chicago Theological Seminary and is passionate about teaching God's Word and shepherding the flock.",
    education: [
      "Master of Divinity, Chicago Theological Seminary",
      "Bachelor of Theology, Nigerian Baptist Seminary",
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
    joinDate: "2009",
    active: true,
  },
  {
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
    joinDate: "2012",
    active: true,
  },
  {
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
      "Youth counseling",
      "Event planning",
      "Leadership development",
    ],
    joinDate: "2016",
    active: true,
  },
  {
    name: "Minister Sarah Brown",
    title: "Worship Leader",
    department: "Worship Ministry",
    email: "minister.sarah@hoursofmercy.org",
    phone: "(708) 555-0127",
    bio: "Minister Sarah leads our worship team and choir. She has a passion for leading others into God's presence through music and worship.",
    education: [
      "B.A. Music Ministry, Moody Bible Institute",
      "Certificate in Worship Leadership",
    ],
    experience: [
      "10 years in music ministry",
      "Former choir director",
      "Recording artist",
    ],
    specialties: ["Vocal coaching", "Music arrangement", "Worship planning"],
    joinDate: "2014",
    active: true,
  },
  {
    name: "Brother Robert Davis",
    title: "Church Administrator",
    department: "Administration",
    email: "admin@hoursofmercy.org",
    phone: "(708) 555-0128",
    bio: "Brother Robert manages the administrative operations of our church. He ensures smooth operations and helps coordinate various ministries and events.",
    education: [
      "B.S. Business Administration, University of Illinois",
      "Certificate in Church Administration",
    ],
    experience: [
      "5 years in church administration",
      "Former business manager",
      "Financial oversight",
    ],
    specialties: [
      "Financial management",
      "Event coordination",
      "Operations oversight",
    ],
    joinDate: "2019",
    active: true,
  },
  // Additional staff members for better department representation
  {
    name: "Elder James Mitchell",
    title: "Board Chairman",
    department: "Leadership",
    email: "elder.james@hoursofmercy.org",
    phone: "(708) 555-0129",
    bio: "Elder James serves as the chairman of our church board and provides wisdom and guidance in church governance.",
    experience: [
      "20+ years in church leadership",
      "Business executive",
      "Community leader",
    ],
    specialties: [
      "Strategic planning",
      "Board governance",
      "Financial oversight",
    ],
    joinDate: "2005",
    active: true,
  },
  {
    name: "Sister Grace Williams",
    title: "Children's Ministry Director",
    department: "Youth Ministry",
    email: "children@hoursofmercy.org",
    phone: "(708) 555-0130",
    bio: "Sister Grace oversees our children's ministry and Sunday school programs. She has a heart for nurturing young hearts in the faith.",
    education: [
      "B.A. Elementary Education",
      "Certificate in Children's Ministry",
    ],
    experience: [
      "15 years in children's ministry",
      "Former elementary teacher",
      "Curriculum developer",
    ],
    specialties: [
      "Children's education",
      "Curriculum development",
      "Parent engagement",
    ],
    joinDate: "2010",
    active: true,
  },
];

// Ministry departments data
const ministryDepartmentsData = [
  {
    name: "Leadership",
    description: "Church governance and spiritual oversight",
    responsibilities: [
      "Strategic church direction",
      "Spiritual guidance",
      "Board leadership",
      "Vision casting",
    ],
    color: "primary",
  },
  {
    name: "Pastoral Care",
    description: "Shepherding and caring for congregation members",
    responsibilities: [
      "Counseling services",
      "Hospital visitation",
      "Crisis support",
      "Bereavement care",
    ],
    color: "secondary",
  },
  {
    name: "Youth Ministry",
    description: "Ministering to children, teens, and young adults",
    responsibilities: [
      "Youth programs",
      "Sunday school",
      "Youth camps",
      "Mentorship programs",
    ],
    color: "success",
  },
  {
    name: "Worship Ministry",
    description: "Leading the congregation in worship and praise",
    responsibilities: [
      "Music ministry",
      "Choir direction",
      "Sound system",
      "Worship planning",
    ],
    color: "info",
  },
  {
    name: "Administration",
    description: "Managing church operations and logistics",
    responsibilities: [
      "Financial management",
      "Facility maintenance",
      "Event coordination",
      "Record keeping",
    ],
    color: "warning",
  },
];

// Seeding functions
export const seedMinistryDepartments = async () => {
  try {
    console.log("Seeding ministry departments...");

    for (const department of ministryDepartmentsData) {
      await ministriesService.addMinistry(department);
      console.log(`Added department: ${department.name}`);
    }

    console.log("Ministry departments seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding ministry departments:", error);
    throw error;
  }
};

export const seedStaffData = async () => {
  try {
    console.log("Seeding staff data...");

    for (const staff of sampleStaffData) {
      await staffService.addStaff(staff);
      console.log(`Added staff member: ${staff.name}`);
    }

    console.log("Staff data seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding staff data:", error);
    throw error;
  }
};

export const seedAllData = async () => {
  try {
    await seedMinistryDepartments();
    await seedStaffData();
    console.log("All data seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding data:", error);
    throw error;
  }
};

// Export data for direct use
export { sampleStaffData, ministryDepartmentsData };
