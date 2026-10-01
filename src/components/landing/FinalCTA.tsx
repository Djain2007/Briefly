'use client';

import { Reveal } from './Reveal';
import Link from 'next/link';

export function FinalCTA({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="py-32 md:py-48 bg-background border-b border-border">
      <div className="max-w-[800px] mx-auto px-6 lg:px-12 text-center flex flex-col items-center">
        <Reveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-8 text-foreground leading-[1.05]">
            Start your first brief.
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-medium mb-12 max-w-md mx-auto leading-relaxed">
            Choose what matters to you and let Briefly handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <Link 
              href={isLoggedIn ? "/app" : "/register"} 
              className="btn-primary px-10 py-5 text-lg shadow-xl hover:shadow-2xl w-full sm:w-auto"
            >
              Get started
            </Link>
            <Link 
              href="#how-it-works" 
              className="text-sm font-bold tracking-wide text-muted-foreground hover:text-foreground trans-fast"
            >
              Explore how it works
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
