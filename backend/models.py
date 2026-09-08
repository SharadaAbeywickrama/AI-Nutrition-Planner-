from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float
from datetime import datetime, timezone
from database import Base

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    # We use a single profile for the MVP
    name = Column(String, default="User")
    age = Column(Integer, nullable=True)
    sex = Column(String, nullable=True)
    weight_kg = Column(Float, nullable=True)
    height_cm = Column(Float, nullable=True)
    activity_level = Column(String, nullable=True)
    dietary_goal = Column(String, nullable=True)

class AnalysisRecord(Base):
    __tablename__ = "analysis_records"

    id = Column(Integer, primary_key=True, index=True)
    diet_input = Column(Text, nullable=False)
    days_logged = Column(Integer, default=7)
    analysis_result = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
