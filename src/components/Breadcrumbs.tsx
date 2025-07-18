
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 bg-background/95 backdrop-blur-sm rounded-lg border border-border/50 px-4 py-3 shadow-sm">
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors text-foreground/80 hover:text-foreground"
      >
        <Home className="w-4 h-4 mr-1" />
        {t('home')}
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          {item.href ? (
            <Link 
              to={item.href} 
              className="hover:text-primary transition-colors text-foreground/80 hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
