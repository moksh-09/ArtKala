from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import HunarProfileOut
from app.services.hunar_service import hunar_service

router = APIRouter(prefix="/hunar", tags=["hunar-profile"])


@router.get("/{artisan_id}", response_model=HunarProfileOut)
def get_hunar_profile(artisan_id: str, db: Session = Depends(get_db)) -> dict:
    try:
        return hunar_service.profile(db, artisan_id)
    except LookupError as exc:
        raise HTTPException(404, str(exc)) from exc


@router.get("/{artisan_id}/evidence", response_model=list)
def get_hunar_evidence(artisan_id: str, db: Session = Depends(get_db)) -> list:
    try:
        return hunar_service.profile(db, artisan_id)["capabilities"]
    except LookupError as exc:
        raise HTTPException(404, str(exc)) from exc

