import { apiFetch } from "./apiClient";
import type { PricingEstimate, QualityCheck, Order } from "@/types";

export interface PricingPayload {
  product: string;
  raw_material_cost: number;
  labour_hours: number;
  labour_rate: number;
  craft?: string;
  material?: string;
  category?: string;
  description?: string;
  packaging_cost?: number;
  other_production_cost?: number;
  logistics_cost?: number;
  desired_margin_percent?: number;
  image_path?: string;
}

export async function estimatePrice(payload: PricingPayload): Promise<PricingEstimate> {
  return apiFetch<PricingEstimate>("/pricing/estimate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getPricingBenchmarks(): Promise<Record<string, unknown>> {
  return apiFetch<Record<string, unknown>>("/pricing/benchmarks");
}

export async function listQualityChecks(): Promise<QualityCheck[]> {
  return apiFetch<QualityCheck[]>("/quality/checks");
}

export async function listOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/orders");
}

export async function getOrder(orderId: string): Promise<Order> {
  return apiFetch<Order>(`/orders/${orderId}`);
}
