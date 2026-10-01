'use client';

import { Reveal } from './Reveal';
import { Bookmark, Clock, Headphones, BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    id: 'READ',
    icon: BookOpen,
    desc: 'Clean, distraction-free reading experience.'
  },
  {
    id: 'LISTEN',
    icon: Headphones,
    desc: 'Premium text-to-speech audio player.'
  },
  {
    id: 'SAVE',
    icon: Bookmark,
    desc: 'Keep important stories for later.'
  },
  {
    id: 'HISTORY',
    icon: Clock,
    desc: 'Access your past daily briefings.'
  }
];

export function ProductShowcase() {
  return (
    <section className="py-24 md:py-32 border-b border-border bg-background">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                The complete experience.
              </h2>
              <p className="text-lg text-muted-foreground font-medium max-w-md">
                Everything you need to stay informed, nothing you don't.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feat, idx) => (
            <Reveal key={feat.id} delay={idx * 100}>
              <div className="flex flex-col h-full border-t-2 border-border pt-6 group hover:border-foreground trans-normal">
                <div className="flex justify-between items-start mb-12">
                  <span className="text-xs font-bold tracking-[0.2em] text-foreground uppercase">{feat.id}</span>
                  <feat.icon size={20} className="text-muted-foreground group-hover:text-foreground trans-normal" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-semibold text-muted-foreground leading-relaxed mt-auto">
                  {feat.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Source / Trust Section */}
        <Reveal delay={400}>
          <div className="mt-24 md:mt-32 p-8 md:p-12 bg-surface border border-surface-border rounded-2xl flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">How it works under the hood</h3>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                Briefly gathers stories from reliable news sources based on your selected interests. Our backend processes the raw text, removes editorial fluff using advanced language models to create concise summaries, and synthesizes the final briefing into a natural-sounding audio podcast.
              </p>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="flex items-center justify-between text-xs font-bold tracking-widest uppercase text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-foreground"></div>
                  <span>News</span>
                </div>
                <div className="h-px bg-border flex-1 mx-4"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-foreground"></div>
                  <span>Process</span>
                </div>
                <div className="h-px bg-border flex-1 mx-4"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-foreground"></div>
                  <span>Audio</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
