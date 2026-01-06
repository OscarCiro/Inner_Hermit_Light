
"use client";

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { interpretTarotReading, InterpretTarotReadingOutput, InterpretTarotReadingInput } from '@/ai/flows/interpret-tarot-reading';
import PageWrapper from '@/components/layout/PageWrapper';
import TarotCardDisplay from '@/components/tarot/TarotCardDisplay';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Home, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

function ReadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const numCardsParam = searchParams.get('numCards') || '3';

  const [reading, setReading] = useState<InterpretTarotReadingOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);


  useEffect(() => {
    const currentCardCount = parseInt(searchParams.get('numCards') || '3', 10);
    setRevealedCards(Array(currentCardCount).fill(false));
    
    const fetchReading = async () => {
      setLoading(true);
      setError(null);
      try {
        const input: InterpretTarotReadingInput = {
          query,
          numCards: numCardsParam as '3' | '5' | '7'
        };
        const result = await interpretTarotReading(input);
        
        const actualCardCountFromResult = result.cards?.length || 0;

        if (!result.cards || actualCardCountFromResult !== parseInt(numCardsParam, 10) || !result.cards.every(card => typeof card.isReversed === 'boolean' && typeof card.name === 'string' && card.name.length > 0)) {
          console.error("Card count mismatch, missing cards, missing isReversed, or invalid name", { expected: numCardsParam, actual: actualCardCountFromResult, cards: result.cards });
          setError("La lectura generada no es válida. Por favor, intenta de nuevo.");
          setReading(null);
          setRevealedCards(Array(parseInt(numCardsaram, 10)).fill(false));
        } else {
          setReading(result);
          setRevealedCards(Array(actualCardCountFromResult).fill(false));
        }
      } catch (err: any) {
        console.error("________________ERROR DETAILS________________");
        console.error("Message:", err.message);
        if (err.cause) console.error("Cause:", err.cause);
        console.error("_____________________________________________");
        setError("Hubo un error al obtener tu lectura. Por favor, intenta de nuevo.");
        setRevealedCards(Array(parseInt(numCardsParam, 10)).fill(false));
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [query, numCardsParam, searchParams]);

  const handleRevealCard = (cardIndex: number) => {
    setRevealedCards(prev => {
      const newRevealed = [...prev];
      if (cardIndex < newRevealed.length) {
        newRevealed[cardIndex] = true;
      }
      return newRevealed;
    });
  };
  
  const allCardsRevealed = reading && reading.cards && revealedCards.length > 0 && reading.cards.length === revealedCards.length && revealedCards.every(Boolean);

  const handleContinueToIntegration = () => {
    if (reading) {
      try {
        localStorage.setItem('currentTarotReading', JSON.stringify(reading));
        localStorage.setItem('currentTarotQuery', query);
        localStorage.removeItem('currentTarotAudio'); // Clean up old audio data
      } catch (e) {
        console.error("Error saving reading to localStorage:", e);
      }
    }
    router.push('/integracion');
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <p className="text-xl text-foreground/80">El Ermitaño consulta los arcanos...</p>
        <p className="text-sm text-muted-foreground mt-2">Canalizando la sabiduría ancestral para ti.</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertTitle className="font-serif">Error en la Lectura</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={() => router.push('/consulta')} variant="outline" className="mt-4">
          Intentar de Nuevo
        </Button>
      </Alert>
    );
  }

  if (!reading || !reading.cards || reading.cards.length === 0) {
    return (
      <PageWrapper contentClassName="max-w-5xl">
        <p className="text-xl">No se pudo obtener la lectura o la lectura está vacía.</p>
        <Button onClick={() => router.push('/consulta')} className="mt-4">
          Nueva Consulta
        </Button>
      </PageWrapper>
    );
  }

  let gridColsClass = "sm:grid-cols-3 md:grid-cols-3"; 
  if (reading.cards.length === 5) {
    gridColsClass = "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5";
  } else if (reading.cards.length === 7) {
    gridColsClass = "sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"; 
  }


  return (
    <PageWrapper 
      contentClassName="max-w-5xl" 
      className="bg-card/30 backdrop-blur-md" 
      style={{
        backgroundImage: "radial-gradient(circle, hsl(var(--muted)/0.1) 1px, transparent 1px), radial-gradient(circle, hsl(var(--muted)/0.05) 1px, transparent 1px)",
        backgroundSize: "30px 30px, 15px 15px",
        backgroundPosition: "0 0, 7.5px 7.5px"
      }}>
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
          Revelación
        </h1>
        <p className="text-lg text-foreground/80">Las cartas han hablado. Escucha su mensaje.</p>
      </header>
      
      <div className={`grid grid-cols-1 ${gridColsClass} gap-4 md:gap-6 mb-10 justify-items-center`}>
        {reading.cards.map((card, index) => (
          <TarotCardDisplay
            key={index}
            cardName={card.name}
            position={card.position}
            isReversed={card.isReversed}
            isRevealed={revealedCards[index] || false}
            onReveal={() => handleRevealCard(index)}
          />
        ))}
      </div>

      {allCardsRevealed && (
        <section className="mt-8 p-6 bg-background/50 rounded-lg shadow-inner border border-primary/20 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif text-accent">Interpretación del Ermitaño:</h2>
          </div>
          <div className="prose prose-invert text-foreground/90 max-w-none whitespace-pre-line text-left leading-relaxed">
            {reading.interpretation.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3">{paragraph}</p>
            ))}
          </div>
        </section>
      )}

      {allCardsRevealed && (
         <p className="mt-10 text-lg font-semibold text-primary italic px-4 py-3 bg-muted/30 rounded-md border border-primary/20">
          "El Ermitaño te invita a una pausa. La respuesta no está en el ruido, sino en tu luz interior. Escúchate."
        </p>
      )}


      {allCardsRevealed && (
        <div className="mt-12 w-full">
          <Separator className="my-6 bg-primary/30" />
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handleContinueToIntegration} size="lg" className="text-lg">
              Continuar a Integración
            </Button>
             <Button onClick={() => router.push('/consulta')} variant="outline" size="lg">
              <RefreshCw className="mr-2 h-5 w-5" />
              Nueva Consulta
            </Button>
            <Button onClick={() => router.push('/')} variant="ghost" size="lg">
              <Home className="mr-2 h-5 w-5" />
              Volver al Inicio
            </Button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}


export default function ReadingPageClient() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReadingContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <PageWrapper contentClassName="max-w-5xl">
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <p className="text-xl text-foreground/80">Cargando tu destino...</p>
      </div>
    </PageWrapper>
  );
}
    

    