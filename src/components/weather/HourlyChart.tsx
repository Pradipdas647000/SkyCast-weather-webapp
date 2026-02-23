'use client';

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { HourlyForecastItem } from '@/lib/weather-types';

interface Props {
  data: HourlyForecastItem[];
  unit: 'C' | 'F';
}

export function HourlyChart({ data, unit }: Props) {
  const chartData = data.map(item => ({
    time: item.time,
    temp: unit === 'F' ? Math.round((item.temperature * 9/5) + 32) : Math.round(item.temperature),
    precipitation: item.precipitationChance
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border p-3 rounded-xl shadow-xl">
          <p className="font-bold text-sm mb-1">{label}</p>
          <p className="text-primary font-bold">{payload[0].value}°{unit}</p>
          <p className="text-blue-500 text-xs">{payload[1]?.value}% Rain</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis 
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} 
          interval={2}
        />
        <YAxis 
          hide 
          domain={['dataMin - 5', 'dataMax + 5']} 
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="temp" 
          stroke="hsl(var(--primary))" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorTemp)" 
          animationDuration={1500}
        />
        <Area 
          type="monotone" 
          dataKey="precipitation" 
          stroke="#3b82f6" 
          strokeWidth={0}
          fillOpacity={0.1} 
          fill="#3b82f6" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}