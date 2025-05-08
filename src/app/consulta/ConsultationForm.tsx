"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

const ConsultationForm: React.FC = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Encode the query to safely pass it as a URL parameter
    const encodedQuery = encodeURIComponent(query);
    router.push(`/lectura?q=${encodedQuery}`);
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
      <Button type="submit" size="lg" className="w-full md:w-auto text-lg shadow-md hover:shadow-primary/40 transition-shadow duration-300">
        Comenzar Lectura
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </form>
  );
};

export default ConsultationForm;
