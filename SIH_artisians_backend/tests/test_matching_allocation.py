from app.models import Artisan, BuyerRequirement, Cluster, Product
from app.services.allocation_service import allocation_service
from app.services.hunar_service import hunar_service
from app.services.matching_service import matching_service


def make_demo(db):
    cluster = Cluster(id="CL_TEST", name="Test cluster", craft="Bamboo Craft", safety_buffer_ratio=0)
    db.add(cluster)
    for index, capacity in enumerate([500, 400, 600, 500], start=1):
        artisan_id = f"ART_TEST_{index}"
        db.add(Artisan(id=artisan_id, name=artisan_id, craft="Bamboo Craft", cluster_id=cluster.id))
        db.add(Product(id=f"PROD_TEST_{index}", artisan_id=artisan_id, name="Bamboo Basket", craft="Bamboo Craft", material="Bamboo", monthly_capacity=capacity, production_time_days=24, customization=True, price=450))
        hunar_service.upsert_capability(db, artisan_id, "quality_pass_rate", 95, "test", "observed", 0.9)
    requirement = BuyerRequirement(id="REQ_TEST", buyer_name="Buyer", product="Bamboo Basket", craft="Bamboo Craft", quantity=2000, max_price=500, deadline_days=30, customization=True)
    db.add(requirement)
    db.commit()
    return cluster, requirement


def test_matching_explains_individual_capacity_limit(db):
    _cluster, requirement = make_demo(db)
    matches = matching_service.run(db, requirement)
    assert len(matches) == 4
    assert all(not match.matched for match in matches)  # no single artisan can fulfil 2,000
    assert all("capacity_available" in match.hard_constraints for match in matches)


def test_cluster_allocation_and_reservation(db):
    cluster, requirement = make_demo(db)
    result = allocation_service.allocate(db, cluster.id, requirement, reserve_now=True)
    assert result["total_allocated"] == 2000
    assert sum(row["quantity"] for row in result["allocations"]) == 2000
    assert all(row["state"] == "reserved" for row in result["allocations"])

