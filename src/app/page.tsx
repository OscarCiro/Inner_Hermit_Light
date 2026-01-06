
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loading from './loading'; // Usamos el componente de carga existente

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirige directamente a la página de consulta
    router.replace('/consulta');
  }, [router]);

  // Muestra una pantalla de carga mientras se realiza la redirección
  return <Loading />;
}
