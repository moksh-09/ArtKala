import re
from uuid import uuid4


def new_id(prefix: str) -> str:
    return f"{prefix}_{uuid4().hex[:12]}"


def normalise(value: str | None) -> str:
    return re.sub(r"\s+", " ", (value or "").strip().lower())


def tokens(value: str | None) -> set[str]:
    return {token for token in re.findall(r"[\w\u0900-\u097f]+", normalise(value)) if len(token) > 2}


def semantic_overlap(left: str | None, right: str | None) -> float:
    a, b = tokens(left), tokens(right)
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)

