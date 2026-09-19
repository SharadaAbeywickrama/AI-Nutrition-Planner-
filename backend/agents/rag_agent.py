"""
RAG Agent
---------
Responsibility: Given a text query, embed it and perform a hybrid pgvector +
full-text search against the Sri Lankan food database. Returns structured
food context for downstream agents.
"""
import os
import json

os.environ["HF_HUB_DISABLE_IMPLICIT_TOKEN"] = "1"
os.environ.pop("HF_TOKEN", None)

from sqlalchemy import text
from sentence_transformers import SentenceTransformer


_embedding_model: SentenceTransformer | None = None


def _get_model() -> SentenceTransformer:
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedding_model


class RAGAgent:
    """
    Searches the pgvector database using Reciprocal Rank Fusion (hybrid
    semantic + BM25 full-text search).
    """

    def __init__(self, db_engine):
        self.engine = db_engine

    def run(self, query: str, limit: int = 5) -> list[dict]:
        """
        Returns a list of relevant food dicts with keys:
          name, nutritional_profile (dict), medical_context (str)
        """
        model = _get_model()
        query_embedding = model.encode(query).tolist()

        try:
            with self.engine.connect() as conn:
                rows = conn.execute(
                    text(
                        """
                        SELECT name, nutritional_profile, medical_context, hybrid_score
                        FROM hybrid_food_search(:q_text, :q_emb, :k)
                        """
                    ),
                    {"q_text": query, "q_emb": str(query_embedding), "k": limit},
                ).fetchall()

            results = []
            for row in rows:
                profile = row.nutritional_profile
                if isinstance(profile, str):
                    profile = json.loads(profile)
                results.append(
                    {
                        "name": row.name,
                        "nutritional_profile": profile,
                        "medical_context": row.medical_context,
                    }
                )
            return results

        except Exception as e:
            print(f"[RAGAgent] Search failed (pgvector may not be set up): {e}")
            return []

    def format_context(self, foods: list[dict]) -> str:
        """Formats food results into a readable context string for LLM prompts."""
        if not foods:
            return "No matching foods found in database."

        blocks = []
        for food in foods:
            p = food["nutritional_profile"]
            block = (
                f"Food: {food['name']}\n"
                f"Macros: {p.get('calories')} kcal | "
                f"Protein {p.get('protein_g')}g | Fat {p.get('fat_g')}g | "
                f"Carbs {p.get('carbohydrates_g')}g | Fiber {p.get('fiber_g')}g\n"
                f"Micros: Iron {p.get('iron_mg')}mg | Calcium {p.get('calcium_mg')}mg | "
                f"Vit B12 {p.get('vitamin_b12_mcg')}mcg\n"
                f"Clinical Notes: {food['medical_context']}"
            )
            blocks.append(block)
        return "\n---\n".join(blocks)
