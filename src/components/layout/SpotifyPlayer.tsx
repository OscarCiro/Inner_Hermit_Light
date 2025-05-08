"use client";

import React, { useEffect, useState } from 'react';

const SpotifyPlayer: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return null or a placeholder during SSR and initial client render
    return null; 
  }

  const playlistId = "37i9dQZF1DWZqd5JICfYwA"; // Example: Peaceful Meditation playlist
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`; // theme=0 for dark theme

  return (
    <div className="fixed bottom-4 right-4 z-50 shadow-xl rounded-lg" aria-label="Reproductor de música de Spotify">
      <iframe
        style={{ borderRadius: '12px' }}
        src={embedUrl}
        width="300" // Standard compact player width
        height="80"  // Compact player height
        frameBorder="0"
        allowFullScreen={false} // Fullscreen not typically needed for a small embed
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
        loading="lazy"
        title="Spotify Music Player"
      ></iframe>
    </div>
  );
};

export default SpotifyPlayer;
