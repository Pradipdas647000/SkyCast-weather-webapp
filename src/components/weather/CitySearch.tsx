'use client';

import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Props {
  onSearch: (city: string) => void;
}

export function CitySearch({ onSearch }: Props) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
      </div>
      <Input
        type="text"
        placeholder="Search city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10 pr-12 h-11 rounded-xl border-border bg-background/50 focus:bg-background transition-all shadow-sm"
      />
      <div className="absolute inset-y-0 right-3 flex items-center">
        <button
          type="button"
          className="p-1 hover:bg-accent rounded-lg transition-colors"
          title="Use current location"
        >
          <MapPin className="h-4 w-4 text-primary" />
        </button>
      </div>
    </form>
  );
}