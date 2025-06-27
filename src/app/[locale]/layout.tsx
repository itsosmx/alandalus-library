import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata, generateStructuredData } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
});
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Generate structured data for the organization
  const organizationData = generateStructuredData("organization", {});
  const websiteData = generateStructuredData("website", {});

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <JsonLd data={organizationData} />
      <JsonLd data={websiteData} />
      <body className={`${cairo.variable} antialiased`}>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const title = t("app.name");
  const description = t("app.description");
  const url = `https://alandalus-library.com/${locale}`;

  return generatePageMetadata({
    title,
    description,
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
    url,
    locale,
    type: "website",
  });
}
