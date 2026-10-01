'use client';

import { useState } from 'react';
import { Reveal } from './Reveal';
import { Check } from 'lucide-react';

const CATEGORIES = [
  'Technology', 'AI', 'Business', 'Markets', 'World', 
  'India', 'Science', 'Space', 'Startups', 'Finance'
];

export function InterestPreview() {
  const [selected, setSelected] = useState<string[]>(['Technology', 'AI', 'Markets']);

  const toggle = (cat: string) => {
    if (selected.includes(cat)) {
      if (selected.length > 1) setSelected(selected.filter(c => c !== cat));
    } else {
      setSelected([...selected, cat]);
    }
  };

  return (
    <section id="personalization" className="py-24 md:py-32 border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Interactive Selector */}
        <Reveal direction="none">
          <div className="flex flex-col items-start">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Your briefing.<br/>Your interests.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 font-medium leading-relaxed max-w-md">
              Build a briefing that reflects your curiosity. Follow broad topics like World News or niche interests like AI and Space. Briefly builds a unique edition just for you.
            </p>
            
            <div className="w-full bg-surface border border-surface-border rounded-2xl p-8 shadow-sm">
              <div className="flex justify-between items-end mb-6">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Select Interests</span>
                <span className="text-xs font-bold text-foreground">{selected.length} selected</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {CATEGORIES.map(cat => {
                  const isSelected = selected.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggle(cat)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold trans-fast border flex items-center gap-2 ${
                        isSelected 
                          ? 'bg-foreground text-background border-foreground' 
                          : 'bg-background text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: Dynamic Story Output */}
        <Reveal delay={200} direction="none" className="h-full">
          <div className="h-full min-h-[400px] bg-background border border-border rounded-2xl p-8 flex flex-col">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground border-b border-border pb-4 mb-6">
              Preview Edition
            </h3>
            
            <div className="space-y-8 flex-1">
              {selected.slice(0, 3).map((cat, i) => (
                <div key={`${cat}-${i}`} className="space-y-2 animate-slide-right opacity-0 fill-mode-forwards" style={{ animationDelay: `${i * 100}ms`}}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">0{i+1}</span>
                    <span className="text-[10px] font-bold tracking-[0.1em] text-foreground uppercase px-2 py-0.5 bg-surface rounded border border-surface-border">{cat}</span>
                  </div>
                  <h4 className="font-bold text-lg leading-tight text-foreground">
                    {cat === 'AI' ? 'New Models Show Unprecedented Reasoning' : 
                     cat === 'Markets' ? 'Global Markets React to Inflation Data' : 
                     cat === 'Technology' ? 'Tech Giants Announce New Semiconductor Push' :
                     cat === 'Space' ? 'Commercial Lunar Lander Sends Back First Images' :
                     `Latest Updates in ${cat} Sector`}
                  </h4>
                  <div className="h-2 w-32 bg-muted rounded mt-2"></div>
                </div>
              ))}
              
              {selected.length === 0 && (
                <div className="h-full flex items-center justify-center text-sm font-semibold text-muted-foreground">
                  Select interests to preview
                </div>
              )}
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
