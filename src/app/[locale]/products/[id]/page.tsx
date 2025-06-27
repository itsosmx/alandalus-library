"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BookOpen, MessageCircle, Phone, ArrowLeft, Share2, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { get_products } from "@/lib/api";
import ProductCard from "@/components/blocks/product-card";
import QRCodeShare from "@/components/QRCodeShare";
import { cn, handleWhatsAppContact } from "@/lib/utils";
import { generateStructuredData } from "@/lib/metadata";
import JsonLd from "@/components/JsonLd";

// Product type definition
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.2,
      staggerChildren: 0.1,
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

export default function ProductPage() {
  const t = useTranslations("productPage");
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  // State management
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product and related products
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await get_products();
        const products = response.data?.products || [];

        // Find the current product
        const currentProduct = products.find((p: Product) => p.id === productId);
        setProduct(currentProduct || null);

        // Get related products (excluding current product)
        const related = products.filter((p: Product) => p.id !== productId).slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  // Handle image navigation
  const nextImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image skeleton */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Content skeleton */}
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("notFound.title")}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t("notFound.description")}</p>
            <Button onClick={() => router.push("/products")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("notFound.backToProducts")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount = product.sale && product.sale < product.price;
  const effectivePrice = hasDiscount ? (product.price * (100 - product.sale!)) / 100 : product.price;

  // Generate structured data for the product
  const productStructuredData = generateStructuredData("product", product);

  return (
    <>
      {/* Structured Data */}
      {productStructuredData && <JsonLd data={productStructuredData} />}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <motion.div className="mb-8" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2 hover:bg-white/50 dark:hover:bg-gray-800/50">
              <ArrowLeft className="w-4 h-4" />
              {t("backButton")}
            </Button>
          </motion.div>

          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-12" initial="hidden" animate="visible" variants={containerVariants}>
            {/* Product Images */}
            <motion.div variants={itemVariants} className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <>
                    <img src={product.images[currentImageIndex].url} alt={product.name} className="w-full h-full object-cover" />

                    {/* Image navigation */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 shadow-lg transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-24 h-24 text-gray-400" />
                  </div>
                )}

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg font-medium">
                    {product?.sale}% {t("sale")}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-blue-600 ring-2 ring-blue-600/30"
                          : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                      }`}>
                      <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Product Title */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>

                {/* Rating placeholder - you can add this later */}
                {/* <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-600 dark:text-gray-400 ml-2">(4.8) • {t("rating.reviews", { count: 24 })}</span>
              </div> */}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {Intl.NumberFormat("ar-EG", {
                      style: "currency",
                      currency: "EGP",
                    }).format(effectivePrice)}
                  </span>
                  {!!hasDiscount && (
                    <span className="text-xl text-gray-500 line-through">
                      {Intl.NumberFormat("ar-EG", {
                        style: "currency",
                        currency: "EGP",
                      }).format(product.price)}
                    </span>
                  )}
                  {!!hasDiscount && (
                    <Badge variant="destructive" className="text-sm">
                      {t("save")}{" "}
                      {Intl.NumberFormat("ar-EG", {
                        style: "currency",
                        currency: "EGP",
                      }).format(product.price - effectivePrice)}
                    </Badge>
                  )}
                </div>
                <p
                  className={cn("text-green-600 dark:text-green-400 font-medium", {
                    "text-red-600": !product.inStock,
                  })}>
                  {product.inStock ? t("inStock") : t("outOfStock")}
                </p>
              </div>

              {/* Description */}
              {product?.description?.text && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("description.title")}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description.text}</p>
                  </div>
                </>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t("quantity")}:</span>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      +
                    </button>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
                    onClick={() => handleWhatsAppContact(`مرحباً! أنا مهتم بشراء ${product.name} (الكمية: ${quantity})`)}>
                    <MessageCircle className="w-6 h-6 mr-3" />
                    {t("contactWhatsApp")}
                  </Button>
                  <QRCodeShare url={`${typeof window !== "undefined" ? window.location.origin : ""}/products/${product.id}`} title={product.name}>
                    <Button size="lg" variant="outline" className="w-full py-6 text-lg border-2">
                      <Share2 className="w-4 h-4 mr-2" />
                      {t("share")}
                    </Button>
                  </QRCodeShare>
                  {/* <Button
                  size="lg"
                  variant="outline"
                  className="w-full py-6 text-lg border-2"
                  onClick={() => handleWhatsAppContact(`مرحباً! أريد معلومات أكثر عن ${product.name}`)}>
                  <Phone className="w-5 h-5 mr-2" />
                  {t("callForInfo")}
                </Button> */}
                </div>{" "}
              </div>
            </motion.div>
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section className="mt-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}>
              <motion.div variants={itemVariants} className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("relatedProducts.title")}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300">{t("relatedProducts.subtitle")}</p>
              </motion.div>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </>
  );
}
