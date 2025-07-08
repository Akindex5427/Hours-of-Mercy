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
      specialties: ["Vocal training", "Music arrangement", "Worship leading"],
      avatar: "/api/placeholder/150/150",
      joinDate: "2015",
    },
    {
      id: 5,
      name: "Brother Robert Davis",
      title: "Church Administrator",
      department: "Administration",
      email: "admin@hoursofmercy.org",
      phone: "(708) 555-0128",
      bio: "Brother Robert oversees the administrative operations of the church, ensuring everything runs smoothly so our ministry can focus on serving God and our community.",
      education: [
        "M.B.A. Non-Profit Management",
        "B.S. Business Administration",
      ],
      experience: [
        "20+ years in administration",
        "Non-profit management",
        "Financial oversight",
      ],
      specialties: [
        "Operations management",
        "Financial administration",
        "Facility management",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2010",
    },
    {
      id: 6,
      name: "Sister Lisa Thompson",
      title: "Children's Ministry Director",
      department: "Children's Ministry",
      email: "children@hoursofmercy.org",
      phone: "(708) 555-0129",
      bio: "Sister Lisa has a special calling to work with children and loves helping them learn about Jesus in fun and engaging ways.",
      education: [
        "B.A. Elementary Education",
        "Certificate in Children's Ministry",
      ],
      experience: [
        "15 years in children's ministry",
        "Former elementary teacher",
        "VBS coordinator",
      ],
      specialties: [
        "Child development",
        "Bible teaching",
        "Program coordination",
      ],
      avatar: "/api/placeholder/150/150",
      joinDate: "2013",
    },
  ];

  const departments = [
    { name: "Leadership", icon: <Star />, count: 2 },
    { name: "Pastoral Care", icon: <Church />, count: 1 },
    { name: "Youth Ministry", icon: <Group />, count: 1 },
    { name: "Worship Ministry", icon: <Person />, count: 1 },
    { name: "Administration", icon: <Work />, count: 1 },
    { name: "Children's Ministry", icon: <School />, count: 1 },
  ];

  const getDepartmentColor = (department) => {
    const colors = {
      Leadership: "primary",
      "Pastoral Care": "secondary",
      "Youth Ministry": "success",
      "Worship Ministry": "info",
      Administration: "warning",
      "Children's Ministry": "error",
    };
    return colors[department] || "default";
  };

  return (
    <>
      <Helmet>
        <title>Staff Directory - Christ Apostolic Church Hours of Mercy</title>
        <meta
          name="description"
          content="Meet our dedicated pastoral team and staff at Christ Apostolic Church Hours of Mercy. Learn about their backgrounds and ministries."
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
              Our Staff
            </Typography>
            <Typography
              variant="h5"
              sx={{ opacity: 0.9, maxWidth: "600px", mx: "auto" }}
            >
              Meet the dedicated team serving our church family
            </Typography>
          </MotionBox>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Department Overview */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mb: 6 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontWeight: 600, textAlign: "center", mb: 4 }}
          >
            Our Ministry Departments
          </Typography>
          <Grid container spacing={2}>
            {departments.map((dept, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: "center",
                    bgcolor: `${getDepartmentColor(dept.name)}.light`,
                    color: "white",
                  }}
                >
                  <Box sx={{ mb: 1 }}>{dept.icon}</Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {dept.name}
                  </Typography>
                  <Typography variant="caption">
                    {dept.count} {dept.count === 1 ? "member" : "members"}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </MotionBox>

        {/* Staff Cards */}
        <Grid container spacing={4}>
          {staff.map((member, index) => (
            <Grid item xs={12} md={6} key={member.id}>
              <MotionCard
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                sx={{
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.3s ease",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      sx={{ width: 80, height: 80, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 600, mb: 0.5 }}
                      >
                        {member.name}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                      >
                        {member.title}
                      </Typography>
                      <Chip
                        label={member.department}
                        color={getDepartmentColor(member.department)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {/* Contact Info */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Email
                        sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2">{member.email}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Phone
                        sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2">{member.phone}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <VolunteerActivism
                        sx={{ mr: 1, fontSize: 18, color: "text.secondary" }}
                      />
                      <Typography variant="body2">
                        Serving since {member.joinDate}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Bio */}
                  <Typography variant="body2" paragraph>
                    {member.bio}
                  </Typography>

                  {/* Education */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Education
                    </Typography>
                    <List dense>
                      {member.education.map((edu, eduIndex) => (
                        <ListItem key={eduIndex} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <School
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={edu}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Experience */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Experience
                    </Typography>
                    <List dense>
                      {member.experience.map((exp, expIndex) => (
                        <ListItem key={expIndex} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 24 }}>
                            <Work
                              sx={{ fontSize: 16, color: "text.secondary" }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={exp}
                            primaryTypographyProps={{ variant: "body2" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  {/* Specialties */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      Ministry Specialties
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {member.specialties.map((specialty, specIndex) => (
                        <Chip
                          key={specIndex}
                          label={specialty}
                          size="small"
                          variant="outlined"
                          color={getDepartmentColor(member.department)}
                        />
                      ))}
                    </Box>
                  </Box>

                  {/* Contact Button */}
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<Email />}
                  >
                    Contact {member.name.split(" ")[1]}
                  </Button>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>

        {/* Contact Section */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mt: 8 }}
        >
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "primary.light",
              color: "white",
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Need to Contact Someone?
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              If you're not sure who to contact, our church office can help
              direct your inquiry to the right person.
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<Phone />}
              >
                Call Office: (708) 555-0123
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                startIcon={<Email />}
                sx={{
                  borderColor: "rgba(255,255,255,0.5)",
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                Email: info@hoursofmercy.org
              </Button>
            </Box>
          </Paper>
        </MotionBox>

        {/* Join Our Team */}
        <MotionBox
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{ mt: 6 }}
        >
          <Card>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Interested in Joining Our Team?
              </Typography>
              <Typography variant="body1" paragraph>
                We're always looking for dedicated individuals who feel called
                to serve in ministry. Whether you're interested in full-time,
                part-time, or volunteer positions, we'd love to hear from you.
              </Typography>
              <Button variant="contained" color="primary" size="large">
                View Opportunities
              </Button>
            </CardContent>
          </Card>
        </MotionBox>
      </Container>
    </>
  );
};

export default StaffDirectory;
