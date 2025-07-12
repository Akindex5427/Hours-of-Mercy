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
} from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import { useSermons, useConfig } from "../hooks/useFirestore";

const SermonPage = () => {
  // Firebase hooks
  const { sermons, loading, error } = useSermons(20);

  console.log("SermonPage Render:", { sermons, loading, error });

  return (
    <div>
      <Helmet>
        <title>Sermons - Christ Apostolic Church Hours of Mercy</title>
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{ textAlign: "center", mb: 4 }}
        >
          Sermons
        </Typography>

        {/* Always show this basic text */}
        <Box sx={{ mb: 4, p: 3, bgcolor: "lightblue", borderRadius: 2 }}>
          <Typography variant="h6">Page is rendering!</Typography>
          <Typography>Loading: {loading ? "Yes" : "No"}</Typography>
          <Typography>Error: {error || "None"}</Typography>
          <Typography>Sermons: {sermons?.length || 0}</Typography>
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading sermons...
            </Typography>
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            Error: {error}
          </Alert>
        )}

        {/* Content */}
        {!loading && !error && (
          <Box>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
              Found {sermons?.length || 0} sermons
            </Typography>

            {/* Basic sermon list */}
            {sermons && sermons.length > 0 && (
              <Box sx={{ mt: 4 }}>
                {sermons.slice(0, 6).map((sermon, index) => (
                  <Card key={sermon.id || index} sx={{ mb: 3, p: 2 }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        {sermon.title || `Sermon ${index + 1}`}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        gutterBottom
                      >
                        Pastor: {sermon.pastor || sermon.speaker || "Unknown"}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Date: {sermon.date || "No date available"}
                      </Typography>
                      {sermon.description && (
                        <Typography variant="body1" paragraph>
                          {sermon.description}
                        </Typography>
                      )}
                      {sermon.videoUrl && (
                        <Button
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={() => window.open(sermon.videoUrl, "_blank")}
                          sx={{ mt: 2 }}
                        >
                          Watch Video
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* No sermons message */}
            {sermons && sermons.length === 0 && (
              <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
                No sermons available at the moment.
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </div>
  );
};

export default SermonPage;
