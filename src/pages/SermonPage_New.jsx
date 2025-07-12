import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { PlayArrow, Person, CalendarToday } from "@mui/icons-material";
import { useSermons, useConfig } from "../hooks/useFirestore";

const SermonPage = () => {
  // Firebase hooks
  const { sermons, loading, error } = useSermons(20);
  const { config: sermonSeries } = useConfig("sermon_series");

  console.log("SermonPage Hybrid:", { sermons, loading, error, sermonSeries });

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
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

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Page Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontWeight: 800, color: "primary.main" }}
          >
            Sermons
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "600px", mx: "auto" }}
          >
            Discover life-transforming messages from Christ Apostolic Church
            Hours of Mercy
          </Typography>
        </Box>

        {/* Loading State */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "40vh",
              gap: 3,
            }}
          >
            <CircularProgress size={60} thickness={4} />
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

        {/* Content when not loading */}
        {!loading && !error && (
          <Box>
            {/* Featured Sermon */}
            {sermons && sermons.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 700, mb: 3 }}
                >
                  Featured Sermon
                </Typography>
                <Card
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    maxHeight: 400,
                  }}
                >
                  <Box sx={{ position: "relative", height: 400 }}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={
                        sermons[0].thumbnail ||
                        sermons[0].thumbnailUrl ||
                        "https://via.placeholder.com/800x400/2c5530/ffffff?text=Featured+Sermon"
                      }
                      alt={sermons[0].title}
                      sx={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
                        color: "white",
                        p: 4,
                      }}
                    >
                      <Typography
                        variant="h3"
                        gutterBottom
                        sx={{
                          fontWeight: 700,
                          textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        {sermons[0].title}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 3 }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 40,
                            height: 40,
                          }}
                        >
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {sermons[0].pastor ||
                              sermons[0].speaker ||
                              "Pastor"}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {formatDate(sermons[0].date)}
                          </Typography>
                        </Box>
                      </Stack>
                      {sermons[0].videoUrl && (
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<PlayArrow />}
                          onClick={() =>
                            window.open(sermons[0].videoUrl, "_blank")
                          }
                          sx={{
                            mt: 2,
                            backgroundColor: "white",
                            color: "primary.main",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "grey.100",
                            },
                          }}
                        >
                          Watch Sermon
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Card>
              </Box>
            )}

            {/* All Sermons Grid */}
            <Box>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 700, mb: 4 }}
              >
                All Sermons ({sermons?.length || 0})
              </Typography>

              {sermons && sermons.length > 0 ? (
                <Grid container spacing={3}>
                  {sermons.map((sermon, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={sermon.id || index}
                    >
                      <Card
                        sx={{
                          height: 360,
                          borderRadius: 2,
                          overflow: "hidden",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                          },
                        }}
                      >
                        {/* Thumbnail Image */}
                        <Box
                          sx={{
                            height: 180,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="180"
                            image={
                              sermon.thumbnail ||
                              sermon.thumbnailUrl ||
                              "https://via.placeholder.com/320x180/2c5530/ffffff?text=Sermon"
                            }
                            alt={sermon.title}
                            sx={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                              },
                            }}
                          />
                          {/* Play Button Overlay */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "rgba(0,0,0,0.4)",
                              opacity: 0,
                              transition: "opacity 0.3s ease",
                              "&:hover": { opacity: 1 },
                            }}
                          >
                            <Box
                              sx={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                backgroundColor: "rgba(255,255,255,0.9)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                              }}
                            >
                              <PlayArrow
                                sx={{ color: "primary.main", fontSize: 28 }}
                              />
                            </Box>
                          </Box>
                        </Box>

                        {/* Card Content */}
                        <CardContent sx={{ p: 2, height: 180 }}>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            sx={{
                              fontWeight: 600,
                              lineHeight: 1.3,
                              fontSize: "0.95rem",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              mb: 1.5,
                              minHeight: 50,
                            }}
                          >
                            {sermon.title || "Untitled Sermon"}
                          </Typography>

                          {/* Pastor Info */}
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1.5 }}
                          >
                            <Avatar
                              sx={{
                                width: 24,
                                height: 24,
                                bgcolor: "primary.main",
                                fontSize: 12,
                              }}
                            >
                              <Person sx={{ fontSize: 14 }} />
                            </Avatar>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  fontSize: "0.8rem",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {sermon.pastor || sermon.speaker || "Pastor"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: "0.75rem" }}
                              >
                                {formatDate(sermon.date)}
                              </Typography>
                            </Box>
                          </Stack>

                          {/* Description */}
                          {sermon.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                fontSize: "0.8rem",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: 1.4,
                                mb: 2,
                              }}
                            >
                              {sermon.description}
                            </Typography>
                          )}

                          {/* Bottom Actions */}
                          <Box
                            sx={{
                              position: "absolute",
                              bottom: 16,
                              left: 16,
                              right: 16,
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
                              sx={{ fontSize: "0.7rem", height: 24 }}
                            />
                            {sermon.videoUrl && (
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<PlayArrow sx={{ fontSize: 14 }} />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(sermon.videoUrl, "_blank");
                                }}
                                sx={{
                                  fontSize: "0.7rem",
                                  py: 0.5,
                                  px: 1,
                                  minWidth: "auto",
                                }}
                              >
                                Watch
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No sermons available at the moment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Please check back later for new sermons.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
};

export default SermonPage;
