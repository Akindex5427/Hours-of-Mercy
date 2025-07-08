import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  Favorite,
  Security,
  Send,
  CheckCircle,
  People,
  Lock,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { usePrayerRequests } from "../hooks/useFirestore";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { logAuditEvent } from "../firebase/audit";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string(),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string(),
  prayerRequest: yup
    .string()
    .required("Prayer request is required")
    .min(10, "Please provide more details"),
  requestType: yup.string(),
  isUrgent: yup.boolean(),
  isAnonymous: yup.boolean(),
  allowSharing: yup.boolean(),
});

const PrayerRequestPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Firebase hooks
  const {
    submitPrayerRequest,
    loading: firebaseLoading,
    error: firebaseError,
  } = usePrayerRequests();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      prayerRequest: "",
      requestType: "general",
      isUrgent: false,
      isAnonymous: false,
      allowSharing: false,
    },
  });

  const prayerTypes = [
    {
      value: "healing",
      label: "Physical Healing",
      description: "Prayers for health and recovery",
    },
    {
      value: "spiritual",
      label: "Spiritual Growth",
      description: "Guidance and spiritual matters",
    },
    {
      value: "family",
      label: "Family & Relationships",
      description: "Marriage, children, and family issues",
    },
    {
      value: "financial",
      label: "Financial Provision",
      description: "Employment, bills, and financial needs",
    },
    {
      value: "guidance",
      label: "Guidance & Decisions",
      description: "Seeking God's direction",
    },
    {
      value: "salvation",
      label: "Salvation",
      description: "For loved ones to know Christ",
    },
    {
      value: "general",
      label: "General Prayer",
      description: "Other prayer needs",
    },
  ];

  const prayerPromises = [
    '"Ask and it will be given to you; seek and you will find; knock and the door will be opened to you." - Matthew 7:7',
    '"The prayer of a righteous person is powerful and effective." - James 5:16',
    '"Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." - Philippians 4:6',
    '"Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours." - Mark 11:24',
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Submit prayer request to Firebase
      await submitPrayerRequest({
        ...data,
        submittedAt: new Date().toISOString(),
        status: "pending",
      });

      // Log the audit event
      logAuditEvent("prayer_request_submission", {
        email: data.email,
        requestType: data.requestType,
        isUrgent: data.isUrgent,
        isAnonymous: data.isAnonymous,
        allowSharing: data.allowSharing,
        submittedAt: new Date().toISOString(),
      });

      setShowSuccess(true);
      reset();
      setIsSubmitting(false);

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Prayer request submission error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Prayer Request - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Submit your prayer request to Christ Apostolic Church Hours of Mercy. Our prayer team is here to support you in faith."
        />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          position: "relative",
        }}
      >
        <Container maxWidth="lg">
          <MotionBox
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            sx={{ textAlign: "center" }}
          >
            <Typography variant="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Prayer Request
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              We believe in the power of prayer and are here to stand with you
              in faith
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {showSuccess && (
          <Alert
            severity="success"
            sx={{ mb: 4 }}
            onClose={() => setShowSuccess(false)}
          >
            Your prayer request has been submitted. Our prayer team will lift
            you up in prayer.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Prayer Request Form */}
          <Grid item xs={12} lg={8}>
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Submit Your Prayer Request
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Share your prayer needs with us. We believe that God hears and
                  answers prayer, and we are honored to join you in seeking His
                  will for your situation.
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="First Name"
                            fullWidth
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Last Name (Optional)"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email Address"
                            type="email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phone Number (Optional)"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  {/* Prayer Request Type */}
                  <Box sx={{ my: 4 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Type of Prayer Request
                    </Typography>
                    <Grid container spacing={2}>
                      {prayerTypes.map((type) => (
                        <Grid item xs={12} sm={6} md={4} key={type.value}>
                          <Controller
                            name="requestType"
                            control={control}
                            render={({ field }) => (
                              <Paper
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  cursor: "pointer",
                                  bgcolor:
                                    field.value === type.value
                                      ? "primary.light"
                                      : "transparent",
                                  color:
                                    field.value === type.value
                                      ? "white"
                                      : "inherit",
                                  "&:hover": {
                                    bgcolor:
                                      field.value === type.value
                                        ? "primary.main"
                                        : "grey.50",
                                  },
                                }}
                                onClick={() => field.onChange(type.value)}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600, mb: 0.5 }}
                                >
                                  {type.label}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ opacity: 0.8 }}
                                >
                                  {type.description}
                                </Typography>
                              </Paper>
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Prayer Request Details */}
                  <Box sx={{ mb: 3 }}>
                    <Controller
                      name="prayerRequest"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Please share your prayer request"
                          multiline
                          rows={6}
                          fullWidth
                          error={!!errors.prayerRequest}
                          helperText={
                            errors.prayerRequest?.message ||
                            "Share as much or as little as you're comfortable with"
                          }
                          placeholder="We would be honored to pray for you. Please share your request, and we will lift it up to our loving Father in heaven."
                        />
                      )}
                    />
                  </Box>

                  {/* Options */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Prayer Options
                    </Typography>

                    <Controller
                      name="isUrgent"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label="This is an urgent prayer request"
                          sx={{ mb: 1, display: "block" }}
                        />
                      )}
                    />

                    <Controller
                      name="isAnonymous"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label="Keep this request anonymous"
                          sx={{ mb: 1, display: "block" }}
                        />
                      )}
                    />

                    <Controller
                      name="allowSharing"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox {...field} checked={field.value} />
                          }
                          label="Allow sharing with prayer team for extended prayer"
                          sx={{ mb: 1, display: "block" }}
                        />
                      )}
                    />
                  </Box>

                  <Paper sx={{ p: 3, bgcolor: "grey.50", mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Security sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Your Privacy is Protected
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      All prayer requests are kept confidential and are only
                      shared with our dedicated prayer team members who have
                      committed to pray for submitted requests. We respect your
                      privacy and will never share your personal information.
                    </Typography>
                  </Paper>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<Send />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Prayer Request"}
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Prayer Promises */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Favorite sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    God's Promises
                  </Typography>
                </Box>
                <List dense>
                  {prayerPromises.map((promise, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary={promise}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontStyle: "italic",
                          color: "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </MotionCard>

            {/* Prayer Team Info */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <People sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Our Prayer Team
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  Our dedicated prayer team meets weekly to pray for all
                  submitted requests. Led by Pastor Mary Johnson, this committed
                  group of believers understands the power of united prayer.
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle
                        sx={{ fontSize: 16, color: "primary.main" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Weekly prayer meetings"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle
                        sx={{ fontSize: 16, color: "primary.main" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Confidential handling"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle
                        sx={{ fontSize: 16, color: "primary.main" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Follow-up prayers"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </MotionCard>

            {/* Emergency Contact */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <CardContent sx={{ bgcolor: "error.light", color: "white" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Need Immediate Prayer?
                </Typography>
                <Typography variant="body2" paragraph>
                  If you have an urgent prayer need or crisis situation, please
                  don't hesitate to contact us directly.
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Call Pastor: (708) 555-0124
                </Button>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Available 24/7 for emergencies
                </Typography>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default PrayerRequestPage;
