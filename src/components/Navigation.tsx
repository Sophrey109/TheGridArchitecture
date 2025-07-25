
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Articles', path: '/articles' },
    { name: 'Jobs', path: '/jobs' },
    // Hidden from public: { name: 'Competitions', path: '/competitions' },
    // Hidden from public: { name: 'Exhibitions', path: '/exhibitions' },
    { name: 'Contact', path: '/contact' },
  ];

  const learningItems = [
    // Hidden from public: { name: 'Learning Resources', path: '/learning' },
    { name: 'Ask an Architect', path: '/ask-architect' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-b border-border/50 z-50 transition-all duration-300 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 transition-all duration-200 hover:scale-105 group">
            <img 
              src="/lovable-uploads/0d73e977-70c4-4609-b185-cc59495dd31a.png" 
              alt="The Grid Logo" 
              className="h-10 w-auto transition-transform duration-200 group-hover:rotate-3 rounded-lg"
            />
            <span className="font-editorial text-2xl font-bold text-foreground bg-gradient-primary bg-clip-text text-transparent">
              The Grid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`nav-link font-sans text-sm font-medium transition-all duration-200 hover:text-primary relative ${
                  isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
                onClick={handleNavClick}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute -bottom-6 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"></span>
                )}
              </Link>
            ))}
            
          </div>

          {/* Search and Menu */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center space-x-2 animate-fade-in">
                  <Input
                    type="text"
                    placeholder="Search articles, jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 h-10 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl transition-all duration-200 focus:bg-background focus:border-border"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    className="transition-all duration-200 hover:scale-110 hover:bg-accent/50 rounded-xl"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="transition-all duration-200 hover:scale-110 hover:bg-accent/50 rounded-xl"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="glass"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="transition-all duration-200 hover:scale-110 rounded-xl"
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
