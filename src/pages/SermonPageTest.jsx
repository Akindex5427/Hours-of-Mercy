import React from "react";
import { Container, Typography, Box } from "@mui/material";

const SermonPageTest = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" gutterBottom>
        Test Sermon Page
      </Typography>
      <Typography variant="body1">
        This is a test to see if the page renders correctly.
      </Typography>
    </Container>
  );
};

export default SermonPageTest;
