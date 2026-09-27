from __future__ import annotations

from typing import Any

from app.config import get_settings
from app.services.ai_provider import AIProviderError, AIProviderUnavailable


LANGUAGE_CODES = {
    "en": "eng_Latn", "english": "eng_Latn",
    "hi": "hin_Deva", "hindi": "hin_Deva",
    "mr": "mar_Deva", "marathi": "mar_Deva",
    "bn": "ben_Beng", "bengali": "ben_Beng",
    "gu": "guj_Gujr", "gujarati": "guj_Gujr",
    "kn": "kan_Knda", "kannada": "kan_Knda",
    "ml": "mal_Mlym", "malayalam": "mal_Mlym",
    "or": "ory_Orya", "odia": "ory_Orya",
    "pa": "pan_Guru", "punjabi": "pan_Guru",
    "ta": "tam_Taml", "tamil": "tam_Taml",
    "te": "tel_Telu", "telugu": "tel_Telu",
}


class TranslationService:
    _tokenizer: Any = None
    _model: Any = None

    def translate(self, text: str, source_language: str | None, target_language: str) -> dict[str, Any]:
        if not text.strip():
            raise ValueError("Text to translate cannot be empty")
        source = LANGUAGE_CODES.get((source_language or "").lower())
        target = LANGUAGE_CODES.get(target_language.lower(), target_language)
        if source and source == target:
            return {"text": text, "source_language": source_language, "target_language": target_language, "provider": "identity", "confidence": 1.0, "mode": "LOCAL"}
        settings = get_settings()
        if settings.enable_local_translation:
            return self._translate_nllb(text, source, target, source_language, target_language)
        if settings.openai_api_key:
            return self._translate_openai(text, source_language, target_language)
        raise AIProviderUnavailable("No translation provider configured. Enable local NLLB or configure an OpenAI-compatible API.")

    def _translate_nllb(self, text: str, source: str | None, target: str, source_language: str | None, target_language: str) -> dict[str, Any]:
        if not source:
            raise AIProviderError("NLLB requires a supported source language or manual language selection")
        try:
            import torch
            from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

            settings = get_settings()
            if self._tokenizer is None or self._model is None:
                self._tokenizer = AutoTokenizer.from_pretrained(settings.translation_model, src_lang=source)
                self._model = AutoModelForSeq2SeqLM.from_pretrained(settings.translation_model)
                self._model.to(settings.translation_device)
            self._tokenizer.src_lang = source
            inputs = self._tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
            inputs = {key: value.to(settings.translation_device) for key, value in inputs.items()}
            forced_bos_token_id = self._tokenizer.convert_tokens_to_ids(target)
            with torch.no_grad():
                generated = self._model.generate(**inputs, forced_bos_token_id=forced_bos_token_id, max_length=512)
            translated = self._tokenizer.batch_decode(generated, skip_special_tokens=True)[0].strip()
            if not translated:
                raise AIProviderError("NLLB returned an empty translation")
            return {"text": translated, "source_language": source_language, "target_language": target_language, "provider": "nllb", "confidence": None, "mode": "LOCAL"}
        except (ImportError, OSError, RuntimeError, ValueError) as exc:
            raise AIProviderError(f"Local NLLB translation failed: {exc}") from exc

    @staticmethod
    def _translate_openai(text: str, source_language: str | None, target_language: str) -> dict[str, Any]:
        try:
            from openai import OpenAI

            settings = get_settings()
            kwargs: dict[str, Any] = {"api_key": settings.openai_api_key}
            if settings.openai_base_url:
                kwargs["base_url"] = settings.openai_base_url
            client = OpenAI(**kwargs)
            result = client.chat.completions.create(
                model=settings.openai_model,
                temperature=0,
                messages=[
                    {"role": "system", "content": "Translate faithfully. Preserve product facts, quantities, units, uncertainty, names, and culturally specific terms. Return only the translation."},
                    {"role": "user", "content": f"Source language: {source_language or 'unknown'}\nTarget language: {target_language}\n\n{text}"},
                ],
            )
            translated = (result.choices[0].message.content or "").strip()
            if not translated:
                raise AIProviderError("Hosted translation returned an empty result")
            return {"text": translated, "source_language": source_language, "target_language": target_language, "provider": "openai_compatible", "confidence": None, "mode": "FREE_API_OR_HOSTED"}
        except AIProviderError:
            raise
        except Exception as exc:
            raise AIProviderError(f"Hosted translation failed: {exc}") from exc


translation_service = TranslationService()

