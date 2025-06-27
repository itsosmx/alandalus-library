import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return generatePageMetadata({
    title: t("title"),
    description: t("description"),
    keywords: locale === "ar"
      ? [
        "منتجات مكتبية",
        "أدوات الكتابة",
        "قرطاسية",
        "دفاتر",
        "أقلام",
        "لوازم مدرسية",
        "حقائب",
        "أدوات هندسة"
      ]
      : [
        "office products",
        "writing tools",
        "stationery",
        "notebooks",
        "pens",
        "school supplies",
        "bags",
        "engineering tools"
      ],
    url: `/${locale}/products`,
    locale,
    type: "website",
  });
}

export default function ProductsMetadata() {
  return null;
}
