
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Articles', path: '/articles' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Events', path: '/events' },
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
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center transition-all duration-200 hover:scale-105 group">
            <img 
              src="/lovable-uploads/logo.webp" 
              alt="The Grid Logo" 
              className="h-12 w-auto transition-transform duration-200 group-hover:rotate-3 rounded-lg"
              loading="eager"
              decoding="async"
            />
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

          {/* Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Authentication Buttons */}
            {!loading && (
              <div className="hidden sm:flex items-center space-x-3">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 hover:bg-accent/50 rounded-xl">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={profile?.avatar_url || ''} />
                          <AvatarFallback>
                            {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {profile?.full_name || user.email?.split('@')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      asChild
                      className="transition-all duration-200 hover:scale-105 rounded-xl"
                    >
                      <Link to="/auth">Sign in</Link>
                    </Button>
                    <Button 
                      asChild
                      className="transition-all duration-200 hover:scale-105 rounded-xl"
                    >
                      <Link to="/auth?mode=signup">Sign up</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}

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
                
                {/* Mobile Auth */}
                <div className="border-t border-border pt-3 mt-3">
                  {!loading && (
                    user ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 px-3 py-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback>
                              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {profile?.full_name || user.email?.split('@')[0]}
                          </span>
                         </div>
                         <Button
                           variant="ghost"
                           asChild
                           className="w-full justify-start rounded-xl"
                           onClick={handleNavClick}
                         >
                           <Link to="/profile">
                             <User className="mr-2 h-4 w-4" />
                             Profile
                           </Link>
                         </Button>
                         <Button
                           variant="ghost"
                           onClick={signOut}
                           className="w-full justify-start rounded-xl"
                         >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          asChild
                          className="w-full justify-start rounded-xl"
                          onClick={handleNavClick}
                        >
                          <Link to="/auth">Sign in</Link>
                        </Button>
                        <Button 
                          asChild
                          className="w-full rounded-xl"
                          onClick={handleNavClick}
                        >
                          <Link to="/auth?mode=signup">Sign up</Link>
                        </Button>
                      </div>
                    )
                  )}
                </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
