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
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Record<string, Artisan>>({});
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { language } = useLanguage();
  const { ref, isRevealed } = useScrollReveal(0.06);

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
          const augmented = fetchedProducts.value.map((p) => ({
            ...p,
            artisan: artisanMap[p.artisan_id] || undefined,
          }));
          setProducts(augmented);
        } else {
          setProducts([
            {
              id: "PROD_ART001",
              artisan_id: "ART001",
              name: "Majuli Handwoven Bamboo Storage Basket",
              craft: "Bamboo Craft",
              category: "Bamboo & Cane",
              material: "Natural Bamboo & Cane",
              description: "Handcrafted bamboo basket woven with tight lattice structure for sustainable home living.",
              production_time_days: 14,
              monthly_capacity: 500,
              customization: true,
              price: 1850,
              status: "confirmed",
              ai_generated: true,
              ai_confirmed: true,
              keywords: ["bamboo", "basket", "storage"],
              craft_story: "Crafted by skilled bamboo artisans in the Northeast cluster.",
              buyer_description: "Durable and lightweight natural basket for storage and decor.",
              images: [
                {
                  id: "IMG001",
                  original_path: "https://images.unsplash.com/photo-1675081632939-5294f776dd75?auto=format&fit=crop&w=800&q=80",
                  processed_path: "https://images.unsplash.com/photo-1675081632939-5294f776dd75?auto=format&fit=crop&w=800&q=80",
                  thumbnail_path: null,
                  mime_type: "image/jpeg",
                  width: 800,
                  height: 800,
                  quality_status: "passed",
                },
              ],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_demo_data: true,
              artisan: {
                id: "ART001",
                name: "Kamala Das",
                location: "Majuli Island",
                state: "Assam",
                district: "Majuli",
                languages: ["Assamese", "Hindi"],
                craft: "Bamboo & Cane",
                cluster_id: "CL_AS_MAJULI",
                verification_status: "verified",
                is_demo_data: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            },
            {
              id: "PROD_ART002",
              artisan_id: "ART002",
              name: "Bankura Terracotta Ritual Horse Vessel",
              craft: "Clay Sculpting",
              category: "Terracotta & Clay",
              material: "Alluvial Riverbank Clay",
              description: "Traditional terracotta ritual horse handcrafted with historic Bishnupur motifs.",
              production_time_days: 10,
              monthly_capacity: 350,
              customization: false,
              price: 3200,
              status: "confirmed",
              ai_generated: true,
              ai_confirmed: true,
              keywords: ["terracotta", "pottery", "heritage"],
              craft_story: "Third-generation master terracotta sculptor from the historic Bankura guild.",
              buyer_description: "Handcrafted terracotta sculpture with natural earthy finish.",
              images: [
                {
                  id: "IMG002",
                  original_path: "/images/artisan-potter-hero.png",
                  processed_path: "/images/artisan-potter-hero.png",
                  thumbnail_path: null,
                  mime_type: "image/png",
                  width: 800,
                  height: 800,
                  quality_status: "passed",
                },
              ],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_demo_data: true,
              artisan: {
                id: "ART002",
                name: "Rameshwar Kumbhar",
                location: "Bishnupur",
                state: "West Bengal",
                district: "Bankura",
                languages: ["Bengali", "Hindi"],
                craft: "Terracotta Pottery",
                cluster_id: "CL_WB_BANKURA",
                verification_status: "verified",
                is_demo_data: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            },
            {
              id: "PROD_ART003",
              artisan_id: "ART003",
              name: "Varanasi Pure Silk Brocade Stole",
              craft: "Jacquard Weaving",
              category: "Handloom & Textiles",
              material: "Pure Mulberry Silk",
              description: "Intricately handwoven pure silk stole with traditional zari motifs.",
              production_time_days: 20,
              monthly_capacity: 120,
              customization: true,
              price: 4800,
              status: "confirmed",
              ai_generated: true,
              ai_confirmed: true,
              keywords: ["silk", "banarasi", "handloom"],
              craft_story: "Handwoven in the ancient weavers colony of Varanasi.",
              buyer_description: "Luxury handwoven silk stole with soft hand-feel and gold zari work.",
              images: [
                {
                  id: "IMG003",
                  original_path: "https://images.unsplash.com/photo-1759738101532-0c2726bf68af?auto=format&fit=crop&w=800&q=80",
                  processed_path: "https://images.unsplash.com/photo-1759738101532-0c2726bf68af?auto=format&fit=crop&w=800&q=80",
                  thumbnail_path: null,
                  mime_type: "image/jpeg",
                  width: 800,
                  height: 800,
                  quality_status: "passed",
                },
              ],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_demo_data: true,
              artisan: {
                id: "ART003",
                name: "Mohammad Ansari",
                location: "Varanasi Guild",
                state: "Uttar Pradesh",
                district: "Varanasi",
                languages: ["Hindi", "Urdu"],
                craft: "Handloom Silk",
                cluster_id: "CL_UP_VARANASI",
                verification_status: "verified",
                is_demo_data: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            },
            {
              id: "PROD_ART004",
              artisan_id: "ART004",
              name: "Bastar Lost-Wax Cast Bell Metal Figurine",
              craft: "Lost-Wax Casting",
              category: "Dhokra & Metal",
              material: "Bell Metal & Brass Alloy",
              description: "Ancient tribal non-ferrous casting portraying indigenous pastoral motifs.",
              production_time_days: 15,
              monthly_capacity: 180,
              customization: false,
              price: 2450,
              status: "confirmed",
              ai_generated: true,
              ai_confirmed: true,
              keywords: ["dhokra", "tribal", "metal"],
              craft_story: "Tribal master casting 4,000-year-old Indus Valley non-ferrous bronze casting techniques.",
              buyer_description: "Handcrafted rustic bronze figurine made using lost-wax casting.",
              images: [
                {
                  id: "IMG004",
                  original_path: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
                  processed_path: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
                  thumbnail_path: null,
                  mime_type: "image/jpeg",
                  width: 800,
                  height: 800,
                  quality_status: "passed",
                },
              ],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_demo_data: true,
              artisan: {
                id: "ART004",
                name: "Sukhram Jhara",
                location: "Kondagaon",
                state: "Chhattisgarh",
                district: "Bastar",
                languages: ["Gondi", "Hindi"],
                craft: "Dhokra Bell Metal",
                cluster_id: "CL_CG_BASTAR",
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
    { id: "all", key: "featured.filterAll", fallback: "All Collections" },
    { id: "bamboo", key: "featured.filterBamboo", fallback: "Bamboo & Cane" },
    { id: "pottery", key: "featured.filterPottery", fallback: "Terracotta & Clay" },
    { id: "textiles", key: "featured.filterTextiles", fallback: "Handloom Textiles" },
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
    <section ref={ref} className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-6 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C85A32] font-semibold block mb-3">
              <VanishText textKey="featured.tag" fallback="Curated Catalogue" />
            </span>
            <h2 className="font-dossier text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] text-[#0F0E0C]">
              <VanishText
                textKey="featured.title"
                fallback="Crafted by hand, rooted in identity."
              />
            </h2>
            <p className="mt-3 text-[13px] text-[#6B6560] max-w-lg leading-relaxed">
              <VanishText
                textKey="featured.subtitle"
                fallback="Each piece carries the signature, lineage, and verifiable capability of its maker."
              />
            </p>
          </div>

          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-[#1A1816] hover:text-[#C85A32] transition-colors duration-300 link-underline"
          >
            <span>
              <VanishText textKey="featured.viewAll" fallback="View all crafts" />
            </span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div
          className={`flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategory(tab.id)}
              className={`rounded-full px-5 py-2 text-[12px] font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                activeCategory === tab.id
                  ? "bg-[#1A1816] text-white shadow-[0_2px_8px_rgba(26,24,22,0.12)]"
                  : "bg-white text-[#6B6560] border border-[#EBE5DC] hover:border-[#D6CEBE] hover:text-[#1A1816] hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
              }`}
            >
              <VanishText textKey={tab.key} fallback={tab.fallback} />
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  index === 0
                    ? "delay-100"
                    : index === 1
                    ? "delay-200"
                    : index === 2
                    ? "delay-300"
                    : "delay-400"
                } ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              >
                <ProductCard
                  product={product}
                  priority={index < 4}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D6CEBE] bg-[#FAFAF8] p-14 text-center">
            <p className="text-[13px] text-[#6B6560]">
              <VanishText
                textKey="featured.emptyState"
                fallback="No artisan products found in this category currently."
              />
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="mt-4 text-xs font-semibold text-[#C85A32] hover:text-[#B24E29] transition-colors duration-200 link-underline"
            >
              {language === "hi" ? "सभी उत्पाद देखें" : "View all works"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
