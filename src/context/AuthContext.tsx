
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
  sendEmailVerification, // Importar sendEmailVerification
  sendPasswordResetEmail // Importar sendPasswordResetEmail
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
  sendPasswordReset: (email: string) => Promise<void>; // Añadir sendPasswordReset
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
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        if (window.location.pathname === '/auth') {
          router.push('/');
        }
      }
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
        // La notificación al usuario se hará desde el componente AuthForm
      }
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error signing up:", error);
      throw error; // Re-lanzar para que el componente pueda manejarlo si es necesario
    } finally {
      setLoading(false);
    }
  };

  const logInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      setAuthError(error.message);
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
    setLoading(true); // Reutilizar loading, o crear uno específico si hay conflictos de UI
    try {
      await sendPasswordResetEmail(auth, email);
      // La notificación al usuario se hará desde el componente AuthForm
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
    sendPasswordReset, // Exponer la nueva función
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
