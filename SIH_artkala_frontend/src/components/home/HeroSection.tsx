"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function HeroSection() {
  const { language } = useLanguage();
  const { ref, isRevealed } = useScrollReveal(0.05);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-8 pb-20 md:pt-14 md:pb-32 lg:pt-16 lg:pb-36"
    >
      {/* Subtle organic background blurs */}
      <div className="absolute top-[-8rem] right-[10%] -z-10 h-[480px] w-[480px] rounded-full bg-[#EBE5DC]/50 blur-[100px]" />
      <div className="absolute bottom-[-4rem] left-[-4rem] -z-10 h-[380px] w-[380px] rounded-full bg-[#FBF2EE]/60 blur-[80px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-7 md:space-y-9">
            {/* Provenance Pill */}
            <div
              className={`inline-flex items-center gap-2 rounded-full border border-[#EBE5DC] bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs text-[#1A1816] shadow-[0_1px_4px_rgba(0,0,0,0.03)] w-fit pill-hover transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#3F5E4D]" />
              <span className="font-medium tracking-wide">
                {language === "hi"
                  ? "100% सत्यापित कारीगर प्रमाणिकता"
                  : "100% Verified Artisan Provenance"}
              </span>
            </div>

            {/* Main Dossier Display Heading */}
            <div
              className={`space-y-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C85A32] font-semibold block">
                {language === "hi"
                  ? "भारतीय हस्तशिल्प की प्रामाणिक धरोहर"
                  : "Sovereign Indian Craftsmanship"}
              </span>
              <h1 className="font-dossier text-[2.75rem] sm:text-[3.5rem] md:text-[4.25rem] lg:text-[5rem] text-[#0F0E0C]">
                {language === "hi"
                  ? "कारीगरों द्वारा निर्मित उत्पाद खोजें।"
                  : "Discover artisan-made products."}
              </h1>
            </div>

            {/* Supporting Description */}
            <p
              className={`text-[15px] sm:text-base text-[#6B6560] leading-[1.7] max-w-lg font-normal transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {language === "hi"
                ? "प्रत्येक उत्पाद के पीछे के पारंपरिक शिल्प को जानें। भारत के सुदूर ग्रामीण कारीगरों से सीधे आपके घर और आधुनिक बाज़ार तक प्रत्यक्ष जुड़ाव।"
                : "Explore the craft behind every product. Direct linkages from indigenous master artisans across India to contemporary homes and global commerce."}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap items-center gap-4 pt-1 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Link href="/shop">
                <Button
                  variant="primary"
                  size="lg"
                  className="rounded-xl group font-semibold text-xs sm:text-sm magnetic-hover"
                >
                  <span>
                    {language === "hi" ? "शिल्प उत्पाद देखें" : "Explore products"}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Button>
              </Link>

              <Link href="/auth">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-xl font-semibold text-xs sm:text-sm magnetic-hover"
                >
                  {language === "hi" ? "कारीगर के रूप में जुड़ें" : "Sell with ARTKALA"}
                </Button>
              </Link>
            </div>

            {/* Heritage Numbers */}
            <div
              className={`pt-7 border-t border-[#EBE5DC] grid grid-cols-3 gap-8 max-w-md transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-[400ms] ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {[
                {
                  num: "24+",
                  label: language === "hi" ? "कारीगर क्लस्टर" : "Indigenous Clusters",
                },
                {
                  num: "100%",
                  label: language === "hi" ? "सत्यापित स्रोत" : "Direct Maker Proof",
                },
                {
                  num: "0%",
                  label: language === "hi" ? "बिचौलिया कमीशन" : "Middlemen Margin",
                },
              ].map((stat, i) => (
                <div key={i} className="group/stat cursor-default">
                  <p className="font-dossier text-[1.75rem] sm:text-[2rem] text-[#1A1816] transition-colors duration-300 group-hover/stat:text-[#C85A32]">
                    {stat.num}
                  </p>
                  <p className="text-[11px] text-[#6B6560] font-medium tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Hero Image */}
          <div
            className={`lg:col-span-5 relative transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
              isRevealed ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.98]"
            }`}
          >
            <div className="relative mx-auto aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full max-w-md lg:max-w-none overflow-hidden rounded-[1.75rem] border border-[#EBE5DC] shadow-[0_24px_80px_-12px_rgba(28,25,23,0.12)] bg-[#F5F1EC] group img-zoom">
              <Image
                src="/images/artisan-potter-hero.png"
                alt={
                  language === "hi"
                    ? "पारंपरिक चाक पर मिट्टी के बर्तन गढ़ते भारतीय मास्टर कुम्हार"
                    : "Master Indian Potter Sculpting Earthen Vessel on Traditional Wheel"
                }
                fill
                priority
                quality={95}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

              {/* Top Badge */}
              <div className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full bg-white/92 backdrop-blur-lg px-3.5 py-1.5 text-[11px] font-semibold text-[#1A1816] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.03]">
                <Sparkles className="h-3 w-3 text-[#C85A32]" />
                <span className="tracking-wide">
                  {language === "hi" ? "मिट्टी की विरासत" : "Living Clay Heritage"}
                </span>
              </div>

              {/* Floating Story Card */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 p-4 sm:p-5 shadow-xl border border-[#EBE5DC]/80 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:translate-y-[-2px] hover:shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#C85A32] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C85A32] animate-pulse" />
                    {language === "hi" ? "शिल्प परंपरा" : "Craft Heritage"}
                  </span>
                  <span className="text-[10px] text-[#3F5E4D] font-semibold bg-[#EDF3EF] px-2.5 py-0.5 rounded-md">
                    {language === "hi"
                      ? "सत्यापित कार्यशाला"
                      : "Workshop Verified"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-[#1A1816] leading-snug">
                  {language === "hi"
                    ? "बांकुरा टेराकोटा लाल मिट्टी — सदियों की जीवित हस्तकला"
                    : "Terracotta and Riverbank Alluvial Clay from Bankura Guild"}
                </p>
                <div className="mt-2 text-[11px] text-[#6B6560] flex items-center justify-between">
                  <span>
                    {language === "hi"
                      ? "बिष्णुपुर कुम्हार परंपरा"
                      : "Bishnupur Potter Guild"}
                  </span>
                  <span className="font-semibold text-[#1A1816]">
                    {language === "hi"
                      ? "100% प्राकृतिक सामग्री"
                      : "100% Natural Clay"}
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
