from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import ai, artisans, buyers, clusters, graph, hunar, matching, orders, pricing, products, quality
from app.config import get_settings
from app.database import init_db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    if get_settings().auto_create_tables:
        init_db()
    yield


app = FastAPI(
    title="ARTISAN SIH26090 Backend",
    description="Explainable AI-assisted commerce enablement and cluster fulfilment prototype.",
    version="0.1.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(artisans.router)
app.include_router(products.router)
app.include_router(ai.router)
app.include_router(hunar.router)
app.include_router(buyers.router)
app.include_router(matching.router)
app.include_router(clusters.router)
app.include_router(orders.router)
app.include_router(quality.router)
app.include_router(pricing.router)
app.include_router(graph.router)
app.mount("/storage", StaticFiles(directory=get_settings().storage_dir), name="storage")


@app.get("/health", tags=["system"])
def health() -> dict:
    return {"status": "ok", "service": "artisan-backend", "environment": get_settings().environment}
