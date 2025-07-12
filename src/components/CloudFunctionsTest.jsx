import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
  Divider,
} from "@mui/material";
import { Send, CloudDone, Science } from "@mui/icons-material";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/config";

/**
 * Cloud Functions Test Component
 * Allows testing of various Firebase Cloud Functions from the admin interface
 */
const CloudFunctionsTest = () => {
  const [loading, setLoading] = useState({});
  const [results, setResults] = useState({});
  const [formData, setFormData] = useState({
    contactForm: {
      name: "Test User",
      email: "test@example.com",
      phone: "555-123-4567",
      subject: "Test Message",
      message:
        "This is a test message from the Cloud Functions test interface.",
      isUrgent: false,
    },
  });

  // Set loading state for specific function
  const setFunctionLoading = (functionName, isLoading) => {
    setLoading((prev) => ({ ...prev, [functionName]: isLoading }));
  };

  // Set result for specific function
  const setFunctionResult = (functionName, result) => {
    setResults((prev) => ({ ...prev, [functionName]: result }));
  };

  // Test health check function
  const testHealthCheck = async () => {
    setFunctionLoading("healthCheck", true);
    try {
      const response = await fetch("/api/healthCheck");
      const data = await response.json();
      setFunctionResult("healthCheck", {
        success: true,
        data: data,
      });
    } catch (error) {
      setFunctionResult("healthCheck", {
        success: false,
        error: error.message,
      });
    } finally {
      setFunctionLoading("healthCheck", false);
    }
  };

  // Test callable function
  const testCallableFunction = async () => {
    setFunctionLoading("testFunction", true);
    try {
      const testFunction = httpsCallable(functions, "testFunction");
      const result = await testFunction();
      setFunctionResult("testFunction", {
        success: true,
        data: result.data,
      });
    } catch (error) {
      setFunctionResult("testFunction", {
        success: false,
        error: error.message,
      });
    } finally {
      setFunctionLoading("testFunction", false);
    }
  };

  // Test contact form function
  const testContactForm = async () => {
    setFunctionLoading("contactForm", true);
    try {
      const sendContactForm = httpsCallable(
        functions,
        "sendContactFormNotification"
      );
      const result = await sendContactForm(formData.contactForm);
      setFunctionResult("contactForm", {
        success: true,
        data: result.data,
      });
    } catch (error) {
      setFunctionResult("contactForm", {
        success: false,
        error: error.message,
      });
    } finally {
      setFunctionLoading("contactForm", false);
    }
  };

  // Update form data
  const updateFormData = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // Render test result
  const renderResult = (functionName) => {
    const result = results[functionName];
    if (!result) return null;

    return (
      <Alert
        severity={result.success ? "success" : "error"}
        sx={{ mt: 2, maxHeight: 300, overflow: "auto" }}
      >
        <Typography
          variant="body2"
          component="pre"
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {JSON.stringify(result, null, 2)}
        </Typography>
      </Alert>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <CloudDone color="primary" />
        Cloud Functions Test Interface
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph>
        Test your Firebase Cloud Functions from this interface. Make sure your
        functions are deployed first.
      </Typography>

      <Grid container spacing={3}>
        {/* Health Check Test */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Health Check Function
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Tests the basic health check HTTP function.
              </Typography>
              <Button
                variant="contained"
                onClick={testHealthCheck}
                disabled={loading.healthCheck}
                startIcon={
                  loading.healthCheck ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Science />
                  )
                }
                fullWidth
              >
                {loading.healthCheck ? "Testing..." : "Test Health Check"}
              </Button>
              {renderResult("healthCheck")}
            </CardContent>
          </Card>
        </Grid>

        {/* Test Callable Function */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Test Callable Function
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Tests the basic callable function for debugging.
              </Typography>
              <Button
                variant="contained"
                onClick={testCallableFunction}
                disabled={loading.testFunction}
                startIcon={
                  loading.testFunction ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Science />
                  )
                }
                fullWidth
              >
                {loading.testFunction ? "Testing..." : "Test Callable Function"}
              </Button>
              {renderResult("testFunction")}
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Form Test */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Form Function
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Tests the contact form submission with email notifications.
              </Typography>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={formData.contactForm.name}
                    onChange={(e) =>
                      updateFormData("contactForm", "name", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    type="email"
                    value={formData.contactForm.email}
                    onChange={(e) =>
                      updateFormData("contactForm", "email", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    fullWidth
                    value={formData.contactForm.phone}
                    onChange={(e) =>
                      updateFormData("contactForm", "phone", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Subject"
                    fullWidth
                    value={formData.contactForm.subject}
                    onChange={(e) =>
                      updateFormData("contactForm", "subject", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Message"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.contactForm.message}
                    onChange={(e) =>
                      updateFormData("contactForm", "message", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.contactForm.isUrgent}
                        onChange={(e) =>
                          updateFormData(
                            "contactForm",
                            "isUrgent",
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Mark as Urgent"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={testContactForm}
                    disabled={loading.contactForm}
                    startIcon={
                      loading.contactForm ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Send />
                      )
                    }
                    size="large"
                  >
                    {loading.contactForm ? "Sending..." : "Test Contact Form"}
                  </Button>
                </Grid>
              </Grid>
              {renderResult("contactForm")}
            </CardContent>
          </Card>
        </Grid>

        {/* Function Information */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: "grey.50" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Cloud Functions
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                The following Firebase Cloud Functions are configured for your
                church website:
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      🙏 Prayer Request Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Automatically sends email notifications when new prayer
                      requests are submitted.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      📅 Daily Event Reminders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sends daily email reminders for tomorrow's events at 9 AM.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      📅 Weekly Newsletter
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sends weekly newsletter to subscribers every Sunday at 8
                      AM.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      📅 Monthly Newsletter
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sends monthly newsletter to subscribers on the 1st at 10
                      AM.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      📧 Newsletter Welcome
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sends welcome emails to new newsletter subscribers.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      💰 Stripe Webhooks
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Processes donation payments and sends thank you emails.
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      📊 Analytics Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Generates weekly analytics reports for church leadership
                      (runs Mondays at 8 AM).
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: "grey.300",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      📞 Contact Form Processing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Handles contact form submissions and sends notifications
                      to staff.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CloudFunctionsTest;
