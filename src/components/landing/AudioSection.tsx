'use client';

import { Reveal } from './Reveal';
import { Play } from 'lucide-react';

export function AudioSection() {
  return (
    <section className="py-24 md:py-32 border-b border-border bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Copy */}
        <Reveal>
          <div className="flex flex-col items-start">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Listen instead of scrolling.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-md">
              Commuting, walking, or making coffee. Briefly uses state-of-the-art text-to-speech to read your personalized briefing in a natural, premium voice.
            </p>
          </div>
        </Reveal>

        {/* Right: Audio Player Mock */}
        <Reveal delay={200}>
          <div className="bg-background border border-surface-border p-8 md:p-12 rounded-3xl shadow-sm flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between mb-12">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">Audio Brief</span>
              <span className="text-xs font-bold px-3 py-1 bg-surface border border-border rounded-full">1x Speed</span>
            </div>

            <button className="group h-24 w-24 bg-foreground text-background rounded-full flex items-center justify-center shrink-0 hover:scale-105 trans-normal shadow-xl mb-12 relative">
              <Play size={32} className="ml-2 fill-current" />
              {/* Outer rings for visual interest */}
              <div className="absolute inset-[-10px] border border-border rounded-full opacity-50 pointer-events-none group-hover:scale-110 trans-normal"></div>
              <div className="absolute inset-[-20px] border border-surface-border rounded-full opacity-30 pointer-events-none group-hover:scale-105 trans-normal"></div>
            </button>

            <div className="w-full space-y-4">
              <div className="h-1 bg-muted rounded-full overflow-hidden w-full relative">
                <div className="absolute top-0 left-0 bottom-0 w-2/5 bg-foreground"></div>
              </div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span>05:30</span>
                <span>14:15</span>
              </div>
            </div>

          </div>
        </Reveal>

      </div>
    </section>
  );
}
