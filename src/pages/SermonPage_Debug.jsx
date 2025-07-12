import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSermons, useConfig } from "../hooks/useFirestore";

const SermonPage = () => {
  const [selectedSermon, setSelectedSermon] = useState(null);

  // Firebase hooks
  const { sermons, loading, error } = useSermons(20);
  const { config: sermonSeries } = useConfig("sermon_series");

  console.log("SermonPage Debug:", { sermons, loading, error, sermonSeries });

  return (
    <>
      <Helmet>
        <title>Sermons - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Watch and listen to inspiring sermons from Christ Apostolic Church Hours of Mercy. Grow in faith with our sermon archive."
        />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Debug Information */}
        <Box sx={{ mb: 4, p: 3, bgcolor: "grey.100", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Debug Information:
          </Typography>
          <Typography variant="body2">
            Loading: {loading ? "Yes" : "No"}
          </Typography>
          <Typography variant="body2">Error: {error || "None"}</Typography>
          <Typography variant="body2">
            Sermons Count: {sermons?.length || 0}
          </Typography>
          <Typography variant="body2">
            Series Config: {sermonSeries ? "Loaded" : "Not loaded"}
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

        {/* Content when not loading */}
        {!loading && !error && (
          <Box>
            <Typography variant="h2" gutterBottom sx={{ textAlign: "center" }}>
              Sermons Page
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center", mb: 4 }}>
              Found {sermons?.length || 0} sermons
            </Typography>

            {/* Simple sermon list */}
            {sermons && sermons.length > 0 ? (
              <Box>
                {sermons.slice(0, 3).map((sermon, index) => (
                  <Box
                    key={sermon.id || index}
                    sx={{
                      p: 3,
                      mb: 2,
                      border: "1px solid",
                      borderColor: "grey.300",
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {sermon.title || "Untitled Sermon"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pastor: {sermon.pastor || sermon.speaker || "Unknown"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {sermon.date || "No date"}
                    </Typography>
                    {sermon.description && (
                      <Typography variant="body1" sx={{ mt: 1 }}>
                        {sermon.description}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                No sermons available
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </>
  );
};

export default SermonPage;
