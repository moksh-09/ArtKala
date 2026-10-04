"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, FileCheck, Database, ArrowRight } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export function CapabilityTwinSection() {
  const { language } = useLanguage();
  const { ref, isRevealed } = useScrollReveal(0.08);

  const capabilities = [
    {
      attribute: language === "hi" ? "मासिक उत्पादन क्षमता" : "Monthly Output Capacity",
      value: language === "hi" ? "500 - 650 नग प्रति माह" : "500 - 650 pieces/month",
      status: language === "hi" ? "सत्यापित" : "Observed",
      statusColor: "text-[#3F5E4D] bg-[#EDF3EF]",
      source:
        language === "hi"
          ? "प्रेषण अभिलेख व पूर्ण किए गए ऑर्डर"
          : "Dispatch logs & order fulfillments",
      confidence: language === "hi" ? "95% सत्यापित" : "95% Verified",
    },
    {
      attribute: language === "hi" ? "कच्ची सामग्री का स्रोत" : "Raw Material Provenance",
      value:
        language === "hi"
          ? "प्राकृतिक मोसो बांस व बेंत"
          : "Natural Moso Bamboo & Rattan Cane",
      status: language === "hi" ? "पुष्ट" : "Confirmed",
      statusColor: "text-[#3F5E4D] bg-[#EDF3EF]",
      source:
        language === "hi"
          ? "वन गिल्ड प्रमाण पत्र"
          : "Certified agro-forestry cooperative",
      confidence: language === "hi" ? "100% प्रामाणिक" : "100% Proven",
    },
    {
      attribute: language === "hi" ? "शिल्प तकनीक" : "Craft Technique",
      value:
        language === "hi"
          ? "हस्तनिर्मित जालीदार बुनाई"
          : "Hand-Interlocked Hexagonal Weave",
      status: language === "hi" ? "जीआई प्रमाणित" : "GI Standard",
      statusColor: "text-[#C85A32] bg-[#FBF2EE]",
      source:
        language === "hi"
          ? "भौगोलिक उपदर्शन रजिस्ट्री"
          : "GI Registry Spec No. 518",
      confidence: language === "hi" ? "पंजीकृत" : "Registered",
    },
    {
      attribute: language === "hi" ? "कारीगर आय संरक्षण" : "Artisan Fair Price Share",
      value:
        language === "hi"
          ? "प्रत्यक्ष कारीगर भुगतान: 88.4%"
          : "Direct Producer Payout: 88.4%",
      status: language === "hi" ? "सत्यापित" : "Audited",
      statusColor: "text-[#3F5E4D] bg-[#EDF3EF]",
      source:
        language === "hi"
          ? "पारदर्शी बैंक खाता हस्तांतरण"
          : "Automated escrow payout logs",
      confidence: language === "hi" ? "पारदर्शी" : "Direct Settlement",
    },
  ];

  return (
    <section ref={ref} id="capability-twin" className="py-24 md:py-32 bg-[#F5F1EC]/70 border-t border-[#EBE5DC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 space-y-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#EBE5DC] bg-white px-4 py-1.5 text-[11px] text-[#1A1816] shadow-[0_1px_4px_rgba(0,0,0,0.03)] pill-hover">
            <Database className="h-3.5 w-3.5 text-[#C85A32]" />
            <span className="font-semibold uppercase tracking-[0.15em]">
              <VanishText textKey="capabilityTwin.tag" fallback="Hunar Capability Twin" />
            </span>
          </div>

          <h2 className="font-dossier text-[2rem] sm:text-[2.5rem] md:text-[3.25rem] text-[#0F0E0C]">
            <VanishText
              textKey="capabilityTwin.title"
              fallback="Verifiable artisan capability, grounded in real evidence."
            />
          </h2>

          <p className="text-[13px] md:text-[14px] text-[#6B6560] leading-[1.7] max-w-2xl mx-auto">
            <VanishText
              textKey="capabilityTwin.subtitle"
              fallback="ARTKALA replaces subjective ratings with an evolving capability record. Every skill, technique, and production metric is anchored to observed workshop verification and fulfilled orders."
            />
          </p>
        </div>

        {/* Dossier Card */}
        <div
          className={`mx-auto max-w-4xl rounded-[1.5rem] bg-white p-7 sm:p-10 border border-[#EBE5DC] shadow-[0_8px_40px_-12px_rgba(28,25,23,0.06)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${
            isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-7 border-b border-[#EBE5DC] gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#A8A29E] font-semibold">
                {language === "hi" ? "हुनर अभिलेख" : "Hunar Living Dossier"}
              </span>
              <h3 className="font-dossier text-xl sm:text-2xl text-[#1A1816] mt-1">
                {language === "hi"
                  ? "रामेश्वर कुम्हार — बांकुरा क्लस्टर गिल्ड"
                  : "Rameshwar Kumbhar — Bankura Cluster Guild"}
              </h3>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#FAFAF8] px-4 py-2.5 border border-[#EBE5DC]">
              <ShieldCheck className="h-4 w-4 text-[#3F5E4D]" />
              <span className="text-[12px] font-semibold text-[#1A1816]">
                {language === "hi" ? "प्रमाण शक्ति:" : "Evidence Strength:"}{" "}
                <span className="text-[#3F5E4D]">
                  {language === "hi" ? "उच्च" : "HIGH"}
                </span>
              </span>
            </div>
          </div>

          {/* Capabilities Rows */}
          <div className="mt-8 space-y-3">
            {capabilities.map((cap, index) => (
              <div
                key={index}
                className={`group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-[#F3EDE5] bg-[#FAFAF8] hover:bg-white hover:border-[#D6CEBE] hover:shadow-[0_4px_16px_-4px_rgba(28,25,23,0.05)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] gap-3 cursor-default ${
                  index === 0
                    ? "delay-200"
                    : index === 1
                    ? "delay-[280ms]"
                    : index === 2
                    ? "delay-[360ms]"
                    : "delay-[440ms]"
                } ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                {/* Left: Capability */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-[#6B6560] uppercase tracking-[0.12em]">
                      {cap.attribute}
                    </span>
                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${cap.statusColor} transition-transform duration-300 group-hover:scale-105`}>
                      {cap.status}
                    </span>
                  </div>
                  <p className="text-[14px] sm:text-[15px] font-semibold text-[#1A1816]">
                    {cap.value}
                  </p>
                </div>

                {/* Right: Evidence */}
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EBE5DC]">
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#A8A29E] block flex sm:justify-end items-center gap-1">
                    <FileCheck className="h-3 w-3 text-[#3F5E4D]" />
                    {language === "hi" ? "सत्यापन स्रोत" : "Evidence Source"}
                  </span>
                  <span className="text-[12px] text-[#6B6560] font-medium block mt-0.5">
                    {cap.source}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#EBE5DC] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#6B6560]">
            <p>
              {language === "hi"
                ? "प्रत्येक दावा कार्यशाला डेटा और खरीदार निरीक्षण द्वारा प्रमाणित है।"
                : "All attributes are continually updated from active purchase orders and quality checks."}
            </p>
            <Link
              href="/shop/artisan/ART001"
              className="inline-flex items-center gap-1.5 font-semibold text-[#C85A32] hover:text-[#B24E29] transition-colors duration-300 link-underline"
            >
              <span>
                {language === "hi"
                  ? "संपूर्ण कारीगर विवरण देखें"
                  : "View full artisan dossier"}
              </span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
