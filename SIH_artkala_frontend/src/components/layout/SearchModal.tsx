"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const craftTags = [
    { label: language === "hi" ? "बांस की टोकरियां" : "Bamboo Baskets", query: "Bamboo Basket" },
    { label: language === "hi" ? "टेराकोटा मृदभांड" : "Terracotta Pottery", query: "Terracotta" },
    { label: language === "hi" ? "हथकरघा रेशम" : "Handloom Silk", query: "Silk" },
    { label: language === "hi" ? "काष्ठ नक्काशी" : "Wood Carving", query: "Wood" },
    { label: language === "hi" ? "ढोकरा धातु" : "Dhokra Brass", query: "Dhokra" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-[#E8DFD5]">
        <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#C85A32]" />
            {language === "hi" ? "शिल्प खोजें" : "Discover Craft Heritage"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="mt-4 flex items-center gap-3">
          <Search className="h-5 w-5 text-[#A8A29E]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === "hi"
                ? "उत्पाद, शिल्प या सामग्री खोजें (उदा: बांस, टेराकोटा, सिल्क)..."
                : "Search by craft, material, artisan or technique (e.g. Bamboo, Silk, Terracotta)..."
            }
            className="flex-1 text-base text-[#1C1917] outline-none placeholder:text-[#A8A29E]"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#C85A32] px-4 py-2 text-xs font-medium text-white hover:bg-[#B24E29]"
          >
            {language === "hi" ? "खोजें" : "Search"}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#F4EFEA]">
          <p className="text-xs font-medium text-[#78716C] mb-2.5">
            {language === "hi" ? "लोकप्रिय खोजें:" : "Popular artisan categories:"}
          </p>
          <div className="flex flex-wrap gap-2">
            {craftTags.map((tag) => (
              <button
                key={tag.query}
                type="button"
                onClick={() => {
                  onClose();
                  router.push(`/shop?search=${encodeURIComponent(tag.query)}`);
                }}
                className="rounded-lg border border-[#E8DFD5] bg-[#FAF8F5] px-3 py-1.5 text-xs text-[#1C1917] hover:border-[#C85A32] hover:text-[#C85A32] transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
