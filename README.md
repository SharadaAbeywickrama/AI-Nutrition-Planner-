# 🍛 AI Nutrition Planner — Sri Lankan Edition

A full-stack AI-powered nutrition tracking and analysis application specifically designed for Sri Lankan cuisine, built with React, FastAPI, PostgreSQL (Supabase), and a pgvector RAG pipeline.

## ✨ Features

- **📱 Mobile-first UI** — MyFitnessPal-style interface with bottom navigation
- **🤖 AI Diet Analysis** — Log meals and get behavioral coaching from LLaMA 3.3 70B
- **🔍 pgvector RAG** — Semantic + keyword hybrid search across 50 clinically-verified Sri Lankan foods
- **💬 AI Dietitian Chat** — Ask free-form nutrition questions powered by Retrieval-Augmented Generation
- **📊 Progress Dashboards** — Calories, Macros, Nutrients, Measurements and Sleep views
- **🧭 9-Step Onboarding** — Personalized BMR/TDEE calculation with weight-loss projection
- **🇱🇰 Sri Lankan Food Database** — 50 foods verified against MRI 2021 & USDA FoodData Central

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Recharts, Lucide Icons |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL via Supabase + pgvector |
| AI/LLM | LLaMA 3.3 70B via OpenRouter |
| Embeddings | sentence-transformers (all-MiniLM-L6-v2) |
| RAG Strategy | HNSW vector search + GIN full-text + RRF fusion |

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- A Supabase project (free tier works)
- An OpenRouter API key (free tier works)

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@host:port/db
OPENROUTER_API_KEY=sk-or-...
```

Initialize the vector database:
```bash
python setup_vector_db.py
```

Start the API:
```bash
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 🗄️ Database Schema

- `user_profiles` — User demographics and goals
- `analysis_records` — Historical AI analysis results
- `sri_lankan_foods` — 50-item food table with 384-dim embeddings (pgvector)

## 📚 Food Data Sources

- **Sri Lanka Medical Research Institute (MRI)** — Food Composition Tables 2021
- **USDA FoodData Central** — fdc.nal.usda.gov
- **Hybrid recipe calculations** where specific data unavailable

## 🤖 RAG Architecture

```
User Query → Embed (MiniLM) → pgvector HNSW search
                           → PostgreSQL GIN full-text search
                           → Reciprocal Rank Fusion
                           → Top-5 context → LLaMA 3.3 70B → Answer
```

## 📄 License

MIT License — see LICENSE file
