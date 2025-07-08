// Admin Page for Database Management
import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from "@mui/material";
import {
  AdminPanelSettings,
  CloudUpload,
  Group,
  Event,
  RecordVoiceOver,
  FavoriteOutlined,
  Email,
  Analytics,
  Settings,
  Security,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import DatabaseSeeder from "../components/DatabaseSeeder";
import CloudFunctionsTest from "../components/CloudFunctionsTest";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const AdminPage = () => {
  const adminFeatures = [
    {
      title: "Staff Management",
      icon: <Group />,
      description: "Add, edit, and manage church staff members",
      status: "Ready",
    },
    {
      title: "Event Management",
      icon: <Event />,
      description: "Create and manage church events and calendar",
      status: "Ready",
    },
    {
      title: "Sermon Library",
      icon: <RecordVoiceOver />,
      description: "Upload and organize sermon recordings",
      status: "Ready",
    },
    {
      title: "Prayer Requests",
      icon: <FavoriteOutlined />,
      description: "View and manage prayer requests",
      status: "Ready",
    },
    {
      title: "Newsletter Management",
      icon: <Email />,
      description: "Manage newsletter subscriptions",
      status: "Ready",
    },
    {
      title: "Analytics",
      icon: <Analytics />,
      description: "View website and engagement analytics",
      status: "Coming Soon",
    },
  ];

  const quickActions = [
    "View all prayer requests",
    "Manage upcoming events",
    "Upload new sermon",
    "Export newsletter subscribers",
    "Generate attendance reports",
    "Update staff directory",
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Administrative dashboard for church management"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Hero Section */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: "center" }}
          >
            <AdminPanelSettings sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Admin Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Manage your church website and database
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Security Notice */}
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <strong>🔒 Admin Access:</strong> This page contains sensitive
            administrative functions. Only authorized personnel should access
            this area.
          </Typography>
        </Alert>

        {/* Database Seeder Section */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mb: 6 }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Database Management
          </Typography>
          <DatabaseSeeder />
        </MotionBox>

        <Divider sx={{ my: 6 }} />

        {/* Cloud Functions Test Section */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mb: 6 }}
        >
          <CloudFunctionsTest />
        </MotionBox>

        <Divider sx={{ my: 6 }} />

        {/* Admin Features Overview */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mb: 6 }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Administrative Features
          </Typography>
          <Grid container spacing={3}>
            {adminFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Box sx={{ mr: 2, color: "primary.main" }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {feature.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            feature.status === "Ready"
                              ? "success.main"
                              : "warning.main",
                          fontWeight: 600,
                        }}
                      >
                        {feature.status}
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={feature.status !== "Ready"}
                      >
                        Manage
                      </Button>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </MotionBox>

        {/* Quick Actions */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Settings sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Quick Actions
                  </Typography>
                </Box>
                <List dense>
                  {quickActions.map((action, index) => (
                    <ListItem key={index} button sx={{ borderRadius: 1 }}>
                      <ListItemText primary={action} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Security sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Security & Backup
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Your Firebase database is automatically backed up and secured
                  with Google's enterprise-grade security.
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <CloudUpload sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Automatic backups"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security sx={{ fontSize: 16 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Encrypted data storage"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Firebase Console Link */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mt: 6, textAlign: "center" }}
        >
          <Card sx={{ bgcolor: "primary.light", color: "white" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Firebase Console Access
              </Typography>
              <Typography variant="body2" paragraph>
                For advanced database management, visit your Firebase Console
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                href="https://console.firebase.google.com/project/the-project-f1728"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Firebase Console
              </Button>
            </CardContent>
          </Card>
        </MotionBox>
      </Container>
    </>
  );
};

export default AdminPage;
