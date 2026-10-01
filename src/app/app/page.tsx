import { createClient } from '@/lib/supabase/server';
import { format } from 'date-fns';
import { Story } from '@/types';
import Link from 'next/link';
import { BriefingPlayButton } from '@/components/audio/BriefingPlayButton';
import { Play, Bookmark, Clock, Search, User } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ClientCarousels } from '@/components/ClientCarousels';
import { GenerateBriefingButton } from '@/components/GenerateBriefingButton';

export const revalidate = 0;

export default async function TodayPage(
  props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }
) {
  const searchParams = await props.searchParams;
  const targetDate = (searchParams?.date as string) || new Date().toISOString().split('T')[0];

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();
  const { data: prefs } = await supabase.from('user_preferences').select('interests').eq('id', user.id).single();

  const { data: briefing } = await supabase
    .from('briefings')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', targetDate)
    .single();

  let stories: Story[] = [];
  let savedStoryIds: string[] = [];
  
  if (briefing && briefing.status === 'READY') {
    const { data } = await supabase
      .from('stories')
      .select('*')
      .eq('briefing_id', briefing.id)
      .order('created_at', { ascending: true });
    stories = data || [];

    const { data: savedData } = await supabase
      .from('saved_stories')
      .select('story_id')
      .eq('user_id', user.id);
    
    savedStoryIds = (savedData || []).map(s => s.story_id);
  }

  const displayDate = targetDate === new Date().toISOString().split('T')[0] 
    ? new Date() 
    : new Date(targetDate);
  
  const formattedDate = format(displayDate, 'EEEE, MMMM d');
  const greeting = getGreeting();
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'there';
  const hasBriefing = briefing?.status === 'READY';
  
  // Categorize stories for the UI
  const topStories = stories.slice(0, 5);
  const forYouStories = stories.filter(s => prefs?.interests?.includes(s.category || '')).slice(0, 5);
  if (forYouStories.length === 0) {
    forYouStories.push(...stories.slice(5, 10)); // fallback
  }

  return (
    <div className="pb-32 w-full max-w-[1600px] mx-auto px-6 lg:px-10 animate-fade-in">
      
      {/* HEADER */}
      <header className="flex items-center justify-between py-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-surface border border-surface-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted trans-fast active:scale-95 transition-all">
            <Search size={18} />
          </button>
          <ThemeToggle />
          <Link href="/app/settings" className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold tracking-tight hover:scale-105 active:scale-95 trans-fast">
            {firstName.charAt(0).toUpperCase()}
          </Link>
        </div>
      </header>

      {/* HERO: TODAY'S BRIEFING */}
      <section className="mb-12 animate-fade-up opacity-0 fill-mode-forwards" style={{ animationDelay: '100ms' }}>
        <div className="relative overflow-hidden bg-surface border border-surface-border rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 shadow-sm group">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 trans-normal pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-[10px] font-bold tracking-[0.25em] text-interactive uppercase mb-4">Today's Briefing</h2>
              
              {hasBriefing ? (
                <>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-[1.1]">
                    Your personalized daily briefing.
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
                    <span>{briefing.story_count} stories</span>
                    <span className="text-border">•</span>
                    <span>{Math.ceil(briefing.duration_seconds / 60)} min</span>
                    {prefs?.interests && prefs.interests.length > 0 && (
                      <>
                        <span className="text-border">•</span>
                        <span className="truncate max-w-[200px]">{prefs.interests.slice(0,2).join(' · ')}</span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {briefing.audio_path && (
                      <div className="scale-125 origin-left">
                        <BriefingPlayButton 
                          track={{
                            id: briefing.id,
                            title: 'Today\'s Brief',
                            subtitle: format(displayDate, 'MMM d, yyyy'),
                            audioUrl: briefing.audio_path
                          }}
                        />
                      </div>
                    )}
                    <span className="font-bold text-foreground tracking-tight">Play briefing</span>
                  </div>
                </>
              ) : (
                <>
                   <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-foreground mb-6 leading-[1.1]">
                    Your briefing isn't ready yet.
                  </h3>
                  {briefing?.status === 'PENDING' || briefing?.status === 'PROCESSING' ? (
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-interactive border-t-transparent animate-spin" />
                      <span className="font-bold text-foreground">Generating audio...</span>
                    </div>
                  ) : (
                    <GenerateBriefingButton date={targetDate} />
                  )}
                </>
              )}
            </div>
            
            <div className="hidden lg:flex w-48 h-48 rounded-2xl bg-foreground text-background items-center justify-center font-serif text-8xl font-bold opacity-90 rotate-3 group-hover:rotate-6 trans-emphasis shadow-2xl">
              B
            </div>
          </div>
        </div>
      </section>

      {hasBriefing && (
        <ClientCarousels userId={user.id} interests={prefs?.interests || []} />
      )}
      
      {/* Support CSS for hiding scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
