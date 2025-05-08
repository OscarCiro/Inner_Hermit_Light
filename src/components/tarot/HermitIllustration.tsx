import Image from 'next/image';
import React from 'react';
import hermitImage from '../../images/ermitaño.png';

export const HermitIllustration: React.FC = () => {
  return (
    <div className="my-8 flex justify-center">
      <Image
        src={hermitImage}
        alt="El Ermitaño"
        width={200}
        height={300}
        className="rounded-lg shadow-xl border-2 border-primary/50 object-cover"
        data-ai-hint="hermit tarot art nouveau"
      />
    </div>
  );
};
