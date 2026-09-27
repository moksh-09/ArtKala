from app.services.image_ai_service import image_ai_service


class VisionService:
    """Compatibility façade for callers that previously used vision_service.inspect."""

    def inspect(self, image_path: str):
        return image_ai_service.inspect(image_path)


vision_service = VisionService()
