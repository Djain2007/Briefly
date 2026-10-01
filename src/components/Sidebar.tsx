'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Library, History, Bookmark, PlaySquare, Settings, LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { UserProfile } from '@/types';

export default function Sidebar({ user }: { user: UserProfile }) {
  const pathname = usePathname();

  const mainLinks = [
    { href: '/app', label: 'Home', icon: Home },
    { href: '/app/explore', label: 'Explore', icon: Compass },
    { href: '/app/library', label: 'Library', icon: Library },
    { href: '/app/history', label: 'History', icon: History },
  ];

  const libraryLinks = [
    { href: '/app/saved', label: 'Saved', icon: Bookmark },
    { href: '/app/recent', label: 'Recently Played', icon: PlaySquare },
  ];

  return (
    <div className="h-full flex flex-col py-8 px-6 bg-surface">
      <div className="mb-10">
        <Link href="/app" className="font-bold text-xl tracking-tighter">BRIEFLY</Link>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar -mx-2 px-2 pb-6">
        <nav className="space-y-1 mb-8">
          {mainLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group flex items-center gap-4 px-3 py-2.5 rounded-lg trans-fast ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-foreground' : 'group-hover:text-foreground'} />
                <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-semibold'}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mb-8">
          <h4 className="px-3 text-xs font-bold tracking-widest uppercase text-muted-foreground/70 mb-2">Your Library</h4>
          <nav className="space-y-1">
            {libraryLinks.map(link => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center gap-4 px-3 py-2.5 rounded-lg trans-fast ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-foreground' : 'group-hover:text-foreground'} />
                  <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-semibold'}`}>
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-border/50">
        <nav className="space-y-1 mb-6">
          <Link
            href="/app/settings"
            className={`group flex items-center gap-4 px-3 py-2.5 rounded-lg trans-fast ${pathname === '/app/settings' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
          >
            <Settings size={20} strokeWidth={pathname === '/app/settings' ? 2.5 : 2} />
            <span className={`text-sm tracking-wide ${pathname === '/app/settings' ? 'font-bold' : 'font-semibold'}`}>
              Settings
            </span>
          </Link>
        </nav>
        
        <div className="px-3 flex items-center justify-between">
          <div className="overflow-hidden">
            <div className="text-sm font-bold truncate text-foreground">{user?.name || 'User'}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground truncate">Free Plan</div>
          </div>
          <form action={logout}>
            <button type="submit" className="p-2 text-muted-foreground hover:text-foreground bg-muted hover:bg-border rounded-full trans-fast" title="Logout">
              <LogOut size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Support CSS for hiding scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
