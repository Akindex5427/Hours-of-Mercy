import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Paper,
  IconButton,
} from "@mui/material";
import { PlayArrow } from "@mui/icons-material";

// Test component to demonstrate the square sermon image layout
const SermonImageTest = () => {
  const sampleSermons = [
    {
      id: 1,
      title: "Walking in Faith",
      thumbnailUrl:
        "https://via.placeholder.com/400x300/1976d2/ffffff?text=Walking+in+Faith",
      duration: "45:30",
      pastor: "Pastor Smith",
    },
    {
      id: 2,
      title: "God's Grace",
      thumbnailUrl:
        "https://via.placeholder.com/600x400/d32f2f/ffffff?text=God's+Grace",
      duration: "38:15",
      pastor: "Pastor Johnson",
    },
    {
      id: 3,
      title: "Power of Prayer",
      thumbnailUrl:
        "https://via.placeholder.com/300x500/388e3c/ffffff?text=Power+of+Prayer",
      duration: "52:00",
      pastor: "Pastor Williams",
    },
  ];

  return (
    <Paper sx={{ p: 4, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Square Sermon Image Layout Test
      </Typography>

      <Typography variant="body1" paragraph>
        This demonstrates how sermon thumbnails are displayed in square format
        with proper image cropping and overlay positioning.
      </Typography>

      <Grid container spacing={3}>
        {sampleSermons.map((sermon) => (
          <Grid item xs={12} sm={6} md={4} key={sermon.id}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
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

              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {sermon.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {sermon.pastor}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: "grey.100", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Square Image Layout Features:
        </Typography>
        <Typography variant="body2" component="div">
          <ul>
            <li>
              <strong>Square aspect ratio:</strong> Uses paddingTop: 100% to
              create perfect squares
            </li>
            <li>
              <strong>Full image display:</strong> objectFit: "cover" ensures
              the entire image fills the container
            </li>
            <li>
              <strong>Centered cropping:</strong> objectPosition: "center"
              centers the image if cropping is needed
            </li>
            <li>
              <strong>Proper overlays:</strong> Duration and play button
              positioned relative to the image container
            </li>
            <li>
              <strong>Responsive:</strong> Works on all screen sizes while
              maintaining square proportions
            </li>
          </ul>
        </Typography>
      </Box>
    </Paper>
  );
};

export default SermonImageTest;
