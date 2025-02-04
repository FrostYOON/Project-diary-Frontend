import { Box, Typography } from '@mui/material';
import { useWeather } from '../../../../hooks/useWeather';
import { CITY_NAME_KR } from '../../../../constants/weathers';

const WeatherRotator = () => {
  const { currentWeather, position } = useWeather();

  if (!currentWeather) return null;

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
          justifyContent: "center",
          position: "absolute",
          height: "100%",
          width: "100%",
          transform: `translateY(${position}%)`,
          transition: "transform 0.5s ease-in-out",
        }}
      >
        <img 
          src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
          alt={currentWeather.weather}
          style={{ 
            width: '38px', 
            height: '38px',
            marginLeft: '-7px',
            filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.1))'
          }}
        />
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "#4a5568",
            whiteSpace: "nowrap",
            fontSize: "18px",
          }}
        >
          {CITY_NAME_KR[currentWeather.city]} {currentWeather.temp}°C
        </Typography>
      </Box>
    </Box>
  );
};

export default WeatherRotator; 