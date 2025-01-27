import { useEffect, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';
import { WeatherInfo, CityNameMap } from '../../types/weather.types';

const Header = () => {
  const [weatherList, setWeatherList] = useState<WeatherInfo[]>([]);
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [position, setPosition] = useState(0);  // 슬라이드 위치 상태

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
    setPosition(-100);  // 현재 날씨를 위로 슬라이드
    
    setTimeout(() => {
      setCurrentWeatherIndex(prev => 
        prev === weatherList.length - 1 ? 0 : prev + 1
      );
      setPosition(100);  // 새로운 날씨를 아래에 위치
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          setPosition(0);  // 새로운 날씨를 원래 위치로 슬라이드
        }, 50);
      });
    }, 500);
  }, [weatherList.length]);

  useEffect(() => {
    // 초기 데이터 로드
    fetchWeather();

    // 5분마다 날씨 정보 업데이트
    const weatherFetchInterval = setInterval(fetchWeather, 300000);

    // 5초마다 다음 도시 날씨로 전환
    const rotationInterval = setInterval(rotateWeather, 5000);

    return () => {
      clearInterval(weatherFetchInterval);
      clearInterval(rotationInterval);
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
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
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
