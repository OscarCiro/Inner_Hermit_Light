
"use client";

import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/layout/PageWrapper';
import { HermitIllustration } from '@/components/tarot/HermitIllustration';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleStartReading = () => {
    if (authLoading) {
      return; // Do nothing if auth state is still loading
    }
    if (user) {
      router.push('/consulta');
    } else {
      router.push('/auth');
    }
  };

  return (
    <PageWrapper className="justify-center">
      <header className="mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
          Luz del Ermitaño Interior
        </h1>
        <p className="text-xl text-foreground/90">
          Un refugio de sabiduría ancestral te aguarda.
        </p>
      </header>

      <HermitIllustration />

      <section className="my-8">
        <p className="text-lg mb-3 leading-relaxed text-foreground/80">
          Soy el Ermitaño, tu guía en el sendero de la introspección.
        </p>
        <p className="text-lg mb-6 leading-relaxed text-foreground/80">
          Aquí, entre susurros de estrellas y ecos del alma, desvelaremos juntos los mensajes que el Tarot tiene para ti.
        </p>
      </section>

      <Button 
        size="lg" 
        className="text-lg shadow-lg hover:shadow-primary/50 transition-shadow duration-300"
        onClick={handleStartReading}
        disabled={authLoading}
      >
        {authLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-5 w-5" />
        )}
        {authLoading ? "Verificando..." : "Iniciar Lectura"}
      </Button>
    </PageWrapper>
  );
}
