
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  structuredData?: object;
  alternateUrls?: { lang: string; url: string }[];
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  canonical?: string;
  additionalMeta?: { name?: string; property?: string; content: string }[];
}

export const SEOHead = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  structuredData,
  alternateUrls = [],
  author = 'Directorio Global de Escuelas de Cocina',
  publishedTime,
  modifiedTime,
  locale = 'es_ES',
  siteName = 'Directorio Global de Escuelas de Cocina',
  twitterCard = 'summary_large_image',
  noIndex = false,
  canonical,
  additionalMeta = []
}: SEOHeadProps) => {
  const baseUrl = 'https://escuelasdecocina.com';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const canonicalUrl = canonical || fullUrl;
  const fullImage = image ? `${baseUrl}${image}` : `${baseUrl}/og-default.jpg`;

  // Generate rich title with branding
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  // Optimize description length for SEO
  const optimizedDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <html lang={locale.split('_')[0]} />
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1"} />
      <meta name="googlebot" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Viewport and Mobile Optimization */}
      <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#0EA5E9" />

      {/* Geographic and Language Meta */}
      <meta name="geo.region" content="ES" />
      <meta name="geo.placename" content="España" />
      <meta name="language" content={locale.split('_')[0]} />
      <meta name="content-language" content={locale.split('_')[0]} />

      {/* Alternate Language URLs */}
      {alternateUrls.map(alt => (
        <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@escuelascocina" />
      <meta name="twitter:creator" content="@escuelascocina" />

      {/* WhatsApp Optimization */}
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:secure_url" content={fullImage} />

      {/* LinkedIn Optimization */}
      <meta property="og:see_also" content={fullUrl} />

      {/* Additional Performance and SEO Meta Tags */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://images.unsplash.com" />

      {/* Additional custom meta tags */}
      {additionalMeta.map((meta, index) => (
        <meta 
          key={index}
          {...(meta.name ? { name: meta.name } : { property: meta.property })}
          content={meta.content}
        />
      ))}

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};
