import asyncio
import base64
from pathlib import Path
from typing import Annotated
from uuid import uuid4

import httpx
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Artisan, Product, ProductImage
from app.schemas import AnalysisOut, ProductCreate, ProductOut, ProductUpdate
from app.services.hunar_service import hunar_service
from app.services.ai_provider import AIProviderError, AIProviderUnavailable
from app.services.catalog_ai_service import catalog_ai_service
from app.services.graph_service import graph_service
from app.services.image_ai_service import ImageProcessingError, image_ai_service
from app.services.speech_service import speech_service
from app.services.storage_service import LocalStorage, UploadTooLargeError
from app.services.translation_service import translation_service
from app.services.utils import new_id

router = APIRouter(tags=["products"])
storage = LocalStorage()


@router.post("/products", response_model=ProductOut, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)) -> Product:
    if not db.get(Artisan, payload.artisan_id):
        raise HTTPException(404, "Artisan not found")

    # Price validation: no zero or negative price allowed, must be present and > 0
    if payload.price is None or payload.price <= 0:
        raise HTTPException(422, "Price must be a valid positive amount greater than zero (no zero or negative price allowed).")

    # Product name validation: must be a proper title (at least 3 characters)
    clean_name = (payload.name or "").strip()
    if len(clean_name) < 3 or clean_name.lower().startswith("unresolved"):
        raise HTTPException(422, "Product name must be a valid, descriptive title of at least 3 characters.")

    # Description validation: must have genuine descriptive text (at least 15 characters)
    clean_desc = (payload.description or "").strip()
    if len(clean_desc) < 15:
        raise HTTPException(422, "Product description must be a genuine summary of at least 15 characters.")

    # Craft tradition validation
    clean_craft = (payload.craft or "").strip()
    if len(clean_craft) < 2 or clean_craft.lower().startswith("unspecified"):
        raise HTTPException(422, "Craft tradition must be specified.")

    # Capacity & lead time validation
    if payload.monthly_capacity is not None and payload.monthly_capacity <= 0:
        raise HTTPException(422, "Monthly production capacity must be greater than zero.")
    if payload.production_time_days is not None and payload.production_time_days <= 0:
        raise HTTPException(422, "Production lead time must be at least 1 day.")

    product_id = payload.id or f"PROD_{uuid4().hex[:10]}"
    if db.get(Product, product_id):
        raise HTTPException(409, "Product id already exists")

    # Handle image storage
    image_src = payload.image_data
    if not image_src and payload.images and len(payload.images) > 0:
        first_img = payload.images[0]
        image_src = first_img.get("original_path") or first_img.get("processed_path") or first_img.get("thumbnail_path")

    # Prepare AI metadata & bilingual translations
    ai_metadata: dict[str, Any] = {}
    if payload.name_hi:
        ai_metadata["name_hi"] = payload.name_hi
    if payload.craft_hi:
        ai_metadata["craft_hi"] = payload.craft_hi
    if payload.material_hi:
        ai_metadata["material_hi"] = payload.material_hi
    if payload.description_hi:
        ai_metadata["description_hi"] = payload.description_hi
    if payload.category_hi:
        ai_metadata["category_hi"] = payload.category_hi

    # Auto-translate missing Hindi values if text is in English
    if "name_hi" not in ai_metadata:
        try:
            tr = translation_service.translate(clean_name, "en", "hi")
            if tr and tr.get("text"):
                ai_metadata["name_hi"] = tr["text"]
        except Exception:
            ai_metadata["name_hi"] = clean_name
            
    if "description_hi" not in ai_metadata and clean_desc:
        try:
            tr = translation_service.translate(clean_desc, "en", "hi")
            if tr and tr.get("text"):
                ai_metadata["description_hi"] = tr["text"]
        except Exception:
            ai_metadata["description_hi"] = clean_desc

    if "craft_hi" not in ai_metadata:
        try:
            tr = translation_service.translate(clean_craft, "en", "hi")
            if tr and tr.get("text"):
                ai_metadata["craft_hi"] = tr["text"]
        except Exception:
            ai_metadata["craft_hi"] = clean_craft

    product_data = payload.model_dump(exclude={"id", "image_data", "images", "name_hi", "craft_hi", "material_hi", "category_hi", "description_hi"})
    product = Product(id=product_id, ai_metadata=ai_metadata, **product_data)
    product.embedding_text = f"{product.name} {product.craft} {product.material or ''} {product.description or ''}"
    db.add(product)
    db.commit()

    # Save ProductImage to database and disk
    if image_src:
        saved_img_path = None
        try:
            if image_src.startswith("data:image/"):
                header, encoded = image_src.split(",", 1)
                data = base64.b64decode(encoded)
                ext = ".png" if "png" in header else ".webp" if "webp" in header else ".jpg"
                target_dir = storage.root / "images/original"
                target_dir.mkdir(parents=True, exist_ok=True)
                target = target_dir / f"{uuid4().hex}{ext}"
                target.write_bytes(data)
                saved_img_path = str(target)
            elif image_src.startswith("http://") or image_src.startswith("https://"):
                try:
                    with httpx.Client(timeout=10) as client:
                        resp = client.get(image_src)
                        if resp.status_code == 200:
                            target_dir = storage.root / "images/original"
                            target_dir.mkdir(parents=True, exist_ok=True)
                            target = target_dir / f"{uuid4().hex}.jpg"
                            target.write_bytes(resp.content)
                            saved_img_path = str(target)
                except Exception:
                    saved_img_path = image_src
            else:
                saved_img_path = image_src

            if saved_img_path:
                thumb_path = storage.create_thumbnail(saved_img_path) if not saved_img_path.startswith("http") else None
                try:
                    rel_original = f"storage/{Path(saved_img_path).relative_to(storage.root).as_posix()}"
                except Exception:
                    rel_original = saved_img_path
                try:
                    rel_thumb = f"storage/{Path(thumb_path).relative_to(storage.root).as_posix()}" if thumb_path else rel_original
                except Exception:
                    rel_thumb = rel_original

                img_rec = ProductImage(
                    id=f"IMG_{uuid4().hex[:12]}",
                    product_id=product.id,
                    original_path=rel_original,
                    processed_path=rel_original,
                    thumbnail_path=rel_thumb,
                    quality_status="confirmed",
                )
                db.add(img_rec)
                db.commit()
        except Exception as exc:
            print("Failed to save product image record:", exc)

    db.refresh(product)
    graph_service.sync_product(product)
    return product


