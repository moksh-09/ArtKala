import { apiFetch } from "./apiClient";
import type { HunarProfile, Capability } from "@/types";

export async function getHunarProfile(artisanId: string): Promise<HunarProfile> {
  return apiFetch<HunarProfile>(`/hunar/${artisanId}`);
}

export async function getHunarEvidence(artisanId: string): Promise<Capability[]> {
  return apiFetch<Capability[]>(`/hunar/${artisanId}/evidence`);
}
