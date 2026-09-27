from __future__ import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any

from app.config import get_settings


class MarketDataService:
    def observations(self) -> dict[str, Any]:
        path = Path(get_settings().market_benchmark_path)
        if not path.is_absolute():
            path = Path(__file__).resolve().parents[2] / path
        if not path.exists():
            return {"dataset_status": "UNAVAILABLE", "observations": [], "source_note": "No documented benchmark dataset configured"}
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {"dataset_status": "INVALID", "observations": []}
        except (OSError, json.JSONDecodeError):
            return {"dataset_status": "INVALID", "observations": []}

    def comparable_prices(self, product: str, craft: str | None, material: str | None, category: str | None) -> dict[str, Any]:
        dataset = self.observations()
        rows = dataset.get("observations", [])
        exact = [row for row in rows if self._same(row.get("product"), product) and self._same(row.get("craft"), craft) and self._same(row.get("material"), material)]
        related = [row for row in rows if self._same(row.get("craft"), craft) and (not category or self._same(row.get("category"), category))]
        selected = exact or related
        prices = sorted(float(row["price"]) for row in selected if isinstance(row.get("price"), (int, float)) and row.get("price", 0) > 0)
        freshness_days = []
        for row in selected:
            try:
                freshness_days.append(max(0, (date.today() - date.fromisoformat(row["observed_at"])).days))
            except (KeyError, ValueError, TypeError):
                continue
        return {
            "prices": prices,
            "count": len(prices),
            "match_type": "exact" if exact else "related" if related else "none",
            "dataset_status": dataset.get("dataset_status", "UNKNOWN"),
            "last_updated": dataset.get("last_updated"),
            "source_note": dataset.get("source_note"),
            "sources": sorted({str(row.get("source")) for row in selected if row.get("source")}),
            "freshness_days": freshness_days,
        }

    @staticmethod
    def _same(left: str | None, right: str | None) -> bool:
        return bool(left and right and left.strip().casefold() == right.strip().casefold())


market_data_service = MarketDataService()
