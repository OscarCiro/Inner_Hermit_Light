
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const resetSchema = z.object({
  email: z.string().email({ message: "Por favor, ingresa un correo electrónico válido." }),
});

type ResetFormData = z.infer<typeof resetSchema>;

const PasswordResetForm: React.FC = () => {
  const { sendPasswordReset, authError, setAuthError, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

  const handlePasswordResetRequest = async (data: ResetFormData) => {
    setAuthError(null);
    try {
      await sendPasswordReset(data.email);
      toast({
        title: "Correo de Restablecimiento Enviado",
        description: "Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.",
        duration: 7000,
      });
    } catch (error: any) {
      // authError is set by AuthContext and displayed below
      // We can also show a generic toast if preferred
      toast({
        title: "Error",
        description: authError || "No se pudo enviar el correo de restablecimiento. Intenta de nuevo.",
        variant: "destructive",
      });
      console.error("Password reset failed:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6"> {/* Added pt-6 to match AuthForm CardContent padding */}
        <form onSubmit={handleSubmit(handlePasswordResetRequest)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input 
              id="email" 
              type="email" 
              {...register("email")} 
              placeholder="tu@ejemplo.com" 
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
          </div>

          {authError && (
            <div className="flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              <AlertTriangle className="h-4 w-4 mr-2 shrink-0" />
              {authError.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim()}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={authLoading}>
            {authLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Mail className="mr-2 h-4 w-4" />
            Enviar Enlace de Restablecimiento
          </Button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/auth" passHref>
            <Button variant="link" className="text-sm text-primary hover:text-primary/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Ingreso
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;
