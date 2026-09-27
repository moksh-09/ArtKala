from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field, model_validator


class APIModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class ArtisanCreate(BaseModel):
    id: str | None = None
    name: str = Field(min_length=1, max_length=160)
    location: str | None = None
    state: str | None = None
    district: str | None = None
    languages: list[str] = Field(default_factory=list)
    craft: str = Field(min_length=1, max_length=160)
    cluster_id: str | None = None
    verification_status: str = "unverified"
    is_demo_data: bool = False


class ArtisanUpdate(BaseModel):
    name: str | None = None
    location: str | None = None
    state: str | None = None
    district: str | None = None
    languages: list[str] | None = None
    craft: str | None = None
    cluster_id: str | None = None
    verification_status: str | None = None


class ArtisanOut(ArtisanCreate, APIModel):
    id: str
    created_at: datetime
    updated_at: datetime


class ProductCreate(BaseModel):
    id: str | None = None
    artisan_id: str
    name: str
    name_hi: str | None = None
    craft: str
    craft_hi: str | None = None
    category: str | None = None
    category_hi: str | None = None
    material: str | None = None
    material_hi: str | None = None
    description: str | None = None
    description_hi: str | None = None
    dimensions: dict[str, Any] | None = None
    production_time_days: int | None = Field(default=None, ge=0)
    monthly_capacity: int | None = Field(default=None, ge=0)
    customization: bool | None = None
    price: float | None = Field(default=None, ge=0)
    status: str = "draft"
    image_data: str | None = None
    images: list[dict[str, Any]] | None = None


class ProductUpdate(BaseModel):
    name: str | None = None
    name_hi: str | None = None
    craft: str | None = None
    craft_hi: str | None = None
    category: str | None = None
    category_hi: str | None = None
    material: str | None = None
    material_hi: str | None = None
    description: str | None = None
    description_hi: str | None = None
    dimensions: dict[str, Any] | None = None
    production_time_days: int | None = Field(default=None, ge=0)
    monthly_capacity: int | None = Field(default=None, ge=0)
    customization: bool | None = None
    price: float | None = Field(default=None, ge=0)
    status: str | None = None


class ProductImageOut(APIModel):
    id: str
    original_path: str
    processed_path: str | None
    thumbnail_path: str | None
    mime_type: str | None
    width: int | None
    height: int | None
    quality_status: str
    processing_metadata: dict[str, Any] | None


class ProductOut(ProductCreate, APIModel):
    id: str
    name_hi: str | None = None
    craft_hi: str | None = None
    material_hi: str | None = None
    category_hi: str | None = None
    description_hi: str | None = None
    ai_generated: bool
    ai_confirmed: bool
    keywords: list[str]
    craft_story: str | None
    buyer_description: str | None
    ai_metadata: dict[str, Any]
    images: list[ProductImageOut] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime

    @model_validator(mode="before")
    @classmethod
    def populate_bilingual_fields(cls, data: Any) -> Any:
        meta = getattr(data, "ai_metadata", None)
        if isinstance(meta, dict):
            cat_hi = meta.get("catalogue", {}).get("hindi", {}) if isinstance(meta.get("catalogue"), dict) else {}
            if not getattr(data, "name_hi", None):
                setattr(data, "name_hi", meta.get("name_hi") or cat_hi.get("title"))
            if not getattr(data, "craft_hi", None):
                setattr(data, "craft_hi", meta.get("craft_hi"))
            if not getattr(data, "material_hi", None):
                setattr(data, "material_hi", meta.get("material_hi"))
            if not getattr(data, "category_hi", None):
                setattr(data, "category_hi", meta.get("category_hi"))
            if not getattr(data, "description_hi", None):
                setattr(data, "description_hi", meta.get("description_hi") or cat_hi.get("detailed_description") or cat_hi.get("short_description"))
        return data


class CapabilityOut(APIModel):
    id: str
    attribute: str
    value: Any
    source: str
    verification_status: str
    confidence: float
    observed_at: datetime
    evidence_ref: str | None


class HunarProfileOut(APIModel):
    artisan_id: str
    capabilities: list[CapabilityOut]
    evidence_strength: str
    summary: dict[str, Any]


