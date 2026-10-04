"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import type { Product } from "@/types";
import {
  getProductDisplayImage,
  getLocalizedProductName,
  getLocalizedProductCraft,
  getLocalizedProductMaterial,
} from "@/lib/api/products";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { language } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const imageUrl = getProductDisplayImage(product);
  const [imgSrc, setImgSrc] = useState(imageUrl);

  React.useEffect(() => {
    setImgSrc(imageUrl);
  }, [imageUrl]);

  const displayName = getLocalizedProductName(product, language);
  const displayCraft = getLocalizedProductCraft(product, language);
  const displayMaterial = getLocalizedProductMaterial(product, language);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const rawArtisanName = product.artisan?.name || (language === "hi" ? "पारंपरिक मास्टर कारीगर" : "Indigenous Master Artisan");
  const displayLocation = product.artisan?.location || product.artisan?.state || (language === "hi" ? "भारत में हस्तनिर्मित" : "Handcrafted in India");
  
  const formattedPrice =
    product.price !== null && product.price !== undefined
      ? `₹${product.price.toLocaleString("en-IN")}`
      : language === "hi"
      ? "कस्टम ऑर्डर"
      : "Custom Order";

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#EBE5DC] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#D6CEBE] hover:shadow-[0_16px_48px_-12px_rgba(28,25,23,0.08)] hover:translate-y-[-2px]">
      {/* Product Image */}
      <Link
        href={`/shop/product/${product.id}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[#F5F1EC]"
      >
        <Image
          src={imgSrc}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          unoptimized={imgSrc.startsWith("data:") || imgSrc.startsWith("blob:")}
          onError={() => {
            setImgSrc("/images/artisan-potter-hero.png");
          }}
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? (language === "hi" ? "पसंदीदा से हटाएं" : "Remove from wishlist") : (language === "hi" ? "पसंदीदा में जोड़ें" : "Add to wishlist")}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/92 text-[#1A1816] backdrop-blur-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-white hover:scale-110 active:scale-95 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
        >
          <Heart
            className={`h-4 w-4 transition-all duration-300 ${
              inWishlist
                ? "fill-[#C85A32] text-[#C85A32] scale-110"
                : "text-[#1A1816] hover:text-[#C85A32]"
            }`}
          />
        </button>

        {/* Craft Badge */}
        {displayCraft && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-block rounded-lg bg-[#1A1816]/80 px-2.5 py-1 text-[10px] font-medium tracking-[0.08em] text-white backdrop-blur-sm">
              {displayCraft}
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Artisan & Location */}
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-[#6B6560]">
          <span className="truncate font-medium">{rawArtisanName}</span>
          <span className="truncate text-[10px] text-[#A8A29E]">{displayLocation}</span>
        </div>

        {/* Product Title */}
        <Link
          href={`/shop/product/${product.id}`}
          className="mb-2 group/title"
        >
          <h3 className="line-clamp-1 text-[13px] font-semibold text-[#1A1816] transition-colors duration-300 group-hover/title:text-[#C85A32]">
            {displayName}
          </h3>
        </Link>

        {/* Material */}
        <div className="mb-4 text-[11px] text-[#6B6560] line-clamp-1">
          {displayMaterial
            ? `${language === "hi" ? "सामग्री:" : "Material:"} ${displayMaterial}`
            : product.category || (language === "hi" ? "प्रामाणिक शिल्प" : "Indigenous Craft")}
        </div>

        {/* Price & Quick Add */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#F3EDE5]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.12em] text-[#A8A29E] block">
              {language === "hi" ? "कारीगर मूल्य" : "Direct Price"}
            </span>
            <span className="text-[15px] font-semibold text-[#1A1816]">
              {formattedPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={justAdded}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer active:scale-90 ${
              justAdded
                ? "bg-[#3F5E4D] text-white scale-105"
                : "bg-[#F5F1EC] text-[#1A1816] hover:bg-[#C85A32] hover:text-white hover:shadow-[0_4px_12px_rgba(200,90,50,0.2)]"
            }`}
            title={language === "hi" ? "टोकरी में डालें" : "Add to cart"}
            aria-label={language === "hi" ? "टोकरी में डालें" : "Add to cart"}
          >
            {justAdded ? (
              <Check className="h-4 w-4 animate-scale-in" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
