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

const ContactPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static data - always works
  const subjects = [
    "General Inquiry",
    "Prayer Request",
    "Pastoral Care",
    "Ministry Information",
    "Event Information",
    "Volunteer Opportunities",
    "Technical Support",
    "Other",
  ];

  const churchContactInfo = {
    address: "1480 Lincoln Ave, Dolton, Illinois 60419",
    phone: "(708) 555-0123",
    email: "info@hoursofmercy.org",
  };

  const services = [
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

  const staffMembers = [
    {
      name: "Pastor Peter Olawale Sunday",
      title: "Senior Pastor",
      email: "pastor.olawale@hoursofmercy.org",
      phone: "(773) 977-9630",
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
    try {
      // Simulate form submission
      console.log("Contact form submitted:", data);

      setShowSuccess(true);
      reset();

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Contact form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Get in touch with Christ Apostolic Church Hours of Mercy. Visit us at 1480 Lincoln Ave, Dolton, Illinois or contact us online."
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
              We'd love to hear from you. Reach out to us for any questions,
              prayer requests, or to learn more about our church family.
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
            Thank you for your message! We'll get back to you soon.
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
                  sx={{ fontWeight: 600, mb: 1 }}
                >
                  Send us a Message
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Fill out the form below and we'll get back to you as soon as
                  possible.
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
                            label="Your Message"
                            multiline
                            rows={6}
                            fullWidth
                            error={!!errors.message}
                            helperText={
                              errors.message?.message ||
                              "Please share your question or message with us"
                            }
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

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

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Church Information */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  <Church sx={{ mr: 1, verticalAlign: "middle" }} />
                  Church Information
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <LocationOn sx={{ color: "primary.main" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={churchContactInfo.address}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Phone sx={{ color: "primary.main" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={churchContactInfo.phone}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Email sx={{ color: "primary.main" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={churchContactInfo.email}
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                </List>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  startIcon={<Directions />}
                  sx={{ mt: 2 }}
                  href="https://maps.google.com/?q=1480+Lincoln+Ave,+Dolton,+IL"
                  target="_blank"
                >
                  Get Directions
                </Button>
              </CardContent>
            </MotionCard>

            {/* Service Times */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                  Service Times
                </Typography>
                {services.map((day, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {day.day}
                    </Typography>
                    {day.services.map((service, serviceIndex) => (
                      <Box
                        key={serviceIndex}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2">{service.name}</Typography>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: 500 }}
                        >
                          {service.time}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                ))}
              </CardContent>
            </MotionCard>

            {/* Staff Contacts */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Direct Contact
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  For specific needs, you can contact our staff directly:
                </Typography>
                {staffMembers.map((member, index) => (
                  <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {member.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {member.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <Email
                        sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                      />
                      {member.email}
                    </Typography>
                    <Typography variant="body2">
                      <Phone
                        sx={{ fontSize: 16, mr: 1, verticalAlign: "middle" }}
                      />
                      {member.phone}
                    </Typography>
                  </Paper>
                ))}
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Paper sx={{ p: 4, mt: 6, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Visit Us
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            We're located in the heart of Dolton, Illinois. Come and worship
            with us!
          </Typography>
          <Box
            sx={{
              height: 300,
              bgcolor: "grey.200",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Interactive Map Coming Soon
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default ContactPage;
