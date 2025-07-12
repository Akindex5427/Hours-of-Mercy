import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Email, Phone, Person } from "@mui/icons-material";
import { useStaff } from "../hooks/useFirestore";

const StaffDirectory = () => {
  // Firebase hooks
  const { staff, loading, error } = useStaff();

  // Static fallback data
  const staticStaff = [
    {
      id: 1,
      name: "Peter Olawale Sunday",
      title: "Senior Pastor",
      department: "Leadership",
      email: "pastor.olawale@hoursofmercy.org",
      phone: "(773) 977-9630",
      bio: "Pastor Olawale has been serving Christ Apostolic Church Hours of Mercy for over 15 years.",
    },
    {
      id: 2,
      name: "Pastor Mary Johnson",
      title: "Associate Pastor",
      department: "Pastoral Care",
      email: "pastor.mary@hoursofmercy.org",
      phone: "(708) 555-0125",
      bio: "Pastor Mary oversees our pastoral care ministry and women's fellowship.",
    },
  ];

  // Use Firebase data if available, otherwise use static data
  const displayStaff = staff && staff.length > 0 ? staff : staticStaff;

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <>
      <Helmet>
        <title>Staff Directory - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Meet our dedicated pastoral team and staff at Christ Apostolic Church Hours of Mercy."
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Our Staff
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Meet the dedicated team serving our church family
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Error display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Error loading staff data: {error}
          </Alert>
        )}

        {/* Staff Cards */}
        <Grid container spacing={4}>
          {displayStaff.map((member, index) => (
            <Grid item xs={12} md={6} key={member.id}>
              <Card
                sx={{
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mr: 3,
                        bgcolor: "primary.main",
                        fontSize: "1.5rem",
                      }}
                    >
                      {member.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary.main"
                        sx={{ fontWeight: 500 }}
                      >
                        {member.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {member.department}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Bio */}
                  <Typography variant="body2" paragraph>
                    {member.bio}
                  </Typography>

                  {/* Contact Info */}
                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Email
                        sx={{ mr: 1, fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {member.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Phone
                        sx={{ mr: 1, fontSize: 16, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {member.phone}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* No staff message */}
        {displayStaff.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" gutterBottom>
              No staff members found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Staff information will be available soon.
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
};

export default StaffDirectory;
