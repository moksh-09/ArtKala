"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product, Artisan } from "@/types";
import { listProducts } from "@/lib/api/products";
import { listArtisans } from "@/lib/api/artisans";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Record<string, Artisan>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { language } = useLanguage();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [fetchedProducts, fetchedArtisans] = await Promise.allSettled([
          listProducts({ limit: 12 }),
          listArtisans({ limit: 50 }),
        ]);

        const artisanMap: Record<string, Artisan> = {};
        if (fetchedArtisans.status === "fulfilled") {
          fetchedArtisans.value.forEach((a) => {
            artisanMap[a.id] = a;
          });
          setArtisans(artisanMap);
        }

        if (fetchedProducts.status === "fulfilled" && fetchedProducts.value.length > 0) {
          // Augment products with real artisan info
          const augmented = fetchedProducts.value.map((p) => ({
            ...p,
            artisan: artisanMap[p.artisan_id] || undefined,
          }));
          setProducts(augmented);
        } else {
          // Controlled initial handcrafted showcase fallback if backend is still empty
          setProducts([
            {
              id: "PROD_ART001",
              artisan_id: "ART001",
              name: "Woven Bamboo Storage Basket",
              craft: "Bamboo Craft",
              category: "Home and utility",
              material: "Natural Bamboo & Cane",
              description: "Handcrafted bamboo basket woven with tight lattice structure for sustainable home living.",
              production_time_days: 14,
              monthly_capacity: 500,
              customization: true,
              price: 450,
              status: "confirmed",
              ai_generated: true,
              ai_confirmed: true,
              keywords: ["bamboo", "basket", "storage"],
              craft_story: "Crafted by skilled bamboo artisans in the Maharashtra cluster.",
              buyer_description: "Durable and lightweight natural basket for storage and decor.",
              images: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_demo_data: true,
              artisan: {
                id: "ART001",
                name: "Rameshwar Kumbhar",
                location: "Bankura Cluster",
                state: "West Bengal",
                district: "Bishnupur",
                languages: ["Bengali", "Hindi"],
                craft: "Terracotta & Pottery",
                cluster_id: "CL_WB_BANKURA",
                verification_status: "verified",
                is_demo_data: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const filterTabs = [
    { id: "all", key: "featured.filterAll", fallback: "All Works" },
    { id: "bamboo", key: "featured.filterBamboo", fallback: "Bamboo Craft" },
    { id: "pottery", key: "featured.filterPottery", fallback: "Ceramics & Clay" },
    { id: "textiles", key: "featured.filterTextiles", fallback: "Handloom Weaves" },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeCategory === "all") return true;
    const craft = (p.craft || "").toLowerCase();
    const cat = (p.category || "").toLowerCase();
    if (activeCategory === "bamboo") return craft.includes("bamboo") || craft.includes("basket");
    if (activeCategory === "pottery") return craft.includes("pottery") || craft.includes("clay") || craft.includes("terracotta");
    if (activeCategory === "textiles") return craft.includes("textile") || craft.includes("weav") || craft.includes("loom");
    return true;
  });

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C85A32] font-semibold block mb-2">
              <VanishText textKey="featured.tag" fallback="Curated Catalogue" />
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141311]">
              <VanishText
                textKey="featured.title"
                fallback="Crafted by hand, rooted in identity."
              />
            </h2>
            <p className="mt-2 text-sm text-[#78716C] max-w-xl">
              <VanishText
                textKey="featured.subtitle"
                fallback="Each piece carries the signature, lineage, and verifiable capability of its maker."
              />
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-[#1C1917] hover:text-[#C85A32] transition-colors"
          >
            <span>
              <VanishText textKey="featured.viewAll" fallback="View all crafts" />
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Filter Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-[#1C1917] text-white shadow-sm"
                  : "bg-white text-[#78716C] border border-[#E8DFD5] hover:border-[#D6CEBE] hover:text-[#1C1917]"
              }`}
            >
              <VanishText textKey={tab.key} fallback={tab.fallback} />
            </button>
          ))}
        </div>

        {/* Products Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D6CEBE] bg-[#FAF8F5] p-12 text-center">
            <p className="text-sm text-[#78716C]">
              <VanishText
                textKey="featured.emptyState"
                fallback="No artisan products found in this category currently."
              />
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-3 text-xs font-medium text-[#C85A32] underline hover:text-[#B24E29]"
            >
              {language === "hi" ? "सभी उत्पाद देखें" : "View all works"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
