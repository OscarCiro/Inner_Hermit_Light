
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);


  useEffect(() => {
    if (audioRef.current && userInteracted && audioLoaded) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.warn("Audio play interrupted:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, userInteracted, audioLoaded]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlayPause = useCallback(() => {
    if (!audioLoaded && audioRef.current) {
      // Attempt to load if not loaded
      audioRef.current.load(); 
    }
    setIsPlaying(prev => !prev);
    if (!userInteracted) setUserInteracted(true); // Assume interaction if controls are used
  }, [audioLoaded, userInteracted]);

  const setVolumeLevel = useCallback((level: number) => {
    const newVolume = Math.max(0, Math.min(1, level));
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
  }, [duration]);

  // Audio element event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
      // Attempt to play if user has interacted and isPlaying is true
      if (userInteracted && isPlaying) {
         audio.play().catch(e => console.warn("Autoplay after metadata failed:", e));
      }
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
        if (loop) {
            audio.currentTime = 0;
            audio.play().catch(e => console.warn("Loop play failed:", e));
        } else {
            setIsPlaying(false);
        }
    };
    const handleVolumeChange = () => {
      if (audio) { // Check if audio is defined
        setVolume(audio.volume);
        setIsMuted(audio.muted);
      }
    };


    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('volumechange', handleVolumeChange);

    // Initial setup
    audio.loop = loop;
    audio.volume = isMuted ? 0 : volume;


    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [src, loop, userInteracted, isPlaying, volume, isMuted]);


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
