'use client';

import React from 'react';
import { CurrentWeather } from '@/lib/weather-types';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Droplets, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  data: CurrentWeather;
  unit: 'C' | 'F';
}

export function CurrentWeatherCard({ data, unit }: Props) {
  const temp = unit === 'F' ? Math.round((data.temperature * 9/5) + 32) : Math.round(data.temperature);
  const feelsLike = unit === 'F' ? Math.round((data.feelsLike * 9/5) + 32) : Math.round(data.feelsLike);

  // Check if it's "Your Location" format from the service
  const isYourLocation = data.cityName.startsWith('Your Location');
  const cityNameMatch = data.cityName.match(/\(([^)]+)\)/);
  const citySubName = cityNameMatch ? cityNameMatch[1] : null;
  const mainTitle = isYourLocation ? 'Your Location' : data.cityName;

  const getIcon = () => {
    switch (data.condition) {
      case 'clear': return <Sun className="h-24 w-24 text-yellow-400" />;
      case 'clouds': return <Cloud className="h-24 w-24 text-slate-400" />;
      case 'rain': return <CloudRain className="h-24 w-24 text-blue-400" />;
      case 'snow': return <CloudSnow className="h-24 w-24 text-blue-100" />;
      default: return <Sun className="h-24 w-24 text-yellow-400" />;
    }
  };

  const getGradientClass = () => {
    switch (data.condition) {
      case 'clear': return 'from-blue-400/20 to-cyan-300/20';
      case 'clouds': return 'from-slate-400/20 to-slate-500/20';
      case 'rain': return 'from-blue-600/20 to-blue-800/20';
      case 'snow': return 'from-blue-100/20 to-slate-200/20';
      default: return 'from-blue-400/20 to-cyan-300/20';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-gradient-to-br ${getGradientClass()} border rounded-[2.5rem] p-8 md:p-10 shadow-sm`}
    >
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isYourLocation && <MapPin className="h-5 w-5 text-primary" />}
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{mainTitle}</h2>
            </div>
            {citySubName && (
              <p className="text-xl font-medium text-primary mb-2 opacity-80">{citySubName}</p>
            )}
            <p className="text-muted-foreground text-lg">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-7xl md:text-8xl font-black tracking-tighter">{temp}°</span>
            <span className="text-3xl font-medium text-muted-foreground">/ {feelsLike}° feels like</span>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
              <Wind className="h-5 w-5 text-primary" />
              <span className="font-semibold">{data.windSpeed} km/h</span>
            </div>
            <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-4 py-2 rounded-2xl">
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

      {/* Background Decorative Circles */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-accent/10 rounded-full blur-3xl -z-0" />
    </motion.div>
  );
}
