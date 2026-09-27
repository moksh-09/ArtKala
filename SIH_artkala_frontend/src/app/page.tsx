import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ArtisanStorySection } from "@/components/home/ArtisanStorySection";
import { BusinessPurchasingSection } from "@/components/home/BusinessPurchasingSection";
import { CapabilityTwinSection } from "@/components/home/CapabilityTwinSection";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5]">
      {/* Sticky Refined Navigation */}
      <Header />

      {/* Main Homepage Flow */}
      <main className="flex-1">
        {/* 1. Immersive Editorial Marketplace Hero */}
        <HeroSection />

        {/* 2. Asymmetric Category Discovery */}
        <FeaturedCategories />

        {/* 3. Curated Product Discovery Grid */}
        <FeaturedProducts />

        {/* 4. Full-Width Editorial Artisan Narrative */}
        <ArtisanStorySection />

        {/* 5. Business & Institutional Procurement */}
        <BusinessPurchasingSection />

        {/* 6. Hunar Capability Twin Introduction */}
        <CapabilityTwinSection />
      </main>

      {/* Professional Marketplace Footer */}
      <Footer />
    </div>
  );
}
