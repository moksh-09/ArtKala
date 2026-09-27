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

  // Determine localized or fallback text
  const rawArtisanName = product.artisan?.name || (language === "hi" ? "पारंपरिक मास्टर कारीगर" : "Indigenous Master Artisan");
  const displayLocation = product.artisan?.location || product.artisan?.state || (language === "hi" ? "भारत में हस्तनिर्मित" : "Handcrafted in India");
  
  // Format price
  const formattedPrice =
    product.price !== null && product.price !== undefined
      ? `₹${product.price.toLocaleString("en-IN")}`
      : language === "hi"
      ? "कस्टम ऑर्डर"
      : "Custom Order";

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-[#E8DFD5] overflow-hidden transition-all duration-300 hover:border-[#D6CEBE] hover:shadow-[0_12px_32px_-8px_rgba(28,25,23,0.08)]">
      {/* Product Image Container */}
      <Link
        href={`/shop/product/${product.id}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-[#F4EFEA]"
      >
        <Image
          src={imgSrc}
          alt={displayName}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          unoptimized={imgSrc.startsWith("data:") || imgSrc.startsWith("blob:")}
          onError={() => {
            setImgSrc("https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80");
          }}
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? (language === "hi" ? "पसंदीदा से हटाएं" : "Remove from wishlist") : (language === "hi" ? "पसंदीदा में जोड़ें" : "Add to wishlist")}
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1C1917] backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-105 active:scale-95 shadow-xs"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              inWishlist
                ? "fill-[#C85A32] text-[#C85A32]"
                : "text-[#1C1917] hover:text-[#C85A32]"
            }`}
          />
        </button>

        {/* Craft Badge */}
        {displayCraft && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-block rounded-md bg-[#1C1917]/85 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-xs">
              {displayCraft}
            </span>
          </div>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Artisan & Location */}
        <div className="mb-1 flex items-center justify-between text-xs text-[#78716C]">
          <span className="truncate font-medium">{rawArtisanName}</span>
          <span className="truncate text-[11px] text-[#A8A29E]">{displayLocation}</span>
        </div>

        {/* Product Title */}
        <Link
          href={`/shop/product/${product.id}`}
          className="mb-2 group/title"
        >
          <h3 className="line-clamp-1 text-sm font-semibold text-[#1C1917] transition-colors group-hover/title:text-[#C85A32]">
            {displayName}
          </h3>
        </Link>

        {/* Material or Category Subtext */}
        <div className="mb-4 text-xs text-[#78716C] line-clamp-1">
          {displayMaterial
            ? `${language === "hi" ? "सामग्री:" : "Material:"} ${displayMaterial}`
            : product.category || (language === "hi" ? "प्रामाणिक शिल्प" : "Indigenous Craft")}
        </div>

        {/* Price & Quick Add */}
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-[#F4EFEA]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#A8A29E] block">
              {language === "hi" ? "कारीगर मूल्य" : "Direct Price"}
            </span>
            <span className="text-base font-semibold text-[#1C1917]">
              {formattedPrice}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={justAdded}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
              justAdded
                ? "bg-[#3F5E4D] text-white"
                : "bg-[#F4EFEA] text-[#1C1917] hover:bg-[#C85A32] hover:text-white"
            }`}
            title={language === "hi" ? "टोकरी में डालें" : "Add to cart"}
            aria-label={language === "hi" ? "टोकरी में डालें" : "Add to cart"}
          >
            {justAdded ? (
              <Check className="h-4 w-4" />
            ) : (
              <ShoppingBag className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
