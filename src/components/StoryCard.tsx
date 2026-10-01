'use client';

import { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { saveStory, unsaveStory } from '@/lib/actions/stories';
import { Story } from '@/types';

export default function StoryCard({ story, isSaved = false, index }: { story: Story, isSaved?: boolean, index?: number }) {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [loading, setLoading] = useState(false);
  
  const timeAgo = story.published_at 
    ? formatDistanceToNow(new Date(story.published_at), { addSuffix: true }) 
    : '';

  const handleToggleSave = async () => {
    if (loading) return;
    setLoading(true);
    const wasSaved = saved;
    setSaved(!wasSaved); // Optimistic update
    
    const action = wasSaved ? unsaveStory : saveStory;
    const res = await action(story.id);
    
    if (!res.success) {
      setSaved(wasSaved); // Revert on failure
    }
    setLoading(false);
  };

  const formattedIndex = index ? String(index).padStart(2, '0') : '';

  return (
    <article className="group relative trans-normal">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Index / Category Sidebar */}
        <div className="md:w-32 shrink-0">
          <div className="flex items-center md:items-start md:flex-col gap-3 md:gap-1">
            {formattedIndex && (
              <span className="text-xl font-light text-muted-foreground/60 tracking-tighter">
                {formattedIndex}
              </span>
            )}
            {story.category && (
              <span className="text-[10px] font-bold tracking-[0.15em] text-interactive uppercase">
                {story.category}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-3 leading-snug tracking-tight text-foreground group-hover:text-interactive trans-fast">
            {story.title}
          </h3>
          
          <p className="text-lg text-muted-foreground leading-relaxed mb-5 font-serif">
            {story.summary}
          </p>

          {expanded && story.entities && story.entities.length > 0 && (
            <div className="mb-6 animate-fade-down opacity-0 fill-mode-forwards">
              <h4 className="text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">Key Entities</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                {story.entities.map((point: string, i: number) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-interactive mt-1 text-[10px]">■</span>
                    <span className="font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="text-foreground">{story.source}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo || 'Recently'}</span>
            </div>

            <div className="flex items-center gap-4">
              {story.entities && story.entities.length > 0 && (
                <button 
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-muted-foreground hover:text-foreground trans-fast"
                >
                  {expanded ? 'Less' : 'More'} {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
              
              <a 
                href={story.url} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 text-muted-foreground hover:text-foreground trans-fast"
                title="Read original source"
              >
                Read <ExternalLink size={14} />
              </a>

              <button 
                onClick={handleToggleSave}
                disabled={loading}
                className={`p-1.5 rounded-full trans-fast active:scale-[0.9] hover:scale-105 ${saved ? 'text-interactive bg-interactive/10' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
                title={saved ? "Unsave story" : "Save story"}
              >
                {saved ? <BookmarkCheck size={18} className="animate-fade-in" /> : <Bookmark size={18} className="animate-fade-in" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
