from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Artisan, Order, QualityCheck
from app.schemas import QualityCheckCreate, QualityCheckOut
from app.services.hunar_service import hunar_service
from app.services.utils import new_id
from app.services.graph_service import graph_service

router = APIRouter(prefix="/quality", tags=["quality"])


@router.post("/check", response_model=QualityCheckOut, status_code=201)
def create_quality_check(payload: QualityCheckCreate, db: Session = Depends(get_db)) -> QualityCheck:
    if not db.get(Order, payload.order_id):
        raise HTTPException(404, "Order not found")
    if not db.get(Artisan, payload.artisan_id):
        raise HTTPException(404, "Artisan not found")
    check = QualityCheck(id=new_id("QC"), **payload.model_dump())
    db.add(check)
    db.flush()
    hunar_service.update_from_quality(db, payload.artisan_id, check)
    db.commit()
    db.refresh(check)
    graph_service.sync_quality(check)
    return check


@router.get("/checks", response_model=list[QualityCheckOut])
def list_quality_checks(db: Session = Depends(get_db)) -> list[QualityCheck]:
    return list(db.scalars(select(QualityCheck).order_by(QualityCheck.created_at.desc())))


@router.get("/order/{order_id}", response_model=list[QualityCheckOut])
def get_quality_checks(order_id: str, db: Session = Depends(get_db)) -> list[QualityCheck]:
    return list(db.query(QualityCheck).filter(QualityCheck.order_id == order_id).order_by(QualityCheck.created_at.desc()))
