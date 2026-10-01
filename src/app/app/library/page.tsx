'use client';

import Link from 'next/link';
import { Bookmark, PlaySquare, ChevronRight } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="pb-32 max-w-5xl mx-auto px-6 lg:px-10 animate-fade-in pt-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Your Library.</h1>
        <p className="text-xl text-muted-foreground font-medium">Everything you've saved and listened to.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/app/saved" className="group flex flex-col bg-surface border border-surface-border p-8 rounded-3xl shadow-sm hover:border-foreground trans-normal active:scale-[0.98]">
          <div className="w-16 h-16 bg-foreground text-background rounded-2xl flex items-center justify-center mb-8 shadow-md">
            <Bookmark size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-interactive trans-fast flex items-center justify-between">
            Saved Stories
            <ChevronRight className="opacity-0 group-hover:opacity-100 trans-fast translate-x-4 group-hover:translate-x-0" />
          </h2>
          <p className="text-muted-foreground font-medium">Stories you wanted to keep for later.</p>
        </Link>
        
        <Link href="/app/recent" className="group flex flex-col bg-surface border border-surface-border p-8 rounded-3xl shadow-sm hover:border-foreground trans-normal active:scale-[0.98]">
          <div className="w-16 h-16 bg-muted text-foreground rounded-2xl flex items-center justify-center mb-8">
            <PlaySquare size={32} />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 group-hover:text-interactive trans-fast flex items-center justify-between">
            Recently Played
            <ChevronRight className="opacity-0 group-hover:opacity-100 trans-fast translate-x-4 group-hover:translate-x-0" />
          </h2>
          <p className="text-muted-foreground font-medium">Your past listening sessions and briefings.</p>
        </Link>
      </div>
    </div>
  );
}
