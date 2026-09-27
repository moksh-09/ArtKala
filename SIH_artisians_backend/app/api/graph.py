from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.graph_service import graph_service
from app.services.hunar_service import hunar_service

router = APIRouter(prefix="/graph", tags=["knowledge-graph"])


@router.get("/status")
def graph_status() -> dict:
    return graph_service.status()


@router.get("/artisans/{artisan_id}")
def artisan_graph(artisan_id: str) -> dict:
    return graph_service.artisan_graph(artisan_id)


@router.get("/artisans/{artisan_id}/capabilities")
def artisan_capabilities(artisan_id: str, db: Session = Depends(get_db)) -> dict:
    graph = graph_service.artisan_graph(artisan_id)
    if graph.get("graph_available"):
        return graph
    try:
        profile = hunar_service.profile(db, artisan_id)
        return {"graph_available": False, "fallback": "relational", "capabilities": [cap.model_dump() if hasattr(cap, "model_dump") else {"id": cap.id, "attribute": cap.attribute, "value": cap.value, "source": cap.source, "verification_status": cap.verification_status, "confidence": cap.confidence, "evidence_ref": cap.evidence_ref} for cap in profile["capabilities"]]}
    except LookupError:
        return {"graph_available": False, "fallback": "relational", "capabilities": []}


@router.get("/products/{product_id}/relations")
def product_relations(product_id: str) -> dict:
    return graph_service.product_relations(product_id)


@router.get("/requirements/{requirement_id}/matches")
def requirement_matches(requirement_id: str) -> dict:
    return graph_service.requirement_matches(requirement_id)


@router.get("/evidence/{evidence_id}/provenance")
def evidence_provenance(evidence_id: str) -> dict:
    return graph_service.evidence_provenance(evidence_id)
