
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
import { Loader2, AlertTriangle, Chrome } from 'lucide-react'; // Using Chrome as a generic browser icon for Google

const formSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type FormData = z.infer<typeof formSchema>;

const AuthForm: React.FC = () => {
  const { signUpWithEmail, logInWithEmail, signInWithGoogle, authError, setAuthError, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onEmailSubmit = async (data: FormData) => {
    setAuthError(null);
    if (activeTab === 'login') {
      await logInWithEmail(data.email, data.password);
    } else {
      await signUpWithEmail(data.email, data.password);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    await signInWithGoogle();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAuthError(null); 
    reset(); 
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
          {authError && (
            <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertTriangle className="h-4 w-4 mr-2" />
              {authError.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim()}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading && activeTab === (isLogin ? 'login' : 'signup') && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
          {authLoading && activeTab !== (isLogin ? 'login' : 'signup') && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Chrome className="mr-2 h-4 w-4" /> {/* Using Chrome icon as a placeholder */}
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
