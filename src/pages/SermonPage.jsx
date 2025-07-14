import React, { useState, useEffect } from "react";
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
  Paper,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Divider,
  Fab,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Tooltip,
  Snackbar,
} from "@mui/material";
import {
  Search,
  PlayArrow,
  OpenInNew,
  Share,
  CalendarToday,
  Person,
  Book,
  FilterList,
  ViewModule,
  ViewList,
  Favorite,
  Download,
  Close,
  Menu as MenuIcon,
  ChevronRight,
  AccessTime,
  Star,
  MoreVert,
  ArrowBack,
  Clear,
  TrendingUp,
} from "@mui/icons-material";
import { useSermons, useConfig } from "../hooks/useFirestore";

const SermonPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [favoriteSermons, setFavoriteSermons] = useState([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [currentMenuSermon, setCurrentMenuSermon] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedSeries, setSelectedSeries] = useState("");
  const [showSeriesList, setShowSeriesList] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Firebase hooks
  const { sermons, loading, error } = useSermons(20);
  const { config: sermonSeries } = useConfig("sermon_series");

  const displaySermons = sermons || [];

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("sermon-favorites");
    if (savedFavorites) {
      setFavoriteSermons(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sermon-favorites", JSON.stringify(favoriteSermons));
  }, [favoriteSermons]);

  // Show snackbar helper function
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // Share functionality
  const handleShare = async (sermon) => {
    if (navigator.share && sermon.videoUrl) {
      try {
        await navigator.share({
          title: sermon.title,
          text: `Watch "${sermon.title}" by ${sermon.speaker || sermon.pastor}`,
          url: sermon.videoUrl,
        });
        showSnackbar("Sermon shared successfully!");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.log("Error sharing:", error);
          handleCopyLink(sermon);
        }
      }
    } else if (sermon.videoUrl) {
      handleCopyLink(sermon);
    } else {
      showSnackbar("No video link available to share", "error");
    }
  };

  const handleCopyLink = (sermon) => {
    if (sermon.videoUrl) {
      navigator.clipboard
        .writeText(sermon.videoUrl)
        .then(() => {
          showSnackbar("Video link copied to clipboard!");
        })
        .catch(() => {
          showSnackbar("Failed to copy link", "error");
        });
    } else {
      showSnackbar("No video link available", "error");
    }
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setCurrentMenuSermon(null);
  };

  const toggleFavorite = (sermonId) => {
    const isCurrentlyFavorite = favoriteSermons.includes(sermonId);
    setFavoriteSermons((prev) =>
      isCurrentlyFavorite
        ? prev.filter((id) => id !== sermonId)
        : [...prev, sermonId]
    );
    showSnackbar(
      isCurrentlyFavorite ? "Removed from favorites" : "Added to favorites"
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get unique series from sermons
  const getUniqueSeries = () => {
    const series = displaySermons
      .map((sermon) => sermon.series)
      .filter((series) => series && series.trim() !== "");
    return [...new Set(series)].sort();
  };

  // Filter handlers
  const handleFilterSelect = (filterType) => {
    setActiveFilter(filterType);
    setSelectedSeries("");
    setShowSeriesList(filterType === "series");

    if (filterType !== "series") {
      setFilterDrawer(false);
    }

    showSnackbar(`Filter applied: ${getFilterDisplayName(filterType)}`);
  };

  const handleSeriesSelect = (series) => {
    setSelectedSeries(series);
    setActiveFilter("series");
    setShowSeriesList(false);
    setFilterDrawer(false);
    showSnackbar(`Filtered by series: ${series}`);
  };

  const clearFilters = () => {
    setActiveFilter("all");
    setSelectedSeries("");
    setShowSeriesList(false);
    setSearchTerm("");
    showSnackbar("All filters cleared");
  };

  const getFilterDisplayName = (filterType) => {
    switch (filterType) {
      case "recent":
        return "Recent Sermons";
      case "favorites":
        return "Favorites";
      case "popular":
        return "Most Popular";
      case "series":
        return selectedSeries ? `Series: ${selectedSeries}` : "By Series";
      default:
        return "All Sermons";
    }
  };

  const filteredSermons = displaySermons
    .filter((sermon) => {
      // Text search filter
      const textMatch =
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
          ));

      // Category filter
      let categoryMatch = true;
      if (activeFilter === "recent") {
        // Show sermons from last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        categoryMatch = new Date(sermon.date) >= thirtyDaysAgo;
      } else if (activeFilter === "favorites") {
        categoryMatch = favoriteSermons.includes(sermon.id);
      } else if (activeFilter === "popular") {
        // For popular, we'll show sermons that have longer durations or are from featured series
        // This is a fallback since we don't have view counts
        categoryMatch =
          sermon.duration &&
          (parseInt(sermon.duration) >= 30 ||
            sermon.series?.toLowerCase().includes("special") ||
            sermon.series?.toLowerCase().includes("featured"));
      } else if (activeFilter === "series" && selectedSeries) {
        categoryMatch = sermon.series === selectedSeries;
      }

      return textMatch && categoryMatch;
    })
    .sort((a, b) => {
      // Sort based on active filter
      if (activeFilter === "recent") {
        return new Date(b.date) - new Date(a.date);
      } else if (activeFilter === "popular") {
        // Sort by duration (longer sermons first) or date
        const aDuration = parseInt(a.duration) || 0;
        const bDuration = parseInt(b.duration) || 0;
        return bDuration - aDuration || new Date(b.date) - new Date(a.date);
      } else {
        // Default sort by date (newest first)
        return new Date(b.date) - new Date(a.date);
      }
    });

  // Search and Filter Bar
  const SearchFilterBar = () => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        borderRadius: 4,
        background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
        border: "1px solid",
        borderColor: "grey.200",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems="center"
      >
        <TextField
          fullWidth
          placeholder="Search sermons, pastors, topics..."
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
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              backgroundColor: "white",
            },
          }}
        />
        <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
          <IconButton
            onClick={() => setFilterDrawer(true)}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <FilterList />
          </IconButton>
          <IconButton
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            sx={{
              bgcolor: viewMode === "grid" ? "primary.main" : "grey.300",
              color: viewMode === "grid" ? "white" : "text.primary",
              "&:hover": {
                bgcolor: viewMode === "grid" ? "primary.dark" : "grey.400",
              },
            }}
          >
            {viewMode === "grid" ? <ViewList /> : <ViewModule />}
          </IconButton>
        </Box>
      </Stack>
    </Paper>
  );

  // Sermon Card Component
  const SermonCard = ({ sermon, index }) => (
    <Grid
      item
      xs={12}
      sm={6}
      lg={4}
      key={sermon.id}
      sx={{
        display: "flex",
        justifyContent: "center",
        "& > *": {
          // width: "100%",
        },
      }}
    >
      <Card
        sx={{
          height: 400,
          width: "100%",
          maxWidth: 350,
          cursor: "pointer",
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          display: "flex",
          flexDirection: "column",
          border: "1px solid",
          borderColor: "grey.200",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
            borderColor: "primary.light",
          },
        }}
        onClick={() => setSelectedSermon(sermon)}
      >
        {/* Thumbnail Section */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "220px",
            minHeight: "220px",
            maxHeight: "220px",
            overflow: "hidden",
            backgroundColor: "grey.100",
            flexShrink: 0,
            flexGrow: 0,
          }}
        >
          <CardMedia
            component="img"
            image={
              sermon.thumbnail ||
              sermon.thumbnailUrl ||
              "/api/placeholder/400/220"
            }
            alt={sermon.title}
            sx={{
              // width: "100%",
              height: 230,
              // minHeight: 240,
              maxHeight: 300,
              objectFit: "cover",
              // objectPosition: "center",
            }}
          />

          {/* Hover Play Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.3s ease",
              "&:hover": { opacity: 1 },
            }}
          >
            <IconButton
              sx={{
                bgcolor: "primary.main",
                color: "white",
                width: 56,
                height: 56,
                "&:hover": {
                  bgcolor: "primary.dark",
                  transform: "scale(1.1)",
                },
              }}
            >
              <PlayArrow sx={{ fontSize: 32 }} />
            </IconButton>
          </Box>

          {/* Duration Chip */}
          <Chip
            label={sermon.duration || "45 min"}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0,0,0,0.75)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          />

          {/* Favorite Button */}
          <Tooltip
            title={
              favoriteSermons.includes(sermon.id)
                ? "Remove from Favorites"
                : "Add to Favorites"
            }
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(sermon.id);
              }}
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                bgcolor: "rgba(255,255,255,0.9)",
                width: 32,
                height: 32,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: "white",
                  transform: "scale(1.1)",
                },
              }}
            >
              <Favorite
                color={
                  favoriteSermons.includes(sermon.id) ? "error" : "inherit"
                }
                sx={{ fontSize: 18 }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Content Section */}
        <CardContent
          sx={{
            p: 2,
            height: "180px",
            minHeight: "180px",
            maxHeight: "180px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 0,
            flexShrink: 0,
          }}
        >
          {/* Title and Description */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.3,
                mb: 1,
                height: "2.6em",
              }}
            >
              {sermon.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                lineHeight: 1.4,
                height: "2.8em",
                fontSize: "0.875rem",
              }}
            >
              {sermon.description}
            </Typography>
          </Box>

          {/* Pastor and Date */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 24, height: 24 }}>
                <Person sx={{ fontSize: 14 }} />
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sermon.pastor || sermon.speaker}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.7rem" }}
                >
                  {formatDate(sermon.date)}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Actions Row */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              label={sermon.series || "General"}
              size="small"
              color="primary"
              variant="outlined"
              sx={{
                fontWeight: 500,
                fontSize: "0.7rem",
                height: 24,
                maxWidth: "100px",
                "& .MuiChip-label": {
                  px: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Tooltip title="Open Video">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (sermon.videoUrl) {
                      window.open(sermon.videoUrl, "_blank");
                      showSnackbar("Opening video in new tab");
                    } else {
                      showSnackbar("No video link available", "error");
                    }
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      color: "primary.main",
                    },
                  }}
                >
                  <OpenInNew sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="Share Sermon">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(sermon);
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      color: "primary.main",
                    },
                  }}
                >
                  <Share sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>

              <Tooltip title="More Options">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentMenuSermon(sermon);
                    setMenuAnchorEl(e.currentTarget);
                  }}
                  sx={{
                    width: 28,
                    height: 28,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.1)",
                      color: "primary.main",
                    },
                  }}
                >
                  <MoreVert sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <>
      <Helmet>
        <title>Sermons - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Watch and listen to inspiring sermons from Christ Apostolic Church Hours of Mercy. Grow in faith with our sermon archive."
        />
      </Helmet>

      {/* Video Player Modal */}
      {selectedSermon && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 2,
          }}
          onClick={() => setSelectedSermon(null)}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "white",
              borderRadius: 4,
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Box sx={{ position: "relative" }}>
              <CardMedia
                component="img"
                height="250"
                image={
                  selectedSermon.thumbnail ||
                  selectedSermon.thumbnailUrl ||
                  "/api/placeholder/600/250"
                }
                alt={selectedSermon.title}
                sx={{ objectFit: "cover" }}
              />
              <IconButton
                onClick={() => setSelectedSermon(null)}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "rgba(0,0,0,0.7)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.9)" },
                }}
              >
                <Close />
              </IconButton>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                {selectedSermon.title}
              </Typography>

              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar>
                    <Person />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {selectedSermon.pastor || selectedSermon.speaker}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pastor
                    </Typography>
                  </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(selectedSermon.date)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedSermon.duration || "45 min"}
                  </Typography>
                </Box>
              </Stack>

              <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
                {selectedSermon.description}
              </Typography>

              <Stack direction="row" spacing={2}>
                {selectedSermon.videoUrl ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={() => {
                      window.open(selectedSermon.videoUrl, "_blank");
                      setSelectedSermon(null);
                    }}
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Watch on Facebook
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    size="large"
                    disabled
                    sx={{ borderRadius: 2, px: 4 }}
                  >
                    Video Unavailable
                  </Button>
                )}
                <IconButton
                  size="large"
                  onClick={() => toggleFavorite(selectedSermon.id)}
                  sx={{
                    bgcolor: favoriteSermons.includes(selectedSermon.id)
                      ? "error.50"
                      : "grey.100",
                  }}
                >
                  <Favorite
                    color={
                      favoriteSermons.includes(selectedSermon.id)
                        ? "error"
                        : "inherit"
                    }
                  />
                </IconButton>
                <IconButton
                  size="large"
                  onClick={() => handleShare(selectedSermon)}
                  sx={{ bgcolor: "grey.100" }}
                >
                  <Share />
                </IconButton>
              </Stack>
            </CardContent>
          </Box>
        </Box>
      )}

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={filterDrawer}
        onClose={() => setFilterDrawer(false)}
      >
        <Box
          sx={{
            width: 320,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: "1px solid",
              borderColor: "grey.200",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {showSeriesList ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => setShowSeriesList(false)}
                  sx={{ mr: 1 }}
                >
                  <ArrowBack />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Select Series
                </Typography>
              </Box>
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Filters
              </Typography>
            )}
            <IconButton onClick={() => setFilterDrawer(false)}>
              <Close />
            </IconButton>
          </Box>

          {/* Active Filter Display */}
          {activeFilter !== "all" && !showSeriesList && (
            <Box sx={{ p: 2, bgcolor: "primary.50" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{ fontWeight: 600 }}
                >
                  Active Filter: {getFilterDisplayName(activeFilter)}
                </Typography>
                <IconButton size="small" onClick={clearFilters} color="primary">
                  <Clear sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Box>
          )}

          {/* Content */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {showSeriesList ? (
              // Series List
              <List sx={{ p: 0 }}>
                {getUniqueSeries().map((series, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSeriesSelect(series)}
                    sx={{
                      py: 2,
                      px: 3,
                      borderBottom: "1px solid",
                      borderColor: "grey.100",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "primary.50",
                        transform: "translateX(8px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        borderLeft: "4px solid",
                        borderLeftColor: "primary.light",
                        "& .MuiListItemIcon-root": {
                          transform: "scale(1.1)",
                          color: "primary.main",
                        },
                        "& .MuiListItemText-primary": {
                          fontWeight: 600,
                          color: "primary.main",
                        },
                        "& .hover-chevron": {
                          opacity: 1,
                          transform: "translateX(4px)",
                        },
                      },
                      ...(selectedSeries === series && {
                        bgcolor: "primary.100",
                        borderLeft: "4px solid",
                        borderLeftColor: "primary.main",
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{ minWidth: 40, transition: "all 0.3s ease" }}
                    >
                      <Book
                        color={
                          selectedSeries === series ? "primary" : "inherit"
                        }
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={series}
                      secondary={`${
                        displaySermons.filter((s) => s.series === series).length
                      } sermons`}
                      primaryTypographyProps={{
                        fontWeight: selectedSeries === series ? 600 : 400,
                        color:
                          selectedSeries === series
                            ? "primary.main"
                            : "inherit",
                        transition: "all 0.3s ease",
                      }}
                    />
                    <ChevronRight
                      className="hover-chevron"
                      sx={{
                        opacity: selectedSeries === series ? 1 : 0.3,
                        transform:
                          selectedSeries === series
                            ? "translateX(4px)"
                            : "translateX(0)",
                        transition: "all 0.3s ease",
                        color:
                          selectedSeries === series
                            ? "primary.main"
                            : "text.secondary",
                      }}
                    />
                  </ListItem>
                ))}
                {getUniqueSeries().length === 0 && (
                  <Box sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="body2" color="text.secondary">
                      No sermon series available
                    </Typography>
                  </Box>
                )}
              </List>
            ) : (
              // Main Filter Categories
              <List sx={{ p: 0 }}>
                <ListItem
                  button
                  onClick={() => handleFilterSelect("recent")}
                  sx={{
                    py: 2.5,
                    px: 3,
                    borderBottom: "1px solid",
                    borderColor: "grey.100",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.50",
                      transform: "translateX(8px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.light",
                      "& .MuiListItemIcon-root": {
                        transform: "scale(1.15) rotate(-5deg)",
                        color: "primary.main",
                      },
                      "& .MuiListItemText-primary": {
                        fontWeight: 600,
                        color: "primary.main",
                      },
                      "& .hover-chevron": {
                        opacity: 1,
                        transform: "translateX(6px) scale(1.2)",
                      },
                    },
                    ...(activeFilter === "recent" && {
                      bgcolor: "primary.100",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.main",
                    }),
                  }}
                >
                  <ListItemIcon sx={{ transition: "all 0.3s ease" }}>
                    <CalendarToday
                      color={activeFilter === "recent" ? "primary" : "inherit"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Recent Sermons"
                    secondary="Last 30 days"
                    primaryTypographyProps={{
                      fontWeight: activeFilter === "recent" ? 600 : 400,
                      color:
                        activeFilter === "recent" ? "primary.main" : "inherit",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <ChevronRight
                    className="hover-chevron"
                    sx={{
                      opacity: activeFilter === "recent" ? 1 : 0.3,
                      transform:
                        activeFilter === "recent"
                          ? "translateX(6px) scale(1.2)"
                          : "translateX(0)",
                      transition: "all 0.3s ease",
                      color:
                        activeFilter === "recent"
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => handleFilterSelect("favorites")}
                  sx={{
                    py: 2.5,
                    px: 3,
                    borderBottom: "1px solid",
                    borderColor: "grey.100",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.50",
                      transform: "translateX(8px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.light",
                      "& .MuiListItemIcon-root": {
                        transform: "scale(1.15) rotate(-5deg)",
                        color: "error.main",
                      },
                      "& .MuiListItemText-primary": {
                        fontWeight: 600,
                        color: "primary.main",
                      },
                      "& .hover-chevron": {
                        opacity: 1,
                        transform: "translateX(6px) scale(1.2)",
                      },
                    },
                    ...(activeFilter === "favorites" && {
                      bgcolor: "primary.100",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.main",
                    }),
                  }}
                >
                  <ListItemIcon sx={{ transition: "all 0.3s ease" }}>
                    <Favorite
                      color={
                        activeFilter === "favorites" ? "primary" : "inherit"
                      }
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Favorites"
                    secondary={`${favoriteSermons.length} saved`}
                    primaryTypographyProps={{
                      fontWeight: activeFilter === "favorites" ? 600 : 400,
                      color:
                        activeFilter === "favorites"
                          ? "primary.main"
                          : "inherit",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <ChevronRight
                    className="hover-chevron"
                    sx={{
                      opacity: activeFilter === "favorites" ? 1 : 0.3,
                      transform:
                        activeFilter === "favorites"
                          ? "translateX(6px) scale(1.2)"
                          : "translateX(0)",
                      transition: "all 0.3s ease",
                      color:
                        activeFilter === "favorites"
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => handleFilterSelect("popular")}
                  sx={{
                    py: 2.5,
                    px: 3,
                    borderBottom: "1px solid",
                    borderColor: "grey.100",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.50",
                      transform: "translateX(8px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.light",
                      "& .MuiListItemIcon-root": {
                        transform: "scale(1.15) rotate(10deg)",
                        color: "success.main",
                      },
                      "& .MuiListItemText-primary": {
                        fontWeight: 600,
                        color: "primary.main",
                      },
                      "& .hover-chevron": {
                        opacity: 1,
                        transform: "translateX(6px) scale(1.2)",
                      },
                    },
                    ...(activeFilter === "popular" && {
                      bgcolor: "primary.100",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.main",
                    }),
                  }}
                >
                  <ListItemIcon sx={{ transition: "all 0.3s ease" }}>
                    <TrendingUp
                      color={activeFilter === "popular" ? "primary" : "inherit"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Most Popular"
                    secondary="Highly viewed"
                    primaryTypographyProps={{
                      fontWeight: activeFilter === "popular" ? 600 : 400,
                      color:
                        activeFilter === "popular" ? "primary.main" : "inherit",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <ChevronRight
                    className="hover-chevron"
                    sx={{
                      opacity: activeFilter === "popular" ? 1 : 0.3,
                      transform:
                        activeFilter === "popular"
                          ? "translateX(6px) scale(1.2)"
                          : "translateX(0)",
                      transition: "all 0.3s ease",
                      color:
                        activeFilter === "popular"
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  />
                </ListItem>

                <ListItem
                  button
                  onClick={() => handleFilterSelect("series")}
                  sx={{
                    py: 2.5,
                    px: 3,
                    borderBottom: "1px solid",
                    borderColor: "grey.100",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "primary.50",
                      transform: "translateX(8px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.light",
                      "& .MuiListItemIcon-root": {
                        transform: "scale(1.15) rotate(-3deg)",
                        color: "info.main",
                      },
                      "& .MuiListItemText-primary": {
                        fontWeight: 600,
                        color: "primary.main",
                      },
                      "& .hover-chevron": {
                        opacity: 1,
                        transform: "translateX(6px) scale(1.2)",
                      },
                    },
                    ...(activeFilter === "series" && {
                      bgcolor: "primary.100",
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.main",
                    }),
                  }}
                >
                  <ListItemIcon sx={{ transition: "all 0.3s ease" }}>
                    <Book
                      color={activeFilter === "series" ? "primary" : "inherit"}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="By Series"
                    secondary={`${getUniqueSeries().length} series available`}
                    primaryTypographyProps={{
                      fontWeight: activeFilter === "series" ? 600 : 400,
                      color:
                        activeFilter === "series" ? "primary.main" : "inherit",
                      transition: "all 0.3s ease",
                    }}
                  />
                  <ChevronRight
                    className="hover-chevron"
                    sx={{
                      opacity: activeFilter === "series" ? 1 : 0.3,
                      transform:
                        activeFilter === "series"
                          ? "translateX(6px) scale(1.2)"
                          : "translateX(0)",
                      transition: "all 0.3s ease",
                      color:
                        activeFilter === "series"
                          ? "primary.main"
                          : "text.secondary",
                    }}
                  />
                </ListItem>
              </List>
            )}
          </Box>

          {/* Footer Actions */}
          {!showSeriesList && (
            <Box sx={{ p: 3, borderTop: "1px solid", borderColor: "grey.200" }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={clearFilters}
                startIcon={<Clear />}
                disabled={activeFilter === "all"}
                sx={{ borderRadius: 2 }}
              >
                Clear All Filters
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <Container
        maxWidth="lg"
        sx={{
          py: 4,
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
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
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Error loading sermons
            </Typography>
            <Typography variant="body2">
              {error}. Please check your connection and try again.
            </Typography>
          </Alert>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* All Sermons Section */}
            <Box>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ fontWeight: 800, color: "text.primary" }}
                >
                  {activeFilter === "all"
                    ? "All Sermons"
                    : getFilterDisplayName(activeFilter)}
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: "600px", mx: "auto" }}
                >
                  {activeFilter === "all"
                    ? "Browse our complete collection of life-transforming messages"
                    : activeFilter === "recent"
                    ? "Latest sermons from the past 30 days"
                    : activeFilter === "favorites"
                    ? "Your saved favorite sermons"
                    : activeFilter === "popular"
                    ? "Our most viewed and impactful messages"
                    : selectedSeries
                    ? `Sermons from the "${selectedSeries}" series`
                    : "Choose a sermon series to explore"}
                </Typography>

                {/* Filter status and results count */}
                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Chip
                    label={`${filteredSermons.length} sermon${
                      filteredSermons.length !== 1 ? "s" : ""
                    } found`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                  {activeFilter !== "all" && (
                    <Button
                      size="small"
                      variant="text"
                      onClick={clearFilters}
                      startIcon={<Clear />}
                      sx={{ textTransform: "none" }}
                    >
                      Clear Filter
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Search and Filter Bar */}
              <SearchFilterBar />

              {/* Sermons Grid */}
              <Grid
                container
                spacing={3}
                sx={{
                  mt: 2,
                  // Force exactly 3 columns on large screens
                  "& .MuiGrid-item": {
                    display: "flex",
                    flexBasis: {
                      xs: "100%",
                      sm: "50%",
                      lg: "33.333333%",
                    },
                    maxWidth: {
                      xs: "100%",
                      sm: "50%",
                      lg: "33.333333%",
                    },
                  },
                }}
              >
                {filteredSermons.map((sermon, index) => (
                  <SermonCard key={sermon.id} sermon={sermon} index={index} />
                ))}
              </Grid>

              {/* No Results */}
              {filteredSermons.length === 0 && !loading && (
                <Paper
                  sx={{ p: 6, textAlign: "center", mt: 4, borderRadius: 3 }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No sermons found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search terms or browse all sermons.
                  </Typography>
                  {searchTerm && (
                    <Button
                      variant="outlined"
                      onClick={() => setSearchTerm("")}
                      sx={{ mt: 2 }}
                    >
                      Clear Search
                    </Button>
                  )}
                </Paper>
              )}
            </Box>
          </>
        )}
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
        onClick={() => setFilterDrawer(true)}
      >
        <MenuIcon />
      </Fab>

      {/* Sermon Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            if (currentMenuSermon?.videoUrl) {
              window.open(currentMenuSermon.videoUrl, "_blank");
            }
            handleMenuClose();
          }}
        >
          <OpenInNew sx={{ mr: 1, fontSize: 18 }} />
          Watch Video
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleShare(currentMenuSermon);
            handleMenuClose();
          }}
        >
          <Share sx={{ mr: 1, fontSize: 18 }} />
          Share Sermon
        </MenuItem>
        <MenuItem
          onClick={() => {
            toggleFavorite(currentMenuSermon?.id);
            handleMenuClose();
          }}
        >
          <Favorite
            sx={{
              mr: 1,
              fontSize: 18,
              color: favoriteSermons.includes(currentMenuSermon?.id)
                ? "error.main"
                : "inherit",
            }}
          />
          {favoriteSermons.includes(currentMenuSermon?.id)
            ? "Remove from Favorites"
            : "Add to Favorites"}
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (currentMenuSermon?.videoUrl) {
              handleCopyLink(currentMenuSermon);
            }
            handleMenuClose();
          }}
        >
          <Download sx={{ mr: 1, fontSize: 18 }} />
          Copy Link
        </MenuItem>
      </Menu>

      {/* Snackbar for user feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor:
              snackbar.severity === "error" ? "error.main" : "success.main",
            color: "white",
            borderRadius: 2,
            fontWeight: 500,
          },
        }}
      />
    </>
  );
};

export default SermonPage;
