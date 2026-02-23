'use client';

import React, { useState, useEffect } from 'react';
import { fetchWeather } from '@/lib/weather-service';
import { WeatherData } from '@/lib/weather-types';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { HourlyChart } from './HourlyChart';
import { DailyForecast } from './DailyForecast';
import { WeatherDetails } from './WeatherDetails';
import { CitySearch } from './CitySearch';
import { AIWeatherSummary } from './AIWeatherSummary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Sun, Cloud, CloudRain, CloudSnow, Search, MapPin, Wind, Droplets, Thermometer, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const loadWeather = async (city: string = 'San Francisco') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const handleSearch = (city: string) => {
    loadWeather(city);
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  if (loading && !weatherData) {
    return (
      <div className="container mx-auto p-4 space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <Info className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <button 
          onClick={() => loadWeather()} 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-500">
      <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
              <Sun className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">ForecastAI</h1>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <CitySearch onSearch={handleSearch} />
            <button
              onClick={toggleUnit}
              className="px-4 py-2 h-10 border rounded-xl font-medium hover:bg-accent transition-colors shrink-0"
            >
              °{unit}
            </button>
          </div>
        </header>

        {/* Hero Section */}
        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <CurrentWeatherCard data={weatherData.current} unit={unit} />
              <AIWeatherSummary weatherData={weatherData} />
              <div className="bg-card border rounded-3xl p-6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    Hourly Forecast
                  </h3>
                </div>
                <div className="h-[250px] w-full">
                  <HourlyChart data={weatherData.hourly} unit={unit} />
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-4 space-y-6">
              <WeatherDetails data={weatherData.current} />
              <DailyForecast data={weatherData.daily} unit={unit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}