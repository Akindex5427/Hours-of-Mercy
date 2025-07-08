// Member Portal with Firebase Authentication
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Paper,
  Tab,
  Tabs,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  CalendarToday,
  Notifications,
  Settings,
  ExitToApp,
  VpnKey,
  AccountCircle,
  History,
  FavoriteOutlined,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAuth,
  useMemberProfile,
  usePrayerRequests,
} from "../hooks/useFirestore";
import { authService, getAuthErrorMessage } from "../firebase/auth";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

// Tab panel component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`member-tabpanel-${index}`}
      aria-labelledby={`member-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Login/Register Form Component
const AuthForm = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
      }
      onSuccess?.();
    } catch (error) {
      setErrors({ submit: getAuthErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotionPaper
      elevation={3}
      sx={{ p: 4, maxWidth: 400, mx: "auto" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {isLogin ? "Sign In" : "Create Account"}
      </Typography>

      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        sx={{ mb: 3 }}
      >
        {isLogin
          ? "Welcome back! Please sign in to your account."
          : "Join our church community portal."}
      </Typography>

      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required={!isLogin}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required={!isLogin}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          </>
        )}

        <TextField
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          required
          sx={{ mb: 2 }}
        />

        {!isLogin && (
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            required
            sx={{ mb: 2 }}
          />
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isLogin ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </Button>

        <Divider sx={{ my: 2 }} />

        <Button fullWidth variant="text" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Sign up"
            : "Already have an account? Sign in"}
        </Button>
      </Box>
    </MotionPaper>
  );
};

// Member Dashboard Component
const MemberDashboard = ({ user }) => {
  const [tabValue, setTabValue] = useState(0);
  const {
    profile,
    loading: profileLoading,
    updateProfile,
  } = useMemberProfile(user?.uid);
  const { prayerRequests, loading: prayerLoading } = usePrayerRequests();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleEditProfile = () => {
    setEditData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      phone: profile?.phone || "",
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  const userPrayerRequests = prayerRequests.filter(
    (request) => request.email === user?.email
  );

  if (profileLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Header */}
      <Paper
        elevation={2}
        sx={{ mb: 3, p: 3, bgcolor: "primary.main", color: "white" }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar sx={{ width: 64, height: 64, bgcolor: "secondary.main" }}>
              <Person fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" component="h1">
              Welcome, {profile?.firstName || user?.displayName || "Member"}!
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Member since{" "}
              {new Date(
                profile?.createdAt?.seconds * 1000 || Date.now()
              ).getFullYear()}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ExitToApp />}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Navigation Tabs */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab icon={<AccountCircle />} label="Profile" />
          <Tab icon={<FavoriteOutlined />} label="Prayer Requests" />
          <Tab icon={<History />} label="Activity" />
          <Tab icon={<Settings />} label="Settings" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <TabPanel value={tabValue} index={0}>
        {/* Profile Tab */}
        <Card>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography variant="h5">Personal Information</Typography>
              {!isEditing ? (
                <Button variant="outlined" onClick={handleEditProfile}>
                  Edit Profile
                </Button>
              ) : (
                <Box>
                  <Button onClick={() => setIsEditing(false)} sx={{ mr: 1 }}>
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </Box>
              )}
            </Box>

            {isEditing ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={editData.firstName}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={editData.lastName}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </Grid>
              </Grid>
            ) : (
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Full Name"
                    secondary={
                      `${profile?.firstName || ""} ${
                        profile?.lastName || ""
                      }`.trim() || "Not provided"
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={user?.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Phone"
                    secondary={profile?.phone || "Not provided"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Member Since"
                    secondary={new Date(
                      profile?.createdAt?.seconds * 1000 || Date.now()
                    ).toLocaleDateString()}
                  />
                </ListItem>
              </List>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Prayer Requests Tab */}
        <Typography variant="h5" gutterBottom>
          Your Prayer Requests
        </Typography>
        {prayerLoading ? (
          <CircularProgress />
        ) : userPrayerRequests.length === 0 ? (
          <Alert severity="info">
            You haven't submitted any prayer requests yet.
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {userPrayerRequests.map((request) => (
              <Grid item xs={12} key={request.id}>
                <Card>
                  <CardContent>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="start"
                      mb={2}
                    >
                      <Typography variant="h6">
                        {request.requestType === "personal"
                          ? "Personal"
                          : "Other"}{" "}
                        Prayer Request
                      </Typography>
                      <Chip
                        label={request.isUrgent ? "Urgent" : "Regular"}
                        color={request.isUrgent ? "error" : "default"}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body1" paragraph>
                      {request.prayerRequest}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Submitted on{" "}
                      {new Date(
                        request.submittedAt?.seconds * 1000
                      ).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Activity Tab */}
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        <Alert severity="info">Activity tracking feature coming soon!</Alert>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Settings Tab */}
        <Typography variant="h5" gutterBottom>
          Account Settings
        </Typography>
        <Alert severity="info">Account settings features coming soon!</Alert>
      </TabPanel>
    </MotionBox>
  );
};

// Main Member Portal Component
const MemberPortal = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>Member Portal - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Access your member account, view prayer requests, and manage your profile"
        />
      </Helmet>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <MotionBox
              key="auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                align="center"
                sx={{ mb: 4 }}
              >
                Member Portal
              </Typography>
              <AuthForm />
            </MotionBox>
          ) : (
            <MotionBox
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MemberDashboard user={user} />
            </MotionBox>
          )}
        </AnimatePresence>
      </Container>
    </>
  );
};

export default MemberPortal;
