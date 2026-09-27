"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/contexts/CartContext";
import {
  getProductDisplayImage,
  getLocalizedProductName,
  getLocalizedProductCraft,
  getLocalizedProductMaterial,
} from "@/lib/api/products";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, subtotal, totalItems } = useCart();
  const { language } = useLanguage();
  const [isOrdered, setIsOrdered] = useState(false);

  const handleSimulateCheckout = () => {
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-20 text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF1ED] text-[#3F5E4D]">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold text-[#141311]">
              {language === "hi"
                ? "कारीगर गिल्ड के साथ ऑर्डर दर्ज हुआ"
                : "Order Placed with Artisan Guild"}
            </h1>
            <p className="text-sm text-[#78716C] leading-relaxed">
              {language === "hi"
                ? "आपकी हस्तनिर्मित कृतियां सीधे संबंधित कारीगर क्लस्टर पूर्ति कतार में प्रेषित कर दी गई हैं। 100% उचित मूल्य वितरित।"
                : "Your handcrafted pieces have been dispatched directly into the artisan cluster fulfillment queue. 100% fair price disbursed."}
            </p>
          </div>
          <Link href="/shop">
            <Button variant="primary" size="lg" className="rounded-xl">
              {language === "hi" ? "खरीदारी जारी रखें" : "Continue Shopping"}
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-1 pb-24">
        {/* Breadcrumb & Header */}
        <section className="border-b border-[#E8DFD5] bg-[#F4EFEA]/70 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#141311]">
              {language === "hi" ? "आपकी खरीद टोकरी" : "Your Shopping Cart"}
            </h1>
            <p className="text-xs text-[#78716C] mt-1">
              {totalItems}{" "}
              {language === "hi"
                ? "शिल्प उत्पाद टोकरी में उपलब्ध"
                : totalItems === 1
                ? "artisan item in cart"
                : "artisan items in cart"}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-[#E8DFD5] bg-white p-12 text-center max-w-md mx-auto space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F4EFEA] text-[#A8A29E]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h2 className="font-display text-xl font-bold text-[#1C1917]">
                {language === "hi" ? "आपकी टोकरी खाली है" : "Your cart is currently empty"}
              </h2>
              <p className="text-xs text-[#78716C]">
                {language === "hi"
                  ? "भारत भर के प्रामाणिक समूहों से हस्तनिर्मित कृतियों की खोज करें।"
                  : "Explore handcrafted works from indigenous clusters across India."}
              </p>
              <Link href="/shop">
                <Button variant="primary" size="md" className="rounded-xl">
                  {language === "hi" ? "शिल्प उत्पाद देखें" : "Explore Crafts"}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Items List (Span 8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {items.map(({ product, quantity }) => {
                  const imgUrl = getProductDisplayImage(product);
                  const prodName = getLocalizedProductName(product, language);
                  const prodCraft = getLocalizedProductCraft(product, language);
                  const prodMaterial = getLocalizedProductMaterial(product, language);

                  return (
                    <div
                      key={product.id}
                      className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs"
                    >
                      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-[#F4EFEA]">
                        <Image
                          src={imgUrl}
                          alt={prodName}
                          fill
                          sizes="112px"
                          className="object-cover"
                          unoptimized={imgUrl.startsWith("data:") || imgUrl.startsWith("blob:")}
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C85A32]">
                              {prodCraft}
                            </span>
                            <h3 className="text-base font-semibold text-[#1C1917]">
                              {prodName}
                            </h3>
                            <p className="text-xs text-[#78716C] mt-0.5">
                              {prodMaterial
                                ? `${language === "hi" ? "सामग्री:" : "Material:"} ${prodMaterial}`
                                : language === "hi"
                                ? "हस्तनिर्मित"
                                : "Handcrafted"}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(product.id)}
                            className="p-1.5 text-[#A8A29E] hover:text-[#C85A32] transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F4EFEA]">
                          {/* Quantity selector */}
                          <div className="flex items-center rounded-xl border border-[#E8DFD5] bg-[#FAF8F5]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="px-3 py-1 text-sm font-semibold text-[#78716C] hover:text-[#1C1917]"
                              aria-label="Decrease"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-semibold text-[#1C1917]">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="px-3 py-1 text-sm font-semibold text-[#78716C] hover:text-[#1C1917]"
                              aria-label="Increase"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-[#A8A29E] block uppercase">
                              {language === "hi" ? "इकाई दर:" : "Unit Price:"} ₹{(product.price || 0).toLocaleString("en-IN")}
                            </span>
                            <span className="text-base font-bold text-[#1C1917]">
                              ₹{((product.price || 0) * quantity).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary (Span 4 cols) */}
              <div className="lg:col-span-4 rounded-3xl bg-white p-6 border border-[#E8DFD5] shadow-xs space-y-6">
                <h3 className="font-display text-xl font-bold text-[#1C1917]">
                  {language === "hi" ? "ऑर्डर सारांश" : "Order Summary"}
                </h3>

                <div className="space-y-3 text-xs text-[#78716C]">
                  <div className="flex justify-between">
                    <span>{language === "hi" ? "कुल सामग्री मूल्य" : "Items Subtotal"}</span>
                    <span className="font-semibold text-[#1C1917]">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "hi" ? "क्लस्टर सीधा शिपिंग" : "Cluster Direct Shipping"}</span>
                    <span className="font-semibold text-[#3F5E4D]">
                      {language === "hi" ? "निःशुल्क (सत्यापित)" : "Free (SIH Prototype)"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === "hi" ? "कारीगर उचित भुगतान" : "Artisan Fair Disbursement"}</span>
                    <span className="font-semibold text-[#1C1917]">
                      {language === "hi" ? "100% सुनिश्चित" : "100% Guaranteed"}
                    </span>
                  </div>
                  <div className="border-t border-[#E8DFD5] pt-3 flex justify-between text-base font-bold text-[#1C1917]">
                    <span>{language === "hi" ? "कुल योग" : "Total"}</span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSimulateCheckout}
                  className="w-full rounded-xl gap-2 font-semibold text-xs"
                >
                  <span>
                    {language === "hi"
                      ? "कारीगर गिल्ड के साथ ऑर्डर पूर्ण करें"
                      : "Complete Order with Artisan Guild"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <div className="rounded-xl bg-[#FAF8F5] p-3 text-[11px] text-[#78716C] flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#3F5E4D] flex-shrink-0" />
                  <span>
                    {language === "hi"
                      ? "संप्रभु सीधा भुगतान कारीगर सहकारी बैंक खाते में जमा।"
                      : "Sovereign direct payment directly credited to artisan cooperative."}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
