"use client";

import React from "react";
import Link from "next/link";
import { Globe, ShieldCheck, HeartHandshake, Sparkles } from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";

export function Footer() {
  const { language, setLanguage } = useLanguage();

  return (
    <footer className="border-t border-[#E8DFD5] bg-[#F4EFEA] text-[#1C1917]">
      {/* Top Trust Pillars */}
      <div className="border-b border-[#E8DFD5]/80 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] text-[#C85A32]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1917]">
                {language === "hi" ? "सत्यापित हुनर क्षमता" : "Verified Artisan Provenance"}
              </h4>
              <p className="text-xs text-[#78716C]">
                {language === "hi" ? "बिना बिचौलियों के सीधा शिल्पकार से जुड़ाव" : "Direct maker linkages with zero intermediaries"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] text-[#3F5E4D]">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1917]">
                {language === "hi" ? "पारदर्शी व न्यायसंगत मूल्य" : "Fair Price Assurance"}
              </h4>
              <p className="text-xs text-[#78716C]">
                {language === "hi" ? "सामग्री व श्रम लागत पर आधारित पारदर्शी दरें" : "Explainable pricing benchmarked against real cost floor"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] text-[#C85A32]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#1C1917]">
                {language === "hi" ? "स्मार्ट एआई कैटलॉगिंग" : "Smart AI Cataloging"}
              </h4>
              <p className="text-xs text-[#78716C]">
                {language === "hi" ? "आवाज व फोटो से स्वतः बहुभाषी उत्पाद सूची" : "Multilingual voice & vision listing technology"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="font-display text-2xl font-bold tracking-wider text-[#1C1917]">
              ARTKALA
            </Link>
            <p className="text-xs leading-relaxed text-[#78716C] max-w-sm">
              <VanishText textKey="footer.about" />
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`text-xs px-2.5 py-1 rounded-md border ${
                  language === "en"
                    ? "bg-[#1C1917] text-white border-[#1C1917]"
                    : "bg-white text-[#78716C] border-[#D6CEBE]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`text-xs px-2.5 py-1 rounded-md border ${
                  language === "hi"
                    ? "bg-[#1C1917] text-white border-[#1C1917]"
                    : "bg-white text-[#78716C] border-[#D6CEBE]"
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-4">
              <VanishText textKey="footer.marketplace" fallback="Marketplace" />
            </h4>
            <ul className="space-y-2.5 text-xs text-[#78716C]">
              <li>
                <Link href="/shop" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.allProducts" fallback="All Products" />
                </Link>
              </li>
              <li>
                <Link href="/shop?craft=bamboo" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.bambooCane" fallback="Bamboo & Cane" />
                </Link>
              </li>
              <li>
                <Link href="/shop?craft=pottery" className="hover:text-[#C85A32] transition-colors">
                  {language === "hi" ? "टेराकोटा मृदभांड" : "Terracotta Pottery"}
                </Link>
              </li>
              <li>
                <Link href="/shop?craft=textiles" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.heritageTextiles" fallback="Heritage Textiles" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Business & Institutional */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-4">
              <VanishText textKey="footer.business" fallback="Business" />
            </h4>
            <ul className="space-y-2.5 text-xs text-[#78716C]">
              <li>
                <Link href="/business" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.bulkProcurement" fallback="Bulk Procurement" />
                </Link>
              </li>
              <li>
                <Link href="/business#clusters" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.clusterLinkage" fallback="Cluster Linkage" />
                </Link>
              </li>
              <li>
                <Link href="/business#requirements" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.institutionalBuyers" fallback="Institutional Inquiries" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Artisans & Studio */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1C1917] mb-4">
              <VanishText textKey="footer.artisans" fallback="Artisans" />
            </h4>
            <ul className="space-y-2.5 text-xs text-[#78716C]">
              <li>
                <Link href="/auth" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.joinArtkala" fallback="Join as an Artisan" />
                </Link>
              </li>
              <li>
                <Link href="/artisan" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.studioSuite" fallback="Artisan Studio" />
                </Link>
              </li>
              <li>
                <Link href="/#capability-twin" className="hover:text-[#C85A32] transition-colors">
                  <VanishText textKey="footer.capabilityTwin" fallback="Hunar Capability Twin" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#78716C] gap-4">
          <p>
            <VanishText textKey="footer.copyright" fallback="© 2026 ARTKALA. Smart India Hackathon SIH26090." />
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#1C1917] cursor-pointer">
              {language === "hi" ? "गोपनीयता नीति" : "Privacy Policy"}
            </span>
            <span className="hover:text-[#1C1917] cursor-pointer">
              {language === "hi" ? "नियम व शर्तें" : "Terms of Service"}
            </span>
            <span className="hover:text-[#1C1917] cursor-pointer">
              {language === "hi" ? "कारीगर प्रमाणन" : "Provenance Protocol"}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
