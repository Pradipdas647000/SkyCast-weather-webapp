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

  // Handle theme switching
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
          loadWeather(); // Fallback to default
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
    if (!weatherData) return { image: PlaceHolderImages.find(img => img.id === 'clear-sky'), effect: null };
    const condition = weatherData.current.condition;
    
    if (condition === 'clear') {
      return { 
        image: PlaceHolderImages.find(img => img.id === 'clear-sky'),
        effect: null
      };
    } else if (['clouds', 'mist'].includes(condition)) {
      return { 
        image: PlaceHolderImages.find(img => img.id === 'cloudy-sky'),
        effect: 'effect-clouds'
      };
    } else if (['rain', 'drizzle', 'thunderstorm'].includes(condition)) {
      return { 
        image: PlaceHolderImages.find(img => img.id === 'rainy-sky'),
        effect: 'effect-rain'
      };
    } else if (condition === 'snow') {
      return { 
        image: PlaceHolderImages.find(img => img.id === 'snowy-sky'),
        effect: 'effect-snow'
      };
    }
    
    return { 
      image: PlaceHolderImages.find(img => img.id === 'clear-sky'),
      effect: null
    };
  };

  const bgInfo = getBackgroundInfo();

  if (loading && !weatherData) {
    return (
      <div className="container mx-auto p-4 space-y-8 min-h-screen flex flex-col justify-center">
        <div className="flex justify-between items-center mb-12">
          <Skeleton className="h-12 w-48 rounded-2xl" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-64 rounded-2xl" />
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-96 lg:col-span-2 rounded-[2.5rem]" />
          <Skeleton className="h-96 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground transition-all duration-500 relative overflow-hidden flex flex-col">
      {/* Dynamic Weather Background Layer */}
      {bgInfo && bgInfo.image && (
        <div className="weather-bg-container fixed inset-0 pointer-events-none -z-50">
          <Image 
            src={bgInfo.image.imageUrl} 
            alt={bgInfo.image.description}
            fill
            className="weather-bg-image object-cover scale-105"
            priority
            data-ai-hint={bgInfo.image.imageHint}
          />
          {bgInfo.effect && <div className={`${bgInfo.effect} fixed inset-0 z-10 pointer-events-none opacity-50`} />}
          {/* Overlay to ensure readability */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/30 backdrop-blur-[1px] z-0" />
        </div>
      )}

      {/* Atmospheric Glow Overlay */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 dark:bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto p-4 md:p-10 space-y-8 max-w-7xl relative z-10 flex-1">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row gap-6 items-center justify-between glass-card p-5 rounded-[2rem] border-white/20">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary rounded-2xl shadow-xl shadow-primary/30 animate-pulse">
                <Sun className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-tighter text-primary">ForecastAI</h1>
            </div>
            <div className="hidden lg:block h-10 w-px bg-white/20" />
            <RealTimeClock />
          </div>
          
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="flex-1 md:w-[350px]">
              <CitySearch onSearch={handleSearch} onCurrentLocation={handleCurrentLocation} />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-12 w-12 rounded-2xl border-white/20 bg-white/40 dark:bg-black/40 backdrop-blur-md hover:bg-white/60 transition-all shadow-lg"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon className="h-[1.4rem] w-[1.4rem] transition-all" />
                ) : (
                  <Sun className="h-[1.4rem] w-[1.4rem] transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <button
                onClick={toggleUnit}
                className="px-5 py-2 h-12 border-white/20 rounded-2xl font-bold hover:bg-white/60 bg-white/40 dark:bg-black/40 backdrop-blur-md transition-all shadow-lg text-lg min-w-[60px]"
              >
                °{unit}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" className="rounded-3xl shadow-xl border-destructive/30 bg-destructive/10 backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
            <Info className="h-5 w-5" />
            <AlertTitle className="font-bold">Weather Notice</AlertTitle>
            <AlertDescription className="text-sm font-medium">{error}</AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-8">
              <CurrentWeatherCard data={weatherData.current} unit={unit} />
              
              <div className="glass-card rounded-[2.5rem] p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-xl">
                      <Thermometer className="h-6 w-6 text-primary" />
                    </div>
                    Hourly Trend
                  </h3>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div className="w-3 h-3 rounded-full bg-blue-500 opacity-50" />
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <HourlyChart data={weatherData.hourly} unit={unit} />
                </div>
              </div>
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