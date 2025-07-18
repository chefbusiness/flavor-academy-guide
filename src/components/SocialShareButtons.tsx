
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';

interface SocialShareButtonsProps {
  schoolName: string;
  description: string;
  url: string;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  schoolName,
  description,
  url
}) => {
  const { language } = useLanguage();
  const [copied, setCopied] = useState(false);

  const shareText = language === 'es' 
    ? `Descubre ${schoolName} - ${description}`
    : `Discover ${schoolName} - ${description}`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
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
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>{language === 'es' ? 'Compartir' : 'Share'}</span>
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareUrls.facebook, '_blank', 'width=600,height=400')}
        className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
      >
        <Facebook className="w-4 h-4 text-blue-600" />
        <span className="hidden sm:inline">Facebook</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareUrls.twitter, '_blank', 'width=600,height=400')}
        className="flex items-center space-x-2 bg-sky-50 hover:bg-sky-100 border-sky-200"
      >
        <Twitter className="w-4 h-4 text-sky-600" />
        <span className="hidden sm:inline">Twitter</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareUrls.linkedin, '_blank', 'width=600,height=400')}
        className="flex items-center space-x-2 bg-blue-50 hover:bg-blue-100 border-blue-200"
      >
        <Linkedin className="w-4 h-4 text-blue-700" />
        <span className="hidden sm:inline">LinkedIn</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => window.open(shareUrls.whatsapp, '_blank')}
        className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 border-green-200"
      >
        <MessageCircle className="w-4 h-4 text-green-600" />
        <span className="hidden sm:inline">WhatsApp</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyLink}
        className="flex items-center space-x-2"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {copied 
            ? (language === 'es' ? 'Copiado' : 'Copied')
            : (language === 'es' ? 'Copiar enlace' : 'Copy link')
          }
        </span>
      </Button>
    </div>
  );
};
