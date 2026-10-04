import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-hindi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARTKALA — Sovereign Marketplace for Indian Artisans",
  description:
    "AI-driven market linkage and smart cataloging marketplace for indigenous and marginalized Indian artisans. Direct provenance, fair pricing, and cluster-based institutional fulfillment.",
  keywords: [
    "Indian artisans",
    "crafts marketplace",
    "handloom",
    "bamboo craft",
    "terracotta",
    "smart cataloging",
    "SIH26090",
    "AI provenance",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} ${notoSansDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#1A1816] antialiased selection:bg-[#C85A32] selection:text-white">
        <LanguageProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
