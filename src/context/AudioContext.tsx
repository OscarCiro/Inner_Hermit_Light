
"use client";

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  duration: number;
  currentTime: number;
  audioLoaded: boolean;
  togglePlayPause: () => void;
  setVolumeLevel: (level: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
  src: string;
  loop?: boolean;
  initialVolume?: number;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({
  children,
  src,
  loop = true,
  initialVolume = 0.3,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(true); // Intentar reproducir por defecto
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false); 

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
    };
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && audioLoaded) {
      audioElement.volume = isMuted ? 0 : volume;
      audioElement.loop = loop;

      if (isPlaying) {
        // Permitir reproducción si el usuario interactuó O si es el primer intento de autoplay
        if (userInteracted || !autoplayAttempted) { 
          audioElement.play()
            .then(() => {
              if (!userInteracted && !autoplayAttempted) {
                 // Si el autoplay tuvo éxito sin interacción previa
                 setUserInteracted(true); // Tratar autoplay exitoso como interacción
              }
            })
            .catch(error => {
              console.warn("La reproducción de audio falló:", error);
              // Si la reproducción falla (ej. autoplay prevenido), actualiza isPlaying a false
              if (!userInteracted && !autoplayAttempted) { // Solo si fue un intento de autoplay no interactuado
                setIsPlaying(false);
              } else if (userInteracted && audioElement.paused) {
                // Si el usuario intentó reproducir manualmente y falló, refleja el estado pausado
                setIsPlaying(false);
              }
            });
          if (!autoplayAttempted) {
            setAutoplayAttempted(true);
          }
        }
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, userInteracted, audioLoaded, volume, isMuted, loop, autoplayAttempted]);


  const togglePlayPause = useCallback(() => {
    if (!audioLoaded && audioRef.current) {
      audioRef.current.load(); 
    }
    setIsPlaying(prev => !prev);
    if (!userInteracted) {
      setUserInteracted(true); 
      setAutoplayAttempted(true); // Cualquier control manual supera el intento de autoplay
    }
  }, [audioLoaded, userInteracted]);

  const setVolumeLevel = useCallback((level: number) => {
    const newVolume = Math.max(0, Math.min(1, level));
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
    if (!userInteracted) setUserInteracted(true);
  }, [isMuted, userInteracted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    if (!userInteracted) setUserInteracted(true);
  }, [userInteracted]);

  const seek = useCallback((time: number) => {
    if (audioRef.current && audioLoaded) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
    if (!userInteracted) setUserInteracted(true);
  }, [duration, audioLoaded, userInteracted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
      // La lógica de autoplay ahora está principalmente en el useEffect principal
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      // Si HTML5 loop es true, se encarga automáticamente.
      // Si loop es false en props y el audio termina, isPlaying debería ser false.
      if (!loop) { 
        setIsPlaying(false);
      }
    };
    const handleAudioPlay = () => {
        // Sincronizar estado si es reproducido externamente o por loop HTML5
        if (!isPlaying && audio.loop && !audio.paused) setIsPlaying(true);
    };
    const handleAudioPause = () => {
        // Sincronizar estado si es pausado externamente
        if (isPlaying && audio.paused) setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handleAudioPlay);
    audio.addEventListener('pause', handleAudioPause);
    
    // Reiniciar autoplayAttempted si cambia el src
    setAutoplayAttempted(false); 

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handleAudioPlay);
      audio.removeEventListener('pause', handleAudioPause);
    };
  }, [src, loop]); // loop es dependencia para el comportamiento del loop HTML5

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        volume,
        isMuted,
        duration,
        currentTime,
        audioLoaded,
        togglePlayPause,
        setVolumeLevel,
        toggleMute,
        seek,
      }}
    >
      <audio ref={audioRef} src={src} playsInline className="hidden" />
      {children}
    </AudioContext.Provider>
  );
};
