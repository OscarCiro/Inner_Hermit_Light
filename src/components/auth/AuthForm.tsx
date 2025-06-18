
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast"; // Importar useToast
import { Loader2, AlertTriangle, Chrome, MailQuestion } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type FormData = z.infer<typeof formSchema>;

const AuthForm: React.FC = () => {
  const { signUpWithEmail, logInWithEmail, signInWithGoogle, sendPasswordReset, authError, setAuthError, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast(); // Inicializar toast

  const { register, handleSubmit, formState: { errors }, reset, getValues, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Para que la validación del email ocurra al escribir
  });

  const onEmailSubmit = async (data: FormData) => {
    setAuthError(null);
    if (activeTab === 'login') {
      try {
        await logInWithEmail(data.email, data.password);
        // El redirect es manejado por AuthContext
      } catch (error) {
        // authError se establece en AuthContext, y se muestra en el formulario
        console.error("Login failed:", error);
      }
    } else { // signup
      try {
        await signUpWithEmail(data.email, data.password);
        toast({
          title: "¡Registro Exitoso!",
          description: "Hemos enviado un correo de verificación a tu dirección. Por favor, revisa tu bandeja de entrada y spam.",
          duration: 7000, // Duración más larga para este mensaje importante
        });
        // reset(); // Considerar si se resetea el formulario aquí
      } catch (error) {
        // authError se establece en AuthContext
        console.error("Signup failed:", error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign in failed:", error);
    }
  };
  
  const handlePasswordResetRequest = async () => {
    setAuthError(null);
    const emailIsValid = await trigger("email"); // Validar solo el campo de email
    if (!emailIsValid) {
      toast({
        title: "Correo Inválido",
        description: "Por favor, ingresa una dirección de correo electrónico válida.",
        variant: "destructive",
      });
      return;
    }

    const email = getValues("email");
    try {
      await sendPasswordReset(email);
      toast({
        title: "Correo de Restablecimiento Enviado",
        description: "Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.",
        duration: 7000,
      });
    } catch (error: any) {
      // authError es establecido por AuthContext y se muestra en el formulario.
      // Podríamos mostrar un toast genérico aquí también si el error no es específico.
      toast({
        title: "Error",
        description: authError || "No se pudo enviar el correo de restablecimiento. Intenta de nuevo.",
        variant: "destructive",
      });
      console.error("Password reset failed:", error);
    }
  };


  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAuthError(null); 
    reset({ email: getValues("email"), password: "" }); // Mantener email, limpiar contraseña
  };

  const renderForm = (isLogin: boolean) => (
    <Card>
      <CardHeader>
        <CardTitle>{isLogin ? "Bienvenido de Nuevo" : "Únete a la Búsqueda"}</CardTitle>
        <CardDescription>
          {isLogin ? "Ingresa tus credenciales para continuar tu viaje." : "Crea tu cuenta para guardar tus lecturas y progresos."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor={`${isLogin ? 'login' : 'signup'}-email`}>Correo Electrónico</Label>
            <Input id={`${isLogin ? 'login' : 'signup'}-email`} type="email" {...register("email")} placeholder="tu@ejemplo.com" />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${isLogin ? 'login' : 'signup'}-password`}>Contraseña</Label>
            <Input id={`${isLogin ? 'login' : 'signup'}-password`} type="password" {...register("password")} placeholder={isLogin ? "••••••••" : "Mínimo 6 caracteres"} />
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          {isLogin && (
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm h-auto py-1 text-primary hover:text-primary/80 -mt-2 mb-2 block"
              onClick={handlePasswordResetRequest}
              disabled={authLoading}
            >
              <MailQuestion className="inline h-4 w-4 mr-1" />
              ¿Olvidaste tu contraseña?
            </Button>
          )}

          {authError && (
            <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
              {authError.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim()}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? "Ingresar" : "Crear Cuenta"}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              O continuar con
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={authLoading}>
          {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Chrome className="mr-2 h-4 w-4" />
          {isLogin ? "Ingresar con Google" : "Registrarse con Google"}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Ingresar</TabsTrigger>
        <TabsTrigger value="signup">Registrarse</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        {renderForm(true)}
      </TabsContent>
      <TabsContent value="signup">
        {renderForm(false)}
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;
