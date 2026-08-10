from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

import models, schemas, database, ai_service
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

@app.post("/api/analyze", response_model=schemas.AnalysisRecordResponse)
def analyze_user_diet(diet: schemas.DietInput, db: Session = Depends(database.get_db)):
    if not diet.diet_text.strip():
        raise HTTPException(status_code=400, detail="Diet input cannot be empty.")
    
    # Call Gemini API
    ai_result = ai_service.analyze_diet(diet.diet_text)
    
    # Save to database
    db_record = models.AnalysisRecord(
        diet_input=diet.diet_text,
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
