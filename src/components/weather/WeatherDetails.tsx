'use client';

import React from 'react';
import { CurrentWeather } from '@/lib/weather-types';
import { Wind, Droplets, Sun, Eye, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Props {
  data: CurrentWeather;
}

export function WeatherDetails({ data }: Props) {
  const aqiLevel = data.aqi < 50 ? 'Good' : data.aqi < 100 ? 'Moderate' : 'Poor';
  const aqiColor = data.aqi < 50 ? 'text-green-500' : data.aqi < 100 ? 'text-yellow-500' : 'text-red-500';

  const details = [
    { label: 'Wind Speed', value: `${data.windSpeed} km/h`, icon: <Wind className="text-primary" /> },
    { label: 'Humidity', value: `${data.humidity}%`, icon: <Droplets className="text-blue-500" /> },
    { label: 'UV Index', value: data.uvi, icon: <Sun className="text-yellow-500" /> },
    { label: 'Visibility', value: `${data.visibility} km`, icon: <Eye className="text-slate-500" /> }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2 glass-card border-white/30 rounded-3xl p-6 shadow-2xl glass-card-hover">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <h3 className="font-bold">Air Quality</h3>
          </div>
          <span className={`text-sm font-black ${aqiColor}`}>{aqiLevel}</span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-3xl font-black">{data.aqi}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">US AQI</span>
          </div>
          <Progress value={(Math.min(data.aqi, 200) / 200) * 100} className="h-2 bg-white/20" />
        </div>
      </div>

      {details.map((item, idx) => (
        <div key={idx} className="glass-card border-white/30 rounded-3xl p-5 shadow-2xl glass-card-hover group">
          <div className="p-3 bg-white/10 dark:bg-black/10 rounded-2xl w-fit mb-3 group-hover:scale-110 transition-transform">
            {item.icon}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">{item.label}</p>
            <p className="text-xl font-black">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
