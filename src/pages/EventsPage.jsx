import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Event as EventIcon,
  AccessTime,
  LocationOn,
  Person,
  Close,
  CalendarToday,
  Repeat,
  FilterList,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useEvents, useRecurringEvents } from "../hooks/useFirestore";
import { getEventsForDate, formatTime } from "../utils/eventHelpers";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const EventsPage = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);

  // Firebase hooks
  const { events: firebaseEvents, loading, error } = useEvents();

  // Categories for filtering
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "worship", label: "Worship" },
    { value: "prayer", label: "Prayer" },
    { value: "youth", label: "Youth" },
    { value: "fellowship", label: "Fellowship" },
    { value: "education", label: "Education" },
    { value: "outreach", label: "Outreach" },
    { value: "ministry", label: "Ministry" },
  ];

  // Update events when date or category changes
  useEffect(() => {
    const updateEvents = () => {
      const selectedDateJS = selectedDate ? selectedDate.toDate() : new Date();
      const databaseEvents = firebaseEvents || [];

      const events = getEventsForDate(
        selectedDateJS,
        categoryFilter,
        databaseEvents
      );
      setEventsForSelectedDate(events);
    };

    updateEvents();
  }, [selectedDate, categoryFilter, firebaseEvents]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMMM D, YYYY");
  };

  const getCategoryColor = (category) => {
    const colors = {
      worship: "primary",
      prayer: "secondary",
      youth: "success",
      fellowship: "info",
      education: "warning",
      outreach: "error",
      ministry: "default",
    };
    return colors[category] || "default";
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MotionBox
        key="events-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Helmet>
          <title>Events - Christ Apostolic Church Hours of Mercy</title>
          <meta
            name="description"
            content="Join us for worship services, prayer meetings, and special events at Christ Apostolic Church Hours of Mercy in Dolton, Illinois."
          />
        </Helmet>

        {/* Hero Section */}
        <Box
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
                Events & Calendar
              </Typography>
              <Typography
                variant="h5"
                sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
              >
                Join us for worship, fellowship, and community events
              </Typography>
            </MotionBox>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 6 }}>
          {/* Date Picker and Category Filter */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <FilterList color="primary" />
              Filter Events
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryFilter}
                    label="Category"
                    onChange={handleCategoryChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Selected Date Events */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Events for {selectedDate.format("MMMM D, YYYY")}
            </Typography>
            {categoryFilter !== "all" && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Showing{" "}
                {categories.find((c) => c.value === categoryFilter)?.label}{" "}
                events only
              </Typography>
            )}
            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography>Loading events...</Typography>
              </Box>
            ) : eventsForSelectedDate.length > 0 ? (
              <Grid container spacing={3}>
                {eventsForSelectedDate.map((event, index) => (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={event.id || `${event.title}-${index}`}
                  >
                    <MotionCard
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      viewport={{ once: true, margin: "-50px" }}
                      sx={{
                        height: "100%",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          transition: "transform 0.3s ease",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() => handleEventClick(event)}
                    >
                      <Box
                        sx={{
                          height: 150,
                          backgroundColor: "#1e3a8a",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                        }}
                      >
                        <EventIcon sx={{ fontSize: 48, opacity: 0.7 }} />
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                          }}
                        >
                          <Chip
                            label={event.category}
                            color={getCategoryColor(event.category)}
                            size="small"
                          />
                        </Box>
                        {event.isRecurring && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              bgcolor: "rgba(0,0,0,0.7)",
                              color: "white",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Repeat sx={{ fontSize: 16 }} />
                            <Typography variant="caption">Weekly</Typography>
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {event.title}
                        </Typography>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <AccessTime
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {event.startTime
                              ? formatTime(event.startTime)
                              : event.time}
                            {event.endTime && ` - ${formatTime(event.endTime)}`}
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <LocationOn
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {event.location}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {event.description}
                        </Typography>

                        {event.pastor && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 2,
                            }}
                          >
                            <Person
                              sx={{
                                fontSize: 16,
                                mr: 1,
                                color: "text.secondary",
                              }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {event.pastor}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </MotionCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <EventIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No events found for {selectedDate.format("MMMM D, YYYY")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {categoryFilter !== "all"
                    ? `No ${categories
                        .find((c) => c.value === categoryFilter)
                        ?.label.toLowerCase()} events on this date.`
                    : "No events scheduled for this date."}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  Try selecting a different date or category.
                </Typography>
              </Paper>
            )}
          </Box>

          {/* Quick Navigation */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Navigation
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSelectedDate(dayjs());
                    setCategoryFilter("worship");
                  }}
                >
                  Today's Worship
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    // Find next Wednesday
                    const today = dayjs();
                    const nextWednesday = today.day(3).isAfter(today)
                      ? today.day(3)
                      : today.add(1, "week").day(3);
                    setSelectedDate(nextWednesday);
                    setCategoryFilter("prayer");
                  }}
                >
                  Prayer Meeting
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    // Find next Sunday
                    const today = dayjs();
                    const nextSunday = today.day(0).isAfter(today)
                      ? today.day(0)
                      : today.add(1, "week").day(0);
                    setSelectedDate(nextSunday);
                    setCategoryFilter("worship");
                  }}
                >
                  Sunday Service
                </Button>
              </Grid>
              <Grid item xs={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSelectedDate(dayjs());
                    setCategoryFilter("all");
                  }}
                >
                  All Today
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Container>

        {/* Event Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedEvent && (
            <>
              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5" component="span">
                  {selectedEvent.title}
                </Typography>
                <IconButton onClick={() => setDialogOpen(false)}>
                  <Close />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Date
                        </Typography>
                        <Typography variant="body1">
                          {selectedDate.format("MMMM D, YYYY")}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Time
                        </Typography>
                        <Typography variant="body1">
                          {selectedEvent.startTime
                            ? formatTime(selectedEvent.startTime)
                            : selectedEvent.time}
                          {selectedEvent.endTime &&
                            ` - ${formatTime(selectedEvent.endTime)}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1">
                          {selectedEvent.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  {selectedEvent.pastor && (
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <Person sx={{ mr: 1, color: "primary.main" }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Leader
                          </Typography>
                          <Typography variant="body1">
                            {selectedEvent.pastor}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {selectedEvent.isRecurring && (
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      icon={<Repeat />}
                      label="Recurring Weekly"
                      variant="outlined"
                      color="primary"
                    />
                  </Box>
                )}

                <Typography variant="body1" paragraph>
                  {selectedEvent.description}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
                <Button variant="contained" color="primary">
                  Add to Calendar
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </MotionBox>
    </LocalizationProvider>
  );
};

export default EventsPage;
