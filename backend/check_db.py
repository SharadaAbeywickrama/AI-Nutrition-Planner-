"""Quick database connectivity and table checker."""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

def check_db():
    print("Connecting to database...")
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        # Check pgvector
        result = conn.execute(text("SELECT extname FROM pg_extension WHERE extname='vector'")).fetchone()
        print(f"pgvector extension: {'✅ enabled' if result else '❌ NOT enabled'}")
        
        # Check tables
        tables = conn.execute(text("""
            SELECT tablename FROM pg_tables
            WHERE schemaname = 'public'
            ORDER BY tablename
        """)).fetchall()
        print(f"Tables found: {[t[0] for t in tables]}")
        
        # Count foods
        try:
            count = conn.execute(text("SELECT COUNT(*) FROM sri_lankan_foods")).scalar()
            print(f"Food items with embeddings: {count}")
        except Exception as e:
            print(f"sri_lankan_foods table: ❌ {e}")
        
        # Check user profiles
        try:
            count = conn.execute(text("SELECT COUNT(*) FROM user_profiles")).scalar()
            print(f"User profiles: {count}")
        except Exception as e:
            print(f"user_profiles table: ❌ {e}")

if __name__ == "__main__":
    check_db()
    print("\nDatabase check complete.")
