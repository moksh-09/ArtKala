from __future__ import annotations

import base64
import json
from pathlib import Path
from typing import Any

import httpx

from app.config import get_settings
from app.services.ai_provider import AIProviderError, AIProviderUnavailable
from app.services.translation_service import translation_service


FIELDS = [
    "product_name", "craft_type", "category", "material", "dimensions", "colour", "shape", "technique",
    "intended_use", "customization_available", "branding_available", "production_capacity", "lead_time",
]


class CatalogAIService:
    def extract_product(self, transcript: str, image_path: str | None = None, artisan_text: str | None = None, language: str | None = None) -> dict[str, Any]:
        prompt = self._extraction_prompt(transcript, artisan_text, language)
        settings = get_settings()
        if settings.openai_api_key:
            raw = self._openai_json(prompt, image_path)
            return self._normalize(raw, provider="openai_vision")
        if settings.enable_ollama:
            raw = self._ollama_json(prompt, image_path)
            return self._normalize(raw, provider=f"ollama:{settings.ollama_model}")
        raise AIProviderUnavailable("No multimodal catalog provider configured. Enable Ollama or configure an OpenAI-compatible vision model.")

    def refine_catalogue_with_llm(
        self,
        voice_or_text: str,
        image_path: str | None = None,
        language: str | None = "hi",
    ) -> dict[str, Any]:
        settings = get_settings()
        prompt = (
            "You are an expert evaluator and cataloger for authentic traditional Indian handicrafts and artisan craft products. "
            "Analyze the attached craft product image and any provided artisan voice/text notes.\n"
            "Carefully check if the item depicted in the image is a genuine handcrafted artisan product "
            "(e.g. terracotta pottery, bamboo & cane weaving, handloom textile, wood carving, dhokra/bell metal, stone craft, etc.).\n"
            "If the item is clearly NOT an artisan craft item (such as an electronic laptop, computer, smartphone, automobile, industrial machinery, or mass-produced generic gadget), "
            'return JSON exactly as: {"unidentified": true, "error": "Not a recognized handcrafted artisan craft item"}.\n'
            "If it IS an artisan craft product (or if notes describe an artisan craft), return JSON with keys:\n"
            "- product_name: Descriptive title in English (e.g. 'Hand-carved Terracotta Decorative Urn')\n"
            "- product_name_hi: Authentic descriptive title in Hindi Devanagari script\n"
            "- craft: Specific craft tradition (e.g. 'Terracotta Pottery', 'Bamboo & Cane Weaving', 'Handloom Weaving', 'Wood Carving', 'Dhokra Metal Casting')\n"
            "- craft_hi: Craft tradition in Hindi\n"
            "- material: Natural authentic materials used (e.g. 'Natural River Clay & Mineral Pigments', 'Seasoned Bamboo & Cane', 'Pure Cotton & Silk')\n"
            "- material_hi: Materials in Hindi\n"
            "- category: Primary product category (e.g. 'Home & Living', 'Kitchenware', 'Apparel & Textiles', 'Wall Decor')\n"
            "- monthly_capacity: Estimated realistic monthly capacity integer greater than 0 (e.g. 50-300)\n"
            "- production_time_days: Realistic production lead time days integer greater than 0 (e.g. 7-21)\n"
            "- price: Estimated fair selling price in INR as integer greater than 0 (e.g. 350-2500)\n"
            "- description: Genuine descriptive paragraph in English (at least 20 words describing the handmade technique, material authenticity, aesthetic, and functional use)\n"
            "- description_hi: Authentic descriptive paragraph in Hindi Devanagari script\n"
            f"Artisan notes: {voice_or_text or '[No voice or text input provided. Extract and synthesize craft details directly from the uploaded image]'}\n"
            f"Language target: {language or 'hi'}"
        )
        if settings.openai_api_key:
            return self._openai_json(prompt, image_path)
        if settings.enable_ollama:
            return self._ollama_json(prompt, image_path)
        raise AIProviderUnavailable("No LLM configured for catalog refinement")

    def generate_catalogue(self, facts: dict[str, Any], source_language: str | None) -> dict[str, Any]:
        settings = get_settings()
        prompt = (
            "Create a professional but factual artisan product catalogue draft from the supplied structured facts. "
            "Do not add facts absent from the input. Return JSON with title, short_description, detailed_description, "
            "craft_story, buyer_description, keywords. Mark uncertainty in wording when a fact is uncertain.\n"
            f"FACTS:\n{json.dumps(facts, ensure_ascii=False)}"
        )
        if settings.openai_api_key:
            raw = self._openai_json(prompt, None)
            english = self._catalogue_shape(raw)
            provider = "openai_text"
        elif settings.enable_ollama:
            raw = self._ollama_json(prompt, None)
            english = self._catalogue_shape(raw)
            provider = f"ollama:{settings.ollama_model}"
        else:
            raise AIProviderUnavailable("No catalogue generation model configured")
        hindi: dict[str, Any] = {}
        translation_errors: list[str] = []
        for field in ["title", "short_description", "detailed_description", "craft_story", "buyer_description"]:
            try:
                hindi[field] = translation_service.translate(str(english[field]), "en", "hi")["text"]
            except Exception as exc:
                translation_errors.append(f"{field}: {exc}")
        if translation_errors:
            hindi = {"status": "unavailable", "errors": translation_errors}
        return {"english": english, "hindi": hindi, "provider": provider, "translation_status": "complete" if hindi and hindi.get("status") != "unavailable" else "unavailable", "source_language": source_language}

    @staticmethod
    def _extraction_prompt(transcript: str, artisan_text: str | None, language: str | None) -> str:
        return (
            "Analyze the image and user inputs to extract an artisan craft product draft. "
            "Observe the object in the image carefully: identify its craft type (e.g. Bamboo & Cane Craft, "
            "Terracotta Pottery, Handloom & Textiles, Wood Carving, Dhokra Metalwork, etc.), "
            "observable materials (e.g. natural bamboo/cane, river clay, silk/cotton, solid wood, bell metal/brass), "
            "colors, shape, dimensions, and craft technique. "
            "If the image clearly depicts a traditional craft, populate product_name, craft_type, category, material, "
            "colour, shape, and technique with source 'vision_observed' or 'ai_inferred'. "
            "If voice/text is provided, incorporate those artisan facts as well. "
            "If the image depicts a modern electronic device, laptop, gadget, car, or non-craft item, set product_name to null and craft_type to null.\n"
            f"VOICE LANGUAGE: {language or 'unknown'}\nVOICE TRANSCRIPT:\n{transcript or '[none]'}\n"
            f"ARTISAN TEXT:\n{artisan_text or '[none]'}\nFIELDS: {', '.join(FIELDS)}"
        )

    @staticmethod
    def _openai_json(prompt: str, image_path: str | None) -> dict[str, Any]:
        try:
            from openai import OpenAI

            settings = get_settings()
            kwargs: dict[str, Any] = {"api_key": settings.openai_api_key}
            if settings.openai_base_url:
                kwargs["base_url"] = settings.openai_base_url
            client = OpenAI(**kwargs)
            content: list[dict[str, Any]] = [{"type": "text", "text": prompt}]
            if image_path:
                encoded = base64.b64encode(Path(image_path).read_bytes()).decode("ascii")
                content.append({"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{encoded}"}})
            response = client.chat.completions.create(model=settings.openai_model, temperature=0, response_format={"type": "json_object"}, messages=[{"role": "user", "content": content}])
            return json.loads(response.choices[0].message.content or "{}")
        except json.JSONDecodeError as exc:
            raise AIProviderError("Vision/catalogue provider returned malformed JSON") from exc
        except Exception as exc:
            raise AIProviderError(f"Vision/catalogue provider failed: {exc}") from exc

    @staticmethod
    def _ollama_json(prompt: str, image_path: str | None) -> dict[str, Any]:
        settings = get_settings()
        if image_path:
            try:
                with httpx.Client(timeout=15) as client:
                    metadata_response = client.post(
                        f"{settings.ollama_base_url.rstrip('/')}/api/show",
                        json={"name": settings.ollama_model},
                    )
                    metadata_response.raise_for_status()
                    capabilities = metadata_response.json().get("capabilities", [])
            except Exception as exc:
                raise AIProviderUnavailable(f"Ollama model capability check failed: {exc}") from exc
            if "vision" not in capabilities:
                raise AIProviderUnavailable(
                    f"Configured Ollama model {settings.ollama_model!r} does not advertise vision capability; "
                    "configure a vision model for image-aware product analysis."
                )
        message: dict[str, Any] = {"role": "user", "content": prompt}
        if image_path:
            message["images"] = [base64.b64encode(Path(image_path).read_bytes()).decode("ascii")]
        try:
            with httpx.Client(timeout=180) as client:
                response = client.post(f"{settings.ollama_base_url.rstrip('/')}/api/chat", json={"model": settings.ollama_model, "messages": [message], "stream": False, "format": "json"})
                response.raise_for_status()
                data = response.json()
            return json.loads(data.get("message", {}).get("content", "{}"))
        except json.JSONDecodeError as exc:
            raise AIProviderError("Ollama returned malformed JSON") from exc
        except Exception as exc:
            raise AIProviderError(f"Ollama provider failed: {exc}") from exc

    @staticmethod
    def _normalize(raw: dict[str, Any], provider: str) -> dict[str, Any]:
        normalized: dict[str, Any] = {"provider": provider, "status": "draft", "fields": {}}
        alias_map = {
            "craft_type": ["craft_type", "craft", "craft_hi"],
            "product_name": ["product_name", "title", "name", "product_name_hi"],
            "production_capacity": ["production_capacity", "monthly_capacity", "capacity"],
            "lead_time": ["lead_time", "production_time_days"],
        }
        for field in FIELDS:
            value = raw.get(field)
            if value is None and field in alias_map:
                for alt in alias_map[field]:
                    if raw.get(alt) is not None:
                        value = raw.get(alt)
                        break
            if isinstance(value, dict):
                normalized["fields"][field] = {
                    "value": value.get("value"),
                    "source": value.get("source") or "ai_inferred",
                    "confidence": value.get("confidence") or 0.9,
                    "evidence": value.get("evidence") or "llm_multimodal",
                    "verification_status": "draft",
                }
            elif value is None:
                normalized["fields"][field] = {"value": None, "source": None, "confidence": None, "evidence": None, "verification_status": "draft"}
            else:
                normalized["fields"][field] = {"value": value, "source": "ai_inferred", "confidence": 0.9, "evidence": "llm_multimodal", "verification_status": "draft"}
        return normalized

    @staticmethod
    def _catalogue_shape(raw: dict[str, Any]) -> dict[str, Any]:
        return {
            "title": str(raw.get("title") or ""),
            "short_description": str(raw.get("short_description") or ""),
            "detailed_description": str(raw.get("detailed_description") or ""),
            "craft_story": str(raw.get("craft_story") or ""),
            "buyer_description": str(raw.get("buyer_description") or ""),
            "keywords": raw.get("keywords") if isinstance(raw.get("keywords"), list) else [],
        }


catalog_ai_service = CatalogAIService()
