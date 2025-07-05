import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Chip,
} from "@mui/material";
import {
  School,
  Group,
  People,
  VolunteerActivism,
  MusicNote,
  Restaurant,
  MenuBook,
  EmojiEvents,
  Schedule,
  CheckCircle,
  Person,
  LocationOn,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const MinistriesPage = () => {
  const ministries = [
    {
      id: 1,
      title: "Youth Ministry",
      description:
        "Empowering the next generation through faith, fellowship, and fun activities designed to build character and spiritual growth.",
      icon: <School />,
      image: "/api/placeholder/400/250",
      leader: "Pastor David Wilson",
      meetingTime: "Sundays 6:00 PM",
      location: "Youth Center",
      ageGroup: "13-18 years",
      activities: [
        "Weekly youth services",
        "Bible study groups",
        "Summer camps and retreats",
        "Community service projects",
        "Sports and recreation",
        "Leadership development",
      ],
      color: "success",
    },
    {
      id: 2,
      title: "Women's Fellowship",
      description:
        "Building strong relationships among women of faith through Bible study, prayer, and mutual support.",
      icon: <Group />,
      image: "/api/placeholder/400/250",
      leader: "Sister Janet Williams",
      meetingTime: "Saturdays 10:00 AM",
      location: "Fellowship Hall",
      ageGroup: "All adult women",
      activities: [
        "Monthly fellowship breakfast",
        "Bible study and devotions",
        "Prayer circles",
        "Community outreach",
        "Mentorship programs",
        "Special events and retreats",
      ],
      color: "info",
    },
    {
      id: 3,
      title: "Men's Ministry",
      description:
        "Growing together as men of God, developing leadership skills, and building brotherhood in Christ.",
      icon: <People />,
      image: "/api/placeholder/400/250",
      leader: "Brother Robert Davis",
      meetingTime: "Thursdays 7:00 PM",
      location: "Conference Room",
      ageGroup: "All adult men",
      activities: [
        "Weekly Bible study",
        "Monthly breakfast fellowship",
        "Men's retreats",
        "Community service",
        "Accountability groups",
        "Leadership training",
      ],
      color: "warning",
    },
    {
      id: 4,
      title: "Community Outreach",
      description:
        "Serving our community with love and compassion, meeting physical and spiritual needs.",
      icon: <VolunteerActivism />,
      image: "/api/placeholder/400/250",
      leader: "Pastor Mary Johnson",
      meetingTime: "Saturdays 9:00 AM",
      location: "Various Locations",
      ageGroup: "All ages welcome",
      activities: [
        "Food pantry distribution",
        "Homeless ministry",
        "Prison outreach",
        "Hospital visitation",
        "Community events",
        "Disaster relief",
      ],
      color: "error",
    },
    {
      id: 5,
      title: "Worship Ministry",
      description:
        "Leading the congregation in worship through music, praise, and creating an atmosphere for encounter with God.",
      icon: <MusicNote />,
      image: "/api/placeholder/400/250",
      leader: "Minister Sarah Brown",
      meetingTime: "Wednesdays 7:30 PM",
      location: "Main Sanctuary",
      ageGroup: "All ages",
      activities: [
        "Choir practice",
        "Instrumental team",
        "Worship leading",
        "Special music events",
        "Training workshops",
        "Youth worship team",
      ],
      color: "secondary",
    },
    {
      id: 6,
      title: "Children's Ministry",
      description:
        "Nurturing children in their faith journey through age-appropriate teaching and activities.",
      icon: <EmojiEvents />,
      image: "/api/placeholder/400/250",
      leader: "Sister Lisa Thompson",
      meetingTime: "Sundays 11:00 AM",
      location: "Children's Wing",
      ageGroup: "3-12 years",
      activities: [
        "Sunday School classes",
        "Vacation Bible School",
        "Children's choir",
        "Holiday programs",
        "Bible memory competitions",
        "Fun activities and games",
      ],
      color: "primary",
    },
  ];

  const getIconForMinistry = (ministry) => {
    const iconMap = {
      "Youth Ministry": <School />,
      "Women's Fellowship": <Group />,
      "Men's Ministry": <People />,
      "Community Outreach": <VolunteerActivism />,
      "Worship Ministry": <MusicNote />,
      "Children's Ministry": <EmojiEvents />,
    };
    return iconMap[ministry.title] || <MenuBook />;
  };

  return (
    <>
      <Helmet>
        <title>Ministries - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Discover opportunities to grow and serve through our various ministries at Christ Apostolic Church Hours of Mercy."
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
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
              Our Ministries
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Discover ways to grow in faith and serve in our community
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* Introduction */}
      <Box sx={{ py: 6, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            sx={{ textAlign: "center", mb: 6 }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Get Involved
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: "800px", mx: "auto" }}
            >
              We believe every person has unique gifts and talents that can be
              used to serve God and others. Whether you're new to faith or have
              been walking with Christ for years, there's a place for you in our
              ministry family.
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {ministries.map((ministry, index) => (
              <Grid item xs={12} lg={6} key={ministry.id}>
                <MotionCard
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "100%",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={ministry.image}
                    alt={ministry.title}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: "50%",
                          bgcolor: `${ministry.color}.main`,
                          color: "white",
                          mr: 2,
                        }}
                      >
                        {getIconForMinistry(ministry)}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {ministry.title}
                      </Typography>
                    </Box>

                    <Typography variant="body1" paragraph>
                      {ministry.description}
                    </Typography>

                    {/* Ministry Details */}
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Person
                              sx={{
                                fontSize: 18,
                                mr: 1,
                                color: "text.secondary",
                              }}
                            />
                            <Typography variant="body2">
                              <strong>Leader:</strong> {ministry.leader}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Schedule
                              sx={{
                                fontSize: 18,
                                mr: 1,
                                color: "text.secondary",
                              }}
                            />
                            <Typography variant="body2">
                              <strong>Meets:</strong> {ministry.meetingTime}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <LocationOn
                              sx={{
                                fontSize: 18,
                                mr: 1,
                                color: "text.secondary",
                              }}
                            />
                            <Typography variant="body2">
                              <strong>Location:</strong> {ministry.location}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Chip
                              label={ministry.ageGroup}
                              size="small"
                              color={ministry.color}
                              variant="outlined"
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>

                    {/* Activities */}
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      What We Do
                    </Typography>
                    <List dense>
                      {ministry.activities
                        .slice(0, 4)
                        .map((activity, actIndex) => (
                          <ListItem key={actIndex} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <CheckCircle
                                sx={{
                                  fontSize: 16,
                                  color: `${ministry.color}.main`,
                                }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={activity}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                          </ListItem>
                        ))}
                      {ministry.activities.length > 4 && (
                        <ListItem sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckCircle
                              sx={{
                                fontSize: 16,
                                color: `${ministry.color}.main`,
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={`And ${
                              ministry.activities.length - 4
                            } more activities...`}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontStyle: "italic",
                            }}
                          />
                        </ListItem>
                      )}
                    </List>

                    <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color={ministry.color}
                        size="small"
                        component={Link}
                        to="/contact"
                      >
                        Get Involved
                      </Button>
                      <Button
                        variant="outlined"
                        color={ministry.color}
                        size="small"
                        component={Link}
                        to="/contact"
                      >
                        Learn More
                      </Button>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          py: 8,
          bgcolor: "secondary.main",
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
              Ready to Serve?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              We believe God has given each person unique gifts and talents. Let
              us help you discover how you can use yours to serve others and
              grow in your faith.
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
                color="primary"
                size="large"
                sx={{ px: 4, py: 1.5 }}
              >
                Contact Us
              </Button>
              <Button
                component={Link}
                to="/events"
                variant="outlined"
                color="inherit"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                View Events
              </Button>
            </Box>
          </MotionBox>
        </Container>
      </Box>

      {/* Ministry Leaders */}
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
              variant="h3"
              gutterBottom
              sx={{ color: "primary.main" }}
            >
              Our Ministry Leaders
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Dedicated servants committed to helping you grow in your faith
              journey
            </Typography>
          </MotionBox>

          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>
              Want to Lead a Ministry?
            </Typography>
            <Typography variant="body1" paragraph>
              If you feel called to leadership or have a vision for a new
              ministry, we'd love to talk with you. Leadership development and
              mentoring are important parts of our church culture.
            </Typography>
            <Button
              component={Link}
              to="/contact"
              variant="contained"
              color="primary"
            >
              Express Interest
            </Button>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default MinistriesPage;
