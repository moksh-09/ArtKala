"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Sparkles, Layers } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";

export function BusinessPurchasingSection() {
  const { language } = useLanguage();
  const [procurementInput, setProcurementInput] = useState("");

  return (
    <section className="py-20 md:py-28 bg-[#FAF8F5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-[#C85A32]" />
            <span className="text-xs uppercase tracking-widest text-[#C85A32] font-semibold">
              <VanishText textKey="business.tag" fallback="Institutional & Bulk Procurement" />
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141311]">
            <VanishText
              textKey="business.title"
              fallback="Describe what your business needs."
            />
          </h2>
          <p className="mt-3 text-sm md:text-base text-[#78716C]">
            <VanishText
              textKey="business.subtitle"
              fallback="From sustainable hospitality tableware to 2,000 corporate gift hampers, ARTKALA links procurement teams directly with verified artisan clusters."
            />
          </p>
        </div>

        {/* Split Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left: Natural-Language Requirement Composer & Extraction */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-8 border border-[#E8DFD5] shadow-sm">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="procurement-sample"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-2"
                >
                  {language === "hi" ? "प्राकृतिक भाषा मांग विवरण" : "Natural-Language Demand Composer"}
                </label>
                <div className="relative">
                  <textarea
                    id="procurement-sample"
                    rows={3}
                    value={procurementInput}
                    onChange={(e) => setProcurementInput(e.target.value)}
                    className="w-full rounded-2xl border border-[#E8DFD5] bg-[#FAF8F5] p-4 text-sm text-[#1C1917] outline-none transition-colors focus:border-[#C85A32] focus:bg-white resize-none"
                    placeholder={
                      language === "hi"
                        ? "व्यावसायिक खरीद या मांग विवरण लिखें..."
                        : "Describe what your enterprise needs (e.g. quantity, craft, delivery window)..."
                    }
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-1.5 text-[11px] text-[#A8A29E]">
                    <Sparkles className="h-3 w-3 text-[#C85A32]" />
                    <span>{language === "hi" ? "एआई प्रारूप निष्कर्षण" : "AI Schema Extraction"}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Extracted Schema Display */}
              <div className="rounded-2xl bg-[#F4EFEA]/70 p-4 border border-[#E8DFD5]">
                <div className="flex items-center justify-between mb-3 text-xs font-medium text-[#78716C]">
                  <span>{language === "hi" ? "निकाला गया संरचित प्रारूप" : "Extracted Requirement Schema"}</span>
                  <span className="text-[11px] text-[#3F5E4D] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {procurementInput.trim()
                      ? language === "hi" ? "क्लस्टर क्षमता सत्यापित" : "Cluster Capacity Matched"
                      : language === "hi" ? "लाइव मिलान सक्रिय" : "Live Match Ready"}
                  </span>
                </div>

                {procurementInput.trim() ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-xl bg-white p-2.5 border border-[#E8DFD5]">
                      <span className="text-[10px] uppercase text-[#A8A29E] block">
                        {language === "hi" ? "उत्पाद" : "Product"}
                      </span>
                      <span className="font-semibold text-[#1C1917] truncate block">
                        {procurementInput.toLowerCase().includes("terracotta") || procurementInput.includes("मिट्टी")
                          ? (language === "hi" ? "टेराकोटा मृदभांड" : "Terracotta Vessel")
                          : procurementInput.toLowerCase().includes("silk") || procurementInput.includes("रेशम")
                          ? (language === "hi" ? "टसर रेशम वस्त्र" : "Tussar Silk")
                          : (language === "hi" ? "हस्तनिर्मित शिल्प" : "Artisan Craft")}
                      </span>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-[#E8DFD5]">
                      <span className="text-[10px] uppercase text-[#A8A29E] block">
                        {language === "hi" ? "मात्रा" : "Quantity"}
                      </span>
                      <span className="font-semibold text-[#1C1917]">
                        {procurementInput.match(/\d+/)
                          ? `${procurementInput.match(/\d+/)?.[0]} ${language === "hi" ? "नग" : "units"}`
                          : (language === "hi" ? "लचीली बैच" : "Flexible Batch")}
                      </span>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-[#E8DFD5]">
                      <span className="text-[10px] uppercase text-[#A8A29E] block">
                        {language === "hi" ? "समय-सीमा" : "Deadline"}
                      </span>
                      <span className="font-semibold text-[#1C1917]">
                        {language === "hi" ? "अनुकूलित चक्र" : "Custom Schedule"}
                      </span>
                    </div>
                    <div className="rounded-xl bg-white p-2.5 border border-[#E8DFD5]">
                      <span className="text-[10px] uppercase text-[#A8A29E] block">
                        {language === "hi" ? "क्लस्टर सुरक्षा" : "Cluster Safe"}
                      </span>
                      <span className="font-semibold text-[#3F5E4D]">
                        {language === "hi" ? "100% कारीगर वेतन" : "100% Fair Wage"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl bg-white/60 p-3 text-center text-xs text-[#78716C] border border-dashed border-[#D6CEBE]">
                    {language === "hi"
                      ? "ऊपर अपनी खरीद आवश्यकता दर्ज करें। एआई तुरंत संरचित अनुबंध और क्लस्टर क्षमता निकालेगा।"
                      : "Enter your procurement specifications above to generate a structured contract with live cluster capacity."}
                  </div>
                )}
              </div>

              {/* Two Trust Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                    <VanishText textKey="business.benefit1" fallback="Explainable Matching" />
                  </h4>
                  <p className="text-xs text-[#78716C]">
                    <VanishText
                      textKey="business.benefit1Desc"
                      fallback="Clear audit trails for capacity, lead time, and material compliance."
                    />
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                    <VanishText textKey="business.benefit2" fallback="Cluster Fulfilment" />
                  </h4>
                  <p className="text-xs text-[#78716C]">
                    <VanishText
                      textKey="business.benefit2Desc"
                      fallback="Distributed production schedules across co-operative artisan groups."
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E8DFD5]">
              <Link href="/business">
                <Button variant="primary" size="md" className="rounded-xl group">
                  <span>
                    <VanishText textKey="business.cta" fallback="Explore Business Purchases" />
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Institutional Artisan Cluster Visual */}
          <div className="lg:col-span-5 relative flex flex-col justify-end overflow-hidden rounded-3xl bg-[#1C1917] p-8 text-white min-h-[380px]">
            <Image
              src="https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan Cooperative Workshop"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover opacity-40 transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3F5E4D] px-3 py-1 text-xs font-semibold text-white">
                <Layers className="h-3.5 w-3.5" />
                {language === "hi" ? "क्लस्टर लिंकेज नेटवर्क" : "Cluster Allocation Engine"}
              </span>
              <h3 className="font-display text-2xl font-bold">
                {language === "hi"
                  ? "महाराष्ट्र व पूर्वोत्तर बांस शिल्पी महासंघ"
                  : "Maharashtra Bamboo & Cane Producer Guild"}
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                {language === "hi"
                  ? "42 प्रमाणित ग्रामीण कारीगर सामूहिक रूप से 2,000 नग का संस्थागत ऑर्डर 30 दिनों में पूर्ण करने में सक्षम।"
                  : "Federated cluster of 42 master artisans capable of delivering 2,000 units within a 30-day fulfillment window."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
