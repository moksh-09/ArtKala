import { apiFetch } from "./apiClient";
import type { Artisan } from "@/types";

export interface ListArtisansParams {
  craft?: string;
  location?: string;
  limit?: number;
}

export async function listArtisans(params: ListArtisansParams = {}): Promise<Artisan[]> {
  const searchParams = new URLSearchParams();
  if (params.craft) searchParams.set("craft", params.craft);
  if (params.location) searchParams.set("location", params.location);
  if (params.limit) searchParams.set("limit", params.limit.toString());

  const query = searchParams.toString();
  const endpoint = `/artisans${query ? `?${query}` : ""}`;
  return apiFetch<Artisan[]>(endpoint);
}

export async function getArtisan(artisanId: string): Promise<Artisan> {
  return apiFetch<Artisan>(`/artisans/${artisanId}`);
}

export async function createArtisan(payload: Partial<Artisan>): Promise<Artisan> {
  return apiFetch<Artisan>("/artisans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateArtisan(artisanId: string, payload: Partial<Artisan>): Promise<Artisan> {
  return apiFetch<Artisan>(`/artisans/${artisanId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
