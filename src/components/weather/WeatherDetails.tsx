'use client';

import React from 'react';
import { CurrentWeather } from '@/lib/weather-types';
import { Wind, Droplets, Sun, Eye, Navigation, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Props {
  data: CurrentWeather;
}

export function WeatherDetails({ data }: Props) {
  const aqiLevel = data.aqi < 50 ? 'Good' : data.aqi < 100 ? 'Moderate' : 'Poor';
  const aqiColor = data.aqi < 50 ? 'text-green-500' : data.aqi < 100 ? 'text-yellow-500' : 'text-red-500';

  const details = [
    { label: 'Wind Speed', value: `${data.windSpeed} km/h`, icon: <Wind className="text-primary" />, desc: 'Current wind velocity' },
    { label: 'Humidity', value: `${data.humidity}%`, icon: <Droplets className="text-blue-500" />, desc: 'Atmospheric moisture' },
    { label: 'UV Index', value: data.uvi, icon: <Sun className="text-yellow-500" />, desc: 'Radiation level' },
    { label: 'Visibility', value: `${data.visibility} km`, icon: <Eye className="text-slate-500" />, desc: 'Clear sight distance' }
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* AQI Card */}
      <div className="col-span-2 bg-card border rounded-3xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Air Quality</h3>
          </div>
          <span className={`text-sm font-bold ${aqiColor}`}>{aqiLevel}</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-2xl font-black">
            <span>{data.aqi}</span>
            <span className="text-xs text-muted-foreground uppercase self-center">US AQI</span>
          </div>
          <Progress value={(data.aqi / 200) * 100} className="h-2" />
        </div>
      </div>

      {details.map((item, idx) => (
        <div key={idx} className="bg-card border rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-2 bg-accent/5 rounded-2xl w-fit mb-3">
            {item.icon}
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}