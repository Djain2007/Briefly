'use client';

import * as React from 'react';
import { generateBriefingAction } from '@/lib/actions/briefing';
import { useRouter } from 'next/navigation';

export function GenerateBriefingButton({ date }: { date: string }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    const res = await generateBriefingAction();
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error || 'Failed to generate briefing');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 border-interactive border-t-transparent animate-spin" />
        <span className="font-bold text-foreground">Generating audio...</span>
      </div>
    );
  }

  return (
    <button onClick={handleGenerate} className="btn-primary shadow-lg inline-flex items-center gap-2">
      Generate Briefing
    </button>
  );
}
