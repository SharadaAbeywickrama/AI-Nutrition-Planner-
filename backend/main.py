import os
import traceback
import json
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

import models, schemas, database, rag_service
from database import engine
from agents import OrchestratorAgent

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Load food DB once at startup
FOOD_DB_PATH = Path(__file__).parent / "data" / "food_database.json"
with open(FOOD_DB_PATH, "r") as f:
    FOOD_DATABASE = json.load(f)

# Instantiate the orchestrator (shared, stateless)
orchestrator = OrchestratorAgent(food_database=FOOD_DATABASE)

app = FastAPI(title="AI Nutrition Planner API — Multi-Agent Edition")

# Allow CORS configured via env var
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = exc.errors()
    detail = []
    for e in errors:
        detail.append({"field": " -> ".join(str(x) for x in e['loc']), "message": e['msg']})
    print(f"VALIDATION ERROR on {request.url}: {detail}")
    return JSONResponse(status_code=422, content={"detail": detail, "hint": "Check field types and required fields"})


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "AI Nutrition Planner API — Multi-Agent Edition is running",
        "agents": ["RAGAgent", "NutritionAgent", "SleepAgent", "CoachAgent", "OrchestratorAgent"],
    }


# ── Chat (RAG only) ──────────────────────────────────────────────────────────

class RagQueryRequest(BaseModel):
    query: str

@app.post("/api/rag_chat")
def rag_chat(request: RagQueryRequest, db: Session = Depends(database.get_db)):
    try:
        profile = db.query(models.UserProfile).first()
        response = rag_service.generate_rag_response(request.query, profile)
        return {"response": response}
    except Exception as e:
        print(f"RAG Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ── Profile Endpoints ────────────────────────────────────────────────────────

@app.get("/api/profile", response_model=schemas.UserProfileResponse)
def get_profile(db: Session = Depends(database.get_db)):
    profile = db.query(models.UserProfile).first()
    if not profile:
        profile = models.UserProfile()
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@app.put("/api/profile", response_model=schemas.UserProfileResponse)
def update_profile(profile_data: schemas.UserProfileBase, db: Session = Depends(database.get_db)):
    profile = db.query(models.UserProfile).first()
    if not profile:
        profile = models.UserProfile()
        db.add(profile)
    for key, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, key, value)
    db.commit()
    db.refresh(profile)
    return profile


# ── Food Endpoints ───────────────────────────────────────────────────────────

@app.get("/api/foods")
def get_foods():
    return FOOD_DATABASE

@app.get("/api/foods/search")
def search_foods(q: str = ""):
    if not q:
        return FOOD_DATABASE
    q_lower = q.lower()
    return [f for f in FOOD_DATABASE if q_lower in f['name'].lower() or q_lower in f.get('category', '').lower()]

@app.get("/api/foods/categories")
def get_categories():
    cats = list(dict.fromkeys(f.get('category', 'Other') for f in FOOD_DATABASE))
    return {"categories": cats}


# ── Analysis Endpoint (Multi-Agent Pipeline) ─────────────────────────────────

@app.post("/api/analyze", response_model=schemas.AnalysisRecordResponse)
def analyze_user_diet(diet: schemas.DietInput, db: Session = Depends(database.get_db)):
    if not diet.daily_logs:
        raise HTTPException(status_code=400, detail="Diet log cannot be empty.")

    try:
        # Fetch user profile for personalisation
        profile = db.query(models.UserProfile).first()
        profile_context = None
        if profile:
            profile_context = {
                "age":           profile.age,
                "sex":           profile.sex,
                "weight_kg":     profile.weight_kg,
                "height_cm":     profile.height_cm,
                "activity_level": profile.activity_level,
                "dietary_goal":  profile.dietary_goal,
            }

        # ── Run the multi-agent pipeline ──────────────────────────────────────
        result = orchestrator.run(
            daily_logs=diet.daily_logs,
            days_logged=diet.days_logged,
            profile_context=profile_context,
        )

        # Persist to database
        diet_input_str = json.dumps([log.dict() for log in diet.daily_logs])
        db_record = models.AnalysisRecord(
            diet_input=diet_input_str,
            days_logged=diet.days_logged,
            analysis_result=result,
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return db_record

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/api/history", response_model=List[schemas.AnalysisRecordResponse])
def get_analysis_history(db: Session = Depends(database.get_db)):
    records = db.query(models.AnalysisRecord).order_by(models.AnalysisRecord.created_at.desc()).all()
    return records
