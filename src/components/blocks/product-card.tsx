import React, { useState } from "react";
import { BookOpen, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { handleWhatsAppContact } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: any }) {
  const t = useTranslations();
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Handle image navigation
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  // Reset image index when product changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
  }, [product.id]);

  return (
    <motion.div
      key={product.id}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={() => router.push(`/products/${product.id}`)}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      }}
      className="group cursor-pointer">
      <Card className="overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">        <div className="relative">
          <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden">
            {/* Product images */}
            {product.images && product.images.length > 0 ? (
              <>
                <img 
                  src={product.images[currentImageIndex].url} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-opacity duration-300" 
                />
                
                {/* Image navigation arrows - only show if more than 1 image */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    {/* Image indicators */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {product.images.map((_: any, index: number) => (
                        <button
                          key={index}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(index);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentImageIndex 
                              ? 'bg-white' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-gray-400" />
              </div>
            )}

            {/* Sale Badge */}
            {product.sale && product.sale > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                {product.sale}% {t("product.sale")}
              </div>
            )}
          </div>

          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {product.name}
                </h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format((product.price * (100 - product.sale)) / 100)}
                      {product.sale && product.sale > 0 ? (
                        <span className="text-red-500 line-through mx-2 text-sm">
                          {Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(product.price)}
                        </span>
                      ) : null}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleWhatsAppContact(t("whatsapp.message"))}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Phone className="w-4 h-4 mr-1" />
                  {t("product.callUs")}
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

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
