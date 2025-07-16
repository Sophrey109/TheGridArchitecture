
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Articles', path: '/articles' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Competitions', path: '/competitions' },
    { name: 'Contact', path: '/contact' },
  ];

  const learningItems = [
    { name: 'Learning Resources', path: '/learning' },
    { name: 'Ask an Architect', path: '/ask-architect' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50 transition-all duration-300 shadow-medium rounded-b-xl mx-4 mt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 transition-transform duration-200 hover:scale-105">
            <img 
              src="/lovable-uploads/0d73e977-70c4-4609-b185-cc59495dd31a.png" 
              alt="The Grid Logo" 
              className="h-10 w-auto"
            />
            <span className="font-archivo-black text-2xl font-black text-foreground">
              The Grid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link font-sans text-sm font-medium hover:text-primary ${
                  isActive(item.path) 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-muted-foreground'
                }`}
                onClick={handleNavClick}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Learning Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`nav-link font-sans text-sm font-medium hover:text-primary flex items-center space-x-1 ${
                    learningItems.some(item => isActive(item.path))
                      ? 'text-primary border-b-2 border-primary pb-1' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <span>Learning</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border">
                {learningItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.path}
                      className="w-full cursor-pointer"
                      onClick={handleNavClick}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search and Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center space-x-2 animate-fade-in">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="w-64 h-10 transition-all duration-200"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSearchOpen(false)}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden transition-transform duration-200 hover:scale-110"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-border animate-slide-up">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-3 py-2 rounded-xl text-base font-medium transition-all duration-200 shadow-soft ${
                    isActive(item.path)
                      ? 'bg-accent text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                  onClick={handleNavClick}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Learning Section in Mobile */}
              <div className="pt-2 border-t border-border/50 mt-2">
                <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Learning
                </div>
                {learningItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-3 py-2 ml-4 rounded-xl text-base font-medium transition-all duration-200 shadow-soft ${
                      isActive(item.path)
                        ? 'bg-accent text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    onClick={handleNavClick}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
