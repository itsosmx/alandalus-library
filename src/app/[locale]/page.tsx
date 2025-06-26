"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ArrowRight, MessageCircle, Pen, Calculator, Ruler } from "lucide-react";
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
        setFeaturedProducts(products?.slice(0, 6));
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
      <motion.section 
        className="relative py-16 lg:py-24" 
        initial="hidden" 
        animate="visible" 
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Star className="w-4 h-4" />
                  {t("welcome")}
                </div>
                
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                  {t("hero.title")}
                  <br />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {t("hero.titleHighlight")}
                  </span>
                </h1>
                
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl">
                  {t("hero.description")}
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-emerald-500/25"
                  onClick={() => handleWhatsAppContact(t("whatsapp.message"))}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t("hero.whatsappCta")}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                >
                  {t("hero.browseCollection")}
                </Button>
              </motion.div>
            </div>

            {/* Right Visual */}
            <div className="lg:col-span-5">
              <motion.div 
                variants={itemVariants}
                className="relative"
              >
                {/* Main Book Stack */}
                <div className="relative max-w-md mx-auto lg:mx-0 lg:ml-auto">
                  {/* Stack of Books */}
                  <div className="relative">
                    {/* Book 1 - Back */}
                    <motion.div
                      className="absolute top-0 left-4 w-48 h-64 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg shadow-2xl transform rotate-3"
                      animate={{ rotate: [3, 5, 3] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className="absolute inset-2 bg-white/10 rounded backdrop-blur-sm">
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="h-2 bg-white/60 rounded w-3/4"></div>
                            <div className="h-2 bg-white/40 rounded w-1/2"></div>
                          </div>
                          <div className="h-32 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Book 2 - Middle */}
                    <motion.div
                      className="absolute top-2 left-8 w-48 h-64 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg shadow-2xl transform -rotate-2"
                      animate={{ rotate: [-2, 0, -2] }}
                      transition={{ duration: 5, repeat: Infinity }}
                    >
                      <div className="absolute inset-2 bg-white/10 rounded backdrop-blur-sm">
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="h-2 bg-white/60 rounded w-2/3"></div>
                            <div className="h-2 bg-white/40 rounded w-3/4"></div>
                          </div>
                          <div className="h-32 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Book 3 - Front */}
                    <motion.div
                      className="relative w-48 h-64 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg shadow-2xl transform rotate-1"
                      animate={{ rotate: [1, -1, 1] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    >
                      <div className="absolute inset-2 bg-white/10 rounded backdrop-blur-sm">
                        <div className="p-4 h-full flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="h-2 bg-white/60 rounded w-4/5"></div>
                            <div className="h-2 bg-white/40 rounded w-3/5"></div>
                          </div>
                          <div className="h-32 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-6 h-6 bg-yellow-400 rounded-full shadow-lg"
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                  />
                  
                  <motion.div
                    className="absolute -bottom-6 -left-6 w-4 h-4 bg-pink-400 rounded-full shadow-lg"
                    animate={{
                      x: [0, 8, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                    }}
                  />

                  <motion.div
                    className="absolute top-16 -right-8 w-3 h-3 bg-blue-400 rounded-full shadow-lg"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </div>

                {/* Background Decoration */}
                <div className="absolute inset-0 -z-10">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-30"></div>
                </div>
              </motion.div>
            </div>
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
