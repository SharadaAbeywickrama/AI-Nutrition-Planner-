from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nutrition.db")

def _make_engine(url: str):
    if url.startswith("sqlite"):
        return create_engine(url, connect_args={"check_same_thread": False})
    return create_engine(url, pool_pre_ping=True)

# Try configured DB, fall back to local SQLite automatically
try:
    engine = _make_engine(DATABASE_URL)
    # Quick connectivity check at startup
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    print(f"[database] Connected to: {DATABASE_URL[:50]}...")
except Exception as e:
    fallback = "sqlite:///./nutrition.db"
    print(f"[database] WARNING: Could not connect to '{DATABASE_URL[:50]}...' → {e}")
    print(f"[database] Falling back to local SQLite: {fallback}")
    engine = _make_engine(fallback)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
