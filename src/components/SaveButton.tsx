'use client';

import * as React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { saveStory, unsaveStory } from '@/lib/actions/stories';
import { useSWRConfig } from 'swr';

export default function SaveButton({ storyId, initialSaved }: { storyId: string, initialSaved: boolean }) {
  const [saved, setSaved] = React.useState(initialSaved);
  const [loading, setLoading] = React.useState(false);
  const { mutate } = useSWRConfig();

  // Keep state in sync if initialSaved changes from props
  React.useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    setLoading(true);
    
    const wasSaved = saved;
    setSaved(!wasSaved); // Optimistic UI
    
    try {
      const action = wasSaved ? unsaveStory : saveStory;
      const res = await action(storyId);
      
      if (!res.success) {
        setSaved(wasSaved); // Revert on failure
      } else {
        // Invalidate saved stories cache across the app
        mutate((key: any) => Array.isArray(key) && key[0] === 'saved_stories');
      }
    } catch (err) {
      console.error('Failed to save/unsave story:', err);
      setSaved(wasSaved);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 -mr-2 rounded-full trans-fast active:scale-[0.9] hover:scale-105 ${saved ? 'text-interactive bg-interactive/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
      title={saved ? "Unsave story" : "Save story"}
      aria-label={saved ? "Unsave story" : "Save story"}
    >
      {saved ? <BookmarkCheck size={18} className="animate-fade-in" /> : <Bookmark size={18} className="animate-fade-in" />}
    </button>
  );
}
