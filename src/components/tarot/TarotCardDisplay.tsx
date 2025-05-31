
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { getTarotCardImagePathAndAiHint } from '@/lib/tarot-card-mapper';

interface TarotCardDisplayProps {
  cardName: string;
  position: string;
  initiallyRevealed?: boolean;
  onReveal?: () => void;
  isRevealed?: boolean;
  isReversed?: boolean; // New prop for reversed status
}

const cardBackImageSrc = '/tarot-cards/default-card.jpg'; 

const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({
  cardName,
  position,
  initiallyRevealed = false,
  onReveal,
  isRevealed: controlledRevealed,
  isReversed = false, // Default to false
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

  const { path: revealedImageSrc, hint: aiHint } = getTarotCardImagePathAndAiHint(cardName);

  return (
    <Card className={cn(
      "w-full max-w-[220px] aspect-[2/3] flex flex-col items-center justify-between p-3 transition-all duration-500 transform-style-preserve-3d relative overflow-hidden shadow-xl border-primary/30",
      isRevealed ? "bg-card rotate-y-0" : "bg-secondary hover:shadow-primary/30 cursor-pointer"
    )}
    onClick={!isRevealed ? handleReveal : undefined}
    role="button"
    tabIndex={!isRevealed ? 0 : -1}
    aria-pressed={isRevealed}
    aria-label={!isRevealed ? `Revelar carta: ${position} - ${cardName}` : `Carta revelada: ${position} - ${cardName}${isReversed ? " (Invertida)" : ""}`}
    >
      <CardHeader className="p-1 text-center w-full">
        <CardTitle className="text-xs font-serif text-primary leading-tight">{position}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col items-center justify-center p-1 w-full">
        {!isRevealed ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Image
              src={cardBackImageSrc}
              alt={`Carta ${position} - Dorso`}
              width={100} 
              height={150}
              className="rounded-md object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              data-ai-hint="tarot card back"
              priority 
              onError={(e) => {
                console.warn(`Failed to load card back image at ${cardBackImageSrc}. Check if 'public${cardBackImageSrc}' exists. Falling back to transparent pixel.`);
                (e.currentTarget as HTMLImageElement).src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; 
                (e.currentTarget as HTMLImageElement).alt = `Imagen no disponible para el dorso de la carta`;
              }}
            />
            <Button variant="ghost" size="sm" className="mt-2 text-xs text-foreground/70 hover:text-primary">
              <Eye className="mr-1 h-3 w-3"/> Revelar
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <Image
              src={revealedImageSrc}
              alt={`Carta ${cardName} - ${position}${isReversed ? " (Invertida)" : ""}`} 
              width={110} 
              height={165} 
              className={cn(
                "rounded-md object-contain",
                isReversed ? "transform rotate-180" : "" // Rotate image if reversed
              )}
              data-ai-hint={aiHint} 
              onError={(e) => {
                console.error(`Error loading image for ${cardName} at ${revealedImageSrc}. Falling back to default card image. Ensure 'public${revealedImageSrc}' and 'public/tarot-cards/default-card.jpg' exist.`);
                (e.currentTarget as HTMLImageElement).src = '/tarot-cards/default-card.jpg'; 
                (e.currentTarget as HTMLImageElement).alt = `Imagen no disponible para ${cardName}`;
              }}
            />
            <p className="mt-2 text-xs font-semibold font-serif text-accent leading-tight w-full">
              {cardName}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TarotCardDisplay;

