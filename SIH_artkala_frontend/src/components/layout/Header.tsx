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
        className={`sticky top-0 z-40 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? "bg-[#FAFAF8]/92 backdrop-blur-2xl border-b border-[#EBE5DC]/80 shadow-[0_1px_12px_rgba(28,25,23,0.03)] py-3"
            : "bg-transparent py-5 md:py-6 border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="font-dossier text-[1.5rem] md:text-[1.75rem] text-[#1A1816] transition-all duration-300 group-hover:text-[#C85A32] group-hover:tracking-[0.04em]">
                ARTKALA
              </span>
              <span className="hidden sm:inline-block h-4 w-[1px] bg-[#D6CEBE] transition-colors duration-300 group-hover:bg-[#C85A32]/40" />
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.18em] text-[#6B6560] font-medium transition-colors duration-300 group-hover:text-[#C85A32]/70">
                {language === "hi" ? "कारीगर बाज़ार" : "Artisan Commerce"}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3.5 py-2 text-[13px] font-medium transition-all duration-300 rounded-lg ${
                      isActive
                        ? "text-[#C85A32]"
                        : "text-[#1A1816] hover:text-[#C85A32] hover:bg-[#F5F1EC]/60"
                    }`}
                  >
                    <VanishText textKey={link.labelKey} fallback={link.labelFallback} />
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] w-4 rounded-full bg-[#C85A32] transition-all duration-300" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search crafts"
              className="flex items-center gap-2 rounded-full p-2.5 sm:px-3.5 sm:py-2 text-[#1A1816] hover:bg-[#F5F1EC] transition-all duration-300 magnetic-hover"
            >
              <Search className="h-[15px] w-[15px] text-[#6B6560]" />
              <span className="hidden lg:inline-block text-[12px] text-[#6B6560]">
                <VanishText textKey="nav.search" fallback="Search crafts..." />
              </span>
            </button>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              title={language === "en" ? "हिंदी में बदलें" : "Switch to English"}
              className="flex items-center gap-1.5 rounded-full border border-[#EBE5DC] bg-white/90 px-2.5 py-1.5 text-[11px] font-semibold text-[#1A1816] hover:border-[#C85A32] hover:text-[#C85A32] transition-all duration-300 magnetic-hover"
            >
              <Globe className="h-3 w-3 text-[#6B6560]" />
              <span>{language === "en" ? "हिंदी" : "EN"}</span>
            </button>

            {/* Profile */}
            <button
              type="button"
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center justify-center rounded-full p-2.5 text-[#1A1816] hover:bg-[#F5F1EC] hover:text-[#C85A32] transition-all duration-300 magnetic-hover"
              title={language === "hi" ? "कारीगर हुनर क्षमता प्रोफ़ाइल" : "Artisan Capability Profile"}
              aria-label="Artisan Capability Profile"
            >
              <User className="h-[15px] w-[15px]" />
            </button>

            {/* Wishlist */}
            <Link
              href="/shop"
              className="hidden sm:flex relative items-center justify-center rounded-full p-2.5 text-[#1A1816] hover:bg-[#F5F1EC] transition-all duration-300 magnetic-hover"
              title={language === "hi" ? "पसंदीदा सूची" : "Wishlist"}
              aria-label="Wishlist"
            >
              <Heart className="h-[15px] w-[15px]" />
              {totalWishlist > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#C85A32] text-[9px] font-bold text-white animate-scale-in">
                  {totalWishlist}
                </span>
              )}
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="View shopping cart"
              className="relative flex items-center justify-center rounded-full bg-[#1A1816] p-2.5 text-white hover:bg-[#C85A32] transition-all duration-300 shadow-[0_2px_8px_rgba(26,24,22,0.15)] hover:shadow-[0_4px_16px_rgba(200,90,50,0.25)] magnetic-hover"
            >
              <ShoppingBag className="h-[15px] w-[15px]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C85A32] text-[9px] font-bold text-white border-2 border-[#FAFAF8] animate-scale-in">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden items-center justify-center rounded-lg p-2.5 text-[#1A1816] hover:bg-[#F5F1EC] transition-all duration-200"
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
          <div className="md:hidden border-t border-[#EBE5DC] bg-[#FAFAF8]/98 backdrop-blur-xl px-4 pt-4 pb-6 animate-fade-in-up">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-[#1A1816] hover:bg-[#F5F1EC] transition-all duration-200"
                >
                  <VanishText textKey={link.labelKey} fallback={link.labelFallback} />
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-[#EBE5DC] flex items-center justify-between">
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
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[#D6CEBE] hover:border-[#C85A32] hover:text-[#C85A32] transition-all duration-200"
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
