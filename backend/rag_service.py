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

try:
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
except Exception as e:
    print("Warning: Could not load sentence-transformers. Will load on demand.")
    embedding_model = None

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def search_similar_foods(query: str, limit: int = 5):
    """Executes Reciprocal Rank Fusion hybrid search."""
    global embedding_model
    if embedding_model is None:
        embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
    query_embedding = embedding_model.encode(query).tolist()
    
    with engine.connect() as conn:
        result = conn.execute(
            text("""
                SELECT name, nutritional_profile, medical_context, hybrid_score
                FROM hybrid_food_search(:q_text, :q_emb, :k)
            """),
            {"q_text": query, "q_emb": str(query_embedding), "k": limit}
        ).fetchall()
        
    return [{"name": row.name, "nutritional_profile": row.nutritional_profile, "medical_context": row.medical_context} for row in result]

def generate_rag_response(user_query: str, user_profile: dict = None):
    """Executes hybrid RAG by fetching similar foods and generating LLM response."""
    similar_foods = search_similar_foods(user_query)
    
    context_blocks = []
    for food in similar_foods:
        profile = food['nutritional_profile']
        if isinstance(profile, str):
            profile = json.loads(profile)
            
        context_str = (
            f"Food Name: {food['name']}\n"
            f"Macros: Calories {profile.get('calories')} kcal, "
            f"Protein {profile.get('protein_g')}g, Fat {profile.get('fat_g')}g, "
            f"Carbs {profile.get('carbohydrates_g')}g, Fiber {profile.get('fiber_g')}g, "
            f"Sugar {profile.get('sugar_g')}g\n"
            f"Micros: Iron {profile.get('iron_mg')}mg, Calcium {profile.get('calcium_mg')}mg\n"
            f"Clinical Notes: {food['medical_context']}\n"
        )
        context_blocks.append(context_str)
        
    context = "\n---\n".join(context_blocks)
    
    system_prompt = f"""You are a dual-expert Clinical Dietitian specializing in Sri Lankan cuisine and a medical AI.
You must answer the user's dietary question using ONLY the retrieved nutritional context provided below.
Do not hallucinate nutritional values. Evaluate the macronutrients and micronutrients strictly based on the provided profiles.

Retrieved Context:
{context}

USER PROFILE (if applicable):
{json.dumps(user_profile) if user_profile else "Not provided"}"""

    response = client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_query}
        ]
    )
    
    return response.choices[0].message.content
