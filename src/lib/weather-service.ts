'use server';

import { WeatherData, CurrentWeather, DailyForecastItem, HourlyForecastItem } from './weather-types';

/**
 * Maps WMO Weather interpretation codes (WW) to app-specific conditions.
 * https://open-meteo.com/en/docs
 */
function mapWmoCode(code: number): { condition: CurrentWeather['condition']; description: string } {
  if (code === 0) return { condition: 'clear', description: 'Clear sky' };
  if (code >= 1 && code <= 3) return { condition: 'clouds', description: 'Partly cloudy' };
  if (code === 45 || code === 48) return { condition: 'mist', description: 'Foggy' };
  if (code >= 51 && code <= 55) return { condition: 'drizzle', description: 'Drizzle' };
  if (code >= 61 && code <= 65) return { condition: 'rain', description: 'Rain' };
  if (code >= 71 && code <= 75) return { condition: 'snow', description: 'Snowfall' };
  if (code >= 80 && code <= 82) return { condition: 'rain', description: 'Rain showers' };
  if (code >= 95 && code <= 99) return { condition: 'thunderstorm', description: 'Thunderstorm' };
  return { condition: 'clouds', description: 'Cloudy' };
}

/**
 * Fetches coordinates for a city name using Open-Meteo Geocoding API.
 */
async function getCoordinates(city: string) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('City not found');
  }
  return data.results[0];
}

/**
 * Fetches full weather data for given coordinates.
 */
async function getWeatherData(lat: number, lon: number, cityName: string): Promise<WeatherData> {
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max&timezone=auto`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;

  const [forecastRes, aqiRes] = await Promise.all([
    fetch(forecastUrl),
    fetch(aqiUrl)
  ]);

  const forecastData = await forecastRes.json();
  const aqiData = await aqiRes.json();

  const current = forecastData.current;
  const { condition, description } = mapWmoCode(current.weather_code);

  // Map Daily
  const daily: DailyForecastItem[] = forecastData.daily.time.map((time: string, i: number) => {
    const dayCode = forecastData.daily.weather_code[i];
    const dayInfo = mapWmoCode(dayCode);
    const dateObj = new Date(time);
    return {
      date: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      minTemp: Math.round(forecastData.daily.temperature_2m_min[i]),
      maxTemp: Math.round(forecastData.daily.temperature_2m_max[i]),
      description: dayInfo.description,
      condition: dayInfo.condition,
      precipitationChance: forecastData.daily.precipitation_probability_max[i],
      icon: dayInfo.condition // Using condition as icon key for simplicity
    };
  });

  // Map Hourly (next 24 hours)
  const hourly: HourlyForecastItem[] = forecastData.hourly.time.slice(0, 24).map((time: string, i: number) => {
    const dateObj = new Date(time);
    return {
      time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temperature: Math.round(forecastData.hourly.temperature_2m[i]),
      description: mapWmoCode(forecastData.hourly.weather_code[i]).description,
      precipitationChance: forecastData.hourly.precipitation_probability[i]
    };
  });

  const currentWeather: CurrentWeather = {
    cityName,
    temperature: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    description,
    condition,
    humidity: current.relative_humidity_2m,
    windSpeed: Math.round(current.wind_speed_10m),
    uvi: Math.round(forecastData.daily.uv_index_max[0]),
    aqi: Math.round(aqiData.current.us_aqi || 0),
    pressure: Math.round(current.surface_pressure),
    visibility: Math.round((forecastData.hourly.visibility[0] || 10000) / 1000) // Convert meters to km
  };

  return {
    current: currentWeather,
    daily,
    hourly
  };
}

/**
 * Fetches weather data for a specific city.
 */
export async function fetchWeather(city: string): Promise<WeatherData> {
  try {
    const location = await getCoordinates(city);
    return await getWeatherData(location.latitude, location.longitude, location.name);
  } catch (error) {
    console.error('Error fetching weather:', error);
    throw error;
  }
}

/**
 * Fetches weather data based on geographic coordinates.
 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  try {
    // Note: We use "Your Location" since Open-Meteo doesn't provide free reverse geocoding
    return await getWeatherData(lat, lon, "Your Location");
  } catch (error) {
    console.error('Error fetching weather by coords:', error);
    throw error;
  }
}
