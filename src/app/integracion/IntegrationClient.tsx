
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/layout/PageWrapper';
import { useToast } from "@/hooks/use-toast";
import { Save, Share2, Repeat, Home } from 'lucide-react';
import { InterpretTarotReadingOutput } from '@/ai/flows/interpret-tarot-reading'; // Assuming this type exists
import { db } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getTarotCardImagePathAndAiHint } from '@/lib/tarot-card-mapper';


const IntegrationClient: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [currentReading, setCurrentReading] = useState<InterpretTarotReadingOutput | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [currentAudioUri, setCurrentAudioUri] = useState<string | null>(null);

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
    if (!currentReading) {
      toast({ title: "Error", description: "No hay datos de lectura para guardar.", variant: "destructive" });
      return;
    }

    // Example: if (!user) {
    //   toast({ title: "Error", description: "Debes iniciar sesión para guardar.", variant: "destructive" });
    //   return;
    // }

    try {
      await addDoc(collection(db, "tarotReadings"), {
        // userId: user.uid, // If auth is implemented
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
        description: "Tu viaje místico ha sido atesorado.",
      });
      // Optionally clear localStorage after saving
      // localStorage.removeItem('currentTarotReading');
      // localStorage.removeItem('currentTarotQuery');
      // localStorage.removeItem('currentTarotAudio');
    } catch (e) {
      console.error("Error adding document: ", e);
      toast({
        title: "Error al Guardar",
        description: "No se pudo guardar tu lectura. Inténtalo de nuevo.",
        variant: "destructive",
      });
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl mb-12">
        <Button onClick={handleSaveReading} variant="outline" className="text-md" disabled={!currentReading}>
          <Save className="mr-2 h-5 w-5" />
          Guardar Lectura
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
