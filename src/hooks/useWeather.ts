import { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import { WeatherInfo } from '../types/weather.types';
import { WEATHER_CONFIG, WEATHER_API } from '../constants/weathers';

export const useWeather = () => {
  const [weatherList, setWeatherList] = useState<WeatherInfo[]>([]);
  const [currentWeatherIndex, setCurrentWeatherIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const initialized = useRef(false);

  const fetchWeather = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${WEATHER_API.ENDPOINT}`
      );
      if (response.data.success && response.data.data?.length > 0) {
        setWeatherList(response.data.data);
      }
    } catch (error) {
      console.error("날씨 정보 조회 실패:", error);
    }
  }, []);

  const rotateWeather = useCallback(() => {
    setPosition(-100);
    setTimeout(() => {
      setCurrentWeatherIndex((prev) =>
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

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchWeather();
    }
    const interval = setInterval(fetchWeather, WEATHER_CONFIG.FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  useEffect(() => {
    if (weatherList.length === 0) return;
    const rotationInterval = setInterval(
      rotateWeather,
      WEATHER_CONFIG.ROTATION_INTERVAL
    );
    return () => clearInterval(rotationInterval);
  }, [weatherList, rotateWeather]);

  return {
    weatherList,
    currentWeatherIndex,
    position,
    currentWeather: weatherList[currentWeatherIndex]
  };
}; 