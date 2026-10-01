'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Check, Search } from 'lucide-react';

const INTEREST_GROUPS = [
  {
    name: 'Tech',
    items: ['Artificial Intelligence', 'Machine Learning', 'Cybersecurity', 'Software', 'Cloud', 'Robotics', 'Semiconductors', 'Gadgets', 'Space']
  },
  {
    name: 'Business',
    items: ['Business', 'Markets', 'Finance', 'Economy', 'Startups', 'Entrepreneurship', 'Banking', 'Fintech', 'Cryptocurrency']
  },
  {
    name: 'World',
    items: ['World', 'India', 'Asia', 'Europe', 'Americas', 'Middle East', 'Africa']
  },
  {
    name: 'Science & Lifestyle',
    items: ['Science', 'Climate', 'Environment', 'Energy', 'Culture', 'Entertainment', 'Travel', 'Education', 'Lifestyle']
  },
  {
    name: 'Sports',
    items: ['Football', 'Cricket', 'Tennis', 'Basketball', 'Formula 1', 'Sports']
  }
];

export default function OnboardingForm({ userId }: { userId: string }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [briefingLength, setBriefingLength] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [audioSpeed, setAudioSpeed] = useState('1x');
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async (generateNow: boolean) => {
    if (selectedInterests.length < 3) return;
    
    setLoading(true);
    
    const { error } = await supabase
      .from('user_preferences')
      .upsert({
        id: userId,
        interests: selectedInterests,
        briefing_length: briefingLength,
        audio_speed: audioSpeed,
        updated_at: new Date().toISOString()
      });

    setLoading(false);

    if (!error) {
      if (generateNow) {
        // Just push to /app, let the user click generate or we can auto trigger later, but standard is to push.
        // Wait, the prompt says "take them to the empty Today state" if they skip.
        // If they click generate, we should maybe pass a query param ?generate=true
        router.push(generateNow ? '/app?generate=true' : '/app');
      } else {
        router.push('/app');
      }
      router.refresh();
    } else {
      console.error(error);
    }
  };

  const renderHeader = (currentStep: number) => (
    <header className="px-6 md:px-12 py-8 flex justify-between items-center w-full max-w-[var(--max-content-width)] mx-auto mb-4 md:mb-12">
      <div className="font-bold tracking-tighter text-lg text-foreground">BRIEFLY</div>
      <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
        {String(currentStep).padStart(2, '0')} — 04
      </div>
    </header>
  );

  if (step === 1) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-up opacity-0 fill-mode-forwards">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Welcome to Briefly.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium mb-12 max-w-lg leading-relaxed">
          Let's build a daily briefing around what matters to you.
        </p>
        <button
          onClick={() => setStep(2)}
          className="btn-primary text-lg px-12 py-4 shadow-lg hover:shadow-xl trans-slow"
        >
          Begin
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="flex-1 flex flex-col">
        {renderHeader(1)}
        <div className="flex-1 layout-content animate-slide-right opacity-0 fill-mode-forwards pb-32">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Your Interests</h1>
            <p className="text-lg text-muted-foreground font-medium">Choose at least 3 topics you want Briefly to prioritize.</p>
          </div>

          <div className="space-y-16">
            {INTEREST_GROUPS.map(group => (
              <div key={group.name}>
                <h3 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-6 border-b border-border pb-2">
                  {group.name}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {group.items.map(item => {
                    const isSelected = selectedInterests.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => toggleInterest(item)}
                        className={`group flex items-center justify-between p-4 border rounded-xl trans-fast text-left ${
                          isSelected 
                            ? 'border-interactive bg-interactive/5 shadow-sm' 
                            : 'border-surface-border bg-surface hover:border-border'
                        }`}
                      >
                        <span className={`font-semibold text-sm ${isSelected ? 'text-interactive' : 'text-foreground group-hover:text-interactive'}`}>
                          {item}
                        </span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center trans-fast ${
                          isSelected ? 'border-interactive bg-interactive text-white' : 'border-border'
                        }`}>
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface/90 backdrop-blur-md border-t border-border z-10">
            <div className="max-w-[var(--max-content-width)] mx-auto flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">
                {selectedInterests.length} selected
              </span>
              <button
                onClick={() => setStep(3)}
                disabled={selectedInterests.length < 3}
                className="btn-primary shadow-md"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="flex-1 flex flex-col">
        {renderHeader(2)}
        <div className="flex-1 layout-content animate-slide-right opacity-0 fill-mode-forwards pb-32">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Briefing Length</h1>
            <p className="text-lg text-muted-foreground font-medium">Select your preferred depth.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: 'quick', title: 'QUICK', desc: 'A fast, high-level overview of essential stories.' },
              { id: 'standard', title: 'STANDARD', desc: 'A balanced and comprehensive daily summary.' },
              { id: 'deep', title: 'DEEP', desc: 'A thorough dive with extended context.' }
            ].map(option => (
              <button
                key={option.id}
                onClick={() => setBriefingLength(option.id as 'quick' | 'standard' | 'deep')}
                className={`w-full flex items-center gap-6 p-6 md:p-8 rounded-2xl border text-left trans-fast ${
                  briefingLength === option.id
                    ? 'border-interactive bg-interactive/5 shadow-sm'
                    : 'border-surface-border bg-surface hover:border-border'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 trans-fast ${
                  briefingLength === option.id ? 'border-interactive bg-interactive text-white' : 'border-border'
                }`}>
                  {briefingLength === option.id && <Check size={14} strokeWidth={3} />}
                </div>
                <div>
                  <div className={`font-bold tracking-widest text-sm mb-2 ${briefingLength === option.id ? 'text-interactive' : 'text-foreground'}`}>
                    {option.title}
                  </div>
                  <div className="text-base text-muted-foreground font-medium">{option.desc}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface/90 backdrop-blur-md border-t border-border z-10">
            <div className="max-w-[var(--max-content-width)] mx-auto flex items-center justify-between">
              <button onClick={() => setStep(2)} className="btn-ghost">Back</button>
              <button onClick={() => setStep(4)} className="btn-primary shadow-md">Continue</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="flex-1 flex flex-col">
        {renderHeader(3)}
        <div className="flex-1 layout-content animate-slide-right opacity-0 fill-mode-forwards pb-32">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Audio Speed</h1>
            <p className="text-lg text-muted-foreground font-medium">Set your default playback speed.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['1x', '1.25x', '1.5x', '2x'].map(speed => (
              <button
                key={speed}
                onClick={() => setAudioSpeed(speed)}
                className={`p-8 rounded-2xl border text-center trans-fast ${
                  audioSpeed === speed
                    ? 'border-interactive bg-interactive/5 text-interactive shadow-sm'
                    : 'border-surface-border bg-surface hover:border-border text-foreground'
                }`}
              >
                <span className="text-3xl font-bold">{speed}</span>
              </button>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface/90 backdrop-blur-md border-t border-border z-10">
            <div className="max-w-[var(--max-content-width)] mx-auto flex items-center justify-between">
              <button onClick={() => setStep(3)} className="btn-ghost">Back</button>
              <button onClick={() => setStep(5)} className="btn-primary shadow-md">Continue</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {renderHeader(4)}
      <div className="flex-1 layout-content animate-slide-right opacity-0 fill-mode-forwards pb-32">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">All Set.</h1>
          <p className="text-lg text-muted-foreground font-medium">Review your choices before we begin.</p>
        </div>
        
        <div className="space-y-12">
          <section>
            <h3 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-6 border-b border-border pb-2">Selected Interests</h3>
            <div className="flex flex-wrap gap-3">
              {selectedInterests.map(interest => (
                <span key={interest} className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-sm font-semibold text-foreground">
                  {interest}
                </span>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-6 border-b border-border pb-2">Length</h3>
              <p className="text-2xl font-bold capitalize text-foreground">{briefingLength}</p>
            </section>
            <section>
              <h3 className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-6 border-b border-border pb-2">Speed</h3>
              <p className="text-2xl font-bold text-foreground">{audioSpeed}</p>
            </section>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface/90 backdrop-blur-md border-t border-border z-10">
          <div className="max-w-[var(--max-content-width)] mx-auto flex flex-col sm:flex-row items-center justify-end gap-4">
            <button
              onClick={() => handleComplete(false)}
              disabled={loading}
              className="btn-ghost w-full sm:w-auto"
            >
              Skip generation
            </button>
            <button
              onClick={() => handleComplete(true)}
              disabled={loading}
              className="btn-primary w-full sm:w-auto shadow-lg"
            >
              {loading ? 'Generating...' : 'Generate First Briefing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
