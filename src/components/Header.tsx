
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, ChefHat, Settings, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const { language, toggleLanguage } = useLanguage();
  const { signOut } = useAuth();
  const { isAuthenticated, isAdmin } = useAdminRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.includes(path);
  };

  const navigationItems = [
    {
      label: language === 'es' ? 'Inicio' : 'Home',
      href: '/',
      key: 'home'
    },
    {
      label: language === 'es' ? 'Directorio' : 'Directory',
      href: '/#directory',
      key: 'directory'
    },
    {
      label: language === 'es' ? 'Sobre Nosotros' : 'About Us',
      href: language === 'es' ? '/sobre-nosotros' : '/about-us',
      key: 'about'
    },
    {
      label: language === 'es' ? 'Contacto' : 'Contact',
      href: language === 'es' ? '/contacto' : '/contact',
      key: 'contact'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-foreground text-lg">
              {language === 'es' ? 'Escuelas de Cocina' : 'Culinary Schools'}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href.replace('/#', '/'))
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Admin Access & Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Admin Panel Access */}
            {isAuthenticated && isAdmin && (
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Admin</span>
                </Button>
              </Link>
            )}
            
            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="hidden md:flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Salir</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center space-x-1"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Admin</span>
                </Button>
              </Link>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex items-center space-x-1"
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="py-4 space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  to={item.href}
                  className={`block text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href.replace('/#', '/'))
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center space-x-1 mt-4"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">{language.toUpperCase()}</span>
              </Button>
              
              {/* Mobile Admin Access */}
              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Panel Admin
                </Link>
              )}
              
              {/* Mobile Auth */}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary text-left"
                >
                  Cerrar Sesión
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Acceso Admin
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
