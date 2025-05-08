import type { Metadata } from 'next';
import { Cinzel_Decorative, Open_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AnimatedBackgroundStars } from '@/components/layout/AnimatedBackgroundStars';
import { cn } from '@/lib/utils';

const cinzel = Cinzel_Decorative({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

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
        `${cinzel.variable} ${openSans.variable} antialiased font-sans bg-background text-foreground`,
        "min-h-screen flex flex-col"
      )}>
        <AnimatedBackgroundStars />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
