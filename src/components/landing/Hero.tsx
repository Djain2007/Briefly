'use client';

import { ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* Left: Copy */}
        <div className="flex flex-col items-start z-10">
          <div className="animate-fade-up opacity-0 delay-100 fill-mode-forwards">
            <span className="inline-block text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-6 border-b border-border pb-2">
              Personal Daily News Briefing
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-bold tracking-tighter leading-[1.05] mb-8 animate-fade-up opacity-0 delay-150 fill-mode-forwards text-foreground">
            Your day.<br />
            Your news.<br />
            One brief.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 max-w-md leading-relaxed animate-fade-up opacity-0 delay-200 fill-mode-forwards">
            Briefly turns the day's important stories into a concise briefing you can read or listen to.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto animate-fade-up opacity-0 delay-300 fill-mode-forwards">
            <Link 
              href={isLoggedIn ? "/app" : "/register"} 
              className="group btn-primary px-8 py-4 text-base md:text-lg shadow-lg hover:shadow-xl w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Get started <ArrowRight size={18} className="group-hover:translate-x-1 trans-normal" />
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-bold tracking-wide text-muted-foreground hover:text-foreground trans-fast"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Right: Product Preview */}
        <div className="relative w-full max-w-lg mx-auto lg:ml-auto animate-slide-right opacity-0 delay-300 fill-mode-forwards">
          {/* Abstract shadow/glow for depth without neon */}
          <div className="absolute inset-0 bg-surface border border-surface-border rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] -rotate-2 opacity-50"></div>
          
          {/* Main Interface Mock */}
          <div className="relative bg-background border border-surface-border rounded-2xl p-6 md:p-8 shadow-xl flex flex-col h-[500px] md:h-[600px] overflow-hidden hover:shadow-2xl trans-emphasis">
            <header className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <div>
                <h3 className="font-bold text-xl tracking-tight">Today's Brief</h3>
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-1">Oct 1, 2026</p>
              </div>
              <span className="text-[10px] font-bold text-foreground px-2 py-1 bg-surface border border-border rounded">12 stories · 14 min</span>
            </header>

            {/* Audio Mock */}
            <div className="bg-surface border border-surface-border p-4 rounded-xl flex items-center gap-4 mb-8">
              <button className="h-10 w-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center shrink-0 shadow-sm">
                <Play size={16} className="ml-0.5 fill-current" />
              </button>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-xs font-bold">Listen</span>
                  <span className="text-[10px] font-semibold text-muted-foreground">04:12</span>
                </div>
                <div className="h-1 bg-border rounded-full overflow-hidden w-full relative">
                  <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-accent animate-[pulse_3s_ease-in-out_infinite]"></div>
                </div>
              </div>
            </div>

            {/* Stories Mock */}
            <div className="flex-1 flex flex-col gap-6 relative">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">01</span>
                  <span className="text-[10px] font-bold tracking-[0.1em] text-foreground uppercase px-2 py-0.5 bg-surface rounded">Technology</span>
                </div>
                <h4 className="font-bold text-lg leading-tight text-foreground">AI Models Reach New Milestones in Reasoning Capabilities</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 font-medium">Leading labs have announced breakthroughs in reasoning, allowing models to solve complex mathematical problems.</p>
              </div>
              
              <div className="space-y-3 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">02</span>
                  <span className="text-[10px] font-bold tracking-[0.1em] text-foreground uppercase px-2 py-0.5 bg-surface rounded">Markets</span>
                </div>
                <h4 className="font-bold text-lg leading-tight text-foreground">Global Markets Rally Following Positive Economic Data</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 font-medium">Major indices closed higher today as inflation data came in cooler than expected.</p>
              </div>

              {/* Fade out bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
