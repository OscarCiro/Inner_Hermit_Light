
import PageWrapper from '@/components/layout/PageWrapper';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
  return (
    <PageWrapper contentClassName="max-w-md">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Portal de Acceso
        </h1>
        <p className="text-lg text-foreground/90">
          Únete a la comunidad o ingresa a tu cuenta.
        </p>
      </header>
      <AuthForm />
    </PageWrapper>
  );
}
