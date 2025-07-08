import React from "react";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import HOMImage from "../../assets/HOM.png";

const MotionBox = motion(Box);

/**
 * Reusable Hero Background Component
 * Uses the church's HOM.png image as a background with elegant hover effects
 */
const HeroBackground = ({
  children,
  minHeight = "60vh",
  overlayOpacity = 0.7,
  imageOpacity = 0.4,
  enableHover = true,
  sx = {},
  ...otherProps
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        position: "relative",
        minHeight,
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #2c5530 0%, #1a3a1d 100%)",
        color: "white",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${HOMImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: imageOpacity,
          transition: enableHover ? "all 0.8s ease-in-out" : "none",
          zIndex: 0,
        },
        ...(enableHover && {
          "&:hover::before": {
            opacity: imageOpacity + 0.2,
            transform: "scale(1.05)",
          },
        }),
        ...sx,
      }}
      {...otherProps}
    >
      {/* Overlay for better text readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, rgba(44, 85, 48, ${overlayOpacity}) 0%, rgba(26, 58, 29, ${
            overlayOpacity + 0.1
          }) 100%)`,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      >
        {children}
      </Box>
    </MotionBox>
  );
};

export default HeroBackground;
