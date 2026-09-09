import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# We expect OPENROUTER_API_KEY to be set in the environment or .env
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def analyze_diet(diet_text: str, days_logged: int, aggregated_nutrients: dict, moods: list, profile: dict = None) -> dict:
    profile_str = "Unknown"
    if profile:
        active_traits = {k: v for k, v in profile.items() if v is not None}
        if active_traits:
            profile_str = json.dumps(active_traits, indent=2)

    completeness_warning = ""
    if days_logged < 7:
        completeness_warning = f"IMPORTANT (MACROFACTOR RULE): The user only logged {days_logged} out of 7 days. You MUST explicitly state in your overall_summary that this analysis is based on partial data and smooth the trend accordingly rather than making rigid accusations."

    prompt = f"""
    You are an expert AI Nutritionist and Cognitive Behavioral Coach. 
    You have been provided with deterministic nutritional data calculated by the backend. DO NOT guess the nutrients; use the provided 'Aggregated Nutrients' list.
    
    {completeness_warning}

    USER PROFILE:
    {profile_str}

    AGGREGATED NUTRIENTS (Total for {days_logged} days):
    {json.dumps(aggregated_nutrients, indent=2)}

    MOODS & TRIGGERS REPORTED THIS WEEK:
    {', '.join(moods) if moods else 'None reported'}

    INSTRUCTIONS (NOOM & CBT RULE):
    1. Identify lacking nutrients based on the Aggregated Nutrients and the user's profile.
    2. Provide an easy-to-understand explanation of why they need this nutrient, specifically tying it back to their chosen goals (e.g., if they selected "Lose weight" or "Manage stress", explain how this nutrient helps with those specific goals).
    3. If they reported negative moods (e.g., Stressed, Sad), weave cognitive-behavioral coaching into your 'overall_summary'. Explain how their mood might be driving their food choices and offer compassionate, guilt-free habit-building advice.
    4. NEVER use toxic "red/yellow/green" framing or calorie-shaming. Focus purely on ADDING nutrients and building sustainable habits that align with their stated goals.
    5. Directly acknowledge their specific goals (found in the USER PROFILE under dietary_goal) in your overall summary.

    Respond STRICTLY in JSON format matching the following structure exactly, with no additional text or markdown formatting:
    {{
        "deficiencies": [
            {{
                "nutrient": "Name of nutrient (e.g., Vitamin D, Iron)",
                "explanation": "Why this nutrient is needed (tailored to their profile) and what happens if you lack it.",
                "recommended_supplement": "Name of supplement",
                "food_sources": ["Source 1", "Source 2"]
            }}
        ],
        "overall_summary": "A compassionate, behavioral-focused summary of their week, tying their food choices to their reported moods (if any), and offering habit-building advice."
    }}

    Diet Input (For context):
    {diet_text}
    """

    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="meta-llama/llama-3.3-70b-instruct",
            response_format={"type": "json_object"},
            temperature=0.2,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"Error during AI analysis: {e}")
        # Return a fallback in case of API failure
        return {
            "deficiencies": [],
            "overall_summary": "We couldn't analyze your diet at this moment due to an error."
        }
