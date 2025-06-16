
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface AirQualityData {
  pm25: number;
  pm10: number;
  ozone: number;
  no2: number;
  so2: number;
  co: number;
  aqi: number;
  category: 'good' | 'moderate' | 'unhealthy_for_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  pressure: number;
}

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

const useEnvironmentalData = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Не удалось получить местоположение');
          // Fallback to Moscow coordinates
          setLocation({
            latitude: 55.7558,
            longitude: 37.6173,
            city: 'Москва',
            country: 'Россия'
          });
        }
      );
    } else {
      setLocationError('Геолокация не поддерживается');
      // Fallback to Moscow coordinates
      setLocation({
        latitude: 55.7558,
        longitude: 37.6173,
        city: 'Москва',
        country: 'Россия'
      });
    }
  }, []);

  // Fetch air quality data from Open-Meteo API
  const { data: airQualityData, isLoading: airQualityLoading, error: airQualityError } = useQuery({
    queryKey: ['airQuality', location?.latitude, location?.longitude],
    queryFn: async (): Promise<AirQualityData | null> => {
      if (!location) return null;

      const response = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }

      const data = await response.json();
      const current = data.current;

      // Calculate AQI based on PM2.5 (simplified calculation)
      const pm25 = current.pm2_5 || 0;
      let aqi = 0;
      let category: AirQualityData['category'] = 'good';

      if (pm25 <= 12) {
        aqi = Math.round((50 / 12) * pm25);
        category = 'good';
      } else if (pm25 <= 35.4) {
        aqi = Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51);
        category = 'moderate';
      } else if (pm25 <= 55.4) {
        aqi = Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101);
        category = 'unhealthy_for_sensitive';
      } else if (pm25 <= 150.4) {
        aqi = Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151);
        category = 'unhealthy';
      } else if (pm25 <= 250.4) {
        aqi = Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201);
        category = 'very_unhealthy';
      } else {
        aqi = Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301);
        category = 'hazardous';
      }

      return {
        pm25: current.pm2_5 || 0,
        pm10: current.pm10 || 0,
        ozone: current.ozone || 0,
        no2: current.nitrogen_dioxide || 0,
        so2: current.sulphur_dioxide || 0,
        co: current.carbon_monoxide || 0,
        aqi,
        category
      };
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Fetch weather data from Open-Meteo API
  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: async (): Promise<WeatherData | null> => {
      if (!location) return null;

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,surface_pressure&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      const current = data.current;

      return {
        temperature: current.temperature_2m || 0,
        humidity: current.relative_humidity_2m || 0,
        windSpeed: current.wind_speed_10m || 0,
        uvIndex: current.uv_index || 0,
        pressure: current.surface_pressure || 0
      };
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  const isLoading = airQualityLoading || weatherLoading;
  const error = airQualityError || weatherError || locationError;

  return {
    location,
    airQualityData,
    weatherData,
    isLoading,
    error,
    locationError
  };
};

export default useEnvironmentalData;
