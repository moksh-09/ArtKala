Here is a complete, copy-paste-ready **`README.md`** formatted specifically for your GitHub repository:

```markdown
# 🎨 ARTISAN (SIH26090)
> **AI-Driven Market Linkage and Smart Cataloging Platform for Marginalized Artisans**  
> *"From craft knowledge to digital commerce."*

---

## 📌 Overview

**ARTISAN** is an AI-powered commerce enablement and market-linkage platform designed to solve **SIH Problem Statement SIH26090**. 

Unlike generic marketplaces, ARTISAN makes artisan capability **understandable, verifiable, and discoverable** by enterprise buyers through:
1. **Speak → Sell**: Multimodal voice-first product cataloging in regional Indian languages (Marathi, Hindi, Bengali, Tamil, etc.).
2. **Evidence-Backed Capability Twin**: Dynamic tracking of an artisan’s *Claimed*, *Verified*, and *Observed* production capacity.
3. **AI Demand Matching & Cluster Fulfillment**: Natural-language bulk RFQ matching with cluster consortium capacity allocation across multiple village makers.
4. **Local Open-Source AI**: On-device Whisper ASR, NLLB (English ⇄ Hindi translation), and Ollama (`gemma3:4b`) vision-catalog generation.
5. **Two-Sided Trust & Dispute Audit**: Cryptographic inspection checklists and transparent dispute evidence timelines.

---

## 📂 Repository Structure

```text
├── SIH_artisians_backend/       # FastAPI REST API, Database & AI Pipeline
│   ├── app/                     # API routers, DB models, AI services
│   ├── data/                    # Market benchmarks & demo seed datasets
│   ├── scripts/                 # Database seed & test scripts
│   ├── requirements.txt         # Core backend dependencies
│   ├── requirements-ai.txt      # Optional local AI dependencies (Whisper, NLLB, etc.)
│   └── .env.example             # Backend configuration template
│
└── SIH_artkala_frontend/        # Next.js App Router, Tailwind CSS, Craft Cockpit
    ├── src/                     # React components, pages, stores
    ├── public/                  # Static assets & media
    ├── package.json             # Frontend dependencies
    └── .env.local               # Frontend API target configuration
```

---

## ⚙️ System Prerequisites

Ensure you have the following installed on your machine:

| Requirement | Minimum Version | Installation Link / Command |
| :--- | :--- | :--- |
| **Git** | Latest | `git --version` ([Download](https://git-scm.com/)) |
| **Python** | **3.11** or **3.12** | `python3 --version` ([Download](https://www.python.org/downloads/)) |
| **Node.js** | **v18.x** or **v20.x LTS** | `node -v` ([Download](https://nodejs.org/)) |
| **npm** | **v9.x+** | `npm -v` (included with Node.js) |
| **FFmpeg** *(Optional)* | Latest | `brew install ffmpeg` / `winget install Gyan.FFmpeg` |
| **Ollama** *(Optional)* | Latest | For local Gemma vision LLM ([Download](https://ollama.com/)) |

---


## 🧠 Enabling Local AI & LLM Models

ARTISAN is built to operate with local, open-source AI models:

### 1. English ⇄ Hindi Translation (NLLB)
1. Install `pip install -r requirements-ai.txt`
2. In `SIH_artisians_backend/.env`, set:
   ```dotenv
   ENABLE_LOCAL_TRANSLATION=true
   TRANSLATION_MODEL=facebook/nllb-200-distilled-600M
   ```
3. The backend will automatically translate product titles, stories, and attributes into authentic Hindi Devanagari script.

### 2. Multimodal Vision & Catalog Generation (Ollama Gemma 3:4b)
1. Install Ollama from [ollama.com](https://ollama.com) (or `brew install ollama` on macOS).
2. Download and run the model:
   ```bash
   ollama run gemma3:4b
   ```
3. In `SIH_artisians_backend/.env`, set:
   ```dotenv
   ENABLE_OLLAMA=true
   OLLAMA_MODEL=gemma3:4b
   OLLAMA_BASE_URL=http://localhost:11434
   ```

### 3. Speech-to-Text (Faster-Whisper)
In `SIH_artisians_backend/.env`, set:
```dotenv
ENABLE_LOCAL_WHISPER=true
WHISPER_MODEL=small
```

---
## 🚀 Quickstart Guide

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

---

### 2. Backend Setup (FastAPI + Database)

Open your terminal and navigate to the backend directory:

```bash
cd SIH_artisians_backend
```

#### A. Create and Activate a Python Virtual Environment
- **macOS / Linux:**
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```
- **Windows (Command Prompt):**
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate.bat
  ```
- **Windows (PowerShell):**
  ```powershell
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  ```

#### B. Install Python Dependencies
```bash
pip install --upgrade pip

