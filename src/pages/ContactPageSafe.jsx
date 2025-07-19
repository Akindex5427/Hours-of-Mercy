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
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Send,
  Church,
  Directions,
  CheckCircle,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

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

const ContactPageSafe = () => {
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Form submitted:", data);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const churchInfo = {
    name: "Christ Apostolic Church Hours of Mercy",
    address: "1480 Lincoln Ave, Dolton, Illinois 60419",
    phone: "(773) 977-9630",
    email: "info@hoursofmercy.org",
    hours: {
      sunday: "9:00 AM - 12:00 PM",
      tuesday: "7:00 PM - 9:00 PM",
      friday: "7:00 PM - 9:00 PM",
    },
  };

  const contactReasons = [
    "General Inquiry",
    "Prayer Request",
    "Ministry Information",
    "Event Information",
    "Volunteer Opportunities",
    "Pastoral Care",
    "Technical Support",
    "Other",
  ];

  console.log("ContactPageSafe rendering successfully");

  return (
    <>
      <Helmet>
        <title>Contact Us - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Get in touch with Christ Apostolic Church Hours of Mercy. Visit us, call us, or send us a message."
        />
      </Helmet>

      {/* Hero Section */}
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          backgroundColor: "#1e3a8a",
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
              We'd love to hear from you. Get in touch with our church family.
            </Typography>
          </MotionBox>
        </Container>
      </MotionBox>

      {/* Contact Information and Form */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              sx={{ height: "100%" }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">
                  Get In Touch
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  We welcome visitors and would love to connect with you. Here's
                  how you can reach us:
                </Typography>

                <List sx={{ mt: 3 }}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Address"
                      secondary={churchInfo.address}
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Phone color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={
                        <Button
                          variant="text"
                          href={`tel:${churchInfo.phone}`}
                          sx={{ p: 0, justifyContent: "flex-start" }}
                        >
                          {churchInfo.phone}
                        </Button>
                      }
                    />
                  </ListItem>

                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Email color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={
                        <Button
                          variant="text"
                          href={`mailto:${churchInfo.email}`}
                          sx={{ p: 0, justifyContent: "flex-start" }}
                        >
                          {churchInfo.email}
                        </Button>
                      }
                    />
                  </ListItem>
                </List>

                {/* Service Times */}
                <Paper sx={{ p: 3, mt: 4, bgcolor: "grey.50" }}>
                  <Typography variant="h6" gutterBottom>
                    <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                    Service Times
                  </Typography>
                  <List dense>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Sunday Service"
                        secondary={churchInfo.hours.sunday}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Tuesday Bible Study"
                        secondary={churchInfo.hours.tuesday}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary="Friday Prayer Service"
                        secondary={churchInfo.hours.friday}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Contact Form */}
          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              sx={{ height: "100%" }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">
                  Send us a Message
                </Typography>
                <Typography variant="body1" paragraph color="text.secondary">
                  Have a question or want to connect? We'd love to hear from
                  you.
                </Typography>

                {submitStatus === "success" && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    <CheckCircle sx={{ mr: 1 }} />
                    Thank you for your message! We'll get back to you soon.
                  </Alert>
                )}

                {submitStatus === "error" && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    There was an error sending your message. Please try again.
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="First Name"
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
                            fullWidth
                            label="Last Name"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Email Address"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Phone Number (Optional)"
                            type="tel"
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
                              {contactReasons.map((reason) => (
                                <MenuItem key={reason} value={reason}>
                                  {reason}
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
                            fullWidth
                            label="Message"
                            multiline
                            rows={4}
                            error={!!errors.message}
                            helperText={errors.message?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={isSubmitting}
                        startIcon={<Send />}
                        sx={{ py: 1.5 }}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Simple Map Placeholder */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          sx={{ mt: 6 }}
        >
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
              Visit Us
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {churchInfo.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {churchInfo.address}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Directions />}
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                churchInfo.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Directions
            </Button>
          </Paper>
        </MotionBox>
      </Container>
    </>
  );
};

export default ContactPageSafe;
