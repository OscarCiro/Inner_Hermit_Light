import React from 'react';
import { cn } from '@/lib/utils';
import { LeafMotif } from '@/components/icons/LeafMotif';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "flex-grow flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden",
      className
    )}>
      <div className="absolute top-4 left-4 opacity-20 transform scale-x-[-1]">
        <LeafMotif className="w-24 h-24 text-primary" />
      </div>
      <div className="absolute bottom-4 right-4 opacity-20">
        <LeafMotif className="w-24 h-24 text-primary" />
      </div>
      <div className="w-full max-w-3xl text-center z-10 bg-card/50 backdrop-blur-sm p-6 sm:p-10 rounded-lg shadow-2xl border border-primary/30">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
