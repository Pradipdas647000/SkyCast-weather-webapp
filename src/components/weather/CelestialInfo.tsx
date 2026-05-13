'use client';

import React from 'react';
import { CelestialData } from '@/lib/weather-types';
import { Sunrise, Sunset, Moon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  data: CelestialData;
}

export function CelestialInfo({ data }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-[2rem] p-6 group hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500/20 rounded-2xl">
            <Sunrise className="h-6 w-6 text-orange-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Daylight Schedule</h3>
        </div>
        
        <div className="flex justify-around items-center gap-4 py-2">
          <div className="text-center space-y-1">
            <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Sunrise</p>
            <p className="text-2xl font-black text-white">{data.sunrise}</p>
          </div>
          <div className="relative h-16 w-32 flex items-center justify-center">
             <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
             <div className="absolute inset-0 border-t-2 border-dashed border-white/10 rounded-t-full" />
             <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
               <div className="p-1.5 bg-orange-500/30 rounded-full blur-[2px]" />
               <div className="relative p-1 bg-orange-400 rounded-full" />
             </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Sunset</p>
            <p className="text-2xl font-black text-white">{data.sunset}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[2rem] p-6 group hover:scale-[1.02] transition-transform duration-300 overflow-hidden"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500/20 rounded-2xl">
            <Moon className="h-6 w-6 text-blue-300" />
          </div>
          <h3 className="text-xl font-bold text-white">Moon Time</h3>
        </div>
        
        <div className="flex justify-around items-center gap-4 py-2">
          <div className="text-center space-y-1">
            <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Moonrise</p>
            <p className="text-2xl font-black text-white">{data.moonrise}</p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-400/10 rounded-full blur-xl animate-pulse" />
            <Moon className="h-12 w-12 text-blue-100 relative z-10" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-blue-200/50" />
          </div>

          <div className="text-center space-y-1">
            <p className="text-[10px] text-white/50 font-black uppercase tracking-widest">Moonset</p>
            <p className="text-2xl font-black text-white">{data.moonset}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
