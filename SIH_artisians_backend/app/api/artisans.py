from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Artisan
from app.schemas import ArtisanCreate, ArtisanOut, ArtisanUpdate
from app.services.graph_service import graph_service

router = APIRouter(prefix="/artisans", tags=["artisans"])


@router.post("", response_model=ArtisanOut, status_code=201)
def create_artisan(payload: ArtisanCreate, db: Session = Depends(get_db)) -> Artisan:
    artisan_id = payload.id or f"ART_{uuid4().hex[:10]}"
    if db.get(Artisan, artisan_id):
        raise HTTPException(409, "Artisan id already exists")
    artisan = Artisan(id=artisan_id, **payload.model_dump(exclude={"id"}))
    db.add(artisan)
    db.commit()
    db.refresh(artisan)
    graph_service.sync_artisan(artisan)
    return artisan


@router.get("", response_model=list[ArtisanOut])
def list_artisans(
    craft: str | None = None,
    location: str | None = None,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> list[Artisan]:
    query = select(Artisan)
    if craft:
        query = query.where(Artisan.craft.ilike(f"%{craft}%"))
    if location:
        query = query.where(Artisan.location.ilike(f"%{location}%"))
    return list(db.scalars(query.order_by(Artisan.created_at.desc()).limit(limit)))


@router.get("/{artisan_id}", response_model=ArtisanOut)
def get_artisan(artisan_id: str, db: Session = Depends(get_db)) -> Artisan:
    artisan = db.get(Artisan, artisan_id)
    if not artisan:
        raise HTTPException(404, "Artisan not found")
    return artisan


@router.patch("/{artisan_id}", response_model=ArtisanOut)
def update_artisan(artisan_id: str, payload: ArtisanUpdate, db: Session = Depends(get_db)) -> Artisan:
    artisan = db.get(Artisan, artisan_id)
    if not artisan:
        raise HTTPException(404, "Artisan not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(artisan, key, value)
    db.commit()
    db.refresh(artisan)
    graph_service.sync_artisan(artisan)
    return artisan
