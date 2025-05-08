
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight } from 'lucide-react';

const cardOptions = [
  { value: "3", label: "Triada (3 cartas)", description: "Una visión clara de Pasado, Presente y Futuro." },
  { value: "5", label: "Sendero (5 cartas)", description: "Explora el contexto, obstáculos, apoyos, consejo y resultado." },
  { value: "7", label: "Septenario (7 cartas)", description: "Un análisis profundo de la situación desde múltiples ángulos." },
];

const ConsultationForm: React.FC = () => {
  const [query, setQuery] = useState('');
  const [numCards, setNumCards] = useState<string>("3");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedQuery = encodeURIComponent(query);
    router.push(`/lectura?q=${encodedQuery}&numCards=${numCards}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full">
      <div className="space-y-2">
        <Label htmlFor="query" className="text-lg text-foreground/90">
          Tu Inquietud o Intención
        </Label>
        <Textarea
          id="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="¿Qué deseas explorar hoy? Amor, trabajo, decisiones... Escribe tu inquietud o deja que las cartas hablen libremente."
          rows={4}
          className="bg-input/70 border-primary/30 focus:border-primary focus:ring-primary animated-placeholder text-base"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-lg text-foreground/90">
          Elige tu Viaje Místico
        </Label>
        <RadioGroup value={numCards} onValueChange={setNumCards} className="gap-4">
          {cardOptions.map((option) => (
            <Label
              key={option.value}
              htmlFor={`card-option-${option.value}`}
              className="flex flex-col p-4 border border-primary/30 rounded-md cursor-pointer hover:bg-muted/50 transition-colors data-[state=checked]:bg-primary/10 data-[state=checked]:border-primary"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={option.value} id={`card-option-${option.value}`} />
                <div className="flex-1">
                  <span className="font-semibold text-base text-foreground">{option.label}</span>
                  <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                </div>
              </div>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" size="lg" className="w-full md:w-auto text-lg shadow-md hover:shadow-primary/40 transition-shadow duration-300">
        Comenzar Lectura
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </form>
  );
};

export default ConsultationForm;
