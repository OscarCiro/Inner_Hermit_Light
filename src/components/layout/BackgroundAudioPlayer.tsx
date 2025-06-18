
"use client";

import React, { useEffect, useRef } from 'react';

const BackgroundAudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Intentar reproducir audio
      // Los navegadores modernos a menudo restringen la reproducción automática hasta la interacción del usuario.
      // Podemos intentar reproducirlo, y si falla, registrarlo o esperar la interacción.
      audio.volume = 0.3; // Ajustar el volumen si es necesario (0.0 a 1.0)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(_ => {
          // La reproducción automática comenzó
        }).catch(error => {
          console.warn("La reproducción automática del audio de fondo fue prevenida:", error);
          // Opcionalmente, configurar un event listener para la primera interacción del usuario
          const playOnClick = () => {
            if (audio.paused){
                audio.play().catch(e => console.warn("No se pudo reproducir el audio de fondo al hacer clic:", e));
            }
            document.body.removeEventListener('click', playOnClick);
            document.body.removeEventListener('keydown', playOnClick);
          };
          document.body.addEventListener('click', playOnClick, { once: true });
          document.body.addEventListener('keydown', playOnClick, { once: true });

        });
      }
    }
  }, []);

  return (
    <audio ref={audioRef} src="/audio/mystic_background.mp3" loop playsInline className="hidden">
      Tu navegador no soporta el elemento de audio.
    </audio>
  );
};

export default BackgroundAudioPlayer;
