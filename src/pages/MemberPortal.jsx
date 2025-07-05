import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Login,
  PersonAdd,
  Book,
  Event,
  Group,
  Announcement,
  Download,
  Security,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const MemberPortal = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const memberResources = [
    {
      title: "Church Directory",
      description: "Access contact information for church members",
      icon: <Group />,
      action: "View Directory",
    },
    {
      title: "Sermon Notes",
      description: "Download sermon notes and study guides",
      icon: <Book />,
      action: "Download Notes",
    },
    {
      title: "Event Calendar",
      description: "View and register for upcoming events",
      icon: <Event />,
      action: "View Calendar",
    },
    {
      title: "Giving History",
      description: "View your giving history and statements",
      icon: <Download />,
      action: "View History",
    },
  ];

  const announcements = [
    {
      title: "Youth Conference Registration Open",
      date: "2025-07-01",
      content:
        "Registration is now open for our annual Youth Conference. Don't miss this amazing opportunity!",
    },
    {
      title: "New Member Class Starting",
      date: "2025-06-28",
      content:
        "Join us for our next New Member Class beginning Sunday, July 13th after service.",
    },
    {
      title: "Community Outreach Day",
      date: "2025-06-25",
      content:
        "Join us for Community Outreach Day on July 19th. We'll be serving our community with love.",
    },
  ];

  const upcomingEvents = [
    {
      title: "Sunday Worship Service",
      date: "2025-07-06",
      time: "8:00 AM & 11:00 AM",
    },
    {
      title: "Wednesday Prayer Meeting",
      date: "2025-07-09",
      time: "7:00 PM",
    },
    {
      title: "Youth Conference",
      date: "2025-07-15",
      time: "9:00 AM - 6:00 PM",
    },
  ];

  const handleLogin = (data) => {
    // TODO: Implement actual login logic
    console.log("Login attempt:", data);
    setIsLoggedIn(true);
  };

  const handleRegister = (data) => {
    // TODO: Implement actual registration logic
    console.log("Registration attempt:", data);
    setIsLoggedIn(true);
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setShowLoginForm(newValue === 0);
  };

  if (isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>Member Portal - Christ Apostolic Church Hours of Mercy</title>
          <meta
            name="description"
            content="Access member resources, announcements, and church information through our secure member portal."
          />
        </Helmet>

        {/* Header */}
        <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Welcome Back, Member!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Access your church resources and stay connected with our community
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* Quick Actions */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                Member Resources
              </Typography>
              <Grid container spacing={3}>
                {memberResources.map((resource, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <MotionCard
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          transition: "transform 0.3s ease",
                        },
                      }}
                    >
                      <CardContent>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Box
                            sx={{
                              p: 1,
                              borderRadius: "50%",
                              bgcolor: "primary.light",
                              color: "white",
                              mr: 2,
                            }}
                          >
                            {resource.icon}
                          </Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {resource.title}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {resource.description}
                        </Typography>
                        <Button variant="outlined" color="primary">
                          {resource.action}
                        </Button>
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>

              {/* Announcements */}
              <Box sx={{ mt: 6 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Church Announcements
                </Typography>
                {announcements.map((announcement, index) => (
                  <MotionCard
                    key={index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: (index + 4) * 0.1, duration: 0.6 }}
                    sx={{ mb: 2 }}
                  >
                    <CardContent>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Announcement sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {announcement.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {new Date(announcement.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body1">
                        {announcement.content}
                      </Typography>
                    </CardContent>
                  </MotionCard>
                ))}
              </Box>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Upcoming Events */}
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                sx={{ mb: 3 }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Upcoming Events
                  </Typography>
                  <List>
                    {upcomingEvents.map((event, index) => (
                      <React.Fragment key={index}>
                        <ListItem sx={{ px: 0 }}>
                          <ListItemIcon>
                            <Event sx={{ color: "primary.main" }} />
                          </ListItemIcon>
                          <ListItemText
                            primary={event.title}
                            secondary={`${new Date(
                              event.date
                            ).toLocaleDateString()} • ${event.time}`}
                          />
                        </ListItem>
                        {index < upcomingEvents.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>

              {/* Quick Links */}
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Quick Links
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Button variant="outlined" fullWidth>
                      Update Profile
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Change Password
                    </Button>
                    <Button variant="outlined" fullWidth>
                      Contact Office
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setIsLoggedIn(false)}
                    >
                      Logout
                    </Button>
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Member Portal - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Login to access member resources and stay connected with our church community."
        />
      </Helmet>

      {/* Hero Section */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 8 }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Member Portal
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Access church resources and stay connected with our community
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="sm" sx={{ py: 6 }}>
        <MotionCard
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <CardContent sx={{ p: 4 }}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mb: 4 }}
            >
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>

            {showLoginForm ? (
              <Box component="form" onSubmit={handleSubmit(handleLogin)}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Member Login
                </Typography>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      type="email"
                      fullWidth
                      sx={{ mb: 3 }}
                      required
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type="password"
                      fullWidth
                      sx={{ mb: 3 }}
                      required
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<Login />}
                  sx={{ mb: 2 }}
                >
                  Login
                </Button>

                <Typography variant="body2" sx={{ textAlign: "center" }}>
                  <Button size="small">Forgot Password?</Button>
                </Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit(handleRegister)}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Member Registration
                </Typography>

                <Alert severity="info" sx={{ mb: 3 }}>
                  Registration is for church members only. Please contact the
                  church office if you need assistance or are not yet a member.
                </Alert>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="First Name"
                          fullWidth
                          required
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Last Name"
                          fullWidth
                          required
                        />
                      )}
                    />
                  </Grid>
                </Grid>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Email Address"
                      type="email"
                      fullWidth
                      sx={{ my: 2 }}
                      required
                    />
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Phone Number"
                      fullWidth
                      sx={{ mb: 2 }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type="password"
                      fullWidth
                      sx={{ mb: 3 }}
                      required
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  startIcon={<PersonAdd />}
                  sx={{ mb: 2 }}
                >
                  Register
                </Button>

                <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Security sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Privacy & Security
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Your information is secure and will only be used for church
                    communication and member services.
                  </Typography>
                </Paper>
              </Box>
            )}
          </CardContent>
        </MotionCard>

        {/* Member Benefits */}
        <Box sx={{ mt: 6 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 600, textAlign: "center", mb: 3 }}
          >
            Member Portal Benefits
          </Typography>
          <Grid container spacing={2}>
            {memberResources.map((resource, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Box sx={{ color: "primary.main", mb: 1 }}>
                    {resource.icon}
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {resource.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {resource.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default MemberPortal;
