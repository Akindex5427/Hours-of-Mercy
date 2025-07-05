import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import {
  Search,
  PlayArrow,
  Download,
  Share,
  CalendarToday,
  Person,
  Book,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const SermonPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSermon, setSelectedSermon] = useState(null);

  const sermons = [
    {
      id: 1,
      title: "Walking in God's Mercy",
      pastor: "Pastor John Smith",
      date: "2025-06-29",
      duration: "45:32",
      series: "Hours of Grace",
      scripture: "Lamentations 3:22-23",
      description:
        "Discover how God's mercy is new every morning and how we can walk in His grace daily.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
      audioUrl: "/sermons/walking-in-mercy.mp3", // Placeholder
      thumbnail: "/api/placeholder/400/225",
      tags: ["Mercy", "Grace", "Daily Walk"],
      type: "video",
    },
    {
      id: 2,
      title: "The Power of Prayer",
      pastor: "Pastor Mary Johnson",
      date: "2025-06-22",
      duration: "38:15",
      series: "Foundations of Faith",
      scripture: "Matthew 6:9-13",
      description:
        "Understanding the Lord's Prayer and developing a powerful prayer life.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
      audioUrl: "/sermons/power-of-prayer.mp3", // Placeholder
      thumbnail: "/api/placeholder/400/225",
      tags: ["Prayer", "Faith", "Spiritual Growth"],
      type: "video",
    },
    {
      id: 3,
      title: "Faith That Moves Mountains",
      pastor: "Pastor David Wilson",
      date: "2025-06-15",
      duration: "42:18",
      series: "Foundations of Faith",
      scripture: "Matthew 17:20",
      description:
        "Exploring the power of faith and how to overcome life's challenges.",
      audioUrl: "/sermons/faith-moves-mountains.mp3", // Placeholder
      thumbnail: "/api/placeholder/400/225",
      tags: ["Faith", "Overcoming", "Mountains"],
      type: "audio",
    },
    {
      id: 4,
      title: "Love Your Neighbor",
      pastor: "Pastor Sarah Brown",
      date: "2025-06-08",
      duration: "35:45",
      series: "Living Like Jesus",
      scripture: "Mark 12:31",
      description: "Practical ways to show Christ's love to those around us.",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Placeholder
      audioUrl: "/sermons/love-your-neighbor.mp3", // Placeholder
      thumbnail: "/api/placeholder/400/225",
      tags: ["Love", "Community", "Service"],
      type: "video",
    },
  ];

  const series = [
    {
      name: "Hours of Grace",
      count: 8,
      description: "Exploring God's mercy and grace in our daily lives",
    },
    {
      name: "Foundations of Faith",
      count: 12,
      description: "Building strong spiritual foundations",
    },
    {
      name: "Living Like Jesus",
      count: 6,
      description: "Practical Christianity in action",
    },
  ];

  const filteredSermons = sermons.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.pastor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.series.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sermon.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Helmet>
        <title>Sermons - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Watch and listen to inspiring sermons from Christ Apostolic Church Hours of Mercy. Grow in faith with our sermon archive."
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
              Sermons
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Be encouraged and equipped through the Word of God
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      {/* Video Player Modal */}
      {selectedSermon && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
          onClick={() => setSelectedSermon(null)}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "900px",
              maxHeight: "80vh",
              bgcolor: "white",
              borderRadius: 2,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box
              sx={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
            >
              <ReactPlayer
                url={selectedSermon.videoUrl || selectedSermon.audioUrl}
                width="100%"
                height="100%"
                controls
                playing
                style={{ position: "absolute", top: 0, left: 0 }}
              />
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                {selectedSermon.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedSermon.pastor} • {formatDate(selectedSermon.date)}
              </Typography>
              <Typography variant="body1">
                {selectedSermon.description}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Search and Tabs */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search sermons by title, pastor, series, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="All Sermons" />
            <Tab label="Recent" />
            <Tab label="Video" />
            <Tab label="Audio" />
            <Tab label="Series" />
          </Tabs>
        </Box>

        {/* Content based on selected tab */}
        {selectedTab === 4 ? (
          // Series Tab
          <Grid container spacing={3}>
            {series.map((serie, index) => (
              <Grid item xs={12} md={4} key={index}>
                <MotionCard
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {serie.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {serie.count} messages
                    </Typography>
                    <Typography variant="body2">{serie.description}</Typography>
                    <Button
                      sx={{ mt: 2 }}
                      variant="outlined"
                      size="small"
                      onClick={() => setSearchTerm(serie.name)}
                    >
                      View Series
                    </Button>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Sermons Grid
          <Grid container spacing={3}>
            {filteredSermons
              .filter((sermon) => {
                if (selectedTab === 0) return true; // All
                if (selectedTab === 1) return true; // Recent (could add date filter)
                if (selectedTab === 2) return sermon.type === "video";
                if (selectedTab === 3) return sermon.type === "audio";
                return true;
              })
              .map((sermon, index) => (
                <Grid item xs={12} sm={6} lg={4} key={sermon.id}>
                  <MotionCard
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    sx={{
                      height: "100%",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        transition: "transform 0.3s ease",
                      },
                    }}
                    onClick={() => setSelectedSermon(sermon)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={sermon.thumbnail}
                      alt={sermon.title}
                      sx={{ position: "relative" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "rgba(0,0,0,0.7)",
                        color: "white",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.8rem",
                      }}
                    >
                      {sermon.duration}
                    </Box>
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "rgba(0,0,0,0.7)",
                        borderRadius: "50%",
                        p: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <PlayArrow sx={{ color: "white", fontSize: 32 }} />
                    </Box>

                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        {sermon.title}
                      </Typography>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Person
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {sermon.pastor}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <CalendarToday
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(sermon.date)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Book
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {sermon.scripture}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {sermon.description}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mb: 2,
                        }}
                      >
                        {sermon.tags.map((tag, tagIndex) => (
                          <Chip
                            key={tagIndex}
                            label={tag}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>

                      <Chip
                        label={sermon.series}
                        size="small"
                        color="secondary"
                        sx={{ mb: 2 }}
                      />

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton size="small" color="primary">
                          <Download />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Share />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
          </Grid>
        )}

        {filteredSermons.length === 0 && selectedTab !== 4 && (
          <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No sermons found matching your search.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try different keywords or browse all sermons.
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default SermonPage;
