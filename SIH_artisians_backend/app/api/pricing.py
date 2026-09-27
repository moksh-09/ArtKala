from typing import Annotated
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas import PricingRequest, PricingResponse
from app.services.image_ai_service import image_ai_service
from app.services.pricing_service import pricing_service
from app.services.storage_service import LocalStorage, UploadTooLargeError

router = APIRouter(prefix="/pricing", tags=["pricing"])
storage = LocalStorage()


@router.post("/estimate", response_model=PricingResponse)
def estimate_price(payload: PricingRequest) -> dict:
    result = pricing_service.estimate(payload.model_dump(exclude_none=True))
    if payload.image_path:
        try:
            Path(payload.image_path).resolve().relative_to(storage.root.resolve())
        except ValueError as exc:
            raise HTTPException(422, "image_path must refer to an uploaded file in server storage") from exc
        result["image_analysis"] = image_ai_service.inspect(payload.image_path)
        result["factors"].append("Image quality/size metrics were measured locally; no unsupported visual price attribute was inferred.")
    return result


@router.post("/estimate-upload", response_model=PricingResponse)
async def estimate_price_with_image(
    product: Annotated[str, Form()],
    raw_material_cost: Annotated[float, Form()],
    labour_hours: Annotated[float, Form()],
    labour_rate: Annotated[float, Form()],
    craft: Annotated[str | None, Form()] = None,
    material: Annotated[str | None, Form()] = None,
    category: Annotated[str | None, Form()] = None,
    description: Annotated[str | None, Form()] = None,
    packaging_cost: Annotated[float, Form()] = 0,
    other_production_cost: Annotated[float, Form()] = 0,
    logistics_cost: Annotated[float, Form()] = 0,
    desired_margin_percent: Annotated[float, Form()] = 0,
    image: Annotated[UploadFile | None, File()] = None,
) -> dict:
    try:
        image_path = await storage.save_upload(image, "images/pricing") if image else None
    except UploadTooLargeError as exc:
        raise HTTPException(413, str(exc)) from exc
    payload = PricingRequest(
        product=product, craft=craft, material=material, category=category, description=description,
        raw_material_cost=raw_material_cost, labour_hours=labour_hours, labour_rate=labour_rate,
        packaging_cost=packaging_cost, other_production_cost=other_production_cost,
        logistics_cost=logistics_cost, desired_margin_percent=desired_margin_percent, image_path=image_path,
    )
    result = pricing_service.estimate(payload.model_dump(exclude_none=True))
    if image_path:
        result["image_analysis"] = image_ai_service.inspect(image_path)
        result["factors"].append("The uploaded image was measured locally for quality/size; no unsupported visual price attribute was inferred.")
    return result


@router.get("/benchmarks")
def benchmark_metadata() -> dict:
    from app.services.market_data_service import market_data_service

    data = market_data_service.observations()
    return {key: value for key, value in data.items() if key != "observations"} | {"observation_count": len(data.get("observations", []))}
