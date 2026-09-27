from datetime import datetime, timezone
from typing import Any

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import JSON

from app.database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)


class Artisan(TimestampMixin, Base):
    __tablename__ = "artisans"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    location: Mapped[str | None] = mapped_column(String(160))
    state: Mapped[str | None] = mapped_column(String(80))
    district: Mapped[str | None] = mapped_column(String(80))
    languages: Mapped[list[str]] = mapped_column(JSON, default=list)
    craft: Mapped[str] = mapped_column(String(160), nullable=False)
    cluster_id: Mapped[str | None] = mapped_column(ForeignKey("clusters.id"))
    verification_status: Mapped[str] = mapped_column(String(40), default="unverified", nullable=False)
    is_demo_data: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    products: Mapped[list["Product"]] = relationship(back_populates="artisan")
    capabilities: Mapped[list["HunarCapability"]] = relationship(back_populates="artisan", cascade="all, delete-orphan")
    cluster: Mapped["Cluster | None"] = relationship(back_populates="members")


class Cluster(TimestampMixin, Base):
    __tablename__ = "clusters"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    craft: Mapped[str] = mapped_column(String(160), nullable=False)
    location: Mapped[str | None] = mapped_column(String(160))
    safety_buffer_ratio: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    is_demo_data: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    members: Mapped[list[Artisan]] = relationship(back_populates="cluster")


class Product(TimestampMixin, Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    artisan_id: Mapped[str] = mapped_column(ForeignKey("artisans.id"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(180), nullable=False)
    craft: Mapped[str] = mapped_column(String(160), nullable=False)
    category: Mapped[str | None] = mapped_column(String(120))
    material: Mapped[str | None] = mapped_column(String(120))
    description: Mapped[str | None] = mapped_column(Text)
    dimensions: Mapped[dict[str, Any] | None] = mapped_column(JSON)
    production_time_days: Mapped[int | None] = mapped_column(Integer)
    monthly_capacity: Mapped[int | None] = mapped_column(Integer)
    customization: Mapped[bool | None] = mapped_column(Boolean)
    price: Mapped[float | None] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(40), default="draft", nullable=False)
    ai_generated: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    ai_confirmed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_demo_data: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    keywords: Mapped[list[str]] = mapped_column(JSON, default=list)
    craft_story: Mapped[str | None] = mapped_column(Text)
    buyer_description: Mapped[str | None] = mapped_column(Text)
    ai_metadata: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    embedding_text: Mapped[str | None] = mapped_column(Text)

    artisan: Mapped[Artisan] = relationship(back_populates="products")
    images: Mapped[list["ProductImage"]] = relationship(back_populates="product", cascade="all, delete-orphan")


class ProductImage(TimestampMixin, Base):
    __tablename__ = "product_images"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"), nullable=False, index=True)
    original_path: Mapped[str] = mapped_column(String(500), nullable=False)
    processed_path: Mapped[str | None] = mapped_column(String(500))
    thumbnail_path: Mapped[str | None] = mapped_column(String(500))
    mime_type: Mapped[str | None] = mapped_column(String(120))
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    quality_status: Mapped[str] = mapped_column(String(40), default="unchecked")
    processing_metadata: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)

    product: Mapped[Product] = relationship(back_populates="images")


class HunarCapability(TimestampMixin, Base):
    __tablename__ = "hunar_capabilities"
    __table_args__ = (UniqueConstraint("artisan_id", "attribute", "source", name="uq_hunar_attribute_source"),)

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    artisan_id: Mapped[str] = mapped_column(ForeignKey("artisans.id"), nullable=False, index=True)
    attribute: Mapped[str] = mapped_column(String(100), nullable=False)
    value: Mapped[Any] = mapped_column(JSON, nullable=False)
    source: Mapped[str] = mapped_column(String(60), nullable=False)
    verification_status: Mapped[str] = mapped_column(String(60), nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.5, nullable=False)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
    evidence_ref: Mapped[str | None] = mapped_column(String(200))

    artisan: Mapped[Artisan] = relationship(back_populates="capabilities")


class BuyerRequirement(TimestampMixin, Base):
    __tablename__ = "buyer_requirements"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    buyer_name: Mapped[str] = mapped_column(String(160), nullable=False)
    raw_text: Mapped[str | None] = mapped_column(Text)
    product: Mapped[str] = mapped_column(String(180), nullable=False)
    craft: Mapped[str | None] = mapped_column(String(160))
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    max_price: Mapped[float | None] = mapped_column(Float)
    deadline_days: Mapped[int | None] = mapped_column(Integer)
    customization: Mapped[bool | None] = mapped_column(Boolean)
    branding: Mapped[bool | None] = mapped_column(Boolean)
    quality_threshold: Mapped[float | None] = mapped_column(Float)
    location: Mapped[str | None] = mapped_column(String(160))
    status: Mapped[str] = mapped_column(String(40), default="open", nullable=False)
    is_demo_data: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    embedding_text: Mapped[str | None] = mapped_column(Text)


class Match(TimestampMixin, Base):
    __tablename__ = "matches"
    __table_args__ = (UniqueConstraint("requirement_id", "artisan_id", name="uq_match_requirement_artisan"),)

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    requirement_id: Mapped[str] = mapped_column(ForeignKey("buyer_requirements.id"), nullable=False, index=True)
    artisan_id: Mapped[str] = mapped_column(ForeignKey("artisans.id"), nullable=False, index=True)
    matched: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    hard_constraints: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    reasons: Mapped[list[str]] = mapped_column(JSON, default=list)
    rejection_reasons: Mapped[list[str]] = mapped_column(JSON, default=list)
    graph_evidence: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list)


class CapacityReservation(TimestampMixin, Base):
    __tablename__ = "capacity_reservations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    requirement_id: Mapped[str] = mapped_column(ForeignKey("buyer_requirements.id"), nullable=False, index=True)
    artisan_id: Mapped[str] = mapped_column(ForeignKey("artisans.id"), nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    state: Mapped[str] = mapped_column(String(40), default="pending", nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Order(TimestampMixin, Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    requirement_id: Mapped[str | None] = mapped_column(ForeignKey("buyer_requirements.id"))
    buyer_name: Mapped[str] = mapped_column(String(160), nullable=False)
    total_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    state: Mapped[str] = mapped_column(String(40), default="MATCHED", nullable=False)
    is_demo_data: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")
    events: Mapped[list["OrderEvent"]] = relationship(back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id"), nullable=False)
    artisan_id: Mapped[str] = mapped_column(ForeignKey("artisans.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)

    order: Mapped[Order] = relationship(back_populates="items")


class OrderEvent(Base):
    __tablename__ = "order_events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id"), nullable=False)
    from_state: Mapped[str | None] = mapped_column(String(40))
    to_state: Mapped[str] = mapped_column(String(40), nullable=False)
    note: Mapped[str | None] = mapped_column(Text)
    actor: Mapped[str] = mapped_column(String(120), default="system")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)

    order: Mapped[Order] = relationship(back_populates="events")


class QualityCheck(Base):
    __tablename__ = "quality_checks"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    order_id: Mapped[str] = mapped_column(ForeignKey("orders.id"), nullable=False, index=True)
    artisan_id: Mapped[str] = mapped_column(ForeignKey("artisans.id"), nullable=False)
    result: Mapped[str] = mapped_column(String(30), nullable=False)
    observations: Mapped[str | None] = mapped_column(Text)
    specification_compliance: Mapped[float | None] = mapped_column(Float)
    evidence_path: Mapped[str | None] = mapped_column(String(500))
    checker: Mapped[str] = mapped_column(String(120), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, nullable=False)
