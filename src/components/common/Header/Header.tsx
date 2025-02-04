import { Box } from "@mui/material";
import WeatherRotator from './HeaderWeather/WeatherRotator';
import NotificationRotator from './HeaderNotification/NotificationRotator';
import NotificationPopover from './HeaderNotification/NotificationPopover';
import TimeDisplay from './HeaderTime/TimeDisplay';

const Header = () => {
  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          backgroundColor: "transparent",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
          minHeight: "60px",
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <NotificationPopover />
          <NotificationRotator />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WeatherRotator />
          <TimeDisplay />
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
