'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerAction } from '@/lib/actions/auth';

export default function RegisterForm({ initialError }: { initialError?: string }) {
  const [error, setError] = useState(initialError || '');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      setError('');
      const res = await registerAction(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        router.push('/onboarding');
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 rounded-2xl border border-surface-border shadow-sm animate-fade-up opacity-0 fill-mode-forwards">
      {error && <div className="bg-error/10 text-error p-3 rounded-lg text-sm animate-fade-in">{error}</div>}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium block">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-interactive focus:border-interactive trans-fast disabled:opacity-50"
          placeholder="Jane Doe"
        />
      </div>

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
        <label htmlFor="password" className="text-sm font-medium block">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
          className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-interactive focus:border-interactive trans-fast disabled:opacity-50"
          placeholder="••••••••"
          minLength={6}
        />
      </div>
      
      <button type="submit" disabled={isPending} className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-medium hover:bg-accent/90 trans-fast active:scale-[0.98] disabled:opacity-50 flex justify-center">
        {isPending ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  );
}
