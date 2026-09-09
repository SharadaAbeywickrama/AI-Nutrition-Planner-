from sqlalchemy import text
from database import engine

def migrate():
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE user_profiles ADD COLUMN goal_weight_kg FLOAT;"))
        except Exception as e:
            print("goal_weight_kg:", e)
        try:
            conn.execute(text("ALTER TABLE user_profiles ADD COLUMN barriers VARCHAR;"))
        except Exception as e:
            print("barriers:", e)
        try:
            conn.execute(text("ALTER TABLE user_profiles ADD COLUMN country VARCHAR;"))
        except Exception as e:
            print("country:", e)
        conn.commit()

if __name__ == "__main__":
    migrate()
