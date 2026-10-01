import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OnboardingForm from './OnboardingForm';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if they already have interests set up (more than 0)
  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('interests')
    .eq('id', user.id)
    .single();

  if (prefs && prefs.interests && prefs.interests.length > 0) {
    // Already onboarded
    redirect('/app');
  }

  return (
    <main className="min-h-[100dvh] bg-background flex flex-col">
      <OnboardingForm userId={user.id} />
    </main>
  );
}
