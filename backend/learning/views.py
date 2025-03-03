from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Quiz, Session
from .serializers import QuizSerializer, QuizMessageSerializer
from django.contrib.auth import get_user_model
import google.generativeai as genai
import os
from django.conf import settings
import json
from bs4 import BeautifulSoup
import logging
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .auth import SupabaseAuthentication

User = get_user_model()
logger = logging.getLogger(__name__)

@api_view(["POST"])
def create_quiz(request):
    user_id = request.data.get("user_id")

    if not user_id:
        return Response({"error": "User ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = QuizSerializer(data=request.data)
    if serializer.is_valid():
        quiz = serializer.save(user=user)
        
        # Create a session for this quiz
        Session.objects.create(
            user=user,
            category='quiz',
            title=quiz.title,
            quiz=quiz
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class QuizGenerationView(APIView):
    authentication_classes = [SupabaseAuthentication]
    permission_classes = [IsAuthenticated]

    def options(self, request, *args, **kwargs):
        response = Response()
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept"
        return response

    def post(self, request, *args, **kwargs):
        try:
            message = request.data.get("message")
            title = request.data.get("title")
            files = request.FILES.getlist("files", [])

            if not message or not title:
                return Response({
                    "error": "Message and title are required"
                }, status=status.HTTP_400_BAD_REQUEST)

            # Enhance the prompt for quiz generation
            quiz_prompt = f"{message}\nGenerate a quiz with multiple choice questions. Format the response as JSON with the following structure:\n"
            quiz_prompt += '{\n  "questions": [\n    {\n      "question": "Question text",\n      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],\n      "correct_answer": "Correct option"\n    }\n  ]\n}'

            # Call Gemini API
            response = self.call_gemini_api(quiz_prompt, files)
            
            if response.get("result") == "success":
                # Parse and save the quiz
                quiz_data = self.parse_quiz_response(response.get("text"))
                quiz = self.save_quiz_to_db(request.user, title, message, quiz_data, files)
                
                # Create a session for this quiz
                Session.objects.create(
                    user=request.user,
                    category='quiz',
                    title=quiz.title,
                    quiz=quiz
                )
                
                response_data = {
                    "result": "success",
                    "quiz_id": quiz.id,
                    "questions": quiz_data
                }
                
                response = Response(response_data, status=status.HTTP_201_CREATED)
                response["Access-Control-Allow-Origin"] = "*"
                response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept"
                return response
            
            error_response = Response(response, status=status.HTTP_400_BAD_REQUEST)
            error_response["Access-Control-Allow-Origin"] = "*"
            return error_response
            
        except Exception as e:
            logger.error(f"Error generating quiz: {e}")
            error_response = Response({
                "result": "error",
                "error_message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            error_response["Access-Control-Allow-Origin"] = "*"
            return error_response

    def call_gemini_api(self, message, files=None):
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if not google_api_key:
            raise ValueError("Google API key not found in environment variables")
            
        genai.configure(api_key=google_api_key)
        model = genai.GenerativeModel("gemini-1.5-pro")

        try:
            result = model.generate_content([message])
            return {"result": "success", "text": result.text}
        except Exception as e:
            return {"result": "error", "error_message": str(e)}

    def parse_quiz_response(self, response_text):
        try:
            # Clean and parse the response
            soup = BeautifulSoup(response_text, "html.parser")
            text = soup.get_text()
            # Extract JSON from the text
            json_str = text.strip()
            if json_str.startswith("```json"):
                json_str = json_str[7:-3]
            return json.loads(json_str)
        except Exception as e:
            logger.error(f"Error parsing quiz response: {e}")
            raise ValueError("Failed to parse quiz response")

    def save_quiz_to_db(self, user, title, prompt, questions, files):
        file_to_save = files[0] if files else None
        
        quiz = Quiz.objects.create(
            user=user,
            title=title,
            body=prompt,
            file=file_to_save,
            questions=questions
        )
        
        return quiz

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_quizzes(request):
    user = request.user
    quizzes = Quiz.objects.filter(user=user).order_by('-created_at')
    serializer = QuizSerializer(quizzes, many=True)
    return Response(serializer.data)

# Create your views here.
