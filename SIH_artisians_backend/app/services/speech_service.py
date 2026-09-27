from __future__ import annotations

from pathlib import Path
from typing import Any

from app.config import get_settings
from app.services.ai_provider import AIProviderError, AIProviderUnavailable


class SpeechService:
    """ASR adapters with real local faster-whisper and optional hosted fallback."""

    _whisper_model: Any = None

    async def transcribe(
        self,
        audio_path: str | None,
        language: str | None = None,
        transcript_override: str | None = None,
    ) -> dict[str, Any]:
        settings = get_settings()
        if transcript_override and transcript_override.strip():
            if not settings.allow_demo_ai_overrides:
                raise AIProviderError("transcript_override is disabled; use a real audio recording")
            return {"text": transcript_override.strip(), "language": language or "unknown", "source": "demo_override", "confidence": None, "mode": "DEMO"}
        if not audio_path or not Path(audio_path).exists() or Path(audio_path).stat().st_size == 0:
            raise ValueError("A non-empty audio input is required")
        if settings.enable_local_whisper:
            return self._transcribe_local(audio_path, language)
        if settings.openai_api_key:
            return self._transcribe_openai(audio_path, language)
        raise AIProviderUnavailable("No ASR provider configured. Enable local faster-whisper or configure an OpenAI-compatible API.")

    def _transcribe_local(self, audio_path: str, language: str | None) -> dict[str, Any]:
        try:
            from faster_whisper import WhisperModel
        except ImportError as exc:
            raise AIProviderUnavailable("faster-whisper is not installed; install the ai extra") from exc
        try:
            if self._whisper_model is None:
                settings = get_settings()
                self._whisper_model = WhisperModel(settings.whisper_model, device=settings.whisper_device, compute_type=settings.whisper_compute_type)
            segments, info = self._whisper_model.transcribe(audio_path, language=language, vad_filter=True)
            segments = list(segments)
            text = " ".join(segment.text.strip() for segment in segments).strip()
            if not text:
                raise AIProviderError("ASR completed but produced an empty transcript")
            probabilities = [float(segment.avg_logprob) for segment in segments if getattr(segment, "avg_logprob", None) is not None]
            return {
                "text": text,
                "language": getattr(info, "language", None) or language or "unknown",
                "language_probability": getattr(info, "language_probability", None),
                "source": "faster_whisper",
                "confidence": self._logprob_confidence(probabilities),
                "mode": "LOCAL",
            }
        except AIProviderError:
            raise
        except Exception as exc:
            raise AIProviderError(f"Local ASR failed: {exc}") from exc

    @staticmethod
    def _transcribe_openai(audio_path: str, language: str | None) -> dict[str, Any]:
        try:
            from openai import OpenAI

            settings = get_settings()
            kwargs: dict[str, Any] = {"api_key": settings.openai_api_key}
            if settings.openai_base_url:
                kwargs["base_url"] = settings.openai_base_url
            client = OpenAI(**kwargs)
            with open(audio_path, "rb") as audio_file:
                result = client.audio.transcriptions.create(model=settings.openai_transcription_model, file=audio_file, language=language)
            text = (getattr(result, "text", "") or "").strip()
            if not text:
                raise AIProviderError("Hosted ASR returned an empty transcript")
            return {"text": text, "language": language or "unknown", "source": "openai_compatible_asr", "confidence": None, "mode": "FREE_API_OR_HOSTED"}
        except AIProviderError:
            raise
        except Exception as exc:
            raise AIProviderError(f"Hosted ASR failed: {exc}") from exc

    @staticmethod
    def _logprob_confidence(values: list[float]) -> float | None:
        if not values:
            return None
        # Normalized from Whisper segment log-probability; it is a model
        # diagnostic, not a fabricated claim about factual correctness.
        mean = sum(values) / len(values)
        return round(max(0.0, min(1.0, (mean + 5.0) / 5.0)), 4)


speech_service = SpeechService()

