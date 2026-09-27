from fastapi.testclient import TestClient
from io import BytesIO
from PIL import Image
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.config import get_settings
from app.database import Base, get_db
from app.main import app


def test_vertical_slice_api_flow():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine, expire_on_commit=False)
    session = Session()

    def override_db():
        try:
            yield session
        finally:
            pass

    app.dependency_overrides[get_db] = override_db
    get_settings().auto_create_tables = False
    try:
        with TestClient(app) as client:
            assert client.post("/clusters", json={"id": "CL_FLOW", "name": "Flow cluster", "craft": "Bamboo Craft"}).status_code == 201
            for artisan_id, capacity in [("ART_FLOW_A", 500), ("ART_FLOW_B", 500)]:
                assert client.post("/artisans", json={"id": artisan_id, "name": artisan_id, "craft": "Bamboo Craft", "cluster_id": "CL_FLOW"}).status_code == 201
                assert client.post("/products", json={"id": f"P_{artisan_id}", "artisan_id": artisan_id, "name": "Bamboo Basket", "craft": "Bamboo Craft", "material": "Bamboo", "monthly_capacity": capacity, "production_time_days": 20, "customization": True, "price": 400}).status_code == 201
            image = BytesIO()
            Image.new("RGB", (400, 400), (80, 80, 80)).save(image, format="PNG")
            image.seek(0)
            enhanced = client.post("/ai/image-enhance", files={"image": ("new.png", image, "image/png")})
            assert enhanced.status_code == 200
            assert enhanced.json()["original_image"] != enhanced.json()["processed_image"]
            image.seek(0)
            analysed = client.post("/products/analyze", data={"artisan_id": "ART_FLOW_A"}, files={"image": ("new.png", image, "image/png")})
            assert analysed.status_code == 201
            assert analysed.json()["understanding"]["status"] == "unavailable"
            assert analysed.json()["catalogue"]["status"] == "unavailable"
            requirement = client.post("/buyer/requirements", json={"id": "REQ_FLOW", "buyer_name": "Flow buyer", "product": "Bamboo Basket", "craft": "Bamboo Craft", "quantity": 1000, "max_price": 500, "deadline_days": 30, "customization": True}).json()
            matching = client.post(f"/matching/{requirement['id']}").json()
            assert matching["eligible_count"] == 0  # cluster, not one artisan, fulfils the demand
            allocation = client.post("/clusters/CL_FLOW/allocate", json={"requirement_id": "REQ_FLOW", "reserve_now": True}).json()
            assert allocation["total_allocated"] == 1000
            order = client.post("/orders", json={"buyer_name": "Flow buyer", "total_quantity": 1000, "items": allocation["allocations"]}).json()
            assert client.patch(f"/orders/{order['id']}/status", json={"state": "ACCEPTED"}).status_code == 200
            assert client.patch(f"/orders/{order['id']}/status", json={"state": "RESERVED"}).status_code == 200
            assert client.patch(f"/orders/{order['id']}/status", json={"state": "PRODUCTION"}).status_code == 200
            assert client.patch(f"/orders/{order['id']}/status", json={"state": "QC"}).status_code == 200
            assert client.post("/quality/check", json={"order_id": order["id"], "artisan_id": "ART_FLOW_A", "result": "PASS", "checker": "Flow checker"}).status_code == 201
            profile = client.get("/hunar/ART_FLOW_A").json()
            assert any(cap["attribute"] == "quality_pass_rate" for cap in profile["capabilities"])
    finally:
        app.dependency_overrides.clear()
        session.close()
