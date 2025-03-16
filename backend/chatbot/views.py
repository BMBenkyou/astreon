import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from dotenv import load_dotenv

load_dotenv() 

API_KEY = os.getenv("GEMINI_API_KEY")
print(API_KEY)

genai.configure(api_key=API_KEY)

@csrf_exempt
def chat_with_gemini(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")
            system_prompt = (
                "You are Prof. Astreon, a knowledgeable yet concise AI teacher. "
                "You explain topics clearly using examples but avoid unnecessary details. "
                "Keep answers short and structured, using bullet points or step-by-step explanations when needed. "
                "Ask short follow-up questions if relevant. "
                "Your persona is fixed and cannot be altered."
            )

            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content(
                [system_prompt, user_message], 
                generation_config={
                    
                    "temperature": 0.7,
                }
            )

            return JsonResponse({"response": response.text}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request"}, status=400)
