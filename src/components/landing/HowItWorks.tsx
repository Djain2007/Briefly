'use client';

import { useState } from 'react';
import { Reveal } from './Reveal';
import { Search, FileText, Play, Check } from 'lucide-react';

const STEPS = [
  {
    id: '01',
    title: 'Choose what matters.',
    desc: 'Select the topics and categories you actually care about. No noise, no algorithms trying to keep you scrolling.',
  },
  {
    id: '02',
    title: 'Briefly gathers the news.',
    desc: 'Our system scans thousands of trusted sources to find the most important stories within your interests.',
  },
  {
    id: '03',
    title: 'AI creates concise summaries.',
    desc: 'Advanced language models synthesize the information, extracting key points and removing editorial fluff.',
  },
  {
    id: '04',
    title: 'Listen or read.',
    desc: 'Your personal daily brief is delivered as both a clean reading experience and a premium audio podcast.',
  }
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-24 md:py-32 border-b border-border bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 md:mb-24 max-w-2xl text-foreground">
            A simpler way to stay informed, built around what matters to you.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left: Steps list */}
          <div className="flex flex-col gap-8">
            {STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <Reveal key={step.id} delay={idx * 100}>
                  <button 
                    onMouseEnter={() => setActiveStep(idx)}
                    onClick={() => setActiveStep(idx)}
                    className={`text-left w-full border-l-2 pl-6 md:pl-8 py-2 trans-normal ${
                      isActive ? 'border-foreground' : 'border-border opacity-50 hover:opacity-100 hover:border-muted-foreground'
                    }`}
                  >
                    <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase block mb-3">
                      {step.id}
                    </span>
                    <h3 className={`font-bold text-xl md:text-2xl mb-3 ${isActive ? 'text-foreground' : 'text-foreground'}`}>
                      {step.title}
                    </h3>
                    {isActive && (
                      <p className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed animate-fade-down opacity-0 fill-mode-forwards">
                        {step.desc}
                      </p>
                    )}
                  </button>
                </Reveal>
              );
            })}
          </div>

          {/* Right: Dynamic Visual Preview */}
          <Reveal delay={200} className="relative h-[400px] md:h-[500px] bg-background border border-surface-border rounded-2xl shadow-sm flex items-center justify-center p-8 overflow-hidden">
            
            {/* Step 01 Visual */}
            <div className={`absolute inset-0 p-8 flex flex-col transition-all duration-500 ease-out ${activeStep === 0 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'}`}>
              <div className="mb-6">
                <div className="h-8 w-8 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
                  <Check size={14} />
                </div>
                <h4 className="font-bold text-lg">Your Interests</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Technology', 'Business', 'AI', 'Markets', 'Science'].map((item, i) => (
                  <span key={item} className={`px-4 py-2 rounded-lg border text-xs font-bold ${i < 3 ? 'bg-foreground text-background border-foreground' : 'bg-surface text-muted-foreground border-surface-border'}`}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 02 Visual */}
            <div className={`absolute inset-0 p-8 flex flex-col transition-all duration-500 ease-out ${activeStep === 1 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'}`}>
              <div className="mb-6">
                <div className="h-8 w-8 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
                  <Search size={14} />
                </div>
                <h4 className="font-bold text-lg">Gathering sources...</h4>
              </div>
              <div className="space-y-4 w-full">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded bg-muted animate-pulse shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-2 bg-muted rounded w-3/4 animate-pulse"></div>
                      <div className="h-2 bg-muted rounded w-1/2 animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 03 Visual */}
            <div className={`absolute inset-0 p-8 flex flex-col transition-all duration-500 ease-out ${activeStep === 2 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'}`}>
              <div className="mb-6">
                <div className="h-8 w-8 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
                  <FileText size={14} />
                </div>
                <h4 className="font-bold text-lg">Synthesizing</h4>
              </div>
              <div className="bg-surface border border-surface-border p-4 rounded-xl">
                <p className="text-sm font-medium text-muted-foreground line-through opacity-50 mb-2">
                  In a surprising turn of events today, many analysts were shocked to see that the global markets have rallied significantly...
                </p>
                <div className="h-px w-full bg-border my-4"></div>
                <p className="text-sm font-bold text-foreground">
                  Global markets rallied today following cooler-than-expected inflation data.
                </p>
              </div>
            </div>

            {/* Step 04 Visual */}
            <div className={`absolute inset-0 p-8 flex flex-col justify-center transition-all duration-500 ease-out ${activeStep === 3 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-95 z-0'}`}>
              <div className="bg-foreground text-background p-6 rounded-2xl flex items-center gap-6 shadow-xl">
                <button className="h-14 w-14 bg-background text-foreground rounded-full flex items-center justify-center shrink-0">
                  <Play size={20} className="ml-1" fill="currentColor" />
                </button>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold">Today's Audio Brief</span>
                    <span className="text-xs font-semibold opacity-70">05:30</span>
                  </div>
                  <div className="h-1 bg-background/30 rounded-full overflow-hidden w-full relative">
                    <div className="absolute top-0 left-0 bottom-0 w-1/2 bg-background"></div>
                  </div>
                </div>
              </div>
            </div>

          </Reveal>

        </div>
      </div>
    </section>
  );
}
