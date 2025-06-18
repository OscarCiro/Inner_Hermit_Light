
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
  const [isPlaying, setIsPlaying] = useState(true); // Intenta reproducir por defecto
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  // Effect for handling user interaction to unlock audio
  useEffect(() => {
    const handleInteraction = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        // If audio was meant to play but was paused (e.g., autoplay blocked), try playing now
        if (audioRef.current && audioRef.current.paused && isPlaying && audioLoaded) {
          audioRef.current.play().catch(e => {
            console.warn("Play on interaction failed:", e);
            if(audioRef.current && audioRef.current.paused) setIsPlaying(false); // Sync state if still fails
          });
        }
      }
    };

    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [userInteracted, isPlaying, audioLoaded]); // Dependencies for the retry logic

  // Effect for initializing audio element and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (!loop) { // HTML5 audio handles loop=true automatically
        setIsPlaying(false);
      }
    };
    const handlePlayEvent = () => {
      if (!isPlaying) setIsPlaying(true); // Sync React state if audio plays (e.g. via loop)
    };
    const handlePauseEvent = () => {
      if (isPlaying) setIsPlaying(false); // Sync React state if audio pauses
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlayEvent);
    audio.addEventListener('pause', handlePauseEvent);

    // Explicitly load the audio source. Crucial for some browsers/scenarios.
    if (audio.currentSrc !== src || audio.readyState === HTMLMediaElement.HAVE_NOTHING) {
        audio.load();
    }
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlayEvent);
      audio.removeEventListener('pause', handlePauseEvent);
    };
  }, [src, loop]); // isPlaying removed from here as it could cause loop with onPlay/onPause handlers

  // Effect for controlling playback based on React state
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !audioLoaded) return;

    audioElement.volume = isMuted ? 0 : volume;
    audioElement.loop = loop;

    if (isPlaying) {
      const playPromise = audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn("Audio playback failed (possibly due to autoplay policy):", error);
          // If play fails, update state to reflect it's paused.
          if (audioElement.paused) {
            setIsPlaying(false);
          }
        });
      }
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioLoaded, volume, isMuted, loop]);


  const togglePlayPause = useCallback(() => {
    if (!audioLoaded && audioRef.current && audioRef.current.readyState === HTMLMediaElement.HAVE_NOTHING) {
        audioRef.current.load(); // Attempt to load if not loaded at all
    }
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
    if (!userInteracted) {
      setUserInteracted(true);
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
    setIsMuted(prevIsMuted => !prevIsMuted);
    if (!userInteracted) setUserInteracted(true);
  }, [userInteracted]);

  const seek = useCallback((time: number) => {
    if (audioRef.current && audioLoaded) {
      audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
    if (!userInteracted) setUserInteracted(true);
  }, [duration, audioLoaded, userInteracted]);

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
      {/* Ensure the key changes if src changes to force re-creation of the audio element if needed */}
      <audio ref={audioRef} src={src} playsInline className="hidden" key={src} />
      {children}
    </AudioContext.Provider>
  );
};

