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
    if (!weatherData) return null;
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
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-10 w-12" />
            <Skeleton className="h-10 w-12" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-80 lg:col-span-2 rounded-[2.5rem]" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-500 relative overflow-hidden">
      {/* Dynamic Weather Background */}
      {bgInfo && bgInfo.image && (
        <div className="weather-bg-container">
          <Image 
            src={bgInfo.image.imageUrl} 
            alt={bgInfo.image.description}
            fill
            className="weather-bg-image"
            priority
            data-ai-hint={bgInfo.image.imageHint}
          />
          {bgInfo.effect && <div className={bgInfo.effect} />}
        </div>
      )}

      {/* Atmospheric Glow Overlay */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 dark:bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 dark:bg-accent/10 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row gap-4 items-center justify-between glass-card p-4 rounded-3xl mb-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">ForecastAI</h1>
            </div>
            <div className="hidden sm:block h-8 w-px bg-white/20" />
            <RealTimeClock />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <CitySearch onSearch={handleSearch} onCurrentLocation={handleCurrentLocation} />
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-xl border bg-background/50 backdrop-blur-sm hover:bg-accent transition-colors"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              >
                {theme === 'light' ? (
                  <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                ) : (
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <button
                onClick={toggleUnit}
                className="px-4 py-2 h-10 border rounded-xl font-medium hover:bg-accent bg-background/50 backdrop-blur-sm transition-colors shrink-0"
              >
                °{unit}
              </button>
            </div>
          </div>
        </header>

        {error && (
          <Alert variant="destructive" className="rounded-2xl shadow-sm border-destructive/20 bg-destructive/5 backdrop-blur-sm">
            <Info className="h-4 w-4" />
            <AlertTitle>Notice</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Hero Section */}
        {weatherData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-6">
              <CurrentWeatherCard data={weatherData.current} unit={unit} />
              
              <div className="glass-card rounded-3xl p-6 overflow-hidden">
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
