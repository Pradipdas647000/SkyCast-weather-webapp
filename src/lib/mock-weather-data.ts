import { WeatherData } from './weather-types';

export const mockWeatherData: WeatherData = {
  current: {
    cityName: "San Francisco",
    temperature: 18,
    feelsLike: 17,
    description: "Partly Cloudy",
    condition: "clouds",
    humidity: 64,
    windSpeed: 12,
    uvi: 4,
    aqi: 42,
    pressure: 1015,
    visibility: 10
  },
  daily: [
    { date: "Mon", minTemp: 14, maxTemp: 22, description: "Sunny", condition: "clear", precipitationChance: 0, icon: "sun" },
    { date: "Tue", minTemp: 15, maxTemp: 24, description: "Clear Sky", condition: "clear", precipitationChance: 5, icon: "sun" },
    { date: "Wed", minTemp: 13, maxTemp: 19, description: "Rainy", condition: "rain", precipitationChance: 85, icon: "cloud-rain" },
    { date: "Thu", minTemp: 12, maxTemp: 18, description: "Cloudy", condition: "clouds", precipitationChance: 20, icon: "cloud" },
    { date: "Fri", minTemp: 16, maxTemp: 23, description: "Sunny", condition: "clear", precipitationChance: 0, icon: "sun" },
    { date: "Sat", minTemp: 17, maxTemp: 25, description: "Clear Sky", condition: "clear", precipitationChance: 0, icon: "sun" },
    { date: "Sun", minTemp: 15, maxTemp: 21, description: "Partly Cloudy", condition: "clouds", precipitationChance: 10, icon: "cloud-sun" }
  ],
  hourly: [
    { time: "10:00 AM", temperature: 16, description: "Sunny", precipitationChance: 0 },
    { time: "11:00 AM", temperature: 17, description: "Sunny", precipitationChance: 0 },
    { time: "12:00 PM", temperature: 18, description: "Partly Cloudy", precipitationChance: 5 },
    { time: "1:00 PM", temperature: 19, description: "Partly Cloudy", precipitationChance: 10 },
    { time: "2:00 PM", temperature: 20, description: "Cloudy", precipitationChance: 15 },
    { time: "3:00 PM", temperature: 21, description: "Cloudy", precipitationChance: 15 },
    { time: "4:00 PM", temperature: 20, description: "Partly Cloudy", precipitationChance: 10 },
    { time: "5:00 PM", temperature: 19, description: "Sunny", precipitationChance: 5 },
    { time: "6:00 PM", temperature: 18, description: "Sunny", precipitationChance: 0 },
    { time: "7:00 PM", temperature: 17, description: "Clear", precipitationChance: 0 },
    { time: "8:00 PM", temperature: 16, description: "Clear", precipitationChance: 0 },
    { time: "9:00 PM", temperature: 15, description: "Clear", precipitationChance: 0 }
  ]
};