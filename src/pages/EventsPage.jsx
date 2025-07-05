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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Paper,
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

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const EventsPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const events = [
    {
      id: 1,
      title: "Sunday Worship Service",
      date: "2025-07-06",
      time: "8:00 AM & 11:00 AM",
      endTime: "12:30 PM",
      location: "Main Sanctuary",
      description:
        "Join us for powerful worship, inspiring music, and life-changing messages from God's Word.",
      category: "Worship",
      recurring: "Weekly",
      pastor: "Pastor John Smith",
      isRecurring: true,
      image: "/api/placeholder/400/250",
    },
    {
      id: 2,
      title: "Wednesday Prayer Meeting",
      date: "2025-07-09",
      time: "7:00 PM",
      endTime: "8:30 PM",
      location: "Fellowship Hall",
      description:
        "Come together as we seek God's face in prayer for our church, community, and world.",
      category: "Prayer",
      recurring: "Weekly",
      pastor: "Pastor Mary Johnson",
      isRecurring: true,
      image: "/api/placeholder/400/250",
    },
    {
      id: 3,
      title: "Youth Conference 2025",
      date: "2025-07-15",
      time: "9:00 AM",
      endTime: "6:00 PM",
      endDate: "2025-07-17",
      location: "Church Campus",
      description:
        "A three-day conference designed to inspire and empower our young people in their faith journey.",
      category: "Youth",
      pastor: "Pastor David Wilson",
      isRecurring: false,
      speakers: [
        "Pastor David Wilson",
        "Youth Leader Sarah Brown",
        "Guest Speaker Mike Johnson",
      ],
      image: "/api/placeholder/400/250",
    },
    {
      id: 4,
      title: "Women's Fellowship Breakfast",
      date: "2025-07-12",
      time: "9:00 AM",
      endTime: "11:00 AM",
      location: "Fellowship Hall",
      description:
        "Ladies, join us for breakfast, fellowship, and encouragement as we study God's Word together.",
      category: "Fellowship",
      recurring: "Monthly",
      pastor: "Sister Janet Williams",
      isRecurring: true,
      image: "/api/placeholder/400/250",
    },
    {
      id: 5,
      title: "Men's Bible Study",
      date: "2025-07-10",
      time: "6:30 PM",
      endTime: "8:00 PM",
      location: "Conference Room",
      description:
        "Men of God, come study the Word and build strong brotherly bonds in Christ.",
      category: "Study",
      recurring: "Weekly",
      pastor: "Brother Robert Davis",
      isRecurring: true,
      image: "/api/placeholder/400/250",
    },
    {
      id: 6,
      title: "Community Outreach Day",
      date: "2025-07-19",
      time: "10:00 AM",
      endTime: "4:00 PM",
      location: "Various Locations",
      description:
        "Join us as we serve our community through food distribution, neighborhood cleanup, and sharing God's love.",
      category: "Outreach",
      isRecurring: false,
      image: "/api/placeholder/400/250",
    },
  ];

  const categories = [
    "All",
    "Worship",
    "Prayer",
    "Youth",
    "Fellowship",
    "Study",
    "Outreach",
  ];

  const filteredEvents = events.filter((event) => {
    const categoryMatch =
      selectedTab === 0 || event.category === categories[selectedTab];
    return categoryMatch;
  });

  const upcomingEvents = filteredEvents.filter((event) =>
    dayjs(event.date).isAfter(dayjs().subtract(1, "day"))
  );
  const todaysEvents = filteredEvents.filter((event) =>
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
        <Grid container spacing={3}>
          {upcomingEvents.map((event, index) => (
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

        {upcomingEvents.length === 0 && (
          <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
            <EventIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No upcoming events found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back soon for new events and activities.
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
