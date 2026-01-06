
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AnimatedBackgroundStars } from '@/components/layout/AnimatedBackgroundStars';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/Header'; // Import the Header
import { AudioProvider } from '@/context/AudioContext'; // Import AudioProvider

export const metadata: Metadata = {
  title: 'Luz del Ermitaño Interior',
  description: 'Lecturas de tarot personalizadas guiadas por IA.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={cn(
        "antialiased font-sans bg-background text-foreground",
        "min-h-screen flex flex-col"
      )}>
        <AudioProvider src="/audio/mystic_background.mp3" initialVolume={0.3} loop={true}>
          <AnimatedBackgroundStars />
          <Header />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Toaster />
        </AudioProvider>
      </body>
    </html>
  );
}
