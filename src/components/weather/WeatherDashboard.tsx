'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { fetchWeather, fetchWeatherByCoords } from '@/lib/weather-service';
import { WeatherData } from '@/lib/weather-types';
import { CurrentWeatherCard } from './CurrentWeatherCard';
import { HourlyChart } from './HourlyChart';
import { DailyForecast } from './DailyForecast';
import { WeatherDetails } from './WeatherDetails';
import { CitySearch } from './CitySearch';
import { RealTimeClock } from './RealTimeClock';
import { CelestialInfo } from './CelestialInfo';
import { Skeleton } from '@/components/ui/skeleton';
import { Sun, Moon, Thermometer, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const loadWeather = useCallback(async (city: string = 'San Francisco') => {
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
  }, []);

  const handleCurrentLocation = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported by your browser.");
      loadWeather();
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const data = await fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
          setWeatherData(data);
        } catch (err) {
          setError('Failed to fetch weather for your location.');
          loadWeather();
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError("Unable to retrieve your location. Showing default city.");
        loadWeather('San Francisco');
      },
      { timeout: 10000 }
    );
  }, [loadWeather]);

  useEffect(() => {
    handleCurrentLocation();
  }, [handleCurrentLocation]);

  const handleSearch = (city: string) => {
    loadWeather(city);
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const getBackgroundInfo = () => {
    if (!weatherData) return PlaceHolderImages.find(img => img.id === 'clear-day');
    const { condition, isDay } = weatherData.current;
    
    if (condition === 'clear') {
      return PlaceHolderImages.find(img => img.id === (isDay ? 'clear-day' : 'clear-night'));
    } else if (['clouds', 'mist'].includes(condition)) {
      return PlaceHolderImages.find(img => img.id === (isDay ? 'cloudy-day' : 'cloudy-night'));
    } else if (['rain', 'drizzle', 'thunderstorm'].includes(condition)) {
      return PlaceHolderImages.find(img => img.id === (isDay ? 'rainy-day' : 'rainy-night'));
    } else if (condition === 'snow') {
      return PlaceHolderImages.find(img => img.id === (isDay ? 'snowy-day' : 'snowy-night'));
    }
    return PlaceHolderImages.find(img => img.id === (isDay ? 'clear-day' : 'clear-night'));
  };

  const bgImage = getBackgroundInfo();

  if (loading && !weatherData) {
    return (
      <div className="container mx-auto p-4 space-y-8 min-h-screen flex flex-col justify-center">
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2 rounded-[2.5rem]" />
          <Skeleton className="h-96 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground transition-all duration-500 relative overflow-hidden flex flex-col">
      {bgImage && (
        <div className="weather-bg-container fixed inset-0 pointer-events-none -z-50">
          <Image 
            src={bgImage.imageUrl} 
            alt={bgImage.description}
            fill
            className="weather-bg-image object-cover scale-105"
            priority
            data-ai-hint={bgImage.imageHint}
          />
          <div className="absolute inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[2px] z-0" />
        </div>
      )}

      <div className="container mx-auto p-4 md:p-10 space-y-8 max-w-7xl relative z-10 flex-1">
        <header className="flex flex-col md:flex-row gap-6 items-center justify-between glass-card p-6 rounded-[2rem]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/20 backdrop-blur-xl rounded-2xl">
                <Sun className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-primary">SkyCast</h1>
            </div>
            <div className="hidden lg:block h-10 w-px bg-white/10" />
            <RealTimeClock />
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:w-[300px]">
              <CitySearch onSearch={handleSearch} onCurrentLocation={handleCurrentLocation} />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-11 w-11 rounded-2xl glass-card border-white/10"
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <button
                onClick={toggleUnit}
                className="px-4 py-2 h-11 glass-card rounded-2xl font-bold border-white/10 min-w-[50px]"
              >
                °{unit}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" className="glass-card border-destructive/20 bg-destructive/5">
            <Info className="h-5 w-5" />
            <AlertTitle className="font-bold text-white">Notice</AlertTitle>
            <AlertDescription className="text-white/80">{error}</AlertDescription>
          </Alert>
        )}

        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
              <CurrentWeatherCard data={weatherData.current} unit={unit} />
              
              <div className="glass-card rounded-[2.5rem] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    <Thermometer className="h-6 w-6 text-primary" />
                    Hourly Trend
                  </h3>
                </div>
                <div className="h-[300px] w-full">
                  <HourlyChart data={weatherData.hourly} unit={unit} />
                </div>
              </div>

              <CelestialInfo data={weatherData.celestial} />
            </div>
            
            <div className="lg:col-span-4 space-y-8">
              <WeatherDetails data={weatherData.current} />
              <DailyForecast data={weatherData.daily} unit={unit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
