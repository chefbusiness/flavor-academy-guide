import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Languages, Menu, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center">
              <span className="text-white font-bold text-sm">CG</span>
            </div>
            <h1 className="text-xl font-bold text-gradient">Culinary Guide</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('home')}
            </a>
            <a href="#directory" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('directory')}
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('about')}
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
              {t('contact')}
            </a>
          </nav>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="hidden sm:flex items-center space-x-2"
            >
              <Languages className="w-4 h-4" />
              <span className="font-medium">{language.toUpperCase()}</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('home')}
              </a>
              <a href="#directory" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('directory')}
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('about')}
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors font-medium">
                {t('contact')}
              </a>
            </nav>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-2 w-full sm:hidden"
            >
              <Languages className="w-4 h-4" />
              <span className="font-medium">{language.toUpperCase()}</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};