import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Avatar,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Fab,
  Paper,
  Divider,
} from "@mui/material";
import {
  PlayArrow,
  Person,
  CalendarToday,
  Search,
  FilterList,
  FavoriteRounded,
  ShareRounded,
  MoreVert,
  AccessTime,
  Visibility,
} from "@mui/icons-material";
import { useSermons, useConfig } from "../hooks/useFirestore";

const ModernSermonPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [favorites, setFavorites] = useState([]);

  // Firebase hooks
  const { sermons, loading, error } = useSermons(20);
  const { config: sermonSeries } = useConfig("sermon_series");

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const toggleFavorite = (sermonId) => {
    setFavorites((prev) =>
      prev.includes(sermonId)
        ? prev.filter((id) => id !== sermonId)
        : [...prev, sermonId]
    );
  };

  // Filter sermons based on search and series
  const filteredSermons = useMemo(() => {
    if (!sermons) return [];

    return sermons.filter((sermon) => {
      const matchesSearch =
        sermon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.pastor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.speaker?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sermon.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSeries =
        !selectedSeries ||
        selectedSeries === "" ||
        sermon.series === selectedSeries;

      return matchesSearch && matchesSeries;
    });
  }, [sermons, searchTerm, selectedSeries]);

  // Get unique series for filter
  const availableSeries = useMemo(() => {
    if (!sermons) return [];
    const series = [...new Set(sermons.map((s) => s.series).filter(Boolean))];
    return series;
  }, [sermons]);

  return (
    <>
      <Helmet>
        <title>Sermons - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Watch and listen to inspiring sermons from Christ Apostolic Church Hours of Mercy."
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #2c5530 0%, #1a3a1d 100%)",
          color: "white",
          pt: 8,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              textAlign: "center",
              mb: 2,
              fontSize: { xs: "2rem", md: "3rem" },
            }}
          >
            Sermons
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              opacity: 0.9,
              maxWidth: "600px",
              mx: "auto",
              mb: 4,
            }}
          >
            Experience God's word through powerful messages that transform lives
          </Typography>

          {/* Search Bar */}
          <Box sx={{ maxWidth: "500px", mx: "auto" }}>
            <TextField
              fullWidth
              placeholder="Search sermons, pastors, topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "rgba(255,255,255,0.7)" }} />
                  </InputAdornment>
                ),
                sx: {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 3,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.5)",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                  },
                  color: "white",
                  "& ::placeholder": {
                    color: "rgba(255,255,255,0.7)",
                  },
                },
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="lg"
        sx={{ py: 4, position: "relative", overflow: "hidden" }}
      >
        {/* Comprehensive fix to prevent any floating category indicators */}
        <style>
          {`
            /* Hide any absolutely or fixed positioned chips */
            .MuiChip-root[style*="position: absolute"],
            .MuiChip-root[style*="position: fixed"],
            .MuiChip-root.floating-category,
            .category-indicator {
              display: none !important;
            }
            
            /* Ensure all chips are properly contained */
            .MuiChip-root {
              position: relative !important;
              float: none !important;
            }
            
            /* Clear any potential floating elements */
            .MuiContainer-root::after {
              content: "";
              display: table;
              clear: both;
            }
          `}
        </style>
        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
              gap: 3,
            }}
          >
            <CircularProgress size={60} thickness={4} />
            <Typography variant="h6" color="text.secondary">
              Loading sermons...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 4,
              borderRadius: 3,
              "& .MuiAlert-message": { width: "100%" },
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Unable to load sermons
            </Typography>
            <Typography variant="body2">
              {error}. Please check your connection and try again.
            </Typography>
          </Alert>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {/* Series Filter */}
            {availableSeries.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Browse by Series
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  {availableSeries.map((series) => (
                    <Chip
                      key={series}
                      label={series}
                      variant={
                        selectedSeries === series ? "filled" : "outlined"
                      }
                      color="primary"
                      onClick={() => setSelectedSeries(series)}
                      sx={{
                        fontWeight: 500,
                      }}
                    />
                  ))}
                  {selectedSeries && (
                    <Chip
                      label="Clear Filter"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => setSelectedSeries("")}
                      sx={{
                        fontWeight: 500,
                        ml: 1,
                      }}
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Sermons Grid */}
            <Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4 }}
              >
                All Sermons ({filteredSermons.length})
              </Typography>

              {filteredSermons.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(3, 1fr)",
                    },
                    gap: 3,
                    alignItems: "start",
                  }}
                >
                  {filteredSermons.map((sermon, index) => {
                    // Create varied heights for masonry effect
                    const isLarge = index % 5 === 0;
                    const isMedium = index % 3 === 0 && !isLarge;

                    return (
                      <Card
                        key={sermon.id || index}
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          cursor: "pointer",
                          transition:
                            "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                          border: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          position: "relative",
                          background: "white",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 12px 40px rgba(44, 85, 48, 0.15)",
                            "& .sermon-image": {
                              transform: "scale(1.05)",
                            },
                            "& .sermon-overlay": {
                              opacity: 1,
                            },
                            "& .action-buttons": {
                              opacity: 1,
                              transform: "translateY(0)",
                            },
                          },
                        }}
                      >
                        {/* Image Section */}
                        <Box
                          sx={{
                            position: "relative",
                            height: isLarge ? 280 : isMedium ? 240 : 200,
                            overflow: "hidden",
                            background:
                              "linear-gradient(135deg, #2c5530 0%, #1a3a1d 100%)",
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={
                              sermon.thumbnail ||
                              sermon.thumbnailUrl ||
                              `https://via.placeholder.com/400x${
                                isLarge ? 280 : isMedium ? 240 : 200
                              }/2c5530/ffffff?text=${encodeURIComponent(
                                sermon.title || "Sermon"
                              )}`
                            }
                            alt={sermon.title}
                            className="sermon-image"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition:
                                "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                            }}
                          />

                          {/* Gradient Overlay */}
                          <Box
                            className="sermon-overlay"
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              padding: 2,
                            }}
                          >
                            {/* Top Actions */}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Chip
                                label={sermon.series || "General"}
                                size="small"
                                sx={{
                                  backgroundColor: "rgba(255,255,255,0.9)",
                                  color: "primary.main",
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(sermon.id);
                                }}
                                sx={{
                                  backgroundColor: "rgba(255,255,255,0.9)",
                                  color: favorites.includes(sermon.id)
                                    ? "error.main"
                                    : "text.secondary",
                                  "&:hover": { backgroundColor: "white" },
                                }}
                              >
                                <FavoriteRounded sx={{ fontSize: 18 }} />
                              </IconButton>
                            </Box>

                            {/* Center Play Button */}
                            <Box
                              sx={{ display: "flex", justifyContent: "center" }}
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (sermon.videoUrl) {
                                    window.open(sermon.videoUrl, "_blank");
                                  }
                                }}
                                sx={{
                                  backgroundColor: "rgba(255,255,255,0.95)",
                                  color: "primary.main",
                                  width: 56,
                                  height: 56,
                                  "&:hover": {
                                    backgroundColor: "primary.main",
                                    color: "white",
                                    transform: "scale(1.1)",
                                  },
                                  transition: "all 0.3s ease",
                                }}
                              >
                                <PlayArrow sx={{ fontSize: 28 }} />
                              </IconButton>
                            </Box>

                            {/* Bottom Info */}
                            <Box sx={{ color: "white" }}>
                              <Typography
                                variant="caption"
                                sx={{ opacity: 0.9 }}
                              >
                                {formatDate(sermon.date)} •{" "}
                                {sermon.views || "0"} views
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Content Section */}
                        <CardContent
                          sx={{
                            p: 3,
                            pb: 2,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 700,
                              lineHeight: 1.4,
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              fontSize: isLarge ? "1.2rem" : "1rem",
                            }}
                          >
                            {sermon.title || "Untitled Sermon"}
                          </Typography>

                          {/* Author Info */}
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ mb: 2 }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                background:
                                  "linear-gradient(135deg, #2c5530 0%, #1a3a1d 100%)",
                                fontSize: "0.8rem",
                              }}
                            >
                              {(sermon.pastor || sermon.speaker || "P")
                                .charAt(0)
                                .toUpperCase()}
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: "text.primary",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {sermon.pastor || sermon.speaker || "Pastor"}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Description - only for large cards */}
                          {(isLarge || isMedium) && sermon.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                lineHeight: 1.5,
                                mb: 2,
                                display: "-webkit-box",
                                WebkitLineClamp: isLarge ? 3 : 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {sermon.description}
                            </Typography>
                          )}

                          {/* Action Buttons */}
                          <Box
                            className="action-buttons"
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              pt: 1,
                              borderTop: "1px solid",
                              borderColor: "grey.100",
                              opacity: 0.7,
                              transform: "translateY(4px)",
                              transition: "all 0.3s ease",
                            }}
                          >
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "text.secondary",
                                  "&:hover": { color: "primary.main" },
                                }}
                              >
                                <ShareRounded sx={{ fontSize: 16 }} />
                              </IconButton>
                              <IconButton
                                size="small"
                                sx={{
                                  color: "text.secondary",
                                  "&:hover": { color: "primary.main" },
                                }}
                              >
                                <MoreVert sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Stack>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {sermon.duration || "30 min"}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              ) : (
                <Paper
                  sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: 3,
                    backgroundColor: "grey.50",
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {searchTerm || selectedSeries
                      ? "No sermons match your search"
                      : "No sermons available"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm || selectedSeries
                      ? "Try adjusting your search terms or filters"
                      : "Check back later for new sermons"}
                  </Typography>
                  {(searchTerm || selectedSeries) && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedSeries("");
                      }}
                      sx={{ mt: 2 }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Paper>
              )}
            </Box>
          </>
        )}
      </Container>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: { xs: "flex", md: "none" },
        }}
        onClick={() => {
          // Scroll to search
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <Search />
      </Fab>
    </>
  );
};

export default ModernSermonPage;
