
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut, UserCircle, Loader2, ScrollText } from 'lucide-react'; // Added ScrollText

const Header: React.FC = () => {
  const { user, logOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-lg text-primary">Luz del Ermitaño</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4"> {/* Adjusted gap for smaller screens */}
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : user ? (
            <>
              <Link href="/mis-lecturas" passHref>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
                  <ScrollText className="mr-1 h-4 w-4" />
                  Mis Lecturas
                </Button>
              </Link>
              <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline"> {/* Hidden on small, visible on md and up */}
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logOut} className="text-xs sm:text-sm">
                <LogOut className="mr-1 h-4 w-4" />
                Salir
              </Button>
            </>
          ) : (
            <Link href="/auth" passHref>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <LogIn className="mr-1 h-4 w-4" />
                Ingresar
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
