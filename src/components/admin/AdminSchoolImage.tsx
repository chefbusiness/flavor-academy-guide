import { useSchoolImageIntegration } from '@/hooks/useSchoolImageIntegration';
import { School } from '@/types/school';
import { ImageIcon } from 'lucide-react';

interface AdminSchoolImageProps {
  school: School;
  className?: string;
}

export const AdminSchoolImage = ({ school, className = "w-8 h-8" }: AdminSchoolImageProps) => {
  const { imageSource, isSupabaseImageAvailable, altText } = useSchoolImageIntegration(school);

  return (
    <div className={`${className} bg-muted rounded overflow-hidden flex-shrink-0`}>
      {imageSource ? (
        <img
          src={imageSource}
          alt={altText}
          className="w-full h-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = 'none';
            const placeholder = img.nextElementSibling as HTMLElement;
            if (placeholder) {
              placeholder.style.display = 'flex';
            }
          }}
        />
      ) : null}
      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ display: imageSource ? 'none' : 'flex' }}
      >
        <ImageIcon className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};