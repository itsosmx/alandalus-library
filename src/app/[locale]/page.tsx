"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { get_products } from "@/lib/api";
import { handleWhatsAppContact } from "@/lib/utils";
import Link from "next/link";
import ProductCard from "@/components/blocks/product-card";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
    },
  },
};

export default function HomePage() {
  const t = useTranslations("homepage");
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch products on component mount
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await get_products();
        const products = response.data?.products || [];
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.section className="relative overflow-hidden py-20 lg:py-32" initial="hidden" animate="visible" variants={containerVariants}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}>
                <Star className="w-4 h-4" />
                {t("welcome")}
              </motion.div>

              <motion.h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight" variants={itemVariants}>
                {t("hero.title")}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> {t("hero.titleHighlight")}</span>
              </motion.h1>

              <motion.p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed" variants={itemVariants}>
                {t("hero.description")}
              </motion.p>

              <motion.div className="flex flex-col sm:flex-row gap-4" variants={itemVariants}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                  onClick={() => handleWhatsAppContact(t("whatsapp.message"))}>
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t("hero.whatsappCta")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg border-2"
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
                  {t("hero.browseCollection")}
                </Button>
              </motion.div>
            </motion.div>

            <motion.div className="relative" variants={floatVariants} animate="animate">
              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}>
                      <div className="h-24 bg-gradient-to-br from-blue-200 to-purple-200 dark:from-gray-600 dark:to-gray-500 rounded-lg mb-2"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-2/3"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section id="products" className="py-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("products.sectionTitle")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("products.sectionDescription")}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? // Loading skeleton
                Array.from({ length: 6 }, (_, i) => (
                  <motion.div key={i} variants={itemVariants} className="group cursor-pointer">
                    <Card className="overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <div className="relative">
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse"></div>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
                              <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/3"></div>
                              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/4"></div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))
              : featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          <motion.div className="text-center mt-12" variants={itemVariants}>
            <Button asChild size="lg" variant="outline" className="px-8 py-6 text-lg border-2">
              <Link href="/products">
                {t("products.viewAllProducts")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}>
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">{t("cta.title")}</h2>
            <p className="text-xl mb-8 text-blue-100">{t("cta.description")}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                onClick={() => handleWhatsAppContact(t("whatsapp.message"))}>
                <MessageCircle className="w-6 h-6 mr-3" />
                {t("cta.button")}
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
