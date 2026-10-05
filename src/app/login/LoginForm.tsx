'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '@/lib/actions/auth';

export default function LoginForm({ initialError }: { initialError?: string }) {
  const [error, setError] = useState(initialError || '');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setError('');
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        if (res.role === 'admin' || res.role === 'super_admin') {
          router.push('/admin');
        } else {
          router.push('/app');
        }
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-2xl border border-surface-border shadow-sm animate-fade-up opacity-0 fill-mode-forwards">
      {error && <div className="bg-error/10 text-error p-3 rounded-lg text-sm animate-fade-in">{error}</div>}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium block">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-interactive focus:border-interactive trans-fast disabled:opacity-50"
          placeholder="you@example.com"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium block">Password</label>
          <Link href="#" className="text-xs text-muted-foreground hover:text-foreground trans-fast">Forgot password?</Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-interactive focus:border-interactive trans-fast disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>
      
      <button type="submit" disabled={isPending} className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-medium hover:bg-accent/90 trans-fast active:scale-[0.98] disabled:opacity-50 flex justify-center">
        {isPending ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}
