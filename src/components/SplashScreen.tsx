
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after a brief delay
    const timer = setTimeout(() => {
      setIsAnimating(true);
      // Complete animation after the transition duration
      setTimeout(() => {
        onAnimationComplete();
      }, 1000); // Match the animation duration
    }, 500);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-transform duration-1000 ease-out ${
        isAnimating ? '-translate-y-full' : ''
      }`}
    >
      <div 
        className={`font-mono text-2xl font-bold text-primary transition-all duration-1000 ease-out ${
          isAnimating ? 'transform -translate-y-[50vh] scale-75' : ''
        }`}
      >
        THE GRID
      </div>
    </div>
  );
};
