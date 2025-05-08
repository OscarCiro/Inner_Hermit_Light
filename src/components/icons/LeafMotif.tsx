"use client";
import React from 'react';

export const LeafMotif = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    fill="currentColor"
    {...props}
  >
    <path d="M50,5 C60,15 70,30 70,50 C70,70 60,85 50,95 C40,85 30,70 30,50 C30,30 40,15 50,5 M50,15 C45,25 40,35 40,50 C40,65 45,75 50,85 M50,15 C55,25 60,35 60,50 C60,65 55,75 50,85 M45,48 Q50,45 55,48 L50,60 Z" />
    <path d="M50,5 C40,15 30,30 30,50 C30,70 40,85 50,95" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50,5 C60,15 70,30 70,50 C70,70 60,85 50,95" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <style jsx>{`
      svg {
        filter: drop-shadow(0 0 3px currentColor);
      }
    `}</style>
  </svg>
);
