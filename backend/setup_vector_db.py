import os
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN"] = "1"
os.environ.pop("HF_TOKEN", None)
import json
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, text
from sqlalchemy.orm import declarative_base, sessionmaker
from pgvector.sqlalchemy import Vector
from sentence_transformers import SentenceTransformer

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
Base = declarative_base()

class FoodItem(Base):
    __tablename__ = 'food_items'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    nutrients = Column(String, nullable=False) # Store JSON string of nutrients
    embedding = Column(Vector(384)) # all-MiniLM-L6-v2 uses 384 dimensions

def setup_db():
    print("Enabling pgvector extension...")
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    
    print("Creating tables...")
    Base.metadata.create_all(engine)
    print("Database setup complete.")

def populate_data():
    print("Loading embedding model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Reading food database...")
    with open('backend/data/food_database.json', 'r') as f:
        foods = json.load(f)
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    print("Clearing existing food items...")
    session.query(FoodItem).delete()
    session.commit()
    
    print("Embedding and inserting foods...")
    for food in foods:
        # Create a rich text representation for embedding
        nutrients_str = ", ".join([f"{k}: {v}" for k, v in food['nutrients'].items()])
        text_to_embed = f"Food name: {food['name']}. Nutrients: {nutrients_str}"
        
        embedding = model.encode(text_to_embed).tolist()
        
        item = FoodItem(
            id=int(food['id']),
            name=food['name'],
            nutrients=json.dumps(food['nutrients']),
            embedding=embedding
        )
        session.add(item)
    
    session.commit()
    print(f"Successfully inserted {len(foods)} food items with vectors.")

if __name__ == "__main__":
    setup_db()
    populate_data()
