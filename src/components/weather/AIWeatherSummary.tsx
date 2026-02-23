'use client';

import React, { useState, useEffect } from 'react';
import { aiWeatherSummary } from '@/ai/flows/ai-weather-summary';
import { WeatherData } from '@/lib/weather-types';
import { Sparkles, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  weatherData: WeatherData;
}

export function AIWeatherSummary({ weatherData }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSummary = async () => {
    setLoading(true);
    try {
      const result = await aiWeatherSummary({
        currentWeather: weatherData.current,
        dailyForecast: weatherData.daily,
        hourlyForecast: weatherData.hourly
      });
      setSummary(result);
    } catch (error) {
      console.error('Failed to generate AI summary:', error);
      setSummary('Unable to generate AI weather summary at this time.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateSummary();
  }, [weatherData.current.cityName]);

  return (
    <div className="bg-primary/5 border-primary/20 border-2 rounded-3xl p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-xl">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-bold text-primary">AI Forecast Summary</h3>
        </div>
        <AnimatePresence>
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-primary font-medium"
            >
              <Loader2 className="h-3 w-3 animate-spin" />
              Analyzing patterns...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-primary/10 rounded w-full animate-pulse" />
            <div className="h-4 bg-primary/10 rounded w-[90%] animate-pulse" />
            <div className="h-4 bg-primary/10 rounded w-[40%] animate-pulse" />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
          >
            {summary || 'Generating your personalized weather insights...'}
          </motion.div>
        )}
      </div>

      {/* Decorative background sparks */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Sparkles className="h-24 w-24 text-primary" />
      </div>
    </div>
  );
}