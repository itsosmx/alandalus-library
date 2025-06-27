import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return generatePageMetadata({
    title: locale === "ar" ? "منتجاتنا" : "Our Products",
    description:
      locale === "ar"
        ? "تسوق من مجموعة واسعة من الأدوات المكتبية عالية الجودة في مكتبة الأندلس. أقلام، دفاتر، حقائب مدرسية، وأدوات تعليمية متنوعة بأسعار منافسة."
        : "Shop from a wide range of high-quality office supplies at Al-Andalus Library. Pens, notebooks, school bags, and various educational tools at competitive prices.",
    keywords:
      locale === "ar"
        ? ["منتجات مكتبية", "أدوات الكتابة", "قرطاسية", "دفاتر", "أقلام", "لوازم مدرسية", "حقائب", "أدوات هندسة", "مستلزمات تعليمية", "أدوات مكتب"]
        : [
            "office products",
            "writing tools",
            "stationery",
            "notebooks",
            "pens",
            "school supplies",
            "bags",
            "engineering tools",
            "educational supplies",
            "office tools",
          ],
    url: `/${locale}/products`,
    locale,
    type: "website",
  });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
