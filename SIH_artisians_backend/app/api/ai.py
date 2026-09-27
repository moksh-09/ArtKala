from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.database import get_db
from app.config import get_settings
from app.services.ai_provider import AIProviderError, AIProviderUnavailable
from app.services.catalog_ai_service import catalog_ai_service
from app.services.image_ai_service import ImageProcessingError, image_ai_service
from app.services.speech_service import speech_service
from app.services.storage_service import LocalStorage, UploadTooLargeError
from app.services.translation_service import translation_service

router = APIRouter(prefix="/ai", tags=["ai"])
storage = LocalStorage()


@router.post("/image-enhance")
async def enhance_image(image: Annotated[UploadFile, File()]) -> dict:
    try:
        original_path = await storage.save_upload(image, "images/original")
    except UploadTooLargeError as exc:
        raise HTTPException(413, str(exc)) from exc
    inspected = image_ai_service.inspect(original_path)
    if not inspected.get("valid"):
        raise HTTPException(422, "Invalid image")
    try:
        processed = image_ai_service.process(original_path, str(storage.root / "images/processed"))
    except ImageProcessingError as exc:
        raise HTTPException(422, str(exc)) from exc
    processed["thumbnail_image"] = storage.create_thumbnail(original_path)
    processed["original_url"] = storage.public_url(original_path)
    processed["processed_url"] = storage.public_url(processed["processed_image"])
    processed["thumbnail_url"] = storage.public_url(processed["thumbnail_image"])
    return processed


@router.post("/transcribe")
async def transcribe(
    audio: Annotated[UploadFile | None, File()] = None,
    language: Annotated[str | None, Form()] = None,
    transcript_override: Annotated[str | None, Form()] = None,
) -> dict:
    try:
        path = await storage.save_upload(audio, "audio") if audio else None
    except UploadTooLargeError as exc:
        raise HTTPException(413, str(exc)) from exc
    try:
        return await speech_service.transcribe(path, language, transcript_override)
    except (AIProviderUnavailable, AIProviderError, ValueError) as exc:
        raise HTTPException(503, str(exc)) from exc


@router.post("/translate")
def translate(text: str = Form(...), source_language: str = Form(""), target_language: str = Form("en")) -> dict:
    try:
        return {"source_text": text, **translation_service.translate(text, source_language or None, target_language)}
    except (AIProviderUnavailable, AIProviderError, ValueError) as exc:
        raise HTTPException(503, str(exc)) from exc


@router.post("/extract-product")
def extract_product(text: str = Form(...)) -> dict:
    try:
        return catalog_ai_service.extract_product(text)
    except (AIProviderUnavailable, AIProviderError) as exc:
        raise HTTPException(503, str(exc)) from exc


@router.post("/generate-description")
def generate_description(name: str = Form(...), craft: str = Form(...), material: str = Form(""), customization: bool = Form(False)) -> dict:
    try:
        return catalog_ai_service.generate_catalogue({"product_name": {"value": name, "source": "artisan_confirmed"}, "craft_type": {"value": craft, "source": "artisan_confirmed"}, "material": {"value": material, "source": "artisan_confirmed"}, "customization_available": {"value": customization, "source": "artisan_confirmed"}}, "en")
    except (AIProviderUnavailable, AIProviderError) as exc:
        raise HTTPException(503, str(exc)) from exc


@router.get("/status")
def ai_status() -> dict:
    settings = get_settings()
    return {
        "asr": "LOCAL" if settings.enable_local_whisper else "FREE_API_OR_HOSTED" if settings.openai_api_key else "UNAVAILABLE",
        "translation": "LOCAL" if settings.enable_local_translation else "FREE_API_OR_HOSTED" if settings.openai_api_key else "UNAVAILABLE",
        "catalogue": "OLLAMA_LOCAL" if settings.enable_ollama else "FREE_API_OR_HOSTED" if settings.openai_api_key else "UNAVAILABLE",
        "image_processing": "LOCAL_OPENCV",
        "pricing": "LOCAL_BENCHMARK_MODEL",
        "demo_override_enabled": settings.allow_demo_ai_overrides,
    }
