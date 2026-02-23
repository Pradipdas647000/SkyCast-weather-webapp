'use server';

import { WeatherData } from './weather-types';
import { mockWeatherData } from './mock-weather-data';

/**
 * Fetches weather data for a specific city.
 * @param city - The name of the city to fetch weather for.
 * @returns A promise that resolves to the weather data.
 */
export async function fetchWeather(city: string): Promise<WeatherData> {
  // In a real production app, you would use an API key from process.env
  // const apiKey = process.env.OPENWEATHER_API_KEY;
  // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  
  // For this demonstration, we'll return mock data with some randomization to simulate fetching
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network latency
  
  const updatedMock = {
    ...mockWeatherData,
    current: {
      ...mockWeatherData.current,
      cityName: city.charAt(0).toUpperCase() + city.slice(1)
    }
  };
  
  return updatedMock;
}

/**
 * Fetches weather data based on geographic coordinates.
 * @param lat - Latitude.
 * @param lon - Longitude.
 * @returns A promise that resolves to the weather data.
 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  // In a real app, you would call a reverse geocoding API followed by a weather API
  // For now, we simulate this with mock data labeled as "Current Location"
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    ...mockWeatherData,
    current: {
      ...mockWeatherData.current,
      cityName: "Current Location"
    }
  };
}
