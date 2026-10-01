'use client';

import * as React from 'react';
import { useRecentBriefings } from '@/lib/hooks/useData';
import { createClient } from '@/lib/supabase/client';
import { PlaySquare, ChevronRight, Play } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { BriefingPlayButton } from '@/components/audio/BriefingPlayButton';

export default function RecentPage() {
  const [userId, setUserId] = React.useState<string>();
  const supabase = createClient();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, [supabase]);

  const { data: briefings, isLoading } = useRecentBriefings(userId);

  return (
    <div className="pb-32 max-w-5xl mx-auto px-6 lg:px-10 animate-fade-in pt-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Recently Played.</h1>
        <p className="text-xl text-muted-foreground font-medium">Your past listening sessions.</p>
      </header>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !briefings || briefings.length === 0 ? (
        <div className="py-24 text-center border-t border-border mt-8">
          <PlaySquare size={48} className="mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold mb-4 tracking-tight text-foreground">Nothing here yet.</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            Stories you read or listen to will appear here.
          </p>
          <Link href="/app" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5">
            Go to Today
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {briefings.map((briefing) => {
            const formattedDate = format(new Date(briefing.date), 'MMMM d, yyyy');
            return (
              <div key={briefing.id} className="group relative bg-surface border border-surface-border p-6 rounded-2xl shadow-sm hover:border-border trans-fast flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {briefing.audio_path && (
                    <BriefingPlayButton 
                      track={{
                        id: briefing.id,
                        title: 'Archived Briefing',
                        subtitle: formattedDate,
                        audioUrl: briefing.audio_path
                      }}
                    />
                  )}
                  <div>
                    <h3 className="font-bold text-lg md:text-xl text-foreground tracking-tight mb-1">{formattedDate}</h3>
                    <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      <span>{briefing.story_count} stories</span>
                      <span className="text-border">•</span>
                      <span>{Math.ceil(briefing.duration_seconds / 60)} min</span>
                    </div>
                  </div>
                </div>
                
                <Link href={`/app?date=${briefing.date}`} className="shrink-0 text-muted-foreground hover:text-foreground trans-fast p-2 bg-muted/50 rounded-full">
                  <ChevronRight size={20} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
