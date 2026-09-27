"""Backfill Neo4j from PostgreSQL/SQLite records without making Neo4j authoritative."""

from sqlalchemy import select

from app.database import SessionLocal
from app.models import Artisan, BuyerRequirement, HunarCapability, Order, Product, QualityCheck
from app.services.graph_service import graph_service


def main() -> None:
    db = SessionLocal()
    try:
        status = graph_service.status()
        if not status.get("graph_available"):
            raise SystemExit(f"Graph unavailable; no records were fabricated: {status}")
        counts = {"artisans": 0, "products": 0, "capabilities": 0, "requirements": 0, "orders": 0, "quality": 0}
        for row in db.scalars(select(Artisan)):
            graph_service.sync_artisan(row); counts["artisans"] += 1
        for row in db.scalars(select(Product)):
            graph_service.sync_product(row); counts["products"] += 1
        for row in db.scalars(select(HunarCapability)):
            graph_service.sync_capability(row); counts["capabilities"] += 1
        for row in db.scalars(select(BuyerRequirement)):
            graph_service.sync_requirement(row); counts["requirements"] += 1
        for row in db.scalars(select(Order)):
            graph_service.sync_order(row); counts["orders"] += 1
        for row in db.scalars(select(QualityCheck)):
            graph_service.sync_quality(row); counts["quality"] += 1
        print({"graph_available": True, "synced": counts})
    finally:
        db.close()


if __name__ == "__main__":
    main()