@router.get("/products", response_model=list[ProductOut])
def list_all_products(
    craft: str | None = None,
    category: str | None = None,
    material: str | None = None,
    search: str | None = None,
    limit: int = 50,
    db: Session = Depends(get_db),
) -> list[Product]:
    query = select(Product)
    if craft:
        query = query.where(Product.craft.ilike(f"%{craft}%"))
    if category:
        query = query.where(Product.category.ilike(f"%{category}%"))
    if material:
        query = query.where(Product.material.ilike(f"%{material}%"))
    if search:
        query = query.where(
            (Product.name.ilike(f"%{search}%")) |
            (Product.description.ilike(f"%{search}%")) |
            (Product.craft.ilike(f"%{search}%"))
        )
    return list(db.scalars(query.order_by(Product.created_at.desc()).limit(limit)))


@router.get("/products/{product_id}", response_model=ProductOut)
def get_product(product_id: str, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    return product


@router.get("/artisans/{artisan_id}/products", response_model=list[ProductOut])
def list_products(artisan_id: str, db: Session = Depends(get_db)) -> list[Product]:
    if not db.get(Artisan, artisan_id):
        raise HTTPException(404, "Artisan not found")
    return list(db.scalars(select(Product).where(Product.artisan_id == artisan_id).order_by(Product.created_at.desc())))


@router.patch("/products/{product_id}", response_model=ProductOut)
def update_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    meta = dict(product.ai_metadata or {})
    for key, value in payload.model_dump(exclude_unset=True).items():
        if key in {"name_hi", "craft_hi", "material_hi", "category_hi", "description_hi"}:
            meta[key] = value
        elif hasattr(product, key):
            setattr(product, key, value)
    product.ai_metadata = meta
    product.embedding_text = f"{product.name} {product.craft} {product.material or ''} {product.description or ''}"
    db.commit()
    db.refresh(product)
    return product


@router.put("/products/{product_id}", response_model=ProductOut)
def put_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db)) -> Product:
    return update_product(product_id, payload, db)


@router.delete("/products/{product_id}", status_code=204)
def delete_product(product_id: str, db: Session = Depends(get_db)):
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    db.delete(product)
    db.commit()
    return None


