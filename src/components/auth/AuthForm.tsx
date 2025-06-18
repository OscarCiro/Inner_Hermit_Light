
"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Chrome, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Import useRouter

const loginFormSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

const signupFormSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido." }),
  password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "La confirmación de contraseña debe tener al menos 6 caracteres." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginFormSchema>;
type SignupFormValues = z.infer<typeof signupFormSchema>;
type AuthFormValues = LoginFormValues | SignupFormValues;


const AuthForm: React.FC = () => {
  const { signUpWithEmail, logInWithEmail, signInWithGoogle, authError, setAuthError, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("login");
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const currentSchema = activeTab === 'login' ? loginFormSchema : signupFormSchema;

  const { register, handleSubmit, formState: { errors }, reset, control } = useForm<AuthFormValues>({
    resolver: zodResolver(currentSchema),
    mode: "onChange",
    defaultValues: { // Set default values to avoid uncontrolled component warnings
      email: "",
      password: "",
      ...(activeTab === 'signup' && { confirmPassword: "" }),
    }
  });
  
  useEffect(() => {
    // Reset form with current schema defaults when tab changes
    reset(
      activeTab === 'login' 
        ? { email: "", password: "" } 
        : { email: "", password: "", confirmPassword: "" }, 
      { keepErrors: false, keepDirty: false, keepValues: false }
    );
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, [activeTab, reset]);


  const onEmailSubmit = async (data: AuthFormValues) => {
    setAuthError(null);
    if (activeTab === 'login') {
      try {
        await logInWithEmail(data.email, (data as LoginFormValues).password);
        // Redirect is handled by AuthContext
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else { // signup
      try {
        await signUpWithEmail(data.email, (data as SignupFormValues).password);
        toast({
          title: "¡Registro Exitoso!",
          description: "Hemos enviado un correo de verificación a tu dirección. Por favor, revisa tu bandeja de entrada y spam.",
          duration: 7000,
        });
      } catch (error) {
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setAuthError(null);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

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
            <Input 
              id={`${isLogin ? 'login' : 'signup'}-email`} 
              type="email" 
              {...register("email")} 
              placeholder="tu@ejemplo.com" 
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${isLogin ? 'login' : 'signup'}-password`}>Contraseña</Label>
            <div className="relative">
              <Input 
                id={`${isLogin ? 'login' : 'signup'}-password`} 
                type={showPassword ? "text" : "password"} 
                {...register("password")} 
                placeholder={isLogin ? "••••••••" : "Mínimo 6 caracteres"} 
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="signup-confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <Input 
                  id="signup-confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  {...register("confirmPassword" as keyof SignupFormValues)} 
                  placeholder="Repite tu contraseña"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {(errors as any).confirmPassword && <p className="text-xs text-destructive mt-1">{(errors as any).confirmPassword.message}</p>}
            </div>
          )}

          {isLogin && (
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm h-auto py-1 text-primary hover:text-primary/80 -mt-2 mb-2 block"
              onClick={() => router.push('/auth/reset-password')} // Navigate to reset password page
              disabled={authLoading}
            >
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
