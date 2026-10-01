import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import Link from 'next/link';
import { Play, FileText, ChevronRight } from 'lucide-react';
import { BriefingPlayButton } from '@/components/audio/BriefingPlayButton';

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: briefings } = await supabase
    .from('briefings')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false });

  return (
    <div className="layout-page">
      <div className="layout-content pb-32">
        <header className="mb-12 md:mb-16 animate-fade-up opacity-0 fill-mode-forwards">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">History.</h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">Your past briefings.</p>
        </header>

        {!briefings || briefings.length === 0 ? (
          <div className="py-16 md:py-24 text-center border-t border-border animate-fade-in opacity-0 delay-100 fill-mode-forwards">
            <h2 className="text-2xl font-bold mb-4 tracking-tight text-foreground">No history yet.</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
              Generate your first briefing to start building your archive.
            </p>
            <Link href="/app" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base shadow-sm">
              Go to Today
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {briefings.map((briefing, idx) => {
              const briefingDate = new Date(briefing.date);
              const formattedDate = format(briefingDate, 'MMMM d, yyyy');
              
              return (
                <div key={briefing.id} className="group relative bg-surface border border-surface-border p-6 md:p-8 rounded-2xl shadow-sm hover:border-border trans-fast flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-up opacity-0 fill-mode-forwards" style={{ animationDelay: `${idx * 80 + 100}ms` }}>
                  <div>
                    <h3 className="font-bold text-xl md:text-2xl mb-2 text-foreground tracking-tight">{formattedDate}</h3>
                    <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                      {briefing.status === 'READY' ? (
                        <>
                          <span className="flex items-center gap-1.5 text-foreground"><FileText size={14}/> {briefing.story_count} stories</span>
                          <span className="text-border">•</span>
                          <span className="flex items-center gap-1.5 text-foreground"><Play size={14}/> {Math.ceil(briefing.duration_seconds / 60)} min</span>
                        </>
                      ) : (
                        <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">{briefing.status}</span>
                      )}
                    </div>
                  </div>
                  
                  {briefing.status === 'READY' && (
                    <div className="flex items-center gap-3">
                      {briefing.audio_path && (
                        <div className="shrink-0">
                          <BriefingPlayButton 
                            track={{
                              id: briefing.id,
                              title: 'Archived Briefing',
                              subtitle: formattedDate,
                              audioUrl: briefing.audio_path
                            }}
                          />
                        </div>
                      )}
                      <Link href={`/app?date=${briefing.date}`} className="shrink-0 flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-foreground trans-fast bg-muted/50 hover:bg-muted px-6 py-3 rounded-xl border border-surface-border active:scale-[0.98] h-10 md:h-12">
                        Read <ChevronRight size={16} />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
