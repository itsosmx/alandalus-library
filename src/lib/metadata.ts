import { Metadata } from 'next';

interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  locale?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  price?: number;
  currency?: string;
  availability?: 'in_stock' | 'out_of_stock';
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url,
  locale = 'ar',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  price,
  currency = 'SAR',
  availability = 'in_stock',
}: MetadataProps): Metadata {
  const siteName = locale === 'ar' ? 'مكتبة الأندلس' : 'Al-Andalus Library';
  const baseUrl = 'https://alandalus-library.com';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  
  const defaultKeywords = locale === 'ar' 
    ? [
        'مكتبة الأندلس',
        'أدوات مكتبية',
        'قرطاسية',
        'لوازم مدرسية',
        'أقلام',
        'دفاتر',
        'مستلزمات تعليمية',
        'أدوات الكتابة',
        'حقائب مدرسية',
        'السعودية'
      ]
    : [
        'Al-Andalus Library',
        'office supplies',
        'stationery',
        'school supplies',
        'pens',
        'notebooks',
        'educational materials',
        'writing tools',
        'school bags',
        'Saudi Arabia'
      ];

  const allKeywords = [...defaultKeywords, ...keywords];

  const metadata: Metadata = {
    title: title ? `${title} | ${siteName}` : siteName,
    description,
    keywords: allKeywords,
    authors: author ? [{ name: author }] : [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
      languages: {
        'ar': fullUrl.replace('/en/', '/ar/'),
        'en': fullUrl.replace('/ar/', '/en/'),
      },
    },
    openGraph: {
      title: title || siteName,
      description,
      url: fullUrl,
      siteName,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: type === 'product' ? 'website' : type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || siteName,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title: title || siteName,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };

  // Add product-specific Open Graph data for product pages
  if (type === 'product' && price) {
    // Note: Using website type for OpenGraph compatibility
    // Product schema will be handled via JSON-LD structured data
  }

  return metadata;
}

export function generateStructuredData(type: 'organization' | 'product' | 'website', data: any) {
  const baseUrl = 'https://alandalus-library.com';
  
  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'مكتبة الأندلس',
        alternateName: 'Al-Andalus Library',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          // Add social media URLs when available
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          availableLanguage: ['Arabic', 'English'],
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'SA',
          // Add specific address when available
        },
      };

    case 'product':
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.images?.map((img: any) => img.url) || [],
        brand: {
          '@type': 'Brand',
          name: 'مكتبة الأندلس',
        },
        offers: {
          '@type': 'Offer',
          price: data.price,
          priceCurrency: 'SAR',
          availability: data.inStock 
            ? 'https://schema.org/InStock' 
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'مكتبة الأندلس',
          },
        },
        aggregateRating: data.rating && {
          '@type': 'AggregateRating',
          ratingValue: data.rating.average,
          reviewCount: data.rating.count,
        },
      };

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'مكتبة الأندلس',
        alternateName: 'Al-Andalus Library',
        url: baseUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/products?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['ar', 'en'],
      };

    default:
      return null;
  }
}
