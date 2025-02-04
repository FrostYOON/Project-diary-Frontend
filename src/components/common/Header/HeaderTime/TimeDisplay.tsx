import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState("");

  const updateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    setCurrentTime(formattedTime);
  };

  useEffect(() => {
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        height: "38px",
        width: "130px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "absolute",
          height: "100%",
          width: "100%",
          justifyContent: "center"
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "#4a5568",
            whiteSpace: "nowrap",
            fontSize: "18px",
          }}
        >
          {currentTime}
        </Typography>
      </Box>
    </Box>
  );
};

export default TimeDisplay; 