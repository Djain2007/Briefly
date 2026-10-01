'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function SyncPreferences({ userId }: { userId: string }) {
  useEffect(() => {
    const sync = async () => {
      try {
        const raw = localStorage.getItem('briefly_pending_prefs');
        if (raw) {
          const prefs = JSON.parse(raw);
          const supabase = createClient();
          
          const { error } = await supabase
            .from('user_preferences')
            .upsert({
              id: userId,
              interests: prefs.interests || [],
              briefing_length: prefs.briefing_length || 'standard',
              audio_speed: prefs.audio_speed || '1x',
              updated_at: new Date().toISOString()
            });

          if (!error) {
            localStorage.removeItem('briefly_pending_prefs');
          }
        }
      } catch (err) {
        console.error('Failed to sync preferences:', err);
      }
    };
    
    sync();
  }, [userId]);

  return null;
}
