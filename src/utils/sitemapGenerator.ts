
import { schools } from '@/data/schools';
import { generateSlug } from './slugUtils';

export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  alternates?: { lang: string; href: string }[];
}

export const generateSitemap = (): SitemapUrl[] => {
  const baseUrl = 'https://escuelasdecocina.com';
  const today = new Date().toISOString().split('T')[0];
  
  const urls: SitemapUrl[] = [];

  // Homepage
  urls.push({
    loc: baseUrl,
    lastmod: today,
    changefreq: 'weekly',
    priority: '1.0',
    alternates: [
      { lang: 'es', href: baseUrl },
      { lang: 'en', href: baseUrl }
    ]
  });

  // School pages
  schools.forEach(school => {
    const slug = generateSlug(school.name);
    
    // Spanish version
    urls.push({
      loc: `${baseUrl}/escuela/${slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
      alternates: [
        { lang: 'es', href: `${baseUrl}/escuela/${slug}` },
        { lang: 'en', href: `${baseUrl}/school/${slug}` }
      ]
    });

    // English version
    urls.push({
      loc: `${baseUrl}/school/${slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
      alternates: [
        { lang: 'es', href: `${baseUrl}/escuela/${slug}` },
        { lang: 'en', href: `${baseUrl}/school/${slug}` }
      ]
    });
  });

  return urls;
};

export const generateSitemapXML = (): string => {
  const urls = generateSitemap();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  urls.forEach(url => {
    xml += `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>`;
    
    if (url.alternates) {
      url.alternates.forEach(alt => {
        xml += `
    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`;
      });
    }
    
    xml += `
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
};
