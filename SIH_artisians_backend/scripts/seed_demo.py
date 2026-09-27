"""Seed clearly-labelled synthetic data for the SIH demo flow."""

from app.database import SessionLocal, init_db
from app.models import Artisan, BuyerRequirement, Cluster, HunarCapability, Product
from app.services.hunar_service import hunar_service


ARTISANS = [
    ("ART001", "Demo Artisan A", 500, 96),
    ("ART002", "Demo Artisan B", 400, 94),
    ("ART003", "Demo Artisan C", 600, 98),
    ("ART004", "Demo Artisan D", 500, 95),
]


def seed() -> None:
    init_db()
    db = SessionLocal()
    try:
        cluster = db.get(Cluster, "CL_MH_BAMBOO")
        if not cluster:
            cluster = Cluster(id="CL_MH_BAMBOO", name="Maharashtra Bamboo Craft Cluster (DEMO)", craft="Bamboo Craft", location="Maharashtra", is_demo_data=True)
            db.add(cluster)
        for artisan_id, name, capacity, quality in ARTISANS:
            artisan = db.get(Artisan, artisan_id)
            if not artisan:
                artisan = Artisan(id=artisan_id, name=name, location="Demo cluster", state="Maharashtra", district="Pune", languages=["Marathi", "Hindi"], craft="Bamboo Craft", cluster_id=cluster.id, verification_status="demo_verified", is_demo_data=True)
                db.add(artisan)
            product = db.get(Product, f"PROD_{artisan_id}")
            if not product:
                product = Product(id=f"PROD_{artisan_id}", artisan_id=artisan_id, name="Bamboo Basket", craft="Bamboo Craft", category="Home and utility", material="Bamboo", description="Synthetic demo listing for the SIH flow.", production_time_days=24, monthly_capacity=capacity, customization=True, price=450, status="confirmed", ai_confirmed=True, is_demo_data=True)
                db.add(product)
            hunar_service.upsert_capability(db, artisan_id, "monthly_capacity", capacity, "demo_seed", "demo", 0.95, product.id)
            hunar_service.upsert_capability(db, artisan_id, "quality_pass_rate", quality, "demo_seed", "demo", 0.95, f"DEMO_QC_{artisan_id}")
        requirement = db.get(BuyerRequirement, "REQ_DEMO_2000")
        if not requirement:
            requirement = BuyerRequirement(id="REQ_DEMO_2000", buyer_name="Demo Corporate Buyer", raw_text="I need 2000 eco-friendly bamboo baskets for a corporate event within 30 days with branding.", product="Bamboo Basket", craft="Bamboo Craft", quantity=2000, max_price=500, deadline_days=30, customization=True, branding=True, status="open", is_demo_data=True, embedding_text="Bamboo Basket Bamboo Craft corporate event branding")
            db.add(requirement)
        db.commit()
        print("Seeded synthetic demo data: CL_MH_BAMBOO and REQ_DEMO_2000")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

