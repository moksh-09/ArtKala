"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, MapPin, Award } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";

export function ArtisanStorySection() {
  const { language } = useLanguage();

  return (
    <section id="artisan-story" className="py-20 md:py-28 bg-[#1C1917] text-white relative overflow-hidden">
      {/* Background warm grain accents */}
      <div className="absolute top-0 right-0 -z-0 h-96 w-96 rounded-full bg-[#C85A32]/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Full-Height Artisan Craft Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full overflow-hidden rounded-3xl border border-stone-800 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80"
                alt="Master Artisan Shaping Terracotta Craft"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Provenance Tag on Image */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-stone-300 backdrop-blur-md bg-black/40 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#C85A32]" />
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

          {/* Right Column: Editorial Narrative & Provenance Metrics */}
          <div className="lg:col-span-6 space-y-6 md:space-y-8">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#C85A32] font-semibold block">
                <VanishText textKey="artisanStory.tag" fallback="Artisan In Focus" />
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF8F5]">
                <VanishText textKey="artisanStory.name" fallback="Rameshwar Kumbhar" />
              </h2>
              <p className="text-sm font-medium text-stone-400">
                <VanishText textKey="artisanStory.craft" fallback="Terracotta & Earthenware Sculptor" />
              </p>
            </div>

            {/* Editorial Quote */}
            <div className="relative pl-6 border-l-2 border-[#C85A32] italic text-stone-200 text-base md:text-lg leading-relaxed">
              <Quote className="h-5 w-5 text-[#C85A32]/40 absolute -top-3 left-1 rotate-180" />
              <VanishText
                textKey="artisanStory.quote"
                fallback="Our hands shape what our ancestors dreamed. Every urn holds the smell of Indian soil."
              />
            </div>

            {/* Narrative Paragraph */}
            <p className="text-sm md:text-base text-stone-300 leading-relaxed font-light">
              <VanishText
                textKey="artisanStory.story"
                fallback="For over three generations, Rameshwar's family has turned alluvial riverbank clay into intricate terracotta sculptures. With ARTKALA's smart cataloging, his traditional pottery now reaches interior designers and conscious collectors without middlemen."
              />
            </p>

            {/* Verified Production Numbers */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-800">
              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#FAF8F5]">
                  <VanishText textKey="artisanStory.statsTradition" fallback="45 Years" />
                </p>
                <p className="text-xs text-stone-400">
                  <VanishText
                    textKey="artisanStory.statsTraditionLabel"
                    fallback="Living Craft Practice"
                  />
                </p>
              </div>

              <div>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#FAF8F5]">
                  <VanishText textKey="artisanStory.statsBatch" fallback="350 units" />
                </p>
                <p className="text-xs text-stone-400">
                  <VanishText
                    textKey="artisanStory.statsBatchLabel"
                    fallback="Monthly Cluster Capacity"
                  />
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2">
              <Link href="/shop/artisan/ART001">
                <Button variant="primary" size="lg" className="rounded-xl group">
                  <span>
                    <VanishText textKey="artisanStory.cta" fallback="View artisan profile" />
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
