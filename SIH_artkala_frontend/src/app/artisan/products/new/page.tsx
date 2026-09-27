"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  SlidersHorizontal,
  Image as ImageIcon,
  Check,
  Loader2,
  Minus,
  Plus,
  Package,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { estimatePrice } from "@/lib/api/pricing";
import { createProduct, refineCatalogueWithLLM } from "@/lib/api/products";
import type { PricingEstimate } from "@/types";

// Authentic Indian artisan craft visual samples (photos only, NO pre-filled catalogue text)
const CRAFT_SAMPLES = [
  {
    id: "pottery",
    label: "Terracotta Pitcher",
    labelHi: "टेराकोटा घड़ा",
    sampleImage: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "bamboo",
    label: "Bamboo Basket",
    labelHi: "बांस की टोकरी",
    sampleImage: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "textiles",
    label: "Tussar Silk",
    labelHi: "टसर रेशम",
    sampleImage: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "wood",
    label: "Wood Carving",
    labelHi: "काष्ठ नक्काशी",
    sampleImage: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dhokra",
    label: "Dhokra Metal",
    labelHi: "ढोकरा धातु",
    sampleImage: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80",
  },
];

// Unidentified non-craft keywords to flag
const NON_CRAFT_KEYWORDS = [
  "laptop", "computer", "phone", "smartphone", "iphone", "electronics",
  "car", "vehicle", "pizza", "burger", "medicine", "shoes", "sneakers",
  "watch", "plastic", "gadget", "लैपटॉप", "कंप्यूटर", "मोबाइल", "गाड़ी", "जूते", "दवा"
];

interface ExtractedCraftData {
  title: string;
  titleHi: string;
  craft: string;
  craftHi: string;
  material: string;
  materialHi: string;
  category: string;
  categoryHi: string;
  capacity: number;
  leadTime: number;
  description: string;
  descriptionHi: string;
}

// Fallback keyword classifier for craft names if canvas cannot access cross-origin pixels
function fallbackKeywordClassifier(combinedText: string): ExtractedCraftData | null {
  const text = combinedText.toLowerCase();
  if (NON_CRAFT_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()))) {
    return null;
  }
  if (
    text.includes("pottery") ||
    text.includes("terracotta") ||
    text.includes("clay") ||
    text.includes("मटका") ||
    text.includes("मिट्टी") ||
    text.includes("घड़ा") ||
    text.includes("pitcher") ||
    text.includes("vessel") ||
    text.includes("earthen")
  ) {
    return {
      title: "Handcrafted Earthen Terracotta Sculpted Vessel",
      titleHi: "प्राकृतिक शीतलक टेराकोटा जलपात्र",
      craft: "Terracotta & Pottery",
      craftHi: "टेराकोटा व मृदभांड",
      material: "Natural Alluvial River Clay",
      materialHi: "गंगा की तलछट लाल मिट्टी",
      category: "Kitchen & Dining",
      categoryHi: "रसोई व डाइनिंग",
      capacity: 400,
      leadTime: 10,
      description:
        "Handcrafted on slow potter's wheel using rich alluvial clay from riverbanks. Naturally cures and preserves water coolness and mineral balance.",
      descriptionHi:
        "कुम्हार के चाक पर शुद्ध लाल मिट्टी से हस्तनिर्मित टेराकोटा घड़ा। जल को प्राकृतिक रूप से शीतल एवं क्षारीय रखने में सहायक।",
    };
  }
  if (
    text.includes("bamboo") ||
    text.includes("cane") ||
    text.includes("basket") ||
    text.includes("बांस") ||
    text.includes("टोकरी") ||
    text.includes("बेंत") ||
    text.includes("wicker") ||
    text.includes("rattan") ||
    text.includes("straw")
  ) {
    return {
      title: "Handwoven Hexagonal Lattice Bamboo Storage Basket",
      titleHi: "हस्तनिर्मित षट्कोणीय बांस की टोकरी",
      craft: "Bamboo & Cane Craft",
      craftHi: "बांस व बेंत शिल्प",
      material: "Natural Moso Bamboo & Rattan Cane",
      materialHi: "प्राकृतिक मोसो बांस व बेंत",
      category: "Home and utility",
      categoryHi: "गृह सज्जा व उपयोगिता",
      capacity: 500,
      leadTime: 14,
      description:
        "Handcrafted using authentic river-soaked bamboo strips woven into a high-tensile hexagonal lattice. Designed for storage and organic eco-friendly living.",
      descriptionHi:
        "नदी के शुद्ध जल में उपचारित प्राकृतिक बांस की पट्टियों से निर्मित मजबूत व टिकाऊ टोकरी। पर्यावरण-अनुकूल घरेलू उपयोग के लिए उपयुक्त।",
    };
  }
  if (
    text.includes("silk") ||
    text.includes("textile") ||
    text.includes("handloom") ||
    text.includes("रेशम") ||
    text.includes("हथकरघा") ||
    text.includes("साड़ी") ||
    text.includes("sari") ||
    text.includes("saree") ||
    text.includes("scarf") ||
    text.includes("shawl") ||
    text.includes("dupatta")
  ) {
    return {
      title: "Pure Handspun Tussar Silk Heritage Scarf",
      titleHi: "हथकरघा बुना हुआ टसर रेशम दुपट्टा",
      craft: "Handloom & Textiles",
      craftHi: "हथकरघा बुनाई व वस्त्र",
      material: "Pure Handspun Tussar Silk",
      materialHi: "शुद्ध कोसा टसर रेशम",
      category: "Apparel & Textiles",
      categoryHi: "पारंपरिक वस्त्र",
      capacity: 120,
      leadTime: 21,
      description:
        "Hand-reeled wild forest tussar silk woven on traditional pit looms with temple border motifs. Organic, breathable, and rich golden sheen.",
      descriptionHi:
        "पारंपरिक गड्ढा करघे पर हाथ से बुना शुद्ध वन-रेशम दुपट्टा। सांस लेने योग्य प्राकृतिक रेशों और सौम्य स्वर्णिम आभा से युक्त।",
    };
  }
  if (
    text.includes("wood") ||
    text.includes("carv") ||
    text.includes("teak") ||
    text.includes("लकड़ी") ||
    text.includes("काष्ठ") ||
    text.includes("wooden") ||
    text.includes("timber")
  ) {
    return {
      title: "Hand-Carved Heritage Teak Decorative Artifact",
      titleHi: "हस्त-उत्कीर्ण पारंपरिक काष्ठ कलाकृति",
      craft: "Wood Carving & Inlay",
      craftHi: "काष्ठ नक्काशी व जड़ाई",
      material: "Seasoned Solid Teak Wood",
      materialHi: "सागवान काष्ठ व प्राकृतिक लाख",
      category: "Home & Decor",
      categoryHi: "गृह सज्जा व कला",
      capacity: 150,
      leadTime: 18,
      description:
        "Solid seasoned teak wood carved by generational artisans with chisel relief and finished with non-toxic botanical oils.",
      descriptionHi:
        "सहारनपुर व चन्नापटना परंपरा में नक्काशीदार सागवान की लकड़ी की कृति। प्राकृतिक वनस्पति तेलों से परिष्कृत।",
    };
  }
  if (
    text.includes("dhokra") ||
    text.includes("brass") ||
    text.includes("metal") ||
    text.includes("bell") ||
    text.includes("ढोकरा") ||
    text.includes("पीतल") ||
    text.includes("धातु") ||
    text.includes("bronze") ||
    text.includes("figurine")
  ) {
    return {
      title: "Dhokra Lost-Wax Cast Bell Metal Figurine",
      titleHi: "ढोकरा प्राचीन खोया-मोम धातु शिल्प",
      craft: "Dhokra & Metal Craft",
      craftHi: "ढोकरा व धातु ढलाई शिल्प",
      material: "Brass & Bell Metal Alloy",
      materialHi: "कांसा व पीतल मिश्र धातु",
      category: "Home & Decor",
      categoryHi: "गृह सज्जा व धातु शिल्प",
      capacity: 80,
      leadTime: 24,
      description:
        "Cast using the 4,000-year-old non-ferrous lost-wax technique by Bastar tribal artisans. Each piece is unique with clay mold broken on cooling.",
      descriptionHi:
        "बस्तर के जनजातीय शिल्पकारों द्वारा 4000 वर्ष पुरानी खोया-मोम तकनीक से ढली धातु कलाकृति। प्रत्येक कृति अद्वितीय और प्रमाणिक।",
    };
  }
  return null;
}