@router.post("/products/refine-catalogue")
async def refine_catalogue(
    artisan_text: Annotated[str | None, Form()] = None,
    image: Annotated[UploadFile | None, File()] = None,
    image_url: Annotated[str | None, Form()] = None,
    language: Annotated[str | None, Form()] = None,
) -> dict:
    image_path = None
    if image:
        try:
            image_path = await storage.save_upload(image, "images/original")
        except Exception:
            image_path = None
    elif image_url:
        try:
            if image_url.startswith("data:image/"):
                header, encoded = image_url.split(",", 1)
                data = base64.b64decode(encoded)
                ext = ".png" if "png" in header else ".webp" if "webp" in header else ".jpg"
                target_dir = storage.root / "images/original"
                target_dir.mkdir(parents=True, exist_ok=True)
                target = target_dir / f"{uuid4().hex}{ext}"
                target.write_bytes(data)
                image_path = str(target)
            elif image_url.startswith("http://") or image_url.startswith("https://"):
                async with httpx.AsyncClient(timeout=10) as client:
                    resp = await client.get(image_url)
                    if resp.status_code == 200:
                        target_dir = storage.root / "images/original"
                        target_dir.mkdir(parents=True, exist_ok=True)
                        target = target_dir / f"{uuid4().hex}.jpg"
                        target.write_bytes(resp.content)
                        image_path = str(target)
        except Exception as exc:
            print("Failed to save image_url in refine_catalogue:", exc)
            image_path = None
    try:
        refined = await asyncio.to_thread(
            catalog_ai_service.refine_catalogue_with_llm,
            artisan_text,
            image_path,
            language or "hi",
        )
        return {"status": "success", "refined": refined}
    except Exception as exc:
        return {"status": "fallback", "error": str(exc), "refined": {}}


@router.post("/products/analyze", response_model=AnalysisOut, status_code=201)
async def analyze_product(
    artisan_id: Annotated[str, Form()],
    image: Annotated[UploadFile, File()],
    voice: Annotated[UploadFile | None, File()] = None,
    language: Annotated[str | None, Form()] = None,
    artisan_text: Annotated[str | None, Form()] = None,
    transcript_override: Annotated[str | None, Form()] = None,
    db: Session = Depends(get_db),
) -> dict:
    if not db.get(Artisan, artisan_id):
        raise HTTPException(404, "Artisan not found")
    try:
        image_path = await storage.save_upload(image, "images/original")
    except UploadTooLargeError as exc:
        raise HTTPException(413, str(exc)) from exc
    image_info = image_ai_service.inspect(image_path)
    if not image_info.get("valid"):
        raise HTTPException(422, "Invalid image: upload a readable image file")
    try:
        processing = image_ai_service.process(image_path, str(storage.root / "images/processed"))
    except ImageProcessingError as exc:
        raise HTTPException(422, str(exc)) from exc
    thumbnail_path = storage.create_thumbnail(image_path)
    processing["original_url"] = storage.public_url(image_path)
    processing["processed_url"] = storage.public_url(processing["processed_image"])
    processing["thumbnail_url"] = storage.public_url(thumbnail_path)
    try:
        audio_path = await storage.save_upload(voice, "audio") if voice else None
    except UploadTooLargeError as exc:
        raise HTTPException(413, str(exc)) from exc
    try:
        transcript_info = await speech_service.transcribe(audio_path, language, transcript_override)
    except (AIProviderUnavailable, AIProviderError, ValueError) as exc:
        transcript_info = {"text": "", "language": language or "unknown", "source": "unavailable", "mode": "UNAVAILABLE", "error": str(exc)}
    transcript = transcript_info.get("text", "")
    try:
        understanding = await asyncio.to_thread(
            catalog_ai_service.extract_product,
            transcript,
            processing["processed_image"],
            artisan_text,
            transcript_info.get("language") or language,
        )
    except (AIProviderUnavailable, AIProviderError) as exc:
        understanding = {"status": "unavailable", "fields": {}, "error": str(exc), "mode": "UNAVAILABLE"}
    fields = understanding.get("fields", {})
    product_name = _field_value(fields, "product_name") or "Unresolved AI draft — confirmation required"
    craft = _field_value(fields, "craft_type") or "Unspecified craft — confirmation required"
    material = _field_value(fields, "material")
    capacity = _field_value(fields, "production_capacity")
    lead_time = _field_value(fields, "lead_time")
    customization = _field_value(fields, "customization_available")
    capacity_value = _integer_or_none(capacity)
    lead_time_value = _integer_or_none(lead_time)
    if any(isinstance(value, dict) and value.get("value") is not None for value in fields.values()):
        try:
            catalogue = await asyncio.to_thread(
                catalog_ai_service.generate_catalogue,
                fields,
                transcript_info.get("language") or language,
            )
        except (AIProviderUnavailable, AIProviderError) as exc:
            catalogue = {"status": "unavailable", "error": str(exc), "english": {}, "hindi": {}, "mode": "UNAVAILABLE"}
    else:
        catalogue = {"status": "unavailable", "error": "No model-backed structured facts were produced", "english": {}, "hindi": {}, "mode": "UNAVAILABLE"}
    product_id = f"PROD_{uuid4().hex[:10]}"
    product = Product(
        id=product_id,
        artisan_id=artisan_id,
        name=product_name,
        craft=craft,
        category=_field_value(fields, "category"),
        material=material,
        monthly_capacity=capacity_value,
        production_time_days=lead_time_value,
        customization=customization if isinstance(customization, bool) else None,
        status="draft",
        ai_generated=True,
        ai_confirmed=False,
        ai_metadata={"transcript": transcript_info, "understanding": understanding, "catalogue": catalogue, "image_processing": processing},
        embedding_text=f"{product_name} {craft} {material or ''}",
    )
    db.add(product)
    db.add(ProductImage(
        id=new_id("IMG"), product_id=product_id, original_path=image_path, processed_path=processing["processed_image"],
        thumbnail_path=thumbnail_path, mime_type=image.content_type, width=image_info.get("width"), height=image_info.get("height"),
        quality_status="processed", processing_metadata=processing,
    ))
    if capacity_value is not None:
        hunar_service.upsert_capability(db, artisan_id, "monthly_capacity", capacity_value, "ai_inferred", "draft", _field_confidence(fields, "production_capacity"), product_id)
    db.commit()
    graph_service.sync_product(product)
    return {"product_id": product_id, "image": processing, "transcript": transcript_info, "understanding": understanding, "catalogue": catalogue, "draft_requires_confirmation": True}


