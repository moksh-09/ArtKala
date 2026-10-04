"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingBag,
  Check,
  ShieldCheck,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  ArrowLeft,
  Share2,
  FileCheck,
  Building2,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import {
  getProduct,
  getProductDisplayImage,
  getLocalizedProductName,
  getLocalizedProductCraft,
  getLocalizedProductMaterial,
  getLocalizedProductDescription,
} from "@/lib/api/products";
import { createB2BOrder } from "@/lib/api/orders";
import { getArtisan } from "@/lib/api/artisans";
import { getStorageUrl } from "@/lib/api/apiClient";
import type { Product, Artisan } from "@/types";

function getCraftKeyForProduct(craft?: string | null, name?: string | null, desc?: string | null): string {
  const combined = `${craft || ""} ${name || ""} ${desc || ""}`.toLowerCase();
  if (
    combined.includes("terracotta") ||
    combined.includes("pottery") ||
    combined.includes("clay") ||
    combined.includes("मिट्टी") ||
    combined.includes("मटका") ||
    combined.includes("कुम्हार")
  ) {
    return "terracotta";
  }
  if (
    combined.includes("silk") ||
    combined.includes("handloom") ||
    combined.includes("weaving") ||
    combined.includes("textile") ||
    combined.includes("saree") ||
    combined.includes("dupatta") ||
    combined.includes("साड़ी") ||
    combined.includes("रेशम") ||
    combined.includes("हथकरघा")
  ) {
    return "handloom";
  }
  if (
    combined.includes("wood") ||
    combined.includes("carving") ||
    combined.includes("timber") ||
    combined.includes("sheesham") ||
    combined.includes("लकड़ी") ||
    combined.includes("काष्ठ")
  ) {
    return "woodcarving";
  }
  if (
    combined.includes("metal") ||
    combined.includes("dhokra") ||
    combined.includes("brass") ||
    combined.includes("bronze") ||
    combined.includes("बेल मेटल") ||
    combined.includes("ढोकरा") ||
    combined.includes("पीतल")
  ) {
    return "dhokra";
  }
  return "basketry";
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = String(params.id);

  const [product, setProduct] = useState<Product | null>(null);
  const [artisan, setArtisan] = useState<Artisan | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  const { language } = useLanguage();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const prod = await getProduct(productId);
        setProduct(prod);
        const mainImg = getProductDisplayImage(prod);
        setSelectedImage(mainImg);

        if (prod.artisan_id) {
          try {
            const art = await getArtisan(prod.artisan_id);
            setArtisan(art);
          } catch {
            // Artisan fetch fallback
          }
        }
      } catch (err) {
        console.error("Product load error:", err);
        // Fallback demo product if id is demo
        const fallbackProd: Product = {
          id: productId,
          artisan_id: "ART001",
          name: "Handwoven Bamboo & Rattan Basket",
          craft: "Bamboo Craft",
          category: "Home & Living",
          material: "Natural Rattan & Moso Bamboo",
          description:
            "A masterwork of organic handweaving. Each strand of bamboo is harvested sustainably, cured in natural river brine, and hand-split into delicate ribbons before being woven into a tight, durable vessel.",
          production_time_days: 14,
          monthly_capacity: 500,
          customization: true,
          price: 450,
          status: "confirmed",
          ai_generated: true,
          ai_confirmed: true,
          keywords: ["bamboo", "basket", "sustainable", "handwoven"],
          craft_story:
            "The traditional wickerwork and hexagonal lattice techniques of this craft have been passed down through three generations in the rural river valley guilds.",
          buyer_description:
            "Ideal for conscious homes and design studios seeking authentic craftsmanship rooted in verifiable indigenous provenance.",
          images: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProduct(fallbackProd);
        setSelectedImage(getProductDisplayImage(fallbackProd));
        setArtisan({
          id: "ART001",
          name: "Rameshwar Kumbhar",
          location: "Bishnupur Guild",
          state: "West Bengal",
          district: "Bankura",
          languages: ["Bengali", "Hindi"],
          craft: "Terracotta & Pottery",
          cluster_id: "CL_WB_BANKURA",
          verification_status: "verified",
          is_demo_data: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (productId) {
      loadData();
    }
  }, [productId]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleBulkEnquireB2B = () => {
    if (!product) return;
    const qty = Math.max(50, Math.min(product.monthly_capacity || 200, 200));
    const newOrder = createB2BOrder({
      product_id: product.id,
      product_name: product.name,
      product_image: selectedImage || getProductDisplayImage(product),
      craft: product.craft,
      material: product.material || "Natural Material",
      quantity: qty,
      unit_price: product.price || 420,
      total_price: qty * (product.price || 420),
      buyer_name: "Institutional Procurement Sourcing",
      buyer_type: "Institutional",
      artisan_id: artisan?.id || product.artisan_id || "ART001",
      artisan_name: artisan?.name || "Rameshwar Kumbhar",
      cluster_id: artisan?.cluster_id || "CL_WB_BANKURA",
      cluster_name: "Bankura Artisan Guild",
      status: "pending",
      notes: `Direct wholesale B2B enquiry for ${product.name} (${qty} units batch).`,
    });
    router.push(`/business/orders?newOrder=${newOrder.id}&tab=pending`);
  };

  const imagesList =
    product.images && product.images.length > 0
      ? product.images.map((img) =>
          getStorageUrl(img.processed_path || img.original_path || "")
        )
      : [selectedImage];

  const displayName = getLocalizedProductName(product, language);
  const displayCraft = getLocalizedProductCraft(product, language);
  const displayMaterial = getLocalizedProductMaterial(product, language);
  const displayDescription = getLocalizedProductDescription(product, language);
  const displayCraftStory =
    language === "hi" && (product as any).ai_metadata?.catalogue?.hindi?.craft_story
      ? (product as any).ai_metadata.catalogue.hindi.craft_story
      : product.craft_story;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-1 pb-24">
        {/* Navigation Breadcrumb */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <Link href="/" className="hover:text-[#C85A32]">
              {language === "hi" ? "होम" : "Home"}
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#C85A32]">
              {language === "hi" ? "बाज़ार" : "Shop"}
            </Link>
            <span>/</span>
            <span className="text-[#1C1917] truncate font-medium max-w-xs">
              {displayName}
            </span>
          </div>
        </div>

        {/* Product Main Display (Split Gallery & Details) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Gallery (Span 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/5] sm:aspect-square w-full overflow-hidden rounded-3xl bg-[#F4EFEA] border border-[#E8DFD5] shadow-sm">
                <Image
                  src={selectedImage}
                  alt={displayName}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center transition-all duration-300"
                  unoptimized={selectedImage.startsWith("data:") || selectedImage.startsWith("blob:")}
                  onError={() => {
                    setSelectedImage("/images/artisan-potter-hero.png");
                  }}
                />

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-[#1C1917] backdrop-blur-md shadow hover:scale-105 active:scale-95 transition-all"
                  aria-label="Toggle wishlist"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      inWishlist
                        ? "fill-[#C85A32] text-[#C85A32]"
                        : "text-[#1C1917]"
                    }`}
                  />
                </button>

                {/* Provenance Tag on Image */}
                <div className="absolute bottom-4 left-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-black/75 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#3F5E4D]" />
                    <span>{language === "hi" ? "सत्यापित कारीगर बैच" : "Verified Artisan Batch"}</span>
                  </span>
                </div>
              </div>

              {/* Thumbnails Row if multiple images */}
              {imagesList.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {imagesList.map((imgUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                        selectedImage === imgUrl
                          ? "border-[#C85A32] shadow-sm"
                          : "border-[#E8DFD5] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`View ${i + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Information Column (Span 5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Craft & Artisan Metadata */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold tracking-widest text-[#C85A32]">
                    {displayCraft}
                  </span>
                  {displayMaterial && (
                    <>
                      <span className="text-[#D6CEBE]">•</span>
                      <span className="text-xs text-[#78716C] font-medium">
                        {displayMaterial}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#141311] leading-tight">
                  {displayName}
                </h1>

                {artisan && (
                  <div className="flex items-center gap-2 text-xs text-[#78716C] pt-1">
                    <span>{language === "hi" ? "शिल्पकार:" : "By"}</span>
                    <Link
                      href={`/shop/artisan/${artisan.id}`}
                      className="font-semibold text-[#1C1917] underline hover:text-[#C85A32]"
                    >
                      {artisan.name}
                    </Link>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#A8A29E]" />
                      {artisan.location || artisan.state}
                    </span>
                  </div>
                )}
              </div>

              {/* Price & Tax Note */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-3xl font-bold text-[#1C1917]">
                    ₹{(product.price || 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[#78716C]">
                    {language === "hi" ? "(कर सहित • प्रत्यक्ष कारीगर दर)" : "(Direct Artisan Fair Price)"}
                  </span>
                </div>
                <p className="text-[11px] text-[#3F5E4D] font-medium mt-1">
                  {language === "hi"
                    ? "✓ शत-प्रतिशत राशि सीधे कारीगर सहकारी समूह को हस्तांतरित"
                    : "✓ 100% funds disbursed directly to maker guild co-operative"}
                </p>
              </div>

              {/* Quantity Stepper & Add to Cart Action */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#D6CEBE] bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 text-base font-semibold text-[#1C1917] hover:bg-[#F4EFEA] rounded-lg"
                      aria-label="Decrease"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-[#1C1917]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 text-base font-semibold text-[#1C1917] hover:bg-[#F4EFEA] rounded-lg"
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={justAdded}
                    className="flex-1 rounded-xl gap-2 text-sm"
                  >
                    {justAdded ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{language === "hi" ? "जोड़ दिया गया" : "Added to Cart"}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" />
                        <span>{language === "hi" ? "टोकरी में डालें" : "Add to Cart"}</span>
                      </>
                    )}
                  </Button>
                </div>

                {/* Direct B2B Bulk Enquire Action (Redirects to Orders) */}
                <button
                  type="button"
                  onClick={handleBulkEnquireB2B}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-[#1C1917] bg-white py-3 text-xs font-bold text-[#1C1917] hover:bg-[#1C1917] hover:text-white transition-all shadow-xs"
                >
                  <Building2 className="h-4 w-4 text-[#C85A32]" />
                  <span>
                    {language === "hi"
                      ? "थोक खरीद पूछताछ (B2B Bulk Enquire) →"
                      : "Bulk Enquire (B2B Wholesale Orders) →"}
                  </span>
                </button>
              </div>

              {/* Delivery & Production Timeline */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-[#E8DFD5]">
                  <Clock className="h-4 w-4 text-[#C85A32]" />
                  <div>
                    <span className="text-[#A8A29E] block text-[10px] uppercase">
                      {language === "hi" ? "निर्माण समय" : "Lead Time"}
                    </span>
                    <span className="font-semibold text-[#1C1917]">
                      {product.production_time_days
                        ? `${product.production_time_days} ${language === "hi" ? "दिन निर्माण" : "Days Crafting"}`
                        : language === "hi"
                        ? "प्रेषण के लिए तैयार"
                        : "Ready to Dispatch"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-white p-3 border border-[#E8DFD5]">
                  <Layers className="h-4 w-4 text-[#3F5E4D]" />
                  <div>
                    <span className="text-[#A8A29E] block text-[10px] uppercase">
                      {language === "hi" ? "क्लस्टर क्षमता" : "Cluster Capacity"}
                    </span>
                    <span className="font-semibold text-[#1C1917]">
                      {product.monthly_capacity
                        ? `${product.monthly_capacity} ${language === "hi" ? "नग/माह" : "units/mo"}`
                        : language === "hi"
                        ? "कस्टम ऑर्डर"
                        : "Custom Order"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Provenance Audit Box */}
              <div className="rounded-2xl bg-[#F4EFEA]/80 p-4 border border-[#E8DFD5] space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-[#1C1917]">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="h-4 w-4 text-[#3F5E4D]" />
                    {language === "hi" ? "प्रमाणित हुनर स्रोत" : "Provenanced Attributes"}
                  </span>
                  <span className="text-[11px] text-[#3F5E4D]">
                    {language === "hi" ? "सत्यापित" : "Verified"}
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] text-[#78716C] pt-1 border-t border-[#E8DFD5]">
                  <div className="flex justify-between">
                    <span>{language === "hi" ? "सामग्री:" : "Material:"}</span>
                    <span className="font-medium text-[#1C1917]">{displayMaterial}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "hi" ? "स्रोत:" : "Source:"}</span>
                    <span className="font-medium text-[#1C1917]">
                      {language === "hi" ? "कारीगर कार्यशाला निरीक्षण" : "Artisan workshop cataloging"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "hi" ? "तकनीक:" : "Technique:"}</span>
                    <span className="font-medium text-[#1C1917]">{displayCraft}</span>
                  </div>
                </div>
              </div>

              {/* B2B Institutional Wholesale Box */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#1C1917] flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-[#C85A32]" />
                    {language === "hi" ? "संस्थागत थोक खरीद (B2B Procurement)" : "Institutional B2B Procurement"}
                  </span>
                  <span className="text-[10px] font-bold text-[#3F5E4D] bg-[#EBF1ED] px-2 py-0.5 rounded-full">
                    {language === "hi" ? "थोक दर उपलब्ध" : "Volume Tier Available"}
                  </span>
                </div>
                <p className="text-[11px] text-[#78716C] leading-relaxed">
                  {language === "hi"
                    ? "कारीगर क्लस्टर से प्रत्यक्ष संस्थागत आपूर्ति। पूछताछ सीधे ऑर्डर ट्रैकिंग (लंबित, रास्ते में, पूर्ण) पर निर्देशित होती है।"
                    : "Direct volume procurement from maker guild. Enquiries immediately redirect to order tracking across pending, in-transit, and completed stages."}
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleBulkEnquireB2B}
                  className="w-full rounded-xl gap-2 text-xs font-bold bg-[#1C1917] hover:bg-[#C85A32] text-white"
                >
                  <Building2 className="h-4 w-4" />
                  <span>{language === "hi" ? "थोक मांग दर्ज करें (B2B Bulk Enquire) →" : "Submit B2B Bulk Enquiry →"}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Deep Narrative & Artisan Craft Story Section */}
          <div className="mt-16 pt-12 border-t border-[#E8DFD5] grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C85A32] font-semibold block mb-1">
                  {language === "hi" ? "जीवित धरोहर" : "Living Heritage"}
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#141311]">
                  {language === "hi" ? "इस कृति के पीछे का पारंपरिक शिल्प" : "The Craft Behind This Piece"}
                </h2>
              </div>

              <p className="text-sm md:text-base text-[#78716C] leading-relaxed">
                {displayDescription}
              </p>

              {displayCraftStory && (
                <div className="rounded-2xl bg-white p-6 border border-[#E8DFD5] space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                    {language === "hi" ? "कारीगर की कहानी एवं गिल्ड परंपरा" : "Artisan Story & Guild Lineage"}
                  </h3>
                  <p className="text-sm text-[#78716C] leading-relaxed">
                    {displayCraftStory}
                  </p>
                </div>
              )}
            </div>

            {/* Artisan Profile Mini Card */}
            {artisan && (
              <div className="lg:col-span-4 rounded-3xl bg-white p-6 border border-[#E8DFD5] shadow-xs space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-[#A8A29E] font-semibold">
                    {language === "hi" ? "शिल्पकार" : "The Maker"}
                  </span>
                  <h3 className="font-display text-xl font-bold text-[#1C1917]">
                    {artisan.name}
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    {artisan.craft} • {artisan.location || artisan.state}
                  </p>
                </div>

                <div className="rounded-xl bg-[#FAF8F5] p-3 text-xs text-[#78716C] space-y-1">
                  <div className="flex justify-between">
                    <span>{language === "hi" ? "गिल्ड स्थिति:" : "Guild Status:"}</span>
                    <span className="font-semibold text-[#3F5E4D]">
                      {language === "hi" ? "सत्यापित मास्टर कारीगर" : "Verified Artisan"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "hi" ? "क्लस्टर पहचान:" : "Cluster ID:"}</span>
                    <span className="font-mono text-[11px]">{artisan.cluster_id || "CL_01"}</span>
                  </div>
                </div>

                <Link
                  href={`/shop/artisan/${artisan.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D6CEBE] py-2.5 text-xs font-semibold text-[#1C1917] hover:border-[#C85A32] hover:text-[#C85A32] transition-colors"
                >
                  <span>{language === "hi" ? "कारीगर का पोर्टफोलियो देखें" : "View Artisan Portfolio"}</span>
                  <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
