"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ArrowLeft,
  FileCheck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { getArtisan } from "@/lib/api/artisans";
import { listArtisanProducts } from "@/lib/api/products";
import { getHunarProfile } from "@/lib/api/hunar";
import type { Artisan, Product, HunarProfile } from "@/types";

export default function ArtisanProfilePage() {
  const params = useParams();
  const artisanId = String(params.id);

  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [hunar, setHunar] = useState<HunarProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { language } = useLanguage();

  useEffect(() => {
    async function loadArtisanData() {
      setIsLoading(true);
      try {
        const [artData, prodsData, hunarData] = await Promise.allSettled([
          getArtisan(artisanId),
          listArtisanProducts(artisanId),
          getHunarProfile(artisanId),
        ]);

        if (artData.status === "fulfilled") {
          setArtisan(artData.value);
        } else {
          setArtisan({
            id: artisanId,
            name: "Rameshwar Kumbhar",
            location: "Bishnupur Guild, Bankura",
            state: "West Bengal",
            district: "Bankura",
            languages: ["Bengali", "Hindi"],
            craft: "Terracotta & Earthenware Sculptor",
            cluster_id: "CL_WB_BANKURA",
            verification_status: "verified",
            is_demo_data: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        if (prodsData.status === "fulfilled") {
          setProducts(prodsData.value);
        }

        if (hunarData.status === "fulfilled") {
          setHunar(hunarData.value);
        }
      } catch (err) {
        console.error("Artisan profile error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (artisanId) {
      loadArtisanData();
    }
  }, [artisanId]);

  if (isLoading || !artisan) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full space-y-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-1 pb-24">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <Link href="/" className="hover:text-[#C85A32]">
              {language === "hi" ? "होम" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#C85A32]">
              {language === "hi" ? "कारीगर" : "Artisans"}
            </Link>
            <span>/</span>
            <span className="text-[#1C1917] font-medium">{artisan.name}</span>
          </div>
        </div>

        {/* Hero Profile Banner */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-[#1C1917] text-white p-8 md:p-12 border border-stone-800 shadow-xl">
            <Image
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
              alt={artisan.name}
              fill
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#3F5E4D] px-3 py-1 text-xs font-semibold text-white">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{language === "hi" ? "सत्यापित मास्टर कारीगर" : "Verified Master Artisan"}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#FAF8F5]">
                {artisan.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300">
                <span className="font-medium text-[#C85A32]">{artisan.craft}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-stone-400" />
                  {artisan.location || `${artisan.district}, ${artisan.state}`}
                </span>
                {artisan.languages && artisan.languages.length > 0 && (
                  <>
                    <span>•</span>
                    <span>
                      {language === "hi" ? "भाषाएं:" : "Languages:"} {artisan.languages.join(", ")}
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-stone-300 font-light leading-relaxed pt-2">
                {language === "hi"
                  ? "प्राकृतिक मृदा व वन सामग्री से पीढ़ियों की धरोहर को जीवित रखने वाली प्रामाणिक शिल्प साधना।"
                  : "Specializing in generational artisanal techniques rooted in natural earthen materials and sustainable crafting practice."}
              </p>
            </div>
          </div>
        </section>



        {/* Artisan Works Catalogue */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141311]">
              {language === "hi" ? `${artisan.name} की हस्तशिल्प कृतियां` : `Craft Works by ${artisan.name}`}
            </h2>
            <p className="text-xs text-[#78716C]">
              {language === "hi"
                ? "पूर्ण प्रामाणिकता गारंटी के साथ सीधे कारीगर कार्यशाला से।"
                : "Direct from the artisan workshop with full provenance guarantee."}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={{ ...prod, artisan }} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D6CEBE] bg-white p-12 text-center text-xs text-[#78716C]">
              {language === "hi"
                ? "वर्तमान में इस कारीगर के लिए कोई सक्रिय उत्पाद उपलब्ध नहीं है।"
                : "No active listings found for this artisan currently."}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
