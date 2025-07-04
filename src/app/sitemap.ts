import { MetadataRoute } from 'next'
import { get_products } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://alandalus-library.netlify.app'

  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ]

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = []

  try {
    const response = await get_products();
    const products = response.data?.products || [];


    productPages = products.flatMap((product: any) => [
      {
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(product.updatedAt || product.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      },
      // {
      //   url: `${baseUrl}/en/products/${product.id}`,
      //   lastModified: new Date(product.updatedAt || product.createdAt),
      //   changeFrequency: 'weekly' as const,
      //   priority: 0.6,
      // },
    ])
  } catch (error) {
    console.error('Error generating sitemap for products:', error)
  }

  return [...staticPages, ...productPages]
}
