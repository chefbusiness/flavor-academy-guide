
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Facebook, 
  Linkedin, 
  MessageCircle,
  Copy,
  Check,
  X
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FloatingSocialShareProps {
  schoolName: string;
  description: string;
  url: string;
}

export const FloatingSocialShare: React.FC<FloatingSocialShareProps> = ({
  schoolName,
  description,
  url
}) => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = language === 'es' 
    ? `Descubre ${schoolName} - ${description}`
    : `Discover ${schoolName} - ${description}`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${url}`)}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: schoolName,
          text: shareText,
          url: url,
        });
        setIsOpen(false);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const toggleShare = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating main button */}
      <div className="relative">
        {/* Share options - appear when open */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-2 animate-fade-in">
            {/* Native share button (if supported) */}
            {navigator.share && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleNativeShare}
                className="w-12 h-12 rounded-full shadow-lg bg-background hover:bg-accent"
                title={language === 'es' ? 'Compartir' : 'Share'}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            )}
            
            {/* Copy link */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyLink}
              className="w-12 h-12 rounded-full shadow-lg bg-background hover:bg-accent"
              title={copied 
                ? (language === 'es' ? 'Copiado' : 'Copied')
                : (language === 'es' ? 'Copiar enlace' : 'Copy link')
              }
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>

            {/* WhatsApp */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(shareUrls.whatsapp, '_blank');
                setIsOpen(false);
              }}
              className="w-12 h-12 rounded-full shadow-lg bg-green-50 hover:bg-green-100 border-green-200"
              title="WhatsApp"
            >
              <MessageCircle className="w-5 h-5 text-green-600" />
            </Button>

            {/* LinkedIn */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(shareUrls.linkedin, '_blank', 'width=600,height=400');
                setIsOpen(false);
              }}
              className="w-12 h-12 rounded-full shadow-lg bg-blue-50 hover:bg-blue-100 border-blue-200"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5 text-blue-700" />
            </Button>

            {/* X (formerly Twitter) */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(shareUrls.x, '_blank', 'width=600,height=400');
                setIsOpen(false);
              }}
              className="w-12 h-12 rounded-full shadow-lg bg-gray-50 hover:bg-gray-100 border-gray-200"
              title="X (Twitter)"
            >
              <X className="w-5 h-5 text-gray-800" />
            </Button>

            {/* Facebook */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                window.open(shareUrls.facebook, '_blank', 'width=600,height=400');
                setIsOpen(false);
              }}
              className="w-12 h-12 rounded-full shadow-lg bg-blue-50 hover:bg-blue-100 border-blue-200"
              title="Facebook"
            >
              <Facebook className="w-5 h-5 text-blue-600" />
            </Button>
          </div>
        )}

        {/* Main floating button */}
        <Button
          onClick={toggleShare}
          size="icon"
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
            isOpen ? 'rotate-45 bg-gray-600 hover:bg-gray-700' : 'bg-primary hover:bg-primary/90'
          }`}
          title={language === 'es' ? 'Compartir' : 'Share'}
        >
          <Share2 className="w-6 h-6" />
        </Button>
      </div>

      {/* Backdrop to close when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
