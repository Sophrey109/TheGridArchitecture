
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after a shorter delay for better UX
    const timer = setTimeout(() => {
      setIsAnimating(true);
      // Complete animation after the transition duration
      setTimeout(() => {
        onAnimationComplete();
      }, 800); // Faster animation duration
    }, 500); // Reduced initial delay for better performance

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-all duration-700 ease-in-out ${
        isAnimating ? '-translate-y-full opacity-0' : 'opacity-100'
      }`}
    >
      <div 
        className={`font-archivo-black text-6xl md:text-8xl text-primary font-black transition-all duration-800 ease-in-out ${
          isAnimating ? 'animate-textBounceExit' : 'animate-textBounceEntry'
        }`}
      >
        The Grid.
      </div>
    </div>
  );
};
