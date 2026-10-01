'use client';

import * as React from 'react';
import { useAudio } from '@/lib/contexts/AudioContext';
import { createClient } from '@/lib/supabase/client';
import { Play, Pause, RotateCcw, RotateCw, X, Maximize2, Minimize2, Volume2, FastForward } from 'lucide-react';

export function PersistentPlayer() {
  const { currentTrack, isPlaying, setIsPlaying, closePlayer } = useAudio();
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  
  const [progress, setProgress] = React.useState(0);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [speed, setSpeed] = React.useState(1);
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const supabase = createClient();

  // Fetch signed URL when track changes
  React.useEffect(() => {
    async function fetchAudio() {
      if (!currentTrack) {
        setAudioUrl(null);
        return;
      }
      if (currentTrack.audioUrl.startsWith('http')) {
        setAudioUrl(currentTrack.audioUrl);
        return;
      }
      
      const { data } = await supabase.storage
        .from('briefings')
        .createSignedUrl(currentTrack.audioUrl, 3600);
      
      if (data?.signedUrl) {
        setAudioUrl(data.signedUrl);
      }
    }
    fetchAudio();
  }, [currentTrack, supabase]);

  // Sync isPlaying with audio element
  React.useEffect(() => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.play().catch(e => {
          console.error("Audio playback failed:", e);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl, setIsPlaying]);

  // Audio event listeners
  React.useEffect(() => {
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
  }, [audioUrl, setIsPlaying]);

  if (!currentTrack) return null;

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

  return (
    <>
      {audioUrl && <audio ref={audioRef} src={audioUrl} preload="metadata" />}

      {/* MOBILE MINI PLAYER */}
      <div className={`md:hidden fixed z-50 left-2 right-2 transition-all duration-300 ease-out ${!isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`} style={{ bottom: 'calc(80px + env(safe-area-inset-bottom))' }}>
        <div 
          className="bg-surface border border-surface-border rounded-xl shadow-lg p-3 flex items-center gap-3 cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground truncate">{currentTrack.subtitle}</div>
            <div className="text-sm font-semibold text-foreground truncate">{currentTrack.title}</div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
              className="h-10 w-10 bg-foreground text-background rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 trans-fast"
            >
              {isPlaying ? <Pause size={16} className="fill-current animate-fade-in absolute" /> : <Play size={16} className="ml-1 fill-current animate-fade-in absolute" />}
            </button>
          </div>
          <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-border rounded-full overflow-hidden">
            <div className="h-full bg-foreground transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* MOBILE FULL PLAYER (BOTTOM SHEET) */}
      <div className={`md:hidden fixed inset-0 z-[60] bg-background transition-transform duration-300 ease-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => setIsExpanded(false)} className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
              <Minimize2 size={24} />
            </button>
            <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Now Playing</span>
            <div className="w-10" /> {/* Spacer */}
          </div>
          
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="w-full aspect-square bg-surface border border-surface-border rounded-2xl flex items-center justify-center mb-8 shadow-sm relative overflow-hidden">
              <div className="text-6xl font-serif text-muted font-bold opacity-50">B</div>
              {isPlaying && (
                <div className="absolute inset-0 bg-foreground/5 animate-pulse" />
              )}
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">{currentTrack.title}</h2>
              <p className="text-muted-foreground font-medium">{currentTrack.subtitle}</p>
            </div>
            
            <div className="space-y-6">
              <div className="group relative flex items-center cursor-pointer h-6">
                <input 
                  type="range" min="0" max="100" value={progress} onChange={seek}
                  className="absolute w-full opacity-0 cursor-pointer h-full z-10"
                />
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-foreground relative trans-fast" style={{ width: `${progress}%` }} />
                </div>
              </div>
              
              <div className="flex justify-between text-xs font-medium text-muted-foreground tabular-nums">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(duration - currentTime)}</span>
              </div>
              
              <div className="flex items-center justify-center gap-8 pt-4">
                <button onClick={() => skip(-15)} className="text-muted-foreground hover:text-foreground trans-fast active:scale-95"><RotateCcw size={24} /></button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-16 w-16 bg-foreground text-background rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 trans-fast shadow-md relative overflow-hidden"
                >
                  {isPlaying ? <Pause size={28} className="fill-current animate-fade-in absolute" /> : <Play size={28} className="ml-1 fill-current animate-fade-in absolute" />}
                </button>
                <button onClick={() => skip(15)} className="text-muted-foreground hover:text-foreground trans-fast active:scale-95"><RotateCw size={24} /></button>
              </div>
              
              <div className="flex justify-center pt-8">
                <button onClick={cycleSpeed} className="text-xs font-bold tracking-wider text-muted-foreground hover:text-foreground bg-muted px-4 py-2 rounded-full trans-fast flex items-center gap-2">
                  <FastForward size={14} /> {speed}x
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP FIXED PLAYER */}
      <div className={`hidden md:flex fixed bottom-0 md:left-[var(--sidebar-width)] right-0 bg-surface/95 backdrop-blur-md border-t border-border z-50 transition-all duration-300 ease-out translate-y-0 opacity-100`}>
        <div className="max-w-[var(--max-content-width)] mx-auto w-full px-6 py-4 flex items-center gap-8">
          
          {/* Info */}
          <div className="flex-[1] min-w-0 flex items-center gap-4">
            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center shrink-0 relative overflow-hidden">
               <span className="font-serif font-bold text-muted-foreground">B</span>
               {isPlaying && <div className="absolute inset-0 bg-foreground/10 animate-pulse" />}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground truncate">{currentTrack.subtitle}</div>
              <div className="text-sm font-semibold text-foreground truncate">{currentTrack.title}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex-[2] flex flex-col items-center gap-2 max-w-md">
            <div className="flex items-center gap-6">
              <button onClick={() => skip(-15)} className="text-muted-foreground hover:text-foreground trans-fast active:scale-95"><RotateCcw size={18} /></button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="h-10 w-10 bg-foreground text-background rounded-full flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 trans-fast shadow-md relative overflow-hidden"
              >
                {isPlaying ? <Pause size={18} className="fill-current animate-fade-in absolute" /> : <Play size={18} className="ml-1 fill-current animate-fade-in absolute" />}
              </button>
              <button onClick={() => skip(15)} className="text-muted-foreground hover:text-foreground trans-fast active:scale-95"><RotateCw size={18} /></button>
            </div>
            
            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-medium text-muted-foreground tabular-nums w-8 text-right">{formatTime(currentTime)}</span>
              <div className="group relative flex-1 flex items-center cursor-pointer h-4">
                <input type="range" min="0" max="100" value={progress} onChange={seek} className="absolute w-full opacity-0 cursor-pointer h-full z-10" />
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-foreground relative trans-fast" style={{ width: `${progress}%` }} />
                </div>
                <div className="absolute h-3 w-3 bg-foreground rounded-full shadow-sm opacity-0 group-hover:opacity-100 trans-fast pointer-events-none" style={{ left: `calc(${progress}% - 6px)` }} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground tabular-nums w-8">-{formatTime(duration - currentTime)}</span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex-[1] flex justify-end items-center gap-4">
            <button onClick={cycleSpeed} className="text-[11px] font-bold tracking-wider text-muted-foreground hover:text-foreground bg-muted px-2 py-1 rounded-md trans-fast w-10 text-center">
              {speed}x
            </button>
            <button onClick={closePlayer} className="text-muted-foreground hover:text-foreground p-1 rounded-full trans-fast" title="Close player">
              <X size={18} />
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
