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
  Close,
  Menu,
  ChevronRight,
  AccessTime,
  Star,
} from "@mui/icons-material";
import { useSermons, useConfig } from "../hooks/useFirestore";

const SermonPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSermon, setSelectedSermon] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [featuredSermon, setFeaturedSermon] = useState(null);
  const [favoriteSermons, setFavoriteSermons] = useState([]);

  // Firebase hooks
  const { sermons, loading, error } = useSermons(20);
  const { config: sermonSeries } = useConfig("sermon_series");

  const displaySermons = sermons || [];

  // Set featured sermon
  useEffect(() => {
    if (displaySermons.length > 0) {
      setFeaturedSermon(displaySermons[0]);
    }
  }, [displaySermons]);

  const series = sermonSeries || [
    {
      name: "Hours of Grace",
      count: 8,
      description: "Exploring God's mercy and grace in our daily lives",
      color: "#1976d2",
    },
    {
      name: "Foundations of Faith",
      count: 12,
      description: "Building strong spiritual foundations",
      color: "#d32f2f",
    },
    {
      name: "Living Like Jesus",
      count: 6,
      description: "Practical Christianity in action",
      color: "#388e3c",
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleFavorite = (sermonId) => {
    setFavoriteSermons((prev) =>
      prev.includes(sermonId)
        ? prev.filter((id) => id !== sermonId)
        : [...prev, sermonId]
    );
  };

  // Featured Sermon Hero Section
  const FeaturedSermonHero = () => {
    if (!featuredSermon) return null;

    return (
      <Box
        sx={{
          position: "relative",
          height: { xs: "50vh", md: "60vh" },
          borderRadius: 4,
          overflow: "hidden",
          mb: 6,
          background: `linear-gradient(135deg, rgba(25,118,210,0.9), rgba(21,101,192,0.8)), url(${
            featuredSermon.thumbnail || "/api/placeholder/1200/600"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Chip
                label="Featured Sermon"
                color="secondary"
                sx={{ mb: 2, fontWeight: 600 }}
              />
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2rem", md: "3rem" },
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  lineHeight: 1.2,
                  mb: 2,
                }}
              >
                {featuredSermon.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  mb: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar sx={{ width: 40, height: 40 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {featuredSermon.pastor || featuredSermon.speaker}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CalendarToday sx={{ fontSize: 20 }} />
                  <Typography variant="body1">
                    {formatDate(featuredSermon.date)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime sx={{ fontSize: 20 }} />
                  <Typography variant="body1">
                    {featuredSermon.duration || "45 min"}
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  maxWidth: "600px",
                  lineHeight: 1.6,
                  mb: 4,
                  fontWeight: 300,
                }}
              >
                {featuredSermon.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => setSelectedSermon(featuredSermon)}
                  sx={{
                    bgcolor: "white",
                    color: "primary.main",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  Watch Now
                </Button>
                <IconButton
                  size="large"
                  onClick={() => toggleFavorite(featuredSermon.id)}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  <Favorite
                    color={
                      favoriteSermons.includes(featuredSermon.id)
                        ? "error"
                        : "inherit"
                    }
                  />
                </IconButton>
                <IconButton
                  size="large"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.3)",
                    },
                  }}
                >
                  <Share />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  };

  // Series Showcase Section
  const SeriesShowcase = () => (
    <Box sx={{ mb: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 800, color: "text.primary" }}
        >
          Sermon Series
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto" }}
        >
          Dive deep into structured teachings that build upon each other for
          comprehensive spiritual growth
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {series.map((serie, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  height: 200,
                  background: `linear-gradient(135deg, ${serie.color}CC, ${serie.color}99)`,
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <Box sx={{ textAlign: "center", p: 3 }}>
                  <Book sx={{ fontSize: 50, mb: 2, opacity: 0.9 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {serie.name}
                  </Typography>
                </Box>
                <Chip
                  label={`${serie.count} Messages`}
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    bgcolor: "rgba(255,255,255,0.9)",
                    color: "text.primary",
                    fontWeight: 600,
                  }}
                />
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ lineHeight: 1.6 }}
                >
                  {serie.description}
                </Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setSearchTerm(serie.name)}
                  sx={{ mt: 3, borderRadius: 2, fontWeight: 600 }}
                  endIcon={<ChevronRight />}
                >
                  Explore Series
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

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
    <Grid item xs={12} sm={6} lg={4} key={sermon.id}>
      <Card
        sx={{
          height: "100%",
          cursor: "pointer",
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
          },
        }}
        onClick={() => setSelectedSermon(sermon)}
      >
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="200"
            image={
              sermon.thumbnail ||
              sermon.thumbnailUrl ||
              "/api/placeholder/400/250"
            }
            alt={sermon.title}
            sx={{ objectFit: "cover" }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)",
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
                "&:hover": { bgcolor: "primary.dark", transform: "scale(1.1)" },
              }}
            >
              <PlayArrow sx={{ fontSize: 40 }} />
            </IconButton>
          </Box>
          <Chip
            label={sermon.duration || "45 min"}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              bgcolor: "rgba(0,0,0,0.8)",
              color: "white",
              fontWeight: 600,
            }}
          />
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(sermon.id);
            }}
            sx={{
              position: "absolute",
              top: 12,
              left: 12,
              bgcolor: "rgba(255,255,255,0.9)",
              "&:hover": { bgcolor: "white" },
            }}
          >
            <Favorite
              color={favoriteSermons.includes(sermon.id) ? "error" : "inherit"}
              sx={{ fontSize: 20 }}
            />
          </IconButton>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.3,
              mb: 2,
            }}
          >
            {sermon.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              <Person sx={{ fontSize: 18 }} />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {sermon.pastor || sermon.speaker}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(sermon.date)}
              </Typography>
            </Box>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              lineHeight: 1.5,
              mb: 2,
            }}
          >
            {sermon.description}
          </Typography>

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
              sx={{ fontWeight: 500 }}
            />
            <Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (sermon.videoUrl) {
                    window.open(sermon.videoUrl, "_blank");
                  }
                }}
              >
                <OpenInNew sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle share
                }}
              >
                <Share sx={{ fontSize: 18 }} />
              </IconButton>
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
                <IconButton size="large" sx={{ bgcolor: "grey.100" }}>
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
        <Box sx={{ width: 300, p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setFilterDrawer(false)}>
              <Close />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <List>
            <ListItem button>
              <ListItemIcon>
                <CalendarToday />
              </ListItemIcon>
              <ListItemText primary="Recent Sermons" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Favorite />
              </ListItemIcon>
              <ListItemText primary="Favorites" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Star />
              </ListItemIcon>
              <ListItemText primary="Most Popular" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <Book />
              </ListItemIcon>
              <ListItemText primary="By Series" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="xl" sx={{ py: 4 }}>
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
            {/* Featured Sermon Hero */}
            <FeaturedSermonHero />

            {/* Series Showcase */}
            <SeriesShowcase />

            {/* All Sermons Section */}
            <Box>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ fontWeight: 800, color: "text.primary" }}
                >
                  All Sermons
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: "600px", mx: "auto" }}
                >
                  Browse our complete collection of life-transforming messages
                </Typography>
              </Box>

              {/* Search and Filter Bar */}
              <SearchFilterBar />

              {/* Sermons Grid */}
              <Grid container spacing={4}>
                {filteredSermons.map((sermon, index) => (
                  <SermonCard key={sermon.id} sermon={sermon} index={index} />
                ))}
              </Grid>

              {/* No Results */}
              {filteredSermons.length === 0 && (
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
        <Menu />
      </Fab>
    </>
  );
};

export default SermonPage;
