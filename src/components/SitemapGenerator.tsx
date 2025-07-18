
import { useEffect } from 'react';
import { generateSitemapXML } from '@/utils/sitemapGenerator';

export const SitemapGenerator = () => {
  useEffect(() => {
    // Generate sitemap and make it available
    const sitemap = generateSitemapXML();
    
    // Create a blob with the sitemap content
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Store the sitemap URL for potential download or access
    console.log('Generated sitemap:', url);
    
    // Cleanup
    return () => URL.revokeObjectURL(url);
  }, []);

  return null; // This component doesn't render anything
};