class BuyerRequirementCreate(BaseModel):
    id: str | None = None
    buyer_name: str
    raw_text: str | None = None
    product: str | None = None
    craft: str | None = None
    quantity: int | None = Field(default=None, gt=0)
    max_price: float | None = Field(default=None, ge=0)
    deadline_days: int | None = Field(default=None, gt=0)
    customization: bool | None = None
    branding: bool | None = None
    quality_threshold: float | None = Field(default=None, ge=0, le=100)
    location: str | None = None
    is_demo_data: bool = False


class BuyerRequirementOut(BuyerRequirementCreate, APIModel):
    id: str
    product: str
    quantity: int
    status: str
    created_at: datetime
    updated_at: datetime


class MatchOut(APIModel):
    id: str
    requirement_id: str
    artisan_id: str
    matched: bool
    hard_constraints: dict[str, Any]
    score: float
    reasons: list[str]
    rejection_reasons: list[str]
    graph_evidence: list[dict[str, Any]] | None


class MatchingResponse(BaseModel):
    requirement_id: str
    matches: list[MatchOut]
    eligible_count: int


class ClusterCreate(BaseModel):
    id: str | None = None
    name: str
    craft: str
    location: str | None = None
    safety_buffer_ratio: float = Field(default=0.0, ge=0, lt=1)
    is_demo_data: bool = False


class ClusterOut(ClusterCreate, APIModel):
    id: str
    created_at: datetime
    updated_at: datetime


class CapacityRow(BaseModel):
    artisan_id: str
    declared_capacity: int
    observed_capacity: int
    commitments: int
    reserved_quantity: int
    available_capacity: int


class ClusterCapacityOut(BaseModel):
    cluster_id: str
    total_available_capacity: int
    rows: list[CapacityRow]


class AllocationRequest(BaseModel):
    requirement_id: str
    reserve_now: bool = False


class AllocationRow(BaseModel):
    reservation_id: str
    artisan_id: str
    quantity: int
    state: str


class AllocationResponse(BaseModel):
    requirement_id: str
    cluster_id: str
    allocations: list[AllocationRow]
    total_allocated: int
    required_quantity: int


class ReservationAction(BaseModel):
    state: str = "reserved"


class OrderCreate(BaseModel):
    id: str | None = None
    requirement_id: str | None = None
    buyer_name: str
    total_quantity: int = Field(gt=0)
    items: list[dict[str, Any]] = Field(default_factory=list)
    is_demo_data: bool = False


class OrderEventOut(APIModel):
    id: str
    from_state: str | None
    to_state: str
    note: str | None
    actor: str
    created_at: datetime


class OrderItemOut(APIModel):
    id: str
    artisan_id: str
    quantity: int


class OrderOut(APIModel):
    id: str
    requirement_id: str | None
    buyer_name: str
    total_quantity: int
    state: str
    items: list[OrderItemOut]
    events: list[OrderEventOut]
    created_at: datetime
    updated_at: datetime


class OrderStatusUpdate(BaseModel):
    state: str
    note: str | None = None
    actor: str = "prototype-user"


class QualityCheckCreate(BaseModel):
    order_id: str
    artisan_id: str
    result: str = Field(pattern="^(PASS|FAIL|PENDING)$")
    observations: str | None = None
    specification_compliance: float | None = Field(default=None, ge=0, le=100)
    checker: str
    evidence_path: str | None = None


class QualityCheckOut(QualityCheckCreate, APIModel):
    id: str
    created_at: datetime


class AnalysisOut(BaseModel):
    product_id: str
    image: dict[str, Any]
    transcript: dict[str, Any]
    understanding: dict[str, Any]
    catalogue: dict[str, Any]
    draft_requires_confirmation: bool


class PricingRequest(BaseModel):
    product: str
    craft: str | None = None
    material: str | None = None
    category: str | None = None
    description: str | None = None
    raw_material_cost: float = Field(ge=0)
    labour_hours: float = Field(ge=0)
    labour_rate: float = Field(ge=0)
    packaging_cost: float = Field(default=0, ge=0)
    other_production_cost: float = Field(default=0, ge=0)
    logistics_cost: float = Field(default=0, ge=0)
    desired_margin_percent: float = Field(default=0, ge=0, le=500)
    image_path: str | None = None


class PricingResponse(BaseModel):
    cost_floor: float
    cost_plus_target: float
    comparable_range: list[float] | None
    recommended_range: list[float] | None
    confidence: float
    factors: list[str]
    market_data: dict[str, Any]
    calculation: dict[str, Any]
    status: str
    image_analysis: dict[str, Any] | None = None
