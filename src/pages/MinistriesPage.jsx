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
import { useMinistries } from "../hooks/useFirestore";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const MinistriesPage = () => {
  // Firebase hook
  const { ministries: firebaseMinistries, loading, error } = useMinistries();

  const ministries = firebaseMinistries || [];

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
    <MotionBox
      key="ministries-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
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
                  initial={{ x: -30, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.15, duration: 0.7 }}
                  viewport={{ once: true, margin: "-100px" }}
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
    </MotionBox>
  );
};

export default MinistriesPage;
