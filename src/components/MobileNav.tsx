'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Library, PlaySquare } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const links = [
    { href: '/app', label: 'Home', icon: Home },
    { href: '/app/explore', label: 'Explore', icon: Compass },
    { href: '/app/library', label: 'Library', icon: Library },
    { href: '/app/recent', label: 'Recent', icon: PlaySquare },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-surface-border flex items-center justify-around z-40 px-2 pb-safe">
      {links.map(link => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl trans-fast active:scale-95 ${
              isActive 
                ? 'text-foreground' 
                : 'text-muted-foreground'
            }`}
          >
            <div className={`mb-1 trans-normal ${isActive ? '-translate-y-0.5' : ''}`}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
