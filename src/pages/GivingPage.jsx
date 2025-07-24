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
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Divider,
} from "@mui/material";
import {
  FavoriteOutlined,
  SecurityOutlined,
  VerifiedUserOutlined,
  PaymentOutlined,
  ChurchOutlined,
  VolunteerActivismOutlined,
  CreditCardOutlined,
  AccountBalanceOutlined,
  Send,
  CheckCircleOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const schema = yup.object({
  amount: yup
    .number()
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  donationType: yup.string().required("Please select a donation type"),
  frequency: yup.string().required("Please select frequency"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string(),
  address: yup.string(),
  city: yup.string(),
  state: yup.string(),
  zipCode: yup.string(),
  paymentMethod: yup.string().required("Please select a payment method"),
});

const GivingPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static data - always works
  const donationTypes = [
    { value: "tithe", label: "Tithe", description: "Your faithful 10%" },
    {
      value: "offering",
      label: "General Offering",
      description: "Support church operations",
    },
    {
      value: "missions",
      label: "Missions",
      description: "Support our missionary work",
    },
    {
      value: "building",
      label: "Building Fund",
      description: "Church building and maintenance",
    },
    {
      value: "youth",
      label: "Youth Ministry",
      description: "Support our youth programs",
    },
    {
      value: "benevolence",
      label: "Benevolence",
      description: "Help those in need",
    },
    {
      value: "special",
      label: "Special Project",
      description: "Current special initiatives",
    },
    { value: "other", label: "Other", description: "Specify your purpose" },
  ];

  const frequencies = [
    { value: "once", label: "One Time" },
    { value: "weekly", label: "Weekly" },
    { value: "biweekly", label: "Bi-Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "annually", label: "Annually" },
  ];

  const paymentMethods = [
    { value: "card", label: "Credit/Debit Card", icon: <CreditCardOutlined /> },
    {
      value: "ach",
      label: "Bank Transfer (ACH)",
      icon: <AccountBalanceOutlined />,
    },
  ];

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  const givingInfo = [
    {
      title: "Secure & Safe",
      description:
        "Your donations are processed securely with industry-standard encryption",
      icon: <SecurityOutlined />,
    },
    {
      title: "Tax Deductible",
      description:
        "All donations are tax-deductible. You'll receive receipts for your records",
      icon: <VerifiedUserOutlined />,
    },
    {
      title: "Multiple Ways to Give",
      description: "Give online, by Zelle, or in person during services",
      icon: <PaymentOutlined />,
    },
  ];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: "",
      donationType: "",
      frequency: "once",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      paymentMethod: "",
    },
  });

  const watchedAmount = watch("amount");
  const watchedDonationType = watch("donationType");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate payment processing
      console.log("Donation form submitted:", data);

      setShowSuccess(true);
      reset();

      // Hide success message after 8 seconds
      setTimeout(() => setShowSuccess(false), 8000);
    } catch (error) {
      console.error("Donation submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAmount = (amount) => {
    setValue("amount", amount);
  };

  return (
    <>
      <Helmet>
        <title>Give - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Support Christ Apostolic Church Hours of Mercy with your tithes and offerings. Give securely online to support our ministry and outreach."
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
            <VolunteerActivismOutlined sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Give
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "700px", mx: "auto" }}
            >
              "Give, and it will be given to you. A good measure, pressed down,
              shaken together and running over, will be poured into your lap." -
              Luke 6:38
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
            icon={<CheckCircleOutlined />}
          >
            Thank you for your generous donation! Your gift will make a
            difference in our ministry. You should receive a confirmation email
            shortly.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Donation Form */}
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
                  Make a Donation
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4 }}
                >
                  Your generous giving helps us continue our mission of
                  spreading God's love and serving our community.
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  {/* Amount Section */}
                  <Paper sx={{ p: 3, mb: 4, bgcolor: "grey.50" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Donation Amount
                    </Typography>

                    {/* Quick Amount Buttons */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Select a quick amount:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {quickAmounts.map((amount) => (
                          <Chip
                            key={amount}
                            label={`$${amount}`}
                            onClick={() => handleQuickAmount(amount)}
                            color={
                              watchedAmount == amount ? "primary" : "default"
                            }
                            clickable
                          />
                        ))}
                      </Box>
                    </Box>

                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Amount"
                          type="number"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <Typography sx={{ mr: 1 }}>$</Typography>
                            ),
                          }}
                          error={!!errors.amount}
                          helperText={errors.amount?.message}
                        />
                      )}
                    />
                  </Paper>

                  {/* Donation Details */}
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="donationType"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.donationType}>
                            <InputLabel>Donation Type</InputLabel>
                            <Select {...field} label="Donation Type">
                              {donationTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  <Box>
                                    <Typography variant="body1">
                                      {type.label}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {type.description}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.donationType && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1, ml: 2 }}
                              >
                                {errors.donationType.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name="frequency"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.frequency}>
                            <InputLabel>Frequency</InputLabel>
                            <Select {...field} label="Frequency">
                              {frequencies.map((freq) => (
                                <MenuItem key={freq.value} value={freq.value}>
                                  {freq.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.frequency && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1, ml: 2 }}
                              >
                                {errors.frequency.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>

                    {/* Personal Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mt: 2, mb: 2 }}
                      >
                        Contact Information
                      </Typography>
                    </Grid>

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

                    {/* Address Information */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mt: 2, mb: 2 }}
                      >
                        Billing Address (Optional)
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Street Address"
                            fullWidth
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="City" fullWidth />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="State" fullWidth />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controller
                        name="zipCode"
                        control={control}
                        render={({ field }) => (
                          <TextField {...field} label="Zip Code" fullWidth />
                        )}
                      />
                    </Grid>

                    {/* Payment Method */}
                    <Grid item xs={12}>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, mt: 2, mb: 2 }}
                      >
                        Payment Method
                      </Typography>
                      <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth error={!!errors.paymentMethod}>
                            <InputLabel>Payment Method</InputLabel>
                            <Select {...field} label="Payment Method">
                              {paymentMethods.map((method) => (
                                <MenuItem
                                  key={method.value}
                                  value={method.value}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    {method.icon}
                                    <Typography sx={{ ml: 1 }}>
                                      {method.label}
                                    </Typography>
                                  </Box>
                                </MenuItem>
                              ))}
                            </Select>
                            {errors.paymentMethod && (
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{ mt: 1, ml: 2 }}
                              >
                                {errors.paymentMethod.message}
                              </Typography>
                            )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 4 }} />

                  {/* Summary */}
                  {watchedAmount && watchedDonationType && (
                    <Paper sx={{ p: 3, mb: 3, bgcolor: "primary.50" }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                      >
                        Donation Summary
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography>Amount:</Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          ${watchedAmount}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography>Type:</Typography>
                        <Typography>
                          {
                            donationTypes.find(
                              (t) => t.value === watchedDonationType
                            )?.label
                          }
                        </Typography>
                      </Box>
                    </Paper>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={isSubmitting}
                    startIcon={<Send />}
                    sx={{ mt: 2, px: 4, py: 1.5, fontSize: "1.1rem" }}
                    fullWidth
                  >
                    {isSubmitting
                      ? "Processing..."
                      : `Give ${watchedAmount ? `$${watchedAmount}` : ""}`}
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Giving Information */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  <FavoriteOutlined sx={{ mr: 1, verticalAlign: "middle" }} />
                  Why We Give
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Giving is an act of worship and obedience to God. Your
                  generous contributions help us:
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <ChurchOutlined
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Support weekly services and programs"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <VolunteerActivismOutlined
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Reach out to our community"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <FavoriteOutlined
                        sx={{ fontSize: 20, color: "primary.main" }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Support missions and ministry"
                      primaryTypographyProps={{ variant: "body2" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </MotionCard>

            {/* Security & Information */}
            {givingInfo.map((info, index) => (
              <MotionCard
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
                sx={{ mb: 3 }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box sx={{ mr: 2, color: "primary.main" }}>{info.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {info.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {info.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            ))}

            {/* Other Ways to Give */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Other Ways to Give
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  You can also give through these methods:
                </Typography>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="In-Person"
                      secondary="During any of our service times"
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="By Mail"
                      secondary="1480 Lincoln Ave, Dolton, IL 60419"
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText
                      primary="By Zelle"
                      secondary="Zelle to (773) 977-9630"
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default GivingPage;
