import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  PlayArrow,
  Event,
  People,
  FavoriteOutlined,
  Church,
  Group,
  School,
  VolunteerActivism,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  useUpcomingEvents,
  useSermons,
  useMinistries,
} from "../hooks/useFirestore";
import HOMImage from "../assets/HOM2.jpg";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const HomePage = () => {
  // Firebase hooks for real-time data
  const {
    events: firebaseEvents,
    loading: eventsLoading,
    error: eventsError,
  } = useUpcomingEvents();
  const {
    sermons: firebaseSermons,
    loading: sermonsLoading,
    error: sermonsError,
  } = useSermons(3);

  // Fallback static data for when Firebase is loading or if no data exists
  const fallbackEvents = [
    {
      title: "Sunday Worship Service",
      date: "Every Sunday",
      time: "8:00 AM to 11:00 AM",
      description: "Join us for uplifting worship and powerful messages.",
    },
    {
      title: "Wednesday Prayer Meeting",
      date: "Every Wednesday",
      time: "6:00 PM - 8:00 PM",
      description: "Come together in prayer and fellowship.",
    },
    // {
    //   title: "Youth Conference 2025",
    //   date: "July 15-17, 2025",
    //   time: "All Day",
    //   description: "A special conference for our young people.",
    // },
  ];

  // Use Firebase data if available, otherwise use fallback data
  const upcomingEvents =
    firebaseEvents?.length > 0 ? firebaseEvents : fallbackEvents;

  const {
    ministries: firebaseMinistries,
    loading: ministriesLoading,
    error: ministriesError,
  } = useMinistries();

  // Fallback ministries data
  const fallbackMinistries = [
    {
      title: "Youth Ministry",
      description:
        "Empowering the next generation through faith and fellowship.",
      icon: "school",
    },
    {
      title: "Women's Fellowship",
      description: "Building strong relationships among women of faith.",
      icon: "group",
    },
    {
      title: "Men's Ministry",
      description: "Growing together as men of God and leaders.",
      icon: "people",
    },
    {
      title: "Community Outreach",
      description: "Serving our community with love and compassion.",
      icon: "volunteer_activism",
    },
  ];

  const ministries =
    firebaseMinistries?.length > 0 ? firebaseMinistries : fallbackMinistries;

  // Helper function to get icon component from string
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case "school":
        return <School />;
      case "group":
        return <Group />;
      case "people":
        return <People />;
      case "volunteer_activism":
        return <VolunteerActivism />;
      case "child_care":
        return <School />; // Fallback for children
      case "elderly":
        return <People />; // Fallback for seniors
      case "music_note":
        return <People />; // Fallback for music
      default:
        return <Church />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Christ Apostolic Hours of Mercy - Welcome Home</title>
        <meta
          name="description"
          content="Welcome to Christ Apostolic Hours of Mercy in Dolton, Illinois. Join our loving community for worship, fellowship, and spiritual growth."
        />
        <meta
          name="keywords"
          content="church, Christ Apostolic, Dolton Illinois, worship, Christian community, prayer, sermons"
        />
      </Helmet>

      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          position: "relative",
          minHeight: "100vh", // Use full viewport height
          display: "flex",
          alignItems: "center",
          backgroundColor: "#1e3a8a",
          color: "white",
          overflow: "hidden",
          pt: { xs: 10, md: 12 }, // Top padding to account for fixed header
          pb: { xs: 6, md: 8 }, // Adequate bottom padding
          mt: { xs: -8, md: -8 }, // Negative margin to pull up under header
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${HOMImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.4,
            transition: "all 0.8s ease-in-out",
            zIndex: 0,
          },
          "&:hover::before": {
            opacity: 0.6,
            transform: "scale(1.05)",
          },
        }}
      >
        {/* Overlay for better text readability */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(37, 83, 42, 0.4) 0%, rgba(26, 58, 29, 0.3) 100%)",
            zIndex: 1,
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 2,
            py: { xs: 4, md: 6 },
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Grid
            container
            spacing={4}
            alignItems="stretch"
            sx={{ width: "100%" }}
          >
            <Grid item xs={12} md={8}>
              <MotionBox
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: {
                      xs: "2.2rem",
                      sm: "2.8rem",
                      md: "3.5rem",
                      lg: "4rem",
                    },
                    fontWeight: 700,
                    mb: { xs: 2, md: 3 },
                    color: "secondary.main",
                    lineHeight: 1.1,
                  }}
                >
                  Welcome to Christ Apostolic
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.3rem", md: "1.5rem" },
                    mb: { xs: 3, md: 4 },
                    opacity: 0.9,
                    fontWeight: 500,
                  }}
                >
                  Hours of Mercy - Where Faith Meets Fellowship
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                    mb: { xs: 4, md: 5 },
                    opacity: 0.85,
                    lineHeight: 1.6,
                    maxWidth: { md: "85%" },
                  }}
                >
                  Join our loving community at 1480 Lincoln Ave, Dolton,
                  Illinois. Experience God's love, grow in faith, and make
                  lasting friendships.
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: { xs: 2, sm: 3 },
                    flexWrap: "wrap",
                    "& > *": {
                      minWidth: { xs: "auto", sm: "180px" },
                    },
                  }}
                >
                  <Button
                    component={Link}
                    to="/events"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<Event />}
                    sx={{
                      fontSize: "1.1rem",
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      fontWeight: 600,
                      boxShadow: 3,
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Visit Us This Sunday
                  </Button>
                  <Button
                    component={Link}
                    to="/sermons"
                    variant="outlined"
                    color="inherit"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      fontSize: "1.1rem",
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      fontWeight: 600,
                      borderColor: "rgba(255,255,255,0.6)",
                      borderWidth: 2,
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.15)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Watch Sermons
                  </Button>
                </Box>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  height: "100%",
                  minHeight: { xs: "auto", md: "400px" },
                }}
              >
                <Paper
                  elevation={12}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                    bgcolor: "rgba(255,255,255,0.97)",
                    color: "text.primary",
                    borderRadius: 4,
                    width: "100%",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: { xs: "280px", md: "320px" },
                  }}
                >
                  <Box>
                    <Church
                      sx={{
                        fontSize: { xs: 40, md: 48 },
                        color: "primary.main",
                        mb: 2,
                      }}
                    />
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        color: "primary.main",
                        fontSize: { xs: "1.3rem", md: "1.5rem" },
                      }}
                    >
                      Join Us for Worship
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        mb: 2,
                        fontSize: { xs: "1rem", md: "1.1rem" },
                        lineHeight: 1.6,
                      }}
                    >
                      <strong>Sundays:</strong>
                      <br />
                      8:00 AM & 11:00 AM
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        mb: 3,
                        color: "text.secondary",
                        fontSize: { xs: "0.9rem", md: "1rem" },
                        lineHeight: 1.5,
                      }}
                    >
                      Experience the power of worship and the warmth of our
                      community.
                    </Typography>
                  </Box>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    sx={{
                      py: { xs: 1.5, md: 2 },
                      fontSize: { xs: "1rem", md: "1.1rem" },
                      fontWeight: 700,
                      borderRadius: 2,
                      boxShadow: 3,
                      "&:hover": {
                        boxShadow: 6,
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Get Directions
                  </Button>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </MotionBox>

      {/* Mission Statement */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ textAlign: "center", mb: 6 }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Our Mission
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                color: "text.secondary",
                lineHeight: 1.6,
              }}
            >
              To spread the Gospel of Jesus Christ, nurture spiritual growth,
              and serve our community with love, compassion, and unwavering
              faith.
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                sx={{ height: "100%", textAlign: "center" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <FavoriteOutlined
                    sx={{ fontSize: 60, color: "secondary.main", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Love
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We believe in showing God's love to everyone through our
                    actions, words, and service to the community.
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                viewport={{ once: true }}
                sx={{ height: "100%", textAlign: "center" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Church
                    sx={{ fontSize: 60, color: "secondary.main", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Faith
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Our foundation is built on unwavering faith in Jesus Christ
                    and the teachings of the Bible.
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                viewport={{ once: true }}
                sx={{ height: "100%", textAlign: "center" }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Group
                    sx={{ fontSize: 60, color: "secondary.main", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Community
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We foster a welcoming environment where everyone can grow
                    spiritually and build meaningful relationships.
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Upcoming Events */}
      <Box sx={{ py: 8, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ textAlign: "center", mb: 6 }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Upcoming Events
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Join us for these special times of worship and fellowship
            </Typography>

            {/* Firebase Connection Status */}
            {eventsLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Loading events from database...
                </Typography>
              </Box>
            )}

            {eventsError && (
              <Alert severity="info" sx={{ mb: 2, maxWidth: 600, mx: "auto" }}>
                Using sample data. Connect to Firebase to see live events.
              </Alert>
            )}
          </MotionBox>

          <Grid container spacing={3}>
            {upcomingEvents.map((event, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -10,
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  sx={{
                    height: "100%",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      boxShadow: "0 12px 40px rgba(44, 85, 48, 0.2)",
                      "& .event-title": {
                        color: "secondary.main",
                      },
                    },
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      className="event-title"
                      sx={{
                        fontWeight: 600,
                        transition: "color 0.3s ease-in-out",
                      }}
                    >
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="secondary.main"
                      sx={{ mb: 1 }}
                    >
                      {event.date} • {event.time}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              component={Link}
              to="/events"
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(44, 85, 48, 0.3)",
                },
              }}
            >
              View All Events
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Ministries Preview */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ textAlign: "center", mb: 6 }}
          >
            <Typography
              variant="h2"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Our Ministries
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Discover ways to grow and serve in our community
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {ministries.map((ministry, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionBox
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  sx={{ textAlign: "center" }}
                >
                  <IconButton
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      mb: 2,
                      p: 2,
                      fontSize: "2rem",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        bgcolor: "secondary.main",
                        transform: "translateY(-5px) scale(1.1)",
                        boxShadow: "0 8px 25px rgba(212, 175, 55, 0.4)",
                      },
                    }}
                  >
                    {getIconComponent(ministry.icon)}
                  </IconButton>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {ministry.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ministry.description}
                  </Typography>
                </MotionBox>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              component={Link}
              to="/ministries"
              variant="outlined"
              color="primary"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderWidth: 2,
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 25px rgba(44, 85, 48, 0.2)",
                  bgcolor: "primary.main",
                  color: "white",
                },
              }}
            >
              Explore All Ministries
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          py: 8,
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
              Ready to Take the Next Step?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Whether you're new to faith or looking for a church home, we'd
              love to welcome you into our family.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                component={Link}
                to="/contact"
                variant="contained"
                color="secondary"
                size="large"
              >
                Plan Your Visit
              </Button>
              <Button
                component={Link}
                to="/prayer-request"
                variant="outlined"
                color="inherit"
                size="large"
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Submit Prayer Request
              </Button>
            </Box>
          </MotionBox>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
