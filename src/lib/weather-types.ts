export interface CurrentWeather {
  cityName: string;
  temperature: number;
  feelsLike: number;
  description: string;
  condition: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'drizzle' | 'mist';
  humidity: number;
  windSpeed: number;
  uvi: number;
  aqi: number;
  pressure: number;
  visibility: number;
  isDay: boolean;
}

export interface DailyForecastItem {
  date: string;
  minTemp: number;
  maxTemp: number;
  description: string;
  condition: string;
  precipitationChance: number;
  icon: string;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  description: string;
  precipitationChance: number;
}

export interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
}
