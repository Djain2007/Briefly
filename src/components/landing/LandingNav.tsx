'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

import { ThemeToggle } from '../ThemeToggle';

export function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-background/95 backdrop-blur-md border-b border-border py-4 shadow-sm' 
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="font-bold tracking-tighter text-xl animate-fade-in opacity-0 fill-mode-forwards">
              BRIEFLY
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-muted-foreground animate-fade-in opacity-0 delay-100 fill-mode-forwards">
              <Link href="#how-it-works" className="hover:text-foreground trans-fast">How it works</Link>
              <Link href="#personalization" className="hover:text-foreground trans-fast">Features</Link>
              <Link href="#plans" className="hover:text-foreground trans-fast">Plans</Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4 animate-fade-in opacity-0 delay-200 fill-mode-forwards">
            <ThemeToggle />
            {isLoggedIn ? (
              <Link href="/app" className="btn-primary">
                Go to App
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground trans-fast px-4 py-2">
                  Log in
                </Link>
                <Link href="/register" className="btn-primary shadow-sm hover:shadow-md">
                  Get started
                </Link>
              </>
            )}
          </div>

          <button 
            className="md:hidden text-foreground p-2"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-background animate-slide-left fill-mode-forwards flex flex-col">
          <div className="flex items-center justify-between px-6 py-6 border-b border-border">
            <span className="font-bold tracking-tighter text-xl">BRIEFLY</span>
            <button onClick={() => setMobileOpen(false)} className="p-2">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col p-6 space-y-6 text-xl font-semibold">
            <Link href="#how-it-works" onClick={() => setMobileOpen(false)}>How it works</Link>
            <Link href="#personalization" onClick={() => setMobileOpen(false)}>Features</Link>
            <Link href="#plans" onClick={() => setMobileOpen(false)}>Plans</Link>
            
            <div className="pt-8 border-t border-border flex flex-col gap-4">
              <div className="flex justify-center mb-4">
                <ThemeToggle />
              </div>
              {isLoggedIn ? (
                <Link href="/app" className="btn-primary text-center py-4 text-lg">Go to App</Link>
              ) : (
                <>
                  <Link href="/login" className="text-muted-foreground py-2 text-center">Log in</Link>
                  <Link href="/register" className="btn-primary text-center py-4 text-lg">Get started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
