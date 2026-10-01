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

export default function OnboardingForm({ userId }: { userId?: string }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState(0); // 0 = Account, 1 = Welcome, 2 = Interests, etc.
  
  // Auth state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
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

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || password.length < 6) {
      setAuthError('Please fill all fields. Password must be at least 6 characters.');
      return;
    }
    setAuthError('');
    setStep(1);
  };

  const handleComplete = async () => {
    setLoading(true);
    
    // Save to local storage for post-confirmation sync
    localStorage.setItem('briefly_pending_prefs', JSON.stringify({
      interests: selectedInterests,
      briefing_length: briefingLength,
      audio_speed: audioSpeed
    }));

    // If userId is already present (e.g. user went to /onboarding while logged in without interests)
    if (userId) {
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
        router.push('/app');
        router.refresh();
      } else {
        alert(error.message);
      }
      return;
    }

    // Otherwise create the new account
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      }
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert(error.message);
      setStep(0); // Go back to fix email/password
    } else {
      setStep(6); // Success / Check Email step
    }
  };

  const renderHeader = (currentStep: number, total: number = 4) => (
    <header className="px-6 md:px-12 py-8 flex justify-between items-center w-full max-w-[var(--max-content-width)] mx-auto mb-4 md:mb-12">
      <div className="font-bold tracking-tighter text-lg text-foreground">BRIEFLY</div>
      <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
        {String(currentStep).padStart(2, '0')} — {String(total).padStart(2, '0')}
      </div>
    </header>
  );

  // Step 0: Registration (Account Info)
  if (step === 0 && !userId) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-up opacity-0 fill-mode-forwards">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Create account</h1>
        <p className="text-lg text-muted-foreground font-medium mb-8 max-w-md">Start building your personalized daily brief.</p>
        
        <form onSubmit={handleAccountSubmit} className="w-full max-w-md text-left space-y-6 bg-surface p-8 rounded-2xl border border-surface-border shadow-sm">
          {authError && <div className="bg-error/10 text-error p-3 rounded-lg text-sm">{authError}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium block">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-interactive trans-fast" placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-interactive trans-fast" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:ring-2 focus:ring-interactive trans-fast" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-medium hover:bg-accent/90 trans-fast active:scale-[0.98]">
            Continue
          </button>
        </form>
      </div>
    );
  } else if (step === 0 && userId) {
    // Skip if already logged in but missing preferences
    setStep(2);
  }

  // Step 1: Welcome
  if (step === 1) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-up opacity-0 fill-mode-forwards">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
          Welcome to Briefly, {name.split(' ')[0]}.
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

  // Step 2: Interests
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

  // Step 3: Briefing Length
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

  // Step 4: Audio Speed
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

  // Step 5: Review
  if (step === 5) {
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

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-surface/90 backdrop-blur-md border-t border-border z-10">
              <div className="max-w-[var(--max-content-width)] mx-auto flex flex-col sm:flex-row items-center justify-end gap-4">
                <button
                  onClick={() => setStep(4)}
                  disabled={loading}
                  className="btn-ghost w-full sm:w-auto"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="btn-primary w-full sm:w-auto shadow-lg"
                >
                  {loading ? 'Creating Account...' : (userId ? 'Save Preferences' : 'Create Account')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 6: Verify Email
  if (step === 6) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-fade-up opacity-0 fill-mode-forwards">
        <div className="w-20 h-20 bg-interactive/10 text-interactive rounded-full flex items-center justify-center mb-8 mx-auto">
          <Check size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Check your email</h1>
        <p className="text-lg text-muted-foreground font-medium mb-12 max-w-md mx-auto leading-relaxed">
          We've sent a verification link to <span className="text-foreground font-bold">{email}</span>. 
          Please click the link to confirm your account and access your dashboard.
        </p>
      </div>
    );
  }

  return null;
}
