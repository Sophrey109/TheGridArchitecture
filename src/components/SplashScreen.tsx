
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
      <img 
        src="/lovable-uploads/0d73e977-70c4-4609-b185-cc59495dd31a.png"
        alt="Logo"
        className={`w-32 h-32 object-contain transition-all duration-[1800ms] ease-out ${
          isAnimating ? 'transform -translate-y-[50vh] scale-75' : ''
        }`}
      />
    </div>
  );
};
