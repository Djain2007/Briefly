import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import MobileHeader from '@/components/MobileHeader';
import MobileNav from '@/components/MobileNav';
import { SyncPreferences } from '@/components/SyncPreferences';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="h-[100dvh] bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden shrink-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <MobileHeader user={profile} />
      </div>

      {/* Desktop Sidebar (Fixed & Non-scrolling) */}
      <div className="hidden md:flex flex-col w-[var(--sidebar-width)] shrink-0 border-r border-border h-full bg-surface z-40">
        <Sidebar user={profile} role={user.user_metadata?.role} />
      </div>

      {/* Main Content (Independently Scrollable) */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative h-full bg-background pb-24 md:pb-32">
        {children}
      </main>

      {/* Mobile Navigation Bottom Bar */}
      <MobileNav />
      <SyncPreferences userId={user.id} />
    </div>
  );
}
