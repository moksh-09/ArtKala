from __future__ import annotations

from statistics import quantiles
from typing import Any

from app.services.market_data_service import market_data_service


class PricingService:
    def estimate(self, payload: dict[str, Any]) -> dict[str, Any]:
        material = float(payload.get("raw_material_cost") or 0)
        labour_hours = float(payload.get("labour_hours") or 0)
        labour_rate = float(payload.get("labour_rate") or 0)
        packaging = float(payload.get("packaging_cost") or 0)
        other = float(payload.get("other_production_cost") or 0)
        logistics = float(payload.get("logistics_cost") or 0)
        desired_margin = float(payload.get("desired_margin_percent") or 0)
        direct_cost = material + (labour_hours * labour_rate) + packaging + other + logistics
        cost_floor = round(direct_cost, 2)
        cost_plus_target = round(direct_cost * (1 + desired_margin / 100), 2)
        market = market_data_service.comparable_prices(payload["product"], payload.get("craft"), payload.get("material"), payload.get("category"))
        prices = market["prices"]
        comparable_range = [round(min(prices), 2), round(max(prices), 2)] if prices else None
        if len(prices) >= 2:
            quartiles = quantiles(prices, n=4, method="inclusive")
            p25, p75 = quartiles[0], quartiles[2]
        elif prices:
            p25 = p75 = prices[0]
        else:
            p25 = p75 = None
        if p25 is not None:
            recommended_low = max(cost_plus_target, p25)
            recommended_high = max(recommended_low, p75, cost_plus_target)
            recommended_range = [round(recommended_low, 2), round(recommended_high, 2)]
        else:
            recommended_range = [cost_plus_target, cost_plus_target] if direct_cost > 0 else None
        coverage = min(1.0, market["count"] / 5) if market["count"] else 0.0
        recency = max(0.0, 1.0 - (min(market["freshness_days"]) / 365)) if market["freshness_days"] else 0.0
        confidence = round((coverage * 0.65) + (recency * 0.35), 3) if market["count"] else 0.0
        factors = [
            f"Direct cost floor = raw material {material:g} + labour {labour_hours:g}h × {labour_rate:g}/h + packaging {packaging:g} + other production {other:g} + logistics {logistics:g}.",
            f"Desired margin of {desired_margin:g}% produces a cost-plus target of {cost_plus_target:g}.",
        ]
        if comparable_range:
            factors.append(f"{market['count']} {market['match_type']} benchmark observations produce a comparable range of {comparable_range[0]:g}–{comparable_range[1]:g}.")
        else:
            factors.append("No comparable benchmark observations were found; recommended pricing is cost-plus only.")
        return {
            "cost_floor": cost_floor,
            "cost_plus_target": cost_plus_target,
            "comparable_range": comparable_range,
            "recommended_range": recommended_range,
            "confidence": confidence,
            "factors": factors,
            "market_data": market,
            "calculation": {"raw_material_cost": material, "labour_hours": labour_hours, "labour_rate": labour_rate, "packaging_cost": packaging, "other_production_cost": other, "logistics_cost": logistics, "desired_margin_percent": desired_margin},
            "status": "BENCHMARK_PRICING" if prices else "COST_PLUS_ONLY",
        }


pricing_service = PricingService()
