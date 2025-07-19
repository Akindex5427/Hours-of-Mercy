import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Phone,
  Person,
  Group,
  ManageAccounts,
  FavoriteRounded,
  MusicNote,
  Groups,
  Business,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { staffService } from "../firebase/firestore";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const StaffDirectorySafe = () => {
  console.log("=== StaffDirectorySafe rendering ===");

  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fixed ministry departments structure
  const baseDepartments = [
    {
      name: "Leadership",
      description: "Church governance and spiritual oversight",
      color: "primary",
    },
    {
      name: "Pastoral Care",
      description: "Shepherding and caring for congregation members",
      color: "secondary",
    },
    {
      name: "Youth Ministry",
      description: "Ministering to children, teens, and young adults",
      color: "success",
    },
    {
      name: "Worship Ministry",
      description: "Leading the congregation in worship and praise",
      color: "info",
    },
    {
      name: "Administration",
      description: "Managing church operations and logistics",
      color: "warning",
    },
  ];

  // Load staff data safely without hooks
  useEffect(() => {
    const loadStaffData = async () => {
      try {
        setLoading(true);
        const data = await staffService.getAllStaff();
        setStaffData(data);
      } catch (err) {
        console.log("Staff data not available, using fallback");
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Delay the Firebase call to prevent conflicts with other components
    const timer = setTimeout(loadStaffData, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate member counts from staff data
  const ministryDepartments = baseDepartments.map((dept) => {
    const memberCount = staffData.filter(
      (staff) => staff.department === dept.name
    ).length;
    return {
      ...dept,
      memberCount,
      members: staffData.filter((staff) => staff.department === dept.name),
    };
  });

  // Sample staff for display (use Firebase data if available, fallback to sample)
  const displayStaff =
    staffData.length > 0
      ? staffData
      : [
          {
            id: 1,
            name: "Peter Olawale Sunday",
            title: "Senior Pastor",
            department: "Leadership",
            email: "pastor.olawale@hoursofmercy.org",
            phone: "(773) 977-9630",
            bio: "Pastor Olawale has been serving Christ Apostolic Church Hours of Mercy for over 15 years.",
            image: "/images/staff/pastor-olawale.jpg",
            ministries: ["Leadership", "Preaching"],
          },
          {
            id: 2,
            name: "Sister Grace",
            title: "Youth Minister",
            department: "Youth Ministry",
            email: "grace@hoursofmercy.org",
            phone: "(773) 555-0123",
            bio: "Sister Grace leads our vibrant youth ministry with passion and dedication.",
            image: "/images/staff/sister-grace.jpg",
            ministries: ["Youth Ministry"],
          },
        ];

  const getDepartmentColor = (department) => {
    const colors = {
      Leadership: "primary",
      "Pastoral Care": "secondary",
      "Youth Ministry": "success",
      "Worship Ministry": "info",
      Administration: "warning",
    };
    return colors[department] || "default";
  };

  const getMinistryIcon = (name) => {
    const icons = {
      Leadership: ManageAccounts,
      "Pastoral Care": FavoriteRounded,
      "Youth Ministry": Groups,
      "Worship Ministry": MusicNote,
      Administration: Business,
    };
    const IconComponent = icons[name] || Group;
    return <IconComponent />;
  };

  return (
    <>
      <Helmet>
        <title>Staff Directory - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Meet our dedicated church staff and ministry leaders at Christ Apostolic Church Hours of Mercy."
        />
      </Helmet>

      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          backgroundColor: "#1e3a8a",
          color: "white",
          py: 8,
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Our Leadership Team
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Meet the dedicated servants who shepherd our congregation with
              love, wisdom, and faith
            </Typography>
          </MotionBox>
        </Container>
      </MotionBox>

      {/* Ministry Departments Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <MotionBox
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Typography
            variant="h3"
            gutterBottom
            sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}
          >
            Ministry Departments
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ textAlign: "center", mb: 6, maxWidth: "800px", mx: "auto" }}
          >
            Our church is organized into various ministry departments, each
            serving a unique purpose in building God's kingdom
          </Typography>
        </MotionBox>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {ministryDepartments.map((department, index) => (
            <Grid item xs={12} md={6} lg={4} key={department.name}>
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                sx={{
                  height: "100%",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${department.color}.main`,
                        mb: 2,
                        width: 64,
                        height: 64,
                      }}
                    >
                      {getMinistryIcon(department.name)}
                    </Avatar>
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      {department.name}
                    </Typography>
                    <Chip
                      label={
                        loading
                          ? "Loading..."
                          : `${department.memberCount} member${
                              department.memberCount !== 1 ? "s" : ""
                            }`
                      }
                      color={department.color}
                      size="medium"
                      sx={{ mb: 2 }}
                    />
                  </Box>

                  <Typography variant="body1" color="text.secondary">
                    {department.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Staff Directory Section */}
      <Box sx={{ bgcolor: "grey.50", py: 6 }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{ textAlign: "center", mb: 4, fontWeight: 600 }}
            >
              Our Staff
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ textAlign: "center", mb: 6 }}
            >
              Get to know the individuals who serve our church community
            </Typography>
          </MotionBox>

          {loading && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading staff information...
              </Typography>
            </Box>
          )}

          <Grid container spacing={4}>
            {displayStaff.map((member, index) => (
              <Grid item xs={12} md={6} lg={4} key={member.id}>
                <MotionCard
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={member.image}
                        sx={{ width: 60, height: 60, mr: 2 }}
                      >
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {member.name}
                        </Typography>
                        <Typography variant="subtitle2" color="primary">
                          {member.title}
                        </Typography>
                        <Chip
                          label={member.department}
                          color={getDepartmentColor(member.department)}
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {member.bio}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        startIcon={<Email />}
                        href={`mailto:${member.email}`}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      >
                        Email
                      </Button>
                      {member.phone && (
                        <Button
                          startIcon={<Phone />}
                          href={`tel:${member.phone}`}
                          size="small"
                          sx={{ mb: 1 }}
                        >
                          Call
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default StaffDirectorySafe;
