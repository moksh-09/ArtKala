"use client";

import React from "react";
import Image from "next/image";
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  ShieldCheck,
  FileText,
  Copy,
  ArrowRight,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import type { B2BOrder } from "@/lib/api/orders";

interface OrderDetailsModalProps {
  order: B2BOrder | null;
  onClose: () => void;
  viewerRole?: "buyer" | "artisan";
  onStatusChange?: (orderId: string, newStatus: "pending" | "on_the_way" | "completed") => void;
}

export function OrderDetailsModal({
  order,
  onClose,
  viewerRole = "buyer",
  onStatusChange,
}: OrderDetailsModalProps) {
  const { language } = useLanguage();

  if (!order) return null;

  const isBuyer = viewerRole === "buyer";

  const getStatusBadge = (status: B2BOrder["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 border border-amber-200">
            <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span>{language === "hi" ? "लंबित / निर्माण में" : "Pending (Crafting)"}</span>
          </span>
        );
      case "on_the_way":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-800 border border-indigo-200">
            <Truck className="h-3.5 w-3.5 text-indigo-600 animate-bounce" />
            <span>{language === "hi" ? "रास्ते में (On the Way)" : "On the Way (In Transit)"}</span>
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>{language === "hi" ? "पूर्ण / डिलीवर" : "Completed & Delivered"}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#E8DFD5] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#F4EFEA] px-6 py-5 bg-[#FAF8F5]">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-[#1C1917] tracking-wider">
                {order.id}
              </span>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-xs text-[#78716C]">
              {language === "hi" ? "ऑर्डर तिथि:" : "Order Date:"}{" "}
              {new Date(order.created_at).toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#78716C] hover:bg-[#E8DFD5] hover:text-[#1C1917] transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#1C1917]">
          {/* Product & Quantity Box */}
          <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5]">
            <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-white border border-[#E8DFD5]">
              <Image
                src={order.product_image}
                alt={order.product_name}
                fill
                sizes="112px"
                className="object-cover"
                unoptimized={order.product_image?.startsWith("data:") || order.product_image?.startsWith("blob:")}
              />
            </div>

            <div className="flex flex-1 flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#C85A32] uppercase tracking-wider">
                    {order.craft}
                  </span>
                  {order.material && (
                    <>
                      <span className="text-[#D6CEBE]">•</span>
                      <span className="text-[11px] text-[#78716C]">{order.material}</span>
                    </>
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-[#1C1917]">
                  {language === "hi" && order.product_name_hi ? order.product_name_hi : order.product_name}
                </h3>
              </div>

              {/* Price & Quantity Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E8DFD5]">
                <div>
                  <span className="text-[10px] uppercase text-[#A8A29E] block">
                    {language === "hi" ? "मात्रा (नग)" : "Quantity"}
                  </span>
                  <span className="font-bold text-sm text-[#C85A32]">
                    📦 {order.quantity} {language === "hi" ? "नग" : "units"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#A8A29E] block">
                    {language === "hi" ? "इकाई दर" : "Unit Price"}
                  </span>
                  <span className="font-bold text-sm text-[#1C1917]">
                    ₹{order.unit_price}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-[#A8A29E] block">
                    {language === "hi" ? "कुल देय राशि" : "Total Amount"}
                  </span>
                  <span className="font-bold text-sm text-[#3F5E4D]">
                    ₹{order.total_price.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Milestone Stepper */}
          <div className="rounded-2xl border border-[#E8DFD5] p-5 bg-white space-y-3 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
              {language === "hi" ? "ऑर्डर प्रगति व ट्रैकिंग स्थिति" : "Order Progression & Milestones"}
            </span>

            <div className="space-y-3 pt-1">
              {order.milestones.map((m, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                        m.completed
                          ? "bg-emerald-500 text-white"
                          : "bg-[#E8DFD5] text-[#78716C]"
                      }`}
                    >
                      {m.completed ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    {idx < order.milestones.length - 1 && (
                      <div
                        className={`h-5 w-0.5 ${
                          m.completed ? "bg-emerald-400" : "bg-[#E8DFD5]"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-1">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-xs font-semibold ${
                          m.completed ? "text-[#1C1917]" : "text-[#78716C]"
                        }`}
                      >
                        {language === "hi" ? m.stageHi : m.stage}
                      </p>
                      {m.date && <span className="text-[10px] text-[#A8A29E]">{m.date}</span>}
                    </div>
                    {m.note && (
                      <p className="text-[11px] text-[#C85A32] font-medium mt-0.5">{m.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics & Transit Details (for On the Way / Completed) */}
          {order.tracking_number && (
            <div className="rounded-2xl bg-indigo-50/70 border border-indigo-200 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <Truck className="h-4 w-4 text-indigo-600" />
                  {language === "hi" ? "शिपमेंट ट्रैकिंग विवरण" : "Shipment Transit Tracking"}
                </span>
                <span className="text-[11px] font-semibold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                  {order.shipping_carrier || "Logistics Network"}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[#78716C]">
                  {language === "hi" ? "ट्रैकिंग नंबर:" : "Tracking Waybill:"}
                </span>
                <span className="font-mono font-bold text-indigo-900 bg-white px-2 py-1 rounded-md border border-indigo-200">
                  {order.tracking_number}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#78716C]">
                <span>{language === "hi" ? "गंतव्य स्थान:" : "Destination:"}</span>
                <span className="font-medium text-[#1C1917] text-right max-w-xs">{order.destination}</span>
              </div>
            </div>
          )}

          {/* Two-Column Buyer & Artisan Provenance Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Buyer Details */}
            <div className="rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5] p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#1C1917] border-b border-[#E8DFD5] pb-2">
                <Building2 className="h-4 w-4 text-[#C85A32]" />
                <span>{language === "hi" ? "क्रेता विवरण (Buyer)" : "Buyer Details"}</span>
              </div>
              <p className="font-semibold text-xs text-[#1C1917]">{order.buyer_name}</p>
              <p className="text-[11px] text-[#78716C]">
                {language === "hi" ? "प्रकार:" : "Type:"} {order.buyer_type}
              </p>
              <p className="text-[11px] text-[#78716C] flex items-start gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#A8A29E] flex-shrink-0 mt-0.5" />
                <span>{order.destination}</span>
              </p>
            </div>

            {/* Artisan Details */}
            <div className="rounded-2xl bg-[#FAF8F5] border border-[#E8DFD5] p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#1C1917] border-b border-[#E8DFD5] pb-2">
                <ShieldCheck className="h-4 w-4 text-[#3F5E4D]" />
                <span>{language === "hi" ? "कारीगर व क्लस्टर विवरण" : "Artisan & Guild Provenance"}</span>
              </div>
              <p className="font-semibold text-xs text-[#1C1917]">{order.artisan_name}</p>
              <p className="text-[11px] text-[#78716C]">
                {order.cluster_name} ({order.cluster_id})
              </p>
              <span className="inline-block rounded-md bg-[#EBF1ED] px-2 py-0.5 text-[10px] font-semibold text-[#3F5E4D]">
                ✓ {language === "hi" ? "सत्यापित मास्टर गिल्ड" : "100% Verified Master Guild"}
              </span>
            </div>
          </div>

          {/* Notes / Special Instructions */}
          {order.notes && (
            <div className="rounded-xl bg-amber-50/70 border border-amber-200/80 p-3 text-[11px] text-amber-900 leading-relaxed">
              <span className="font-bold block mb-0.5">
                {language === "hi" ? "विशेष निर्देश / विनिर्देश:" : "Specifications & Quality Protocol:"}
              </span>
              {order.notes}
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#F4EFEA] px-6 py-4 bg-[#FAF8F5]">
          <div className="text-[11px] text-[#78716C]">
            {language === "hi"
              ? "एस्क्रो द्वारा 100% सुरक्षित भुगतान व संप्रभु अनुबंध"
              : "100% Sovereign Escrow Contract Guaranteed"}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* If Artisan: Allow changing order state */}
            {!isBuyer && onStatusChange && (
              <>
                {order.status === "pending" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onStatusChange(order.id, "on_the_way");
                      onClose();
                    }}
                    className="rounded-xl text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 font-semibold"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    <span>{language === "hi" ? "रास्ते में भेजें (Mark On the Way)" : "Dispatch (On the Way)"}</span>
                  </Button>
                )}

                {order.status === "on_the_way" && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onStatusChange(order.id, "completed");
                      onClose();
                    }}
                    className="rounded-xl text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 font-semibold"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{language === "hi" ? "ऑर्डर पूर्ण करें (Mark Completed)" : "Mark Delivered (Completed)"}</span>
                  </Button>
                )}
              </>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="rounded-xl text-xs font-semibold"
            >
              {language === "hi" ? "बंद करें" : "Close"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
