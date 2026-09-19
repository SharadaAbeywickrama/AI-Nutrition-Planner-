"""
Coach Agent
-----------
Responsibility: Acts as a personal Wellness Coach. Receives the nutrition
analysis and sleep report as input and generates a short, motivational,
goal-specific coaching message with 3 habit nudges for the week ahead.
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


class CoachAgent:
    """
    Synthesises the nutrition deficiency report and sleep impact report into a
    personalised, CBT-informed weekly coaching message.
    """

    def run(
        self,
        nutrition_report: dict,
        sleep_report: dict,
        profile_context: dict | None,
        moods: list,
    ) -> dict:
        """
        Returns a coaching dict with keys:
          weekly_message (str), habit_nudges (list[str]), encouragement (str)
        """
        profile_str = "Not provided"
        if profile_context:
            active = {k: v for k, v in profile_context.items() if v is not None}
            if active:
                profile_str = json.dumps(active, indent=2)

        deficiencies_summary = ""
        if nutrition_report.get("deficiencies"):
            items = [d["nutrient"] for d in nutrition_report["deficiencies"]]
            deficiencies_summary = f"Key deficiencies this week: {', '.join(items)}"
        else:
            deficiencies_summary = "No critical deficiencies detected."

        sleep_summary = sleep_report.get("summary", "Sleep analysis not available.")
        sleep_risk = sleep_report.get("risk_level", "Unknown")

        prompt = f"""
You are a warm, motivating Wellness Coach who specialises in Sri Lankan food culture.
You have received the weekly nutritional analysis and sleep report for a user.
Your job is to write a short, compassionate weekly coaching message.

USER PROFILE:
{profile_str}

MOODS REPORTED THIS WEEK:
{', '.join(moods) if moods else 'No moods reported — user seems consistent!'}

NUTRITION SUMMARY:
{deficiencies_summary}
Overall: {nutrition_report.get('overall_summary', '')}

SLEEP IMPACT:
Risk Level: {sleep_risk}
{sleep_summary}

YOUR TASK:
1. Write a warm, personal weekly_message (2-3 sentences) that acknowledges their effort.
2. Create exactly 3 specific, actionable habit_nudges for the coming week.
   - Each nudge should reference a real Sri Lankan food or cultural habit.
   - Each nudge should connect to either their nutrition gap or sleep risk.
3. Write a short encouragement sentence to close.
4. NEVER use shaming language. Use "adding" not "cutting". Use "building" not "fixing".

Respond STRICTLY in this JSON format with no markdown:
{{
    "weekly_message": "2-3 sentence warm coaching message.",
    "habit_nudges": [
        "Nudge 1: specific, actionable, culturally grounded",
        "Nudge 2: specific, actionable, culturally grounded",
        "Nudge 3: specific, actionable, culturally grounded"
    ],
    "encouragement": "One uplifting closing sentence."
}}
"""

        try:
            response = _client.chat.completions.create(
                model="meta-llama/llama-3.3-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.5,
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"[CoachAgent] LLM call failed: {e}")
            return {
                "weekly_message": "Keep up the great work tracking your meals!",
                "habit_nudges": [
                    "Add a bowl of Kola Kenda in the morning for micronutrients.",
                    "Try Kurakkan roti instead of white bread for more fiber.",
                    "Have a warm glass of milk with turmeric before bed for better sleep.",
                ],
                "encouragement": "Every meal you track is a step toward your goals!",
            }