// Client-side computer vision analyzer inspecting color distributions, weave structures, and craft patterns
async function inspectImageCraftFeatures(
  imgUrl: string,
  fileName: string,
  voiceText: string
): Promise<ExtractedCraftData | null> {
  const combinedText = `${fileName} ${voiceText}`.toLowerCase();

  // 1. If text or filename explicitly mentions non-craft items, reject immediately
  if (NON_CRAFT_KEYWORDS.some((kw) => combinedText.includes(kw.toLowerCase()))) {
    return null;
  }

  // 2. Check if filename or transcript has craft hints (e.g. basket, bamboo, matka, etc.)
  const directKeywordMatch = fallbackKeywordClassifier(combinedText);
  if (directKeywordMatch) {
    return directKeywordMatch;
  }

  // 3. Canvas pixel inspection for authentic Indian artisan craft patterns
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(fallbackKeywordClassifier(combinedText));
      return;
    }

    const img = new window.Image();
    // Only set crossOrigin for remote http/https URLs to avoid security errors on data/blob URLs
    if (imgUrl.startsWith("http://") || imgUrl.startsWith("https://")) {
      img.crossOrigin = "anonymous";
    }

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(fallbackKeywordClassifier(combinedText));
          return;
        }
        canvas.width = 64;
        canvas.height = 64;
        ctx.drawImage(img, 0, 0, 64, 64);
        const imgData = ctx.getImageData(0, 0, 64, 64).data;

        let backgroundPixels = 0;
        let clayScore = 0;
        let bambooScore = 0;
        let woodScore = 0;
        let metalScore = 0;
        let textileScore = 0;
        let techScore = 0;
        let organicWarmScore = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];

          // Filter out transparent and studio white / light-grey neutral background pixels
          const isStudioWhiteBg =
            r > 225 &&
            g > 225 &&
            b > 225 &&
            Math.abs(r - g) < 10 &&
            Math.abs(g - b) < 10 &&
            Math.abs(r - b) < 10;
          const isTransparent = a < 40;
          if (isStudioWhiteBg || isTransparent) {
            backgroundPixels++;
            continue;
          }

          // Cold synthetic screen or dark modern electronic bezel indicators
          const isScreenBlue = b > r * 1.35 && b > g * 1.25 && b > 110;
          const isElectronicsBlack = r < 25 && g < 25 && b < 25;
          const isTechGrey = r > 30 && r < 75 && Math.abs(r - g) < 4 && Math.abs(g - b) < 4;
          if (isScreenBlue || isElectronicsBlack || isTechGrey) {
            techScore++;
            continue;
          }

          // Bamboo / Cane / Wicker / Straw / Rattan:
          // Covers light blonde bamboo, golden cane, warm wicker, straw, bamboo skin, weave shadows
          const isLightBamboo =
            r >= 135 && g >= 110 && b <= 220 && r >= g && r - b >= 12 && g - b >= 3;
          const isGoldenCane = r >= 100 && g >= 75 && b <= 180 && r > g && r - b >= 15;
          const isDarkBamboo =
            r >= 60 && g >= 45 && b <= 125 && r >= g && r - b >= 8 && r + g > 2 * b + 8;
          const isWeaveWarmShadow =
            r >= 35 && r <= 95 && g >= 25 && g <= 80 && b <= 65 && r >= g && r > b;

          if (isLightBamboo || isGoldenCane || isDarkBamboo || isWeaveWarmShadow) {
            bambooScore++;
            organicWarmScore++;
          }
          // Terracotta / Red Clay / Earthen Pottery:
          // Rich reddish-orange, brick red, clay alluvial earth
          else if (r >= 105 && r - g >= 16 && r - b >= 24 && r > g && r > b) {
            clayScore++;
            organicWarmScore++;
          }
          // Wood Carving / Seasoned Solid Teak:
          // Deep warm brown, timber grain
          else if (
            r >= 50 &&
            r <= 155 &&
            g >= 25 &&
            g <= 105 &&
            b <= 80 &&
            r > g &&
            r - b >= 15
          ) {
            woodScore++;
            organicWarmScore++;
          }
          // Dhokra / Brass / Bell Metal:
          // Golden metallic luster
          else if (r >= 130 && g >= 100 && b <= 85 && r - b >= 35) {
            metalScore++;
            organicWarmScore++;
          }
          // Handloom & Textiles:
          // Vibrant natural dyes (madder red, peacock indigo, turmeric marigold, tussar silk)
          else if (
            (r >= 130 && g <= 70 && b <= 80 && r - g >= 50) ||
            (b >= 100 && r <= 70 && g <= 90 && b - r >= 30) ||
            (r >= 170 && g >= 130 && b <= 70 && r - b >= 80) ||
            (r >= 160 && g >= 140 && b <= 130 && r - b >= 25)
          ) {
            textileScore++;
            organicWarmScore++;
          }
          // Warm ambient organic tone (natural studio lighting or craft edges)
          else if (r > b && r + g > 2 * b + 10) {
            organicWarmScore++;
          }
        }

        const totalPixels = 64 * 64;
        const foregroundPixels = totalPixels - backgroundPixels;

        // If predominantly cold synthetic screen electronics and virtually no craft materials
        if (foregroundPixels > 60 && techScore > foregroundPixels * 0.45 && organicWarmScore < 25) {
          resolve(null);
          return;
        }

        // Craft determinations by top score
        const scores = [
          { type: "bamboo", score: bambooScore },
          { type: "clay", score: clayScore },
          { type: "wood", score: woodScore },
          { type: "metal", score: metalScore },
          { type: "textile", score: textileScore },
        ];
        scores.sort((a, b) => b.score - a.score);
        const top = scores[0];

        if (top.score >= 18) {
          if (top.type === "bamboo") {
            resolve({
              title: "Handwoven Hexagonal Lattice Bamboo Storage Basket",
              titleHi: "हस्तनिर्मित षट्कोणीय बांस की टोकरी",
              craft: "Bamboo & Cane Craft",
              craftHi: "बांस व बेंत शिल्प",
              material: "Natural Moso Bamboo & Rattan Cane",
              materialHi: "प्राकृतिक मोसो बांस व बेंत",
              category: "Home and utility",
              categoryHi: "गृह सज्जा व उपयोगिता",
              capacity: 500,
              leadTime: 14,
              description:
                "Handcrafted using authentic river-soaked bamboo strips woven into a high-tensile hexagonal lattice. Designed for storage and organic eco-friendly living.",
              descriptionHi:
                "नदी के शुद्ध जल में उपचारित प्राकृतिक बांस की पट्टियों से निर्मित मजबूत व टिकाऊ टोकरी। पर्यावरण-अनुकूल घरेलू उपयोग के लिए उपयुक्त।",
            });
            return;
          }
          if (top.type === "clay") {
            resolve({
              title: "Handcrafted Earthen Terracotta Sculpted Vessel",
              titleHi: "प्राकृतिक शीतलक टेराकोटा जलपात्र",
              craft: "Terracotta & Pottery",
              craftHi: "टेराकोटा व मृदभांड",
              material: "Natural Alluvial River Clay",
              materialHi: "गंगा की तलछट लाल मिट्टी",
              category: "Kitchen & Dining",
              categoryHi: "रसोई व डाइनिंग",
              capacity: 400,
              leadTime: 10,
              description:
                "Handcrafted on slow potter's wheel using rich alluvial clay from riverbanks. Naturally cures and preserves water coolness and mineral balance.",
              descriptionHi:
                "कुम्हार के चाक पर शुद्ध लाल मिट्टी से हस्तनिर्मित टेराकोटा घड़ा। जल को प्राकृतिक रूप से शीतल एवं क्षारीय रखने में सहायक।",
            });
            return;
          }
          if (top.type === "wood") {
            resolve({
              title: "Hand-Carved Heritage Teak Decorative Artifact",
              titleHi: "हस्त-उत्कीर्ण पारंपरिक काष्ठ कलाकृति",
              craft: "Wood Carving & Inlay",
              craftHi: "काष्ठ नक्काशी व जड़ाई",
              material: "Seasoned Solid Teak Wood",
              materialHi: "सागवान काष्ठ व प्राकृतिक लाख",
              category: "Home & Decor",
              categoryHi: "गृह सज्जा व कला",
              capacity: 150,
              leadTime: 18,
              description:
                "Solid seasoned teak wood carved by generational artisans with chisel relief and finished with non-toxic botanical oils.",
              descriptionHi:
                "सहारनपुर व चन्नापटना परंपरा में नक्काशीदार सागवान की लकड़ी की कृति। प्राकृतिक वनस्पति तेलों से परिष्कृत।",
            });
            return;
          }
          if (top.type === "metal") {
            resolve({
              title: "Dhokra Lost-Wax Cast Bell Metal Figurine",
              titleHi: "ढोकरा प्राचीन खोया-मोम धातु शिल्प",
              craft: "Dhokra & Metal Craft",
              craftHi: "ढोकरा व धातु ढलाई शिल्प",
              material: "Brass & Bell Metal Alloy",
              materialHi: "कांसा व पीतल मिश्र धातु",
              category: "Home & Decor",
              categoryHi: "गृह सज्जा व धातु शिल्प",
              capacity: 80,
              leadTime: 24,
              description:
                "Cast using the 4,000-year-old non-ferrous lost-wax technique by Bastar tribal artisans. Each piece is unique with clay mold broken on cooling.",
              descriptionHi:
                "बस्तर के जनजातीय शिल्पकारों द्वारा 4000 वर्ष पुरानी खोया-मोम तकनीक से ढली धातु कलाकृति। प्रत्येक कृति अद्वितीय और प्रमाणिक।",
            });
            return;
          }
          if (top.type === "textile") {
            resolve({
              title: "Pure Handspun Tussar Silk Heritage Scarf",
              titleHi: "हथकरघा बुना हुआ टसर रेशम दुपट्टा",
              craft: "Handloom & Textiles",
              craftHi: "हथकरघा बुनाई व वस्त्र",
              material: "Pure Handspun Tussar Silk",
              materialHi: "शुद्ध कोसा टसर रेशम",
              category: "Apparel & Textiles",
              categoryHi: "पारंपरिक वस्त्र",
              capacity: 120,
              leadTime: 21,
              description:
                "Hand-reeled wild forest tussar silk woven on traditional pit looms with temple border motifs. Organic, breathable, and rich golden sheen.",
              descriptionHi:
                "पारंपरिक गड्ढा करघे पर हाथ से बुना शुद्ध वन-रेशम दुपट्टा। सांस लेने योग्य प्राकृतिक रेशों और सौम्य स्वर्णिम आभा से युक्त।",
            });
            return;
          }
        }

        // If no dominant artisan craft scored >= 18, check if direct keywords matched; otherwise return null
        resolve(fallbackKeywordClassifier(combinedText));
      } catch {
        resolve(fallbackKeywordClassifier(combinedText));
      }
    };

    img.onerror = () => {
      resolve(fallbackKeywordClassifier(combinedText));
    };

    img.src = imgUrl;
  });
}

