import { createClient } from '@/lib/supabase/server';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: prefs } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="layout-page">
      <div className="layout-content pb-0 md:pb-16">
        <header className="mb-8 md:mb-16 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Settings.</h1>
          <p className="text-xl text-muted-foreground font-medium leading-relaxed">Manage your profile and preferences.</p>
        </header>

        <SettingsForm 
          userId={user.id} 
          initialProfile={profile} 
          initialPrefs={prefs} 
        />
      </div>
    </div>
  );
}
