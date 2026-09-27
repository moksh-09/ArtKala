from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BuyerRequirement, CapacityReservation, Cluster
from app.schemas import AllocationRequest, AllocationResponse, ClusterCapacityOut, ClusterCreate, ClusterOut, CapacityRow
from app.services.allocation_service import allocation_service
from app.services.matching_service import matching_service

router = APIRouter(prefix="/clusters", tags=["clusters"])


@router.post("", response_model=ClusterOut, status_code=201)
def create_cluster(payload: ClusterCreate, db: Session = Depends(get_db)) -> Cluster:
    cluster_id = payload.id or f"CL_{uuid4().hex[:10]}"
    cluster = Cluster(id=cluster_id, **payload.model_dump(exclude={"id"}))
    db.add(cluster)
    db.commit()
    db.refresh(cluster)
    return cluster


@router.get("/{cluster_id}", response_model=ClusterOut)
def get_cluster(cluster_id: str, db: Session = Depends(get_db)) -> Cluster:
    cluster = db.get(Cluster, cluster_id)
    if not cluster:
        raise HTTPException(404, "Cluster not found")
    return cluster


@router.get("/{cluster_id}/capacity", response_model=ClusterCapacityOut)
def get_capacity(cluster_id: str, db: Session = Depends(get_db)) -> dict:
    cluster = db.get(Cluster, cluster_id)
    if not cluster:
        raise HTTPException(404, "Cluster not found")
    rows = []
    for artisan in cluster.members:
        products = list(artisan.products)
        declared = max((p.monthly_capacity or 0 for p in products), default=0)
        observed = next((int(cap.value) for cap in artisan.capabilities if cap.attribute == "observed_capacity" and isinstance(cap.value, (int, float))), declared)
        commitments = 0  # Future order commitments are intentionally separate from reservations in this MVP.
        reserved = db.scalar(select(func.coalesce(func.sum(CapacityReservation.quantity), 0)).where(
            CapacityReservation.artisan_id == artisan.id,
            CapacityReservation.state.in_(["pending", "reserved"]),
        )) or 0
        available = matching_service.available_capacity(db, artisan.id)
        rows.append(CapacityRow(artisan_id=artisan.id, declared_capacity=declared, observed_capacity=observed, commitments=commitments, reserved_quantity=int(reserved), available_capacity=available))
    return {"cluster_id": cluster_id, "total_available_capacity": sum(row.available_capacity for row in rows), "rows": rows}


@router.post("/{cluster_id}/allocate", response_model=AllocationResponse)
def allocate(cluster_id: str, payload: AllocationRequest, db: Session = Depends(get_db)) -> dict:
    requirement = db.get(BuyerRequirement, payload.requirement_id)
    if not requirement:
        raise HTTPException(404, "Buyer requirement not found")
    try:
        result = allocation_service.allocate(db, cluster_id, requirement, payload.reserve_now)
        db.commit()
        return result
    except (LookupError, ValueError) as exc:
        db.rollback()
        raise HTTPException(409, str(exc)) from exc


@router.post("/reservations/{reservation_id}/reserve")
def reserve(reservation_id: str, db: Session = Depends(get_db)) -> dict:
    try:
        reservation = allocation_service.reserve(db, reservation_id)
        db.commit()
        return {"reservation_id": reservation.id, "artisan_id": reservation.artisan_id, "quantity": reservation.quantity, "state": reservation.state}
    except (LookupError, ValueError) as exc:
        db.rollback()
        raise HTTPException(409, str(exc)) from exc
