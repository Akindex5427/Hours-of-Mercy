import React, { useState, useEffect } from "react";
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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  Person,
  Message,
  Church,
  Directions,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useContactForm, useContactSubmissions } from "../hooks/useFirestore";
import { logAuditEvent } from "../firebase/audit";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string(),
  subject: yup.string().required("Please select a subject"),
  message: yup
    .string()
    .required("Message is required")
    .min(10, "Message must be at least 10 characters"),
});

const ContactPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    submitContactForm,
    loading: isSubmitting,
    error: submitError,
    success,
    resetStatus,
  } = useContactForm();

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
      subject: "",
      message: "",
    },
  });

  // Handle success state
  useEffect(() => {
    if (success) {
      setShowSuccess(true);
      reset();
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
        resetStatus();
      }, 5000);
    }
  }, [success, reset, resetStatus]);

  const subjects = [
    "General Inquiry",
    "Prayer Request",
    "Ministry Interest",
    "Event Information",
    "Pastoral Care",
    "Volunteer Opportunities",
    "Technical Support",
    "Other",
  ];

  const contactInfo = [
    {
      icon: <LocationOn />,
      title: "Address",
      details: ["1480 Lincoln Ave", "Dolton, Illinois 60419"],
      action: "Get Directions",
      actionIcon: <Directions />,
    },
    {
      icon: <Phone />,
      title: "Phone",
      details: ["(708) 555-0123"],
      action: "Call Now",
    },
    {
      icon: <Email />,
      title: "Email",
      details: ["info@hoursofmercy.org"],
      action: "Send Email",
    },
  ];

  const serviceSchedule = [
    {
      day: "Sunday",
      services: [
        { name: "Early Service", time: "8:00 AM" },
        { name: "Main Service", time: "11:00 AM" },
        { name: "Evening Service", time: "6:00 PM" },
      ],
    },
    {
      day: "Wednesday",
      services: [{ name: "Prayer Meeting", time: "7:00 PM" }],
    },
    {
      day: "Friday",
      services: [{ name: "Bible Study", time: "7:30 PM" }],
    },
    {
      day: "Saturday",
      services: [{ name: "Youth Service", time: "6:00 PM" }],
    },
  ];

  const staff = [
    {
      name: "Pastor John Smith",
      title: "Senior Pastor",
      email: "pastor.john@hoursofmercy.org",
      phone: "(708) 555-0124",
    },
    {
      name: "Pastor Mary Johnson",
      title: "Associate Pastor",
      email: "pastor.mary@hoursofmercy.org",
      phone: "(708) 555-0125",
    },
    {
      name: "Minister Sarah Brown",
      title: "Worship Leader",
      email: "worship@hoursofmercy.org",
      phone: "(708) 555-0126",
    },
    {
      name: "Brother Robert Davis",
      title: "Administrator",
      email: "admin@hoursofmercy.org",
      phone: "(708) 555-0127",
    },
  ];

  const onSubmit = async (data) => {
    try {
      // Prepare data for Firebase submission
      const contactData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || "", // Optional field
        subject: data.subject,
        message: data.message,
        fullName: `${data.firstName} ${data.lastName}`,
        isUrgent:
          data.subject === "Pastoral Care" || data.subject === "Prayer Request",
      };

      console.log("Submitting contact form to Firebase:", contactData);
      await submitContactForm(contactData);

      // Log audit event
      logAuditEvent("contact_form_submission", {
        email: data.email,
        subject: data.subject,
        messageLength: data.message.length,
        timestamp: new Date(),
      });

      setShowSuccess(true);
      reset();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Contact form submission error:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Get in touch with Christ Apostolic Church Hours of Mercy. Find our location, service times, and contact information."
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
              Contact Us
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              We'd love to hear from you and welcome you to our church family
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
            Thank you for your message! We'll get back to you within 24 hours.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Contact Form */}
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
                  sx={{ fontWeight: 600, mb: 3 }}
                >
                  Send Us a Message
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
                            label="Last Name"
                            fullWidth
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
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
                    <Grid item xs={12}>
                      <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.subject}>
                            <InputLabel>Subject</InputLabel>
                            <Select {...field} label="Subject">
                              {subjects.map((subject) => (
                                <MenuItem key={subject} value={subject}>
                                  {subject}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.subject && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1, ml: 2 }}
                              >
                                {errors.subject.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="message"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Message"
                            multiline
                            rows={6}
                            fullWidth
                            error={!!errors.message}
                            helperText={errors.message?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  {/* Success Alert */}
                  {showSuccess && (
                    <Alert
                      severity="success"
                      icon={<CheckCircle />}
                      sx={{ mt: 3 }}
                      onClose={() => {
                        setShowSuccess(false);
                        resetStatus();
                      }}
                    >
                      <Typography variant="body1">
                        <strong>Message sent successfully!</strong>
                      </Typography>
                      <Typography variant="body2">
                        Thank you for contacting us. We'll get back to you as
                        soon as possible.
                      </Typography>
                    </Alert>
                  )}

                  {/* Error Alert */}
                  {submitError && (
                    <Alert
                      severity="error"
                      sx={{ mt: 3 }}
                      onClose={() => resetStatus()}
                    >
                      <Typography variant="body1">
                        <strong>Error sending message</strong>
                      </Typography>
                      <Typography variant="body2">
                        {submitError}. Please try again or contact us directly.
                      </Typography>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<Send />}
                    sx={{ mt: 3, px: 4, py: 1.5 }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={4}>
            {/* Contact Details */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Get in Touch
                </Typography>
                {contactInfo.map((info, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      {info.icon}
                      <Typography
                        variant="subtitle1"
                        sx={{ ml: 1, fontWeight: 600 }}
                      >
                        {info.title}
                      </Typography>
                    </Box>
                    {info.details.map((detail, detailIndex) => (
                      <Typography
                        key={detailIndex}
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 4 }}
                      >
                        {detail}
                      </Typography>
                    ))}
                    {info.action && (
                      <Button
                        size="small"
                        startIcon={info.actionIcon}
                        sx={{ ml: 4, mt: 1 }}
                      >
                        {info.action}
                      </Button>
                    )}
                  </Box>
                ))}
              </CardContent>
            </MotionCard>

            {/* Service Schedule */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <AccessTime sx={{ mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Service Schedule
                  </Typography>
                </Box>
                {serviceSchedule.map((day, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "primary.main" }}
                    >
                      {day.day}
                    </Typography>
                    {day.services.map((service, serviceIndex) => (
                      <Box
                        key={serviceIndex}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          ml: 2,
                        }}
                      >
                        <Typography variant="body2">{service.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </CardContent>
            </MotionCard>

            {/* Quick Actions */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Quick Actions
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button variant="outlined" fullWidth startIcon={<Church />}>
                    Plan Your Visit
                  </Button>
                  <Button variant="outlined" fullWidth startIcon={<Person />}>
                    Prayer Request
                  </Button>
                  <Button variant="outlined" fullWidth startIcon={<Message />}>
                    Join Newsletter
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Map Section */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mt: 6 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, textAlign: "center", mb: 4 }}
          >
            Find Us
          </Typography>
          <Paper elevation={3} sx={{ overflow: "hidden", borderRadius: 2 }}>
            <Box
              sx={{
                height: 400,
                bgcolor: "grey.200",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              {/* Placeholder for Google Maps */}
              <Box sx={{ textAlign: "center" }}>
                <LocationOn
                  sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  1480 Lincoln Ave
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dolton, Illinois 60419
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Directions />}
                >
                  Get Directions
                </Button>
              </Box>
              {/* TODO: Integrate with Google Maps API */}
            </Box>
          </Paper>
        </MotionBox>

        {/* Staff Directory */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mt: 8 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, textAlign: "center", mb: 4 }}
          >
            Our Staff
          </Typography>
          <Grid container spacing={3}>
            {staff.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Person
                      sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {member.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {member.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </MotionBox>
      </Container>
    </>
  );
};

export default ContactPage;
