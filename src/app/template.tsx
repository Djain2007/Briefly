'use client';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-page-in opacity-0 fill-mode-forwards h-full w-full">
      {children}
    </div>
  );
}
