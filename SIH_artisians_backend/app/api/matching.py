from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Artisan, BuyerRequirement, Match
from app.schemas import MatchOut, MatchingResponse
from app.services.matching_service import matching_service

router = APIRouter(prefix="/matching", tags=["matching"])


@router.post("/{requirement_id}", response_model=MatchingResponse)
def run_matching(requirement_id: str, db: Session = Depends(get_db)) -> dict:
    requirement = db.get(BuyerRequirement, requirement_id)
    if not requirement:
        raise HTTPException(404, "Buyer requirement not found")
    matches = matching_service.run(db, requirement)
    db.commit()
    return {"requirement_id": requirement_id, "matches": matches, "eligible_count": sum(1 for match in matches if match.matched)}


@router.get("/{requirement_id}", response_model=MatchingResponse)
def get_matching(requirement_id: str, db: Session = Depends(get_db)) -> dict:
    if not db.get(BuyerRequirement, requirement_id):
        raise HTTPException(404, "Buyer requirement not found")
    matches = list(db.scalars(select(Match).where(Match.requirement_id == requirement_id).order_by(Match.matched.desc(), Match.score.desc())))
    return {"requirement_id": requirement_id, "matches": matches, "eligible_count": sum(1 for match in matches if match.matched)}


@router.get("/{requirement_id}/{artisan_id}", response_model=MatchOut)
def get_match(requirement_id: str, artisan_id: str, db: Session = Depends(get_db)) -> Match:
    match = db.scalar(select(Match).where(Match.requirement_id == requirement_id, Match.artisan_id == artisan_id))
    if not match:
        raise HTTPException(404, "Match not found; run matching first")
    return match

