
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider, // Import GoogleAuthProvider
  signInWithPopup     // Import signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>; // Add signInWithGoogle
  logOut: () => Promise<void>;
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
        // Check if current route is /auth, if so, redirect to home
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
      await createUserWithEmailAndPassword(auth, email, pass);
      // router.push('/'); // Redirect handled by onAuthStateChanged
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error signing up:", error);
    } finally {
      setLoading(false);
    }
  };

  const logInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // router.push('/'); // Redirect handled by onAuthStateChanged
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error logging in:", error);
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
      // router.push('/'); // Redirect handled by onAuthStateChanged
    } catch (error: any) {
      setAuthError(error.message);
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.push('/'); // Redirect to home after logout
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
    signInWithGoogle, // Expose signInWithGoogle
    logOut,
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
