import { Loader2 } from 'lucide-react';
import PageWrapper from '@/components/layout/PageWrapper';

export default function Loading() {
  return (
    <PageWrapper className="justify-center">
      <div className="flex flex-col items-center">
        <Loader2 className="h-20 w-20 animate-spin text-primary mb-8" />
        <h2 className="text-3xl font-serif text-primary mb-3">Tejiendo los Hilos del Destino...</h2>
        <p className="text-lg text-foreground/80">Un momento, por favor.</p>
      </div>
    </PageWrapper>
  );
}
