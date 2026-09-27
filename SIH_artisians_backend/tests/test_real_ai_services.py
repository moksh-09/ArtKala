from pathlib import Path

import pytest
from PIL import Image, ImageDraw

from app.config import get_settings
from app.services.ai_provider import AIProviderUnavailable
from app.services.catalog_ai_service import catalog_ai_service
from app.services.graph_service import graph_service
from app.services.image_ai_service import image_ai_service
from app.services.pricing_service import pricing_service
from app.services.speech_service import speech_service


def test_image_pipeline_preserves_original_and_writes_changed_output(tmp_path: Path):
    original = tmp_path / "artisan.png"
    image = Image.new("RGB", (640, 480), (30, 30, 30))
    ImageDraw.Draw(image).rectangle((180, 80, 460, 390), fill=(160, 100, 40))
    image.save(original)
    original_bytes = original.read_bytes()

    result = image_ai_service.process(str(original), str(tmp_path / "processed"))

    assert original.read_bytes() == original_bytes
    assert Path(result["processed_image"]).exists()
    assert Path(result["processed_image"]).read_bytes() != original_bytes
    assert "exposure_correction" in result["operations"]
    assert result["quality_before"]["width"] == 640
    assert result["quality_after"]["width"] == 1200


def test_pricing_changes_with_actual_cost_inputs():
    common = {
        "product": "Bamboo Basket", "craft": "Bamboo Craft", "material": "Bamboo", "category": "Home and utility",
        "labour_hours": 2, "labour_rate": 150, "packaging_cost": 20, "other_production_cost": 0,
        "logistics_cost": 30, "desired_margin_percent": 20,
    }
    low = pricing_service.estimate({**common, "raw_material_cost": 100})
    high = pricing_service.estimate({**common, "raw_material_cost": 250})
    assert high["cost_floor"] > low["cost_floor"]
    assert high["recommended_range"][0] > low["recommended_range"][0]
    assert low["market_data"]["dataset_status"] == "BENCHMARK_DEMO"


def test_missing_real_catalog_provider_is_not_disguised_as_ai(monkeypatch):
    settings = get_settings()
    previous_key, previous_ollama = settings.openai_api_key, settings.enable_ollama
    settings.openai_api_key = None
    settings.enable_ollama = False
    try:
        with pytest.raises(AIProviderUnavailable):
            catalog_ai_service.extract_product("arbitrary artisan voice", None)
    finally:
        settings.openai_api_key = previous_key
        settings.enable_ollama = previous_ollama


def test_asr_missing_audio_is_rejected():
    import asyncio

    with pytest.raises(ValueError):
        asyncio.run(speech_service.transcribe(None))


def test_graph_unavailable_returns_relational_fallback():
    settings = get_settings()
    previous = settings.graph_enabled
    settings.graph_enabled = False
    try:
        status = graph_service.status()
        assert status["graph_available"] is False
        assert status["fallback"] == "relational"
    finally:
        settings.graph_enabled = previous

