import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";

const GoogleMap = ({
  address = "14801 Lincoln Ave, Dolton, Illinois 60419",
  churchName = "Christ Apostolic Church Hours of Mercy",
  height = 400,
  zoom = 15,
}) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      const apiKey =
        process.env.VITE_GOOGLE_MAPS_API_KEY ||
        process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

      // If no API key is available, show fallback
      if (!apiKey || apiKey === "YOUR_API_KEY_HERE") {
        setError(
          "Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables."
        );
        setIsLoading(false);
        return;
      }

      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        initializeMap();
        return;
      }

      // Check if script is already being loaded
      if (window.googleMapsLoading) {
        // Wait for the existing script to load
        const checkGoogleMaps = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogleMaps);
            initializeMap();
          }
        }, 100);
        return;
      }

      // Set flag to prevent multiple script loads
      window.googleMapsLoading = true;

      // Create and load Google Maps script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        window.googleMapsLoading = false;
        initializeMap();
      };

      script.onerror = () => {
        window.googleMapsLoading = false;
        setError("Failed to load Google Maps. Please check your API key.");
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      try {
        // Initialize the map
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: zoom,
          center: { lat: 41.6289, lng: -87.6089 }, // Default to Dolton, IL coordinates
          mapTypeId: window.google.maps.MapTypeId.ROADMAP,
          styles: [
            {
              featureType: "poi.business",
              stylers: [{ visibility: "on" }],
            },
            {
              featureType: "poi.park",
              stylers: [{ visibility: "on" }],
            },
          ],
        });

        // Geocode the address to get exact coordinates
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;

            // Center map on the exact location
            map.setCenter(location);

            // Create custom marker
            const marker = new window.google.maps.Marker({
              position: location,
              map: map,
              title: churchName,
              animation: window.google.maps.Animation.DROP,
              icon: {
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="40" height="60" viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C9 0 0 9 0 20c0 15 20 40 20 40s20-25 20-40C40 9 31 0 20 0z" fill="#1976d2"/>
                    <circle cx="20" cy="20" r="8" fill="white"/>
                    <path d="M20 12l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z" fill="#1976d2"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(40, 60),
                anchor: new window.google.maps.Point(20, 60),
              },
            });

            // Info window with church details
            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 250px;">
                  <h3 style="margin: 0 0 10px 0; color: #1976d2; font-size: 16px;">
                    ${churchName}
                  </h3>
                  <p style="margin: 0 0 8px 0; font-size: 14px;">
                    <strong>Address:</strong><br>
                    ${address}
                  </p>
                  <p style="margin: 0 0 10px 0; font-size: 14px;">
                    <strong>Phone:</strong> (708) 555-0123
                  </p>
                  <div style="text-align: center;">
                    <a 
                      href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                        address
                      )}" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style="
                        display: inline-block;
                        background: #1976d2;
                        color: white;
                        padding: 8px 16px;
                        text-decoration: none;
                        border-radius: 4px;
                        font-size: 14px;
                        margin-top: 5px;
                      "
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              `,
            });

            // Show info window when marker is clicked
            marker.addListener("click", () => {
              infoWindow.open(map, marker);
            });

            // Auto-open info window after a short delay
            setTimeout(() => {
              infoWindow.open(map, marker);
            }, 1000);

            setIsLoading(false);
          } else {
            console.error("Geocoding failed:", status);
            setError("Could not find the specified address on the map.");
            setIsLoading(false);
          }
        });
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to initialize the map.");
        setIsLoading(false);
      }
    };

    loadGoogleMaps();

    // Cleanup function
    return () => {
      // Remove the script if component unmounts during loading
      if (window.googleMapsLoading) {
        const scripts = document.querySelectorAll(
          'script[src*="maps.googleapis.com"]'
        );
        scripts.forEach((script) => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        });
        window.googleMapsLoading = false;
      }
    };
  }, [address, churchName, zoom]);

  if (error) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        {error}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1976d2",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            View on Google Maps →
          </a>
        </Box>
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        position: "relative",
        height: height,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "grey.100",
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Loading map...
            </Typography>
          </Box>
        </Box>
      )}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
        }}
      />
    </Box>
  );
};

export default GoogleMap;
