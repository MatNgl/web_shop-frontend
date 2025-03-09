import React, { useEffect, useState } from "react";
import { Snackbar, Alert, LinearProgress, Box } from "@mui/material";

const Toast = ({ open, message, type, onClose, duration = 5000 }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (open) {
      setProgress(100);
      let decrement = 100 / (duration / 50);
      let interval = setInterval(() => {
        setProgress((prev) => (prev <= 0 ? 0 : prev - decrement));
      }, 50);

      setTimeout(() => {
        clearInterval(interval);
        onClose();
      }, duration);

      return () => clearInterval(interval);
    }
  }, [open, duration, onClose]);

  return (
    <Snackbar open={open} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={duration} onClose={onClose}>
      <Box sx={{ position: "relative", width: "100%" }}>
        <Alert severity={type}>{message}</Alert>
        <LinearProgress sx={{ position: "absolute", bottom: 0, left: 0, width: "100%" }} variant="determinate" value={progress} />
      </Box>
    </Snackbar>
  );
};

export default Toast;
