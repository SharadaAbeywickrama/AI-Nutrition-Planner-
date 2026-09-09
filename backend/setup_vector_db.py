import os
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN"] = "1"
os.environ.pop("HF_TOKEN", None)
import json
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sentence_transformers import SentenceTransformer

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)

def setup_hybrid_db():
    print("Setting up advanced hybrid pgvector database...")
    with engine.connect() as conn:
        # 1. Enable pgvector
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        
        # 2. Drop existing table if exists to recreate with new schema
        conn.execute(text("DROP TABLE IF EXISTS sri_lankan_foods CASCADE"))
        
        # 3. Create the unified document table
        # We use vector(384) instead of 1536 because we are using all-MiniLM-L6-v2 locally to save API costs
        conn.execute(text("""
            CREATE TABLE sri_lankan_foods (
                id BIGSERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                nutritional_profile JSONB NOT NULL,
                medical_context TEXT NOT NULL, 
                embedding vector(384),        
                
                fts tsvector GENERATED ALWAYS AS (
                    to_tsvector('english', name || ' ' || category || ' ' || coalesce(medical_context, ''))
                ) STORED
            )
        """))
        
        # 4. Create HNSW and GIN indexes
        conn.execute(text("CREATE INDEX ON sri_lankan_foods USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64)"))
        conn.execute(text("CREATE INDEX ON sri_lankan_foods USING gin (fts)"))
        
        # 5. Create Hybrid Search RPC
        conn.execute(text("""
            CREATE OR REPLACE FUNCTION hybrid_food_search(
                query_text TEXT,
                query_embedding vector(384),
                match_count INT DEFAULT 5,
                rrf_k INT DEFAULT 60
            )
            RETURNS TABLE (
                id BIGINT,
                name TEXT,
                nutritional_profile JSONB,
                medical_context TEXT,
                hybrid_score FLOAT
            )
            LANGUAGE sql
            AS $$
            WITH semantic_search AS (
                SELECT 
                    id, 
                    ROW_NUMBER() OVER (ORDER BY embedding <=> query_embedding) AS rank_ix
                FROM sri_lankan_foods
                ORDER BY rank_ix
                LIMIT LEAST(match_count * 2, 30)
            ),
            keyword_search AS (
                SELECT 
                    id, 
                    ROW_NUMBER() OVER (ORDER BY ts_rank_cd(fts, websearch_to_tsquery('english', query_text)) DESC) AS rank_ix
                FROM sri_lankan_foods
                WHERE fts @@ websearch_to_tsquery('english', query_text)
                ORDER BY rank_ix
                LIMIT LEAST(match_count * 2, 30)
            )
            SELECT 
                f.id,
                f.name,
                f.nutritional_profile,
                f.medical_context,
                (
                    COALESCE(1.0 / (rrf_k + s.rank_ix), 0.0) + 
                    COALESCE(1.0 / (rrf_k + k.rank_ix), 0.0)
                ) AS hybrid_score
            FROM semantic_search s
            FULL OUTER JOIN keyword_search k ON s.id = k.id
            JOIN sri_lankan_foods f ON COALESCE(s.id, k.id) = f.id
            ORDER BY hybrid_score DESC
            LIMIT match_count;
            $$;
        """))
        conn.commit()
    print("Database schema and RPC created successfully.")

def populate_data():
    print("Loading embedding model...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Reading Deep Research food database...")
    with open('backend/data/food_database.json', 'r') as f:
        foods = json.load(f)
    
    print("Embedding and upserting foods...")
    with engine.connect() as conn:
        for item in foods:
            # Construct the clinical context string as prescribed by the Deep Research output
            context_string = (
                f"Food: {item['name']}. Category: {item['category']}. "
                f"This food contains {item['calories']} calories, {item['protein_g']}g protein, "
                f"{item['carbohydrates_g']}g carbs, and {item['sugar_g']}g sugar. "
                f"Micronutrients: {item['iron_mg']}mg Iron, {item['calcium_mg']}mg Calcium. "
                f"Clinical evidence: {item['citation_source']}."
            )
            
            embedding = model.encode(context_string).tolist()
            
            conn.execute(text("""
                INSERT INTO sri_lankan_foods (name, category, nutritional_profile, medical_context, embedding)
                VALUES (:name, :category, :nutritional_profile, :medical_context, :embedding)
            """), {
                "name": item['name'],
                "category": item['category'],
                "nutritional_profile": json.dumps(item),
                "medical_context": context_string,
                "embedding": str(embedding) # pgvector string cast
            })
        conn.commit()
    
    print(f"Successfully inserted {len(foods)} clinical food items with HNSW vectors.")

if __name__ == "__main__":
    setup_hybrid_db()
    populate_data()
