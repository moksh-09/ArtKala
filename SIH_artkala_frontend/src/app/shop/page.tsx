"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { listProducts } from "@/lib/api/products";
import { listArtisans } from "@/lib/api/artisans";
import type { Product, Artisan } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCraft = searchParams.get("craft") || "";
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [artisans, setArtisans] = useState<Record<string, Artisan>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCraft, setSelectedCraft] = useState<string>(initialCraft);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { language } = useLanguage();

  useEffect(() => {
    async function loadShopData() {
      setIsLoading(true);
      try {
        const [fetchedProducts, fetchedArtisans] = await Promise.allSettled([
          listProducts({ limit: 50 }),
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
          // Synthetic high-quality initial catalogue items if backend DB is being seeded
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
            {
              id: "PROD_ART002",
              artisan_id: "ART002",
              name: "Earthen Terracotta Water Pitcher",
              craft: "Terracotta & Pottery",
              category: "Kitchen & Dining",
              material: "Alluvial Red Clay",
              description: "Natural cooling earthen pitcher handmade using slow potter's wheel technique.",
              production_time_days: 8,
              monthly_capacity: 400,
              customization: false,
              price: 380,
              status: "confirmed",
              ai_generated: true,
              ai_confirmed: true,
              keywords: ["clay", "pottery", "pitcher"],
              craft_story: "Rooted in centuries-old earthen pottery traditions.",
              buyer_description: "Pure terracotta vessel preserving natural alkalinity of drinking water.",
              images: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_demo_data: true,
              artisan: {
                id: "ART002",
                name: "Balaram Pal",
                location: "Kutch Guild",
                state: "Gujarat",
                district: "Bhuj",
                languages: ["Gujarati", "Hindi"],
                craft: "Terracotta & Pottery",
                cluster_id: "CL_GJ_KUTCH",
                verification_status: "verified",
                is_demo_data: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            },
            {
              id: "PROD_ART003",
              artisan_id: "ART003",
              name: "Pure Handspun Tussar Silk Dupatta",
              craft: "Handloom Weaves",
              category: "Apparel & Textiles",
              material: "Wild Tussar Silk",
              description: "Hand-reeled natural silk scarf woven on wooden pit-looms with temple borders.",
              production_time_days: 21,
              monthly_capacity: 120,
              customization: true,
              price: 1850,
              status: "confirmed",
              ai_generated: true,
              ai_confirmed: true,
              keywords: ["silk", "handloom", "tussar"],
              craft_story: "Sovereign forest silk reeled by tribal artisan co-operatives.",
              buyer_description: "Rich organic textured silk with breathable golden luster.",
              images: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_demo_data: true,
              artisan: {
                id: "ART003",
                name: "Devi Bai",
                location: "Champa Cluster",
                state: "Chhattisgarh",
                district: "Janjgir",
                languages: ["Chhattisgarhi", "Hindi"],
                craft: "Handloom Weaves",
                cluster_id: "CL_CG_TUSSAR",
                verification_status: "verified",
                is_demo_data: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            },
            {
              id: "PROD_ART004",
              artisan_id: "ART004",
              name: "Dhokra Lost-Wax Bell Metal Figurine",
              craft: "Dhokra & Metal Craft",
              category: "Home & Decor",
              material: "Brass & Bronze Alloy",
              description: "Ancient 4,000-year-old non-ferrous lost-wax metal casting portraying tribal musicians.",
              production_time_days: 18,
              monthly_capacity: 80,
              customization: false,
              price: 1450,
              status: "confirmed",
              ai_generated: true,
              ai_confirmed: true,
              keywords: ["dhokra", "metal", "brass", "tribal"],
              craft_story: "One-of-a-kind lost wax casting where the clay mold is broken to reveal the bronze.",
              buyer_description: "Heirloom metal art piece certified under the Bastar craft GI tag.",
              images: [],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_demo_data: true,
              artisan: {
                id: "ART004",
                name: "Manglu Ram Ghadwa",
                location: "Bastar Guild",
                state: "Chhattisgarh",
                district: "Kondagaon",
                languages: ["Gondi", "Hindi"],
                craft: "Dhokra & Metal Craft",
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
        console.error("Failed to load shop data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadShopData();
  }, []);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (p.name || "").toLowerCase().includes(q);
          const matchCraft = (p.craft || "").toLowerCase().includes(q);
          const matchMaterial = (p.material || "").toLowerCase().includes(q);
          const matchDesc = (p.description || "").toLowerCase().includes(q);
          if (!matchName && !matchCraft && !matchMaterial && !matchDesc) {
            return false;
          }
        }
        // Craft filter
        if (selectedCraft) {
          const pCraft = (p.craft || "").toLowerCase();
          if (!pCraft.includes(selectedCraft.toLowerCase())) {
            return false;
          }
        }
        // Material filter
        if (selectedMaterial) {
          const pMat = (p.material || "").toLowerCase();
          if (!pMat.includes(selectedMaterial.toLowerCase())) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") {
          return (a.price || 0) - (b.price || 0);
        }
        if (sortBy === "price-high") {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0; // "featured" keeps original order
      });
  }, [products, searchQuery, selectedCraft, selectedMaterial, sortBy]);

  const craftOptions = [
    { label: language === "hi" ? "सभी शिल्प" : "All Crafts", value: "" },
    { label: language === "hi" ? "बांस व बेंत" : "Bamboo Craft", value: "Bamboo" },
    { label: language === "hi" ? "टेराकोटा व मिट्टी" : "Terracotta & Pottery", value: "Terracotta" },
    { label: language === "hi" ? "हथकरघा बुनाई" : "Handloom Weaves", value: "Handloom" },
    { label: language === "hi" ? "काष्ठ नक्काशी" : "Wood Carving", value: "Wood" },
    { label: language === "hi" ? "ढोकरा धातु" : "Dhokra & Metal Craft", value: "Metal" },
  ];

  const materialOptions = [
    { label: language === "hi" ? "सभी सामग्री" : "All Materials", value: "" },
    { label: language === "hi" ? "बांस व बेंत" : "Bamboo & Cane", value: "Bamboo" },
    { label: language === "hi" ? "प्राकृतिक मिट्टी" : "Alluvial Clay", value: "Clay" },
    { label: language === "hi" ? "रेशम व सूत" : "Silk & Cotton", value: "Silk" },
    { label: language === "hi" ? "पीतल व कांसा" : "Brass & Bronze", value: "Brass" },
  ];

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCraft("");
    setSelectedMaterial("");
    setSortBy("featured");
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCraft || selectedMaterial);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-1 pb-20">
        {/* Editorial Page Header & Breadcrumbs */}
        <section className="border-b border-[#E8DFD5] bg-[#F4EFEA]/70 py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-xs text-[#78716C] mb-3">
              <Link href="/" className="hover:text-[#C85A32] transition-colors">
                {language === "hi" ? "मुख्य पृष्ठ" : "Home"}
              </Link>
              <span>/</span>
              <span className="text-[#1C1917] font-medium">
                {language === "hi" ? "कारीगर बाज़ार" : "Marketplace"}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141311]">
                  {language === "hi"
                    ? "कारीगर कृतियां व उत्पाद संग्रह"
                    : "The Artisan Marketplace"}
                </h1>
                <p className="mt-2 text-sm text-[#78716C] max-w-xl">
                  {language === "hi"
                    ? "सीधे भारतीय ग्रामीण शिल्पकारों द्वारा निर्मित प्रामाणिक कृतियां। बिना बिचौलियों के न्यायसंगत मूल्य व सत्यापित हुनर।"
                    : "Explore authentic works crafted by master artisans across India with transparent provenance and direct maker linkages."}
                </p>
              </div>

              <div className="text-xs text-[#78716C]">
                <span className="font-semibold text-[#1C1917] text-sm">
                  {filteredProducts.length}
                </span>{" "}
                {language === "hi" ? "उत्पाद उपलब्ध" : "craft works available"}
              </div>
            </div>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <div className="sticky top-16 z-30 border-b border-[#E8DFD5] bg-[#FAF8F5]/90 backdrop-blur-md py-3.5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "hi"
                    ? "उत्पाद, शिल्प या सामग्री खोजें..."
                    : "Search by craft, material, or maker..."
                }
                className="w-full rounded-xl border border-[#E8DFD5] bg-white py-2 pl-9 pr-8 text-xs text-[#1C1917] outline-none transition-colors focus:border-[#C85A32]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#1C1917]"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Pills & Sort Selector */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="lg:hidden flex items-center gap-1.5 rounded-xl border border-[#D6CEBE] bg-white px-3 py-2 text-xs font-medium text-[#1C1917]"
              >
                <Filter className="h-3.5 w-3.5 text-[#C85A32]" />
                <span>{language === "hi" ? "फ़िल्टर" : "Filters"}</span>
                {hasActiveFilters && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C85A32]" />
                )}
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#78716C] hidden sm:inline-block">
                  {language === "hi" ? "क्रमबद्ध:" : "Sort by:"}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border border-[#E8DFD5] bg-white px-3 py-2 text-xs font-medium text-[#1C1917] outline-none focus:border-[#C85A32] cursor-pointer"
                >
                  <option value="featured">{language === "hi" ? "विशेष संग्रह" : "Featured"}</option>
                  <option value="price-low">{language === "hi" ? "मूल्य: कम से अधिक" : "Price: Low to High"}</option>
                  <option value="price-high">{language === "hi" ? "मूल्य: अधिक से कम" : "Price: High to Low"}</option>
                  <option value="newest">{language === "hi" ? "नवीनतम" : "Newest Additions"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2.5 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[#A8A29E]">
                {language === "hi" ? "सक्रिय फ़िल्टर:" : "Active filters:"}
              </span>
              {selectedCraft && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#F7EAE5] px-2.5 py-0.5 text-[#C85A32] font-medium">
                  {selectedCraft}
                  <button onClick={() => setSelectedCraft("")} className="hover:opacity-75">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedMaterial && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF1ED] px-2.5 py-0.5 text-[#3F5E4D] font-medium">
                  {selectedMaterial}
                  <button onClick={() => setSelectedMaterial("")} className="hover:opacity-75">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#FAF8F5] border border-[#E8DFD5] px-2.5 py-0.5 text-[#1C1917] font-medium">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery("")} className="hover:opacity-75">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-[#C85A32] underline hover:text-[#B24E29] ml-2"
              >
                {language === "hi" ? "सभी हटाएं" : "Clear all"}
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area: Sidebar + Product Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Filters Sidebar (Span 3 cols) */}
            <aside className="hidden lg:block lg:col-span-3 space-y-6 rounded-2xl bg-white p-5 border border-[#E8DFD5] sticky top-36">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-3">
                  {language === "hi" ? "शिल्प परंपराएं" : "Craft Traditions"}
                </h3>
                <div className="space-y-1.5">
                  {craftOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSelectedCraft(c.value)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                        selectedCraft === c.value
                          ? "bg-[#C85A32] font-semibold text-white"
                          : "text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917]"
                      }`}
                    >
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F4EFEA]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917] mb-3">
                  {language === "hi" ? "प्राकृतिक सामग्री" : "Natural Material"}
                </h3>
                <div className="space-y-1.5">
                  {materialOptions.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setSelectedMaterial(m.value)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition-colors cursor-pointer ${
                        selectedMaterial === m.value
                          ? "bg-[#3F5E4D] font-semibold text-white"
                          : "text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917]"
                      }`}
                    >
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provenance Promise Box */}
              <div className="rounded-xl bg-[#FAF8F5] p-3.5 border border-[#E8DFD5] text-xs text-[#78716C] space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-[#1C1917]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C85A32]" />
                  <span>{language === "hi" ? "संप्रभु लिंकेज" : "Sovereign Linkage"}</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {language === "hi"
                    ? "प्रत्येक कृति सत्यापित क्लस्टर अभिलेखों और प्रत्यक्ष कार्यशाला निरीक्षण द्वारा प्रमाणित है।"
                    : "Every product is authenticated against verified cluster records and workshop inspects."}
                </p>
              </div>
            </aside>

            {/* Mobile Filter Drawer */}
            {isMobileFilterOpen && (
              <div className="lg:hidden fixed inset-0 z-50 flex">
                <div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                  onClick={() => setIsMobileFilterOpen(false)}
                />
                <div className="relative z-10 w-full max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD5]">
                      <h3 className="text-sm font-bold text-[#1C1917]">
                        {language === "hi" ? "फ़िल्टर विकल्प" : "Filter Crafts"}
                      </h3>
                      <button
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="rounded-full p-1 text-[#78716C]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] mb-2">
                        {language === "hi" ? "शिल्प परंपरा" : "Craft"}
                      </h4>
                      <div className="space-y-1">
                        {craftOptions.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => {
                              setSelectedCraft(c.value);
                              setIsMobileFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                              selectedCraft === c.value
                                ? "bg-[#C85A32] text-white font-medium"
                                : "text-[#1C1917] hover:bg-[#F4EFEA]"
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8DFD5]">
                    <button
                      type="button"
                      onClick={() => {
                        clearAllFilters();
                        setIsMobileFilterOpen(false);
                      }}
                      className="w-full rounded-xl border border-[#D6CEBE] py-2.5 text-xs font-semibold text-[#1C1917]"
                    >
                      {language === "hi" ? "सभी फ़िल्टर साफ़ करें" : "Reset Filters"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid Area (Span 9 cols) */}
            <div className="lg:col-span-9">
              {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                      <Skeleton className="aspect-[4/5] w-full rounded-2xl" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-5 w-1/3" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-[#D6CEBE] bg-white p-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F4EFEA] mb-4">
                    <Search className="h-6 w-6 text-[#A8A29E]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#1C1917] mb-1">
                    {language === "hi"
                      ? "कोई शिल्प कृति नहीं मिली"
                      : "No craft works match your search"}
                  </h3>
                  <p className="text-xs text-[#78716C] max-w-sm mx-auto mb-6">
                    {language === "hi"
                      ? "फ़िल्टर बदलकर देखें या सभी उत्पादों की सूची देखें।"
                      : "Try adjusting your search terms or clearing selected craft and material filters."}
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="rounded-xl bg-[#C85A32] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#B24E29] transition-colors"
                  >
                    {language === "hi" ? "फ़िल्टर रीसेट करें" : "Reset all filters"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="text-center space-y-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#C85A32] border-t-transparent mx-auto" />
            <p className="text-xs text-[#78716C]">Loading ARTKALA Catalogue...</p>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
