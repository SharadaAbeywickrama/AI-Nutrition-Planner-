import os
os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN"] = "1"
os.environ.pop("HF_TOKEN", None)
import json
from sqlalchemy.orm import Session
from sqlalchemy import text
from sentence_transformers import SentenceTransformer
from openai import OpenAI
from models import engine
from dotenv import load_dotenv

load_dotenv()

# We need the model loaded for vector search
try:
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print("Warning: Could not load sentence-transformers. Will load on demand if needed.")
    embedding_model = None

# OpenRouter setup
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def search_similar_foods(query: str, limit: int = 5):
    """Generates embedding for query and searches pgvector database."""
    global embedding_model
    if embedding_model is None:
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
    query_embedding = embedding_model.encode(query).tolist()
    
    # Query pgvector for closest items using Euclidean distance (<->)
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT name, nutrients, embedding <-> :embedding AS distance
                FROM food_items
                ORDER BY embedding <-> :embedding
                LIMIT :limit
            """),
            {"embedding": str(query_embedding), "limit": limit}
        ).fetchall()
        
    return [{"name": row.name, "nutrients": json.loads(row.nutrients), "distance": row.distance} for row in result]

def generate_rag_response(user_query: str, user_profile: dict = None):
    """Executes RAG by fetching similar foods and generating LLM response."""
    # 1. Retrieve
    similar_foods = search_similar_foods(user_query)
    
    context = "Here is the relevant nutritional data from our verified Sri Lankan food database:\n"
    for food in similar_foods:
        context += f"- {food['name']}: {json.dumps(food['nutrients'])}\n"
        
    # 2. Augment and Generate
    system_prompt = f"""You are a professional Clinical Dietitian specializing in Sri Lankan and South Asian cuisine.
Your job is to answer the user's dietary question using ONLY the provided verified database context. 
If the user's question cannot be answered by the context, advise them accordingly. 

CONTEXT:
{context}

USER PROFILE (if applicable):
{json.dumps(user_profile) if user_profile else "Not provided"}

Answer clearly, professionally, and ground your nutritional advice entirely in the numbers provided in the context."""

    response = client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ]
    )
    
    return response.choices[0].message.content
