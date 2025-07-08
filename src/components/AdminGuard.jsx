// Admin Guard Component for protecting admin routes
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  AdminPanelSettings,
  Security,
  VpnKey,
  Shield,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useFirestore";
import { logAuditEvent } from "../firebase/audit";

const MotionPaper = motion(Paper);

// Admin credentials - In production, this should be managed through Firebase Custom Claims
const ADMIN_EMAILS = [
  "admin@hoursofmercy.org",
  "pastor@hoursofmercy.org",
  "secretary@hoursofmercy.org",
  // Add more admin emails as needed
];

// Simple admin verification for development
// In production, use Firebase Custom Claims or a proper role-based system
const AdminGuard = ({ children }) => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [adminCode, setAdminCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [error, setError] = useState("");

  // Temporary admin verification code (replace with proper system in production)
  const ADMIN_CODE = "MERCY2024"; // This should be environment variable in production

  useEffect(() => {
    // Check if user email is in admin list
    if (user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      // Auto-verify if user is a known admin
      setIsAdminVerified(true);
    }
  }, [user]);

  const handleAdminVerification = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    // Simple code verification (replace with proper authentication in production)
    if (adminCode === ADMIN_CODE) {
      setIsAdminVerified(true);
      // Store verification in sessionStorage (cleared when browser closes)
      sessionStorage.setItem("adminVerified", "true");
      // Log successful admin verification
      await logAuditEvent.successfulAdminVerification();
    } else {
      setError("Invalid admin verification code");
      // Log failed admin verification attempt
      await logAuditEvent.invalidAdminCode(adminCode);
    }

    setIsVerifying(false);
  };

  // Check session storage for existing verification
  useEffect(() => {
    const storedVerification = sessionStorage.getItem("adminVerified");
    if (
      storedVerification === "true" &&
      user?.email &&
      ADMIN_EMAILS.includes(user.email.toLowerCase())
    ) {
      setIsAdminVerified(true);
    }
  }, [user]);

  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <MotionPaper
          elevation={3}
          sx={{ p: 4, textAlign: "center" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Security sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Authentication Required
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            You must be signed in to access the admin dashboard.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Please sign in through the Member Portal first, then return to this
            page.
          </Alert>
        </MotionPaper>
      </Container>
    );
  }

  if (!ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <MotionPaper
          elevation={3}
          sx={{ p: 4, textAlign: "center" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Shield sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Your account ({user.email}) does not have administrator privileges.
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            Only authorized church administrators can access this area.
          </Alert>
        </MotionPaper>
      </Container>
    );
  }

  if (!isAdminVerified) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <MotionPaper
          elevation={3}
          sx={{ p: 4 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box textAlign="center" mb={4}>
            <AdminPanelSettings
              sx={{ fontSize: 60, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              Admin Verification
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Additional verification required for admin access
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Authorized Admin User Detected
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <VpnKey />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Verified"
                    secondary={user.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Admin Role Confirmed"
                    secondary="Authorized administrator account"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Box component="form" onSubmit={handleAdminVerification}>
            <TextField
              fullWidth
              label="Admin Verification Code"
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Enter admin verification code"
              sx={{ mb: 3 }}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isVerifying || !adminCode}
              startIcon={
                isVerifying ? (
                  <CircularProgress size={20} />
                ) : (
                  <AdminPanelSettings />
                )
              }
            >
              {isVerifying ? "Verifying..." : "Verify Admin Access"}
            </Button>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Security Notice:</strong> This page requires additional
              verification to protect sensitive church administration functions.
            </Typography>
          </Alert>
        </MotionPaper>
      </Container>
    );
  }

  // If all checks pass, render the protected admin content
  return children;
};

export default AdminGuard;
