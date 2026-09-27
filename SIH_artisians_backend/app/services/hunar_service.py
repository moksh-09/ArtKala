from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Artisan, HunarCapability, QualityCheck
from app.services.utils import new_id
from app.services.graph_service import graph_service


class HunarService:
    def upsert_capability(
        self,
        db: Session,
        artisan_id: str,
        attribute: str,
        value: Any,
        source: str,
        verification_status: str,
        confidence: float,
        evidence_ref: str | None = None,
    ) -> HunarCapability:
        capability = db.scalar(select(HunarCapability).where(
            HunarCapability.artisan_id == artisan_id,
            HunarCapability.attribute == attribute,
            HunarCapability.source == source,
        ))
        if not capability:
            capability = HunarCapability(id=new_id("CAP"), artisan_id=artisan_id, attribute=attribute, source=source)
            db.add(capability)
        capability.value = value
        capability.verification_status = verification_status
        capability.confidence = confidence
        capability.evidence_ref = evidence_ref
        capability.observed_at = datetime.now(timezone.utc)
        graph_service.sync_capability(capability)
        return capability

    def profile(self, db: Session, artisan_id: str) -> dict[str, Any]:
        artisan = db.get(Artisan, artisan_id)
        if not artisan:
            raise LookupError("Artisan not found")
        capabilities = list(db.scalars(select(HunarCapability).where(HunarCapability.artisan_id == artisan_id).order_by(HunarCapability.attribute)))
        quality_checks = list(db.scalars(select(QualityCheck).where(QualityCheck.artisan_id == artisan_id)))
        completed = sum(1 for check in quality_checks if check.result == "PASS")
        evidence_count = len(capabilities) + len(quality_checks)
        strength = "HIGH" if evidence_count >= 5 and completed >= 2 else "MEDIUM" if evidence_count >= 2 else "BUILDING"
        summary = {
            "craft": artisan.craft,
            "completed_orders": completed,
            "quality_pass_rate": round((completed / len(quality_checks)) * 100, 2) if quality_checks else None,
            "evidence_strength": strength,
        }
        return {"artisan_id": artisan_id, "capabilities": capabilities, "evidence_strength": strength, "summary": summary}

    def update_from_quality(self, db: Session, artisan_id: str, quality: QualityCheck) -> None:
        checks = list(db.scalars(select(QualityCheck).where(QualityCheck.artisan_id == artisan_id)))
        passed = sum(1 for check in checks if check.result == "PASS")
        self.upsert_capability(db, artisan_id, "quality_pass_rate", round((passed / len(checks)) * 100, 2), "quality_checks", "observed", 0.9, quality.id)
        self.upsert_capability(db, artisan_id, "completed_quality_checks", len(checks), "quality_checks", "observed", 0.88, quality.id)


hunar_service = HunarService()
