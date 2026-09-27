from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Artisan, BuyerRequirement, CapacityReservation, HunarCapability, Match, Product
from app.services.graph_service import graph_service
from app.services.utils import new_id, semantic_overlap


class MatchingService:
    def available_capacity(self, db: Session, artisan_id: str) -> int:
        products = list(db.scalars(select(Product).where(Product.artisan_id == artisan_id)))
        declared = max((product.monthly_capacity or 0 for product in products), default=0)
        observed = db.scalar(select(HunarCapability).where(HunarCapability.artisan_id == artisan_id, HunarCapability.attribute == "observed_capacity").order_by(HunarCapability.observed_at.desc()))
        base = int(observed.value) if observed and isinstance(observed.value, (int, float)) else declared
        reserved = db.scalar(select(func.coalesce(func.sum(CapacityReservation.quantity), 0)).where(CapacityReservation.artisan_id == artisan_id, CapacityReservation.state.in_(["pending", "reserved"]))) or 0
        return max(0, base - int(reserved))

    def run(self, db: Session, requirement: BuyerRequirement) -> list[Match]:
        artisans = list(db.scalars(select(Artisan)))
        previous = {row.artisan_id: row for row in db.scalars(select(Match).where(Match.requirement_id == requirement.id))}
        results: list[Match] = []
        for artisan in artisans:
            products = list(db.scalars(select(Product).where(Product.artisan_id == artisan.id)))
            capabilities = {cap.attribute: cap for cap in db.scalars(select(HunarCapability).where(HunarCapability.artisan_id == artisan.id))}
            capacity = self.available_capacity(db, artisan.id)
            product_text = " ".join(f"{p.name} {p.craft} {p.material or ''} {p.description or ''}" for p in products)
            required_text = f"{requirement.product} {requirement.craft or ''} {requirement.raw_text or ''}"
            hard: dict[str, bool] = {}
            rejected: list[str] = []
            compatible = bool(products) and any(
                semantic_overlap(f"{p.name} {p.craft} {p.material or ''}", f"{requirement.product} {requirement.craft or ''}") >= 0.12
                or (requirement.craft and requirement.craft.lower() in p.craft.lower())
                for p in products
            )
            hard["craft_or_product_compatible"] = compatible
            if not compatible:
                rejected.append("No compatible craft or product")
            hard["capacity_available"] = capacity >= requirement.quantity
            if not hard["capacity_available"]:
                rejected.append(f"Available capacity is {capacity}, below required {requirement.quantity}")
            lead_time = min((p.production_time_days for p in products if p.production_time_days is not None), default=None)
            hard["lead_time_ok"] = requirement.deadline_days is None or lead_time is None or lead_time <= requirement.deadline_days
            if not hard["lead_time_ok"]:
                rejected.append("Lead time exceeds buyer deadline")
            custom_supported = any(p.customization is True for p in products)
            hard["customization_supported"] = requirement.customization is not True or custom_supported
            if not hard["customization_supported"]:
                rejected.append("Customization is required but not supported")
            price_ok = requirement.max_price is None or any(p.price is None or p.price <= requirement.max_price for p in products)
            hard["price_ok"] = price_ok
            if not price_ok:
                rejected.append("Price exceeds buyer ceiling")
            quality = capabilities.get("quality_pass_rate")
            quality_value = float(quality.value) if quality and isinstance(quality.value, (int, float)) else None
            hard["quality_threshold_met"] = requirement.quality_threshold is None or (quality_value is not None and quality_value >= requirement.quality_threshold)
            if not hard["quality_threshold_met"]:
                rejected.append("No observed quality evidence meets threshold")
            score = round((semantic_overlap(product_text, required_text) * 50) + min(capacity / max(requirement.quantity, 1), 1) * 20 + (quality_value or 0) * 0.2 + (10 if custom_supported else 0), 2)
            matched = not rejected
            reasons = []
            if matched:
                reasons.extend(["Required craft or product supported", "Required capacity available"])
                if custom_supported and requirement.customization:
                    reasons.append("Customization supported")
                if quality_value is not None:
                    reasons.append(f"Observed QC pass rate is {quality_value:g}%")
                if lead_time is not None and requirement.deadline_days is not None:
                    reasons.append(f"Estimated lead time {lead_time} days is within deadline")
                if requirement.max_price is not None:
                    reasons.append("At least one product price is within buyer ceiling")
            row = previous.get(artisan.id) or Match(id=new_id("MAT"), requirement_id=requirement.id, artisan_id=artisan.id)
            row.matched = matched
            row.hard_constraints = hard
            row.score = score
            row.graph_evidence = graph_service.match_evidence(requirement.id, artisan.id) if matched else []
            if row.graph_evidence:
                reasons.append("Graph relationship path connects the requirement to the artisan")
            row.reasons = reasons
            row.rejection_reasons = rejected
            db.add(row)
            results.append(row)
        db.flush()
        return sorted(results, key=lambda item: (item.matched, item.score), reverse=True)


matching_service = MatchingService()
