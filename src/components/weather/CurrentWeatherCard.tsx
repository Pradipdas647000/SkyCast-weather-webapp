'use client';

import React from 'react';
import { CurrentWeather } from '@/lib/weather-types';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, MapPin, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  data: CurrentWeather;
  unit: 'C' | 'F';
}

export function CurrentWeatherCard({ data, unit }: Props) {
  const temp = unit === 'F' ? Math.round((data.temperature * 9/5) + 32) : Math.round(data.temperature);
  const feelsLike = unit === 'F' ? Math.round((data.feelsLike * 9/5) + 32) : Math.round(data.feelsLike);

  const isYourLocation = data.cityName.startsWith('Your Location');
  const cityNameMatch = data.cityName.match(/\(([^)]+)\)/);
  const citySubName = cityNameMatch ? cityNameMatch[1] : null;
  const mainTitle = isYourLocation ? 'Your Location' : data.cityName;

  const getIcon = () => {
    switch (data.condition) {
      case 'clear': return <Sun className="h-24 w-24 text-yellow-400" />;
      case 'clouds': return <Cloud className="h-24 w-24 text-slate-400" />;
      case 'rain': return <CloudRain className="h-24 w-24 text-blue-400" />;
      case 'drizzle': return <CloudRain className="h-24 w-24 text-blue-300 opacity-80" />;
      case 'thunderstorm': return <Zap className="h-24 w-24 text-yellow-500" />;
      case 'snow': return <CloudSnow className="h-24 w-24 text-blue-100" />;
      default: return <Cloud className="h-24 w-24 text-slate-400" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden glass-card rounded-[2.5rem] p-8 md:p-10 shadow-2xl glass-card-hover"
    >
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isYourLocation && <MapPin className="h-5 w-5 text-primary" />}
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{mainTitle}</h2>
            </div>
            {citySubName && (
              <p className="text-xl font-medium text-primary mb-2 opacity-90">{citySubName}</p>
            )}
            <p className="text-muted-foreground text-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-7xl md:text-8xl font-black tracking-tighter">{temp}°</span>
            <span className="text-3xl font-medium text-muted-foreground opacity-80">/ {feelsLike}° feels like</span>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <Wind className="h-5 w-5 text-primary" />
              <span className="font-semibold">{data.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 dark:bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <Droplets className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">{data.humidity}%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="animate-float">
            {getIcon()}
          </div>
          <span className="text-2xl font-bold capitalize">{data.description}</span>
        </div>
      </div>
    </motion.div>
  );
}