'use client';

import React from 'react';
import { CurrentWeather } from '@/lib/weather-types';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, MapPin, Zap, Moon } from 'lucide-react';
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
    if (!data.isDay) {
      if (data.condition === 'clear') return <Moon className="h-24 w-24 text-blue-200" />;
    }
    switch (data.condition) {
      case 'clear': return <Sun className="h-24 w-24 text-yellow-400" />;
      case 'clouds': return <Cloud className="h-24 w-24 text-slate-200" />;
      case 'rain': return <CloudRain className="h-24 w-24 text-blue-300" />;
      case 'drizzle': return <CloudRain className="h-24 w-24 text-blue-200 opacity-80" />;
      case 'thunderstorm': return <Zap className="h-24 w-24 text-yellow-500" />;
      case 'snow': return <CloudSnow className="h-24 w-24 text-white" />;
      default: return <Cloud className="h-24 w-24 text-slate-200" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden glass-card rounded-[2.5rem] p-8 md:p-10 glass-card-hover"
    >
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isYourLocation && <MapPin className="h-5 w-5 text-primary" />}
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{mainTitle}</h2>
            </div>
            {citySubName && (
              <p className="text-xl font-medium text-primary mb-2">{citySubName}</p>
            )}
            <p className="text-white/60 text-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">{temp}°</span>
            <span className="text-3xl font-medium text-white/40">/ {feelsLike}° feels like</span>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10">
              <Wind className="h-5 w-5 text-primary" />
              <span className="font-semibold text-white">{data.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="font-semibold text-white">{data.humidity}%</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-white">
          <div className="animate-float">
            {getIcon()}
          </div>
          <span className="text-2xl font-bold capitalize">{data.description}</span>
        </div>
      </div>
    </motion.div>
  );
}
