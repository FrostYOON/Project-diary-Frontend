import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { WeatherInfo } from '../../types/weather.types';
import { CITY_NAME_KR, WEATHER_CONFIG, WEATHER_API } from '../../constants/weathers';

const Header = () => {
  const [weatherList, setWeatherList] = useState<WeatherInfo[]>([]);
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  // const [open, setOpen] = useState(false);
  
  const initialized = useRef(false);
  // const lastFetchTime = useRef(0);

  const fetchWeather = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}${WEATHER_API.ENDPOINT}`);
      if (response.data.success && response.data.data?.length > 0) {
        setWeatherList(response.data.data);
      }
    } catch (error) {
      console.error('날씨 정보 조회 실패:', error);
    }
  }, []);

  // 초기화 및 인터벌 설정
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchWeather(); // 즉시 첫 데이터 로드
    }

    const interval = setInterval(fetchWeather, WEATHER_CONFIG.FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  // 날씨 정보 순환 
  const rotateWeather = useCallback(() => {
    setPosition(-100);
    
    setTimeout(() => {
      setCurrentWeatherIndex(prev => 
        prev === (weatherList?.length ?? 0) - 1 ? 0 : prev + 1
      );
      setPosition(100);
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          setPosition(0);
        }, WEATHER_CONFIG.TRANSITION_DELAY);
      });
    }, WEATHER_CONFIG.SLIDE_DURATION);
  }, [weatherList]);

  // // weatherList 변경 확인용 디버깅
  // useEffect(() => {
  //   console.log('현재 weatherList:', weatherList);
  // }, [weatherList]);

  // 현재 시간 관리
  const updateTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    setCurrentTime(formattedTime);
  };

  useEffect(() => {
    // 초기 시간 설정
    updateTime();
    // 1초마다 시간 업데이트
    const timeInterval = setInterval(updateTime, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // 날씨 순환 인터벌 설정
  useEffect(() => {
    if (weatherList.length === 0) return;
    const rotationInterval = setInterval(rotateWeather, WEATHER_CONFIG.ROTATION_INTERVAL);
    return () => clearInterval(rotationInterval);
  }, [weatherList, rotateWeather]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',  // 전체 컨텐츠 오른쪽 정렬
        padding: '12px 24px',
        backgroundColor: 'transparent',  // 배경색 투명으로 변경
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',  // 테두리도 반투명하게 수정
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        minHeight: '60px',
      }}
    >
      <Box sx={{ 
        position: 'relative',
        height: '38px',
        width: '170px',
        mr: 2,
        overflow: 'hidden'
      }}>
        {weatherList[currentWeatherIndex] && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '4px 12px',
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `translateY(${position}%)`,
              transition: 'transform 0.5s ease-out'
            }}
          >
            <img
              src={`${WEATHER_API.ICON_URL}/${weatherList[currentWeatherIndex].icon}.png`}
              alt={weatherList[currentWeatherIndex].description}
              style={{ width: 30, height: 30 }}
            />
            <Typography variant="body2" sx={{ 
              ml: 1,
              fontWeight: 500,
              color: '#2c3e50'
            }}>
              {CITY_NAME_KR[weatherList[currentWeatherIndex].city] || weatherList[currentWeatherIndex].city} {weatherList[currentWeatherIndex].temp}°C
            </Typography>
          </Box>
        )}
      </Box>
      <Typography variant="body2" sx={{ 
        fontWeight: 500,
        color: '#2c3e50',
        minWidth: '80px',
        textAlign: 'right'
      }}>
        {currentTime}
      </Typography>
    </Box>
  );
};

export default Header;
