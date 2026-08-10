from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DietInput(BaseModel):
    diet_text: str

class NutrientDeficiency(BaseModel):
    nutrient: str
    explanation: str
    recommended_supplement: str
    food_sources: List[str]

class AnalysisResponse(BaseModel):
    deficiencies: List[NutrientDeficiency]
    overall_summary: str

class AnalysisRecordResponse(BaseModel):
    id: int
    diet_input: str
    analysis_result: AnalysisResponse
    created_at: datetime

    class Config:
        from_attributes = True
