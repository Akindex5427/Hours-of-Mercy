import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Email,
  Phone,
  Person,
  School,
  Work,
  Star,
  Church,
  Group,
  VolunteerActivism,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const StaffDirectory = () => {
  // Static staff data that always works
  const staff = [
    {
      id: 1,
      name: "Peter Olawale Sunday",
      title: "Senior Pastor",
      department: "Leadership",
      email: "pastor.olawale@hoursofmercy.org",
      phone: "(773) 977-9630",
      bio: "Pastor Olawale has been serving Christ Apostolic Church Hours of Mercy for over 15 years. He holds a Master of Divinity from Chicago Theological Seminary and is passionate about teaching God's Word and shepherding the flock.",
      experience: [
        "15+ years in pastoral ministry",
        "Former missionary to Nigeria",
        "Church planting experience",
      ],
      specialties: [
        "Expository preaching",
        "Pastoral counseling",
        "Church leadership",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2009",
    },
    {
      id: 2,
      name: "Pastor Mary Johnson",
      title: "Associate Pastor",
      department: "Pastoral Care",
      email: "pastor.mary@hoursofmercy.org",
      phone: "(708) 555-0125",
      bio: "Pastor Mary oversees our pastoral care ministry and women's fellowship. She has a heart for prayer and helping people grow in their relationship with Jesus Christ.",
      education: [
        "M.A. Christian Counseling, Trinity Seminary",
        "B.S. Psychology, Wheaton College",
      ],
      experience: [
        "12 years in ministry",
        "Licensed Christian counselor",
        "Women's ministry leader",
      ],
      specialties: [
        "Pastoral counseling",
        "Women's ministry",
        "Prayer ministry",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2012",
    },
    {
      id: 3,
      name: "Pastor David Wilson",
      title: "Youth Pastor",
      department: "Youth Ministry",
      email: "pastor.david@hoursofmercy.org",
      phone: "(708) 555-0126",
      bio: "Pastor David leads our youth ministry with energy and passion. He loves connecting with young people and helping them discover their purpose in God's plan.",
      education: [
        "B.A. Youth Ministry, North Central University",
        "Certificate in Biblical Studies",
      ],
      experience: [
        "8 years in youth ministry",
        "Former youth camp director",
        "Mentorship program developer",
      ],
      specialties: [
        "Youth evangelism",
        "Leadership development",
        "Community outreach",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2017",
    },
    {
      id: 4,
      name: "Minister Sarah Brown",
      title: "Worship Leader",
      department: "Worship Ministry",
      email: "worship@hoursofmercy.org",
      phone: "(708) 555-0127",
      bio: "Minister Sarah leads our worship team and is passionate about creating an atmosphere where people can encounter God through music and praise.",
      education: [
        "B.M. Music Ministry, Berklee College",
        "Certificate in Worship Leadership",
      ],
      experience: [
        "10 years in worship ministry",
        "Professional musician",
        "Choir director",
      ],
      specialties: ["Worship leading", "Music ministry", "Team leadership"],
      avatar: "/api/placeholder/150/150",
      joinDate: "2015",
    },
    {
      id: 5,
      name: "Brother Robert Davis",
      title: "Administrator",
      department: "Administration",
      email: "admin@hoursofmercy.org",
      phone: "(708) 555-0128",
      bio: "Brother Robert handles the administrative affairs of the church and ensures everything runs smoothly behind the scenes.",
      education: [
        "B.A. Business Administration, DePaul University",
        "Certificate in Non-Profit Management",
      ],
      experience: [
        "6 years in church administration",
        "Former corporate manager",
        "Financial planning experience",
      ],
      specialties: [
        "Church administration",
        "Financial management",
        "Operations coordination",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2019",
    },
  ];

  const departments = [...new Set(staff.map((member) => member.department))];

  const getDepartmentColor = (department) => {
    const colors = {
      Leadership: "primary",
      "Pastoral Care": "secondary",
      "Youth Ministry": "success",
      "Worship Ministry": "info",
      Administration: "warning",
    };
    return colors[department] || "default";
  };

  return (
    <>
      <Helmet>
        <title>Staff Directory - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Meet our dedicated pastoral team and staff at Christ Apostolic Church Hours of Mercy in Dolton, Illinois."
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
              Our Leadership Team
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Meet the dedicated servants who shepherd our congregation with
              love, wisdom, and faith
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Department Overview */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Ministry Departments
          </Typography>
          <Grid container spacing={2}>
            {departments.map((department, index) => (
              <Grid item xs={12} sm={6} md={3} key={department}>
                <MotionCard
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  sx={{ textAlign: "center", p: 2 }}
                >
                  <CardContent>
                    <Group
                      sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      {department}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {
                        staff.filter(
                          (member) => member.department === department
                        ).length
                      }{" "}
                      member(s)
                    </Typography>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Staff Grid */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Meet Our Team
        </Typography>

        <Grid container spacing={4}>
          {staff.map((member, index) => (
            <Grid item xs={12} md={6} lg={4} key={member.id}>
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                sx={{ height: "100%", position: "relative" }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: "auto",
                        mb: 2,
                        border: 3,
                        borderColor: "primary.main",
                      }}
                    >
                      <Person sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="primary"
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                    >
                      {member.title}
                    </Typography>
                    <Chip
                      label={member.department}
                      color={getDepartmentColor(member.department)}
                      size="small"
                    />
                  </Box>

                  {/* Bio */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{ mb: 3 }}
                  >
                    {member.bio}
                  </Typography>

                  {/* Contact Info */}
                  <Paper sx={{ p: 2, bgcolor: "grey.50", mb: 3 }}>
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Email sx={{ color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={member.email}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Phone sx={{ color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={member.phone}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Work sx={{ color: "primary.main" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Joined ${member.joinDate}`}
                          primaryTypographyProps={{ variant: "body2" }}
                        />
                      </ListItem>
                    </List>
                  </Paper>

                  {/* Education */}
                  {member.education && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <School sx={{ mr: 1, fontSize: 16 }} />
                        Education
                      </Typography>
                      <List dense>
                        {member.education.map((edu, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemText
                              primary={edu}
                              primaryTypographyProps={{
                                variant: "caption",
                                color: "text.secondary",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Experience */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <VolunteerActivism sx={{ mr: 1, fontSize: 16 }} />
                      Experience
                    </Typography>
                    <List dense>
                      {member.experience.map((exp, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemText
                            primary={exp}
                            primaryTypographyProps={{
                              variant: "caption",
                              color: "text.secondary",
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Specialties */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Star sx={{ mr: 1, fontSize: 16 }} />
                      Specialties
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {member.specialties.map((specialty, index) => (
                        <Chip
                          key={index}
                          label={specialty}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Contact Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<Email />}
                    href={`mailto:${member.email}`}
                    sx={{ mt: 3 }}
                  >
                    Contact {member.name.split(" ")[0]}
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Contact Section */}
        <Paper
          sx={{ p: 4, mt: 6, textAlign: "center", bgcolor: "primary.light" }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 600, color: "white" }}
          >
            Have Questions? We're Here to Help
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 3, color: "white", opacity: 0.9 }}
          >
            Our pastoral team is available for counseling, prayer, and spiritual
            guidance.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            startIcon={<Church />}
            href="/contact"
          >
            Contact Our Church
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default StaffDirectory;
