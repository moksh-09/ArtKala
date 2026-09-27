from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from PIL import Image

from app.config import get_settings


class UploadTooLargeError(ValueError):
    pass


class LocalStorage:
    def __init__(self) -> None:
        self.root = Path(get_settings().storage_dir)
        self.root.mkdir(parents=True, exist_ok=True)

    async def save_upload(self, upload: UploadFile, folder: str) -> str:
        target_dir = self.root / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        suffix = Path(upload.filename or "upload.bin").suffix.lower()
        target = target_dir / f"{uuid4().hex}{suffix}"
        maximum = get_settings().max_upload_mb * 1024 * 1024
        written = 0
        with target.open("wb") as output:
            while chunk := await upload.read(1024 * 1024):
                written += len(chunk)
                if written > maximum:
                    target.unlink(missing_ok=True)
                    await upload.close()
                    raise UploadTooLargeError(f"Upload exceeds MAX_UPLOAD_MB={get_settings().max_upload_mb}")
                output.write(chunk)
        await upload.close()
        return str(target)

    def create_thumbnail(self, original_path: str, folder: str = "images/thumbnails") -> str | None:
        target_dir = self.root / folder
        target_dir.mkdir(parents=True, exist_ok=True)
        target = target_dir / f"{Path(original_path).stem}_thumb.jpg"
        try:
            with Image.open(original_path) as image:
                image.thumbnail((800, 800))
                image.convert("RGB").save(target, format="JPEG", quality=85, optimize=True)
            return str(target)
        except (OSError, ValueError):
            return None

    def public_url(self, path: str | None) -> str | None:
        if not path:
            return None
        try:
            relative = Path(path).resolve().relative_to(self.root.resolve())
        except ValueError:
            return None
        return "/storage/" + relative.as_posix()
