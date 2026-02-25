'use client';

import React from 'react';
import { DailyForecastItem } from '@/lib/weather-types';
import { Sun, Cloud, CloudRain, CloudSun, CloudSnow, Umbrella } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  data: DailyForecastItem[];
  unit: 'C' | 'F';
}

export function DailyForecast({ data, unit }: Props) {
  const getIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return <Sun className="h-6 w-6 text-yellow-400" />;
      case 'rain': return <CloudRain className="h-6 w-6 text-blue-400" />;
      case 'snow': return <CloudSnow className="h-6 w-6 text-blue-200" />;
      case 'clouds': return <Cloud className="h-6 w-6 text-slate-400" />;
      default: return <CloudSun className="h-6 w-6 text-orange-400" />;
    }
  };

  const formatTemp = (val: number) => unit === 'F' ? Math.round((val * 9/5) + 32) : Math.round(val);

  return (
    <div className="glass-card border-white/30 rounded-3xl p-6 shadow-2xl glass-card-hover">
      <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
        <Sun className="h-5 w-5 text-primary" />
        7-Day Forecast
      </h3>
      <div className="space-y-5">
        {data.map((day, idx) => (
          <motion.div 
            key={day.date}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between group"
          >
            <span className="w-12 font-bold group-hover:text-primary transition-colors">{day.date}</span>
            <div className="flex items-center gap-3 flex-1 px-4">
              <div className="p-2 bg-white/10 dark:bg-black/10 rounded-xl group-hover:bg-white/20 transition-all">
                {getIcon(day.condition)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{day.description}</span>
                {day.precipitationChance > 0 && (
                  <span className="text-[10px] text-blue-500 flex items-center gap-1 font-bold">
                    <Umbrella className="h-2 w-2" /> {day.precipitationChance}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3 text-sm font-black">
              <span className="w-8 text-right">{formatTemp(day.maxTemp)}°</span>
              <span className="w-8 text-right text-muted-foreground opacity-70">{formatTemp(day.minTemp)}°</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}