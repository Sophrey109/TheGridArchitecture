
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after a longer delay to stay on screen for 5 seconds
    const timer = setTimeout(() => {
      setIsAnimating(true);
      // Complete animation after the transition duration
      setTimeout(() => {
        onAnimationComplete();
      }, 2000); // Longer animation duration for smoother exit
    }, 3000); // Stay on screen for 3s + 2s animation = 5s total

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-all duration-[2000ms] ease-in-out ${
        isAnimating ? '-translate-y-full opacity-0' : 'opacity-100'
      }`}
    >
      <div 
        className={`font-archivo-black text-6xl md:text-8xl text-primary font-black transition-all duration-[2000ms] ease-in-out ${
          isAnimating ? 'animate-[logoBounce_2s_ease-in-out_forwards]' : ''
        }`}
      >
        The Grid.
      </div>
    </div>
  );
};
