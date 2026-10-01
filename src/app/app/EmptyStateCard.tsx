'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateBriefingAction } from '@/lib/actions/briefing';
import { Sparkles, Loader2, CheckCircle2, Circle } from 'lucide-react';

const STAGES = [
  { id: 'news', label: 'Gathering today\'s stories', duration: 3000 },
  { id: 'llm', label: 'Summarizing and structuring', duration: 8000 },
  { id: 'tts', label: 'Generating audio', duration: 5000 },
  { id: 'finalize', label: 'Finalizing your brief', duration: 2000 },
];

export default function EmptyStateCard({ isFailed, shouldAutoGenerate = false }: { isFailed: boolean, shouldAutoGenerate?: boolean }) {
  const [loading, setLoading] = useState(shouldAutoGenerate);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    setCurrentStageIndex(0);
    
    const result = await generateBriefingAction();
    
    if (result.success) {
      setCurrentStageIndex(STAGES.length);
      // Give the UI a moment to show the final checkmark, then hard reload to ensure data freshness
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      alert(`Error: ${result.error}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shouldAutoGenerate && !isFailed) {
      // Clear the query parameter so it doesn't loop on fail
      router.replace('/app');
      setTimeout(() => handleGenerate(), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAutoGenerate]);

  useEffect(() => {
    if (!loading) return;
    
    let isMounted = true;
    let currentIdx = 0;

    const advanceStage = () => {
      if (!isMounted || currentIdx >= STAGES.length - 1) return;
      const stage = STAGES[currentIdx];
      
      setTimeout(() => {
        if (!isMounted) return;
        currentIdx++;
        setCurrentStageIndex(currentIdx);
        advanceStage();
      }, stage.duration);
    };

    advanceStage();

    return () => { isMounted = false; };
  }, [loading]);

  if (loading) {
    return (
      <div className="py-16 md:py-24 text-center animate-fade-up opacity-0 fill-mode-forwards">
        <h2 className="text-3xl font-bold mb-12 text-foreground tracking-tight">Assembling your brief.</h2>
        <div className="space-y-6 max-w-xs mx-auto text-left">
          {STAGES.map((stage, index) => {
            const isCompleted = currentStageIndex > index;
            const isCurrent = currentStageIndex === index;
            
            return (
              <div key={stage.id} className={`flex items-center justify-between trans-normal ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-30'}`}>
                <span className={`text-sm ${isCurrent ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                  {stage.label}
                </span>
                <div className="shrink-0 flex justify-center">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="text-success" />
                  ) : isCurrent ? (
                    <Loader2 size={16} className="text-interactive animate-spin" />
                  ) : (
                    <Circle size={14} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mt-16 animate-pulse">
          Please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 text-center">
      <h2 className="text-3xl font-bold mb-4 tracking-tight text-foreground">
        {isFailed 
          ? 'Briefing failed.' 
          : 'Ready for today?'}
      </h2>
      <p className="text-lg text-muted-foreground mb-10 font-medium max-w-md mx-auto leading-relaxed">
        {isFailed
          ? 'We encountered an error assembling your stories. Please try again.'
          : 'Your personalized editorial summary is waiting to be generated.'}
      </p>
      <button
        onClick={handleGenerate}
        className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-base shadow-lg hover:shadow-xl"
      >
        <Sparkles size={18} />
        {isFailed ? 'Retry generation' : 'Generate today\'s brief'}
      </button>
    </div>
  );
}
