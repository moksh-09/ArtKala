from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BuyerRequirement
from app.schemas import BuyerRequirementCreate, BuyerRequirementOut
from app.services.llm_service import llm_service
from app.services.ai_provider import AIProviderError, AIProviderUnavailable
from app.services.graph_service import graph_service

router = APIRouter(prefix="/buyer", tags=["buyer"])


@router.post("/requirements", response_model=BuyerRequirementOut, status_code=201)
def create_requirement(payload: BuyerRequirementCreate, db: Session = Depends(get_db)) -> BuyerRequirement:
    extracted = {}
    if payload.raw_text and (not payload.product or not payload.quantity):
        try:
            extracted = llm_service.extract_requirement(payload.raw_text)
        except (AIProviderUnavailable, AIProviderError) as exc:
            raise HTTPException(422, f"Natural-language extraction is unavailable: {exc}. Supply product and quantity explicitly.") from exc
    values = payload.model_dump(exclude={"id", "product", "quantity", "craft", "max_price", "deadline_days", "customization", "branding"})
    values.update({
        "product": payload.product or extracted.get("product"),
        "quantity": payload.quantity or extracted.get("quantity"),
        "craft": payload.craft or extracted.get("craft"),
        "max_price": payload.max_price if payload.max_price is not None else extracted.get("max_price"),
        "deadline_days": payload.deadline_days if payload.deadline_days is not None else extracted.get("deadline_days"),
        "customization": payload.customization if payload.customization is not None else extracted.get("customization"),
        "branding": payload.branding if payload.branding is not None else extracted.get("branding"),
    })
    if not values["product"] or not values["quantity"]:
        raise HTTPException(422, "Requirement needs product and quantity, either directly or in raw_text")
    requirement_id = payload.id or f"REQ_{uuid4().hex[:10]}"
    if db.get(BuyerRequirement, requirement_id):
        raise HTTPException(409, "Requirement id already exists")
    requirement = BuyerRequirement(id=requirement_id, **values)
    requirement.embedding_text = f"{requirement.product} {requirement.craft or ''} {requirement.raw_text or ''}"
    db.add(requirement)
    db.commit()
    db.refresh(requirement)
    graph_service.sync_requirement(requirement)
    return requirement


@router.get("/requirements", response_model=list[BuyerRequirementOut])
def list_requirements(db: Session = Depends(get_db)) -> list[BuyerRequirement]:
    return list(db.scalars(select(BuyerRequirement).order_by(BuyerRequirement.created_at.desc())))


@router.get("/requirements/{requirement_id}", response_model=BuyerRequirementOut)
def get_requirement(requirement_id: str, db: Session = Depends(get_db)) -> BuyerRequirement:
    requirement = db.get(BuyerRequirement, requirement_id)
    if not requirement:
        raise HTTPException(404, "Buyer requirement not found")
    return requirement
