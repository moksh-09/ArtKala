"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Building2,
  FileText,
  Search,
  Filter,
  Eye,
  Plus,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Suspense } from "react";
import { getStoredB2BOrders, type B2BOrder } from "@/lib/api/orders";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";

function BusinessOrdersContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";
  const newOrderId = searchParams.get("newOrder");

  const [activeTab, setActiveTab] = useState<"all" | "pending" | "on_the_way" | "completed">(
    initialTab === "pending" || initialTab === "on_the_way" || initialTab === "completed"
      ? initialTab
      : "all"
  );
  const [orders, setOrders] = useState<B2BOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<B2BOrder | null>(null);

  useEffect(() => {
    const stored = getStoredB2BOrders();
    setOrders(stored);

    // If newOrder param passed, find and auto-open it
    if (newOrderId) {
      const found = stored.find((o) => o.id === newOrderId);
      if (found) {
        setSelectedOrder(found);
        setActiveTab("pending");
      }
    }
  }, [newOrderId]);

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    on_the_way: orders.filter((o) => o.status === "on_the_way").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <Header />

      <main className="flex-1 pb-24">
        {/* Banner Section */}
        <section className="border-b border-[#E8DFD5] bg-[#F4EFEA]/80 py-8 md:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1C1917] px-3 py-0.5 text-xs font-semibold text-white">
                  <Building2 className="h-3.5 w-3.5 text-[#C85A32]" />
                  <span>
                    {language === "hi"
                      ? "संस्थागत खरीददार पोर्टल • बी2बी ऑर्डर"
                      : "Institutional Buyer Hub • B2B Orders"}
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#141311]">
                  {language === "hi"
                    ? "थोक ऑर्डर ट्रैकिंग व प्रेषण स्थिति"
                    : "B2B Orders & Fulfillment Status"}
                </h1>
                <p className="text-xs text-[#78716C]">
                  {language === "hi"
                    ? "कारीगर क्लस्टरों से लंबित निर्माण, रास्ते में प्रेषित खेप व पूर्ण डिलीवरी का सीधा पारदर्शी विवरण।"
                    : "Track wholesale orders: pending workshop crafting, in-transit shipments on the way, and completed deliveries."}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/business">
                  <Button
                    variant="outline"
                    size="md"
                    className="rounded-xl text-xs font-semibold border-[#D6CEBE]"
                  >
                    <span>{language === "hi" ? "क्लस्टर खरीद" : "Cluster Procurement"}</span>
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button
                    variant="primary"
                    size="md"
                    className="rounded-xl gap-2 text-xs font-semibold bg-[#C85A32] hover:bg-[#B24E29]"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{language === "hi" ? "नया थोक उत्पाद खोजें" : "Browse More Products"}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Orders Container */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto border-b border-[#E8DFD5] pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "all"
                  ? "bg-[#1C1917] text-white shadow-xs"
                  : "bg-white text-[#78716C] border border-[#E8DFD5] hover:text-[#1C1917]"
              }`}
            >
              <span>{language === "hi" ? "सभी ऑर्डर" : "All Orders"}</span>
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-white text-[#78716C] border border-[#E8DFD5] hover:text-[#1C1917]"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "लंबित / निर्माण में" : "Pending Orders"}</span>
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">
                {counts.pending}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("on_the_way")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "on_the_way"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-[#78716C] border border-[#E8DFD5] hover:text-[#1C1917]"
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "रास्ते में (On the Way)" : "On the Way (In Transit)"}</span>
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">
                {counts.on_the_way}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("completed")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "completed"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-[#78716C] border border-[#E8DFD5] hover:text-[#1C1917]"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{language === "hi" ? "पूर्ण ऑर्डर" : "Completed Orders"}</span>
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px]">
                {counts.completed}
              </span>
            </button>
          </div>

          {/* Orders Listing Grid */}
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#D6CEBE] bg-white p-12 text-center space-y-3">
              <Package className="h-10 w-10 text-[#78716C] mx-auto opacity-60" />
              <h3 className="font-display text-lg font-bold text-[#1C1917]">
                {language === "hi" ? "इस श्रेणी में कोई ऑर्डर नहीं है" : "No Orders in this Category"}
              </h3>
              <p className="text-xs text-[#78716C] max-w-sm mx-auto">
                {language === "hi"
                  ? "किसी उत्पाद पृष्ठ पर 'Bulk Enquire (B2B)' दबाकर नया थोक मांग पत्र दर्ज करें।"
                  : "Click 'Bulk Enquire (B2B)' on any product page to submit a wholesale procurement order."}
              </p>
              <Link href="/shop">
                <Button variant="primary" size="md" className="rounded-xl text-xs gap-2 mt-2">
                  <span>{language === "hi" ? "उत्पाद देखें" : "Explore Products"}</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((ord) => {
                return (
                  <div
                    key={ord.id}
                    className="flex flex-col justify-between p-5 rounded-3xl bg-white border border-[#E8DFD5] shadow-xs hover:border-[#D6CEBE] hover:shadow-md transition-all"
                  >
                    <div className="space-y-3">
                      {/* Top Status & ID */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-[#1C1917]">
                          {ord.id}
                        </span>
                        {ord.status === "pending" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                            <Clock className="h-3 w-3" />
                            <span>{language === "hi" ? "लंबित" : "Pending"}</span>
                          </span>
                        )}
                        {ord.status === "on_the_way" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800 border border-indigo-200">
                            <Truck className="h-3 w-3" />
                            <span>{language === "hi" ? "रास्ते में" : "On the Way"}</span>
                          </span>
                        )}
                        {ord.status === "completed" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>{language === "hi" ? "पूर्ण" : "Completed"}</span>
                          </span>
                        )}
                      </div>

                      {/* Product Preview */}
                      <div className="flex gap-3">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#FAF8F5] border border-[#E8DFD5]">
                          <Image
                            src={ord.product_image}
                            alt={ord.product_name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-[#C85A32]">
                            {ord.craft}
                          </span>
                          <h4 className="font-semibold text-sm text-[#1C1917] line-clamp-1">
                            {language === "hi" && ord.product_name_hi ? ord.product_name_hi : ord.product_name}
                          </h4>
                          <p className="text-[11px] text-[#78716C] line-clamp-1">
                            {ord.artisan_name} • {ord.cluster_name}
                          </p>
                        </div>
                      </div>

                      {/* Financial & Quantity Highlights */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#F4EFEA] text-xs">
                        <div className="p-2.5 rounded-xl bg-[#FAF8F5]">
                          <span className="text-[10px] uppercase text-[#A8A29E] block">
                            {language === "hi" ? "मात्रा" : "Quantity"}
                          </span>
                          <span className="font-bold text-[#1C1917]">
                            📦 {ord.quantity} {language === "hi" ? "नग" : "units"}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF8F5]">
                          <span className="text-[10px] uppercase text-[#A8A29E] block">
                            {language === "hi" ? "कुल मूल्य" : "Total Price"}
                          </span>
                          <span className="font-bold text-[#3F5E4D]">
                            ₹{ord.total_price.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Transit indicator if on the way */}
                      {ord.status === "on_the_way" && ord.tracking_number && (
                        <div className="rounded-xl bg-indigo-50/70 border border-indigo-200 p-2.5 text-[11px] text-indigo-900 flex items-center justify-between">
                          <span className="flex items-center gap-1 font-semibold">
                            <Truck className="h-3.5 w-3.5 text-indigo-600" />
                            <span>{ord.shipping_carrier || "In Transit"}</span>
                          </span>
                          <span className="font-mono text-[10px] text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">
                            {ord.tracking_number}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action: View Order Details Box */}
                    <div className="pt-3 border-t border-[#F4EFEA] mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-[#78716C]">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#C85A32] text-white text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{language === "hi" ? "ऑर्डर विवरण देखें" : "Order Details"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* REUSABLE ORDER DETAILS MODAL / BOX */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        viewerRole="buyer"
      />

      <Footer />
    </div>
  );
}

export default function BusinessOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C85A32]" />
        </div>
      }
    >
      <BusinessOrdersContent />
    </Suspense>
  );
}
