"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Globe,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { CartDrawer } from "./CartDrawer";
import { SearchModal } from "./SearchModal";
import { ArtisanProfileDrawer } from "@/components/artisan/ArtisanProfileDrawer";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  const { language, toggleLanguage, setLanguage, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const { totalWishlist } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", labelKey: "nav.shop", labelFallback: "Shop" },
    { href: "/#categories", labelKey: "nav.categories", labelFallback: "Categories" },
    { href: "/#artisan-story", labelKey: "nav.artisans", labelFallback: "Artisans" },
    { href: "/business", labelKey: "nav.business", labelFallback: "Business" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFD5] shadow-[0_4px_20px_rgba(28,25,23,0.03)] py-3"
            : "bg-transparent py-4 md:py-5 border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2">
              <span className="font-display text-2xl md:text-3xl font-bold tracking-wider text-[#1C1917] transition-colors group-hover:text-[#C85A32]">
                ARTKALA
              </span>
              <span className="hidden sm:inline-block h-4 w-[1px] bg-[#D6CEBE]" />
              <span className="hidden sm:inline-block text-[11px] uppercase tracking-widest text-[#78716C] font-medium">
                {language === "hi" ? "कारीगर बाज़ार" : "Artisan Commerce"}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-[#C85A32] ${
                      isActive ? "text-[#C85A32] font-semibold" : "text-[#1C1917]"
                    }`}
                  >
                    <VanishText textKey={link.labelKey} fallback={link.labelFallback} />
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Trigger (Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search crafts"
              className="flex items-center gap-2 rounded-full p-2 sm:px-3 sm:py-1.5 text-[#1C1917] hover:bg-[#F4EFEA] transition-colors"
            >
              <Search className="h-4 w-4 text-[#78716C]" />
              <span className="hidden lg:inline-block text-xs text-[#78716C]">
                <VanishText textKey="nav.search" fallback="Search crafts..." />
              </span>
            </button>

            {/* Language Switcher with designed Vanish transition */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={language === "en" ? "हिंदी में बदलें" : "Switch to English"}
              className="flex items-center gap-1.5 rounded-full border border-[#E8DFD5] bg-[#FFFFFF]/80 px-2.5 py-1 text-xs font-semibold text-[#1C1917] hover:border-[#C85A32] hover:text-[#C85A32] transition-all duration-200"
            >
              <Globe className="h-3.5 w-3.5 text-[#78716C]" />
              <span>{language === "en" ? "हिंदी" : "EN"}</span>
            </button>

            {/* Artisan Capability Profile (Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center justify-center rounded-full p-2 text-[#1C1917] hover:bg-[#F4EFEA] hover:text-[#C85A32] transition-colors"
              title={language === "hi" ? "कारीगर हुनर क्षमता प्रोफ़ाइल" : "Artisan Capability Profile"}
              aria-label="Artisan Capability Profile"
            >
              <User className="h-4 w-4" />
            </button>

            {/* Wishlist Link (Desktop) */}
            <Link
              href="/shop"
              className="hidden sm:flex relative items-center justify-center rounded-full p-2 text-[#1C1917] hover:bg-[#F4EFEA] transition-colors"
              title={language === "hi" ? "पसंदीदा सूची" : "Wishlist"}
              aria-label="Wishlist"
            >
              <Heart className="h-4 w-4" />
              {totalWishlist > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C85A32] text-[10px] font-bold text-white">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping cart"
              className="relative flex items-center justify-center rounded-full bg-[#1C1917] p-2 text-white hover:bg-[#C85A32] transition-colors shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C85A32] text-[10px] font-bold text-white border-2 border-[#FAF8F5]">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden items-center justify-center rounded-lg p-2 text-[#1C1917] hover:bg-[#F4EFEA]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8DFD5] bg-[#FAF8F5] px-4 pt-3 pb-6 animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-base font-medium text-[#1C1917] hover:bg-[#F4EFEA]"
                >
                  <VanishText textKey={link.labelKey} fallback={link.labelFallback} />
                </Link>
              ))}
              <div className="pt-3 border-t border-[#E8DFD5] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsProfileOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#C85A32]"
                >
                  <User className="h-4 w-4" />
                  <span>{language === "hi" ? "कारीगर क्षमता प्रोफ़ाइल" : "Artisan Capability Profile"}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="text-xs font-semibold px-3 py-1 rounded-full border border-[#D6CEBE]"
                >
                  {language === "en" ? "हिंदी में देखें" : "View in English"}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer & Search Dialog Components */}
      <CartDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Top-Right Artisan Capability Profile Drawer */}
      <ArtisanProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
}
