"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  ExternalLink,
  Plus,
  Package,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";
import { HunarCapabilityTwin } from "@/components/artisan/HunarCapabilityTwin";

interface ArtisanProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  artisanId?: string;
  artisanName?: string;
  clusterName?: string;
}

export function ArtisanProfileDrawer({
  isOpen,
  onClose,
  artisanId = "ART001",
  artisanName = "Rameshwar Kumbhar",
  clusterName = "Bankura Artisan Guild",
}: ArtisanProfileDrawerProps) {
  const { language } = useLanguage();

  // Escape key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-4xl bg-[#FAF8F5] shadow-2xl flex flex-col border-l border-[#E8DFD5] animate-in slide-in-from-right duration-300">
          {/* Header Bar */}
          <div className="flex-shrink-0 bg-white border-b border-[#E8DFD5] px-6 py-5 shadow-xs">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border-2 border-[#C85A32] shadow-sm bg-[#FAF8F5]">
                  <Image
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                    alt="Rameshwar Kumbhar"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-300" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1C1917]">
                      {language === "hi" ? "रामेश्वर कुम्हार" : artisanName}
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF1ED] px-2.5 py-0.5 text-[11px] font-bold text-[#3F5E4D]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>{language === "hi" ? "सत्यापित मास्टर शिल्पकार" : "Verified Master Artisan"}</span>
                    </span>
                  </div>

                  <p className="text-xs text-[#78716C] flex items-center gap-2">
                    <span className="font-medium text-[#1C1917]">
                      {language === "hi" ? "बांकुरा क्लस्टर गिल्ड" : clusterName}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[11px] text-[#A8A29E]">CL_WB_BANKURA</span>
                    <span>•</span>
                    <span className="text-[#C85A32] font-semibold">
                      {language === "hi" ? "संप्रभु डिजिटल हुनर ट्विन" : "Sovereign Capability Twin"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons & Close */}
              <div className="flex items-center gap-2">
                <Link
                  href="/artisan"
                  onClick={onClose}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D6CEBE] bg-white text-xs font-semibold text-[#1C1917] hover:border-[#C85A32] hover:text-[#C85A32] transition-colors shadow-2xs"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>{language === "hi" ? "स्टूडियो डैशबोर्ड" : "Studio"}</span>
                </Link>

                <Link
                  href="/artisan/products/new"
                  onClick={onClose}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C85A32] hover:bg-[#B24E29] text-xs font-semibold text-white transition-colors shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{language === "hi" ? "उत्पाद जोड़ें" : "Add Product"}</span>
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close capability profile"
                  className="rounded-full p-2 text-[#78716C] hover:bg-[#E8DFD5] hover:text-[#1C1917] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Quick Navigation sub-strip for mobile / tablet */}
            <div className="flex sm:hidden items-center justify-between pt-3 mt-3 border-t border-[#F4EFEA]">
              <Link
                href="/artisan"
                onClick={onClose}
                className="text-xs font-semibold text-[#C85A32] underline"
              >
                {language === "hi" ? "कारीगर स्टूडियो पर जाएं →" : "Go to Artisan Studio →"}
              </Link>
              <Link
                href="/artisan/products/new"
                onClick={onClose}
                className="text-xs font-semibold text-[#1C1917] underline"
              >
                {language === "hi" ? "+ नया उत्पाद जोड़ें" : "+ List New Product"}
              </Link>
            </div>
          </div>

          {/* Scrollable Capability Profile Dossier */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
            {/* Context callout explaining the capability record */}
            <div className="rounded-2xl border border-[#D6CEBE] bg-white p-4 shadow-xs flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#F7EAE5] flex items-center justify-center flex-shrink-0 text-[#C85A32]">
                <Award className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-1">
                <h3 className="font-bold text-[#1C1917]">
                  {language === "hi"
                    ? "कारीगर संप्रभु हुनर क्षमता प्रोफ़ाइल (Evidence-Backed Capability Record)"
                    : "Official Artisan Evidence-Backed Capability Record"}
                </h3>
                <p className="text-[#78716C] leading-relaxed">
                  {language === "hi"
                    ? "यह रिकॉर्ड शिल्पकार के सत्यापित शिल्पों, सामग्रियों, उत्पादन क्षमता, पिछले पूर्ण ऑर्डर और ऑन-साइट गुणवत्ता ऑडिट का पारदर्शी प्रमाण पत्र है।"
                    : "This dossier functions as an evidence-backed capability record of the artisan — showing verified crafts, materials, monthly production limits, fulfilment track record, and traceable quality audits."}
                </p>
              </div>
            </div>

            {/* The Hunar Capability Twin Component */}
            <HunarCapabilityTwin
              artisanId={artisanId}
              artisanName={language === "hi" ? "रामेश्वर कुम्हार" : artisanName}
              clusterName={language === "hi" ? "बांकुरा क्लस्टर गिल्ड" : clusterName}
            />
          </div>

          {/* Footer Bar */}
          <div className="flex-shrink-0 border-t border-[#E8DFD5] bg-white px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-[#78716C]">
              {language === "hi"
                ? "सत्यापित SIH26090 डिजिटल संप्रभु रिकॉर्ड"
                : "Verified SIH26090 Sovereign Artisan Record"}
            </span>

            <div className="flex items-center gap-3">
              <Link
                href="/artisan"
                onClick={onClose}
                className="text-xs font-semibold text-[#C85A32] hover:underline"
              >
                {language === "hi" ? "ऑर्डर व सूचियां प्रबंधित करें →" : "Manage Orders & Listings →"}
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl text-xs font-semibold"
              >
                {language === "hi" ? "बंद करें" : "Close"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
