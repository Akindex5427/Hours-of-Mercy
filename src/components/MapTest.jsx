import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import GoogleMap from "./GoogleMap";

// Test component to verify Google Maps integration
const MapTest = () => {
  const [showMap, setShowMap] = React.useState(false);

  return (
    <Paper sx={{ p: 4, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Google Maps Integration Test
      </Typography>

      <Typography variant="body1" paragraph>
        This component tests the Google Maps integration for the church
        location.
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowMap(!showMap)}
        sx={{ mb: 3 }}
      >
        {showMap ? "Hide Map" : "Show Map"}
      </Button>

      {showMap && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Christ Apostolic Church Hours of Mercy
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            14801 Lincoln Ave, Dolton, Illinois 60419
          </Typography>

          <GoogleMap
            address="14801 Lincoln Ave, Dolton, Illinois 60419"
            churchName="Christ Apostolic Church Hours of Mercy"
            height={400}
            zoom={16}
          />

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Map should show the church location with a custom marker and info
              window. Click the marker for more details and directions.
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default MapTest;
