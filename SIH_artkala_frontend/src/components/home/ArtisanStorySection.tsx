"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, MapPin, Award } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function ArtisanStorySection() {
  const { language } = useLanguage();
  const { ref, isRevealed } = useScrollReveal(0.08);

  return (
    <section ref={ref} id="artisan-story" className="py-24 md:py-32 bg-[#1A1816] text-white relative overflow-hidden">
      {/* Warm ambient glow */}
      <div className="absolute top-[-6rem] right-[-6rem] -z-0 h-[500px] w-[500px] rounded-full bg-[#C85A32]/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-4rem] left-[-4rem] -z-0 h-[300px] w-[300px] rounded-full bg-[#3F5E4D]/6 blur-[80px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Craft Photography */}
          <div
            className={`lg:col-span-6 relative transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border border-white/8 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.4)] img-zoom">
              <Image
                src="/images/artisan-potter-hero.png"
                alt="Master Artisan Rameshwar Kumbhar Shaping Clay Terracotta"
                fill
                quality={95}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Provenance Tag */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[12px] text-stone-300 backdrop-blur-xl bg-black/50 p-3.5 rounded-xl border border-white/8 transition-all duration-300 hover:bg-black/60">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#C85A32]" />
                  <span>
                    <VanishText textKey="artisanStory.location" fallback="Bishnupur, Bankura • West Bengal" />
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-400">
                  <Award className="h-3.5 w-3.5 text-[#3F5E4D]" />
                  <span>{language === "hi" ? "सत्यापित मास्टर गिल्ड" : "Verified Master Guild"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-6 space-y-7 md:space-y-9">
            <div
              className={`space-y-3 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#C85A32] font-semibold block">
                <VanishText textKey="artisanStory.tag" fallback="Artisan In Focus" />
              </span>
              <h2 className="font-dossier text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] text-[#FAFAF8]">
                <VanishText textKey="artisanStory.name" fallback="Rameshwar Kumbhar" />
              </h2>
              <p className="text-[13px] font-medium text-stone-400 tracking-wide">
                <VanishText textKey="artisanStory.craft" fallback="Terracotta & Earthenware Sculptor" />
              </p>
            </div>

            {/* Editorial Quote */}
            <div
              className={`relative pl-6 border-l-2 border-[#C85A32]/60 text-stone-200 text-base md:text-[1.1rem] leading-[1.7] font-dossier-light transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Quote className="h-5 w-5 text-[#C85A32]/30 absolute -top-3 left-1 rotate-180" />
              <VanishText
                textKey="artisanStory.quote"
                fallback="Our hands shape what our ancestors dreamed. Every urn holds the smell of Indian soil."
              />
            </div>

            {/* Narrative */}
            <p
              className={`text-[14px] md:text-[15px] text-stone-400 leading-[1.7] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-300 ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <VanishText
                textKey="artisanStory.story"
                fallback="For over three generations, Rameshwar's family has turned alluvial riverbank clay into intricate terracotta sculptures. With ARTKALA's smart cataloging, his traditional pottery now reaches interior designers and conscious collectors without middlemen."
              />
            </p>

            {/* Stats */}
            <div
              className={`grid grid-cols-2 gap-8 pt-6 border-t border-white/8 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-[400ms] ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div className="group/stat cursor-default">
                <p className="font-dossier text-[1.75rem] sm:text-[2rem] text-[#FAFAF8] transition-colors duration-300 group-hover/stat:text-[#C85A32]">
                  <VanishText textKey="artisanStory.statsTradition" fallback="45 Years" />
                </p>
                <p className="text-[11px] text-stone-500 tracking-wide">
                  <VanishText
                    textKey="artisanStory.statsTraditionLabel"
                    fallback="Living Craft Practice"
                  />
                </p>
              </div>

              <div className="group/stat cursor-default">
                <p className="font-dossier text-[1.75rem] sm:text-[2rem] text-[#FAFAF8] transition-colors duration-300 group-hover/stat:text-[#C85A32]">
                  <VanishText textKey="artisanStory.statsBatch" fallback="350 units" />
                </p>
                <p className="text-[11px] text-stone-500 tracking-wide">
                  <VanishText
                    textKey="artisanStory.statsBatchLabel"
                    fallback="Monthly Cluster Capacity"
                  />
                </p>
              </div>
            </div>

            {/* CTA */}
            <div
              className={`pt-2 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-[500ms] ${
                isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Link href="/shop/artisan/ART001">
                <Button variant="primary" size="lg" className="rounded-xl group magnetic-hover">
                  <span>
                    <VanishText textKey="artisanStory.cta" fallback="View artisan profile" />
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