# Install Core Backend Dependencies (FastAPI, OpenCV, Database, etc.)
pip install -r requirements.txt
```

*( run local Speech-to-Text and NLLB Hindi Translation on your machine without cloud APIs):*
```bash
pip install -r requirements-ai.txt
```

#### C. Configure Environment Variables
```bash
cp .env.example .env
```
> **Note:** The default `.env` uses a local SQLite database (`artisan.db`) out-of-the-box. You do **not** need to install PostgreSQL or Docker to get started!

#### D. Seed Sample Craft Data (Artisans, Clusters & Catalog)
```bash
python scripts/seed_demo.py
```

#### E. Start the Backend API Server
```bash
uvicorn app.main:app --reload --port 8000
```
- API Documentation (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
- Provider Status Check: [http://localhost:8000/ai/status](http://localhost:8000/ai/status)

---

### 3. Frontend Setup (Next.js + Tailwind CSS)

Open a **new, separate terminal window** (leave the backend server running) and navigate to the frontend directory:

```bash
cd SIH_artkala_frontend
```

#### A. Configure API Endpoint
Create a `.env.local` file pointing to the backend:
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

#### B. Install Node Dependencies
```bash
npm install
```

#### C. Start the Development Server
```bash
npm run dev
```

Open your browser and visit: **[http://localhost:3000](http://localhost:3000)**

---



## 🧪 Testing the Complete Workflow

1. **Artisan Cockpit**: Log in as Savita Patil (Maharashtra Bamboo Craft) at `http://localhost:3000/artisan/dashboard`.
2. **Speak → Sell**: Go to `http://localhost:3000/artisan/add-product`, upload a workbench photo, speak or describe the craft, and let AI generate the catalog draft.
3. **Capability Twin**: Inspect `http://localhost:3000/artisan/capability` to view the 3-tier timeline (*Claimed 500/mo → Verified 400/mo → Observed 280/mo*).
4. **B2B Matching & Cluster Commerce**: Go to `http://localhost:3000/b2b/matches` to see how a 2,000-unit enterprise requirement is allocated across 4 village makers.
5. **Quality Checker**: Inspect batches at `http://localhost:3000/quality-checker/dashboard` using digital 5-point checklists.

---

## 🛠️ Troubleshooting

| Issue | Resolution |
| :--- | :--- |
| `command not found: python3` | Ensure Python 3.11+ is installed and check "Add to PATH" in the installer. |
| `port 8000 already in use` | Kill the existing process: `lsof -ti :8000 \| xargs kill -9` (Mac/Linux) or specify `--port 8001`. |
| `port 3000 already in use` | Next.js will prompt to use port `3001` automatically, or free port 3000. |
| `ModuleNotFoundError: No module named 'app'` | Make sure you execute `uvicorn app.main:app` while inside the `SIH_artisians_backend/` folder. |
| `Frontend cannot connect to Backend` | Verify that the backend is running on `http://localhost:8000` and `NEXT_PUBLIC_API_URL=http://localhost:8000` exists in `.env.local`. |

---

## 📄 License
Developed for **Smart India Hackathon (SIH26090)**. Distributed under the MIT License.
```
