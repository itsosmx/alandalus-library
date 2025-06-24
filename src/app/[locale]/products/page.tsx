"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Search, X, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { get_products } from "@/lib/api";
import ProductCard from "@/components/blocks/product-card";
import { handleWhatsAppContact } from "@/lib/utils";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,
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

// Sort options
type SortOption = "newest" | "oldest" | "priceLowToHigh" | "priceHighToLow" | "nameAtoZ" | "nameZtoA";

export default function ProductsPage() {
  const t = useTranslations("products");
  // State management
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Fixed items per page

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await get_products();
        const fetchedProducts = response.data?.products || [];
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceLowToHigh":
          return (a.sale || a.price) - (b.sale || b.price);
        case "priceHighToLow":
          return (b.sale || b.price) - (a.sale || a.price);
        case "nameAtoZ":
          return a.name.localeCompare(b.name);
        case "nameZtoA":
          return b.name.localeCompare(a.name);
        case "oldest":
          return a.id.localeCompare(b.id);
        case "newest":
        default:
          return b.id.localeCompare(a.id);
      }
    });
    return filtered;
  }, [products, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div className="text-center mb-12" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4" variants={itemVariants}>
            {t("title")}
          </motion.h1>
          <motion.p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" variants={itemVariants}>
            {t("subtitle")}
          </motion.p>
        </motion.div>
        {/* Search and Filters */}
        <motion.div className="mb-8 space-y-4" initial="hidden" animate="visible" variants={containerVariants}>
          {/* Search Bar */}
          <motion.div className="relative max-w-2xl mx-auto" variants={itemVariants}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-12 py-6 text-lg border-2 rounded-2xl"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </motion.div>{" "}
          {/* Filters and Sort Bar */}
          <motion.div className="flex flex-col lg:flex-row gap-4 items-center justify-between" variants={itemVariants}>
            <div className="flex items-center gap-4">
              {searchQuery && (
                <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2 text-gray-600">
                  <X className="w-4 h-4" />
                  {t("filters.clear")}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-48" dir="rtl">
                  <SelectValue placeholder={t("sort.title")} />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="newest">{t("sort.newest")}</SelectItem>
                  <SelectItem value="oldest">{t("sort.oldest")}</SelectItem>
                  <SelectItem value="priceLowToHigh">{t("sort.priceLowToHigh")}</SelectItem>
                  <SelectItem value="priceHighToLow">{t("sort.priceHighToLow")}</SelectItem>
                  <SelectItem value="nameAtoZ">{t("sort.nameAtoZ")}</SelectItem>
                  <SelectItem value="nameZtoA">{t("sort.nameZtoA")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </motion.div>{" "}
        {/* Results Count */}
        {!loading && (
          <motion.div className="mb-6 text-gray-600 dark:text-gray-400" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {filteredAndSortedProducts.length === 0 ? (
              <span>{t("search.noResults")}</span>
            ) : (
              <span>
                {t("resultsCount.showing")} {startIndex + 1}-{Math.min(endIndex, filteredAndSortedProducts.length)} {t("resultsCount.of")}{" "}
                {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? t("resultsCount.single") : t("resultsCount.multiple")}
              </span>
            )}
          </motion.div>
        )}
        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-gray-800/80">
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/3"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse w-1/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t("search.noResults")}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t("search.noResultsDescription")}</p>
            <Button onClick={clearFilters} variant="outline">
              {t("filters.clear")}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}>
            {" "}
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
        {/* Pagination */}
        {!loading && filteredAndSortedProducts.length > 0 && totalPages > 1 && (
          <motion.div
            className="flex justify-center items-center mt-12 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              {t("pagination.previous")}
            </Button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNumber;

                if (totalPages <= 7) {
                  pageNumber = i + 1;
                } else if (currentPage <= 4) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNumber = totalPages - 6 + i;
                } else {
                  pageNumber = currentPage - 3 + i;
                }

                if (pageNumber < 1 || pageNumber > totalPages) return null;

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className="w-10 h-10 p-0">
                    {pageNumber}
                  </Button>
                );
              })}

              {/* Show ellipsis and last page if needed */}
              {totalPages > 7 && currentPage < totalPages - 3 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} className="w-10 h-10 p-0">
                    {totalPages}
                  </Button>
                </>
              )}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1">
              {t("pagination.next")}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}{" "}
        {/* WhatsApp CTA */}
        {!loading && currentProducts.length > 0 && (
          <motion.div className="text-center mt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">هل تحتاج مساعدة في اختيار المنتجات؟</h3>
              <p className="text-blue-100 mb-6">تواصل معنا عبر واتساب وسيساعدك فريقنا في اختيار أفضل المنتجات لاحتياجاتك</p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
                onClick={() => handleWhatsAppContact("مرحباً! أحتاج مساعدة في اختيار المنتجات من مكتبتكم.")}>
                <MessageCircle className="w-6 h-6 mr-3" />
                تواصل معنا عبر واتساب
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
