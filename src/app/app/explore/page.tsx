'use client';

import * as React from 'react';
import { useExploreTopics } from '@/lib/hooks/useData';
import StoryCard from '@/components/StoryCard';
import { Compass } from 'lucide-react';
import { useSavedStories } from '@/lib/hooks/useData';
import { createClient } from '@/lib/supabase/client';

const TOPICS = [
  'Technology', 'Business', 'Markets', 'Science', 
  'World', 'Startups', 'AI', 'Climate', 'Sports', 'Culture'
];

export default function ExplorePage() {
  const [activeTopic, setActiveTopic] = React.useState('Technology');
  const [userId, setUserId] = React.useState<string>();
  const supabase = createClient();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, [supabase]);

  const { data: exploreStories, isLoading } = useExploreTopics(activeTopic);
  const { data: savedStories } = useSavedStories(userId);
  const savedIds = React.useMemo(() => savedStories?.map(s => s.id) || [], [savedStories]);

  return (
    <div className="pb-32 w-full max-w-[1200px] mx-auto px-6 lg:px-10 animate-fade-in pt-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground flex items-center gap-4">
          Explore <Compass className="text-interactive" size={32} />
        </h1>
        <p className="text-xl text-muted-foreground font-medium">Discover new stories across different topics.</p>
      </header>

      {/* Topic selection carousel */}
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 mb-12">
        {TOPICS.map((topic) => (
          <button 
            key={topic} 
            onClick={() => setActiveTopic(topic)}
            className={`whitespace-nowrap px-6 py-3 rounded-full font-bold trans-fast active:scale-95 border ${
              activeTopic === topic 
                ? 'bg-foreground text-background border-foreground' 
                : 'bg-surface border-surface-border text-foreground hover:bg-muted'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-muted/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !exploreStories || exploreStories.length === 0 ? (
        <div className="py-24 text-center border-t border-border mt-8">
          <Compass size={48} className="mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold mb-4 tracking-tight text-foreground">No stories found.</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            Check back later for more updates in {activeTopic}.
          </p>
        </div>
      ) : (
        <div className="space-y-8 divide-y divide-border">
          {exploreStories.map((story, idx) => (
            <div key={story.id} className={idx > 0 ? "pt-8" : ""}>
              <StoryCard story={story} isSaved={savedIds.includes(story.id)} />
            </div>
          ))}
        </div>
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
