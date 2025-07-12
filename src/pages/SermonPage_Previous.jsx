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
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Search,
  PlayArrow,
  OpenInNew,
  Share,
  CalendarToday,
  Person,
  Book,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import { useSermons, useConfig } from "../hooks/useFirestore";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const SermonPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSermon, setSelectedSermon] = useState(null);

  // Firebase hooks
  const { sermons, loading, error } = useSermons(20);
  const { config: sermonSeries } = useConfig("sermon_series");

  console.log("SermonPage Debug:", { sermons, loading, error });

  const displaySermons = sermons || [];

  const series = sermonSeries || [
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

  const filteredSermons = displaySermons.filter(
    (sermon) =>
      sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sermon.pastor &&
        sermon.pastor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sermon.speaker &&
        sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sermon.series &&
        sermon.series.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (sermon.tags &&
        sermon.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
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
          background:
            "linear-gradient(135deg, #1976d2 0%, #1565c0 50%, #0d47a1 100%)",
          color: "white",
          py: 10,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>\')',
            opacity: 0.3,
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: "center" }}
          >
            <Box sx={{ mb: 3 }}>
              <Book sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
            </Box>
            <Typography
              variant="h1"
              gutterBottom
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                mb: 2,
              }}
            >
              Sermons
            </Typography>
            <Typography
              variant="h5"
              sx={{
                opacity: 0.95,
                maxWidth: "700px",
                mx: "auto",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 300,
                lineHeight: 1.6,
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              Be encouraged and equipped through the Word of God. Discover
              life-changing messages that inspire and transform.
            </Typography>
          </MotionBox>
        </Container>

        {/* Decorative wave */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "white",
            clipPath: "ellipse(100% 100% at 50% 100%)",
            transform: "translateY(30px)",
          }}
        />
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
              maxWidth: "500px",
              bgcolor: "white",
              borderRadius: 3,
              overflow: "hidden",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
                {selectedSermon.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedSermon.pastor || selectedSermon.speaker} •{" "}
                {formatDate(selectedSermon.date)}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                {selectedSermon.description}
              </Typography>

              {selectedSermon.videoUrl ? (
                <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={() => {
                      window.open(selectedSermon.videoUrl, "_blank");
                      setSelectedSermon(null);
                    }}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Watch on Facebook
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedSermon(null)}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Close
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Video link not available
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedSermon(null)}
                    sx={{ borderRadius: 2, px: 3 }}
                  >
                    Close
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
              gap: 3,
            }}
          >
            <CircularProgress size={80} thickness={3} />
            <Typography variant="h6" color="text.secondary">
              Loading sermons...
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please wait while we fetch the latest messages
            </Typography>
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: 3,
              "& .MuiAlert-icon": {
                fontSize: "1.5rem",
              },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Error loading sermons
            </Typography>
            <Typography variant="body2">
              {error}. Please check your connection and try again.
            </Typography>
          </Alert>
        )}

        {/* Show content only when not loading */}
        {!loading && (
          <>
            {/* Search and Tabs */}
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 6,
                borderRadius: 4,
                background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    mb: 1,
                  }}
                >
                  Explore Our Messages
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Search through our sermon library or browse by category
                </Typography>
              </Box>

              <TextField
                fullWidth
                placeholder="Search sermons by title, pastor, series, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    backgroundColor: "white",
                    fontSize: "1.1rem",
                    "& fieldset": {
                      borderColor: "grey.300",
                    },
                    "&:hover fieldset": {
                      borderColor: "primary.main",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "primary.main",
                      borderWidth: 2,
                    },
                  },
                  "& .MuiInputBase-input": {
                    py: 2,
                  },
                }}
              />

              <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  "& .MuiTabs-indicator": {
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                  "& .MuiTab-root": {
                    fontSize: "1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    minWidth: 120,
                    py: 2,
                    "&.Mui-selected": {
                      color: "primary.main",
                    },
                  },
                }}
              >
                <Tab label="All Sermons" />
                <Tab label="Recent" />
                <Tab label="Video" />
                <Tab label="Series" />
              </Tabs>
            </Paper>

            {/* Content based on selected tab */}
            {selectedTab === 3 ? (
              // Series Tab
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    textAlign: "center",
                    color: "text.primary",
                  }}
                >
                  Sermon Series
                </Typography>
                <Grid container spacing={4}>
                  {series.map((serie, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <MotionCard
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: "50%",
                              backgroundColor: "primary.main",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 3,
                              mx: "auto",
                            }}
                          >
                            <Book sx={{ color: "white", fontSize: 28 }} />
                          </Box>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{
                              fontWeight: 700,
                              textAlign: "center",
                              mb: 2,
                            }}
                          >
                            {serie.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="primary.main"
                            gutterBottom
                            sx={{
                              textAlign: "center",
                              fontWeight: 600,
                              mb: 2,
                            }}
                          >
                            {serie.count} messages
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              textAlign: "center",
                              lineHeight: 1.6,
                              mb: 3,
                            }}
                          >
                            {serie.description}
                          </Typography>
                          <Box sx={{ textAlign: "center" }}>
                            <Button
                              variant="contained"
                              size="medium"
                              onClick={() => setSearchTerm(serie.name)}
                              sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                textTransform: "none",
                                fontWeight: 600,
                              }}
                            >
                              View Series
                            </Button>
                          </Box>
                        </CardContent>
                      </MotionCard>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              // Sermons Grid
              <Box>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    textAlign: "center",
                    color: "text.primary",
                  }}
                >
                  {selectedTab === 0 && "All Sermons"}
                  {selectedTab === 1 && "Recent Sermons"}
                  {selectedTab === 2 && "Video Sermons"}
                </Typography>
                <Grid container spacing={4}>
                  {filteredSermons
                    .filter((sermon) => {
                      if (selectedTab === 0) return true;
                      if (selectedTab === 1) return true;
                      if (selectedTab === 2) return sermon.videoUrl;
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
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: 4,
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: "1px solid",
                            borderColor: "grey.100",
                            "&:hover": {
                              transform: "translateY(-12px)",
                              boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                              borderColor: "primary.light",
                            },
                          }}
                          onClick={() => setSelectedSermon(sermon)}
                        >
                          {/* Image Section */}
                          <Box
                            sx={{
                              position: "relative",
                              paddingTop: "100%",
                              overflow: "hidden",
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={
                                sermon.thumbnail ||
                                sermon.thumbnailUrl ||
                                "/api/placeholder/400/400"
                              }
                              alt={sermon.title}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                objectPosition: "center",
                                transition: "transform 0.3s ease",
                              }}
                            />

                            {/* Duration overlay */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                bgcolor: "rgba(0,0,0,0.8)",
                                color: "white",
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                fontSize: "0.85rem",
                                fontWeight: 600,
                                backdropFilter: "blur(4px)",
                              }}
                            >
                              {sermon.duration || "N/A"}
                            </Box>

                            {/* Play button overlay */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                bgcolor: "rgba(25,118,210,0.9)",
                                borderRadius: "50%",
                                p: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backdropFilter: "blur(4px)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                  bgcolor: "primary.main",
                                  transform: "translate(-50%, -50%) scale(1.1)",
                                },
                              }}
                            >
                              <PlayArrow
                                sx={{ color: "white", fontSize: 36 }}
                              />
                            </Box>
                          </Box>

                          {/* Content Section */}
                          <CardContent
                            sx={{
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              p: 3,
                            }}
                          >
                            <Typography
                              variant="h6"
                              gutterBottom
                              sx={{
                                fontWeight: 700,
                                minHeight: "3rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.5,
                                color: "text.primary",
                                mb: 2,
                              }}
                            >
                              {sermon.title}
                            </Typography>

                            {/* Pastor Info */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: "primary.main",
                                }}
                              />
                              <Person
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                              >
                                {sermon.pastor || sermon.speaker}
                              </Typography>
                            </Box>

                            {/* Date Info */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 1,
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: "secondary.main",
                                }}
                              />
                              <CalendarToday
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontWeight: 500 }}
                              >
                                {formatDate(sermon.date)}
                              </Typography>
                            </Box>

                            {/* Scripture Info */}
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 3,
                                gap: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: "50%",
                                  bgcolor: "success.main",
                                }}
                              />
                              <Book
                                sx={{ fontSize: 16, color: "text.secondary" }}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  fontWeight: 500,
                                  fontStyle: sermon.scripture
                                    ? "normal"
                                    : "italic",
                                }}
                              >
                                {sermon.scripture ||
                                  "Scripture reference not available"}
                              </Typography>
                            </Box>

                            {/* Description */}
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              paragraph
                              sx={{
                                minHeight: "4rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.5,
                                mb: 3,
                              }}
                            >
                              {sermon.description}
                            </Typography>

                            {/* Tags */}
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mb: 3,
                                minHeight: "2rem",
                                alignItems: "flex-start",
                              }}
                            >
                              {(sermon.tags || []).map((tag, tagIndex) => (
                                <Chip
                                  key={tagIndex}
                                  label={tag}
                                  size="small"
                                  variant="outlined"
                                  color="primary"
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    "&:hover": {
                                      bgcolor: "primary.50",
                                    },
                                  }}
                                />
                              ))}
                            </Box>

                            <Box sx={{ flexGrow: 1 }} />

                            {/* Bottom Section */}
                            <Box sx={{ mt: "auto" }}>
                              <Box sx={{ mb: 2 }}>
                                <Chip
                                  label={sermon.series || "General"}
                                  size="medium"
                                  color="secondary"
                                  sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    px: 1,
                                  }}
                                />
                              </Box>

                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1,
                                  justifyContent: "flex-end",
                                }}
                              >
                                <IconButton
                                  size="medium"
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (sermon.videoUrl) {
                                      window.open(sermon.videoUrl, "_blank");
                                    } else {
                                      alert(
                                        "No video link available for this sermon"
                                      );
                                    }
                                  }}
                                  title="Watch on Facebook"
                                  sx={{
                                    bgcolor: "primary.50",
                                    "&:hover": { bgcolor: "primary.100" },
                                  }}
                                >
                                  <OpenInNew />
                                </IconButton>
                                <IconButton
                                  size="medium"
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (navigator.share && sermon.videoUrl) {
                                      navigator.share({
                                        title: sermon.title,
                                        text: `Watch "${sermon.title}" by ${
                                          sermon.speaker || sermon.pastor
                                        }`,
                                        url: sermon.videoUrl,
                                      });
                                    } else if (sermon.videoUrl) {
                                      navigator.clipboard
                                        .writeText(sermon.videoUrl)
                                        .then(() => {
                                          alert(
                                            "Video link copied to clipboard!"
                                          );
                                        });
                                    } else {
                                      alert("No video link available to share");
                                    }
                                  }}
                                  title="Share sermon"
                                  sx={{
                                    bgcolor: "secondary.50",
                                    "&:hover": { bgcolor: "secondary.100" },
                                  }}
                                >
                                  <Share />
                                </IconButton>
                              </Box>
                            </Box>
                          </CardContent>
                        </MotionCard>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            )}

            {/* No Results Message */}
            {filteredSermons.length === 0 && selectedTab !== 3 && (
              <Paper sx={{ p: 6, textAlign: "center", mt: 4, borderRadius: 3 }}>
                {searchTerm ? (
                  <>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No sermons found matching your search.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try different keywords or browse all sermons.
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No sermons available at the moment.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please check back later for new sermon content.
                    </Typography>
                  </>
                )}
              </Paper>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default SermonPage;
