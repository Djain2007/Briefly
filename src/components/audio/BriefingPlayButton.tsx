'use client';

import * as React from 'react';
import { useAudio, Track } from '@/lib/contexts/AudioContext';
import { Play, Pause } from 'lucide-react';

export function BriefingPlayButton({ track }: { track: Track }) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudio();
  const isCurrentTrack = currentTrack?.id === track.id;

  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="h-10 w-10 md:h-12 md:w-12 bg-foreground text-background rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 trans-fast shadow-md relative overflow-hidden"
    >
      {isCurrentTrack && isPlaying ? (
        <Pause size={18} className="fill-current animate-fade-in absolute" />
      ) : (
        <Play size={18} className="ml-1 fill-current animate-fade-in absolute" />
      )}
    </button>
  );
}
