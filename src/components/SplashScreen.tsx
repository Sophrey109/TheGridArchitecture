
import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen = ({ onAnimationComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animation after delay to stay on screen for 3 seconds total
    const timer = setTimeout(() => {
      setIsAnimating(true);
      // Complete animation after the transition duration
      setTimeout(() => {
        onAnimationComplete();
      }, 1800); // Slower animation duration
    }, 1200); // Stay on screen for 1.2s + 1.8s animation = 3s total

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 bg-white flex items-center justify-center transition-all duration-[1500ms] ease-in-out ${
        isAnimating ? '-translate-y-full opacity-0' : 'opacity-100'
      }`}
    >
      <div 
        className={`font-archivo-black text-6xl md:text-8xl text-primary font-black transition-all duration-[1800ms] ease-in-out ${
          isAnimating ? 'animate-[textBounceExit_1.8s_ease-in-out_forwards]' : 'animate-[textBounceEntry_1s_ease-out_forwards]'
        }`}
      >
        The Grid.
      </div>
    </div>
  );
};
