"use client";

import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: string;
  y: string;
  size: string;
  duration: string;
  delay: string;
}

export const AnimatedBackgroundStars: React.FC = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const numStars = 50; // Adjust for more/less stars
    const newStars: Star[] = [];
    for (let i = 0; i < numStars; i++) {
      newStars.push({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: `${Math.random() * 2 + 1}px`, // Star size between 1px and 3px
        duration: `${Math.random() * 3 + 2}s`, // Animation duration between 2s and 5s
        delay: `${Math.random() * 2}s`, // Animation delay up to 2s
      });
    }
    setStars(newStars);
  }, []);

  return (
    <div className="star-animation" aria-hidden="true">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.x,
            top: star.y,
            // CSS variables for animation properties
            ['--star-size' as string]: star.size,
            ['--star-duration'as string]: star.duration,
            ['--star-delay'as string]: star.delay,
          }}
        />
      ))}
    </div>
  );
};
