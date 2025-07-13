
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { SplashScreen } from './SplashScreen';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  // Only show splash on first visit to home page
  useEffect(() => {
    const isHomePage = location.pathname === '/';
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!isHomePage || hasVisited) {
      setShowSplash(false);
      setHasShownSplash(true);
    }
  }, [location.pathname]);

  // Scroll to top when route changes (except during splash)
  useEffect(() => {
    if (!showSplash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }, [location.pathname, showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setHasShownSplash(true);
    sessionStorage.setItem('hasVisited', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      {showSplash && !hasShownSplash && (
        <SplashScreen onAnimationComplete={handleSplashComplete} />
      )}
      <div className={`transition-opacity duration-500 ${showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Navigation />
        <main className="pt-20">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
