'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { UserProfile, UserPreferences } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';

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

export default function SettingsForm({ userId, initialProfile, initialPrefs }: { userId: string, initialProfile: UserProfile, initialPrefs: UserPreferences }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [name, setName] = useState(initialProfile?.name || '');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialPrefs?.interests || []);
  const [briefingLength, setBriefingLength] = useState<'quick' | 'standard' | 'deep'>(initialPrefs?.briefing_length || 'standard');
  const [audioSpeed, setAudioSpeed] = useState<string>(initialPrefs?.audio_speed || '1x');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(c => c !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = async () => {
    if (selectedInterests.length < 3) return;
    
    setLoading(true);
    setSuccessMsg('');
    
    // Update profile
    await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId);

    // Update prefs
    const { error } = await supabase
      .from('user_preferences')
      .update({
        interests: selectedInterests,
        briefing_length: briefingLength,
        audio_speed: audioSpeed,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    setLoading(false);

    if (!error) {
      setSuccessMsg('Settings saved successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
      router.refresh();
    } else {
      console.error(error);
    }
  };

  return (
    <div className="pb-32 max-w-5xl mx-auto space-y-16">
      
      {/* Profile Section */}
      <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-16 items-start border-t border-border pt-8 md:pt-12 animate-fade-up opacity-0 fill-mode-forwards">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Profile</h2>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Update your personal details.</p>
        </div>
        <div className="space-y-6 max-w-md">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Email</label>
            <input
              id="email"
              type="email"
              readOnly
              value={initialProfile?.email || ''}
              className="w-full px-4 py-3 rounded-lg border border-border bg-muted/50 text-muted-foreground focus:outline-none cursor-not-allowed font-medium"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:outline-none focus:border-interactive focus:ring-1 focus:ring-interactive trans-fast font-medium"
            />
          </div>
        </div>
      </section>

      {/* Interests Section */}
      <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-16 items-start border-t border-border pt-8 md:pt-12 animate-fade-up opacity-0 fill-mode-forwards" style={{ animationDelay: '100ms' }}>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Interests</h2>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Select at least 3 topics for your daily brief.</p>
          {selectedInterests.length < 3 && (
            <p className="text-xs text-error mt-4 font-semibold">Please select at least 3 interests.</p>
          )}
        </div>
        <div className="space-y-10">
          {INTEREST_GROUPS.map(group => (
            <div key={group.name}>
              <h3 className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-4">{group.name}</h3>
              <div className="flex flex-wrap gap-3">
                {group.items.map(interest => {
                  const isSelected = selectedInterests.includes(interest);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-lg border text-sm font-semibold trans-fast flex items-center gap-2 ${
                        isSelected 
                          ? 'border-interactive bg-interactive/5 text-interactive shadow-sm' 
                          : 'border-surface-border bg-surface text-muted-foreground hover:border-border hover:text-foreground'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 trans-fast ${
                          isSelected ? 'border-interactive bg-interactive text-white' : 'border-muted-foreground/30'
                        }`}>
                          {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Preferences Section */}
      <section className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 md:gap-16 items-start border-t border-border pt-8 md:pt-12 animate-fade-up opacity-0 fill-mode-forwards" style={{ animationDelay: '200ms' }}>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground mt-2 font-medium">Customize your briefing format.</p>
        </div>
        <div className="space-y-12">
          
          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Briefing Length</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'quick', title: 'QUICK' },
                { id: 'standard', title: 'STANDARD' },
                { id: 'deep', title: 'DEEP' }
              ].map(option => (
                <button
                  key={option.id}
                  onClick={() => setBriefingLength(option.id as 'quick' | 'standard' | 'deep')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left trans-fast ${
                    briefingLength === option.id
                      ? 'border-interactive bg-interactive/5 text-interactive shadow-sm'
                      : 'border-surface-border bg-surface hover:border-border text-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    briefingLength === option.id ? 'border-interactive bg-interactive text-white' : 'border-muted-foreground/30'
                  }`}>
                    {briefingLength === option.id && <Check size={10} strokeWidth={3} />}
                  </div>
                  <div className="font-bold tracking-widest text-xs">{option.title}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Audio Speed</h3>
            <div className="flex flex-wrap gap-4">
              {['1x', '1.25x', '1.5x', '2x'].map(speed => (
                <button
                  key={speed}
                  onClick={() => setAudioSpeed(speed)}
                  className={`w-16 h-12 rounded-xl border flex items-center justify-center trans-fast font-bold ${
                    audioSpeed === speed
                      ? 'border-interactive bg-interactive/5 text-interactive shadow-sm'
                      : 'border-surface-border bg-surface hover:border-border text-foreground'
                  }`}
                >
                  {speed}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Theme</h3>
            <div className="flex">
              <ThemeToggle />
            </div>
          </div>

        </div>
      </section>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 md:left-[var(--sidebar-width)] right-0 p-6 bg-surface/90 backdrop-blur-md border-t border-border z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <form action={logout}>
            <button type="submit" className="text-sm font-bold tracking-wide text-error hover:text-error/80 trans-fast flex items-center gap-2">
              Logout
            </button>
          </form>
          
          <div className="flex items-center gap-4">
            {successMsg && <span className="text-sm font-bold text-success animate-fade-in">{successMsg}</span>}
            <button
              onClick={handleSave}
              disabled={loading || selectedInterests.length < 3}
              className="btn-primary shadow-lg"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
