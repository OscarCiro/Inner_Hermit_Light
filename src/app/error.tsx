"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import PageWrapper from "@/components/layout/PageWrapper";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <PageWrapper className="justify-center">
      <div className="flex flex-col items-center">
        <AlertTriangle className="h-20 w-20 text-destructive mb-8" />
        <h2 className="text-3xl font-serif text-destructive mb-3">Un Velo Inesperado ha Caído</h2>
        <p className="text-lg text-foreground/80 mb-2">
          Algo ha interrumpido la conexión mística.
        </p>
        <p className="text-sm text-muted-foreground mb-8 max-w-md">
           Detalles: {error.message || "Un error desconocido ha ocurrido."}
        </p>
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
          variant="outline"
          size="lg"
        >
          <RefreshCcw className="mr-2 h-5 w-5"/>
          Intentar de Nuevo
        </Button>
      </div>
    </PageWrapper>
  );
}
