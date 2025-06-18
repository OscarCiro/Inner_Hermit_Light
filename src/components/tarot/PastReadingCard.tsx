
"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import type { PastReading, StoredCard } from '@/app/mis-lecturas/UserReadingsClient'; // Adjust path as needed
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, CalendarDays, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface PastReadingCardProps {
  reading: PastReading;
}

const PastReadingCard: React.FC<PastReadingCardProps> = ({ reading }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const formattedDate = reading.createdAt ? format(reading.createdAt, "EEEE, d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es }) : 'Fecha desconocida';

  const toggleAudio = () => {
    if (audioRef.current && reading.audioDataUri) {
      setAudioError(null);
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        if(audioRef.current.ended || audioRef.current.currentTime === audioRef.current.duration || audioRef.current.currentTime === 0) {
            audioRef.current.currentTime = 0; // Reset if ended or at the start
        }
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          setAudioError("No se pudo reproducir el audio.");
          setIsAudioPlaying(false);
        });
      }
    }
  };
  
  let gridColsClass = "sm:grid-cols-3 md:grid-cols-3"; 
  if (reading.cards.length === 5) {
    gridColsClass = "sm:grid-cols-3 md:grid-cols-5"; // Adjust for 5 cards
  } else if (reading.cards.length === 7) {
    // For 7 cards, maybe 4 on top, 3 below, or a denser grid
    gridColsClass = "sm:grid-cols-4 md:grid-cols-4"; // Example: 4 columns
  }


  return (
    <Card className="w-full shadow-lg border-primary/20 bg-background/70 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="text-2xl text-primary font-serif">
            Lectura del Oráculo
          </CardTitle>
          {reading.audioDataUri && (
            <Button 
              onClick={toggleAudio} 
              variant="outline" 
              size="sm" 
              aria-label={isAudioPlaying ? "Detener narración" : "Escuchar narración"}
            >
              {isAudioPlaying ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
              {isAudioPlaying ? "Detener" : "Escuchar"}
            </Button>
          )}
        </div>
        <CardDescription className="text-sm text-muted-foreground flex items-center pt-1">
          <CalendarDays className="h-4 w-4 mr-2" />
          {formattedDate}
        </CardDescription>
         {reading.audioDataUri && (
            <audio
              ref={audioRef}
              src={reading.audioDataUri}
              onPlay={() => setIsAudioPlaying(true)}
              onPause={() => setIsAudioPlaying(false)}
              onEnded={() => setIsAudioPlaying(false)}
              onError={() => {
                setAudioError("Error al cargar la narración.");
                setIsAudioPlaying(false);
              }}
              className="hidden"
            />
        )}
        {audioError && (
            <div className="mt-2 flex items-center text-xs text-destructive bg-destructive/10 p-2 rounded-md">
                <AlertCircle className="h-4 w-4 mr-2 shrink-0" />
                {audioError}
            </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {reading.query && (
          <div className="p-3 bg-muted/30 rounded-md border border-input">
            <p className="text-sm font-semibold text-foreground/90 flex items-center">
              <HelpCircle className="h-4 w-4 mr-2 text-accent" />
              Tu Inquietud:
            </p>
            <p className="text-sm text-foreground/80 italic mt-1">{reading.query}</p>
          </div>
        )}

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="interpretation">
            <AccordionTrigger className="text-lg font-semibold text-accent hover:no-underline">
              Interpretación del Ermitaño
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="prose prose-sm prose-invert text-foreground/90 max-w-none whitespace-pre-line leading-relaxed">
                {reading.interpretation.split('\\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph}</p>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cards">
            <AccordionTrigger className="text-lg font-semibold text-accent hover:no-underline">
              Cartas Reveladas ({reading.cards.length})
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className={`grid grid-cols-2 ${gridColsClass} gap-3 md:gap-4 justify-items-center`}>
                {reading.cards.map((card, index) => (
                  <div key={index} className="flex flex-col items-center p-2 rounded-md bg-card/50 border border-input w-full max-w-[150px] sm:max-w-[130px]">
                    <Image
                      src={card.imagePath}
                      alt={`${card.name}${card.isReversed ? " (Invertida)" : ""}`}
                      width={80}
                      height={120}
                      className={cn(
                        "rounded-sm object-contain shadow-md",
                        card.isReversed ? "transform rotate-180" : ""
                      )}
                      onError={(e) => {
                        console.error(`Error loading image for ${card.name} at ${card.imagePath}`);
                        (e.currentTarget as HTMLImageElement).src = '/tarot-cards/default-card.jpg';
                        (e.currentTarget as HTMLImageElement).alt = `Imagen no disponible para ${card.name}`;
                      }}
                    />
                    <p className="mt-1.5 text-xs font-semibold text-center text-primary leading-tight">{card.name}</p>
                    <p className="text-[10px] text-muted-foreground text-center leading-tight">{card.position}</p>
                    {card.isReversed && <p className="text-[10px] text-accent italic text-center leading-tight">(Invertida)</p>}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PastReadingCard;
