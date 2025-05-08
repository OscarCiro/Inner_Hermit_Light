
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { interpretTarotReading, InterpretTarotReadingOutput, InterpretTarotReadingInput } from '@/ai/flows/interpret-tarot-reading';
import PageWrapper from '@/components/layout/PageWrapper';
import TarotCardDisplay from '@/components/tarot/TarotCardDisplay';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';

function ReadingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const numCardsParam = searchParams.get('numCards') || '3';
  const cardCount = parseInt(numCardsParam, 10);

  const [reading, setReading] = useState<InterpretTarotReadingOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<boolean[]>([]);

  useEffect(() => {
    // Initialize revealedCards array based on cardCount from URL
    // This ensures it's ready before the reading data arrives
    const currentCardCount = parseInt(searchParams.get('numCards') || '3', 10);
    setRevealedCards(Array(currentCardCount).fill(false));

    const fetchReading = async () => {
      setLoading(true);
      setError(null);
      try {
        const input: InterpretTarotReadingInput = { 
          query, 
          numCards: numCardsParam as '3' | '5' | '7' // Type assertion based on form validation
        };
        const result = await interpretTarotReading(input);

        if (!result.cards || result.cards.length !== currentCardCount) {
          console.error("Card count mismatch or missing cards", { expected: currentCardCount, actual: result.cards?.length });
          setError("La lectura generada no contiene el número esperado de cartas. Por favor, intenta de nuevo.");
          setReading(null);
        } else {
          setReading(result);
        }
      } catch (err) {
        console.error("Error fetching tarot reading:", err);
        setError("Hubo un error al obtener tu lectura. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchReading();
  }, [query, numCardsParam, searchParams]); // searchParams in dependency array for numCards changes

  const handleRevealCard = (cardIndex: number) => {
    setRevealedCards(prev => {
      const newRevealed = [...prev];
      if (cardIndex < newRevealed.length) {
        newRevealed[cardIndex] = true;
      }
      return newRevealed;
    });
  };

  const allCardsRevealed = reading && reading.cards && revealedCards.length === reading.cards.length && revealedCards.every(Boolean);

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
  
  // Determine grid columns based on number of cards
  let gridColsClass = "md:grid-cols-3"; // Default for 3 cards
  if (reading.cards.length === 5) {
    gridColsClass = "md:grid-cols-3 lg:grid-cols-5"; // Adjust for 5 cards to fit better on larger screens
  } else if (reading.cards.length === 7) {
     gridColsClass = "md:grid-cols-4 lg:grid-cols-7"; // Adjust for 7 cards
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
          <h2 className="text-2xl font-serif text-accent mb-4">Interpretación del Ermitaño:</h2>
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
    // Suspense boundary is required for useSearchParams
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

// Add this to your globals.css or a style tag if not already present
// @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
// .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
// @keyframes rotate-y { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(180deg); } }
// .rotate-y-180 { animation: rotate-y 0.6s forwards; } /* For card flip if needed */
// .transform-style-preserve-3d { transform-style: preserve-3d; }
// .backface-hidden { backface-visibility: hidden; }
// .rotate-y-0 { transform: rotateY(0deg); }
// .rotate-y-180-static { transform: rotateY(180deg); }
