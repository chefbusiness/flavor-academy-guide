
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, ChefHat, Settings, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isAuthenticated = !!user;

  const navItems = [
    { key: 'home', href: '/' },
    { key: 'directory', href: '/' },
    { key: 'about', href: '/about' },
    { key: 'contact', href: '/contact' }
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-gradient">
              Escuelas de Cocina
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          {/* Auth Controls & Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Admin Panel Access - Only for authenticated admins */}
            {isAuthenticated && isAdmin && (
              <Link to="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">{t('adminPanel')}</span>
                </Button>
              </Link>
            )}

            {/* Logout for authenticated users or Login for non-authenticated */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hidden md:flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">{t('logout')}</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">{t('login')}</span>
                </Button>
              </Link>
            )}

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden md:flex items-center space-x-1"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{language.toUpperCase()}</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <nav className="flex flex-col space-y-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === item.href
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(item.key)}
                </Link>
              ))}
              
              {/* Mobile Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="justify-start px-0"
              >
                <Globe className="h-4 w-4 mr-2" />
                <span className="text-sm">{language.toUpperCase()}</span>
              </Button>
              
              {/* Mobile Admin Access - Only for authenticated admins */}
              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('adminPanel')}
                </Link>
              )}

              {/* Mobile Auth Controls */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary text-left"
                >
                  {t('logout')}
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
