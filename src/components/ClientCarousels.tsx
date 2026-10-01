'use client';

import * as React from 'react';
import { useTopStories, useForYouStories, useSavedStories } from '@/lib/hooks/useData';
import { Story } from '@/types';
import SaveButton from '@/components/SaveButton';
import { Clock } from 'lucide-react';
import Link from 'next/link';

export function ClientCarousels({ userId, interests }: { userId: string, interests: string[] }) {
  const { data: topStories } = useTopStories();
  const { data: forYouStoriesRaw } = useForYouStories(interests);
  const { data: savedStories } = useSavedStories(userId);

  const savedStoryIds = savedStories?.map(s => s.id) || [];
  const forYouStories = forYouStoriesRaw || [];

  return (
    <div className="space-y-16">
      {/* Top Stories */}
      <section className="animate-fade-up opacity-0 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Top Stories</h2>
          <button className="text-sm font-bold text-muted-foreground hover:text-foreground trans-fast">See all</button>
        </div>
        {!topStories ? (
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
             {[1, 2, 3].map(i => <div key={i} className="shrink-0 w-[280px] md:w-[320px] h-[200px] bg-muted/50 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
            {topStories.map((story) => (
              <StoryCardCompact key={story.id} story={story} isSaved={savedStoryIds.includes(story.id)} />
            ))}
          </div>
        )}
      </section>

      {/* For You */}
      {interests.length > 0 && (
        <section className="animate-fade-up opacity-0 fill-mode-forwards" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">For You</h2>
            <button className="text-sm font-bold text-muted-foreground hover:text-foreground trans-fast">See all</button>
          </div>
          {!forYouStoriesRaw ? (
             <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
               {[1, 2, 3].map(i => <div key={i} className="shrink-0 w-[280px] md:w-[320px] h-[200px] bg-muted/50 rounded-2xl animate-pulse" />)}
             </div>
          ) : (
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
              {forYouStories.map((story) => (
                <StoryCardCompact key={story.id} story={story} isSaved={savedStoryIds.includes(story.id)} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Explore Topics */}
      <section className="animate-fade-up opacity-0 fill-mode-forwards" style={{ animationDelay: '400ms' }}>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Explore Topics</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
          {['Technology', 'Business', 'Markets', 'Science', 'World', 'Startups', 'AI', 'Climate', 'Sports', 'Culture'].map((topic) => (
            <Link 
              key={topic} 
              href={`/app/explore`} 
              className="whitespace-nowrap px-6 py-3 rounded-full bg-surface border border-surface-border font-bold text-foreground hover:bg-foreground hover:text-background trans-fast active:scale-95"
            >
              {topic}
            </Link>
          ))}
        </div>
      </section>

      {/* Saved Stories */}
      <section className="animate-fade-up opacity-0 fill-mode-forwards" style={{ animationDelay: '500ms' }}>
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">Saved for later</h2>
        {savedStoryIds.length > 0 ? (
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
             {savedStories?.map((story) => (
               <StoryCardCompact key={story.id} story={story} isSaved={true} />
             ))}
          </div>
        ) : (
          <div className="p-8 border border-border rounded-2xl bg-surface/50 text-center">
            <p className="text-muted-foreground font-medium mb-4">Nothing saved yet.</p>
            <Link href="/app/explore" className="text-sm font-bold text-foreground bg-muted px-4 py-2 rounded-lg hover:bg-border trans-fast">
              Explore stories
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function StoryCardCompact({ story, isSaved = false }: { story: Story, isSaved?: boolean }) {
  return (
    <a href={story.url} target="_blank" rel="noreferrer" className="block group shrink-0 w-[280px] md:w-[320px] snap-start">
      <div className="h-full flex flex-col bg-surface border border-surface-border rounded-2xl p-5 hover:border-border hover:shadow-md trans-normal active:scale-[0.98]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold tracking-widest text-interactive uppercase truncate max-w-[150px]">
            {story.category || 'News'}
          </span>
          <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 trans-fast">
            <SaveButton storyId={story.id} initialSaved={isSaved} />
          </div>
        </div>
        
        <h4 className="font-bold text-lg leading-tight text-foreground mb-3 line-clamp-3 group-hover:text-interactive trans-fast">
          {story.title}
        </h4>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 font-serif flex-1">
          {story.summary}
        </p>
        
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mt-auto pt-4 border-t border-surface-border">
          <span className="truncate max-w-[120px]">{story.source}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock size={12} /> 3m</span>
        </div>
      </div>
    </a>
  );
}
