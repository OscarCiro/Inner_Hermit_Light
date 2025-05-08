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

const TarotCardDisplay: React.FC<TarotCardDisplayProps> = ({
  cardName,
  position,
  initiallyRevealed = false,
  onReveal,
  isRevealed: controlledRevealed,
}) => {
  const [internalRevealed, setInternalRevealed] = useState(initiallyRevealed);
  const isRevealed = controlledRevealed !== undefined ? controlledRevealed : internalRevealed;

  const cardBackSeed = position.toLowerCase().replace(/\s+/g, '-');

  const handleReveal = () => {
    if (onReveal) {
      onReveal();
    } else {
      setInternalRevealed(true);
    }
  };

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
              src={`https://picsum.photos/seed/${cardBackSeed}/200/300`}
              alt={`Carta ${position} - Dorso`}
              width={100}
              height={150}
              className="rounded-md object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              data-ai-hint="tarot card back art nouveau"
            />
            <Button variant="ghost" size="sm" className="mt-4 text-xs text-foreground/70 hover:text-primary">
              <Eye className="mr-1 h-3 w-3"/> Revelar
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor" className="w-16 h-16 mx-auto mb-3 text-accent opacity-70">
              <circle cx="32" cy="14" r="8"/>
              <circle cx="32" cy="50" r="8"/>
              <circle cx="14" cy="32" r="8"/>
              <circle cx="50" cy="32" r="8"/>
              <circle cx="32" cy="32" r="10" opacity="0.4"/>
            </svg>
            <p className="text-xl font-bold font-serif text-accent">{cardName}</p>
            <p className="text-xs text-muted-foreground mt-1">(Posición Normal)</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TarotCardDisplay;
