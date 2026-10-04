"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, Sparkles, Layers } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function BusinessPurchasingSection() {
  const { language } = useLanguage();
  const [procurementInput, setProcurementInput] = useState("");
  const { ref, isRevealed } = useScrollReveal(0.08);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`max-w-2xl mb-14 md:mb-18 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-4 w-4 text-[#C85A32]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C85A32] font-semibold">
              <VanishText textKey="business.tag" fallback="Institutional & Bulk Procurement" />
            </span>
          </div>
          <h2 className="font-dossier text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] text-[#0F0E0C]">
            <VanishText
              textKey="business.title"
              fallback="Describe what your business needs."
            />
          </h2>
          <p className="mt-3 text-[13px] md:text-[14px] text-[#6B6560] leading-[1.7]">
            <VanishText
              textKey="business.subtitle"
              fallback="From sustainable hospitality tableware to 2,000 corporate gift hampers, ARTKALA links procurement teams directly with verified artisan clusters."
            />
          </p>
        </div>

        {/* Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left: Composer */}
          <div
            className={`lg:col-span-7 flex flex-col justify-between rounded-[1.5rem] bg-white p-6 sm:p-8 border border-[#EBE5DC] shadow-[0_4px_20px_-8px_rgba(28,25,23,0.04)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[0_8px_40px_-12px_rgba(28,25,23,0.08)] delay-100 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="procurement-sample"
                  className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#6B6560] mb-2.5"
                >
                  {language === "hi" ? "प्राकृतिक भाषा मांग विवरण" : "Natural-Language Demand Composer"}
                </label>
                <div className="relative">
                  <textarea
                    id="procurement-sample"
                    rows={3}
                    value={procurementInput}
                    onChange={(e) => setProcurementInput(e.target.value)}
                    className="w-full rounded-2xl border border-[#EBE5DC] bg-[#FAFAF8] p-4 text-[14px] text-[#1A1816] outline-none transition-all duration-300 focus:border-[#C85A32] focus:bg-white focus:shadow-[0_0_0_3px_rgba(200,90,50,0.06)] resize-none"
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

              {/* Extracted Schema */}
              <div className="rounded-2xl bg-[#F5F1EC]/60 p-5 border border-[#EBE5DC]">
                <div className="flex items-center justify-between mb-3 text-[12px] font-medium text-[#6B6560]">
                  <span>{language === "hi" ? "निकाला गया संरचित प्रारूप" : "Extracted Requirement Schema"}</span>
                  <span className="text-[11px] text-[#3F5E4D] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {procurementInput.trim()
                      ? language === "hi" ? "क्लस्टर क्षमता सत्यापित" : "Cluster Capacity Matched"
                      : language === "hi" ? "लाइव मिलान सक्रिय" : "Live Match Ready"}
                  </span>
                </div>

                {procurementInput.trim() ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                    {[
                      {
                        label: language === "hi" ? "उत्पाद" : "Product",
                        value: procurementInput.toLowerCase().includes("terracotta") || procurementInput.includes("मिट्टी")
                          ? (language === "hi" ? "टेराकोटा मृदभांड" : "Terracotta Vessel")
                          : procurementInput.toLowerCase().includes("silk") || procurementInput.includes("रेशम")
                          ? (language === "hi" ? "टसर रेशम वस्त्र" : "Tussar Silk")
                          : (language === "hi" ? "हस्तनिर्मित शिल्प" : "Artisan Craft"),
                        color: "text-[#1A1816]",
                      },
                      {
                        label: language === "hi" ? "मात्रा" : "Quantity",
                        value: procurementInput.match(/\d+/)
                          ? `${procurementInput.match(/\d+/)?.[0]} ${language === "hi" ? "नग" : "units"}`
                          : (language === "hi" ? "लचीली बैच" : "Flexible Batch"),
                        color: "text-[#1A1816]",
                      },
                      {
                        label: language === "hi" ? "समय-सीमा" : "Deadline",
                        value: language === "hi" ? "अनुकूलित चक्र" : "Custom Schedule",
                        color: "text-[#1A1816]",
                      },
                      {
                        label: language === "hi" ? "क्लस्टर सुरक्षा" : "Cluster Safe",
                        value: language === "hi" ? "100% कारीगर वेतन" : "100% Fair Wage",
                        color: "text-[#3F5E4D]",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl bg-white p-3 border border-[#EBE5DC] transition-all duration-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#D6CEBE]"
                      >
                        <span className="text-[10px] uppercase tracking-[0.1em] text-[#A8A29E] block">
                          {item.label}
                        </span>
                        <span className={`font-semibold ${item.color} truncate block mt-0.5`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-white/60 p-4 text-center text-[12px] text-[#6B6560] border border-dashed border-[#D6CEBE]">
                    {language === "hi"
                      ? "ऊपर अपनी खरीद आवश्यकता दर्ज करें। एआई तुरंत संरचित अनुबंध और क्लस्टर क्षमता निकालेगा।"
                      : "Enter your procurement specifications above to generate a structured contract with live cluster capacity."}
                  </div>
                )}
              </div>

              {/* Trust Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1A1816]">
                    <VanishText textKey="business.benefit1" fallback="Explainable Matching" />
                  </h4>
                  <p className="text-[12px] text-[#6B6560] leading-relaxed">
                    <VanishText
                      textKey="business.benefit1Desc"
                      fallback="Clear audit trails for capacity, lead time, and material compliance."
                    />
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1A1816]">
                    <VanishText textKey="business.benefit2" fallback="Cluster Fulfilment" />
                  </h4>
                  <p className="text-[12px] text-[#6B6560] leading-relaxed">
                    <VanishText
                      textKey="business.benefit2Desc"
                      fallback="Distributed production schedules across co-operative artisan groups."
                    />
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#EBE5DC]">
              <Link href="/business">
                <Button variant="primary" size="md" className="rounded-xl group magnetic-hover">
                  <span>
                    <VanishText textKey="business.cta" fallback="Explore Business Purchases" />
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Cluster Visual */}
          <div
            className={`lg:col-span-5 relative flex flex-col justify-end overflow-hidden rounded-[1.5rem] bg-[#1A1816] p-8 text-white min-h-[380px] img-zoom transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Image
              src="https://images.unsplash.com/photo-1675081632939-5294f776dd75?auto=format&fit=crop&w=1000&q=80"
              alt="Artisan Cooperative Workshop"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover opacity-35 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3F5E4D] px-3.5 py-1.5 text-[11px] font-semibold text-white">
                <Layers className="h-3.5 w-3.5" />
                {language === "hi" ? "क्लस्टर लिंकेज नेटवर्क" : "Cluster Allocation Engine"}
              </span>
              <h3 className="font-dossier text-2xl text-white">
                {language === "hi"
                  ? "महाराष्ट्र व पूर्वोत्तर बांस शिल्पी महासंघ"
                  : "Maharashtra Bamboo & Cane Producer Guild"}
              </h3>
              <p className="text-[13px] text-stone-300/90 leading-[1.6]">
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
