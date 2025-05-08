
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { interpretTarotReading, InterpretTarotReadingOutput, InterpretTarotReadingInput } from '@/ai/flows/interpret-tarot-reading';
import PageWrapper from '@/components/layout/PageWrapper';
import TarotCardDisplay from '@/components/tarot/TarotCardDisplay';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Home, Volume2, VolumeX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

function ReadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const numCardsParam = searchParams.get('numCards') || '3';
  // const cardCount = parseInt(numCardsParam, 10); // Not directly used for revealedCards initialization anymore

  const [reading, setReading] = useState<InterpretTarotReadingOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);


  useEffect(() => {
    const currentCardCount = parseInt(searchParams.get('numCards') || '3', 10);
    setRevealedCards(Array(currentCardCount).fill(false));

    const fetchReading = async () => {
      setLoading(true);
      setError(null);
      setHasSpoken(false); // Reset for new reading
      setIsSpeaking(false); // Reset speaking state
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Cancel any previous speech
      }

      try {
        const input: InterpretTarotReadingInput = {
          query,
          numCards: numCardsParam as '3' | '5' | '7'
        };
        const result = await interpretTarotReading(input);

        if (!result.cards || result.cards.length !== currentCardCount) {
          console.error("Card count mismatch or missing cards", { expected: currentCardCount, actual: result.cards?.length });
          setError("La lectura generada no contiene el número esperado de cartas. Por favor, intenta de nuevo.");
          setReading(null);
        } else {
          setReading(result);
          // Initialize revealedCards based on the actual card count from the API response
          setRevealedCards(Array(result.cards.length).fill(false));
        }
      } catch (err) {
        console.error("Error fetching tarot reading:", err);
        setError("Hubo un error al obtener tu lectura. Por favor, intenta de nuevo.");
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
  
  const allCardsRevealed = reading && reading.cards && revealedCards.length > 0 && revealedCards.length === reading.cards.length && revealedCards.every(Boolean);

  useEffect(() => {
    if (allCardsRevealed && reading?.interpretation && !hasSpoken && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(reading.interpretation);
      utterance.lang = 'es-ES';

      utterance.onstart = () => {
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setHasSpoken(true); // Mark as spoken only after finishing
      };
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        // Optionally setHasSpoken(true) here too to prevent retries on error,
        // or allow retry by not setting it. For now, let's prevent retries.
        setHasSpoken(true); 
      };
      
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis && isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
  }, [allCardsRevealed, reading?.interpretation, hasSpoken, isSpeaking]);


  const toggleSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && reading?.interpretation) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        // If already spoken, or not yet spoken, try to speak
        const utterance = new SpeechSynthesisUtterance(reading.interpretation);
        utterance.lang = 'es-ES';
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
          setIsSpeaking(false);
        };
        window.speechSynthesis.speak(utterance);
      }
    }
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
      <PageWrapper>
        <p className="text-xl">No se pudo obtener la lectura o la lectura está vacía.</p>
        <Button onClick={() => router.push('/consulta')} className="mt-4">
          Nueva Consulta
        </Button>
      </PageWrapper>
    );
  }

  let gridColsClass = "md:grid-cols-3";
  if (reading.cards.length === 5) {
    gridColsClass = "md:grid-cols-3 lg:grid-cols-5";
  } else if (reading.cards.length === 7) {
     gridColsClass = "md:grid-cols-4 lg:grid-cols-7";
  }


  return (
    <PageWrapper className="bg-card/30 backdrop-blur-md" style={{
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

      <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridColsClass} gap-4 md:gap-6 mb-10 justify-items-center`}>
        {reading.cards.map((card, index) => (
          <TarotCardDisplay
            key={index}
            cardName={card.name}
            position={card.position}
            isRevealed={revealedCards[index] || false}
            onReveal={() => handleRevealCard(index)}
          />
        ))}
      </div>

      {allCardsRevealed && (
        <section className="mt-8 p-6 bg-background/50 rounded-lg shadow-inner border border-primary/20 animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-serif text-accent">Interpretación del Ermitaño:</h2>
            {typeof window !== 'undefined' && 'speechSynthesis' in window && reading?.interpretation && (
              <Button onClick={toggleSpeech} variant="outline" size="icon" aria-label={isSpeaking ? "Detener narración" : "Escuchar narración"}>
                {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
            )}
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
            <Button onClick={() => router.push('/integracion')} size="lg" className="text-lg">
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
    <PageWrapper>
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <p className="text-xl text-foreground/80">Cargando tu destino...</p>
      </div>
    </PageWrapper>
  );
}
