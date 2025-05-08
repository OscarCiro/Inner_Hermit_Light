"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/layout/PageWrapper';
import { useToast } from "@/hooks/use-toast";
import { Save, Share2, Repeat, Home } from 'lucide-react';

const IntegrationClient: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();

  const handleSaveReading = () => {
    toast({
      title: "Función en Camino",
      description: "Guardar lectura aún no está implementado. ¡Pronto estará disponible!",
      variant: "default",
    });
  };

  const handleShare = () => {
    toast({
      title: "Próximamente",
      description: "Compartir tu lectura será posible en futuras versiones.",
      variant: "default",
    });
  };

  const handleNewQuery = () => {
    router.push('/consulta');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <PageWrapper>
      <header className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Integración
        </h1>
        <p className="text-xl text-foreground/90">
          Gracias por abrir tu corazón y tu mente.
        </p>
        <p className="text-lg text-foreground/80 mt-3 leading-relaxed">
          Recuerda, el tarot es una herramienta para la reflexión. Tú eres el arquitecto de tu camino y el creador de tu destino.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-2xl mb-12">
        <Button onClick={handleSaveReading} variant="outline" className="text-md">
          <Save className="mr-2 h-5 w-5" />
          Guardar Lectura
        </Button>
        <Button onClick={handleShare} variant="outline" className="text-md">
          <Share2 className="mr-2 h-5 w-5" />
          Compartir
        </Button>
        <Button onClick={handleNewQuery} variant="default" className="text-md bg-accent hover:bg-accent/90 text-accent-foreground">
          <Repeat className="mr-2 h-5 w-5" />
          Nueva Consulta
        </Button>
        <Button onClick={handleGoHome} variant="secondary" className="text-md">
          <Home className="mr-2 h-5 w-5" />
          Volver al Inicio
        </Button>
      </div>

      <footer className="mt-8 border-t border-primary/20 pt-6">
        <p className="text-sm text-muted-foreground">
          Que la luz del Ermitaño te acompañe siempre en tu viaje interior.
        </p>
      </footer>
    </PageWrapper>
  );
};

export default IntegrationClient;
