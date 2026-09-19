"""
Sleep Agent
-----------
Responsibility: Analyse the user's food log for foods and eating patterns
(timing, sugar content, caffeine-heavy items) that are known to affect sleep
quality. Returns a sleep impact report with actionable suggestions.
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

# Known sleep disruptors — checked against food names case-insensitively
SLEEP_DISRUPTORS = [
    "tea", "coffee", "cola", "energy drink",
    "sugar", "candy", "chocolate", "biscuit",
    "fried", "spicy", "alcohol",
]

# Known sleep promoters
SLEEP_PROMOTERS = [
    "banana", "kola kenda", "gotukola", "milk",
    "fish", "tuna", "kiri bath", "oats",
    "pumpkin", "almond", "walnut",
]


class SleepAgent:
    """
    Analyses the food log for sleep-affecting patterns and calls the LLM to
    produce a structured sleep-impact report.
    """

    def _detect_patterns(self, daily_logs: list, food_database: list) -> dict:
        """Quickly classify foods in the log as disruptors or promoters."""
        disruptors_found: list[str] = []
        promoters_found: list[str] = []
        total_sugar_g: float = 0.0

        for log in daily_logs:
            foods = getattr(log, "foods", None) or (log.get("foods", []) if isinstance(log, dict) else [])
            for item in foods:
                food_id = getattr(item, "food_id", None) or (item.get("food_id") if isinstance(item, dict) else None)
                qty = getattr(item, "quantity_multiplier", 1.0) or (item.get("quantity_multiplier", 1.0) if isinstance(item, dict) else 1.0)

                db_food = next(
                    (f for f in food_database if str(f["id"]) == str(food_id)),
                    None,
                )
                if not db_food:
                    continue

                name_lower = db_food.get("name", "").lower()
                total_sugar_g += db_food.get("sugar_g", 0) * qty

                if any(d in name_lower for d in SLEEP_DISRUPTORS) and name_lower not in disruptors_found:
                    disruptors_found.append(db_food["name"])
                if any(p in name_lower for p in SLEEP_PROMOTERS) and name_lower not in promoters_found:
                    promoters_found.append(db_food["name"])

        return {
            "disruptors": disruptors_found,
            "promoters": promoters_found,
            "total_sugar_g": round(total_sugar_g, 1),
        }

    def run(self, daily_logs: list, food_database: list, days_logged: int) -> dict:
        """
        Returns a sleep impact report dict with keys:
          risk_level (str), disruptors (list), promoters (list), tips (list), summary (str)
        """
        patterns = self._detect_patterns(daily_logs, food_database)

        prompt = f"""
You are a Sleep & Nutrition expert specialising in Sri Lankan dietary habits.
Analyse the following food patterns for sleep quality impact over {days_logged} days.

DETECTED SLEEP DISRUPTORS IN LOG: {json.dumps(patterns['disruptors']) or 'None'}
DETECTED SLEEP PROMOTERS IN LOG:  {json.dumps(patterns['promoters']) or 'None'}
TOTAL SUGAR CONSUMED ({days_logged} days): {patterns['total_sugar_g']}g

TASK:
1. Assess the overall sleep risk level: "Low", "Moderate", or "High".
2. Explain how the disruptors affect sleep (e.g., late-night sugar spikes REM disruption).
3. Recommend 3 specific, culturally-relevant Sri Lankan foods that promote better sleep.
4. Give 3 practical tips to improve sleep through diet.

Respond STRICTLY in this JSON format with no markdown:
{{
    "risk_level": "Low | Moderate | High",
    "disruptors_found": {json.dumps(patterns['disruptors'])},
    "promoters_found": {json.dumps(patterns['promoters'])},
    "tips": ["Tip 1", "Tip 2", "Tip 3"],
    "recommended_foods": ["Food 1", "Food 2", "Food 3"],
    "summary": "A concise sleep-diet correlation summary."
}}
"""

        try:
            response = _client.chat.completions.create(
                model="meta-llama/llama-3.3-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.3,
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"[SleepAgent] LLM call failed: {e}")
            return {
                "risk_level": "Unknown",
                "disruptors_found": patterns["disruptors"],
                "promoters_found": patterns["promoters"],
                "tips": [],
                "recommended_foods": [],
                "summary": "Sleep analysis could not be completed.",
            }
