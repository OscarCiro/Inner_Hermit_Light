
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/layout/PageWrapper';
import { useToast } from "@/hooks/use-toast";
import { Save, Share2, Repeat, Home, AlertTriangle, UserX } from 'lucide-react';
import type { InterpretTarotReadingOutput } from '@/ai/flows/interpret-tarot-reading';
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getTarotCardImagePathAndAiHint } from '@/lib/tarot-card-mapper';
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const IntegrationClient: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
  const [currentReading, setCurrentReading] = useState<InterpretTarotReadingOutput | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [currentAudioUri, setCurrentAudioUri] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    try {
      const storedReading = localStorage.getItem('currentTarotReading');
      const storedQuery = localStorage.getItem('currentTarotQuery');
      const storedAudio = localStorage.getItem('currentTarotAudio');

      if (storedReading) {
        setCurrentReading(JSON.parse(storedReading));
      }
      if (storedQuery) {
        setCurrentQuery(storedQuery);
      }
      if (storedAudio) {
        setCurrentAudioUri(storedAudio);
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la lectura anterior.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleSaveReading = async () => {
    setIsSaving(true); // Set saving state early

    if (!user) {
      toast({ 
        title: "Acción Requerida", 
        description: "Debes iniciar sesión para guardar tu lectura.", 
        variant: "destructive" 
      });
      router.push('/auth');
      setIsSaving(false);
      return;
    }

    if (typeof user.uid !== 'string' || user.uid.trim() === '') {
      toast({ 
        title: "Error de Autenticación", 
        description: "No se pudo obtener tu identificación. Por favor, intenta iniciar sesión de nuevo.", 
        variant: "destructive" 
      });
      setIsSaving(false);
      return;
    }

    if (!currentReading) {
      toast({ title: "Error", description: "No hay datos de lectura para guardar.", variant: "destructive" });
      setIsSaving(false);
      return;
    }

    try {
      await addDoc(collection(db, "tarotReadings"), {
        userId: user.uid,
        query: currentQuery,
        numCards: currentReading.cards.length,
        interpretation: currentReading.interpretation,
        cards: currentReading.cards.map(card => ({
          name: card.name,
          position: card.position,
          isReversed: card.isReversed,
          imagePath: getTarotCardImagePathAndAiHint(card.name).path
        })),
        createdAt: serverTimestamp(),
        audioDataUri: currentAudioUri, 
      });
      toast({
        title: "Lectura Guardada",
        description: "Tu viaje místico ha sido atesorado en tu cuenta.",
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        title: "Error al Guardar",
        description: "No se pudo guardar tu lectura. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = () => {
    toast({
      title: "Próximamente",
      description: "Compartir tu lectura será posible en futuras versiones.",
      variant: "default",
    });
  };

  const handleNewQuery = () => {
    router.push('/consulta');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  if (authLoading) {
    return (
      <PageWrapper>
         <div className="flex flex-col items-center justify-center min-h-[200px]">
            <Save className="h-12 w-12 text-primary mb-4 animate-pulse" />
            <p className="text-lg text-muted-foreground">Verificando tu identidad...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Integración
        </h1>
        <p className="text-xl text-foreground/90">
          Gracias por abrir tu corazón y tu mente.
        </p>
        <p className="text-lg text-foreground/80 mt-3 leading-relaxed">
          Recuerda, el tarot es una herramienta para la reflexión. Tú eres el arquitecto de tu camino y el creador de tu destino.
        </p>
      </header>

      {!user && !authLoading && (
        <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-md text-center">
          <div className="flex items-center justify-center mb-2">
            <UserX className="h-6 w-6 mr-2 text-destructive" />
            <p className="font-semibold text-destructive">No has iniciado sesión.</p>
          </div>
          <p className="text-sm text-destructive/80 mb-3">
            Para guardar tus lecturas y acceder a ellas más tarde, por favor inicia sesión o crea una cuenta.
          </p>
          <Button onClick={() => router.push('/auth')} variant="outline" className="border-destructive text-destructive hover:bg-destructive/20">
            Ir a Ingreso / Registro
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl mb-12">
        <Button 
          onClick={handleSaveReading} 
          variant="outline" 
          className="text-md" 
          disabled={!currentReading || !user || isSaving || authLoading} // Added authLoading to disabled check
        >
          {isSaving ? <Save className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
          {isSaving ? "Guardando..." : "Guardar Lectura"}
        </Button>
        <Button onClick={handleShare} variant="outline" className="text-md">
          <Share2 className="mr-2 h-5 w-5" />
          Compartir
        </Button>
        <Button onClick={handleNewQuery} variant="default" className="text-md bg-accent hover:bg-accent/90 text-accent-foreground">
          <Repeat className="mr-2 h-5 w-5" />
          Nueva Consulta
        </Button>
        <Button onClick={handleGoHome} variant="secondary" className="text-md">
          <Home className="mr-2 h-5 w-5" />
          Volver al Inicio
        </Button>
      </div>

      <footer className="mt-8 border-t border-primary/20 pt-6">
        <p className="text-sm text-muted-foreground">
          Que la luz del Ermitaño te acompañe siempre en tu viaje interior.
        </p>
      </footer>
    </PageWrapper>
  );
};

export default IntegrationClient;
