from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

def ask_ai(question: str):
    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=question,
        )

        return response.text

    except Exception as e:
        return f"AI Error: {str(e)}"