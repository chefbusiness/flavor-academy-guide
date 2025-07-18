
import { useMemo } from 'react';
import { School } from '@/types/school';
import { useLanguage } from '@/contexts/LanguageContext';

export const useStructuredData = () => {
  const { language, t } = useLanguage();

  const generateOrganizationSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Directorio Global de Escuelas de Cocina",
    "alternateName": "Global Culinary Schools Directory",
    "url": "https://escuelasdecocina.com",
    "logo": "https://escuelasdecocina.com/logo.png",
    "description": language === 'es' 
      ? "Directorio completo de las mejores escuelas de cocina, universidades gastronómicas e institutos de hospitalidad del mundo"
      : "Complete directory of the world's best culinary schools, gastronomic universities and hospitality institutes",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/escuelascocina",
      "https://facebook.com/escuelascocina",
      "https://instagram.com/escuelascocina"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "info@escuelasdecocina.com"
    }
  }), [language]);

  const generateSchoolSchema = (school: School) => ({
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `https://escuelasdecocina.com/${language === 'es' ? 'escuela' : 'school'}/${school.id}`,
    "name": school.name,
    "description": school.description,
    "url": school.website,
    "email": school.email,
    "telephone": school.phone,
    "foundingDate": school.founded.toString(),
    "image": school.image,
    "logo": school.image,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": school.address,
      "addressLocality": school.city,
      "addressCountry": t(school.country),
      "postalCode": "00000"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.4168",
      "longitude": "-3.7038"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": school.rating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": Math.floor(school.studentsCount / 10)
    },
    "numberOfStudents": school.studentsCount,
    "hasCredential": school.accreditation.map(acc => ({
      "@type": "EducationalOccupationalCredential",
      "name": acc,
      "credentialCategory": "certification"
    })),
    "offers": school.specialties.map(specialty => ({
      "@type": "Course",
      "name": t(specialty),
      "description": `${t(specialty)} program at ${school.name}`,
      "provider": {
        "@type": "EducationalOrganization",
        "name": school.name
      },
      "courseMode": "full-time",
      "teaches": t(specialty)
    })),
    "alumni": {
      "@type": "Person",
      "name": "Alumni Network"
    },
    "department": school.specialties.map(specialty => ({
      "@type": "EducationalOrganization",
      "name": `${t(specialty)} Department`,
      "parentOrganization": school.name
    })),
    "memberOf": {
      "@type": "Organization",
      "name": "Global Culinary Education Network"
    },
    "accreditedBy": school.accreditation.map(acc => ({
      "@type": "Organization",
      "name": acc
    })),
    "tuition": {
      "@type": "MonetaryAmount",
      "currency": school.tuitionRange.currency,
      "minValue": school.tuitionRange.min,
      "maxValue": school.tuitionRange.max
    },
    "availableLanguage": school.languages,
    "keywords": [
      school.name,
      school.city,
      t(school.country),
      ...school.specialties.map(s => t(s)),
      "escuela de cocina",
      "culinary school",
      "gastronomía",
      "chef"
    ].join(", ")
  });

  const generateBreadcrumbSchema = (items: { name: string; url?: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": item.url })
    }))
  });

  const generateWebsiteSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Directorio Global de Escuelas de Cocina",
    "alternateName": "Global Culinary Schools Directory",
    "url": "https://escuelasdecocina.com",
    "description": language === 'es'
      ? "Encuentra las mejores escuelas de cocina del mundo"
      : "Find the world's best culinary schools",
    "inLanguage": [
      {
        "@type": "Language",
        "alternateName": "es"
      },
      {
        "@type": "Language", 
        "alternateName": "en"
      }
    ],
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://escuelasdecocina.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Directorio Global de Escuelas de Cocina",
      "logo": "https://escuelasdecocina.com/logo.png"
    }
  }), [language]);

  return {
    generateOrganizationSchema,
    generateSchoolSchema,
    generateBreadcrumbSchema,
    generateWebsiteSchema
  };
};
