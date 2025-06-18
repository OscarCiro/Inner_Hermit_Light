
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogIn, LogOut, UserCircle, Loader2, ScrollText, Play, Pause, Volume2, Volume1, VolumeX } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from '@/lib/utils';

const HeaderAudioControl: React.FC = () => {
  const { 
    isPlaying, 
    volume, 
    isMuted, 
    togglePlayPause, 
    setVolumeLevel, 
    toggleMute,
    audioLoaded 
  } = useAudio();

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume > 0.5 ? Volume2 : Volume1;

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={togglePlayPause}
        className="h-7 w-7 sm:h-8 sm:w-8 text-primary hover:bg-primary/10"
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        disabled={!audioLoaded}
      >
        {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={!audioLoaded ? undefined : toggleMute} // Allow mute toggle directly if not opening popover for volume
            className="h-7 w-7 sm:h-8 sm:w-8 text-primary hover:bg-primary/10"
            aria-label={isMuted ? "Quitar silencio" : "Silenciar"}
            disabled={!audioLoaded}
          >
            <VolumeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 bg-card/80 backdrop-blur-sm border-primary/30">
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setVolumeLevel(value[0] / 100)}
            className={cn("[&>span:first-child]:bg-primary", {"opacity-50": !audioLoaded})}
            thumbClassName="bg-accent border-accent-foreground"
            disabled={!audioLoaded}
            aria-label="Control de volumen"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};


const Header: React.FC = () => {
  const { user, logOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-2 sm:px-4">
        <Link href="/" className="mr-2 sm:mr-6 flex items-center space-x-2">
          <span className="font-bold text-sm sm:text-lg text-primary">Luz del Ermitaño</span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-2">
          <HeaderAudioControl />
          <nav className="flex items-center gap-1 sm:gap-2"> {/* Adjusted gap for smaller screens */}
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <>
                <Link href="/mis-lecturas" passHref>
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                    <ScrollText className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    Mis Lecturas
                  </Button>
                </Link>
                {/* <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
                  {user.email}
                </span> */}
                <Button variant="ghost" size="sm" onClick={logOut} className="text-xs sm:text-sm px-2 sm:px-3">
                  <LogOut className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Salir
                </Button>
              </>
            ) : (
              <Link href="/auth" passHref>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                  <LogIn className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                  Ingresar
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
