
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { getTarotCardImagePathAndAiHint } from '@/lib/tarot-card-mapper';

interface TarotCardDisplayProps {
  cardName: string; // This will be the Spanish name from the AI
  position: string; // e.g., "Pasado", "Presente", "Futuro"
  initiallyRevealed?: boolean;
  onReveal?: () => void;
  isRevealed?: boolean;
}

const cardBackImageSrc = '/tarot-cards/default-card.jpg'; 

const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({
  cardName,
  position,
  initiallyRevealed = false,
  onReveal,
  isRevealed: controlledRevealed,
}) => {
  const [internalRevealed, setInternalRevealed] = useState(initiallyRevealed);
  const isRevealed = controlledRevealed !== undefined ? controlledRevealed : internalRevealed;

  const handleReveal = () => {
    if (onReveal) {
      onReveal();
    } else {
      setInternalRevealed(true);
    }
  };

  // Get image path and AI hint using the mapper
  const { path: revealedImageSrc, hint: aiHint } = getTarotCardImagePathAndAiHint(cardName);

  return (
    <Card className={cn(
      "w-full max-w-[220px] aspect-[2/3] flex flex-col items-center justify-center p-4 transition-all duration-500 transform-style-preserve-3d relative overflow-hidden shadow-xl border-primary/30",
      isRevealed ? "bg-card rotate-y-0" : "bg-secondary hover:shadow-primary/30 cursor-pointer"
    )}
    onClick={!isRevealed ? handleReveal : undefined}
    role="button"
    tabIndex={!isRevealed ? 0 : -1}
    aria-pressed={isRevealed}
    aria-label={!isRevealed ? `Revelar carta: ${position} - ${cardName}` : `Carta revelada: ${position} - ${cardName}`}
    >
      <CardHeader className="p-2 text-center">
        <CardTitle className="text-sm font-serif text-primary">{position}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center p-2 w-full">
        {!isRevealed ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Image
              src={cardBackImageSrc}
              alt={`Carta ${position} - Dorso`}
              width={100}
              height={150}
              className="rounded-md object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              data-ai-hint="tarot card back"
              priority // Preload card backs as they are common
              onError={(e) => {
                // Fallback for card back if missing
                console.warn(`Failed to load card back image at ${cardBackImageSrc}. Check if 'public${cardBackImageSrc}' exists. Falling back to transparent pixel.`);
                (e.currentTarget as HTMLImageElement).src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // Transparent pixel
                (e.currentTarget as HTMLImageElement).alt = `Imagen no disponible para el dorso de la carta`;
              }}
            />
            <Button variant="ghost" size="sm" className="mt-4 text-xs text-foreground/70 hover:text-primary">
              <Eye className="mr-1 h-3 w-3"/> Revelar
            </Button>
          </div>
        ) : (
          <div className="text-center w-full h-full flex flex-col items-center justify-center">
            <Image
              src={revealedImageSrc}
              alt={`Carta ${cardName} - ${position}`} // Alt text uses Spanish name
              width={120} 
              height={180}
              className="rounded-md object-contain mx-auto mb-2" 
              data-ai-hint={aiHint} // Use English hint from mapper
              onError={(e) => {
                // Fallback if a specific card image is missing
                console.error(`Error loading image for ${cardName} at ${revealedImageSrc}. Falling back to default card image. Ensure 'public${revealedImageSrc}' and 'public/tarot-cards/default-card.jpg' exist.`);
                (e.currentTarget as HTMLImageElement).src = '/tarot-cards/default-card.jpg'; 
                (e.currentTarget as HTMLImageElement).alt = `Imagen no disponible para ${cardName}`;
              }}
            />
            <p className="text-sm font-semibold font-serif text-accent mt-1">{cardName}</p> {/* Display Spanish name */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TarotCardDisplay;
