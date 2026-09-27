# ARTISAN SIH26090 backend

FastAPI modular monolith for the SIH26090 vertical slice:

`photo + real voice -> image studio -> ASR -> multilingual catalogue draft -> Hunar Profile -> transparent pricing -> demand matching -> cluster fulfilment`

PostgreSQL is the transactional source of truth. Neo4j Community is an optional relationship/evidence layer. The graph never replaces PostgreSQL and relational matching remains the fallback when Neo4j is unavailable.

## AI Capability Matrix

| Feature | Implementation | Free/local | Demo fallback |
|---|---|---:|---|
| Image validation and metrics | OpenCV pixel measurements: brightness, contrast, blur, exposure, dimensions | Yes | None; invalid images are rejected |
| Image enhancement | OpenCV gray-world white balance, exposure correction, LAB CLAHE, crop, 1200×1200 JPEG output | Yes | None |
| Background removal | `rembg`/U2Net when enabled, otherwise OpenCV GrabCut in `auto` mode | Yes | If segmentation fails, original plus enhanced image remain; metadata says `not_applied` |
| Regional ASR | `faster-whisper` with selectable model and language hint; OpenAI-compatible ASR is optional | Yes, after model download | No transcript is invented; API reports unavailable |
| Language detection | Whisper’s detected language/probability | Yes with ASR | Manual language can be supplied |
| Translation | NLLB-200 local model, or OpenAI-compatible translation | Yes, after model download | English/Hindi fields are marked unavailable, never copied as fake translation |
| Product vision/autofill | Ollama multimodal model or OpenAI-compatible vision model; field-level provenance/confidence | Yes with local Ollama model | Draft contains no fabricated fields |
| Catalogue generation | Ollama/OpenAI-compatible real model, followed by real Hindi translation | Yes with Ollama + NLLB | No deterministic template is labelled AI |
| Dynamic pricing | Cost-plus calculation + documented benchmark comparables; price changes with inputs | Yes | Cost-plus-only when no benchmark matches |
| Knowledge graph | Neo4j Community adapter, synchronized from PostgreSQL | Yes locally | `graph_available=false`, relational fallback |

### Model/license notes

