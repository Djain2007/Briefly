'use client';

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          <div className="md:col-span-1">
            <Link href="/" className="font-bold tracking-tighter text-xl inline-block mb-4">
              BRIEFLY
            </Link>
            <p className="text-sm font-semibold text-muted-foreground">
              Your day.<br/>Your news.<br/>One brief.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Product</span>
              <Link href="#how-it-works" className="text-sm font-semibold text-foreground hover:opacity-70 trans-fast">How it works</Link>
              <Link href="#personalization" className="text-sm font-semibold text-foreground hover:opacity-70 trans-fast">Personalization</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Company</span>
              <Link href="#" className="text-sm font-semibold text-foreground hover:opacity-70 trans-fast">About</Link>
              <Link href="#" className="text-sm font-semibold text-foreground hover:opacity-70 trans-fast">Contact</Link>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">Legal</span>
              <Link href="#" className="text-sm font-semibold text-foreground hover:opacity-70 trans-fast">Privacy</Link>
              <Link href="#" className="text-sm font-semibold text-foreground hover:opacity-70 trans-fast">Terms</Link>
            </div>
          </div>
          
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-muted-foreground">
            © {new Date().getFullYear()} Briefly. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            <span className="text-xs font-semibold text-muted-foreground">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
