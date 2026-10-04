"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Sparkles, User, Lock, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";

export default function AuthPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<"artisan" | "buyer">("artisan");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Prototype demo session login
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "artkala_user",
          JSON.stringify({
            name: name || (language === "hi" ? "रामेश्वर कुम्हार" : "Rameshwar Kumbhar"),
            email: email || "artisan@artkala.in",
            role,
          })
        );
      }
      if (role === "artisan") {
        router.push("/artisan");
      } else {
        router.push("/shop");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAF8F5]">
      {/* Left Column: Full-Height Artisan Photography & Heritage Narrative (Desktop) */}
      <div className="hidden lg:relative lg:col-span-6 lg:flex flex-col justify-between bg-[#1C1917] p-12 text-white overflow-hidden">
        <Image
          src="/images/artisan-potter-hero.png"
          alt="Indian Master Artisan Crafting Traditional Heritage Pottery"
          fill
          priority
          quality={95}
          sizes="50vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="font-display text-3xl font-bold tracking-wider text-white">
            ARTKALA
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-stone-300 hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{language === "hi" ? "मुख्य बाज़ार पर वापस" : "Back to Marketplace"}</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-4 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#3F5E4D] px-3.5 py-1 text-xs font-semibold text-white">
            <ShieldCheck className="h-4 w-4" />
            <span>{language === "hi" ? "संप्रभु पहचान प्रोटोकॉल" : "Sovereign Identity Protocol"}</span>
          </div>

          <h2 className="font-display text-4xl font-bold text-[#FAF8F5] leading-tight">
            {language === "hi"
              ? "भारत के स्वदेशी शिल्पकारों का दुनिया से सीधा संपर्क।"
              : "Connecting India's indigenous master artisans directly with the world."}
          </h2>

          <p className="text-sm text-stone-300 font-light leading-relaxed">
            {language === "hi"
              ? "एआई कैटलॉगिंग, पारदर्शी उचित मूल्य निर्धारण और शून्य बिचौलिया कमीशन के साथ क्लस्टर-आधारित पूर्ति।"
              : "Smart AI cataloging, transparent fair pricing, and cluster-based institutional fulfillment with zero middlemen margins."}
          </p>
        </div>

        <div className="relative z-10 text-[11px] text-stone-400">
          Smart India Hackathon 2026 • PS SIH26090
        </div>
      </div>

      {/* Right Column: Clean Authentication Interface */}
      <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="lg:hidden font-display text-2xl font-bold text-[#1C1917]">
                ARTKALA
              </Link>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E]">
                {language === "hi" ? "कारीगर पोर्टल" : "Prototype Portal"}
              </span>
            </div>

            <h1 className="font-display text-3xl font-bold text-[#141311]">
              {mode === "signin"
                ? language === "hi"
                  ? "कला पोर्टल में प्रवेश करें"
                  : "Welcome to ARTKALA"
                : language === "hi"
                ? "नया कारीगर खाता बनाएं"
                : "Create Your Account"}
            </h1>

            <p className="text-xs text-[#78716C]">
              {role === "artisan"
                ? language === "hi"
                  ? "अपने स्टूडियो तक पहुंचें, कैटलॉग प्रबंधित करें व क्लस्टर ऑर्डर ट्रैक करें।"
                  : "Access your artisan studio, manage catalogs & track cluster orders."
                : language === "hi"
                ? "कारीगरों से सीधे प्रामाणिक हस्तशिल्प कृतियों की खोज व खरीद करें।"
                : "Discover and procure authentic handcrafted pieces directly from makers."}
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-[#F4EFEA] p-1.5 border border-[#E8DFD5]">
            <button
              type="button"
              onClick={() => setRole("artisan")}
              className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                role === "artisan"
                  ? "bg-white text-[#1C1917] shadow-xs"
                  : "text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              {language === "hi" ? "कारीगर स्टूडियो" : "Artisan Studio"}
            </button>
            <button
              type="button"
              onClick={() => setRole("buyer")}
              className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                role === "buyer"
                  ? "bg-white text-[#1C1917] shadow-xs"
                  : "text-[#78716C] hover:text-[#1C1917]"
              }`}
            >
              {language === "hi" ? "खरीदार खाता" : "Buyer Account"}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-1.5">
                  {language === "hi" ? "पूरा नाम / गिल्ड का नाम" : "Full Name / Guild Name"}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder={language === "hi" ? "उदा: रामेश्वर कुम्हार" : "e.g. Rameshwar Kumbhar"}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-white py-2.5 pl-10 pr-4 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-1.5">
                {language === "hi" ? "ईमेल या मोबाइल नंबर" : "Email Address or Phone Number"}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="artisan@artkala.in"
                  className="w-full rounded-xl border border-[#E8DFD5] bg-white py-2.5 pl-10 pr-4 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#78716C] uppercase tracking-wider mb-1.5">
                {language === "hi" ? "सुरक्षा पिन / पासवर्ड" : "Passcode / Access Key"}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A8A29E]" />
                <input
                  type="password"
                  defaultValue="demo-passcode"
                  required
                  className="w-full rounded-xl border border-[#E8DFD5] bg-white py-2.5 pl-10 pr-4 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full rounded-xl gap-2 font-semibold text-xs mt-2"
            >
              <span>
                {mode === "signin"
                  ? language === "hi"
                    ? "स्टूडियो में प्रवेश करें"
                    : "Sign In to Studio"
                  : language === "hi"
                  ? "नया स्टूडियो खाता बनाएं"
                  : "Create Studio Account"}
              </span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="text-center pt-2 text-xs text-[#78716C]">
            {mode === "signin" ? (
              <p>
                {language === "hi" ? "क्या आपका कारीगर स्टूडियो नहीं है? " : "Don't have an artisan studio yet? "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-semibold text-[#C85A32] underline hover:text-[#B24E29]"
                >
                  {language === "hi" ? "अपना शिल्प पंजीकृत करें" : "Register your craft"}
                </button>
              </p>
            ) : (
              <p>
                {language === "hi" ? "पहले से पंजीकृत हैं? " : "Already registered? "}
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="font-semibold text-[#C85A32] underline hover:text-[#B24E29]"
                >
                  {language === "hi" ? "लॉगिन करें" : "Sign in"}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