- [`faster-whisper` small model](https://huggingface.co/Systran/faster-whisper-small): approximately 486 MB for the published model artifact, MIT model card license; CPU/Apple Silicon compatible but slower than GPU.
- [`facebook/nllb-200-distilled-600M`](https://huggingface.co/facebook/nllb-200-distilled-600M): approximately 2.48 GB in the current model repository and CC-BY-NC-4.0. It is suitable for this non-commercial prototype only; review licensing before commercial deployment.
- [`rembg`](https://github.com/danielgatis/rembg): MIT software. Model-weight provenance/licensing must be reviewed separately; the API does not claim that the U2Net weights are MIT-licensed.
- OpenCV: Apache-2.0 software. The OpenCV pipeline works without model downloads.
- Ollama is an optional local runtime. The selected model’s own license applies; `gemma3:4b` requires reviewing Google’s Gemma terms before redistribution.
- Neo4j is run locally using the [official Community Docker image](https://neo4j.com/docs/operations-manual/current/docker/introduction/). Review its edition/license terms before redistribution.

Model sizes are approximate and depend on the model revision and cache format. NLLB generally needs several GB of RAM; `faster-whisper small` is the practical first ASR choice on an Apple Silicon MacBook. Start with CPU settings in `.env`; use Metal/MPS only after validating the installed PyTorch/transformers stack.

## Run locally

```bash
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload
```

The default database is SQLite. For PostgreSQL:

```bash
docker compose up -d postgres
# set DATABASE_URL=postgresql+psycopg://artisan:artisan@localhost:5432/artisan
alembic upgrade head
```

For Neo4j Community:

```bash
docker compose --profile graph up -d neo4j
# set GRAPH_ENABLED=true in .env
pip install -e '.[graph]'
```

The application still starts and serves relational functionality if Neo4j is down.

## Real local AI setup

Install local ASR and translation dependencies only when needed:

```bash
pip install -e '.[ai]'
```

Then enable them in `.env`:

```dotenv
ENABLE_LOCAL_WHISPER=true
WHISPER_MODEL=small
ENABLE_LOCAL_TRANSLATION=true
TRANSLATION_MODEL=facebook/nllb-200-distilled-600M
```

The first real inference downloads model files from Hugging Face. If the model is not installed or cannot load, the API returns a provider error/status; it does not turn a hardcoded transcript or sentence into “AI output”.

For a local multimodal catalogue model, install Ollama separately, pull a vision-capable model, then configure:

```dotenv
ENABLE_OLLAMA=true
OLLAMA_MODEL=gemma3:4b
OLLAMA_BASE_URL=http://localhost:11434
```

Alternatively configure `OPENAI_API_KEY` and, if appropriate, `OPENAI_BASE_URL` for an OpenAI-compatible provider. Keys are read server-side only and never returned by `/ai/status`.

## Endpoints for the PS-critical features

- `POST /ai/image-enhance` — upload any image, preserve original, produce a transformed marketplace image and measured metadata.
- `POST /products/analyze` — multipart `artisan_id`, `image`, `voice`, optional `language`, optional `artisan_text`; runs image processing, ASR, multimodal extraction, English catalogue generation, and Hindi translation where providers are available.
- `POST /ai/transcribe` — real ASR only; transcript override is disabled unless `ALLOW_DEMO_AI_OVERRIDES=true`.
- `POST /ai/translate` — real NLLB or configured hosted translation.
- `GET /ai/status` — reports `LOCAL`, `FREE_API_OR_HOSTED`, `UNAVAILABLE`, or `DEMO` configuration without secrets.
- `POST /pricing/estimate` — transparent cost and benchmark calculation.
- `POST /pricing/estimate-upload` — same pricing calculation plus actual image quality analysis.
- `GET /pricing/benchmarks` — documents benchmark status and last update.
- `GET /graph/status` — graph availability and relational fallback state.
- `GET /graph/artisans/{id}`, `/graph/products/{id}/relations`, `/graph/requirements/{id}/matches` — bounded graph queries only.

All AI output is draft until artisan confirmation. Product image metadata stores original and processed references plus actual processing operations. Capability attributes preserve source, confidence, verification status, timestamp, and evidence reference.

## Pricing data policy

`data/market_benchmarks.json` is intentionally labelled `BENCHMARK_DEMO`; it is not a live market feed. It contains documented prototype observations and timestamps. Pricing uses:

`raw material + labour hours × labour rate + packaging + other costs + logistics + desired margin + comparable range`

No current-market claim is made. To use legitimate market data later, replace the market-data service with an authorized API or administrator-entered observations carrying source and timestamp.

## Demo data

```bash
python scripts/seed_demo.py
```

The seed creates synthetic artisans, products, capacity, quality capability records, and a 2,000-unit buyer requirement. All seeded records are marked `is_demo_data=true`; they are not evidence from real artisans or buyers.

## Tests

```bash
pytest -q
```

The tests do not call paid APIs. They verify actual OpenCV image transformation, original preservation, cost-sensitive pricing, provider-unavailable behavior, invalid ASR input, graph fallback, matching/allocation, reservation, order state transitions, and QC-to-Hunar feedback.

## Exact manual vertical-slice test

1. Start the API and open `/docs`.
2. Call `GET /ai/status` and verify the configured providers.
3. Call `POST /ai/image-enhance` with a new arbitrary product image. Confirm `processed_image` exists and `operations` lists actual OpenCV operations; compare it with `original_image`.
4. Enable `ENABLE_LOCAL_WHISPER=true`, install the AI extra, and call `POST /ai/transcribe` with a new regional-language audio file. Confirm the response source is `faster_whisper`; if the model is unavailable, the endpoint must return an explicit provider error.
5. Enable Ollama and NLLB, then call `POST /products/analyze` with the new image and audio. Confirm original transcript, detected language, field-level provenance, English draft, and Hindi draft.
6. Confirm the product through `POST /products/{id}/confirm`.
7. Call `POST /pricing/estimate-upload` with actual material/labour inputs. Change a cost and verify `cost_floor` and the recommended range change.
8. Create a buyer requirement, run matching, inspect reasons and `graph_evidence`, then allocate/reserve cluster capacity.
9. Create an order, record QC, and inspect `/hunar/{artisan_id}` for observed evidence.

## Known limitations

- Real ASR, translation, and multimodal catalogue output require the corresponding local model/runtime or an optional configured API; this repository does not download multi-GB models automatically.
- The included market dataset is benchmark/demo data, not live market intelligence.
- The optional graph synchronizer writes confirmed/domain records only when Neo4j is configured and reachable; it never fabricates graph results.
- Authentication, offline sync, payment, logistics, ONDC, and GeM adapters remain outside this SIH prototype slice.
