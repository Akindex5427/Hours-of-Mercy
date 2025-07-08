import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle,
  Book,
  People,
  Favorite,
  History,
  EmojiEvents,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

const AboutPage = () => {
  const beliefs = [
    "The Bible is the inspired and infallible Word of God",
    "Salvation through faith in Jesus Christ alone",
    "The Trinity: Father, Son, and Holy Spirit",
    "The power of prayer and divine healing",
    "The importance of baptism and communion",
    "The second coming of Jesus Christ",
    "Living a life of holiness and righteousness",
    "The Great Commission to spread the Gospel",
  ];

  const values = [
    {
      title: "Scripture-Centered",
      description:
        "We base all our teachings and practices on the Word of God.",
      icon: <Book />,
    },
    {
      title: "Community-Focused",
      description: "We believe in the power of fellowship and mutual support.",
      icon: <People />,
    },
    {
      title: "Love-Driven",
      description: "Love for God and neighbor guides everything we do.",
      icon: <Favorite />,
    },
    {
      title: "Mission-Minded",
      description:
        "We are committed to spreading the Gospel locally and globally.",
      icon: <EmojiEvents />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Learn about our history, beliefs, and mission at Christ Apostolic Church Hours of Mercy in Dolton, Illinois."
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
              About Hours of Mercy
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "800px", mx: "auto" }}
            >
              Christ Apostolic Church - A Community Built on Faith, Love, and
              Service
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* Our Story */}
      <Box sx={{ py: 8, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{ color: "primary.main" }}
                >
                  Our Story
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Christ Apostolic Church Hours of Mercy was founded with a
                  vision to create a spiritual home where people could
                  experience God's love, grow in their faith, and serve their
                  community. Located in the heart of Dolton, Illinois, we have
                  been blessed to serve families and individuals for many years.
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Our name "Hours of Mercy" reflects our belief that every
                  moment is an opportunity to experience and extend God's mercy.
                  We are committed to creating an environment where people from
                  all walks of life can find hope, healing, and purpose.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  As part of the Christ Apostolic Church movement, we uphold the
                  traditional values of Pentecostal Christianity while embracing
                  modern approaches to ministry and community engagement.
                </Typography>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    bgcolor: "grey.50",
                  }}
                >
                  <History
                    sx={{ fontSize: 48, color: "secondary.main", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Our Heritage
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3 }}>
                    The Christ Apostolic Church was founded on the principles of
                    apostolic teaching, fellowship, breaking of bread, and
                    prayer as outlined in Acts 2:42.
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", color: "text.secondary" }}
                  >
                    "And they continued steadfastly in the apostles' doctrine
                    and fellowship, and in breaking of bread, and in prayers." -
                    Acts 2:42
                  </Typography>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Beliefs */}
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
              What We Believe
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Our faith is built on biblical foundations and apostolic teachings
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 3 }}
                  >
                    Core Beliefs
                  </Typography>
                  <List>
                    {beliefs.map((belief, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircle sx={{ color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={belief}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: "1.1rem",
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </MotionCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <MotionBox
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Paper
                  sx={{
                    p: 3,
                    textAlign: "center",
                    bgcolor: "primary.main",
                    color: "white",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 700 }}
                  >
                    "Hours of Mercy"
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 2, fontSize: "1.1rem" }}
                  >
                    Every hour is an opportunity to experience and extend God's
                    mercy
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontStyle: "italic", opacity: 0.9 }}
                  >
                    "The LORD's mercies are new every morning; Great is Your
                    faithfulness." - Lamentations 3:23
                  </Typography>
                </Paper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Values */}
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
              Our Values
            </Typography>
            <Typography variant="h6" color="text.secondary">
              The principles that guide our church family
            </Typography>
          </MotionBox>

          <Grid container spacing={4}>
            {values.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <MotionCard
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        bgcolor: "secondary.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        color: "white",
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Vision & Mission */}
      <Box sx={{ py: 8, bgcolor: "primary.main", color: "white" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Our Vision
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                  To be a beacon of hope and transformation in our community,
                  where lives are changed by the power of God's love.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  We envision a church where every person experiences the mercy
                  of God, grows in spiritual maturity, and becomes equipped to
                  serve others with excellence and compassion.
                </Typography>
              </MotionBox>
            </Grid>
            <Grid item xs={12} md={6}>
              <MotionBox
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  Our Mission
                </Typography>
                <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
                  We believe that the word of God is the foundation for the
                  world and God's plan for humanity.
                  <br />
                  1:PETER 1:25
                  <br />
                  But the word of the Lord endures forever. Sugbon oro Oluwa
                  duro titi lai. Oro yi na si ni ihinrere ti a wasu fun nyin.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}
                >
                  Through worship, fellowship, discipleship, and outreach, we
                  are committed to making disciples who will transform lives and
                  communities for the glory of God.
                </Typography>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default AboutPage;
