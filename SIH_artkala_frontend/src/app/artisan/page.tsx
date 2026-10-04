"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Edit3,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Loader2,
  Minus,
  Check,
  Truck,
  Building2,
  Eye,
  Award,
  User,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useLanguage, VanishText } from "@/contexts/LanguageContext";
import {
  listArtisanProducts,
  deleteProduct,
  updateProduct,
  getProductDisplayImage,
  getLocalizedProductName,
  getLocalizedProductCraft,
  getLocalizedProductMaterial,
  getLocalizedProductDescription,
} from "@/lib/api/products";
import { getHunarProfile } from "@/lib/api/hunar";
import { getStoredB2BOrders, updateB2BOrderStatus, type B2BOrder } from "@/lib/api/orders";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { ArtisanProfileDrawer } from "@/components/artisan/ArtisanProfileDrawer";
import type { Product, HunarProfile } from "@/types";

function ArtisanProductImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes="96px"
      className="object-cover"
      unoptimized={imgSrc.startsWith("data:") || imgSrc.startsWith("blob:")}
      onError={() => {
        setImgSrc("/images/artisan-potter-hero.png");
      }}
    />
  );
}

export default function ArtisanWorkspacePage() {
  const { language } = useLanguage();
  const artisanId = "ART001";

  const [products, setProducts] = useState<Product[]>([]);
  const [hunar, setHunar] = useState<HunarProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // B2B Orders Management State
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [orderActiveTab, setOrderActiveTab] = useState<"all" | "pending" | "on_the_way" | "completed">("all");
  const [selectedOrder, setSelectedOrder] = useState<B2BOrder | null>(null);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    craft: "",
    material: "",
    category: "",
    monthly_capacity: 500,
    price: 450,
    production_time_days: 14,
    description: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Delete Product Confirmation State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Quick Inline Toast/Feedback State
  const [quickFeedback, setQuickFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadWorkspace() {
      setIsLoading(true);
      try {
        const [prodsData, hunarData] = await Promise.allSettled([
          listArtisanProducts(artisanId),
          getHunarProfile(artisanId),
        ]);

        if (prodsData.status === "fulfilled") {
          setProducts(prodsData.value);
        }
        if (hunarData.status === "fulfilled") {
          setHunar(hunarData.value);
        }

        // Load B2B Orders
        const storedOrders = getStoredB2BOrders();
        setOrders(storedOrders);
      } catch (err) {
        console.error("Workspace load error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadWorkspace();
  }, [artisanId]);

  const handleOrderStatusChange = (
    orderId: string,
    newStatus: "pending" | "on_the_way" | "completed"
  ) => {
    const updated = updateB2BOrderStatus(orderId, newStatus);
    if (updated) {
      const refreshed = getStoredB2BOrders();
      setOrders(refreshed);
      setSelectedOrder(updated);
      setQuickFeedback(
        language === "hi"
          ? `ऑर्डर स्थिति अद्यतन: ${
              newStatus === "on_the_way"
                ? "रास्ते में (On the Way)"
                : newStatus === "completed"
                ? "पूर्ण (Completed)"
                : "लंबित (Pending)"
            }`
          : `Order status updated to: ${
              newStatus === "on_the_way"
                ? "On the Way"
                : newStatus === "completed"
                ? "Completed"
                : "Pending"
            }`
      );
      setTimeout(() => setQuickFeedback(null), 3500);
    }
  };

  // Quick capacity +/- change directly on card
  const handleQuickCapacityChange = async (prod: Product, delta: number) => {
    const currentCap = prod.monthly_capacity ?? 500;
    const newCap = Math.max(1, currentCap + delta);

    // Instant optimistic update in UI
    setProducts((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, monthly_capacity: newCap } : p))
    );

    setQuickFeedback(
      language === "hi"
        ? `क्षमता ${newCap} नग अद्यतन हुई`
        : `Capacity updated to ${newCap} units`
    );
    setTimeout(() => setQuickFeedback(null), 2500);

    try {
      await updateProduct(prod.id, { monthly_capacity: newCap });
    } catch (err) {
      console.warn("Capacity update error:", err);
    }
  };

  // Open Full Edit Modal
  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setEditForm({
      name: prod.name || "",
      craft: prod.craft || "",
      material: prod.material || "",
      category: prod.category || "Home and utility",
      monthly_capacity: prod.monthly_capacity ?? 500,
      price: prod.price ?? 450,
      production_time_days: prod.production_time_days ?? 14,
      description: prod.description || prod.buyer_description || "",
    });
  };

  // Save Full Product Edits
  const handleSaveEdit = async () => {
    if (!editingProduct) return;
    setIsSavingEdit(true);

    const payload = {
      name: editForm.name,
      craft: editForm.craft,
      material: editForm.material,
      category: editForm.category,
      monthly_capacity: Number(editForm.monthly_capacity) || 500,
      price: Number(editForm.price) || 450,
      production_time_days: Number(editForm.production_time_days) || 14,
      description: editForm.description,
      buyer_description: editForm.description,
    };

    try {
      await updateProduct(editingProduct.id, payload);

      // Update state locally
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, ...payload } : p))
      );

      setEditingProduct(null);
      setQuickFeedback(
        language === "hi" ? "उत्पाद विवरण सफलतापूर्वक सहेजा गया!" : "Product updated successfully!"
      );
      setTimeout(() => setQuickFeedback(null), 3000);
    } catch (err) {
      console.warn("Failed to update product:", err);
      alert(
        language === "hi"
          ? "उत्पाद अद्यतन करने में त्रुटि आई। कृपया पुनः प्रयास करें।"
          : "Failed to update product. Please try again."
      );
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = (prod: Product) => {
    setDeletingProduct(prod);
  };

  // Confirm Product Deletion
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    try {
      await deleteProduct(deletingProduct.id);

      // Remove immediately from UI
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setDeletingProduct(null);

      setQuickFeedback(
        language === "hi"
          ? "उत्पाद सफलतापूर्वक हटा दिया गया"
          : "Product deleted successfully"
      );
      setTimeout(() => setQuickFeedback(null), 3000);
    } catch (err) {
      console.warn("Failed to delete product:", err);
      alert(
        language === "hi"
          ? "उत्पाद हटाने में त्रुटि आई।"
          : "Failed to delete product."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      {/* Floating feedback toast */}
      {quickFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-[#1C1917] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in slide-in-from-bottom-3">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{quickFeedback}</span>
        </div>
      )}

      <main className="flex-1 pb-24">
        {/* Workspace Banner */}
        <section className="border-b border-[#E8DFD5] bg-[#F4EFEA]/80 py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EBF1ED] px-3 py-0.5 text-xs font-semibold text-[#3F5E4D]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>
                    {language === "hi"
                      ? "सत्यापित मास्टर गिल्ड • बांकुरा क्लस्टर"
                      : "Verified Master Guild • Bankura Cluster"}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#141311]">
                  {language === "hi"
                    ? "रामेश्वर कुम्हार का शिल्प स्टूडियो"
                    : "Rameshwar Kumbhar's Studio"}
                </h1>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "टेराकोटा एवं मृदभांड शिल्पी • सक्रिय संप्रभु नोड"
                    : "Terracotta & Earthenware Sculptor • Active Sovereign Node"}
                </p>
              </div>

              {/* Primary Action: Add Product */}
              <Link href="/artisan/products/new">
                <Button variant="primary" size="lg" className="rounded-xl gap-2 font-semibold text-xs bg-[#C85A32] hover:bg-[#B24E29]">
                  <Plus className="h-4 w-4" />
                  <span>{language === "hi" ? "नया शिल्प उत्पाद जोड़ें" : "List New Artisan Product"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Dashboard Overview Cards (Clean 3-column grid) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white p-5 border border-[#E8DFD5] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block mb-1">
                {language === "hi" ? "सक्रिय उत्पाद सूचियां" : "Active Listings"}
              </span>
              <p className="font-display text-2xl font-bold text-[#1C1917]">
                {products.length}
              </p>
              <span className="text-[10px] text-[#3F5E4D] font-medium">
                {language === "hi" ? "100% प्रामाणिकता पुष्ट" : "100% Provenance Confirmed"}
              </span>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-[#E8DFD5] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block mb-1">
                {language === "hi" ? "कुल उपलब्ध क्लस्टर क्षमता" : "Total Available Capacity"}
              </span>
              <p className="font-display text-2xl font-bold text-[#C85A32]">
                {products.reduce((acc, p) => acc + (p.monthly_capacity || 500), 0).toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-[#78716C]">{language === "hi" ? "नग / माह" : "units / mo"}</span>
              </p>
              <span className="text-[10px] text-[#78716C]">
                {language === "hi" ? "कारीगर द्वारा संपादन योग्य" : "Artisan-managed capacity"}
              </span>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-[#E8DFD5] shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E] block mb-1">
                {language === "hi" ? "गुणवत्ता अनुपालन दर" : "QC Pass Rate"}
              </span>
              <p className="font-display text-2xl font-bold text-[#3F5E4D]">
                96.4%
              </p>
              <span className="text-[10px] text-[#78716C]">
                {language === "hi" ? "ऑडिटेड संस्थागत गुणवत्ता" : "Audited Institutional QC"}
              </span>
            </div>
          </div>

          {/* Top-Right Capability Profile Notification Banner */}
          <div className="mt-8 rounded-2xl bg-white border border-[#E8DFD5] p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7EAE5] text-[#C85A32] flex-shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm text-[#1C1917]">
                    {language === "hi"
                      ? "कारीगर डिजिटल क्षमता प्रोफ़ाइल (Capability Profile)"
                      : "Artisan Digital Capability Profile"}
                  </h3>
                  <span className="rounded-full bg-[#EBF1ED] px-2 py-0.5 text-[10px] font-bold text-[#3F5E4D]">
                    {language === "hi" ? "सत्यापित रिकॉर्ड" : "Verified Record"}
                  </span>
                </div>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "आपकी संपूर्ण हुनर क्षमता प्रोफ़ाइल शीर्ष-दाएं प्रोफ़ाइल आइकन (👤) पर कभी भी उपलब्ध है।"
                    : "Your full evidence-backed capability dossier is exclusively accessible via the top-right profile icon (👤)."}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsProfileDrawerOpen(true)}
              className="rounded-xl text-xs font-semibold gap-1.5 border-[#D6CEBE] hover:border-[#C85A32] hover:text-[#C85A32] flex-shrink-0"
            >
              <User className="h-3.5 w-3.5" />
              <span>
                {language === "hi" ? "क्षमता प्रोफ़ाइल देखें" : "View Capability Profile"}
              </span>
            </Button>
          </div>

          {/* B2B WHOLESALE ORDERS SECTION (Pending, On the Way, Completed) */}
          <div id="orders" className="mt-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl font-bold text-[#141311]">
                    {language === "hi"
                      ? "थोक ऑर्डर व प्रेषण स्थिति (B2B Orders)"
                      : "B2B Wholesale Orders & Milestones"}
                  </h2>
                  <span className="rounded-full bg-[#1C1917] px-2.5 py-0.5 text-[11px] font-bold text-white">
                    {orders.length}
                  </span>
                </div>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "लंबित निर्माण, रास्ते में प्रेषित (On the Way) और पूर्ण हो चुके संस्थागत व खुदरा ऑर्डर।"
                    : "Manage your wholesale orders: pending crafting, in-transit shipments on the way, and completed deliveries."}
                </p>
              </div>

              <Link
                href="/business/orders"
                className="text-xs font-semibold text-[#C85A32] hover:underline flex items-center gap-1"
              >
                <span>{language === "hi" ? "क्रेता पोर्टल देखें →" : "View Buyer Portal →"}</span>
              </Link>
            </div>

            {/* Orders Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E8DFD5] pb-2">
              <button
                type="button"
                onClick={() => setOrderActiveTab("all")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  orderActiveTab === "all"
                    ? "bg-[#1C1917] text-white shadow-xs"
                    : "bg-white text-[#78716C] border border-[#E8DFD5] hover:text-[#1C1917]"
                }`}
              >
                <span>{language === "hi" ? "सभी ऑर्डर" : "All Orders"}</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
                  {orders.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderActiveTab("pending")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  orderActiveTab === "pending"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-[#78716C] border border-[#E8DFD5] hover:text-[#1C1917]"
                }`}
              >
                <Clock className="h-3 w-3" />
                <span>{language === "hi" ? "लंबित (Pending)" : "Pending"}</span>
                <span className="rounded-full bg-white/25 px-1.5 py-0.2 text-[10px]">
                  {orders.filter((o) => o.status === "pending").length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderActiveTab("on_the_way")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  orderActiveTab === "on_the_way"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-[#78716C] border border-[#E8DFD5] hover:text-[#1C1917]"
                }`}
              >
                <Truck className="h-3 w-3" />
                <span>{language === "hi" ? "रास्ते में (On the Way)" : "On the Way"}</span>
                <span className="rounded-full bg-white/25 px-1.5 py-0.2 text-[10px]">
                  {orders.filter((o) => o.status === "on_the_way").length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderActiveTab("completed")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  orderActiveTab === "completed"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white text-[#78716C] border border-[#E8DFD5] hover:text-[#1C1917]"
                }`}
              >
                <CheckCircle className="h-3 w-3" />
                <span>{language === "hi" ? "पूर्ण (Completed)" : "Completed"}</span>
                <span className="rounded-full bg-white/25 px-1.5 py-0.2 text-[10px]">
                  {orders.filter((o) => o.status === "completed").length}
                </span>
              </button>
            </div>

            {/* Orders Cards Grid */}
            {orders.filter((o) => (orderActiveTab === "all" ? true : o.status === orderActiveTab))
              .length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#D6CEBE] bg-white p-8 text-center space-y-2">
                <Package className="h-8 w-8 text-[#A8A29E] mx-auto" />
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "इस श्रेणी में अभी कोई ऑर्डर नहीं है।"
                    : "No orders found in this status category."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {orders
                  .filter((o) => (orderActiveTab === "all" ? true : o.status === orderActiveTab))
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs hover:border-[#D6CEBE] transition-all"
                    >
                      <div className="space-y-3">
                        {/* Order Header */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-[#1C1917]">
                            {ord.id}
                          </span>
                          {ord.status === "pending" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                              <Clock className="h-3 w-3" />
                              <span>{language === "hi" ? "लंबित" : "Pending"}</span>
                            </span>
                          )}
                          {ord.status === "on_the_way" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800 border border-indigo-200">
                              <Truck className="h-3 w-3" />
                              <span>{language === "hi" ? "रास्ते में" : "On the Way"}</span>
                            </span>
                          )}
                          {ord.status === "completed" && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                              <CheckCircle className="h-3 w-3" />
                              <span>{language === "hi" ? "पूर्ण" : "Completed"}</span>
                            </span>
                          )}
                        </div>

                        {/* Product & Buyer Details */}
                        <div className="flex gap-3">
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#FAF8F5] border border-[#E8DFD5]">
                            <Image
                              src={ord.product_image}
                              alt={ord.product_name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-0.5 text-xs">
                            <span className="text-[10px] font-bold uppercase text-[#C85A32]">
                              {ord.craft}
                            </span>
                            <h4 className="font-semibold text-sm text-[#1C1917] line-clamp-1">
                              {language === "hi" && ord.product_name_hi
                                ? ord.product_name_hi
                                : ord.product_name}
                            </h4>
                            <p className="text-[11px] text-[#78716C] flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-[#A8A29E]" />
                              <span className="line-clamp-1">{ord.buyer_name}</span>
                            </p>
                          </div>
                        </div>

                        {/* Quantity and Price Grid */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F4EFEA] text-xs">
                          <div className="p-2 rounded-xl bg-[#FAF8F5]">
                            <span className="text-[10px] uppercase text-[#A8A29E] block">
                              {language === "hi" ? "मात्रा" : "Quantity"}
                            </span>
                            <span className="font-bold text-[#1C1917]">
                              📦 {ord.quantity} {language === "hi" ? "नग" : "units"}
                            </span>
                          </div>
                          <div className="p-2 rounded-xl bg-[#FAF8F5]">
                            <span className="text-[10px] uppercase text-[#A8A29E] block">
                              {language === "hi" ? "कुल मूल्य" : "Total Price"}
                            </span>
                            <span className="font-bold text-[#3F5E4D]">
                              ₹{ord.total_price.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        {/* Tracking badge if on the way */}
                        {ord.status === "on_the_way" && ord.tracking_number && (
                          <div className="rounded-xl bg-indigo-50/70 border border-indigo-200 p-2 text-[10px] text-indigo-900 flex items-center justify-between">
                            <span className="flex items-center gap-1 font-semibold">
                              <Truck className="h-3 w-3 text-indigo-600" />
                              <span>{ord.shipping_carrier || "In Transit"}</span>
                            </span>
                            <span className="font-mono text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                              {ord.tracking_number}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Footer: Status quick action & Order Details box trigger */}
                      <div className="pt-3 border-t border-[#F4EFEA] mt-3 flex items-center justify-between gap-2">
                        {/* Status advance action */}
                        {ord.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatusChange(ord.id, "on_the_way")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-600 hover:text-white text-[11px] font-semibold transition-colors"
                          >
                            <Truck className="h-3 w-3" />
                            <span>{language === "hi" ? "रास्ते में भेजें" : "Dispatch"}</span>
                          </button>
                        )}

                        {ord.status === "on_the_way" && (
                          <button
                            type="button"
                            onClick={() => handleOrderStatusChange(ord.id, "completed")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white text-[11px] font-semibold transition-colors"
                          >
                            <CheckCircle className="h-3 w-3" />
                            <span>{language === "hi" ? "पूर्ण करें" : "Complete"}</span>
                          </button>
                        )}

                        {ord.status === "completed" && (
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-emerald-600" />
                            <span>{language === "hi" ? "सफलतापूर्वक पूर्ण" : "Delivered"}</span>
                          </span>
                        )}

                        {/* Order Details Box Trigger */}
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#C85A32] text-white text-xs font-semibold transition-colors ml-auto shadow-2xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>{language === "hi" ? "ऑर्डर विवरण" : "Order Details"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Current Studio Listings with Full Edit, Available Units Stepper & Delete */}
          <div className="mt-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#141311]">
                  {language === "hi" ? "स्टूडियो उत्पाद सूचियां व क्षमता प्रबंधन" : "Studio Listings & Capacity Management"}
                </h2>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "प्रत्येक उत्पाद की उपलब्ध इकाइयाँ, मूल्य और विवरण सीधे संपादित करें या हटाएं।"
                    : "Directly edit or delete each product, especially available monthly units."}
                </p>
              </div>
              <Link href="/shop" className="text-xs font-semibold text-[#C85A32] hover:underline">
                {language === "hi" ? "सार्वजनिक बाज़ार में देखें →" : "View in Public Marketplace →"}
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-44 rounded-2xl" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#D6CEBE] bg-white p-12 text-center space-y-3">
                <Package className="h-10 w-10 text-[#C85A32] mx-auto opacity-70" />
                <h3 className="font-display text-lg font-bold text-[#1C1917]">
                  {language === "hi" ? "कोई उत्पाद सूची नहीं मिली" : "No Products Listed Yet"}
                </h3>
                <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                  {language === "hi"
                    ? "स्मार्ट कैटलॉगिंग स्टूडियो से नया उत्पाद सूचीबद्ध करें।"
                    : "List your craft products using the AI Smart Cataloging Studio."}
                </p>
                <Link href="/artisan/products/new">
                  <Button variant="primary" size="md" className="rounded-xl text-xs gap-2 mt-2">
                    <Plus className="h-4 w-4" />
                    <span>{language === "hi" ? "नया उत्पाद जोड़ें" : "Add Product"}</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((prod) => {
                  const img = getProductDisplayImage(prod);
                  const capacity = prod.monthly_capacity ?? 500;
                  const prodName = getLocalizedProductName(prod, language);
                  const prodCraft = getLocalizedProductCraft(prod, language);
                  const prodMaterial = getLocalizedProductMaterial(prod, language);

                  return (
                    <div
                      key={prod.id}
                      className="flex flex-col justify-between p-4 rounded-2xl bg-white border border-[#E8DFD5] shadow-xs hover:border-[#D6CEBE] transition-all"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#F4EFEA]">
                          <ArtisanProductImage
                            src={img}
                            alt={prodName}
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between text-xs">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-[#C85A32] uppercase truncate max-w-[130px]">
                                {prodCraft}
                              </span>
                              <span className="inline-block rounded-md bg-[#EBF1ED] px-1.5 py-0.5 text-[9px] font-semibold text-[#3F5E4D]">
                                {language === "hi" ? "पुष्ट" : "Confirmed"}
                              </span>
                            </div>
                            <h3 className="font-semibold text-sm text-[#1C1917] line-clamp-1 mt-0.5">
                              {prodName}
                            </h3>
                            <p className="text-[#78716C] line-clamp-1 mt-0.5">
                              ₹{(prod.price || 0).toLocaleString("en-IN")} • {prodMaterial}
                            </p>
                            <p className="text-[11px] text-[#A8A29E] mt-0.5">
                              {language === "hi" ? "अवधि:" : "Lead Time:"} {prod.production_time_days || 14}{" "}
                              {language === "hi" ? "दिन" : "days"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* PROMINENT AVAILABLE UNITS (CAPACITY) EDITOR BAR */}
                      <div className="mt-3 rounded-xl bg-[#F7EAE5]/70 border border-[#C85A32]/25 px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-4 w-4 text-[#C85A32]" />
                          <span className="text-[11px] font-bold text-[#1C1917]">
                            {language === "hi" ? "उपलब्ध इकाइयाँ:" : "Available Units:"}
                          </span>
                          <span className="text-xs font-black text-[#C85A32]">
                            {capacity}
                          </span>
                          <span className="text-[10px] text-[#78716C]">
                            {language === "hi" ? "नग/माह" : "units"}
                          </span>
                        </div>

                        {/* Inline Stepper for immediate inventory capacity adjustment */}
                        <div className="flex items-center rounded-lg border border-[#D6CEBE] bg-white overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleQuickCapacityChange(prod, -10)}
                            className="px-2 py-0.5 text-[11px] font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors border-r border-[#E8DFD5]"
                            title={language === "hi" ? "-10 नग घटाएं" : "-10 units"}
                          >
                            -10
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickCapacityChange(prod, 10)}
                            className="px-2 py-0.5 text-[11px] font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors"
                            title={language === "hi" ? "+10 नग बढ़ाएं" : "+10 units"}
                          >
                            +10
                          </button>
                        </div>
                      </div>

                      {/* ACTION BUTTONS: EDIT, DELETE, VIEW */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#F4EFEA] mt-3">
                        <div className="flex items-center gap-2">
                          {/* Edit Product Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(prod)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] text-[#1C1917] hover:border-[#C85A32] hover:text-[#C85A32] hover:bg-[#F7EAE5] transition-all text-xs font-semibold"
                          >
                            <Edit3 className="h-3.5 w-3.5 text-[#C85A32]" />
                            <span>{language === "hi" ? "संपादित करें" : "Edit"}</span>
                          </button>

                          {/* Delete Product Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(prod)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD5] text-[#78716C] hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all text-xs font-semibold"
                            title={language === "hi" ? "उत्पाद हटाएं" : "Delete Product"}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            <span>{language === "hi" ? "हटाएं" : "Delete"}</span>
                          </button>
                        </div>

                        <Link
                          href={`/shop/product/${prod.id}`}
                          className="font-semibold text-[#C85A32] hover:underline text-xs"
                        >
                          {language === "hi" ? "बाज़ार में देखें →" : "View →"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FULL EDIT PRODUCT MODAL (WITH AVAILABLE UNITS HIGHLIGHTED) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#E8DFD5] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F4EFEA] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C85A32]">
                  {language === "hi" ? "कारीगर नियंत्रण कक्ष" : "Artisan Control"}
                </span>
                <h2 className="font-display text-2xl font-bold text-[#1C1917]">
                  {language === "hi" ? "उत्पाद व क्षमता संपादित करें" : "Edit Product & Capacity"}
                </h2>
                <p className="text-xs text-[#78716C] mt-0.5">
                  {language === "hi"
                    ? "उपलब्ध इकाइयाँ, मूल्य व शिल्प विवरण को आवश्यकतानुसार संशोधित करें।"
                    : "Update available units, selling price, and craft details."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="rounded-full p-2 text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              {/* PROMINENT AVAILABLE UNITS EDITOR */}
              <div className="rounded-2xl bg-[#F7EAE5]/70 border-2 border-[#C85A32]/40 p-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-[#C85A32]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="font-bold text-[#1C1917] uppercase tracking-wider text-xs">
                          {language === "hi"
                            ? "उपलब्ध इकाइयाँ / मासिक उत्पादन क्षमता"
                            : "Available Units / Monthly Production Capacity"}
                        </label>
                        <span className="rounded-full bg-[#C85A32] px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                          {language === "hi" ? "प्रमुख फ़ील्ड" : "Key Field"}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#78716C] block">
                        {language === "hi"
                          ? "यह संख्या सीधे खरीदारों और B2B क्लस्टर थोक ऑर्डरों को प्रदर्शित होती है।"
                          : "Reflected live for retail shoppers and B2B bulk cluster orders."}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white px-3 py-1 border border-[#E8DFD5] self-start sm:self-auto font-bold text-xs text-[#C85A32]">
                    📦 {editForm.monthly_capacity} {language === "hi" ? "नग उपलब्ध" : "units"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <div className="flex items-center rounded-xl border border-[#D6CEBE] bg-white overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          monthly_capacity: Math.max(1, prev.monthly_capacity - 50),
                        }))
                      }
                      className="px-2.5 py-1.5 text-xs font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] border-r border-[#E8DFD5]"
                    >
                      -50
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          monthly_capacity: Math.max(1, prev.monthly_capacity - 10),
                        }))
                      }
                      className="px-2.5 py-1.5 text-xs font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] border-r border-[#E8DFD5]"
                    >
                      -10
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={editForm.monthly_capacity}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          monthly_capacity: Math.max(1, Number(e.target.value) || 1),
                        }))
                      }
                      className="w-20 text-center font-bold text-sm text-[#1C1917] p-1.5 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          monthly_capacity: prev.monthly_capacity + 10,
                        }))
                      }
                      className="px-2.5 py-1.5 text-xs font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] border-l border-[#E8DFD5]"
                    >
                      +10
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEditForm((prev) => ({
                          ...prev,
                          monthly_capacity: prev.monthly_capacity + 50,
                        }))
                      }
                      className="px-2.5 py-1.5 text-xs font-bold text-[#78716C] hover:bg-[#F4EFEA] hover:text-[#1C1917] border-l border-[#E8DFD5]"
                    >
                      +50
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-[#78716C]">{language === "hi" ? "चयन:" : "Presets:"}</span>
                    {[50, 100, 250, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() =>
                          setEditForm((prev) => ({ ...prev, monthly_capacity: preset }))
                        }
                        className={`px-2.5 py-0.5 rounded-lg border font-semibold ${
                          editForm.monthly_capacity === preset
                            ? "bg-[#C85A32] text-white border-[#C85A32]"
                            : "bg-white text-[#78716C] border-[#E8DFD5] hover:border-[#C85A32]"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "उत्पाद शीर्षक" : "Product Title"}
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "विक्रय मूल्य (₹)" : "Selling Price (₹)"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))
                    }
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs font-bold text-[#1C1917] outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              {/* Craft, Material, Lead Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "शिल्प परंपरा" : "Craft Tradition"}
                  </label>
                  <input
                    type="text"
                    value={editForm.craft}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, craft: e.target.value }))}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "सामग्री" : "Material"}
                  </label>
                  <input
                    type="text"
                    value={editForm.material}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, material: e.target.value }))}
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                    {language === "hi" ? "निर्माण समय (दिन)" : "Lead Time (Days)"}
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.production_time_days}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        production_time_days: Number(e.target.value) || 1,
                      }))
                    }
                    className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] outline-none focus:border-[#C85A32]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-[#78716C] uppercase tracking-wider mb-1">
                  {language === "hi" ? "क्रेता विवरण (कथा व प्रामाणिकता)" : "Buyer Description"}
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E8DFD5] bg-[#FAF8F5] p-3 text-xs text-[#1C1917] outline-none focus:border-[#C85A32] resize-none"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4EFEA]">
              <Button
                variant="outline"
                size="md"
                onClick={() => setEditingProduct(null)}
                className="rounded-xl text-xs font-semibold"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </Button>

              <Button
                variant="primary"
                size="md"
                isLoading={isSavingEdit}
                onClick={handleSaveEdit}
                className="rounded-xl gap-2 text-xs font-semibold bg-[#C85A32] hover:bg-[#B24E29]"
              >
                <Save className="h-4 w-4" />
                <span>{language === "hi" ? "परिवर्तन सहेजें" : "Save Changes"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-[#E8DFD5] p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-100 text-red-600 flex-shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-lg font-bold text-[#1C1917]">
                  {language === "hi" ? "उत्पाद सूची हटाएं?" : "Delete Product Listing?"}
                </h3>
                <p className="text-xs text-[#78716C] leading-relaxed">
                  {language === "hi"
                    ? `क्या आप वाकई "${getLocalizedProductName(deletingProduct, language)}" को हटाना चाहते हैं? यह उत्पाद आपके स्टूडियो और सार्वजनिक बाज़ार से तुरंत हटा दिया जाएगा।`
                    : `Are you sure you want to delete "${deletingProduct.name}"? This listing will be immediately removed from your studio and public marketplace.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F4EFEA]">
              <Button
                variant="outline"
                size="md"
                onClick={() => setDeletingProduct(null)}
                className="rounded-xl text-xs font-semibold"
              >
                {language === "hi" ? "रद्द करें" : "Cancel"}
              </Button>

              <Button
                variant="primary"
                size="md"
                isLoading={isDeleting}
                onClick={handleConfirmDelete}
                className="rounded-xl gap-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4" />
                <span>{language === "hi" ? "हाँ, हटाएं" : "Yes, Delete"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* REUSABLE ORDER DETAILS MODAL FOR ARTISAN */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        viewerRole="artisan"
        onStatusChange={handleOrderStatusChange}
      />

      {/* ARTISAN CAPABILITY PROFILE DRAWER */}
      <ArtisanProfileDrawer
        isOpen={isProfileDrawerOpen}
        onClose={() => setIsProfileDrawerOpen(false)}
        artisanId={artisanId}
      />

      <Footer />
    </div>
  );
}
