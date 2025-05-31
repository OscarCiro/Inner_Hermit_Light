import type { Metadata } from 'next';
// Removed Cinzel_Decorative and Open_Sans imports
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AnimatedBackgroundStars } from '@/components/layout/AnimatedBackgroundStars';
import { cn } from '@/lib/utils';

// Removed cinzel and openSans constant declarations

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
        // Removed font variables, relying on Tailwind's font-sans and font-serif classes
        "antialiased font-sans bg-background text-foreground",
        "min-h-screen flex flex-col"
      )}>
        <AnimatedBackgroundStars />
        {/* Removed AnimatedSoundscape component */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
