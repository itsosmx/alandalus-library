import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { get_products } from "@/lib/api";

interface Product {
  id: string;
  name: string;
  price: number;
  sale?: number;
  images: {
    id: string;
    url: string;
  }[];
  inStock: boolean;
  createdAt: string;
  description: {
    text: string;
  };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    console.log(params);

    const response = await get_products();
    const products = response.data?.products || [];
    const product = products.find((p: Product) => p.id === id);

    if (!product) {
      return generatePageMetadata({
        title: locale === "ar" ? "المنتج غير موجود" : "Product Not Found",
        description: locale === "ar" ? "لم يتم العثور على المنتج المطلوب" : "The requested product was not found.",
        url: `/${locale}/products/${id}`,
        locale,
      });
    }

    const title = product.name;
    const description =
      product.description?.text ||
      (locale === "ar"
        ? `اكتشف ${product.name} بسعر ${product.sale || product.price} ريال سعودي في مكتبة الأندلس`
        : `Discover ${product.name} for ${product.sale || product.price} SAR at Al-Andalus Library`);

    return generatePageMetadata({
      title,
      description,
      keywords:
        locale === "ar"
          ? [product.name, "أدوات مكتبية", "قرطاسية", "لوازم مدرسية", "مكتبة الأندلس"]
          : [product.name, "office supplies", "stationery", "school supplies", "Al-Andalus Library"],
      image: product.images?.[0]?.url,
      url: `/${locale}/products/${id}`,
      locale,
      type: "product",
      price: product.sale || product.price,
      availability: product.inStock ? "in_stock" : "out_of_stock",
      modifiedTime: product.createdAt,
    });
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return generatePageMetadata({
      title: locale === "ar" ? "خطأ في تحميل المنتج" : "Error Loading Product",
      description: locale === "ar" ? "حدث خطأ أثناء تحميل بيانات المنتج" : "An error occurred while loading product data.",
      url: `/${locale}/products/${id}`,
      locale,
    });
  }
}

export default function layout({ children }: { children: React.ReactNode }) {
  return children;
}
