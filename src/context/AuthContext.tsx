
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  authError: string | null;
  setAuthError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const isEmailPasswordUser = currentUser.providerData.some(
          (provider) => provider.providerId === 'password'
        );

        // Si es un usuario de email/contraseña y su email no está verificado,
        // trátalo como si no hubiera iniciado sesión para la UI de la app.
        if (isEmailPasswordUser && !currentUser.emailVerified) {
          setUser(null); 
        } else {
          setUser(currentUser);
          // Solo redirige si el email está verificado o es un proveedor no-password (ej. Google)
          // y el usuario está actualmente en la página de autenticación.
          if (window.location.pathname === '/auth') {
            router.push('/');
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const signUpWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
        // La notificación al usuario se hará desde el componente AuthForm.
        // El usuario no iniciará sesión automáticamente si el email no está verificado,
        // debido a la lógica en onAuthStateChanged.
      }
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error signing up:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged se encargará de la lógica de verificación de email.
      // Si el email no está verificado y el usuario intenta iniciar sesión:
      if (userCredential.user && !userCredential.user.emailVerified) {
         setAuthError("Por favor, verifica tu correo electrónico antes de iniciar sesión.");
         // Es importante que el estado de `user` en el contexto se mantenga como `null`
         // lo cual `onAuthStateChanged` ya debería estar haciendo.
         // Forzamos un signOut para asegurar que no haya una sesión activa no verificada.
         await signOut(auth);
         setUser(null); // Asegura que el estado local de user se actualice
         throw new Error("Por favor, verifica tu correo electrónico antes de iniciar sesión.");
      }
    } catch (error: any) {
      // Si el error no es el que lanzamos nosotros, lo pasamos.
      if (error.message !== "Por favor, verifica tu correo electrónico antes de iniciar sesión.") {
        setAuthError(error.message);
      }
      console.error("Error logging in:", error);
      throw error; 
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged manejará la redirección.
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error signing in with Google:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error sending password reset email:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null); // Asegura que el estado local de user se actualice inmediatamente
      router.push('/');
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUpWithEmail,
    logInWithEmail,
    signInWithGoogle,
    logOut,
    sendPasswordReset,
    authError,
    setAuthError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
