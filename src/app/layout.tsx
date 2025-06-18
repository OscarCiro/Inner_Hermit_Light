
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AnimatedBackgroundStars } from '@/components/layout/AnimatedBackgroundStars';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header'; // Import the Header
import BackgroundAudioPlayer from '@/components/layout/BackgroundAudioPlayer'; // Import BackgroundAudioPlayer

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
        <AuthProvider>
          <AnimatedBackgroundStars />
          <BackgroundAudioPlayer /> {/* Add BackgroundAudioPlayer here */}
          <Header /> {/* Add the Header here */}
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
