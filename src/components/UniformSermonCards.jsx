import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import {
  PlayArrow,
  OpenInNew,
  Share,
  Person,
  CalendarToday,
  Book,
} from "@mui/icons-material";

// Test component to demonstrate uniform sermon card sizes
const UniformSermonCards = () => {
  const sampleSermons = [
    {
      id: 1,
      title: "Walking in Faith",
      description: "A short sermon about faith.",
      thumbnailUrl:
        "https://via.placeholder.com/400x400/1976d2/ffffff?text=Walking+in+Faith",
      duration: "45:30",
      pastor: "Pastor Smith",
      date: "2025-01-15",
      scripture: "Hebrews 11:1",
      series: "Faith Series",
      tags: ["faith", "hope"],
    },
    {
      id: 2,
      title:
        "God's Amazing Grace and Mercy: A Deep Dive into His Infinite Love",
      description:
        "This is a much longer sermon description that talks about God's grace, mercy, love, and how we can apply these principles in our daily lives. It covers many aspects of Christian living and provides practical guidance for believers in their spiritual journey.",
      thumbnailUrl:
        "https://via.placeholder.com/400x400/d32f2f/ffffff?text=God's+Grace",
      duration: "1:12:45",
      pastor: "Pastor Johnson",
      date: "2025-01-08",
      scripture: "Ephesians 2:8-9",
      series: "Grace and Mercy",
      tags: ["grace", "mercy", "love", "salvation", "forgiveness"],
    },
    {
      id: 3,
      title: "Prayer",
      description: "The power of prayer in our lives.",
      thumbnailUrl:
        "https://via.placeholder.com/400x400/388e3c/ffffff?text=Prayer",
      duration: "28:15",
      pastor: "Pastor Williams",
      date: "2025-01-01",
      scripture: "1 Thessalonians 5:17",
      series: "Prayer Life",
      tags: ["prayer"],
    },
    {
      id: 4,
      title: "Building Strong Foundations",
      description:
        "Medium length sermon about building our lives on solid spiritual foundations through God's word and prayer.",
      thumbnailUrl:
        "https://via.placeholder.com/400x400/ff9800/ffffff?text=Foundations",
      duration: "52:30",
      pastor: "Pastor Davis",
      date: "2024-12-25",
      scripture: "Matthew 7:24-27",
      series: "Foundation Series",
      tags: ["foundation", "stability", "growth"],
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Paper sx={{ p: 4, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Uniform Sermon Card Layout Test
      </Typography>

      <Typography variant="body1" paragraph>
        This demonstrates how sermon cards maintain uniform heights regardless
        of content length. All cards have the same height with properly
        distributed content areas.
      </Typography>

      <Grid container spacing={3}>
        {sampleSermons.map((sermon, index) => (
          <Grid item xs={12} sm={6} lg={3} key={sermon.id}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-4px)",
                  transition: "transform 0.3s ease",
                },
              }}
            >
              {/* Square image container */}
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "100%",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  image={sermon.thumbnailUrl}
                  alt={sermon.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />

                {/* Duration overlay */}
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

                {/* Play button overlay */}
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
              </Box>

              <CardContent
                sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
              >
                {/* Fixed height title */}
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    minHeight: "3rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    lineHeight: 1.5,
                  }}
                >
                  {sermon.title}
                </Typography>

                {/* Pastor and date info */}
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Person
                    sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {sermon.pastor}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarToday
                    sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(sermon.date)}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Book
                    sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {sermon.scripture}
                  </Typography>
                </Box>

                {/* Fixed height description */}
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
                    lineHeight: 1.4,
                  }}
                >
                  {sermon.description}
                </Typography>

                {/* Fixed height tags area */}
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    mb: 2,
                    minHeight: "2rem",
                    alignItems: "flex-start",
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

                {/* Flex spacer to push content to bottom */}
                <Box sx={{ flexGrow: 1 }} />

                {/* Bottom section - always at the bottom */}
                <Box sx={{ mt: "auto" }}>
                  <Chip
                    label={sermon.series}
                    size="small"
                    color="secondary"
                    sx={{ mb: 2 }}
                  />

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      size="small"
                      color="primary"
                      title="Watch Video"
                    >
                      <OpenInNew />
                    </IconButton>
                    <IconButton size="small" color="primary" title="Share">
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: "grey.100", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Uniform Card Layout Features:
        </Typography>
        <Typography variant="body2" component="div">
          <ul>
            <li>
              <strong>Consistent Heights:</strong> All cards have the same
              height regardless of content length
            </li>
            <li>
              <strong>Fixed Title Area:</strong> Titles are constrained to 2
              lines with ellipsis overflow
            </li>
            <li>
              <strong>Fixed Description Area:</strong> Descriptions limited to 3
              lines for consistency
            </li>
            <li>
              <strong>Fixed Tags Area:</strong> Minimum height ensures alignment
              even with few tags
            </li>
            <li>
              <strong>Bottom Alignment:</strong> Series chip and action buttons
              always at the bottom
            </li>
            <li>
              <strong>Flexible Content:</strong> Middle content area
              grows/shrinks as needed
            </li>
          </ul>
        </Typography>
      </Box>
    </Paper>
  );
};

export default UniformSermonCards;
