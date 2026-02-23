
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { aiWeatherSummary } from '@/ai/flows/ai-weather-summary';
import { WeatherData } from '@/lib/weather-types';
import { Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Props {
  weatherData: WeatherData;
}

export function AIWeatherSummary({ weatherData }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Track the city for which we've successfully initiated a request.
  // This persists across re-renders within the same mount.
  const lastRequestedCityRef = useRef<string | null>(null);
  // Track if a request is currently in flight to prevent overlapping calls.
  const isRequestInFlightRef = useRef(false);

  const generateSummary = useCallback(async (force: boolean = false) => {
    const currentCity = weatherData.current.cityName;
    
    // Safety checks to prevent redundant API calls
    if (!force && isRequestInFlightRef.current) return;
    if (!force && lastRequestedCityRef.current === currentCity && (summary || loading)) return;
    
    setLoading(true);
    setError(null);
    isRequestInFlightRef.current = true;
    lastRequestedCityRef.current = currentCity;

    try {
      const result = await aiWeatherSummary({
        currentWeather: weatherData.current,
        dailyForecast: weatherData.daily,
        hourlyForecast: weatherData.hourly
      });
      setSummary(result.summary);
    } catch (err: any) {
      console.error('Failed to generate AI summary:', err);
      
      const errorMsg = err?.message || String(err);
      if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('quota')) {
        setError('AI rate limit reached. Please wait a minute before retrying.');
      } else {
        setError('Unable to generate AI weather summary at this time.');
      }
      // On error, we reset the lastRequestedCity so they can manually retry via the button
      lastRequestedCityRef.current = null;
    } finally {
      setLoading(false);
      isRequestInFlightRef.current = false;
    }
  }, [weatherData, summary, loading]);

  // Trigger generation when the component mounts or city changes.
  // The key={cityName} on the parent dashboard ensures this component resets per city.
  useEffect(() => {
    generateSummary();
  }, [generateSummary]);

  return (
    <div className="bg-primary/5 border-primary/20 border-2 rounded-3xl p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary rounded-xl shadow-sm shadow-primary/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-bold text-primary">AI Forecast Summary</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => generateSummary(true)}
                  disabled={loading}
                  className="h-8 px-3 text-xs border-primary/20 hover:bg-primary/10 hover:text-primary transition-all gap-1.5"
                >
                  <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  Retry
                </Button>
              </motion.div>
            ) : loading ? (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2 text-xs text-primary font-medium bg-primary/10 px-3 py-1 rounded-full"
              >
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyzing weather patterns...
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 min-h-[60px]">
        {loading && !summary ? (
          <div className="space-y-2">
            <div className="h-4 bg-primary/10 rounded w-full animate-pulse" />
            <div className="h-4 bg-primary/10 rounded w-[90%] animate-pulse" />
            <div className="h-4 bg-primary/10 rounded w-[40%] animate-pulse" />
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 rounded-2xl bg-destructive/5 border border-destructive/10 text-destructive text-sm"
          >
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold">Generation Paused</p>
              <p className="opacity-90 leading-relaxed">{error}</p>
            </div>
          </motion.div>
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

      <div className="absolute top-[-20%] right-[-5%] p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 pointer-events-none">
        <Sparkles className="h-48 w-48 text-primary" />
      </div>
    </div>
  );
}
