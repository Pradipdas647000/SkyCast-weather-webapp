'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

export function RealTimeClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Initial set and then start interval to avoid hydration mismatch
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <div className="flex flex-col items-start gap-1">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-3 w-32 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start px-2">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        <Clock className="h-3.5 w-3.5" />
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-black">
        <CalendarIcon className="h-3 w-3" />
        <span>{time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}
