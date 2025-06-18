
import PageWrapper from '@/components/layout/PageWrapper';
import PasswordResetForm from './PasswordResetForm'; // Client Component

export default function ResetPasswordPage() {
  return (
    <PageWrapper contentClassName="max-w-md">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Restablecer Contraseña
        </h1>
        <p className="text-lg text-foreground/90">
          Ingresa tu correo electrónico para enviarte un enlace de restablecimiento.
        </p>
      </header>
      <PasswordResetForm />
    </PageWrapper>
  );
}
