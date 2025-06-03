
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
import { Loader2, AlertTriangle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

type FormData = z.infer<typeof formSchema>;

const AuthForm: React.FC = () => {
  const { signUpWithEmail, logInWithEmail, authError, setAuthError, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setAuthError(null);
    if (activeTab === 'login') {
      await logInWithEmail(data.email, data.password);
    } else {
      await signUpWithEmail(data.email, data.password);
    }
    // Reset might not be needed if redirect happens
    // reset(); 
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAuthError(null); // Clear errors when switching tabs
    reset(); // Reset form fields
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Ingresar</TabsTrigger>
        <TabsTrigger value="signup">Registrarse</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenido de Nuevo</CardTitle>
            <CardDescription>Ingresa tus credenciales para continuar tu viaje.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">Correo Electrónico</Label>
                <Input id="login-email" type="email" {...register("email")} placeholder="tu@ejemplo.com" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Contraseña</Label>
                <Input id="login-password" type="password" {...register("password")} placeholder="••••••••" />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>
              {authError && (
                <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {authError.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim()}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Ingresar
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Únete a la Búsqueda</CardTitle>
            <CardDescription>Crea tu cuenta para guardar tus lecturas y progresos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Correo Electrónico</Label>
                <Input id="signup-email" type="email" {...register("email")} placeholder="tu@ejemplo.com" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Contraseña</Label>
                <Input id="signup-password" type="password" {...register("password")} placeholder="Mínimo 6 caracteres" />
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
              </div>
               {authError && (
                <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {authError.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim()}
                </div>
              )}
              <Button type="submit" className="w-full" disabled={authLoading}>
                {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear Cuenta
              </Button>
            </form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AuthForm;
