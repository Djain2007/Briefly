'use client';

import Link from 'next/link';
import { UserProfile } from '@/types';

export default function MobileHeader({ user }: { user: UserProfile }) {
  return (
    <header className="h-14 border-b border-surface-border flex items-center justify-between px-6 bg-surface/80 backdrop-blur-md sticky top-0 z-40">
      <Link href="/app" className="font-bold tracking-tighter text-lg">BRIEFLY</Link>
      <Link href="/app/settings" className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground trans-fast hover:bg-border">
        {user?.name?.charAt(0).toUpperCase() || 'U'}
      </Link>
    </header>
  );
}
