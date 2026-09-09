from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserProfileBase(BaseModel):
    name: Optional[str] = "User"
    age: Optional[int] = None
    sex: Optional[str] = None
    weight_kg: Optional[float] = None
    goal_weight_kg: Optional[float] = None
    height_cm: Optional[float] = None
    activity_level: Optional[str] = None
    dietary_goal: Optional[str] = None
    barriers: Optional[str] = None
    country: Optional[str] = None

class UserProfileResponse(UserProfileBase):
    id: int

    class Config:
        from_attributes = True

class LoggedFoodItem(BaseModel):
    food_id: str
    name: str
    quantity_multiplier: float = 1.0

class DailyLog(BaseModel):
    day: str
    mood_trigger: Optional[str] = None
    foods: List[LoggedFoodItem]

class DietInput(BaseModel):
    days_logged: int = 7
    daily_logs: List[DailyLog]

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
    days_logged: int
    analysis_result: AnalysisResponse
    created_at: datetime

    class Config:
        from_attributes = True
