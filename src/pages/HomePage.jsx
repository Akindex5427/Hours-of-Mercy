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

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const HomePage = () => {
  const upcomingEvents = [
    {
      title: "Sunday Worship Service",
      date: "Every Sunday",
      time: "8:00 AM & 11:00 AM",
      description: "Join us for uplifting worship and powerful messages.",
    },
    {
      title: "Wednesday Prayer Meeting",
      date: "Every Wednesday",
      time: "7:00 PM",
      description: "Come together in prayer and fellowship.",
    },
    {
      title: "Youth Conference 2025",
      date: "July 15-17, 2025",
      time: "All Day",
      description: "A special conference for our young people.",
    },
  ];

  const ministries = [
    {
      title: "Youth Ministry",
      description:
        "Empowering the next generation through faith and fellowship.",
      icon: <School />,
    },
    {
      title: "Women's Fellowship",
      description: "Building strong relationships among women of faith.",
      icon: <Group />,
    },
    {
      title: "Men's Ministry",
      description: "Growing together as men of God and leaders.",
      icon: <People />,
    },
    {
      title: "Community Outreach",
      description: "Serving our community with love and compassion.",
      icon: <VolunteerActivism />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Christ Apostolic Church Hours of Mercy - Welcome Home</title>
        <meta
          name="description"
          content="Welcome to Christ Apostolic Church Hours of Mercy in Dolton, Illinois. Join our loving community for worship, fellowship, and spiritual growth."
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
          height: { xs: "70vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          background: "linear-gradient(135deg, #2c5530 0%, #1a3a1d 100%)",
          color: "white",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/api/placeholder/1920/1080")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <MotionBox
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                    fontWeight: 700,
                    mb: 2,
                    color: "secondary.main",
                  }}
                >
                  Welcome to Hours of Mercy
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    mb: 3,
                    opacity: 0.9,
                  }}
                >
                  Christ Apostolic Church - Where Faith Meets Fellowship
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    mb: 4,
                    opacity: 0.8,
                    lineHeight: 1.6,
                  }}
                >
                  Join our loving community at 1480 Lincoln Ave, Dolton,
                  Illinois. Experience God's love, grow in faith, and make
                  lasting friendships.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    component={Link}
                    to="/events"
                    variant="contained"
                    color="secondary"
                    size="large"
                    startIcon={<Event />}
                    sx={{ fontSize: "1.1rem", px: 3, py: 1.5 }}
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
                      px: 3,
                      py: 1.5,
                      borderColor: "rgba(255,255,255,0.5)",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
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
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: "rgba(255,255,255,0.95)",
                    color: "text.primary",
                    borderRadius: 3,
                  }}
                >
                  <Church sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Join Us for Worship
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Sundays:</strong>
                    <br />
                    8:00 AM & 11:00 AM
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3 }}>
                    Experience the power of worship and the warmth of our
                    community.
                  </Typography>
                  <Button
                    component={Link}
                    to="/contact"
                    variant="contained"
                    color="primary"
                    fullWidth
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
          </MotionBox>

          <Grid container spacing={3}>
            {upcomingEvents.map((event, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
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
                      "&:hover": {
                        bgcolor: "primary.dark",
                      },
                    }}
                  >
                    {ministry.icon}
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
