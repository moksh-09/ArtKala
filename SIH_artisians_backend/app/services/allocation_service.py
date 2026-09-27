from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Artisan, BuyerRequirement, CapacityReservation, Cluster, HunarCapability, Product
from app.services.matching_service import matching_service
from app.services.utils import new_id, semantic_overlap


class AllocationService:
    def _eligible_members(self, db: Session, cluster: Cluster, requirement: BuyerRequirement) -> list[tuple[Artisan, int, float]]:
        eligible: list[tuple[Artisan, int, float]] = []
        for artisan in cluster.members:
            products = list(db.scalars(select(Product).where(Product.artisan_id == artisan.id)))
            if not products:
                continue
            compatible = any(
                semantic_overlap(f"{p.name} {p.craft} {p.material or ''}", f"{requirement.product} {requirement.craft or ''}") >= 0.12
                or (requirement.craft and requirement.craft.lower() in p.craft.lower())
                for p in products
            )
            if not compatible:
                continue
            if requirement.customization and not any(p.customization is True for p in products):
                continue
            if requirement.max_price is not None and not any(p.price is None or p.price <= requirement.max_price for p in products):
                continue
            lead_times = [p.production_time_days for p in products if p.production_time_days is not None]
            if requirement.deadline_days is not None and lead_times and min(lead_times) > requirement.deadline_days:
                continue
            available = matching_service.available_capacity(db, artisan.id)
            if available <= 0:
                continue
            quality = db.scalar(select(HunarCapability).where(HunarCapability.artisan_id == artisan.id, HunarCapability.attribute == "quality_pass_rate"))
            quality_score = float(quality.value) if quality and isinstance(quality.value, (int, float)) else 0.0
            eligible.append((artisan, available, quality_score))
        return sorted(eligible, key=lambda row: (row[2], row[1]), reverse=True)

    def allocate(self, db: Session, cluster_id: str, requirement: BuyerRequirement, reserve_now: bool) -> dict:
        cluster = db.get(Cluster, cluster_id)
        if not cluster:
            raise LookupError("Cluster not found")
        eligible = self._eligible_members(db, cluster, requirement)
        safety_factor = 1 - cluster.safety_buffer_ratio
        usable_capacity = sum(int(capacity * safety_factor) for _, capacity, _ in eligible)
        if usable_capacity < requirement.quantity:
            raise ValueError(f"Insufficient eligible cluster capacity: {usable_capacity} available for {requirement.quantity} required")
        remaining = requirement.quantity
        allocations = []
        for artisan, available, _quality in eligible:
            quantity = min(available, remaining)
            if quantity <= 0:
                continue
            reservation = CapacityReservation(
                id=new_id("RES"),
                requirement_id=requirement.id,
                artisan_id=artisan.id,
                quantity=quantity,
                state="pending",
            )
            db.add(reservation)
            allocations.append({"reservation_id": reservation.id, "artisan_id": artisan.id, "quantity": quantity, "state": reservation.state})
            remaining -= quantity
            if remaining == 0:
                break
        db.flush()
        if reserve_now:
            for allocation in allocations:
                self.reserve(db, allocation["reservation_id"])
                allocation["state"] = "reserved"
        return {
            "requirement_id": requirement.id,
            "cluster_id": cluster_id,
            "allocations": allocations,
            "total_allocated": requirement.quantity - remaining,
            "required_quantity": requirement.quantity,
        }

    def reserve(self, db: Session, reservation_id: str) -> CapacityReservation:
        reservation = db.scalar(select(CapacityReservation).where(CapacityReservation.id == reservation_id).with_for_update())
        if not reservation:
            raise LookupError("Reservation not found")
        if reservation.state == "reserved":
            return reservation
        if reservation.state != "pending":
            raise ValueError(f"Reservation cannot transition from {reservation.state} to reserved")
        # available_capacity includes this pending reservation, so adding it back
        # gives the capacity available to all other reservations. This check keeps
        # the state server-authoritative even when two allocation attempts race.
        available_before_this = matching_service.available_capacity(db, reservation.artisan_id) + reservation.quantity
        if available_before_this < reservation.quantity:
            raise ValueError("Capacity is no longer available for this reservation")
        reservation.state = "reserved"
        db.flush()
        return reservation


allocation_service = AllocationService()
