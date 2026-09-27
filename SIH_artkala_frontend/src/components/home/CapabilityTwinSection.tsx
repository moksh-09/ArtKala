"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, FileCheck, Database, ArrowRight } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";

export function CapabilityTwinSection() {
  const { language } = useLanguage();

  const capabilities = [
    {
      attribute: language === "hi" ? "मासिक उत्पादन क्षमता" : "Monthly Output Capacity",
      value: language === "hi" ? "500 - 650 नग प्रति माह" : "500 - 650 pieces/month",
      status: language === "hi" ? "सत्यापित" : "Observed",
      statusColor: "text-[#3F5E4D] bg-[#EBF1ED]",
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
      statusColor: "text-[#3F5E4D] bg-[#EBF1ED]",
      source:
        language === "hi"
          ? "कारीगर घोषणा व कार्यशाला परीक्षण"
          : "Artisan declaration & workshop verification",
      confidence: language === "hi" ? "प्रत्यक्ष प्रमाण" : "Direct Proof",
    },
    {
      attribute: language === "hi" ? "कारीगरी तकनीक" : "Craft Techniques Mastered",
      value:
        language === "hi"
          ? "विक्करवर्क, षट्कोणीय जाली बुनाई, प्राकृतिक रंगाई"
          : "Wickerwork, Lattice Hex-Weave, Natural Dyeing",
      status: language === "hi" ? "प्रदर्शित" : "Demonstrated",
      statusColor: "text-[#C85A32] bg-[#F7EAE5]",
      source:
        language === "hi"
          ? "स्टूडियो वीडियो व कार्यशाला इतिहास"
          : "Studio video inspection & portfolio history",
      confidence: language === "hi" ? "सत्यापित" : "Observed",
    },
    {
      attribute: language === "hi" ? "गुणवत्ता अनुपालन दर" : "Quality Compliance Rate",
      value: language === "hi" ? "96.4% प्रथम-पास गुणवत्ता" : "96.4% First-Pass QC",
      status: language === "hi" ? "ऑडिटेड" : "Audited",
      statusColor: "text-[#3F5E4D] bg-[#EBF1ED]",
      source:
        language === "hi"
          ? "18 संस्थागत निरीक्षण रिपोर्ट"
          : "18 Institutional delivery inspections",
      confidence: language === "hi" ? "उच्च शक्ति" : "High Strength",
    },
  ];

  return (
    <section id="capability-twin" className="py-20 md:py-28 bg-[#F4EFEA]/80 border-t border-[#E8DFD5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D6CEBE] bg-white px-3.5 py-1 text-xs text-[#1C1917] shadow-xs">
            <Database className="h-3.5 w-3.5 text-[#C85A32]" />
            <span className="font-semibold uppercase tracking-wider text-[11px]">
              <VanishText textKey="capabilityTwin.tag" fallback="Hunar Capability Twin" />
            </span>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#141311]">
            <VanishText
              textKey="capabilityTwin.title"
              fallback="Verifiable artisan capability, grounded in real evidence."
            />
          </h2>

          <p className="text-sm md:text-base text-[#78716C] leading-relaxed">
            <VanishText
              textKey="capabilityTwin.subtitle"
              fallback="ARTKALA replaces subjective ratings with an evolving capability record. Every skill, technique, and production metric is anchored to observed workshop verification and fulfilled orders."
            />
          </p>
        </div>

        {/* Dossier Card Container */}
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-6 sm:p-10 border border-[#E8DFD5] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8DFD5] gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#A8A29E] font-semibold">
                {language === "hi" ? "हुनर अभिलेख" : "Hunar Living Dossier"}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1C1917]">
                {language === "hi"
                  ? "रामेश्वर कुम्हार — बांकुरा क्लस्टर गिल्ड"
                  : "Rameshwar Kumbhar — Bankura Cluster Guild"}
              </h3>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-[#FAF8F5] px-3.5 py-2 border border-[#E8DFD5]">
              <ShieldCheck className="h-4 w-4 text-[#3F5E4D]" />
              <span className="text-xs font-semibold text-[#1C1917]">
                {language === "hi" ? "प्रमाण शक्ति:" : "Evidence Strength:"}{" "}
                <span className="text-[#3F5E4D]">
                  {language === "hi" ? "उच्च" : "HIGH"}
                </span>
              </span>
            </div>
          </div>

          {/* Capabilities vs Evidence Rows */}
          <div className="mt-8 space-y-4">
            {capabilities.map((cap, index) => (
              <div
                key={index}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-[#F0EAE1] bg-[#FAF8F5] hover:bg-white hover:border-[#D6CEBE] transition-all duration-200 gap-3"
              >
                {/* Left: Capability Attribute & Value */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                      {cap.attribute}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cap.statusColor}`}>
                      {cap.status}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-[#1C1917]">
                    {cap.value}
                  </p>
                </div>

                {/* Right: Concrete Verifiable Evidence */}
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E8DFD5]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A8A29E] block flex sm:justify-end items-center gap-1">
                    <FileCheck className="h-3 w-3 text-[#3F5E4D]" />
                    {language === "hi" ? "सत्यापन स्रोत" : "Evidence Source"}
                  </span>
                  <span className="text-xs text-[#78716C] font-medium block">
                    {cap.source}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Dossier Footer Note */}
          <div className="mt-8 pt-6 border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
            <p>
              {language === "hi"
                ? "प्रत्येक दावा कार्यशाला डेटा और खरीदार निरीक्षण द्वारा प्रमाणित है।"
                : "All attributes are continually updated from active purchase orders and quality checks."}
            </p>
            <Link
              href="/shop/artisan/ART001"
              className="inline-flex items-center gap-1.5 font-semibold text-[#C85A32] hover:text-[#B24E29]"
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
