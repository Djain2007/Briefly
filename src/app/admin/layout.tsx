import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, Activity, FileText, Settings, ShieldAlert, LogOut, ExternalLink } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Audit Logs', href: '/admin/logs', icon: ShieldAlert },
  { name: 'System Errors', href: '/admin/errors', icon: Activity },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const role = user.user_metadata?.role;
  if (role !== 'admin' && role !== 'super_admin') {
    redirect('/app');
  }

  return (
    <div className="h-[100dvh] bg-background flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Admin Sidebar */}
      <div className="hidden md:flex flex-col w-[260px] shrink-0 border-r border-border h-full bg-surface z-40">
        <div className="h-16 px-6 flex items-center border-b border-border">
          <Link href="/admin" className="font-bold tracking-tighter text-lg text-foreground">
            BRIEFLY <span className="text-interactive font-medium">ADMIN</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 flex flex-col gap-8">
          <nav className="px-3 space-y-1">
            <div className="px-3 text-xs font-bold tracking-widest text-muted-foreground uppercase mb-3">
              Overview
            </div>
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-border trans-fast"
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border space-y-2">
          <Link href="/app" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface-border trans-fast">
            <ExternalLink size={18} />
            Return to Briefly
          </Link>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-interactive/20 flex items-center justify-center text-interactive text-xs font-bold uppercase">
              {user.email?.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs truncate">{user.email}</div>
              <div className="text-[10px] uppercase text-interactive font-bold">{role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        <header className="h-16 border-b border-border flex items-center justify-end px-6 bg-surface/50 backdrop-blur-sm">
          <ThemeToggle />
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
