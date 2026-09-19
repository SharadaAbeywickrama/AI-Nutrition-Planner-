"""
Orchestrator Agent
------------------
Responsibility: The central coordinator. Receives the raw diet log + user
profile, runs each specialist agent in the correct order, merges their outputs,
and returns one unified analysis result to the API layer.

Pipeline:
  1. RAGAgent      → retrieves relevant food context from pgvector
  2. NutritionAgent → aggregates nutrients & produces deficiency report (uses RAG context)
  3. SleepAgent    → analyses food-sleep correlations
  4. CoachAgent    → synthesises everything into a coaching message

All agents are called synchronously (simple sequential pipeline). The agents
are loosely coupled — each receives only the data it needs.
"""
import json
from database import engine as _engine

from .rag_agent       import RAGAgent
from .nutrition_agent import NutritionAgent
from .sleep_agent     import SleepAgent
from .coach_agent     import CoachAgent


class OrchestratorAgent:
    """
    Coordinates all specialist agents and returns a unified analysis dict.
    """

    def __init__(self, food_database: list):
        self.food_database   = food_database
        self.rag_agent       = RAGAgent(db_engine=_engine)
        self.nutrition_agent = NutritionAgent()
        self.sleep_agent     = SleepAgent()
        self.coach_agent     = CoachAgent()

    def run(
        self,
        daily_logs: list,
        days_logged: int,
        profile_context: dict | None = None,
    ) -> dict:
        """
        Runs the full multi-agent pipeline and returns:
        {
            "deficiencies":    [...],          # from NutritionAgent
            "overall_summary": "...",          # from NutritionAgent
            "sleep_report":    {...},          # from SleepAgent
            "coaching":        {...},          # from CoachAgent
            "rag_foods_used":  [...]           # diagnostic — foods retrieved by RAG
        }
        """
        print("[Orchestrator] ▶ Starting multi-agent pipeline…")

        # ── Step 1: RAG ──────────────────────────────────────────────────────
        print("[Orchestrator] Step 1/4 — RAGAgent: searching food database…")
        # Build a representative query from logged food names
        food_names = []
        for log in daily_logs:
            foods = getattr(log, "foods", None) or (log.get("foods", []) if isinstance(log, dict) else [])
            for item in foods:
                food_id = getattr(item, "food_id", None) or (item.get("food_id") if isinstance(item, dict) else None)
                db_food = next((f for f in self.food_database if str(f["id"]) == str(food_id)), None)
                if db_food:
                    food_names.append(db_food.get("name", ""))

        rag_query = " ".join(food_names[:10]) if food_names else "Sri Lankan nutrition"
        rag_foods = self.rag_agent.run(rag_query, limit=5)
        rag_context = self.rag_agent.format_context(rag_foods)
        print(f"[Orchestrator] RAGAgent returned {len(rag_foods)} food contexts.")

        # ── Step 2: Nutrition Analysis ────────────────────────────────────────
        print("[Orchestrator] Step 2/4 — NutritionAgent: aggregating nutrients…")
        aggregated, moods = self.nutrition_agent.aggregate_nutrients(daily_logs, self.food_database)
        print(f"[Orchestrator] Aggregated nutrients: {list(aggregated.keys())}")

        nutrition_report = self.nutrition_agent.run(
            aggregated_nutrients=aggregated,
            days_logged=days_logged,
            moods=moods,
            profile_context=profile_context,
            rag_context=rag_context,
        )
        print(f"[Orchestrator] NutritionAgent found {len(nutrition_report.get('deficiencies', []))} deficiencies.")

        # ── Step 3: Sleep Analysis ────────────────────────────────────────────
        print("[Orchestrator] Step 3/4 — SleepAgent: analysing food-sleep patterns…")
        sleep_report = self.sleep_agent.run(
            daily_logs=daily_logs,
            food_database=self.food_database,
            days_logged=days_logged,
        )
        print(f"[Orchestrator] SleepAgent risk level: {sleep_report.get('risk_level', 'Unknown')}")

        # ── Step 4: Coach ─────────────────────────────────────────────────────
        print("[Orchestrator] Step 4/4 — CoachAgent: generating weekly coaching message…")
        coaching = self.coach_agent.run(
            nutrition_report=nutrition_report,
            sleep_report=sleep_report,
            profile_context=profile_context,
            moods=moods,
        )
        print("[Orchestrator] ✅ Multi-agent pipeline complete.")

        return {
            "deficiencies":   nutrition_report.get("deficiencies", []),
            "overall_summary": nutrition_report.get("overall_summary", ""),
            "sleep_report":   sleep_report,
            "coaching":       coaching,
            "rag_foods_used": [f["name"] for f in rag_foods],
            "aggregated_nutrients": aggregated,
        }
