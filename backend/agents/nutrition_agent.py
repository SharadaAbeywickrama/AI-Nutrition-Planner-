"""
Nutrition Agent
---------------
Responsibility: Aggregate raw food logs into per-nutrient totals and call the
LLM to identify deficiencies, tailor recommendations to the user's profile
goals, and return a structured JSON deficiency report.
"""
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

_client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

# Daily reference intakes used for context in the prompt
DAILY_REFERENCE = {
    "Calories": 2000,
    "Protein": 50,        # g
    "Fat": 65,            # g
    "Carbs": 300,         # g
    "Fiber": 28,          # g
    "Sugar": 50,          # g
    "Sodium": 2300,       # mg
    "Iron": 18,           # mg
    "Calcium": 1000,      # mg
    "Vitamin B12": 2.4,   # mcg
}


class NutritionAgent:
    """
    Aggregates nutrient totals from raw food logs and produces an AI-powered
    deficiency analysis.
    """

    def aggregate_nutrients(self, daily_logs: list, food_database: list) -> tuple[dict, list]:
        """
        Walks through daily_logs, looks up each food in food_database, and
        sums up all nutrients scaled by quantity_multiplier.

        Returns:
            aggregated (dict): nutrient name -> total amount
            moods (list): unique mood triggers reported
        """
        aggregated: dict = {}
        moods: list = []

        for log in daily_logs:
            mood = getattr(log, "mood_trigger", None) or (log.get("mood_trigger") if isinstance(log, dict) else None)
            if mood and mood not in moods:
                moods.append(mood)

            foods = getattr(log, "foods", None) or (log.get("foods", []) if isinstance(log, dict) else [])
            for item in foods:
                food_id = getattr(item, "food_id", None) or (item.get("food_id") if isinstance(item, dict) else None)
                qty = getattr(item, "quantity_multiplier", 1.0) or (item.get("quantity_multiplier", 1.0) if isinstance(item, dict) else 1.0)

                db_food = next(
                    (f for f in food_database if str(f["id"]) == str(food_id)),
                    None,
                )
                if not db_food:
                    print(f"[NutritionAgent] WARNING: food_id '{food_id}' not found.")
                    continue

                # Support both flat and nested nutrient schemas
                if "nutrients" in db_food:
                    nutrient_map = db_food["nutrients"]
                else:
                    nutrient_map = {
                        "Calories":    db_food.get("calories", 0),
                        "Protein":     db_food.get("protein_g", 0),
                        "Fat":         db_food.get("fat_g", 0),
                        "Carbs":       db_food.get("carbohydrates_g", 0),
                        "Fiber":       db_food.get("fiber_g", 0),
                        "Sugar":       db_food.get("sugar_g", 0),
                        "Sodium":      db_food.get("sodium_mg", 0),
                        "Iron":        db_food.get("iron_mg", 0),
                        "Calcium":     db_food.get("calcium_mg", 0),
                        "Vitamin B12": db_food.get("vitamin_b12_mcg", 0),
                    }

                for nutrient, amount in nutrient_map.items():
                    aggregated[nutrient] = aggregated.get(nutrient, 0) + (amount * qty)

        return aggregated, moods

    def run(
        self,
        aggregated_nutrients: dict,
        days_logged: int,
        moods: list,
        profile_context: dict | None,
        rag_context: str = "",
    ) -> dict:
        """
        Calls the LLM to produce a deficiency report + overall summary.

        Returns a dict with keys: deficiencies (list), overall_summary (str)
        """
        profile_str = "Unknown"
        if profile_context:
            active = {k: v for k, v in profile_context.items() if v is not None}
            if active:
                profile_str = json.dumps(active, indent=2)

        completeness_note = ""
        if days_logged < 7:
            completeness_note = (
                f"IMPORTANT: The user only logged {days_logged}/7 days. "
                "State this in your summary and avoid harsh conclusions."
            )

        per_day = {k: round(v / days_logged, 1) for k, v in aggregated_nutrients.items()}
        vs_ref = {
            k: f"{per_day.get(k, 0)} / {DAILY_REFERENCE.get(k, '?')} (daily target)"
            for k in DAILY_REFERENCE
        }

        prompt = f"""
You are a Clinical Nutritionist AI specializing in Sri Lankan dietary patterns.
{completeness_note}

USER PROFILE:
{profile_str}

AGGREGATED NUTRIENTS ({days_logged} days total):
{json.dumps(aggregated_nutrients, indent=2)}

DAILY AVERAGE vs REFERENCE INTAKE:
{json.dumps(vs_ref, indent=2)}

MOODS REPORTED THIS WEEK:
{', '.join(moods) if moods else 'None'}

SUPPORTING FOOD CONTEXT FROM RAG DATABASE:
{rag_context if rag_context else 'Not available'}

INSTRUCTIONS:
1. Identify nutrient deficiencies from the daily averages vs reference intakes.
2. Tie each deficiency to the user's stated goals (from their profile).
3. Weave CBT-style coaching into the overall_summary if negative moods were reported.
4. NEVER shame the user. Focus on ADDING nutrients and building sustainable habits.
5. Reference specific Sri Lankan foods from the RAG context when making food_sources suggestions.

Respond STRICTLY in this JSON format with no markdown:
{{
    "deficiencies": [
        {{
            "nutrient": "Nutrient name",
            "daily_avg": "e.g. 8mg",
            "daily_target": "e.g. 18mg",
            "explanation": "Why this matters for their goals",
            "recommended_supplement": "Supplement name if needed",
            "food_sources": ["Sri Lankan food 1", "Sri Lankan food 2"]
        }}
    ],
    "overall_summary": "Compassionate, goal-oriented, CBT-infused weekly summary."
}}
"""

        try:
            response = _client.chat.completions.create(
                model="meta-llama/llama-3.3-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"[NutritionAgent] LLM call failed: {e}")
            return {
                "deficiencies": [],
                "overall_summary": "Analysis could not be completed due to an API error.",
            }
