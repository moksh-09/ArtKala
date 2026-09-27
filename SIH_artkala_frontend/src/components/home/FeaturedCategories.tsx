"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";

export function FeaturedCategories() {
  const { language } = useLanguage();

  return (
    <section id="categories" className="py-16 md:py-24 bg-[#F4EFEA]/60 border-y border-[#E8DFD5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C85A32] font-semibold block mb-2">
              <VanishText textKey="categories.title" fallback="Curated Craft Traditions" />
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141311]">
              {language === "hi"
                ? "जीवित भारतीय धरोहर की शिल्प परंपराएं"
                : "Heritage traditions, shaped by living hands."}
            </h2>
          </div>
          <p className="text-sm text-[#78716C] max-w-md">
            <VanishText
              textKey="categories.subtitle"
              fallback="Explore master works across centuries of living heritage."
            />
          </p>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Large Anchor Tile (Span 7 cols) */}
          <Link
            href="/shop?craft=Bamboo"
            className="group relative md:col-span-7 h-[420px] md:h-[500px] overflow-hidden rounded-3xl bg-[#1C1917] shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1200&q=80"
              alt="Bamboo and Cane Handcrafted Baskets"
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover object-center opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:rotate-45 group-hover:bg-[#C85A32]">
              <ArrowUpRight className="h-5 w-5" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="inline-block rounded-md bg-[#C85A32] px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                {language === "hi" ? "प्रमुख क्लस्टर" : "Primary Cluster"}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold">
                <VanishText textKey="categories.bamboo.name" fallback="Bamboo & Cane" />
              </h3>
              <p className="text-sm text-stone-200">
                <VanishText
                  textKey="categories.bamboo.meta"
                  fallback="Assam & Northeast Clusters • 18+ Verified Artisans"
                />
              </p>
            </div>
          </Link>

          {/* Right Companion Column (Span 5 cols, 2 stacked tiles) */}
          <div className="md:col-span-5 grid grid-cols-1 gap-6">
            {/* Terracotta Tile */}
            <Link
              href="/shop?craft=Pottery"
              className="group relative h-[238px] overflow-hidden rounded-3xl bg-[#1C1917] shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80"
                alt="Terracotta and Clay Pottery"
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover object-center opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:rotate-45 group-hover:bg-[#C85A32]">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <h3 className="font-display text-xl font-bold">
                  <VanishText textKey="categories.pottery.name" fallback="Terracotta & Pottery" />
                </h3>
                <p className="text-xs text-stone-200">
                  <VanishText
                    textKey="categories.pottery.meta"
                    fallback="Kutch & Bankura Red Clay • 24+ Artisans"
                  />
                </p>
              </div>
            </Link>

            {/* Handloom & Textiles Tile */}
            <Link
              href="/shop?craft=Textile"
              className="group relative h-[238px] overflow-hidden rounded-3xl bg-[#1C1917] shadow-sm transition-all duration-300 hover:shadow-lg"
            >
              <Image
                src="https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80"
                alt="Handloom Weaving and Textiles"
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover object-center opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:rotate-45 group-hover:bg-[#C85A32]">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <h3 className="font-display text-xl font-bold">
                  <VanishText textKey="categories.textiles.name" fallback="Handloom & Textiles" />
                </h3>
                <p className="text-xs text-stone-200">
                  <VanishText
                    textKey="categories.textiles.meta"
                    fallback="Varanasi Silk & Maheshwari • 42+ Artisans"
                  />
                </p>
              </div>
            </Link>
          </div>

          {/* Bottom Row (2 Equal Asymmetric Wide Tiles) */}
          <Link
            href="/shop?craft=Wood"
            className="group relative md:col-span-6 h-[220px] overflow-hidden rounded-3xl bg-[#1C1917] shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80"
              alt="Wood Carving and Inlay"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:rotate-45 group-hover:bg-[#C85A32]">
              <ArrowUpRight className="h-4 w-4" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <h3 className="font-display text-xl font-bold">
                <VanishText textKey="categories.wood.name" fallback="Wood Carving & Inlay" />
              </h3>
              <p className="text-xs text-stone-200">
                <VanishText
                  textKey="categories.wood.meta"
                  fallback="Saharanpur & Channapatna Crafts • 15+ Artisans"
                />
              </p>
            </div>
          </Link>

          <Link
            href="/shop?craft=Brass"
            className="group relative md:col-span-6 h-[220px] overflow-hidden rounded-3xl bg-[#1C1917] shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80"
              alt="Dhokra Metal Castings"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center opacity-85 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform group-hover:rotate-45 group-hover:bg-[#C85A32]">
              <ArrowUpRight className="h-4 w-4" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <h3 className="font-display text-xl font-bold">
                <VanishText textKey="categories.brass.name" fallback="Dhokra & Metal Craft" />
              </h3>
              <p className="text-xs text-stone-200">
                <VanishText
                  textKey="categories.brass.meta"
                  fallback="Bastar Lost-Wax Castings • 19+ Artisans"
                />
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
