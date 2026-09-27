"""Local image enhancement and segmentation pipeline.

The pipeline always preserves the original file. Every returned metric is
computed from the input/output pixels; no synthetic quality score is created.
"""

from __future__ import annotations

import time
from pathlib import Path
from typing import Any

import cv2
import numpy as np
from PIL import Image, UnidentifiedImageError

from app.config import get_settings


class ImageProcessingError(ValueError):
    pass


class ImageAIService:
    output_size = 1200

    def inspect(self, image_path: str) -> dict[str, Any]:
        started = time.perf_counter()
        image = cv2.imread(image_path, cv2.IMREAD_COLOR)
        if image is None:
            try:
                with Image.open(image_path) as pil_image:
                    return {"valid": False, "quality_status": "invalid", "error": "Unsupported or corrupt image"}
            except (UnidentifiedImageError, OSError) as exc:
                return {"valid": False, "quality_status": "invalid", "error": str(exc)}
        return {"valid": True, **self._quality_metrics(image), "processing_time_ms": round((time.perf_counter() - started) * 1000, 2), "source": "opencv_measurement"}

    def process(self, original_path: str, output_dir: str) -> dict[str, Any]:
        started = time.perf_counter()
        image = cv2.imread(original_path, cv2.IMREAD_COLOR)
        if image is None:
            raise ImageProcessingError("Image could not be decoded")
        before = self._quality_metrics(image)
        operations: list[str] = []
        mask, background_method = self._segment_foreground(image)
        background_removed = mask is not None
        if mask is not None:
            image = self._composite_neutral_background(image, mask)
            operations.append("foreground_segmentation_and_neutral_background")
        image = self._correct_white_balance(image)
        operations.append("gray_world_white_balance")
        image = self._correct_exposure(image)
        operations.append("exposure_correction")
        image = self._improve_contrast(image)
        operations.append("lab_clahe_contrast_enhancement")
        image = self._center_crop(image, mask)
        operations.append("center_crop")
        image = cv2.resize(image, (self.output_size, self.output_size), interpolation=cv2.INTER_AREA)
        operations.append("1200x1200_ecommerce_normalization")
        target_dir = Path(output_dir)
        target_dir.mkdir(parents=True, exist_ok=True)
        target_path = target_dir / f"{Path(original_path).stem}_enhanced.jpg"
        if not cv2.imwrite(str(target_path), image, [int(cv2.IMWRITE_JPEG_QUALITY), 92]):
            raise ImageProcessingError("Processed image could not be written")
        after_image = cv2.imread(str(target_path), cv2.IMREAD_COLOR)
        if after_image is None:
            raise ImageProcessingError("Processed image could not be reopened")
        return {
            "original_image": original_path,
            "processed_image": str(target_path),
            "background_removed": background_removed,
            "background_method": background_method,
            "quality_before": before,
            "quality_after": self._quality_metrics(after_image),
            "operations": operations,
            "processing_time_ms": round((time.perf_counter() - started) * 1000, 2),
            "source": "local_opencv_pipeline",
        }

    def _segment_foreground(self, image: np.ndarray) -> tuple[np.ndarray | None, str]:
        settings = get_settings()
        if settings.enable_rembg or settings.image_background_method in {"rembg", "auto"}:
            try:
                from rembg import remove

                rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                result = remove(rgb)
                if isinstance(result, Image.Image):
                    rgba = np.array(result.convert("RGBA"))
                else:
                    rgba = np.asarray(result)
                if rgba.ndim == 3 and rgba.shape[2] == 4:
                    alpha = rgba[:, :, 3]
                    if int(np.count_nonzero(alpha > 0)) > int(image.shape[0] * image.shape[1] * 0.01):
                        return cv2.resize(alpha, (image.shape[1], image.shape[0]), interpolation=cv2.INTER_NEAREST), "rembg_u2net"
            except (ImportError, OSError, RuntimeError, ValueError):
                if settings.image_background_method == "rembg":
                    return None, "not_applied"
        if settings.image_background_method in {"opencv", "auto"}:
            mask = self._grabcut_mask(image)
            return mask, "opencv_grabcut" if mask is not None else "not_applied"
        return None, "not_applied"

    @staticmethod
    def _grabcut_mask(image: np.ndarray) -> np.ndarray | None:
        height, width = image.shape[:2]
        if width < 40 or height < 40:
            return None
        mask = np.zeros((height, width), np.uint8)
        margin_x, margin_y = max(2, width // 20), max(2, height // 20)
        rectangle = (margin_x, margin_y, width - (2 * margin_x), height - (2 * margin_y))
        bgd_model = np.zeros((1, 65), np.float64)
        fgd_model = np.zeros((1, 65), np.float64)
        try:
            cv2.grabCut(image, mask, rectangle, bgd_model, fgd_model, 3, cv2.GC_INIT_WITH_RECT)
            foreground = np.where((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)
            foreground = cv2.morphologyEx(foreground, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
            coverage = float(np.count_nonzero(foreground)) / float(width * height)
            return foreground if 0.01 < coverage < 0.98 else None
        except cv2.error:
            return None

    @staticmethod
    def _composite_neutral_background(image: np.ndarray, mask: np.ndarray) -> np.ndarray:
        alpha = cv2.GaussianBlur(mask, (0, 0), 1.5).astype(np.float32) / 255.0
        background = np.full_like(image, 248)
        return (image.astype(np.float32) * alpha[:, :, None] + background.astype(np.float32) * (1 - alpha[:, :, None])).astype(np.uint8)

    @staticmethod
    def _correct_white_balance(image: np.ndarray) -> np.ndarray:
        image_float = image.astype(np.float32)
        means = image_float.reshape(-1, 3).mean(axis=0)
        gray = float(means.mean())
        scale = np.divide(gray, means, out=np.ones_like(means), where=means > 1)
        return np.clip(image_float * scale, 0, 255).astype(np.uint8)

    @staticmethod
    def _correct_exposure(image: np.ndarray) -> np.ndarray:
        grayscale = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        mean = max(float(grayscale.mean()), 1.0)
        target = 128.0
        gamma = float(np.clip(np.log(target / 255.0) / np.log(mean / 255.0), 0.65, 1.45)) if mean < 254 else 1.0
        lookup = np.array([((index / 255.0) ** gamma) * 255 for index in range(256)]).astype(np.uint8)
        return cv2.LUT(image, lookup)

    @staticmethod
    def _improve_contrast(image: np.ndarray) -> np.ndarray:
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
        lightness, a_channel, b_channel = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        return cv2.cvtColor(cv2.merge((clahe.apply(lightness), a_channel, b_channel)), cv2.COLOR_LAB2BGR)

    @staticmethod
    def _center_crop(image: np.ndarray, mask: np.ndarray | None) -> np.ndarray:
        height, width = image.shape[:2]
        if mask is not None and np.count_nonzero(mask) > 0:
            ys, xs = np.where(mask > 20)
            x1, x2, y1, y2 = int(xs.min()), int(xs.max()), int(ys.min()), int(ys.max())
            padding_x, padding_y = max(8, int((x2 - x1) * 0.12)), max(8, int((y2 - y1) * 0.12))
            x1, x2 = max(0, x1 - padding_x), min(width, x2 + padding_x)
            y1, y2 = max(0, y1 - padding_y), min(height, y2 + padding_y)
            image = image[y1:y2, x1:x2]
            height, width = image.shape[:2]
        side = min(height, width)
        y1, x1 = (height - side) // 2, (width - side) // 2
        return image[y1:y1 + side, x1:x1 + side]

    @staticmethod
    def _quality_metrics(image: np.ndarray) -> dict[str, float | int]:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        brightness = float(gray.mean())
        contrast = float(gray.std())
        blur_variance = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        return {
            "width": int(image.shape[1]),
            "height": int(image.shape[0]),
            "brightness_mean": round(brightness, 3),
            "contrast_stddev": round(contrast, 3),
            "sharpness_laplacian_variance": round(blur_variance, 3),
            "underexposed_fraction": round(float(np.mean(gray < 20)), 5),
            "overexposed_fraction": round(float(np.mean(gray > 245)), 5),
        }

image_ai_service = ImageAIService()
