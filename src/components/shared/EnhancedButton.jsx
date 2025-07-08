import React from "react";
import { Button } from "@mui/material";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

/**
 * Enhanced Button Component with consistent hover effects
 */
const EnhancedButton = ({
  children,
  variant = "contained",
  color = "primary",
  size = "large",
  hoverEffect = "lift",
  sx = {},
  ...otherProps
}) => {
  const getHoverStyles = () => {
    const baseStyles = {
      transition: "all 0.3s ease-in-out",
      px: 4,
      py: 1.5,
      fontSize: "1.1rem",
      fontWeight: 600,
    };

    switch (hoverEffect) {
      case "lift":
        return {
          ...baseStyles,
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow:
              variant === "contained"
                ? "0 8px 25px rgba(44, 85, 48, 0.3)"
                : "0 8px 25px rgba(44, 85, 48, 0.2)",
          },
        };

      case "scale":
        return {
          ...baseStyles,
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0 6px 20px rgba(44, 85, 48, 0.25)",
          },
        };

      case "glow":
        return {
          ...baseStyles,
          "&:hover": {
            boxShadow: "0 0 20px rgba(212, 175, 55, 0.6)",
            transform: "translateY(-2px)",
          },
        };

      case "fill":
        return {
          ...baseStyles,
          borderWidth: variant === "outlined" ? 2 : 0,
          "&:hover": {
            ...(variant === "outlined" && {
              borderWidth: 2,
              bgcolor: `${color}.main`,
              color: "white",
            }),
            transform: "translateY(-3px)",
            boxShadow: "0 8px 25px rgba(44, 85, 48, 0.2)",
          },
        };

      default:
        return baseStyles;
    }
  };

  return (
    <MotionButton
      variant={variant}
      color={color}
      size={size}
      whileHover={{
        scale: hoverEffect === "scale" ? 1.05 : 1,
        y: hoverEffect === "lift" ? -3 : 0,
      }}
      whileTap={{ scale: 0.95 }}
      sx={{
        ...getHoverStyles(),
        ...sx,
      }}
      {...otherProps}
    >
      {children}
    </MotionButton>
  );
};

export default EnhancedButton;
