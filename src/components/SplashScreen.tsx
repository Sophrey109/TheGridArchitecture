
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after delay - keep original logo timing
    const timer = setTimeout(() => {
      setIsAnimating(true);
      // Faster transition after logo animation completes
      setTimeout(() => {
        onAnimationComplete();
      }, 1000); // Reduced from 1800ms to 1000ms for faster homepage load
    }, 1200); // Keep original 1200ms delay for logo display

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-all duration-[1000ms] ease-in-out ${
        isAnimating ? '-translate-y-full opacity-0' : 'opacity-100'
      }`}
    >
      <div 
        className={`font-archivo-black text-6xl md:text-8xl text-primary font-black transition-all duration-[1000ms] ease-in-out ${
          isAnimating ? 'animate-[textBounceExit_1.0s_ease-in-out_forwards]' : 'animate-[textBounceEntry_1s_ease-out_forwards]'
        }`}
      >
        The Grid.
      </div>
    </div>
  );
};
