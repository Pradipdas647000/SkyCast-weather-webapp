'use server';

import { WeatherData, CurrentWeather, DailyForecastItem, HourlyForecastItem, CelestialData } from './weather-types';

/**
 * Maps WMO Weather interpretation codes (WW) to app-specific conditions.
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
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`,
    { next: { revalidate: 3600 } }
  );
  if (!response.ok) throw new Error('Geocoding service unavailable');
  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('City not found');
  }
  return data.results[0];
}

/**
 * Performs reverse geocoding to get city name from coordinates.
 */
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { next: { revalidate: 3600 } }
    );
    if (!response.ok) return "";
    const data = await response.json();
    return data.city || data.locality || data.principalSubdivision || "";
  } catch (error) {
    return "";
  }
}

/**
 * Helper to format ISO time strings to readable 12h format
 */
function formatCelestialTime(isoString: string | null | undefined): string {
  if (!isoString) return "N/A";
  try {
    // Open-Meteo returns YYYY-MM-DDTHH:MM
    const parts = isoString.split('T');
    if (parts.length < 2) return "N/A";
    
    const timePart = parts[1]; // HH:MM
    const [hours, minutes] = timePart.split(':');
    const h = parseInt(hours, 10);
    const m = parseInt(minutes, 10);
    
    if (isNaN(h) || isNaN(m)) return "N/A";

    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    const mStr = m.toString().padStart(2, '0');
    
    return `${h12}:${mStr} ${ampm}`;
  } catch (e) {
    return "N/A";
  }
}

/**
 * Fetches full weather data for given coordinates.
 */
async function getWeatherData(lat: number, lon: number, cityName: string): Promise<WeatherData> {
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,is_day&hourly=temperature_2m,precipitation_probability,weather_code,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max,sunrise,sunset&timezone=auto`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi`;
  const astronomyUrl = `https://api.open-meteo.com/v1/astronomy?latitude=${lat}&longitude=${lon}&daily=moonrise,moonset&timezone=auto`;

  const [forecastRes, aqiRes, astronomyRes] = await Promise.all([
    fetch(forecastUrl, { next: { revalidate: 300 } }),
    fetch(aqiUrl, { next: { revalidate: 300 } }),
    fetch(astronomyUrl, { next: { revalidate: 3600 } })
  ]);

  if (!forecastRes.ok) throw new Error('Forecast API failed');
  
  const forecastData = await forecastRes.json();
  const aqiData = aqiRes.ok ? await aqiRes.json() : { current: { us_aqi: 0 } };
  const astronomyData = astronomyRes.ok ? await astronomyRes.json() : null;

  const current = forecastData.current;
  const { condition, description } = mapWmoCode(current.weather_code);

  // Correct visibility index finding for current hour
  const currentHourString = current.time.substring(0, 14) + '00';
  const currentIndex = forecastData.hourly.time.indexOf(currentHourString);
  const currentVisibility = currentIndex !== -1 
    ? (forecastData.hourly.visibility[currentIndex] || 10000) 
    : (forecastData.hourly.visibility[0] || 10000);

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
      icon: dayInfo.condition
    };
  });

  const hourly: HourlyForecastItem[] = forecastData.hourly.time.slice(0, 24).map((time: string, i: number) => {
    const dateObj = new Date(time);
    return {
      time: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      temperature: Math.round(forecastData.hourly.temperature_2m[i]),
      description: mapWmoCode(forecastData.hourly.weather_code[i]).description,
      precipitationChance: forecastData.hourly.precipitation_probability[i]
    };
  });

  const celestial: CelestialData = {
    sunrise: formatCelestialTime(forecastData.daily.sunrise?.[0]),
    sunset: formatCelestialTime(forecastData.daily.sunset?.[0]),
    moonrise: formatCelestialTime(astronomyData?.daily?.moonrise?.[0]),
    moonset: formatCelestialTime(astronomyData?.daily?.moonset?.[0]),
    moonPhase: "Moon Phase data N/A"
  };

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
    visibility: Math.round(currentVisibility / 1000),
    isDay: current.is_day === 1
  };

  return {
    current: currentWeather,
    daily,
    hourly,
    celestial
  };
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const location = await getCoordinates(city);
  return await getWeatherData(location.latitude, location.longitude, location.name);
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const cityName = await reverseGeocode(lat, lon);
  const displayName = cityName ? cityName : "Your Location";
  return await getWeatherData(lat, lon, displayName);
}
