"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles, Award } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const { language } = useLanguage();

  return (
    <section className="relative overflow-hidden pt-6 pb-16 md:pt-10 md:pb-24 lg:pt-12 lg:pb-28">
      {/* Subtle organic background tint */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-[#E8DFD5]/40 blur-3xl" />
      <div className="absolute bottom-10 left-10 -z-10 h-80 w-80 rounded-full bg-[#F7EAE5]/60 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8">
            {/* Provenance Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D6CEBE] bg-[#FAF8F5] px-3.5 py-1.5 text-xs text-[#1C1917] shadow-xs w-fit">
              <ShieldCheck className="h-3.5 w-3.5 text-[#3F5E4D]" />
              <span className="font-medium">
                {language === "hi"
                  ? "100% सत्यापित कारीगर प्रमाणिकता"
                  : "100% Verified Artisan Provenance"}
              </span>
            </div>

            {/* Main Editorial Display Heading */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-[#C85A32] font-semibold block">
                {language === "hi"
                  ? "भारतीय हस्तशिल्प की प्रामाणिक धरोहर"
                  : "Sovereign Indian Craftsmanship"}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#141311] leading-[1.08]">
                {language === "hi"
                  ? "कारीगरों द्वारा निर्मित उत्पाद खोजें।"
                  : "Discover artisan-made products."}
              </h1>
            </div>

            {/* Editorial Supporting Description */}
            <p className="text-base sm:text-lg text-[#78716C] leading-relaxed max-w-xl font-normal">
              {language === "hi"
                ? "प्रत्येक उत्पाद के पीछे के पारंपरिक शिल्प को जानें। भारत के सुदूर ग्रामीण कारीगरों से सीधे आपके घर और आधुनिक बाज़ार तक प्रत्यक्ष जुड़ाव।"
                : "Explore the craft behind every product. Direct linkages from indigenous master artisans across India to contemporary homes and global commerce."}
            </p>

            {/* Primary & Secondary Call To Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="rounded-xl group font-semibold text-xs sm:text-sm">
                  <span>
                    {language === "hi" ? "शिल्प उत्पाद देखें" : "Explore products"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="/auth">
                <Button variant="outline" size="lg" className="rounded-xl font-semibold text-xs sm:text-sm">
                  {language === "hi" ? "कारीगर के रूप में जुड़ें" : "Sell with ARTKALA"}
                </Button>
              </Link>
            </div>

            {/* Authentic Heritage Numbers */}
            <div className="pt-6 border-t border-[#E8DFD5] grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  24+
                </p>
                <p className="text-xs text-[#78716C] font-medium">
                  {language === "hi" ? "कारीगर क्लस्टर" : "Indigenous Clusters"}
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  100%
                </p>
                <p className="text-xs text-[#78716C] font-medium">
                  {language === "hi" ? "सत्यापित स्रोत" : "Direct Maker Proof"}
                </p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  0%
                </p>
                <p className="text-xs text-[#78716C] font-medium">
                  {language === "hi" ? "बिचौलिया कमीशन" : "Middlemen Margin"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Aesthetic Cropped Pottery Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full max-w-md lg:max-w-none overflow-hidden rounded-3xl border border-[#E8DFD5] shadow-2xl bg-[#F4EFEA] group">
              <Image
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=85"
                alt={language === "hi" ? "पारंपरिक हस्तनिर्मित टेराकोटा मृदभांड" : "Handcrafted Indian Terracotta Pottery"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Top Provenance Badge */}
              <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-[#1C1917] shadow-sm">
                <Sparkles className="h-3 w-3 text-[#C85A32]" />
                <span>{language === "hi" ? "मिट्टी की विरासत" : "Living Clay Heritage"}</span>
              </div>

              {/* Floating Story Accent Card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 shadow-xl border border-[#E8DFD5] backdrop-blur-md">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A32] flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#C85A32] animate-pulse" />
                    {language === "hi" ? "शिल्प परंपरा" : "Craft Heritage"}
                  </span>
                  <span className="text-[10px] text-[#3F5E4D] font-semibold bg-[#EBF1ED] px-2 py-0.5 rounded-md">
                    {language === "hi" ? "सत्यापित कार्यशाला" : "Workshop Verified"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1C1917] leading-snug">
                  {language === "hi"
                    ? "बांकुरा टेराकोटा लाल मिट्टी — सदियों की जीवित हस्तकला"
                    : "Terracotta and Riverbank Alluvial Clay from Bankura Guild"}
                </p>
                <div className="mt-1.5 text-[11px] text-[#78716C] flex items-center justify-between">
                  <span>{language === "hi" ? "बिष्णुपुर कुम्हार परंपरा" : "Bishnupur Potter Guild"}</span>
                  <span className="font-semibold text-[#1C1917]">
                    {language === "hi" ? "100% प्राकृतिक सामग्री" : "100% Natural Clay"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
