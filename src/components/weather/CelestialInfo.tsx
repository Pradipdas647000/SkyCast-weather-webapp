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
          <h3 className="text-xl font-bold">Daylight Schedule</h3>
        </div>
        
        <div className="flex justify-around items-center gap-4">
          <div className="text-center space-y-2">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Sunrise</p>
            <p className="text-2xl font-black">{data.sunrise}</p>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center space-y-2">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Sunset</p>
            <p className="text-2xl font-black">{data.sunset}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-[2rem] p-6 group hover:scale-[1.02] transition-transform duration-300"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-500/20 rounded-2xl">
            <Moon className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold">Moon Details</h3>
        </div>
        
        <div className="flex justify-around items-center gap-4">
          <div className="text-center space-y-2">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Moonrise</p>
            <p className="text-2xl font-black">{data.moonrise}</p>
          </div>
          <div className="h-12 w-px bg-white/10" />
          <div className="text-center space-y-2">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Moonset</p>
            <p className="text-2xl font-black">{data.moonset}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
