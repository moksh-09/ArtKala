"use client";

import React from "react";
import Link from "next/link";
import { Globe, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";

export function Footer() {
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="border-t border-[#EBE5DC] bg-[#F5F1EC] text-[#1A1816]">
      {/* Top Trust Pillars */}
      <div className="border-b border-[#EBE5DC]/80 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {[
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              iconColor: "text-[#C85A32]",
              title: language === "hi" ? "सत्यापित हुनर क्षमता" : "Verified Artisan Provenance",
              desc: language === "hi" ? "बिना बिचौलियों के सीधा शिल्पकार से जुड़ाव" : "Direct maker linkages with zero intermediaries",
            },
            {
              icon: <HeartHandshake className="h-5 w-5" />,
              iconColor: "text-[#3F5E4D]",
              title: language === "hi" ? "पारदर्शी व न्यायसंगत मूल्य" : "Fair Price Assurance",
              desc: language === "hi" ? "सामग्री व श्रम लागत पर आधारित पारदर्शी दरें" : "Explainable pricing benchmarked against real cost floor",
            },
            {
              icon: <Sparkles className="h-5 w-5" />,
              iconColor: "text-[#C85A32]",
              title: language === "hi" ? "स्मार्ट एआई कैटलॉगिंग" : "Smart AI Cataloging",
              desc: language === "hi" ? "आवाज व फोटो से स्वतः बहुभाषी उत्पाद सूची" : "Multilingual voice & vision listing technology",
            },
          ].map((pillar, i) => (
            <div
              key={i}
              className="group flex items-center justify-center md:justify-start gap-4 cursor-default"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAFAF8] border border-[#EBE5DC] ${pillar.iconColor} transition-all duration-300 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] group-hover:scale-[1.03]`}>
                {pillar.icon}
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#1A1816]">
                  {pillar.title}
                </h4>
                <p className="text-[12px] text-[#6B6560] mt-0.5">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 md:py-18">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 space-y-5">
            <Link href="/" className="font-dossier text-[1.5rem] text-[#1A1816] hover:text-[#C85A32] transition-colors duration-300">
              ARTKALA
            </Link>
            <p className="text-[12px] leading-[1.7] text-[#6B6560] max-w-sm">
              <VanishText textKey="footer.about" />
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                  language === "en"
                    ? "bg-[#1A1816] text-white border-[#1A1816]"
                    : "bg-white text-[#6B6560] border-[#D6CEBE] hover:border-[#A8A29E]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                  language === "hi"
                    ? "bg-[#1A1816] text-white border-[#1A1816]"
                    : "bg-white text-[#6B6560] border-[#D6CEBE] hover:border-[#A8A29E]"
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1A1816] mb-5">
              <VanishText textKey="footer.marketplace" fallback="Marketplace" />
            </h4>
            <ul className="space-y-3 text-[12px] text-[#6B6560]">
              <li>
                <Link href="/shop" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.allProducts" fallback="All Products" />
                </Link>
              </li>
              <li>
                <Link href="/shop?craft=bamboo" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.bambooCane" fallback="Bamboo & Cane" />
                </Link>
              </li>
              <li>
                <Link href="/shop?craft=pottery" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  {language === "hi" ? "टेराकोटा मृदभांड" : "Terracotta Pottery"}
                </Link>
              </li>
              <li>
                <Link href="/shop?craft=textiles" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.heritageTextiles" fallback="Heritage Textiles" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Business */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1A1816] mb-5">
              <VanishText textKey="footer.business" fallback="Business" />
            </h4>
            <ul className="space-y-3 text-[12px] text-[#6B6560]">
              <li>
                <Link href="/business" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.bulkProcurement" fallback="Bulk Procurement" />
                </Link>
              </li>
              <li>
                <Link href="/business#clusters" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.clusterLinkage" fallback="Cluster Linkage" />
                </Link>
              </li>
              <li>
                <Link href="/business#requirements" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.institutionalBuyers" fallback="Institutional Inquiries" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Artisans */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#1A1816] mb-5">
              <VanishText textKey="footer.artisans" fallback="Artisans" />
            </h4>
            <ul className="space-y-3 text-[12px] text-[#6B6560]">
              <li>
                <Link href="/auth" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.joinArtkala" fallback="Join as an Artisan" />
                </Link>
              </li>
              <li>
                <Link href="/artisan" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.studioSuite" fallback="Artisan Studio" />
                </Link>
              </li>
              <li>
                <Link href="/#capability-twin" className="hover:text-[#C85A32] transition-colors duration-300 link-underline">
                  <VanishText textKey="footer.capabilityTwin" fallback="Hunar Capability Twin" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#EBE5DC] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#6B6560] gap-4">
          <p>
            <VanishText textKey="footer.copyright" fallback="© 2026 ARTKALA. Smart India Hackathon SIH26090." />
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#1A1816] cursor-pointer transition-colors duration-300 link-underline">
              {language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
            </span>
            <span className="hover:text-[#1A1816] cursor-pointer transition-colors duration-300 link-underline">
              {language === "hi" ? "नियम व शर्तें" : "Terms of Service"}
            </span>
            <span className="hover:text-[#1A1816] cursor-pointer transition-colors duration-300 link-underline">
              {language === "hi" ? "कारीगर प्रमाणन" : "Provenance Protocol"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
