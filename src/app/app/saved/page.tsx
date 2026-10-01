'use client';

import * as React from 'react';
import { useSavedStories } from '@/lib/hooks/useData';
import { createClient } from '@/lib/supabase/client';
import StoryCard from '@/components/StoryCard';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function SavedPage() {
  const [userId, setUserId] = React.useState<string>();
  const supabase = createClient();

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id));
  }, [supabase]);

  const { data: savedStories, isLoading } = useSavedStories(userId);

  return (
    <div className="pb-32 max-w-5xl mx-auto px-6 lg:px-10 animate-fade-in pt-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Saved for later.</h1>
        <p className="text-xl text-muted-foreground font-medium">Stories you wanted to keep.</p>
      </header>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-muted/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !savedStories || savedStories.length === 0 ? (
        <div className="py-24 text-center border-t border-border mt-8">
          <Bookmark size={48} className="mx-auto text-muted-foreground/30 mb-6" />
          <h2 className="text-2xl font-bold mb-4 tracking-tight text-foreground">Nothing saved yet.</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto leading-relaxed">
            Save stories you want to return to later.
          </p>
          <Link href="/app/explore" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5">
            Explore stories
          </Link>
        </div>
      ) : (
        <div className="space-y-8 divide-y divide-border">
          {savedStories.map((story, idx) => (
            <div key={story.id} className={idx > 0 ? "pt-8" : ""}>
              <StoryCard story={story} isSaved={true} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
