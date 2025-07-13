
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
      }, 1800); // Animation duration
    }, 3200); // Stay on screen for 3.2s + 1.8s animation = 5s total

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-all duration-[1800ms] ease-out ${
        isAnimating ? '-translate-y-full opacity-0' : 'opacity-100'
      }`}
    >
      <div 
        className={`font-archivo-black text-6xl md:text-8xl text-primary font-black ${
          isAnimating ? 'animate-[logoBounce_1.8s_ease-out_forwards]' : ''
        }`}
      >
        The Grid.
      </div>
    </div>
  );
};
