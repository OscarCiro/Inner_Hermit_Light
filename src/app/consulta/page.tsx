"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import PageWrapper from '@/components/layout/PageWrapper';
import ConsultationForm from './ConsultationForm';
import { Loader2 } from 'lucide-react';

export default function ConsultationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <PageWrapper className="justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Verificando tu acceso...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!user && !loading) {
    // This state should ideally not be reached for long due to the redirect.
    // It acts as a fallback or if the redirect is slow.
    return (
       <PageWrapper className="justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Redirigiendo...</p>
        </div>
      </PageWrapper>
    );
  }
  
  // Only render content if user is loaded and authenticated
  if (user && !loading) {
    return (
      <PageWrapper>
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            Invocación
          </h1>
          <p className="text-lg text-foreground/90 leading-relaxed">
            Detente un instante. Respira profundamente.
          </p>
          <p className="text-lg text-foreground/80 leading-relaxed mt-2">
            Conecta con la pregunta que late en tu corazón o permite que la sabiduría ancestral te guíe libremente.
          </p>
        </header>

        <ConsultationForm />

        <div className="mt-12 border-t border-primary/20 pt-6">
          <p className="text-sm text-muted-foreground">
            La claridad emerge cuando aquietamos la mente y escuchamos la voz interior.
          </p>
        </div>
      </PageWrapper>
    );
  }

  // Fallback for any other state, though ideally covered above.
  return null;
}
