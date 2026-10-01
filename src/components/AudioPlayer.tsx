'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';

export default function AudioPlayer({ audioPath }: { audioPath: string }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchAudio() {
      // Create a signed URL valid for 1 hour
      const { data, error } = await supabase.storage
        .from('briefings')
        .createSignedUrl(audioPath, 3600);
      
      if (data?.signedUrl) {
        setAudioUrl(data.signedUrl);
      } else {
        console.error('Error fetching audio:', error);
      }
    }
    fetchAudio();
  }, [audioPath, supabase]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const cycleSpeed = () => {
    if (!audioRef.current) return;
    const nextSpeed = speed === 1 ? 1.25 : speed === 1.25 ? 1.5 : speed === 1.5 ? 2 : 1;
    audioRef.current.playbackRate = nextSpeed;
    setSpeed(nextSpeed);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = (Number(e.target.value) / 100) * (audioRef.current.duration || 1);
    audioRef.current.currentTime = time;
    setProgress(Number(e.target.value));
  };

  const skip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) {
    return (
      <div className="max-w-[var(--max-content-width)] mx-auto px-6 py-4 flex items-center gap-4 opacity-50 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted w-32 rounded animate-pulse"></div>
          <div className="h-1.5 bg-muted w-full rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[var(--max-content-width)] mx-auto px-4 md:px-6 py-3 md:py-4">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-8">
        
        {/* Controls (Desktop Left, Mobile Top) */}
        <div className="flex items-center justify-between w-full md:w-auto md:justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-sm text-foreground flex items-center gap-2">
              Briefly
              {isPlaying && (
                <div className="flex items-end gap-[2px] h-3">
                  <div className="w-[2px] bg-interactive rounded-full animate-pulse h-full" style={{ animationDuration: '0.8s' }} />
                  <div className="w-[2px] bg-interactive rounded-full animate-pulse h-2/3" style={{ animationDuration: '1.2s' }} />
                  <div className="w-[2px] bg-interactive rounded-full animate-pulse h-4/5" style={{ animationDuration: '1s' }} />
                </div>
              )}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => skip(-15)} className="text-muted-foreground hover:text-foreground trans-fast active:scale-[0.9]" aria-label="Rewind 15 seconds">
              <RotateCcw size={18} />
            </button>
            
            <button 
              onClick={togglePlay}
              className="h-10 w-10 md:h-12 md:w-12 bg-foreground text-background rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 trans-fast shadow-md overflow-hidden relative"
            >
              {isPlaying ? <Pause size={18} className="fill-current animate-fade-in absolute" /> : <Play size={18} className="ml-1 fill-current animate-fade-in absolute" />}
            </button>
            
            <button onClick={() => skip(15)} className="text-muted-foreground hover:text-foreground trans-fast active:scale-[0.9]" aria-label="Skip 15 seconds">
              <RotateCw size={18} />
            </button>
          </div>
        </div>

        {/* Progress Bar (Fills remaining space) */}
        <div className="flex-1 w-full flex items-center gap-4">
          <span className="text-[11px] font-medium text-muted-foreground tabular-nums w-8 text-right">
            {formatTime(currentTime)}
          </span>
          
          <div className="group relative flex-1 flex items-center cursor-pointer h-6">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={progress} 
              onChange={seek}
              className="absolute w-full opacity-0 cursor-pointer h-full z-10"
            />
            <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
              <div 
                className="h-full bg-foreground relative trans-fast"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Hover thumb */}
            <div 
              className="absolute h-3 w-3 bg-foreground rounded-full shadow-sm opacity-0 group-hover:opacity-100 trans-fast pointer-events-none"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
          
          <span className="text-[11px] font-medium text-muted-foreground tabular-nums w-8">
            -{formatTime(duration - currentTime)}
          </span>

          <button onClick={cycleSpeed} className="text-[11px] font-bold tracking-wider text-muted-foreground hover:text-foreground bg-muted px-2 py-1 rounded-md trans-fast ml-2">
            {speed}x
          </button>
        </div>

      </div>
    </div>
  );
}
