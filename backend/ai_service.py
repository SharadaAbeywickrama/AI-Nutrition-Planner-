import os
import json
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

# We expect GEMINI_API_KEY to be set in the environment or .env
client = genai.Client()

def analyze_diet(diet_text: str) -> dict:
    prompt = f"""
    You are an expert AI Nutritionist. 
    Analyze the following weekly diet input from a user and identify any missing or lacking nutrients. 
    For each lacking nutrient, provide an easy-to-understand explanation of why it is important, recommend a supplement (or supplement type) if necessary, and suggest some natural food sources.

    Respond STRICTLY in JSON format matching the following structure exactly, with no additional text or markdown formatting:
    {{
        "deficiencies": [
            {{
                "nutrient": "Name of nutrient (e.g., Vitamin D, Iron)",
                "explanation": "Why this nutrient is needed and what happens if you lack it.",
                "recommended_supplement": "Name of supplement",
                "food_sources": ["Source 1", "Source 2"]
            }}
        ],
        "overall_summary": "A brief, friendly summary of their weekly diet and overall advice."
    }}

    Diet Input:
    {diet_text}
    """

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"Error during AI analysis: {{e}}")
        # Return a fallback in case of API failure
        return {
            "deficiencies": [],
            "overall_summary": "We couldn't analyze your diet at this moment due to an error."
        }
