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
    <div className="flex min-h-screen flex-col bg-[#FAFAF8]">
      {/* Refined Navigation */}
      <Header />

      {/* Main Homepage Flow */}
      <main className="flex-1">
        {/* 1. Immersive Editorial Hero */}
        <HeroSection />

        {/* Premium Divider */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <hr className="divider-premium" />
        </div>

        {/* 2. Asymmetric Category Discovery */}
        <FeaturedCategories />

        {/* 3. Curated Product Grid */}
        <FeaturedProducts />

        {/* 4. Full-Width Artisan Narrative */}
        <ArtisanStorySection />

        {/* 5. Business Procurement */}
        <BusinessPurchasingSection />

        {/* 6. Hunar Capability Twin */}
        <CapabilityTwinSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
