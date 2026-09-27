from __future__ import annotations


class AIProviderUnavailable(RuntimeError):
    """Raised when no configured real provider can execute a requested task."""


class AIProviderError(RuntimeError):
    """Raised when a configured provider fails or returns malformed output."""

