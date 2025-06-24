"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Star, 
  Phone, 
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { useTranslations } from 'next-intl';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};

export default function HomePage() {
  const t = useTranslations('homepage');
  
  // Sample library products data
  const featuredProducts = [
    {
      id: 1,
      title: t('products.items.classicLiterature'),
      price: 299,
      originalPrice: 399,
      image: "/book1.jpg",
      rating: 4.8,
      isPopular: true
    },
    {
      id: 2,
      title: t('products.items.modernFiction'),
      price: 249,
      originalPrice: 329,
      image: "/book1.jpg",
      rating: 4.9,
      isNew: true
    },
    {
      id: 3,
      title: t('products.items.academicResearch'),
      price: 599,
      originalPrice: 799,
      image: "/book1.jpg",
      rating: 4.7,
      isPopular: true
    },
    {
      id: 4,
      title: t('products.items.childrenStories'),
      price: 199,
      originalPrice: 249,
      image: "/book1.jpg",
      rating: 5.0,
      isNew: true
    },
    {
      id: 5,
      title: t('products.items.scienceTechnology'),
      price: 449,
      originalPrice: 599,
      image: "/book1.jpg",
      rating: 4.6,
      isPopular: true
    },
    {
      id: 6,
      title: t('products.items.historyBiography'),
      price: 349,
      originalPrice: 449,
      image: "/book1.jpg",
      rating: 4.8,
      isNew: false
    }
  ];



  const handleWhatsAppContact = () => {
    const phoneNumber = "1234567890"; // Replace with your actual WhatsApp number
    const message = t('whatsapp.message');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden py-20 lg:py-32"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-8">
              <motion.div
                className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Star className="w-4 h-4" />
                {t('welcome')}
              </motion.div>
              
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                variants={itemVariants}
              >
                {t('hero.title')}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {" "}{t('hero.titleHighlight')}
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                variants={itemVariants}
              >
                {t('hero.description')}
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={itemVariants}
              >
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg"
                  onClick={handleWhatsAppContact}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('hero.whatsappCta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-6 text-lg border-2"
                  onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {t('hero.browseCollection')}
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="relative"
              variants={floatVariants}
              animate="animate"
            >
              <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg"
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
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
      <motion.section 
        id="products"
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('products.sectionTitle')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('products.sectionDescription')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 relative overflow-hidden">
                      {/* Placeholder for book cover */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-gray-400" />
                      </div>
                      
                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.isPopular && (
                          <Badge className="bg-orange-500 hover:bg-orange-600">
                            {t('products.badges.popular')}
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge className="bg-green-500 hover:bg-green-600">
                            {t('products.badges.new')}
                          </Badge>
                        )}
                      </div>
                      
                      {/* Discount Badge */}
                      {product.originalPrice > product.price && (
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-medium">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {product.title}
                          </h3>
                          
                          <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                              ({product.rating})
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                ${product.price}
                              </span>
                              {product.originalPrice > product.price && (
                                <span className="text-lg text-gray-500 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={handleWhatsAppContact}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            {t('products.callUs')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center mt-12"
            variants={itemVariants}
          >
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-6 text-lg border-2"
              onClick={handleWhatsAppContact}
            >
              {t('products.viewAllProducts')}
              <ArrowRight className="w-5 h-5 ml-2" />
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
        variants={containerVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              {t('cta.description')}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                {t('cta.button')}
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
