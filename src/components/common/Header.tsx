import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { WeatherInfo, CityNameMap } from '../../types/weather.types';

const Header = () => {
  const [weatherList, setWeatherList] = useState<WeatherInfo[]>([]);
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [position, setPosition] = useState(0);  // 슬라이드 위치 상태
  const initialFetchRef = useRef(false);

  // 도시 이름 한글 변환 맵
  const cityNameKR: CityNameMap = {
    'Seoul': '서울',
    'Incheon': '인천',
    'Suwon': '수원',
    'Seongnam': '성남',
    'Goyang': '고양',
    'Yongin': '용인',
    'Gimpo': '김포',
    'Hanam': '하남',
    'Busan': '부산',
    'Daegu': '대구',
    'Daejeon': '대전',
    'Gwangju': '광주',
    'Ulsan': '울산',
    'Sejong': '세종',
    'Jeonju': '전주'
  };

  // 날씨 정보 가져오기
  const fetchWeather = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/weather`);
      if (response.data.success && response.data.data.length > 0) {
        setWeatherList(response.data.data);
      }
    } catch (error) {
      console.error('날씨 정보 조회 실패:', error);
    }
  };

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
        }, 50);
      });
    }, 500);
  }, [weatherList]);

  useEffect(() => {
    if (initialFetchRef.current) return;
    initialFetchRef.current = true;

    let weatherFetchInterval: NodeJS.Timeout;
    let rotationInterval: NodeJS.Timeout;

    const initWeather = async () => {
      await fetchWeather();
      weatherFetchInterval = setInterval(fetchWeather, 300000);
      rotationInterval = setInterval(rotateWeather, 5000);
    };

    initWeather();

    return () => {
      if (weatherFetchInterval) clearInterval(weatherFetchInterval);
      if (rotationInterval) clearInterval(rotationInterval);
    };
  }, [rotateWeather]);

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
              src={`https://openweathermap.org/img/w/${weatherList[currentWeatherIndex].icon}.png`}
              alt={weatherList[currentWeatherIndex].description}
              style={{ width: 30, height: 30 }}
            />
            <Typography variant="body2" sx={{ 
              ml: 1,
              fontWeight: 500,
              color: '#2c3e50'
            }}>
              {cityNameKR[weatherList[currentWeatherIndex].city] || weatherList[currentWeatherIndex].city} {weatherList[currentWeatherIndex].temp}°C
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
