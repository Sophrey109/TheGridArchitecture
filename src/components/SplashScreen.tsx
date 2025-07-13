
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after a longer delay
    const timer = setTimeout(() => {
      setIsAnimating(true);
      // Complete animation after the transition duration
      setTimeout(() => {
        onAnimationComplete();
      }, 1800); // Longer animation duration
    }, 1000); // Longer initial delay

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-transform duration-[1800ms] ease-out ${
        isAnimating ? '-translate-y-full' : ''
      }`}
    >
      <div 
        className={`font-editorial text-6xl md:text-8xl font-bold text-primary ${
          isAnimating ? 'animate-[logoBounce_1.8s_ease-out_forwards]' : ''
        }`}
      >
        The Grid.
      </div>
    </div>
  );
};
