import React from "react";
import { Box, Typography, Container } from "@mui/material";

const StaffDirectoryTest = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Staff Directory Test
        </Typography>
        <Typography variant="body1">
          This is a test version to ensure the page loads correctly.
        </Typography>
      </Box>
    </Container>
  );
};

export default StaffDirectoryTest;
