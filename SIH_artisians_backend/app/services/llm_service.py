"""Compatibility façade for text tasks; all results come from a real model provider."""

from __future__ import annotations

from typing import Any

from app.config import get_settings
from app.services.ai_provider import AIProviderUnavailable
from app.services.catalog_ai_service import catalog_ai_service


class LLMService:
    def extract_product(self, transcript: str, vision: dict[str, Any] | None = None) -> dict[str, Any]:
        return catalog_ai_service.extract_product(transcript, None, None, None)

    def generate_catalogue(self, product: dict[str, Any], source_language: str | None = "en") -> dict[str, Any]:
        return catalog_ai_service.generate_catalogue(product, source_language)

    def extract_requirement(self, text: str) -> dict[str, Any]:
        prompt = (
            "Extract only explicit buyer requirements from the text. Return JSON with product, craft, quantity, "
            "deadline_days, max_price, customization, branding, quality_threshold, location. Use null for absent values. "
            "Do not guess.\n" + text
        )
        settings = get_settings()
        if settings.openai_api_key:
            raw = catalog_ai_service._openai_json(prompt, None)
        elif settings.enable_ollama:
            raw = catalog_ai_service._ollama_json(prompt, None)
        else:
            raise AIProviderUnavailable("No requirement extraction model configured")
        return {key: raw.get(key) for key in ["product", "craft", "quantity", "deadline_days", "max_price", "customization", "branding", "quality_threshold", "location"]}


llm_service = LLMService()
