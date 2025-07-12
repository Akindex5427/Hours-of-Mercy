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
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Divider,
  Alert,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Favorite,
  Security,
  Repeat,
  CheckCircle,
  CreditCard,
  AccountBalance,
  School,
  VolunteerActivism,
  Church,
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
    .required("Amount is required")
    .min(1, "Amount must be at least $1"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string(),
  frequency: yup.string().required("Please select giving frequency"),
  designation: yup.string().required("Please select a designation"),
  anonymous: yup.boolean(),
});

const GivingPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      frequency: "one-time",
      designation: "general",
      anonymous: false,
    },
  });

  const watchedAmount = watch("amount");
  const watchedFrequency = watch("frequency");

  const givingOptions = [
    {
      label: "General Fund",
      value: "general",
      description: "Support overall church operations and ministry",
    },
    {
      label: "Building Fund",
      value: "building",
      description: "Help maintain and improve our facilities",
    },
    {
      label: "Mission Fund",
      value: "mission",
      description: "Support local and global mission work",
    },
    {
      label: "Youth Ministry",
      value: "youth",
      description: "Invest in the next generation",
    },
    {
      label: "Community Outreach",
      value: "outreach",
      description: "Help us serve our community",
    },
  ];

  const quickAmounts = [25, 50, 100, 250, 500, 1000];

  const benefits = [
    "Support the growth of God's kingdom",
    "Help fund community outreach programs",
    "Maintain and improve church facilities",
    "Support pastoral care and counseling",
    "Fund youth and children's programs",
    "Enable missionary work and evangelism",
  ];

  const onSubmit = async (data) => {
    setIsProcessing(true);
    try {
      // TODO: Integrate with Stripe payment processing
      console.log("Processing donation:", data);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccess(true);
      setIsProcessing(false);
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Helmet>
        <title>Online Giving - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Support our ministry through secure online giving. Your generosity helps us spread God's love in our community and beyond."
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
              Online Giving
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Your generosity helps us spread God's love and mercy in our
              community
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
            Thank you for your generous gift! Your donation has been processed
            successfully.
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Giving Form */}
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
                  Make a Donation
                </Typography>

                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={{ mb: 4, borderBottom: 1, borderColor: "divider" }}
                >
                  <Tab label="One-Time Gift" />
                  <Tab label="Recurring Gift" />
                </Tabs>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  {/* Amount Selection */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Gift Amount
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      {quickAmounts.map((amount) => (
                        <Grid item xs={6} sm={4} md={2} key={amount}>
                          <Button
                            variant={
                              watchedAmount == amount ? "contained" : "outlined"
                            }
                            fullWidth
                            onClick={() =>
                              (control._formValues.amount = amount)
                            }
                            sx={{ py: 1.5 }}
                          >
                            ${amount}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Custom Amount"
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
                  </Box>

                  {/* Frequency Selection */}
                  <Box sx={{ mb: 4 }}>
                    <Controller
                      name="frequency"
                      control={control}
                      render={({ field }) => (
                        <FormControl component="fieldset">
                          <FormLabel
                            component="legend"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            Giving Frequency
                          </FormLabel>
                          <RadioGroup {...field} row>
                            <FormControlLabel
                              value="one-time"
                              control={<Radio />}
                              label="One Time"
                            />
                            <FormControlLabel
                              value="weekly"
                              control={<Radio />}
                              label="Weekly"
                            />
                            <FormControlLabel
                              value="monthly"
                              control={<Radio />}
                              label="Monthly"
                            />
                            <FormControlLabel
                              value="quarterly"
                              control={<Radio />}
                              label="Quarterly"
                            />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Box>

                  {/* Designation Selection */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      Designation
                    </Typography>
                    <Controller
                      name="designation"
                      control={control}
                      render={({ field }) => (
                        <FormControl component="fieldset" fullWidth>
                          <RadioGroup {...field}>
                            {givingOptions.map((option) => (
                              <Paper
                                key={option.value}
                                variant="outlined"
                                sx={{
                                  p: 2,
                                  mb: 1,
                                  cursor: "pointer",
                                  bgcolor:
                                    field.value === option.value
                                      ? "primary.light"
                                      : "transparent",
                                  color:
                                    field.value === option.value
                                      ? "white"
                                      : "inherit",
                                }}
                                onClick={() => field.onChange(option.value)}
                              >
                                <FormControlLabel
                                  value={option.value}
                                  control={<Radio />}
                                  label={
                                    <Box>
                                      <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 600 }}
                                      >
                                        {option.label}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        sx={{ opacity: 0.8 }}
                                      >
                                        {option.description}
                                      </Typography>
                                    </Box>
                                  }
                                  sx={{ m: 0, width: "100%" }}
                                />
                              </Paper>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Personal Information */}
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Personal Information
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
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
                  </Grid>

                  <Controller
                    name="anonymous"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Radio {...field} />}
                        label="Make this donation anonymous"
                        sx={{ mb: 3 }}
                      />
                    )}
                  />

                  {/* Payment Summary */}
                  <Paper sx={{ p: 3, bgcolor: "grey.50", mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
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
                        ${watchedAmount || "0.00"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Frequency:</Typography>
                      <Typography
                        sx={{ fontWeight: 600, textTransform: "capitalize" }}
                      >
                        {watchedFrequency?.replace("-", " ") || "One Time"}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="h6">Total:</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        ${watchedAmount || "0.00"}
                      </Typography>
                    </Box>
                  </Paper>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={isProcessing}
                    sx={{ py: 2, fontSize: "1.1rem" }}
                    startIcon={<Security />}
                  >
                    {isProcessing ? "Processing..." : "Secure Donation"}
                  </Button>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Security
                      sx={{ mr: 1, fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Your donation is secure and encrypted
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            {/* Why Give Section */}
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
                    Why Give?
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  "Each of you should give what you have decided in your heart
                  to give, not reluctantly or under compulsion, for God loves a
                  cheerful giver." - 2 Corinthians 9:7
                </Typography>
                <List dense>
                  {benefits.map((benefit, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle
                          sx={{ fontSize: 16, color: "primary.main" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={benefit}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </MotionCard>

            {/* Payment Methods */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              sx={{ mb: 3 }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CreditCard sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Payment Methods
                  </Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  We accept all major credit cards and bank transfers. All
                  transactions are processed securely through Stripe.
                </Typography>
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <Box sx={{ bgcolor: "grey.100", p: 1, borderRadius: 1 }}>
                    <Typography variant="caption">VISA</Typography>
                  </Box>
                  <Box sx={{ bgcolor: "grey.100", p: 1, borderRadius: 1 }}>
                    <Typography variant="caption">MC</Typography>
                  </Box>
                  <Box sx={{ bgcolor: "grey.100", p: 1, borderRadius: 1 }}>
                    <Typography variant="caption">AMEX</Typography>
                  </Box>
                  <Box sx={{ bgcolor: "grey.100", p: 1, borderRadius: 1 }}>
                    <Typography variant="caption">DISC</Typography>
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>

            {/* Other Ways to Give */}
            <MotionCard
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Church sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Other Ways to Give
                  </Typography>
                </Box>
                <List dense>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <AccountBalance sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mail a Check"
                      secondary="1480 Lincoln Ave, Dolton, IL 60419"
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                      secondaryTypographyProps={{ variant: "caption" }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Repeat sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Automatic Bank Transfer"
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            Contact the church office
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ fontWeight: 600, mt: 0.5 }}
                          >
                            Zelle: (773) 977-9630
                          </Typography>
                          <Typography variant="caption" display="block">
                            Zelle Name: CAC Upper Room
                          </Typography>
                        </Box>
                      }
                      primaryTypographyProps={{
                        variant: "body2",
                        fontWeight: 600,
                      }}
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <VolunteerActivism sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary="In-Person Offering"
                      secondary="During Church service"
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
