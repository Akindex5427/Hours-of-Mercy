import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  YouTube,
  LocationOn,
  Phone,
  Email,
  AccessTime,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "primary.main",
        color: "white",
        pt: 6,
        pb: 3,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Church Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
              Hours of Mercy
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "secondary.main", mb: 2 }}
            >
              Christ Apostolic Church
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                1480 Lincoln Ave
                <br />
                Dolton, Illinois 60419
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">(708) 555-0123</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">info@hoursofmercy.org</Typography>
            </Box>

            {/* Social Media */}
            <Box>
              <IconButton
                sx={{ color: "white", "&:hover": { color: "secondary.main" } }}
                aria-label="Facebook"
              >
                <Facebook />
              </IconButton>
              <IconButton
                sx={{ color: "white", "&:hover": { color: "secondary.main" } }}
                aria-label="Instagram"
              >
                <Instagram />
              </IconButton>
              <IconButton
                sx={{ color: "white", "&:hover": { color: "secondary.main" } }}
                aria-label="YouTube"
              >
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Service Times */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Service Times
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <AccessTime sx={{ mr: 1, fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Sunday Worship
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ ml: 3, mb: 1 }}>
                8:00 AM - Early Service
              </Typography>
              <Typography variant="body2" sx={{ ml: 3, mb: 2 }}>
                11:00 AM - Main Service
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Wednesday Prayer Meeting
              </Typography>
              <Typography variant="body2" sx={{ ml: 3, mb: 2 }}>
                7:00 PM
              </Typography>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                Friday Bible Study
              </Typography>
              <Typography variant="body2" sx={{ ml: 3 }}>
                7:30 PM
              </Typography>
            </Box>
          </Grid>

          {/* Newsletter Signup */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Stay Connected
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Subscribe to our newsletter for updates on services, events, and
              church news.
            </Typography>
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{ mb: 3 }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  mb: 2,
                  bgcolor: "rgba(255,255,255,0.1)",
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "secondary.main",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.7)",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth
                disabled={!email}
              >
                Subscribe
              </Button>
            </Box>

            {/* Quick Links */}
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Link
                component={RouterLink}
                to="/prayer-request"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { color: "secondary.main" },
                }}
              >
                Prayer Request
              </Link>
              <Link
                component={RouterLink}
                to="/member-portal"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { color: "secondary.main" },
                }}
              >
                Member Portal
              </Link>
              <Link
                component={RouterLink}
                to="/giving"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  "&:hover": { color: "secondary.main" },
                }}
              >
                Online Giving
              </Link>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Christ Apostolic Church Hours of Mercy.
            All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.6, mt: 0.5 }}>
            Built with love for our community
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
