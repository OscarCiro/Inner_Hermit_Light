
import UserReadingsClient from './UserReadingsClient';
import PageWrapper from '@/components/layout/PageWrapper';

export default function MisLecturasPage() {
  return (
     <PageWrapper contentClassName="max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Mis Viajes Místicos
        </h1>
        <p className="text-lg text-foreground/90">
          Aquí se atesoran las huellas de tus consultas al oráculo.
        </p>
      </header>
      <UserReadingsClient />
    </PageWrapper>
  );
}
