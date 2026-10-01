'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />;
  }

  return (
    <div className="flex items-center bg-surface border border-surface-border rounded-full p-1 relative">
      <button
        onClick={() => setTheme('light')}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors relative z-10 ${
          theme === 'light' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Light Mode"
        aria-label="Light Mode"
      >
        <Sun size={14} strokeWidth={2} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors relative z-10 ${
          theme === 'system' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        title="System Preference"
        aria-label="System Preference"
      >
        <Monitor size={14} strokeWidth={2} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors relative z-10 ${
          theme === 'dark' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
        title="Dark Mode"
        aria-label="Dark Mode"
      >
        <Moon size={14} strokeWidth={2} />
      </button>

      {/* Active Indicator Background */}
      <div 
        className="absolute top-1 bottom-1 w-8 bg-muted rounded-full transition-transform duration-200 ease-out pointer-events-none"
        style={{
          transform: `translateX(${
            theme === 'light' ? '0' : theme === 'system' ? '32px' : '64px'
          })`
        }}
      />
    </div>
  );
}
