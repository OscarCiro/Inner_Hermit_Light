
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebaseConfig';
import { collection, query as firestoreQuery, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import PastReadingCard from '@/components/tarot/PastReadingCard';
import { Loader2, AlertTriangle, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export interface StoredCard {
  name: string;
  position: string;
  isReversed: boolean;
  imagePath: string;
}

export interface PastReading {
  id: string;
  query: string;
  interpretation: string;
  cards: StoredCard[];
  createdAt: Date; // Converted from Firestore Timestamp
  numCards: number;
  audioDataUri?: string;
}

const UserReadingsClient: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [readings, setReadings] = useState<PastReading[]>([]);
  const [loadingReadings, setLoadingReadings] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) {
      // Still waiting for authentication state to resolve
      // setLoadingReadings(true) is already default, so no change needed here
      return; 
    }

    if (!user) {
      // Auth loaded, but no user is signed in
      setLoadingReadings(false);
      // Message to log in will be shown by the component's render logic
      return;
    }
    
    if (typeof user.uid !== 'string' || user.uid.trim() === '') {
      console.error("User UID is invalid for fetching readings.");
      setError("No se pudo verificar tu identidad para cargar las lecturas.");
      setLoadingReadings(false);
      return;
    }

    const fetchReadings = async () => {
      setLoadingReadings(true); // Set loading true at the start of fetch
      setError(null);
      try {
        const q = firestoreQuery(
          collection(db, "tarotReadings"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const userReadings = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            query: data.query || "",
            interpretation: data.interpretation,
            cards: data.cards,
            createdAt: (data.createdAt as Timestamp).toDate(),
            numCards: data.numCards,
            audioDataUri: data.audioDataUri,
          } as PastReading;
        });
        setReadings(userReadings);
      } catch (err) {
        console.error("Error fetching readings:", err);
        setError("No se pudieron cargar tus lecturas. Inténtalo de nuevo más tarde.");
      } finally {
        setLoadingReadings(false);
      }
    };

    fetchReadings();
  }, [user, authLoading]); // Dependencies

  if (authLoading || loadingReadings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] w-full">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-lg text-muted-foreground">Cargando tus memorias místicas...</p>
      </div>
    );
  }

  if (!user) { // This check is after authLoading is false
    return (
      <div className="text-center p-6 bg-card rounded-lg shadow-md border border-input w-full">
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Acceso Requerido</h2>
        <p className="text-muted-foreground mb-4">
          Debes iniciar sesión para ver tus lecturas guardadas.
        </p>
        <Button onClick={() => router.push('/auth')} variant="outline">
          Ir a Ingreso / Registro
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 bg-destructive/10 rounded-lg shadow-md border border-destructive w-full">
        <AlertTriangle className="h-10 w-10 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-destructive mb-2">Error al Cargar</h2>
        <p className="text-destructive/80">{error}</p>
      </div>
    );
  }

  if (readings.length === 0) {
    return (
      <div className="text-center p-6 bg-card rounded-lg shadow-md border border-input w-full">
        <Inbox className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Aún no Hay Ecos del Oráculo</h2>
        <p className="text-muted-foreground mb-6">
          Parece que todavía no has guardado ninguna lectura.
        </p>
        <Button onClick={() => router.push('/consulta')} className="text-lg">
          Comenzar una Nueva Consulta
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full">
      {readings.map(reading => (
        <PastReadingCard key={reading.id} reading={reading} />
      ))}
    </div>
  );
};

export default UserReadingsClient;
