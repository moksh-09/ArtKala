import { apiFetch } from "./apiClient";
import type { BuyerRequirement, MatchingResponse } from "@/types";

export async function createRequirement(payload: Partial<BuyerRequirement>): Promise<BuyerRequirement> {
  return apiFetch<BuyerRequirement>("/buyer/requirements", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function listRequirements(): Promise<BuyerRequirement[]> {
  return apiFetch<BuyerRequirement[]>("/buyer/requirements");
}

export async function getRequirement(requirementId: string): Promise<BuyerRequirement> {
  return apiFetch<BuyerRequirement>(`/buyer/requirements/${requirementId}`);
}

export async function getMatches(requirementId: string): Promise<MatchingResponse> {
  return apiFetch<MatchingResponse>(`/matching/${requirementId}`);
}

export async function runMatching(requirementId: string): Promise<MatchingResponse> {
  return apiFetch<MatchingResponse>(`/matching/${requirementId}`, {
    method: "POST",
  });
}
