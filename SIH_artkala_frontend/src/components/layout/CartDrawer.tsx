"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getProductDisplayImage } from "@/lib/api/products";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCart();
  const { language } = useLanguage();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF8F5] p-6 shadow-2xl transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#C85A32]" />
            <h2 className="text-lg font-semibold text-[#1C1917]">
              {language === "hi" ? "आपकी टोकरी" : "Your Cart"} ({totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
            className="rounded-full p-2 text-[#78716C] hover:bg-[#E8DFD5] hover:text-[#1C1917] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EFEA] mb-4">
                <ShoppingBag className="h-8 w-8 text-[#A8A29E]" />
              </div>
              <p className="text-base font-medium text-[#1C1917] mb-1">
                {language === "hi" ? "टोकरी खाली है" : "Your cart is empty"}
              </p>
              <p className="text-sm text-[#78716C] mb-6 max-w-xs">
                {language === "hi"
                  ? "कारीगरों द्वारा बनाए गए प्रामाणिक शिल्पों को खोजें और टोकरी में जोड़ें।"
                  : "Discover authentic pieces crafted by master artisans across India."}
              </p>
              <Button
                variant="primary"
                onClick={() => setIsCartOpen(false)}
              >
                {language === "hi" ? "उत्पाद देखें" : "Explore crafts"}
              </Button>
            </div>
          ) : (
            items.map(({ product, quantity }) => {
              const imgUrl = getProductDisplayImage(product);
              return (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl bg-white border border-[#E8DFD5]"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F4EFEA]">
                    <Image
                      src={imgUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-semibold text-[#1C1917] line-clamp-1">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#78716C]">
                          {product.craft}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-[#A8A29E] hover:text-[#C85A32] transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center rounded-lg border border-[#E8DFD5] bg-[#FAF8F5]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="px-2 py-1 text-[#78716C] hover:text-[#1C1917]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-medium text-[#1C1917]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="px-2 py-1 text-[#78716C] hover:text-[#1C1917]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-[#1C1917]">
                        ₹{((product.price || 0) * quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="border-t border-[#E8DFD5] pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#78716C]">
                {language === "hi" ? "उप-योग" : "Subtotal"}
              </span>
              <span className="font-semibold text-lg text-[#1C1917]">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-xs text-[#78716C]">
              {language === "hi"
                ? "शिपिंग और कर चेकआउट पर गिने जाएंगे। 100% कारीगर को भुगतान।"
                : "Shipping calculated at checkout. 100% fair artisan disbursement."}
            </p>
            <Link
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C85A32] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#B24E29]"
            >
              <span>{language === "hi" ? "चेकआउट करें" : "Proceed to Checkout"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
