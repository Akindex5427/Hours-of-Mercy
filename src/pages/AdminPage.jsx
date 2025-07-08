// Admin Page for Database Management
import React, { useState } from "react";
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
  Alert,
  Tab,
  Tabs,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
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
  ContactMail,
  Edit,
  Delete,
  Add,
  Assessment,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import AdminGuard from "../components/AdminGuard";
import DatabaseSeeder from "../components/DatabaseSeeder";
import CloudFunctionsTest from "../components/CloudFunctionsTest";
import AuditLogsViewer from "../components/AuditLogsViewer";
import {
  useMembers,
  useContactSubmissions,
  usePrayerRequests,
  useAuth,
} from "../hooks/useFirestore";
import { logAuditEvent } from "../firebase/audit";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Members Management Component
const MembersManagement = () => {
  const { members, loading, updateMemberStatus, deleteMember } = useMembers();

  const handleDeleteMember = async (uid) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const member = members.find((m) => m.id === uid);
        await deleteMember(uid);
        // Log member deletion
        await logAuditEvent.memberDeleted(uid, member?.email || "unknown");
      } catch (error) {
        console.error("Failed to delete member:", error);
      }
    }
  };

  if (loading) return <Typography>Loading members...</Typography>;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5">Church Members ({members.length})</Typography>
        <Button variant="contained" startIcon={<Add />}>
          Add Member
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  {member.firstName} {member.lastName}
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phone || "Not provided"}</TableCell>
                <TableCell>
                  <Chip
                    label={member.membershipStatus || "Active"}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(
                    member.createdAt?.seconds * 1000
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Contact Submissions Management Component
const ContactManagement = () => {
  const { submissions, loading, updateStatus } = useContactSubmissions();

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus(id, status);
      // Log contact status update
      await logAuditEvent.contactUpdated(id, status);
    } catch (error) {
      console.error("Failed to update contact status:", error);
    }
  };

  if (loading) return <Typography>Loading contact submissions...</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Contact Submissions ({submissions.length})
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.subject}</TableCell>
                <TableCell>
                  <Chip
                    label={submission.status || "New"}
                    color={
                      submission.status === "resolved" ? "success" : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(
                    submission.submittedAt?.seconds * 1000
                  ).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() =>
                      handleStatusUpdate(submission.id, "resolved")
                    }
                    disabled={submission.status === "resolved"}
                  >
                    Mark Resolved
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

// Prayer Requests Management Component
const PrayerRequestsManagement = () => {
  const { prayerRequests, loading } = usePrayerRequests();

  if (loading) return <Typography>Loading prayer requests...</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Prayer Requests ({prayerRequests.length})
      </Typography>

      <Grid container spacing={2}>
        {prayerRequests.map((request) => (
          <Grid item xs={12} md={6} key={request.id}>
            <Card>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="start"
                  mb={2}
                >
                  <Typography variant="h6">
                    {request.requestType === "personal" ? "Personal" : "Other"}
                  </Typography>
                  <Chip
                    label={request.isUrgent ? "Urgent" : "Regular"}
                    color={request.isUrgent ? "error" : "default"}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>From:</strong> {request.name} ({request.email})
                </Typography>
                <Typography variant="body1" paragraph>
                  {request.prayerRequest}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Submitted:{" "}
                  {new Date(
                    request.submittedAt?.seconds * 1000
                  ).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// Main Admin Page Component
const AdminPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Log admin login when component mounts
  React.useEffect(() => {
    logAuditEvent.adminLogin();
  }, []);

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
    <AdminGuard>
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Grid container alignItems="center" spacing={3}>
              <Grid item>
                <AdminPanelSettings sx={{ fontSize: 60 }} />
              </Grid>
              <Grid item xs>
                <Typography variant="h3" component="h1" gutterBottom>
                  Admin Dashboard
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Welcome, {user?.displayName || user?.email}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mt: 1 }}>
                  Manage church operations and data
                </Typography>
              </Grid>
            </Grid>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Security Notice */}
        <Alert severity="warning" sx={{ mb: 4 }}>
          <Typography variant="body2">
            <Security sx={{ mr: 1, verticalAlign: "middle" }} />
            <strong>Security Notice:</strong> You have access to sensitive
            church data and administrative functions. Only authorized personnel
            should access this area. All actions are logged for security
            purposes.
          </Typography>
        </Alert>

        {/* Navigation Tabs */}
        <Paper elevation={1} sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab icon={<Group />} label="Members" />
            <Tab icon={<ContactMail />} label="Contact Forms" />
            <Tab icon={<FavoriteOutlined />} label="Prayer Requests" />
            <Tab icon={<CloudUpload />} label="Database Tools" />
            <Tab icon={<Settings />} label="Cloud Functions" />
            <Tab icon={<Assessment />} label="Audit Logs" />
            <Tab icon={<Analytics />} label="Overview" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <MembersManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <ContactManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <PrayerRequestsManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <DatabaseSeeder />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <CloudFunctionsTest />
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <AuditLogsViewer />
        </TabPanel>

        <TabPanel value={tabValue} index={6}>
          {/* Overview Tab */}
          <Typography variant="h4" component="h2" gutterBottom>
            Admin Dashboard Overview
          </Typography>

          {/* Quick Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {adminFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <MotionCard
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  sx={{ height: "100%" }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {feature.icon}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary" paragraph>
                      {feature.description}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={
                        feature.status === "Ready"
                          ? "success.main"
                          : "warning.main"
                      }
                      sx={{ fontWeight: "bold" }}
                    >
                      {feature.status}
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                {quickActions.map((action, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Settings />
                    </ListItemIcon>
                    <ListItemText primary={action} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                System Status
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Security color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Firebase Connection"
                    secondary="Connected and operational"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Analytics color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Database Status"
                    secondary="All collections accessible"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CloudUpload color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Cloud Functions"
                    secondary="Deployed and running"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Assessment color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Audit Logging"
                    secondary="Active and monitoring all actions"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </TabPanel>
      </Container>
    </AdminGuard>
  );
};

export default AdminPage;
