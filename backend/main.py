from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

import models, schemas, database, ai_service, rag_service
from database import engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Nutrition Planner API")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# ---- Profile Endpoints ----

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

import json
from pathlib import Path

# Load food DB
FOOD_DB_PATH = Path(__file__).parent / "data" / "food_database.json"
with open(FOOD_DB_PATH, "r") as f:
    FOOD_DATABASE = json.load(f)

# ---- Food Endpoints ----
@app.get("/api/foods")
def get_foods():
    return FOOD_DATABASE

# ---- Analysis Endpoints ----

@app.post("/api/analyze", response_model=schemas.AnalysisRecordResponse)
def analyze_user_diet(diet: schemas.DietInput, db: Session = Depends(database.get_db)):
    if not diet.daily_logs:
        raise HTTPException(status_code=400, detail="Diet log cannot be empty.")
    
    # Get user profile context
    profile = db.query(models.UserProfile).first()
    profile_context = None
    if profile:
        profile_context = {
            "age": profile.age,
            "sex": profile.sex,
            "weight_kg": profile.weight_kg,
            "height_cm": profile.height_cm,
            "activity_level": profile.activity_level,
            "dietary_goal": profile.dietary_goal
        }
    
    # 1. Deterministic Aggregation (MacroFactor style)
    # We aggregate the nutrients deterministically here, and pass the totals to the AI.
    aggregated_nutrients = {}
    moods_logged = []

    for log in diet.daily_logs:
        if log.mood_trigger and log.mood_trigger not in moods_logged:
            moods_logged.append(log.mood_trigger)
        for item in log.foods:
            # Find food in DB — support both int and string IDs
            db_food = next((f for f in FOOD_DATABASE if str(f["id"]) == str(item.food_id)), None)
            if db_food:
                # Support new flat schema (protein_g, fat_g, carbohydrates_g...)
                # and also legacy nested schema (nutrients: {})
                if "nutrients" in db_food:
                    nutrient_map = db_food["nutrients"]
                else:
                    nutrient_map = {
                        "Calories": db_food.get("calories", 0),
                        "Protein": db_food.get("protein_g", 0),
                        "Fat": db_food.get("fat_g", 0),
                        "Carbs": db_food.get("carbohydrates_g", 0),
                        "Fiber": db_food.get("fiber_g", 0),
                        "Sugar": db_food.get("sugar_g", 0),
                        "Sodium": db_food.get("sodium_mg", 0),
                        "Iron": db_food.get("iron_mg", 0),
                        "Calcium": db_food.get("calcium_mg", 0),
                        "Vitamin B12": db_food.get("vitamin_b12_mcg", 0),
                    }
                for nutrient, amount in nutrient_map.items():
                    aggregated_nutrients[nutrient] = aggregated_nutrients.get(nutrient, 0) + (amount * item.quantity_multiplier)

    # 2. Convert structured input back to a string for DB storage
    diet_input_str = json.dumps([log.dict() for log in diet.daily_logs])
    
    # Call Groq/LLM API with aggregated data and behavioral context
    ai_result = ai_service.analyze_diet(
        diet_input_str, 
        diet.days_logged, 
        aggregated_nutrients, 
        moods_logged, 
        profile_context
    )
    
    # Save to database
    db_record = models.AnalysisRecord(
        diet_input=diet_input_str,
        days_logged=diet.days_logged,
        analysis_result=ai_result
    )
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    return db_record

@app.get("/api/history", response_model=List[schemas.AnalysisRecordResponse])
def get_analysis_history(db: Session = Depends(database.get_db)):
    records = db.query(models.AnalysisRecord).order_by(models.AnalysisRecord.created_at.desc()).all()
    return records
