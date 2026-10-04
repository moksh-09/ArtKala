"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function FeaturedCategories() {
  const { language } = useLanguage();
  const { ref, isRevealed } = useScrollReveal(0.08);

  const categories = [
    {
      href: "/shop?craft=Bamboo",
      img: "https://images.unsplash.com/photo-1675081632939-5294f776dd75?auto=format&fit=crop&w=1200&q=80",
      alt: "Artisan Hands Weaving Cane & Bamboo Craft",
      nameKey: "categories.bamboo.name",
      nameFallback: "Bamboo & Cane",
      metaKey: "categories.bamboo.meta",
      metaFallback: "Assam & Northeast Clusters • 18+ Verified Artisans",
      badge: language === "hi" ? "प्रमुख क्लस्टर" : "Primary Cluster",
      span: "md:col-span-7",
      height: "h-[380px] md:h-[480px]",
      titleSize: "text-2xl sm:text-3xl",
    },
    {
      href: "/shop?craft=Pottery",
      img: "https://images.unsplash.com/photo-1590605105526-5c08f63f89aa?auto=format&fit=crop&w=800&q=80",
      alt: "Master Potter Shaping Wet Terracotta Clay on Traditional Wheel",
      nameKey: "categories.pottery.name",
      nameFallback: "Terracotta & Pottery",
      metaKey: "categories.pottery.meta",
      metaFallback: "Kutch & Bankura Red Clay • 24+ Artisans",
      span: "",
      height: "h-[220px]",
      titleSize: "text-xl",
    },
    {
      href: "/shop?craft=Textile",
      img: "https://images.unsplash.com/photo-1759738101532-0c2726bf68af?auto=format&fit=crop&w=800&q=80",
      alt: "Indian Handloom Weaver Crafting Traditional Fabric",
      nameKey: "categories.textiles.name",
      nameFallback: "Handloom & Textiles",
      metaKey: "categories.textiles.meta",
      metaFallback: "Varanasi Silk & Maheshwari • 42+ Artisans",
      span: "",
      height: "h-[220px]",
      titleSize: "text-xl",
    },
  ];

  const bottomCategories = [
    {
      href: "/shop?craft=Wood",
      img: "https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80",
      alt: "Master Craftsman Hand Carving Wood with Chisel",
      nameKey: "categories.wood.name",
      nameFallback: "Wood Carving & Inlay",
      metaKey: "categories.wood.meta",
      metaFallback: "Saharanpur & Channapatna Crafts • 15+ Artisans",
    },
    {
      href: "/shop?craft=Brass",
      img: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
      alt: "Traditional Dhokra Lost-Wax Bell Metal Craftsmanship",
      nameKey: "categories.brass.name",
      nameFallback: "Dhokra & Metal Craft",
      metaKey: "categories.brass.meta",
      metaFallback: "Bastar Lost-Wax Castings • 19+ Artisans",
    },
  ];

  return (
    <section ref={ref} id="categories" className="py-20 md:py-28 bg-[#F5F1EC]/50 border-y border-[#EBE5DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C85A32] font-semibold block mb-3">
              <VanishText textKey="categories.title" fallback="Curated Craft Traditions" />
            </span>
            <h2 className="font-dossier text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] text-[#0F0E0C]">
              {language === "hi"
                ? "जीवित भारतीय धरोहर की शिल्प परंपराएं"
                : "Heritage traditions, shaped by living hands."}
            </h2>
          </div>
          <p className="text-[13px] text-[#6B6560] max-w-sm leading-relaxed">
            <VanishText
              textKey="categories.subtitle"
              fallback="Explore master works across centuries of living heritage."
            />
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Main Large Tile */}
          <Link
            href={categories[0].href}
            className={`group relative md:col-span-7 h-[380px] md:h-[480px] overflow-hidden rounded-[1.5rem] bg-[#1A1816] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_20px_60px_-12px_rgba(28,25,23,0.2)] delay-100 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Image
              src={categories[0].img}
              alt={categories[0].alt}
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover object-center opacity-80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/10 transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#C85A32] group-hover:border-[#C85A32]">
              <ArrowUpRight className="h-5 w-5" />
            </div>

            <div className="absolute bottom-8 left-8 right-8 text-white space-y-2">
              <span className="inline-block rounded-md bg-[#C85A32] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
                {categories[0].badge}
              </span>
              <h3 className="font-dossier text-2xl sm:text-3xl text-white">
                <VanishText textKey={categories[0].nameKey} fallback={categories[0].nameFallback} />
              </h3>
              <p className="text-[13px] text-stone-300/90">
                <VanishText textKey={categories[0].metaKey} fallback={categories[0].metaFallback} />
              </p>
            </div>
          </Link>

          {/* Right Column */}
          <div className="md:col-span-5 grid grid-cols-1 gap-5">
            {categories.slice(1).map((cat, i) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`group relative h-[220px] overflow-hidden rounded-[1.5rem] bg-[#1A1816] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_16px_48px_-12px_rgba(28,25,23,0.18)] ${
                  i === 0 ? "delay-200" : "delay-300"
                } ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              >
                <Image
                  src={cat.img}
                  alt={cat.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 42vw"
                  className="object-cover object-center opacity-80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/10 transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#C85A32] group-hover:border-[#C85A32]">
                  <ArrowUpRight className="h-4 w-4" />
                </div>

                <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                  <h3 className="font-dossier text-xl text-white">
                    <VanishText textKey={cat.nameKey} fallback={cat.nameFallback} />
                  </h3>
                  <p className="text-[12px] text-stone-300/90">
                    <VanishText textKey={cat.metaKey} fallback={cat.metaFallback} />
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom Row */}
          {bottomCategories.map((cat, i) => (
            <Link
              key={cat.href}
              href={cat.href}
              className={`group relative md:col-span-6 h-[200px] overflow-hidden rounded-[1.5rem] bg-[#1A1816] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_16px_48px_-12px_rgba(28,25,23,0.18)] ${
                i === 0 ? "delay-[350ms]" : "delay-[450ms]"
              } ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <Image
                src={cat.img}
                alt={cat.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center opacity-80 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06] group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md border border-white/10 transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#C85A32] group-hover:border-[#C85A32]">
                <ArrowUpRight className="h-4 w-4" />
              </div>

              <div className="absolute bottom-5 left-6 right-6 text-white space-y-1">
                <h3 className="font-dossier text-xl text-white">
                  <VanishText textKey={cat.nameKey} fallback={cat.nameFallback} />
                </h3>
                <p className="text-[12px] text-stone-300/90">
                  <VanishText textKey={cat.metaKey} fallback={cat.metaFallback} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
