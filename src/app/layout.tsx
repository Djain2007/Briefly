import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Briefly | Your day. Your news. One brief.',
  description: 'Briefly turns the important news of the day into a concise personalized briefing that users can read or listen to.',
};

import { ThemeProvider } from '@/components/ThemeProvider';
import { AudioProvider } from '@/lib/contexts/AudioContext';
import { PersistentPlayer } from '@/components/audio/PersistentPlayer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AudioProvider>
            {children}
            <PersistentPlayer />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
