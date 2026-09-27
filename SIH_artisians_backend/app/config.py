from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "ARTISAN Backend"
    environment: str = "development"
    database_url: str = "sqlite:///./artisan.db"
    auto_create_tables: bool = True
    storage_dir: str = "storage"
    max_upload_mb: int = 15
    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"
    openai_transcription_model: str = "whisper-1"
    openai_base_url: str | None = None
    enable_local_whisper: bool = False
    whisper_model: str = "small"
    whisper_device: str = "cpu"
    whisper_compute_type: str = "int8"
    enable_local_translation: bool = False
    translation_model: str = "facebook/nllb-200-distilled-600M"
    translation_device: str = "cpu"
    enable_ollama: bool = False
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "gemma3:4b"
    image_background_method: str = "auto"
    enable_rembg: bool = False
    allow_demo_ai_overrides: bool = False
    graph_enabled: bool = False
    graph_sync_on_write: bool = True
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_username: str = "neo4j"
    neo4j_password: str = "artisan_graph"
    neo4j_database: str = "neo4j"
    market_benchmark_path: str = "data/market_benchmarks.json"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
