import PageWrapper from '@/components/layout/PageWrapper';
import ConsultationForm from './ConsultationForm'; // Client Component

export default function ConsultationPage() {
  return (
    <PageWrapper>
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Invocación
        </h1>
        <p className="text-lg text-foreground/90 leading-relaxed">
          Detente un instante. Respira profundamente.
        </p>
        <p className="text-lg text-foreground/80 leading-relaxed mt-2">
          Conecta con la pregunta que late en tu corazón o permite que la sabiduría ancestral te guíe libremente.
        </p>
      </header>

      <ConsultationForm />

      <div className="mt-12 border-t border-primary/20 pt-6">
        <p className="text-sm text-muted-foreground">
          La claridad emerge cuando aquietamos la mente y escuchamos la voz interior.
        </p>
      </div>
    </PageWrapper>
  );
}