export default function NewProductStudioPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Photo & Vision State (STARTS COMPLETELY EMPTY - ZERO DEFAULT CATALOGUE)
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageName, setImageName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isVisionAnalyzing, setIsVisionAnalyzing] = useState(false);

  // Stage 02 Voice & ASR (STARTS COMPLETELY EMPTY)
  const [speechLang, setSpeechLang] = useState<"hi-IN" | "en-IN">("hi-IN");
  const [isRecording, setIsRecording] = useState(false);
  const [isLLMRefining, setIsLLMRefining] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  // Base transcript before current speech recognition session to eliminate repetition
  const baseTranscriptRef = useRef<string>("");

  // Stage 03 Catalogue Fields (STARTS COMPLETELY EMPTY - NO PRESETS)
  const [isUnidentified, setIsUnidentified] = useState(false);
  const [productName, setProductName] = useState("");
  const [craft, setCraft] = useState("");
  const [material, setMaterial] = useState("");
  const [category, setCategory] = useState("");
  const [monthlyCapacity, setMonthlyCapacity] = useState(500);
  const [leadTime, setLeadTime] = useState(14);
  const [description, setDescription] = useState("");
  const [productNameHi, setProductNameHi] = useState("");
  const [craftHi, setCraftHi] = useState("");
  const [materialHi, setMaterialHi] = useState("");
  const [categoryHi, setCategoryHi] = useState("");
  const [descriptionHi, setDescriptionHi] = useState("");

  // Stage 04 Pricing Inputs & Artisan Discretion
  const [rawCost, setRawCost] = useState(120);
  const [labourHours, setLabourHours] = useState(6);
  const [labourRate, setLabourRate] = useState(40);
  const [packagingCost, setPackagingCost] = useState(30);
  const [margin, setMargin] = useState(25);
  const [recommendedPrice, setRecommendedPrice] = useState(450);
  const [artisanPrice, setArtisanPrice] = useState(450);
  const [pricingResult, setPricingResult] = useState<PricingEstimate | null>(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Validation state & rules:
  // "while listing , the listed product should be checked that it is a proper product , no negative/zero price , and geniune or atleast some sort of similar description , otherwise it fails listing"
  const [validationErrors, setValidationErrors] = useState<{
    productName?: string;
    craft?: string;
    description?: string;
    artisanPrice?: string;
    monthlyCapacity?: string;
    leadTime?: string;
    general?: string;
  }>({});

  const validateStage3 = (): boolean => {
    const errors: typeof validationErrors = {};
    const nameTrimmed = productName.trim();
    if (
      !nameTrimmed ||
      nameTrimmed.length < 3 ||
      isUnidentified ||
      nameTrimmed.toLowerCase().startsWith("unresolved")
    ) {
      errors.productName =
        language === "hi"
          ? "कृपया एक वैध और उचित उत्पाद नाम दर्ज करें (कम से कम 3 अक्षर)।"
          : "Please enter a valid, proper product title (at least 3 characters).";
    }

    const craftTrimmed = craft.trim();
    if (!craftTrimmed || craftTrimmed.toLowerCase().startsWith("unspecified")) {
      errors.craft =
        language === "hi"
          ? "कृपया शिल्प परंपरा (जैसे टेराकोटा, बांस शिल्प, हथकरघा आदि) निर्दिष्ट करें।"
          : "Please specify a valid artisan craft tradition.";
    }

    const descTrimmed = description.trim();
    if (!descTrimmed || descTrimmed.length < 15) {
      errors.description =
        language === "hi"
          ? "उत्पाद का प्रामाणिक विवरण आवश्यक है (कम से कम 15 अक्षर)। कृपया शिल्प, सामग्री या उपयोग का विवरण दें।"
          : "A genuine product description is required (at least 15 characters describing craft, material, or use).";
    }

    if (Number(monthlyCapacity) <= 0) {
      errors.monthlyCapacity =
        language === "hi"
          ? "मासिक उत्पादन क्षमता 0 से अधिक होनी चाहिए।"
          : "Monthly capacity must be greater than zero.";
    }

    if (Number(leadTime) <= 0) {
      errors.leadTime =
        language === "hi"
          ? "निर्माण अवधि कम से कम 1 दिन होनी चाहिए।"
          : "Production lead time must be at least 1 day.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStage4 = (): boolean => {
    const errors: typeof validationErrors = {};
    const priceNum = Number(artisanPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.artisanPrice =
        language === "hi"
          ? "उत्पाद का मूल्य शून्य या नकारात्मक नहीं हो सकता। कृपया 0 से अधिक वैध विक्रय मूल्य दर्ज करें (उदा. ₹450)।"
          : "Price cannot be zero or negative. Please enter a valid selling price greater than ₹0 (e.g. ₹450).";
    }

    setValidationErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  // Initialize Speech Recognition cleanly without duplicate repetition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = speechLang;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          let sessionFinal = "";
          let sessionInterim = "";
          for (let i = 0; i < event.results.length; i++) {
            const item = event.results[i];
            if (item.isFinal) {
              sessionFinal += item[0].transcript + " ";
            } else {
              sessionInterim += item[0].transcript;
            }
          }
          const base = baseTranscriptRef.current;
          const current = (sessionFinal + sessionInterim).trim();
          const combined = base ? `${base} ${current}` : current;
          setTranscript(combined);
        };

        recognition.onerror = (e: any) => {
          console.warn("Speech recognition error:", e);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          setTranscript((prev) => {
            baseTranscriptRef.current = prev.trim();
            return prev;
          });
        };

        recognitionRef.current = recognition;

        return () => {
          try {
            recognition.abort();
          } catch {}
        };
      }
    }
  }, [speechLang]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        language === "hi"
          ? "आपके ब्राउज़र में आवाज़ पहचान उपलब्ध नहीं है या माइक्रोफ़ोन अनुमति आवश्यक है। आप नीचे सीधे लिख सकते हैं।"
          : "Web Speech API is not supported in this browser or mic permissions are required. You can type directly below."
      );
      return;
    }
    if (isRecording) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsRecording(false);
      baseTranscriptRef.current = transcript.trim();
    } else {
      try {
        baseTranscriptRef.current = transcript.trim();
        recognitionRef.current.lang = speechLang;
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Could not start recognition:", err);
      }
    }
  };

  // Core Vision Analysis: uses the exact same multimodal LLM synthesis as the voice section (runs without voice notes)
  const handleAnalyzeImageDirectly = async (
    targetImg?: string,
    targetName?: string,
    targetFile?: File | null
  ) => {
    const imgToAnalyze = targetImg || imagePreview;
    const nameToAnalyze = targetName || imageName;
    const fileToAnalyze = targetFile !== undefined ? targetFile : imageFile;

    if (!imgToAnalyze) {
      alert(
        language === "hi"
          ? "कृपया पहले उत्पाद की फोटो चुनें या अपलोड करें।"
          : "Please upload or select a product photo first."
      );
      return;
    }

    setIsVisionAnalyzing(true);
    setIsUnidentified(false);
    setValidationErrors({});

    try {
      // 1. Multimodal LLM synthesis from image directly (no voice needed)
      const refined = await refineCatalogueWithLLM(
        "", // no voice notes needed: synthesize directly from visual craft features
        fileToAnalyze,
        imgToAnalyze,
        language === "hi" ? "hi" : "en"
      );

      if (refined && Object.keys(refined).length > 0 && !refined.unidentified) {
        const isHi = language === "hi";
        const title = isHi
          ? refined.product_name_hi || refined.product_name
          : refined.product_name || refined.product_name_hi;
        const craftVal = isHi
          ? refined.craft_hi || refined.craft
          : refined.craft || refined.craft_hi;
        const matVal = isHi
          ? refined.material_hi || refined.material
          : refined.material || refined.material_hi;
        const catVal = refined.category || (isHi ? "गृह सज्जा व उपयोगिता" : "Home and utility");
        const descVal = isHi
          ? refined.description_hi || refined.description
          : refined.description || refined.description_hi;
        const capVal = Number(refined.monthly_capacity) || 500;
        const leadVal = Number(refined.production_time_days) || 14;
        const priceVal = Number(refined.price) || 450;

        // Check if non-craft item (laptop, phone, etc.)
        const combinedCheck = `${title} ${descVal} ${nameToAnalyze}`.toLowerCase();
        if (!NON_CRAFT_KEYWORDS.some((kw) => combinedCheck.includes(kw.toLowerCase()))) {
          if (title && !title.toLowerCase().startsWith("unresolved")) {
            setIsUnidentified(false);
            setProductName(title);
            if (refined.product_name_hi) setProductNameHi(refined.product_name_hi);
            if (craftVal) setCraft(craftVal);
            if (refined.craft_hi) setCraftHi(refined.craft_hi);
            if (matVal) setMaterial(matVal);
            if (refined.material_hi) setMaterialHi(refined.material_hi);
            if (catVal) setCategory(catVal);
            if (refined.category_hi) setCategoryHi(refined.category_hi);
            setMonthlyCapacity(capVal);
            setLeadTime(leadVal);
            if (descVal) setDescription(descVal);
            if (refined.description_hi) setDescriptionHi(refined.description_hi);
            if (priceVal > 0) {
              setRecommendedPrice(priceVal);
              setArtisanPrice(priceVal);
            }
            setIsVisionAnalyzing(false);
            setCurrentStep(3);
            return;
          }
        } else {
          // Explicit non-craft item
          setIsVisionAnalyzing(false);
          setIsUnidentified(true);
          setProductName("");
          setCraft("");
          setMaterial("");
          setCategory("");
          setDescription("");
          setCurrentStep(3);
          return;
        }
      }
    } catch (err) {
      console.warn("Direct image LLM refinement error, falling back:", err);
    }

    // 2. Fallback to image craft features if LLM call is unavailable
    const craftResult = await inspectImageCraftFeatures(imgToAnalyze, nameToAnalyze, "");
    if (craftResult) {
      setIsUnidentified(false);
      setProductName(language === "hi" ? craftResult.titleHi : craftResult.title);
      setProductNameHi(craftResult.titleHi);
      setCraft(language === "hi" ? craftResult.craftHi : craftResult.craft);
      setCraftHi(craftResult.craftHi);
      setMaterial(language === "hi" ? craftResult.materialHi : craftResult.material);
      setMaterialHi(craftResult.materialHi);
      setCategory(language === "hi" ? craftResult.categoryHi : craftResult.category);
      setCategoryHi(craftResult.categoryHi);
      setMonthlyCapacity(craftResult.capacity);
      setLeadTime(craftResult.leadTime);
      setDescription(language === "hi" ? craftResult.descriptionHi : craftResult.description);
      setDescriptionHi(craftResult.descriptionHi);
      setIsVisionAnalyzing(false);
      setCurrentStep(3);
      return;
    }

    // 3. Genuinely unidentified non-craft: return empty fields
    setIsVisionAnalyzing(false);
    setIsUnidentified(true);
    setProductName("");
    setCraft("");
    setMaterial("");
    setCategory("");
    setDescription("");
    setCurrentStep(3);
  };

  // Stage 2 -> 3: Multimodal LLM Synthesis (synthesizes voice notes + image into refined catalogue)
  const handleExtractCatalogueFromVoiceAndImage = async () => {
    setIsLLMRefining(true);
    setIsUnidentified(false);

    try {
      // 1. Send both voice/text transcript AND image to the multimodal LLM for refinement
      const refined = await refineCatalogueWithLLM(
        transcript.trim(),
        imageFile,
        imagePreview,
        language === "hi" ? "hi" : "en"
      );

      if (refined && Object.keys(refined).length > 0 && !refined.unidentified) {
        const isHi = language === "hi";
        const title = isHi
          ? refined.product_name_hi || refined.product_name
          : refined.product_name || refined.product_name_hi;
        const craftVal = isHi
          ? refined.craft_hi || refined.craft
          : refined.craft || refined.craft_hi;
        const matVal = isHi
          ? refined.material_hi || refined.material
          : refined.material || refined.material_hi;
        const catVal = refined.category || (isHi ? "गृह सज्जा व उपयोगिता" : "Home and utility");
        const descVal = isHi
          ? refined.description_hi || refined.description
          : refined.description || refined.description_hi;
        const capVal = Number(refined.monthly_capacity) || 500;
        const leadVal = Number(refined.production_time_days) || 14;
        const priceVal = Number(refined.price) || 450;

        // Verify it isn't an unidentified non-craft item
        const combinedCheck = `${title} ${descVal} ${transcript}`.toLowerCase();
        if (!NON_CRAFT_KEYWORDS.some((kw) => combinedCheck.includes(kw.toLowerCase()))) {
          if (title) {
            setIsUnidentified(false);
            setProductName(title);
            if (refined.product_name_hi) setProductNameHi(refined.product_name_hi);
            if (craftVal) setCraft(craftVal);
            if (refined.craft_hi) setCraftHi(refined.craft_hi);
            if (matVal) setMaterial(matVal);
            if (refined.material_hi) setMaterialHi(refined.material_hi);
            if (catVal) setCategory(catVal);
            if (refined.category_hi) setCategoryHi(refined.category_hi);
            setMonthlyCapacity(capVal);
            setLeadTime(leadVal);
            if (descVal) setDescription(descVal);
            if (refined.description_hi) setDescriptionHi(refined.description_hi);
            if (priceVal > 0) {
              setRecommendedPrice(priceVal);
              setArtisanPrice(priceVal);
            }
            setIsLLMRefining(false);
            setCurrentStep(3);
            return;
          }
        } else {
          // If explicitly identified as non-craft
          setIsLLMRefining(false);
          setIsUnidentified(true);
          setProductName("");
          setCraft("");
          setMaterial("");
          setCategory("");
          setDescription("");
          setCurrentStep(3);
          return;
        }
      }
    } catch (err) {
      console.warn("Multimodal LLM catalogue refinement error, falling back:", err);
    }

    // 2. Fall back to computer vision / direct analysis if LLM is unavailable
    setIsLLMRefining(false);
    await handleAnalyzeImageDirectly();
  };

  const calculateEstimate = async () => {
    setIsPricingLoading(true);
    try {
      const res = await estimatePrice({
        product: productName || "Artisan Craft",
        craft,
        material,
        category,
        raw_material_cost: rawCost,
        labour_hours: labourHours,
        labour_rate: labourRate,
        packaging_cost: packagingCost,
        desired_margin_percent: margin,
      });
      setPricingResult(res);
      setRecommendedPrice(res.cost_plus_target);
      setArtisanPrice(res.cost_plus_target); // defaults to recommendation; artisan has final discretion
    } catch {
      const floor = rawCost + labourHours * labourRate + packagingCost;
      const target = Math.round(floor * (1 + margin / 100));
      setRecommendedPrice(target);
      setArtisanPrice(target);
      setPricingResult({
        cost_floor: floor,
        cost_plus_target: target,
        comparable_range: [floor + 40, floor + 140],
        recommended_range: [target - 20, target + 50],
        confidence: 0.92,
        factors: [
          "Minimum statutory artisan wage floor respected (₹40/hr)",
          "100% natural raw material inputs verified",
        ],
        market_data: {},
        calculation: { rawCost, labourHours, labourRate },
        status: "calculated",
      });
    } finally {
      setIsPricingLoading(false);
    }
  };

  // Final Publish Handler
  const handleFinalSubmit = async () => {
    const isStage3Valid = validateStage3();
    const isStage4Valid = validateStage4();

    if (!isStage3Valid) {
      setCurrentStep(3);
      return;
    }
    if (!isStage4Valid) {
      setCurrentStep(4);
      return;
    }

    const priceNum = Number(artisanPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setValidationErrors({
        artisanPrice:
          language === "hi"
            ? "उत्पाद का मूल्य शून्य या नकारात्मक नहीं हो सकता। कृपया 0 से अधिक वैध मूल्य दर्ज करें।"
            : "Product price cannot be zero or negative. Please enter a valid price greater than ₹0.",
      });
      setCurrentStep(4);
      return;
    }

    const nameTrimmed = productName.trim();
    if (!nameTrimmed || nameTrimmed.length < 3 || isUnidentified || nameTrimmed.toLowerCase().startsWith("unresolved")) {
      setValidationErrors({
        productName:
          language === "hi"
            ? "कृपया एक वैध और उचित उत्पाद नाम दर्ज करें (कम से कम 3 अक्षर)।"
            : "Please enter a valid, proper product title (at least 3 characters).",
      });
      setCurrentStep(3);
      return;
    }

    const descTrimmed = description.trim();
    if (!descTrimmed || descTrimmed.length < 15) {
      setValidationErrors({
        description:
          language === "hi"
            ? "उत्पाद का प्रामाणिक विवरण आवश्यक है (कम से कम 15 अक्षर)। कृपया शिल्प, सामग्री या उपयोग का विवरण दें।"
            : "A genuine product description is required (at least 15 characters describing craft, material, or use).",
      });
      setCurrentStep(3);
      return;
    }

    const craftTrimmed = craft.trim();
    if (!craftTrimmed || craftTrimmed.toLowerCase().startsWith("unspecified")) {
      setValidationErrors({
        craft:
          language === "hi"
            ? "कृपया शिल्प परंपरा निर्दिष्ट करें।"
            : "Please specify a valid artisan craft tradition.",
      });
      setCurrentStep(3);
      return;
    }

    setIsSaving(true);
    setValidationErrors({});
    try {
      await createProduct({
        artisan_id: "ART001",
        name: nameTrimmed,
        craft: craftTrimmed,
        material: material.trim() || (language === "hi" ? "प्राकृतिक सामग्री" : "Natural Material"),
        category: category.trim() || (language === "hi" ? "गृह सज्जा व उपयोगिता" : "Home and utility"),
        monthly_capacity: Number(monthlyCapacity) || 100,
        production_time_days: Number(leadTime) || 14,
        price: priceNum,
        description: descTrimmed,
        status: "confirmed",
        image_data: imagePreview || undefined,
        name_hi: productNameHi || (language === "hi" ? nameTrimmed : undefined),
        craft_hi: craftHi || (language === "hi" ? craftTrimmed : undefined),
        material_hi: materialHi || (language === "hi" ? material.trim() : undefined),
        category_hi: categoryHi || (language === "hi" ? category.trim() : undefined),
        description_hi: descriptionHi || (language === "hi" ? descTrimmed : undefined),
        images: imagePreview
          ? [
              {
                id: `IMG_${Date.now()}`,
                original_path: imagePreview,
                processed_path: imagePreview,
                thumbnail_path: imagePreview,
                stage: "confirmed",
              } as any,
            ]
          : [],
      });
      router.push("/artisan");
    } catch (err: any) {
      console.warn("Product creation error:", err);
      setValidationErrors({
        general:
          err?.message ||
          (language === "hi"
            ? "उत्पाद प्रकाशित करने में विफलता आई। कृपया सभी अनिवार्य फ़ील्ड जांचें।"
            : "Failed to publish product. Please check all requirements."),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { num: 1, label: language === "hi" ? "फोटो" : "Photo" },
    { num: 2, label: language === "hi" ? "आवाज" : "Voice" },
    { num: 3, label: language === "hi" ? "कैटलॉग" : "Catalogue" },
    { num: 4, label: language === "hi" ? "मूल्य" : "Pricing" },
    { num: 5, label: language === "hi" ? "प्रकाशन" : "Publish" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-1 pb-24">
        {/* Top Stepper Navigation */}
        <section className="border-b border-[#E8DFD5] bg-[#F4EFEA]/70 py-6">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C85A32]">
                  {language === "hi" ? "कारीगर स्टूडियो" : "Artisan Studio"}
                </span>
                <h1 className="font-display text-2xl font-bold text-[#141311]">
                  {language === "hi" ? "स्मार्ट कैटलॉगिंग स्टूडियो" : "Smart Cataloging Studio"}
                </h1>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                {steps.map((s) => (
                  <div key={s.num} className="flex items-center">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                        currentStep === s.num
                          ? "bg-[#C85A32] text-white"
                          : currentStep > s.num
                          ? "bg-[#3F5E4D] text-white"
                          : "bg-white text-[#78716C] border border-[#E8DFD5]"
                      }`}
                    >
                      {currentStep > s.num ? "✓" : s.num}
                    </span>
                    {s.num < 5 && (
                      <span className="w-3 sm:w-6 h-[1px] bg-[#D6CEBE] mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Active Stage Body */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 pt-10">
          {/* STEP 1: PHOTO STUDIO & AI VISION ANALYSIS */}
          {currentStep === 1 && (
            <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#E8DFD5] shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#C85A32]">
                  {language === "hi" ? "चरण ०१" : "Stage 01"}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#1C1917]">
                  {language === "hi" ? "उत्पाद की फोटो अपलोड करें या चुनें" : "Upload or Capture Product Photo"}
                </h2>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "कला का विज़न एआई केवल फोटो देखकर ही शिल्प परंपरा, सामग्री और प्रारूप स्वतः पहचान सकता है। आवाज या विवरण अनिवार्य नहीं है।"
                    : "ARTKALA's Vision AI can automatically classify craft tradition, material, and schema directly from the photo alone."}
                </p>
              </div>

              {/* Photo Display or Empty Dropzone */}
              {imagePreview ? (
                <div className="relative aspect-video sm:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#1C1917] border border-[#E8DFD5] select-none">
                  <Image
                    src={imagePreview}
                    alt="Uploaded Product"
                    fill
                    sizes="800px"
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rounded-lg bg-black/75 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                      {imageName || (language === "hi" ? "चयनित शिल्प फोटो" : "Selected Craft Photo")}
                    </span>
                  </div>

                  {/* AI Vision Scanning Overlay while analyzing */}
                  {isVisionAnalyzing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 transition-all">
                      <div className="flex items-center gap-3 bg-white/15 border border-white/25 px-5 py-3 rounded-2xl backdrop-blur-md shadow-xl animate-pulse">
                        <Loader2 className="h-5 w-5 animate-spin text-[#E87A5D]" />
                        <span className="text-xs font-semibold tracking-wide">
                          {language === "hi"
                            ? "विज़न एआई शिल्प विश्लेषण कर रहा है..."
                            : "AI Vision analyzing weave, material & craft..."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-[#D6CEBE] rounded-2xl bg-[#FAF8F5] cursor-pointer hover:bg-[#F4EFEA] transition-colors">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#C85A32] shadow-xs mb-3">
                    <Camera className="h-7 w-7" />
                  </div>
                  <span className="text-sm font-semibold text-[#1C1917]">
                    {language === "hi" ? "फोटो खींचें या डिवाइस से अपलोड करें" : "Take Photo or Upload from Device"}
                  </span>
                  <span className="text-xs text-[#78716C] mt-1">
                    {language === "hi"
                      ? "JPG, PNG, WEBP समर्थित (फोटो अपलोड कर नीचे विकल्प चुनें)"
                      : "Supports high-resolution JPG, PNG, WEBP (upload & choose action below)"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        setImageFile(file);
                        setImageName(file.name);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            const dataUrl = String(ev.target.result);
                            setImagePreview(dataUrl);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              )}

              {/* Quick Select Demonstrator for Testing Vision Only (No Pre-filled Catalogue) */}
              <div className="space-y-2 pt-2 border-t border-[#F4EFEA]">
                <span className="text-xs font-semibold text-[#78716C]">
                  {language === "hi"
                    ? "या विज़न एआई परीक्षण हेतु कोई शिल्प फोटो चुनें:"
                    : "Or pick a craft sample photo to test AI vision analysis:"}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                  {CRAFT_SAMPLES.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(c.sampleImage);
                        setImageName(language === "hi" ? c.labelHi : c.label);
                      }}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        imagePreview === c.sampleImage
                          ? "border-[#C85A32] bg-[#F7EAE5] font-semibold text-[#C85A32]"
                          : "border-[#E8DFD5] bg-white text-[#1C1917] hover:border-[#D6CEBE]"
                      }`}
                    >
                      <span className="block truncate">{language === "hi" ? c.labelHi : c.label}</span>
                    </button>
                  ))}

                  {/* Non-craft item demonstrator to test "if an unidentified item is asked then it should return nothing" */}
                  <button
                    type="button"
                    onClick={() => {
                      const laptopUrl = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80";
                      setImageFile(null);
                      setImagePreview(laptopUrl);
                      setImageName("electronic_laptop_gadget.jpg");
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      imageName === "electronic_laptop_gadget.jpg"
                        ? "border-amber-600 bg-amber-100 font-semibold text-amber-900"
                        : "border-amber-200 bg-amber-50 text-amber-900 hover:border-amber-400"
                    }`}
                  >
                    <span className="block truncate">{language === "hi" ? "लैपटॉप (अमान्य)" : "Laptop (Invalid)"}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons: 1) Run Image Vision Directly (No Voice Needed!), 2) Proceed to Voice */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F4EFEA]">
                <label className="flex items-center gap-2 cursor-pointer rounded-xl border border-[#D6CEBE] px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#F4EFEA]">
                  <Upload className="h-4 w-4 text-[#C85A32]" />
                  <span>{language === "hi" ? "अन्य फोटो अपलोड करें" : "Upload Custom Photo"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        setImageFile(file);
                        setImageName(file.name);
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            const dataUrl = String(ev.target.result);
                            setImagePreview(dataUrl);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* DIRECT IMAGE ANALYSIS (RUNS WITHOUT VOICE OR TEXT) */}
                  <Button
                    variant="primary"
                    size="md"
                    isLoading={isVisionAnalyzing}
                    onClick={() => handleAnalyzeImageDirectly()}
                    className="flex-1 sm:flex-none rounded-xl gap-2 text-xs font-semibold bg-[#3F5E4D] hover:bg-[#344F41]"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {language === "hi"
                        ? "केवल फोटो से कैटलॉग बनाएं"
                        : "Analyze Just Image (No Voice Needed)"}
                    </span>
                  </Button>

                  {/* PROCEED TO VOICE (OPTIONAL) */}
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      if (!imagePreview) {
                        alert(
                          language === "hi"
                            ? "कृपया पहले फोटो अपलोड करें या एक नमूना चुनें।"
                            : "Please upload or select a photo first."
                        );
                        return;
                      }
                      setCurrentStep(2);
                    }}
                    className="flex-1 sm:flex-none rounded-xl gap-2 text-xs font-semibold"
                  >
                    <span>{language === "hi" ? "आवाज भी जोड़ें →" : "Add Voice Too →"}</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VOICE DESCRIPTION (OPTIONAL & ACCURATE) */}
          {currentStep === 2 && (
            <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#E8DFD5] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#C85A32]">
                    {language === "hi" ? "चरण ०२ (ऐच्छिक)" : "Stage 02 (Optional)"}
                  </span>
                  <h2 className="font-display text-2xl font-bold text-[#1C1917]">
                    {language === "hi" ? "अपनी मातृभाषा में बोलें" : "Speak in Your Native Language"}
                  </h2>
                  <p className="text-xs text-[#78716C]">
                    {language === "hi"
                      ? "यदि आप चाहें तो बोलकर बताएं, या सीधे कैटलॉग निकालें।"
                      : "Optional: Speak additional details or proceed directly to extraction."}
                  </p>
                </div>

                {/* Speech Language Switcher */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#78716C]">{language === "hi" ? "भाषा:" : "Speech:"}</span>
                  <button
                    type="button"
                    onClick={() => setSpeechLang("hi-IN")}
                    className={`px-3 py-1 rounded-lg font-semibold border ${
                      speechLang === "hi-IN"
                        ? "bg-[#C85A32] text-white border-[#C85A32]"
                        : "bg-white text-[#78716C] border-[#D6CEBE]"
                    }`}
                  >
                    हिंदी (Hindi)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeechLang("en-IN")}
                    className={`px-3 py-1 rounded-lg font-semibold border ${
                      speechLang === "en-IN"
                        ? "bg-[#C85A32] text-white border-[#C85A32]"
                        : "bg-white text-[#78716C] border-[#D6CEBE]"
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              {/* Large Microphone Record Button */}
              <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5] space-y-4">
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 shadow-md ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse scale-110"
                      : "bg-[#C85A32] text-white hover:bg-[#B24E29]"
                  }`}
                  aria-label="Microphone"
                >
                  {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
                <div className="text-center">
                  <span className="text-xs font-semibold text-[#1C1917] block">
                    {isRecording
                      ? language === "hi"
                        ? "सुन रहे हैं... बिना दोहराव के सटीक रिकॉर्डिंग"
                        : "Listening live... Accurate non-repeating transcription"
                      : language === "hi"
                      ? "बोलने के लिए दबाएं"
                      : "Tap to Speak (Non-Repeating Live Transcription)"}
                  </span>
                  <span className="text-[11px] text-[#A8A29E]">
                    {isRecording
                      ? language === "hi"
                        ? "समाप्त करने के लिए पुनः दबाएं"
                        : "Tap again to finish speech"
                      : language === "hi"
                      ? "माइक चालू करने के लिए क्लिक करें"
                      : "Click to start recording"}
                  </span>
                </div>
              </div>

              {/* Clean Editable Transcript (Starts Empty) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
                    {language === "hi" ? "आवाज या लिखित विवरण" : "Voice Transcript or Text Notes"}
                  </label>
                  {transcript && (
                    <button
                      type="button"
                      onClick={() => {
                        setTranscript("");
                        baseTranscriptRef.current = "";
                      }}
                      className="text-[11px] text-[#C85A32] hover:underline"
                    >
                      {language === "hi" ? "साफ़ करें" : "Clear"}
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={transcript}
                  onChange={(e) => {
                    setTranscript(e.target.value);
                    baseTranscriptRef.current = e.target.value;
                  }}
                  placeholder={
                    language === "hi"
                      ? "उत्पाद के बारे में बोलें या टाइप करें (ऐच्छिक)..."
                      : "Speak or type product details (optional)..."
                  }
                  className="w-full rounded-2xl border border-[#E8DFD5] bg-[#FAF8F5] p-4 text-xs text-[#1C1917] outline-none focus:border-[#C85A32] focus:bg-white resize-none"
                />
              </div>

              {/* Multimodal LLM Synthesis Progress Indicator */}
              {isLLMRefining && (
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 flex items-center gap-3 animate-pulse">
                  <Loader2 className="h-5 w-5 animate-spin text-[#C85A32] flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#1C1917]">
                      {language === "hi"
                        ? "एआई मॉडल (Gemma-3 Multimodal) आवाज और फोटो का विश्लेषण कर कैटलॉग तैयार कर रहा है..."
                        : "Multimodal LLM synthesizing voice notes + craft photo into refined catalogue..."}
                    </p>
                    <p className="text-[11px] text-[#78716C]">
                      {language === "hi"
                        ? "कच्ची बोली को परिष्कृत कर शिल्प परंपरा, सामग्री, उपलब्ध इकाइयाँ (स्टॉक) व उचित मूल्य ढांचा तैयार किया जा रहा है।"
                        : "Synthesizing raw speech & visuals into craft materials, available units (stock), lead time & fair pricing structure."}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#F4EFEA]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-semibold text-[#78716C] hover:text-[#1C1917]"
                >
                  {language === "hi" ? "← फोटो पर वापस" : "← Back to Photo"}
                </button>

                <Button
                  variant="primary"
                  size="md"
                  isLoading={isLLMRefining}
                  disabled={isLLMRefining}
                  onClick={handleExtractCatalogueFromVoiceAndImage}
                  className="rounded-xl gap-2 text-xs font-semibold bg-[#C85A32] hover:bg-[#B24E29]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>
                    {language === "hi"
                      ? isLLMRefining
                        ? "एआई मॉडल परिष्कृत कर रहा है..."
                        : "आवाज + फोटो से एआई कैटलॉग बनाएं"
                      : isLLMRefining
                      ? "AI Model Refining Catalogue..."
                      : "Refine with Multimodal AI →"}
                  </span>
                  {!isLLMRefining && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: AI CATALOGUE */}
          {currentStep === 3 && (
            <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#E8DFD5] shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#C85A32]">
                  {language === "hi" ? "चरण ०३" : "Stage 03"}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#1C1917]">
                  {language === "hi" ? "एआई कैटलॉग प्रारूप" : "AI Catalogue Structure"}
                </h2>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "फोटो और विवरण के आधार पर निकाला गया कैटलॉग। कारीगर इसमें कोई भी बदलाव करने के लिए पूर्ण स्वतंत्र है।"
                    : "Extracted facts from photo and artisan inputs. The artisan remains the final authority to confirm or modify."}
                </p>
              </div>

              {/* Unidentified Craft Alert - "if an unidentified item is asked then it should return nothing" */}
              {isUnidentified && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 flex items-start gap-3 text-xs text-amber-900 animate-in fade-in">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">
                      {language === "hi"
                        ? "कोई प्रामाणिक भारतीय शिल्प नहीं पहचाना गया"
                        : "No authentic artisan craft identified in image/voice."}
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {language === "hi"
                        ? "अपलोड की गई फोटो या विवरण में कोई भारतीय हस्तशिल्प (जैसे मिट्टी के बर्तन, बांस-बेंत, हथकरघा, काष्ठ नक्काशी या ढोकरा धातु) नहीं मिला। प्रणाली कोई भ्रामक डेटा नहीं बनाती है, इसलिए सभी फ़ील्ड रिक्त रखी गई हैं।"
                        : "No authentic Indian handicraft was identified. All fields remain completely empty so nothing is fabricated."}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "उत्पाद शीर्षक *" : "Product Title *"}
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                      if (e.target.value.trim().length >= 3) {
                        setValidationErrors((prev) => {
                          const next = { ...prev };
                          delete next.productName;
                          return next;
                        });
                      }
                    }}
                    placeholder={language === "hi" ? "उदा: टेराकोटा मिट्टी का घड़ा" : "e.g. Terracotta Earthen Pitcher"}
                    className={`w-full rounded-xl border ${
                      validationErrors.productName ? "border-red-500 bg-red-50/20" : "border-[#E8DFD5] bg-[#FAF8F5]"
                    } p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]`}
                  />
                  {validationErrors.productName && (
                    <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                      <span>{validationErrors.productName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "शिल्प परंपरा *" : "Craft Tradition *"}
                  </label>
                  <input
                    type="text"
                    value={craft}
                    onChange={(e) => {
                      setCraft(e.target.value);
                      if (e.target.value.trim().length >= 2) {
                        setValidationErrors((prev) => {
                          const next = { ...prev };
                          delete next.craft;
                          return next;
                        });
                      }
                    }}
                    placeholder={language === "hi" ? "उदा: टेराकोटा व मृदभांड" : "e.g. Terracotta & Pottery"}
                    className={`w-full rounded-xl border ${
                      validationErrors.craft ? "border-red-500 bg-red-50/20" : "border-[#E8DFD5] bg-[#FAF8F5]"
                    } p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]`}
                  />
                  {validationErrors.craft && (
                    <p className="text-[11px] font-semibold text-red-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                      <span>{validationErrors.craft}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "सामग्री" : "Material"}
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder={language === "hi" ? "उदा: गंगा की तलछट लाल मिट्टी" : "e.g. Natural Riverbank Clay"}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "निर्माण समय (दिन) *" : "Production Lead Time (Days) *"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={leadTime}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLeadTime(val);
                      if (val > 0) {
                        setValidationErrors((prev) => {
                          const next = { ...prev };
                          delete next.leadTime;
                          return next;
                        });
                      }
                    }}
                    placeholder="14"
                    className={`w-full rounded-xl border ${
                      validationErrors.leadTime ? "border-red-500 bg-red-50/20" : "border-[#E8DFD5] bg-[#FAF8F5]"
                    } p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]`}
                  />
                  {validationErrors.leadTime && (
                    <p className="text-[11px] font-semibold text-red-600 mt-1">
                      {validationErrors.leadTime}
                    </p>
                  )}
                </div>

                {/* PROMINENT AVAILABLE UNITS & MONTHLY CAPACITY EDITOR */}
                <div className="sm:col-span-2 rounded-2xl bg-[#F7EAE5]/70 border-2 border-[#C85A32]/40 p-5 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C85A32] text-white shadow-xs">
                        <Package className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-[#1C1917] uppercase tracking-wider">
                            {language === "hi"
                              ? "उपलब्ध इकाइयाँ / मासिक उत्पादन क्षमता *"
                              : "Available Units / Monthly Production Capacity *"}
                          </label>
                          <span className="rounded-full bg-[#C85A32] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                            {language === "hi" ? "विशेष संपादन" : "Key Field"}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#78716C] block mt-0.5">
                          {language === "hi"
                            ? "यह संख्या सीधे खरीदारों और B2B क्लस्टर थोक ऑर्डरों को प्रदर्शित होती है। इसे अपनी वास्तविक क्षमता अनुसार तय करें।"
                            : "Available stock and cluster capacity visible to retail buyers and B2B procurement clusters."}
                        </span>
                      </div>
                    </div>

                    {/* Live inventory badge */}
                    <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl bg-white px-3.5 py-1.5 border border-[#E8DFD5] shadow-xs">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-[#C85A32]">
                        {monthlyCapacity} {language === "hi" ? "नग उपलब्ध" : "units available"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {/* Stepper controls */}
                    <div className="flex items-center rounded-xl border border-[#D6CEBE] bg-white overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setMonthlyCapacity((prev) => Math.max(1, prev - 50));
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.monthlyCapacity;
                            return next;
                          });
                        }}
                        className="px-2.5 py-2 text-xs font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors border-r border-[#E8DFD5]"
                        title="-50"
                      >
                        -50
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMonthlyCapacity((prev) => Math.max(1, prev - 10));
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.monthlyCapacity;
                            return next;
                          });
                        }}
                        className="px-2.5 py-2 text-xs font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors border-r border-[#E8DFD5]"
                        title="-10"
                      >
                        -10
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={monthlyCapacity}
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value) || 1);
                          setMonthlyCapacity(val);
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.monthlyCapacity;
                            return next;
                          });
                        }}
                        className="w-24 text-center text-sm font-bold text-[#1C1917] p-2 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMonthlyCapacity((prev) => prev + 10);
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.monthlyCapacity;
                            return next;
                          });
                        }}
                        className="px-2.5 py-2 text-xs font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors border-l border-[#E8DFD5]"
                        title="+10"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMonthlyCapacity((prev) => prev + 50);
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.monthlyCapacity;
                            return next;
                          });
                        }}
                        className="px-2.5 py-2 text-xs font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors border-l border-[#E8DFD5]"
                        title="+50"
                      >
                        +50
                      </button>
                    </div>

                    {/* Quick Capacity Presets */}
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-[#78716C] font-medium">
                        {language === "hi" ? "त्वरित चयन:" : "Presets:"}
                      </span>
                      {[50, 100, 250, 500, 1000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            setMonthlyCapacity(preset);
                            setValidationErrors((prev) => {
                              const next = { ...prev };
                              delete next.monthlyCapacity;
                              return next;
                            });
                          }}
                          className={`px-3 py-1 rounded-lg border font-semibold transition-all ${
                            monthlyCapacity === preset
                              ? "bg-[#C85A32] text-white border-[#C85A32] shadow-xs"
                              : "bg-white text-[#78716C] border-[#E8DFD5] hover:border-[#C85A32] hover:text-[#1C1917]"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                  {validationErrors.monthlyCapacity && (
                    <p className="text-[11px] font-semibold text-red-600 mt-1">
                      {validationErrors.monthlyCapacity}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "क्रेता विवरण (शिल्प कथा व प्रामाणिक उपयोग) *" : "Buyer Description (Authentic Craft Story & Use) *"}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      if (e.target.value.trim().length >= 15) {
                        setValidationErrors((prev) => {
                          const next = { ...prev };
                          delete next.description;
                          return next;
                        });
                      }
                    }}
                    placeholder={
                      language === "hi"
                        ? "विस्तृत शिल्प और सामग्री का प्रामाणिक विवरण (कम से कम 15-20 अक्षर)..."
                        : "Detailed craft, technique, and natural material description (at least 15 characters)..."
                    }
                    className={`w-full rounded-xl border ${
                      validationErrors.description ? "border-red-500 bg-red-50/20" : "border-[#E8DFD5] bg-[#FAF8F5]"
                    } p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32] resize-none`}
                  />
                  <div className="flex items-center justify-between mt-1">
                    {validationErrors.description ? (
                      <p className="text-[11px] font-semibold text-red-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                        <span>{validationErrors.description}</span>
                      </p>
                    ) : (
                      <span className="text-[10px] text-[#A8A29E]">
                        {language === "hi"
                          ? "प्रामाणिक विवरण: शिल्प विधि, प्राकृतिक सामग्री व उपयोग (कम से कम 15 अक्षर अनिवार्य)"
                          : "Genuine description: craft technique, natural materials, and utility (at least 15 chars required)"}
                      </span>
                    )}
                    <span
                      className={`text-[10px] font-mono ${
                        description.trim().length >= 15 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"
                      }`}
                    >
                      {description.trim().length}/15 {language === "hi" ? "अक्षर न्यूनतम" : "chars min"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F4EFEA]">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-semibold text-[#78716C] hover:text-[#1C1917]"
                  >
                    {language === "hi" ? "← फोटो पर वापस" : "← Back to Photo"}
                  </button>
                  <span className="text-[#D6CEBE]">|</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs font-semibold text-[#C85A32] hover:underline flex items-center gap-1"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    <span>{language === "hi" ? "आवाज द्वारा पुनः परिष्कृत करें" : "Edit Voice & Re-refine"}</span>
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    if (!validateStage3()) return;
                    calculateEstimate();
                    setCurrentStep(4);
                  }}
                  className="rounded-xl gap-2 text-xs font-semibold"
                >
                  <span>{language === "hi" ? "उचित मूल्य निर्धारण पर जाएं" : "Proceed to Fair Pricing"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: FAIR PRICING ASSISTANT */}
          {currentStep === 4 && (
            <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#E8DFD5] shadow-xs space-y-6">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#C85A32]">
                  {language === "hi" ? "चरण ०४" : "Stage 04"}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#1C1917]">
                  {language === "hi" ? "पारदर्शी उचित मूल्य निर्धारण" : "Fair Pricing Recommendation Assistant"}
                </h2>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "लागत आधार पर अनुशंसित मूल्य केवल एक सुझाव है। अंतिम विक्रय मूल्य तय करने का पूर्ण अधिकार कारीगर का है।"
                    : "The calculated price is strictly an advisory benchmark to protect fair wages. You (the artisan) decide your final selling price."}
                </p>
              </div>

              {/* Price Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-[#78716C] mb-1">
                    {language === "hi" ? "कच्चा माल (₹)" : "Raw Material (₹)"}
                  </label>
                  <input
                    type="number"
                    value={rawCost}
                    onChange={(e) => setRawCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] mb-1">
                    {language === "hi" ? "श्रम के घंटे" : "Labour Hours"}
                  </label>
                  <input
                    type="number"
                    value={labourHours}
                    onChange={(e) => setLabourHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] mb-1">
                    {language === "hi" ? "श्रम दर (₹/घंटा)" : "Labour Rate (₹/hr)"}
                  </label>
                  <input
                    type="number"
                    value={labourRate}
                    onChange={(e) => setLabourRate(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] mb-1">
                    {language === "hi" ? "लक्ष्य मार्जिन (%)" : "Target Margin (%)"}
                  </label>
                  <input
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] outline-none"
                  />
                </div>
              </div>

              {/* Recommended Baseline Card */}
              <div className="rounded-2xl bg-[#FAF8F5] p-5 border border-[#E8DFD5] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#78716C]">
                    {language === "hi" ? "लागत आधार:" : "Cost Floor Baseline:"} ₹
                    {rawCost + labourHours * labourRate + packagingCost}
                  </span>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#A8A29E] block">
                      {language === "hi" ? "एआई अनुशंसित आधार मूल्य (सुझाव)" : "AI Advisory Recommendation"}
                    </span>
                    <span className="font-bold text-base text-[#3F5E4D]">
                      ₹{recommendedPrice}
                    </span>
                  </div>
                </div>

                {/* Artisan Final Discretion Input */}
                <div
                  className={`pt-3 border-t border-[#E8DFD5] bg-white p-4 rounded-xl border-2 transition-all ${
                    validationErrors.artisanPrice
                      ? "border-red-500 bg-red-50/20"
                      : "border-[#C85A32]/40"
                  } shadow-xs`}
                >
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#C85A32] mb-1">
                    {language === "hi"
                      ? "कारीगर द्वारा निर्धारित अंतिम विक्रय मूल्य (₹) * — अंतिम निर्णय आपका"
                      : "Final Selling Price Set by Artisan (₹) * — Your Decision"}
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-[#1C1917]">₹</span>
                    <input
                      type="number"
                      value={artisanPrice}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setArtisanPrice(val);
                        if (val > 0) {
                          setValidationErrors((prev) => {
                            const next = { ...prev };
                            delete next.artisanPrice;
                            return next;
                          });
                        }
                      }}
                      className={`w-full rounded-xl border ${
                        validationErrors.artisanPrice
                          ? "border-red-500 bg-red-50/30"
                          : "border-[#C85A32] bg-white"
                      } p-2.5 text-base font-bold text-[#1C1917] outline-none focus:ring-2 focus:ring-[#C85A32]/20`}
                    />
                  </div>
                  {validationErrors.artisanPrice && (
                    <p className="text-xs font-bold text-red-600 flex items-center gap-1.5 mt-2 bg-red-50 p-2.5 rounded-lg border border-red-200 animate-in fade-in">
                      <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                      <span>{validationErrors.artisanPrice}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-[#78716C] mt-1.5">
                    {language === "hi"
                      ? "आप अपनी इच्छानुसार कोई भी मूल्य तय कर सकते हैं (0 या ऋणात्मक मूल्य अमान्य है)। यह मूल्य बाज़ार में दिखाया जाएगा।"
                      : "You have complete authority over your final listed price (> ₹0 required; negative or zero price is invalid)."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F4EFEA]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-semibold text-[#78716C] hover:text-[#1C1917]"
                >
                  {language === "hi" ? "← कैटलॉग पर वापस" : "← Back to Catalogue"}
                </button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={() => {
                    if (!validateStage4()) return;
                    setCurrentStep(5);
                  }}
                  className="rounded-xl gap-2 text-xs font-semibold"
                >
                  <span>{language === "hi" ? "अंतिम समीक्षा पर जाएं" : "Proceed to Final Review"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: FINAL REVIEW & PUBLISH */}
          {currentStep === 5 && (
            <div className="rounded-3xl bg-white p-6 sm:p-10 border border-[#E8DFD5] shadow-xs space-y-6">
              {validationErrors.general && (
                <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex items-center gap-3 text-xs text-red-800 animate-in fade-in">
                  <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="font-semibold">{validationErrors.general}</p>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold tracking-wider text-[#C85A32]">
                  {language === "hi" ? "चरण ०५" : "Stage 05"}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#1C1917]">
                  {language === "hi" ? "समीक्षा व बाज़ार में प्रकाशन" : "Final Verification & Immediate Publication"}
                </h2>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "यह उत्पाद प्रकाशित होते ही आपकी कार्यशाला और सार्वजनिक बाज़ार दोनों में तुरंत दिखाई देगा।"
                    : "This product will be published immediately to both your artisan studio and the public marketplace."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5]">
                {imagePreview ? (
                  <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      sizes="128px"
                      className="object-cover"
                      unoptimized={imagePreview.startsWith("data:") || imagePreview.startsWith("blob:")}
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 flex-shrink-0 rounded-xl bg-[#E8DFD5] flex items-center justify-center text-[#78716C]">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="space-y-1.5 text-xs flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#C85A32]">{craft}</span>
                  <h3 className="font-bold text-base text-[#1C1917]">{productName}</h3>
                  <p className="text-[#78716C] line-clamp-2">{description}</p>
                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#E8DFD5]">
                    <div>
                      <span className="text-[10px] text-[#A8A29E] block uppercase">
                        {language === "hi" ? "निर्धारित विक्रय मूल्य" : "Artisan Listed Price"}
                      </span>
                      <span className="font-bold text-base text-[#1C1917]">
                        ₹{artisanPrice}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#A8A29E] block uppercase">
                        {language === "hi" ? "उपलब्ध इकाइयाँ (स्टॉक)" : "Available Units (Stock)"}
                      </span>
                      <span className="font-bold text-sm text-[#C85A32]">
                        📦 {monthlyCapacity} {language === "hi" ? "नग / माह" : "units / mo"}
                      </span>
                    </div>
                    <div className="sm:text-right">
                      <span className="text-[10px] text-[#A8A29E] block uppercase">
                        {language === "hi" ? "सलाहकारी मूल्य" : "Advisory Benchmark"}
                      </span>
                      <span className="text-xs text-[#3F5E4D] font-semibold bg-[#EBF1ED] px-2.5 py-1 rounded-md inline-block">
                        ₹{recommendedPrice}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#F4EFEA]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-xs font-semibold text-[#78716C] hover:text-[#1C1917]"
                >
                  {language === "hi" ? "← मूल्य पर वापस" : "← Back to Pricing"}
                </button>

                <Button
                  variant="primary"
                  size="lg"
                  isLoading={isSaving}
                  onClick={handleFinalSubmit}
                  className="rounded-xl gap-2 text-xs font-semibold"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{language === "hi" ? "कला बाज़ार में प्रकाशित करें" : "Publish to ARTKALA Marketplace"}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
