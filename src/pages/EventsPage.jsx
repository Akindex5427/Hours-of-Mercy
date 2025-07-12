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
} from "@mui/material";
import {
  Event as EventIcon,
  AccessTime,
  LocationOn,
  Person,
  Close,
  CalendarToday,
  Repeat,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { useEvents, useRecurringEvents } from "../hooks/useFirestore";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const EventsPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recurringEvents, setRecurringEvents] = useState([]);

  // Firebase hooks
  const { events: firebaseEvents, loading, error } = useEvents();
  const { getActiveTemplates } = useRecurringEvents();

  // Use Firebase data
  const events = firebaseEvents || [];

  const categories = [
    "All",
    "Worship",
    "Prayer",
    "Youth",
    "Fellowship",
    "Study",
    "Outreach",
  ];

  // Helper function to check if an event occurs on a specific date
  const eventOccursOnDate = (event, targetDate) => {
    const eventDate = dayjs(event.date);
    const target = dayjs(targetDate);

    // For non-recurring events, simple date match
    if (!event.isRecurring) {
      return eventDate.isSame(target, "day");
    }

    // For recurring events
    if (event.recurringType === "weekly") {
      // Check if the target date has the same day of week as the event
      return eventDate.day() === target.day();
    }

    if (event.recurringType === "monthly") {
      // Check if the target date has the same day of month as the event
      return eventDate.date() === target.date();
    }

    return false;
  };

  // Comprehensive recurring events generation
  const generateRecurringEventsForDate = async (targetDate) => {
    try {
      const templates = await getActiveTemplates();
      const { generateRecurringEventInstances } = await import(
        "../firebase/recurringEventsService"
      );

      // Generate events for the selected date (single day range)
      const startDate = dayjs(targetDate).startOf("day");
      const endDate = dayjs(targetDate).endOf("day");

      return generateRecurringEventInstances(templates, startDate, endDate);
    } catch (error) {
      console.error("Error generating recurring events:", error);
      return [];
    }
  };

  // Enhanced filtering logic that includes date filtering
  const filteredEvents = (() => {
    let eventsToFilter = [...events, ...recurringEvents];

    // For selected date filtering, we need to handle recurring events
    if (selectedDate) {
      return eventsToFilter.filter((event) => {
        // Category filter
        const categoryMatch =
          selectedTab === 0 || event.category === categories[selectedTab];

        // Date filter - only show events for the selected date
        const dateMatch = eventOccursOnDate(event, selectedDate);

        return categoryMatch && dateMatch;
      });
    }

    // If no date is selected, show all upcoming events
    return eventsToFilter.filter((event) => {
      const categoryMatch =
        selectedTab === 0 || event.category === categories[selectedTab];
      const isUpcoming = dayjs(event.date).isAfter(dayjs().subtract(1, "day"));
      return categoryMatch && isUpcoming;
    });
  })();

  // For displaying upcoming events (separate from date-filtered events)
  const allFilteredEvents = events.filter((event) => {
    const categoryMatch =
      selectedTab === 0 || event.category === categories[selectedTab];
    return categoryMatch;
  });

  const upcomingEvents = allFilteredEvents.filter((event) =>
    dayjs(event.date).isAfter(dayjs().subtract(1, "day"))
  );

  const todaysEvents = allFilteredEvents.filter((event) =>
    dayjs(event.date).isSame(dayjs(), "day")
  );

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMMM D, YYYY");
  };

  const formatDateRange = (startDate, endDate) => {
    if (!endDate) return formatDate(startDate);
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.isSame(end, "month")) {
      return `${start.format("MMMM D")} - ${end.format("D, YYYY")}`;
    }
    return `${start.format("MMMM D")} - ${end.format("MMMM D, YYYY")}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Worship: "primary",
      Prayer: "secondary",
      Youth: "success",
      Fellowship: "info",
      Study: "warning",
      Outreach: "error",
    };
    return colors[category] || "default";
  };

  // Load recurring events when the selected date changes
  React.useEffect(() => {
    const loadRecurringEvents = async () => {
      if (selectedDate) {
        const recurringEventInstances = await generateRecurringEventsForDate(
          selectedDate
        );
        setRecurringEvents(recurringEventInstances);
      }
    };

    loadRecurringEvents();
  }, [selectedDate, getActiveTemplates]);

  return (
    <>
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
        {/* Today's Events Highlight */}
        {todaysEvents.length > 0 && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: "secondary.light",
              color: "white",
            }}
          >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Today's Events
            </Typography>
            <Grid container spacing={2}>
              {todaysEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.time} • {event.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Date Picker and Tabs */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              {categories.map((category, index) => (
                <Tab key={index} label={category} />
              ))}
            </Tabs>
          </Grid>
        </Grid>

        {/* Events Grid */}
        {selectedDate && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Events for {dayjs(selectedDate).format("MMMM D, YYYY")}
            </Typography>
            <Divider />
          </Box>
        )}

        <Grid container spacing={3}>
          {filteredEvents.map((event, index) => (
            <Grid item xs={12} md={6} lg={4} key={event.id}>
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                sx={{
                  height: "100%",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease",
                  },
                }}
                onClick={() => handleEventClick(event)}
              >
                <Box
                  sx={{
                    height: 150,
                    backgroundImage: `url(${event.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                  }}
                >
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
                      <Typography variant="caption">
                        {event.recurring}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {event.title}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarToday
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {event.endDate
                        ? formatDateRange(event.date, event.endDate)
                        : formatDate(event.date)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccessTime
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {event.time}
                      {event.endTime && ` - ${event.endTime}`}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LocationOn
                      sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {event.location}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>

                  {event.pastor && (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Person
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
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

        {filteredEvents.length === 0 && (
          <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
            <EventIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {selectedDate
                ? `No events found for ${dayjs(selectedDate).format(
                    "MMMM D, YYYY"
                  )}`
                : "No upcoming events found"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedDate
                ? 'Try selecting a different date or check the "All Events" category.'
                : "Check back soon for new events and activities."}
            </Typography>
          </Paper>
        )}
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
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `url(${selectedEvent.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: 1,
                  mb: 3,
                }}
              />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarToday sx={{ mr: 1, color: "primary.main" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1">
                        {selectedEvent.endDate
                          ? formatDateRange(
                              selectedEvent.date,
                              selectedEvent.endDate
                            )
                          : formatDate(selectedEvent.date)}
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
                        {selectedEvent.time}
                        {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
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
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                    label={`Recurring ${selectedEvent.recurring}`}
                    variant="outlined"
                    color="primary"
                  />
                </Box>
              )}

              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>

              {selectedEvent.speakers && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Speakers
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedEvent.speakers.map((speaker, index) => (
                      <Chip key={index} label={speaker} variant="outlined" />
                    ))}
                  </Box>
                </Box>
              )}
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
    </>
  );
};

export default EventsPage;