@router.post("/products/{product_id}/confirm", response_model=ProductOut)
def confirm_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)
    product.ai_confirmed = True
    product.status = "confirmed"
    product.embedding_text = f"{product.name} {product.craft} {product.material or ''} {product.description or ''}"
    if product.monthly_capacity is not None:
        hunar_service.upsert_capability(db, product.artisan_id, "monthly_capacity", product.monthly_capacity, "artisan_confirmed", "self_declared", 0.72, product.id)
    db.commit()
    db.refresh(product)
    graph_service.sync_product(product)
    return product


@router.post("/products/{product_id}/generate-description", response_model=ProductOut)
def generate_description(product_id: str, db: Session = Depends(get_db)) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")
    try:
        generated = catalog_ai_service.generate_catalogue({
            "product_name": {"value": product.name, "source": "artisan_confirmed"},
            "craft_type": {"value": product.craft, "source": "artisan_confirmed"},
            "material": {"value": product.material, "source": "artisan_confirmed"},
            "customization_available": {"value": product.customization, "source": "artisan_confirmed"},
        }, "en")
    except (AIProviderUnavailable, AIProviderError) as exc:
        raise HTTPException(503, str(exc)) from exc
    english = generated.get("english", {})
    product.name = english.get("title") or product.name
    product.description = english.get("detailed_description") or product.description
    product.buyer_description = english.get("buyer_description") or product.buyer_description
    product.craft_story = english.get("craft_story") or product.craft_story
    product.keywords = english.get("keywords") or product.keywords
    product.ai_generated = True
    product.ai_confirmed = False
    product.ai_metadata = {**(product.ai_metadata or {}), "catalogue_generation": generated}
    db.commit()
    db.refresh(product)
    return product


def _field_value(fields: dict, name: str):
    value = fields.get(name, {}) if isinstance(fields, dict) else {}
    return value.get("value") if isinstance(value, dict) else None


def _field_confidence(fields: dict, name: str) -> float:
    value = fields.get(name, {}) if isinstance(fields, dict) else {}
    confidence = value.get("confidence") if isinstance(value, dict) else None
    return float(confidence) if isinstance(confidence, (int, float)) else 0.0


def _integer_or_none(value):
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float)):
        return int(value)
    if isinstance(value, str):
        try:
            return int(value.strip())
        except ValueError:
            return None
    return None
