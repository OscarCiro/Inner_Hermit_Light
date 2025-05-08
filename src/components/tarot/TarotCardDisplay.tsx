"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';

interface TarotCardDisplayProps {
  cardName: string;
  position: string; // e.g., "Pasado", "Presente", "Futuro"
  initiallyRevealed?: boolean;
  onReveal?: () => void;
  isRevealed?: boolean;
}

const getCardImageSrc = (cardName: string): string => {
  // Converts "El Sol" to "el-sol.jpg", "The Fool" to "the-fool.jpg" etc.
  // Assumes images are JPEGs. Change extension if needed (e.g. .png)
  const imageName = cardName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.jpg';
  return `/tarot-cards/${imageName}`;
};

const cardBackImageSrc = '/tarot-cards/card-back.jpg';

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

  const revealedImageSrc = getCardImageSrc(cardName);

  return (
    <Card className={cn(
      "w-full max-w-[220px] aspect-[2/3] flex flex-col items-center justify-center p-4 transition-all duration-500 transform-style-preserve-3d relative overflow-hidden shadow-xl border-primary/30",
      isRevealed ? "bg-card rotate-y-0" : "bg-secondary hover:shadow-primary/30 cursor-pointer"
    )}
    onClick={!isRevealed ? handleReveal : undefined}
    >
      <CardHeader className="p-2 text-center">
        <CardTitle className="text-lg font-serif text-primary">{position}</CardTitle>
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
            />
            <Button variant="ghost" size="sm" className="mt-4 text-xs text-foreground/70 hover:text-primary">
              <Eye className="mr-1 h-3 w-3"/> Revelar
            </Button>
          </div>
        ) : (
          <div className="text-center w-full h-full flex flex-col items-center justify-center">
            <Image
              src={revealedImageSrc}
              alt={`Carta ${cardName} - ${position}`}
              width={120} 
              height={180}
              className="rounded-md object-contain mx-auto mb-2" // object-contain to prevent cropping
              data-ai-hint={cardName.toLowerCase().split(" ").slice(0,2).join(" ")} // e.g. "el sol"
              onError={(e) => {
                // Fallback if a specific card image is missing
                e.currentTarget.src = '/tarot-cards/default-card.jpg'; // Provide a default card face
                e.currentTarget.alt = `Imagen no disponible para ${cardName}`;
              }}
            />
            <p className="text-lg font-bold font-serif text-accent mt-1">{cardName}</p>
            {/* <p className="text-xs text-muted-foreground">(Posición Normal)</p> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TarotCardDisplay;
