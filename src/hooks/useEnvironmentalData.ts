
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

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
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [geolocationSupported, setGeolocationSupported] = useState(true);

  const requestGeolocation = useCallback(() => {
    console.log('🌍 Начинаем запрос геолокации...');
    setIsRequestingLocation(true);
    setLocationError(null);
    
    // Проверяем поддержку геолокации
    if (!navigator.geolocation) {
      console.error('❌ Геолокация не поддерживается браузером');
      setGeolocationSupported(false);
      setLocationError('Ваш браузер не поддерживает геолокацию');
      setIsRequestingLocation(false);
      
      // Устанавливаем координаты Москвы как fallback
      console.log('📍 Используем координаты Москвы как fallback');
      setLocation({
        latitude: 55.7558,
        longitude: 37.6173,
        city: 'Москва',
        country: 'Россия'
      });
      return;
    }

    console.log('✅ Геолокация поддерживается, проверяем разрешения...');

    // Проверяем разрешения на геолокацию
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        console.log('🔐 Статус разрешения на геолокацию:', result.state);
        
        if (result.state === 'denied') {
          console.warn('⚠️ Геолокация заблокирована пользователем');
          setLocationError('Доступ к геолокации заблокирован. Разрешите доступ в настройках браузера.');
          setIsRequestingLocation(false);
          // Fallback к Москве
          setLocation({
            latitude: 55.7558,
            longitude: 37.6173,
            city: 'Москва',
            country: 'Россия'
          });
          return;
        }
      }).catch((error) => {
        console.log('ℹ️ Не удалось проверить разрешения, продолжаем запрос:', error);
      });
    }

    const options = {
      enableHighAccuracy: false, // Уменьшаем требования к точности для ускорения
      timeout: 10000, // 10 секунд
      maximumAge: 600000 // 10 минут
    };

    console.log('📡 Запрашиваем текущее местоположение с опциями:', options);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('🎉 Геолокация получена успешно!');
        console.log('📍 Координаты:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationError(null);
        setIsRequestingLocation(false);
        
        console.log('✅ Состояние локации обновлено');
      },
      (error) => {
        console.error('❌ Ошибка получения геолокации:', error);
        
        let errorMessage = 'Не удалось получить местоположение';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Доступ к геолокации запрещен. Разрешите доступ в настройках браузера и обновите страницу.';
            console.error('🚫 Пользователь запретил доступ к геолокации');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Информация о местоположении недоступна. Проверьте подключение к интернету.';
            console.error('📡 Информация о местоположении недоступна');
            break;
          case error.TIMEOUT:
            errorMessage = 'Превышено время ожидания. Попробуйте еще раз.';
            console.error('⏰ Превышено время ожидания геолокации');
            break;
          default:
            console.error('❓ Неизвестная ошибка геолокации:', error.message);
            break;
        }
        
        setLocationError(errorMessage);
        setIsRequestingLocation(false);
        
        // В любом случае устанавливаем fallback координаты Москвы
        console.log('📍 Устанавливаем fallback координаты Москвы');
        setLocation({
          latitude: 55.7558,
          longitude: 37.6173,
          city: 'Москва',
          country: 'Россия'
        });
      },
      options
    );
  }, []);

  // Автоматический запрос геолокации при монтировании
  useEffect(() => {
    console.log('🚀 useEnvironmentalData: Компонент монтируется');
    
    // Небольшая задержка для избежания блокировки браузером
    const timer = setTimeout(() => {
      console.log('⏰ Запускаем автоматический запрос геолокации...');
      requestGeolocation();
    }, 1000);

    return () => clearTimeout(timer);
  }, [requestGeolocation]);

  // Запрос данных о качестве воздуха
  const { data: airQualityData, isLoading: airQualityLoading, error: airQualityError } = useQuery({
    queryKey: ['airQuality', location?.latitude, location?.longitude],
    queryFn: async (): Promise<AirQualityData | null> => {
      if (!location) {
        console.log('🌬️ Локация не доступна, пропускаем запрос качества воздуха');
        return null;
      }

      console.log('🌬️ Запрашиваем данные о качестве воздуха для:', location);

      try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${location.latitude}&longitude=${location.longitude}&current=pm10,pm2_5,ozone,nitrogen_dioxide,sulphur_dioxide,carbon_monoxide&timezone=auto`;
        console.log('🔗 URL запроса качества воздуха:', url);
        
        const response = await fetch(url);
        console.log('📡 Ответ API качества воздуха:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📊 Данные качества воздуха получены:', data);

        const current = data.current;

        // Рассчитываем AQI на основе PM2.5
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

        const result = {
          pm25: current.pm2_5 || 0,
          pm10: current.pm10 || 0,
          ozone: current.ozone || 0,
          no2: current.nitrogen_dioxide || 0,
          so2: current.sulphur_dioxide || 0,
          co: current.carbon_monoxide || 0,
          aqi,
          category
        };

        console.log('✅ Обработанные данные качества воздуха:', result);
        return result;
      } catch (error) {
        console.error('❌ Ошибка при получении данных качества воздуха:', error);
        throw error;
      }
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 30, // 30 минут
    retry: 3,
  });

  // Запрос погодных данных
  const { data: weatherData, isLoading: weatherLoading, error: weatherError } = useQuery({
    queryKey: ['weather', location?.latitude, location?.longitude],
    queryFn: async (): Promise<WeatherData | null> => {
      if (!location) {
        console.log('🌤️ Локация не доступна, пропускаем запрос погоды');
        return null;
      }

      console.log('🌤️ Запрашиваем погодные данные для:', location);

      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,surface_pressure&timezone=auto`;
        console.log('🔗 URL запроса погоды:', url);

        const response = await fetch(url);
        console.log('📡 Ответ API погоды:', response.status, response.statusText);

        if (!response.ok) {
          throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('📊 Погодные данные получены:', data);

        const current = data.current;

        const result = {
          temperature: current.temperature_2m || 0,
          humidity: current.relative_humidity_2m || 0,
          windSpeed: current.wind_speed_10m || 0,
          uvIndex: current.uv_index || 0,
          pressure: current.surface_pressure || 0
        };

        console.log('✅ Обработанные погодные данные:', result);
        return result;
      } catch (error) {
        console.error('❌ Ошибка при получении погодных данных:', error);
        throw error;
      }
    },
    enabled: !!location,
    staleTime: 1000 * 60 * 15, // 15 минут
    retry: 3,
  });

  const isLoading = airQualityLoading || weatherLoading || isRequestingLocation;
  const error = airQualityError || weatherError;

  // Логируем текущее состояние
  useEffect(() => {
    console.log('📊 Состояние useEnvironmentalData:', {
      location,
      isLoading,
      isRequestingLocation,
      locationError,
      geolocationSupported,
      airQualityData: !!airQualityData,
      weatherData: !!weatherData,
      error: error?.message
    });
  }, [location, isLoading, isRequestingLocation, locationError, geolocationSupported, airQualityData, weatherData, error]);

  return {
    location,
    airQualityData,
    weatherData,
    isLoading,
    error,
    locationError,
    isRequestingLocation,
    geolocationSupported,
    requestGeolocation
  };
};

export default useEnvironmentalData;
