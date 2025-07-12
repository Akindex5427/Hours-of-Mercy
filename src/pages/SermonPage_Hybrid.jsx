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
                  sx={{ borderRadius: 4, overflow: "hidden", boxShadow: 3 }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={
                        sermons[0].thumbnail ||
                        sermons[0].thumbnailUrl ||
                        "/api/placeholder/800/300"
                      }
                      alt={sermons[0].title}
                      sx={{ objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                        color: "white",
                        p: 4,
                      }}
                    >
                      <Typography
                        variant="h3"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                      >
                        {sermons[0].title}
                      </Typography>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          <Person />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {sermons[0].pastor ||
                              sermons[0].speaker ||
                              "Pastor"}
                          </Typography>
                          <Typography variant="body2">
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
                          sx={{ mt: 2 }}
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
                sx={{ fontWeight: 700, mb: 3 }}
              >
                All Sermons ({sermons?.length || 0})
              </Typography>

              {sermons && sermons.length > 0 ? (
                <Grid container spacing={4}>
                  {sermons.map((sermon, index) => (
                    <Grid item xs={12} sm={6} md={4} key={sermon.id || index}>
                      <Card
                        sx={{
                          height: "100%",
                          borderRadius: 3,
                          overflow: "hidden",
                          transition:
                            "transform 0.2s ease, box-shadow 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 4,
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={
                            sermon.thumbnail ||
                            sermon.thumbnailUrl ||
                            "/api/placeholder/400/200"
                          }
                          alt={sermon.title}
                          sx={{ objectFit: "cover" }}
                        />
                        <CardContent sx={{ p: 3 }}>
                          <Typography
                            variant="h6"
                            gutterBottom
                            sx={{ fontWeight: 700, lineHeight: 1.3 }}
                          >
                            {sermon.title || "Untitled Sermon"}
                          </Typography>

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
                                bgcolor: "primary.main",
                              }}
                            >
                              <Person sx={{ fontSize: 18 }} />
                            </Avatar>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {sermon.pastor || sermon.speaker || "Pastor"}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatDate(sermon.date)}
                              </Typography>
                            </Box>
                          </Stack>

                          {sermon.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                mb: 2,
                              }}
                            >
                              {sermon.description}
                            </Typography>
                          )}

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Chip
                              label={sermon.series || "General"}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            {sermon.videoUrl && (
                              <Button
                                size="small"
                                startIcon={<PlayArrow />}
                                onClick={() =>
                                  window.open(sermon.videoUrl, "_blank")
                                }
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
