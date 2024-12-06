from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import ChatMessageSerializer,SessionSerializer,QuizSerializer
import google.generativeai as genai
from users.models import Prompt, CustomUser,StudyPlan,Quiz,Session 
import markdown2
from datetime import datetime
import os
from pathlib import Path
import json
import bleach
import logging
import re 
from django.http import JsonResponse, Http404
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from bs4 import BeautifulSoup
from django.conf import settings
from django.http import JsonResponse, HttpResponseNotFound


logger = logging.getLogger(__name__)

def clean_html(content):
    return bleach.clean(content, tags=[], strip=True)

class ChatWithGeminiView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatMessageSerializer

    def post(self, request, *args, **kwargs):
        action = request.data.get("action", "chat") #determine which action the user wants 
        if action == "generate_schedule":
            return self.extract_user_schedule(request)
        
        elif action == "generate_quiz":
            return self.generate_quiz(request)
        else:
            return self.handle_chat(request)

    
    def generate_quiz(self, request):
        user = request.user
        files = request.FILES.getlist("files")  # Get list of files
        images = request.FILES.getlist("images")  # Get list of images
        title = request.data.get("fname")  # Quiz title
        quiz_prompt = request.data.get("lname")  # Quiz prompt
        quiz_prompt += " Provide the response in JSON format, structured as a list of questions, where each question includes a 'question' field and an 'answers' field. The 'answers' field should be a list of four answer options, with one marked as correct."
        print(quiz_prompt)


        if not title:
            return Response(
                {"result": "error", "error_message": "Title is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not quiz_prompt:
            return Response(
                {"result": "error", "error_message": "Quiz prompt is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not files and not images:
            return Response(
                {"result": "error", "error_message": "No files or images uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Call the Gemini API
        try:
            response = self.call_gemini_api(quiz_prompt, files + images, user)
        except Exception as e:
            logger.error(f"Error calling Gemini API: {e}")
            return Response(
                {"result": "error", "error_message": "Failed to generate quiz."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Save quiz if API response is successful
        if response.get("result") == "success":
            try:
                self.save_quiz_to_db(
                    user=user,
                    quiz_title=title,
                    user_prompt=quiz_prompt,
                    response=response.get("text"),
                    files=files,
                    images=images,
                )
                return Response(response, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Error saving quiz: {e}")
                return Response(
                    {"result": "error", "error_message": "Failed to save quiz."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return Response(response, status=status.HTTP_200_OK)

    def save_quiz_to_db(self, user, quiz_title, user_prompt, response, files, images):

        soup = BeautifulSoup(response, "html.parser")
        plain_text = soup.get_text()
        quiz_response_formatted = plain_text.strip("json").strip()
        """Save quiz data to the database."""
        # Select the first file or image if available
        file_to_save = files[0] if files else None
        image_to_save = images[0] if images else None

        # Clean response content before saving
    

        # Create and save quiz
        quiz = Quiz(
            user=user,
            title=quiz_title,
            body=user_prompt,
            file=file_to_save,
            image=image_to_save,
            questions=quiz_response_formatted,
        )
        quiz.save()

        session = Session(
                    user=user,
                    category="quiz",
                    title=quiz_title,
                    quiz=quiz,
                )
        session.save()

        return Response({
        'quiz_id': quiz.id,
        'session_id': session.id,
        'session_title': session.title,
        'session_category': session.category,
    })
        logger.debug(f"Session created for {quiz_title} under quiz category.")
        logger.debug("Quiz saved successfully.")



    def handle_chat(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_message = serializer.validated_data.get("message")
        files = request.FILES.getlist("files")
        user = request.user

        logger.debug(f"Chat Message: {user_message} from {user.username}")

        response = self.call_gemini_api(user_message, files, user)

        if response.get("result") == "success":
            self.save_prompt_to_db(user_message, response.get("text"), user)
        return Response(response, status=status.HTTP_200_OK)

    def extract_user_schedule(self, request):
        user = request.user
        files = request.FILES.getlist("files")  # Get uploaded files

        if not files:
            return Response(
                {"result": "error", "error_message": "No files uploaded."},
                status=status.HTTP_400_BAD_REQUEST
            )

        logger.debug(f"Generating schedule for user: {user.username} with files: {[file.name for file in files]}")

        try:
            schedule_message = (
                "Scan the image and focus only on the colored table sections corresponding to the schedule. "
                "For each column (day of the week), extract the schedule, ensuring that: "
                "1. All time blocks for the day are captured without omissions. "
                "2. Time blocks are consolidated for each unique subject. For example: "
                "- If 'Physical Activities Toward Health-Fit 4' runs from 7:00AM to 9:00AM, it should be grouped as a single entry: '7:00AM - 9:00AM Physical Activities Toward Health-Fit 4.' "
                "- Avoid repeating or splitting the same subject within the same time range. "
                "The output should include the day, time, subject, and location. "
                "For example: "
                "- Monday: 7:00AM - 9:00AM Physical Activities Toward Health-Fit 4 (SRDB1) "
                "- Monday: 11:30AM - 1:00PM Reading Visual Art (TBA) "
                "Ensure that all time blocks are non-overlapping, unique, and grouped logically. Do not skip any subjects, and make sure the schedule is fully captured in a clean, readable format."
            )

            schedule_response = self.call_gemini_api(schedule_message, files, user)

            if schedule_response.get("result") == "success":
                schedule_text = schedule_response.get("text")
                logger.debug(f"Generated Schedule: {schedule_text}")

                study_schedule_message = (
            "Based on the following class schedule, generate a study plan that considers only the free time slots available between the scheduled classes. "
            "Start the plan from tomorrow and continue until the end of the week. "
            "Include the date for each day in the output. "
            "Do not include any time slots already occupied by scheduled activities or classes. "
            "Prioritize study tasks during the remaining free time, balancing study durations with adequate break intervals. "
            "The output should be in JSON format and follow this example format:\n\n"
            '{\n'
            '  "2024-12-04": [\n'
            '    { "time": "9:00 AM - 11:30 AM", "description": "Study Algorithms and Complexity or Readings in Philippine History" },\n'
            '    { "time": "1:00 PM - 2:30 PM", "description": "Shorter subject or review" },\n'
            '    { "time": "6:00 PM onwards", "description": "Longer study block (flexible)" }\n'
            '  ]\n'
            '}\n\n'
            "Here is the class schedule:\n\n"
            f"{schedule_text}"
        )

                available_schedule_response = self.call_gemini_api(study_schedule_message, [], user)


                        
                if available_schedule_response.get("result") == "success":
                    study_plan_text = available_schedule_response.get("text")
                    logger.debug(f"Generated Study Plan: {study_plan_text}")


                    schedules_dir= os.path.join(settings.BASE_DIR, "schedules")
                    if not os.path.exists(schedules_dir):
                        os.makedirs(schedules_dir)
                    
                    file_name = f"{user.username}_study_plan"
                    schedule_file_path = os.path.join(schedules_dir,file_name+".json")

                    soup = BeautifulSoup(study_plan_text, "html.parser")
                    plain_text = soup.get_text()
                    study_plan_text_formatted = plain_text.strip("json").strip()

                    with open(schedule_file_path, "w") as file:
                        file.write(study_plan_text_formatted)

                    # Parse and save the study plan to the database
                    self.save_study_plan_to_db(study_plan_text, user)

                    return Response(
                        {"result": "success", 
                        "schedule_text": schedule_text,
                        "study_plan_text": study_plan_text},
                        status=status.HTTP_200_OK
                    )
                else:
                    error_message = available_schedule_response.get("error_message", "Unknown error")
                    logger.error(f"Error generating available schedule: {error_message}")
                    return Response(
                        {"result": "error", "error_message": error_message},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

            else:
                error_message = schedule_response.get("error_message", "Unknown error")
                logger.error(f"Error generating schedule: {error_message}")
                return Response(
                    {"result": "error", "error_message": error_message},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        except Exception as e:
            logger.error(f"Error generating schedule: {e}")
            return Response(
                {"result": "error", "error_message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 

    def save_study_plan_to_db(self, study_plan_text, user):
        """
        Parses and saves the study plan text to the database.
        """
        try:
           
            from django.db import transaction

            logger.debug(f"Received study plan text: {study_plan_text}")
            soup = BeautifulSoup(study_plan_text, "html.parser")
            records_created = 0

            with transaction.atomic():
                for day_section in soup.find_all("p"):
                    day_name = day_section.get_text(strip=True).replace(":", "").lower()[:3]
                    tasks = day_section.find_next("ul")
                    if tasks:
                        for task_item in tasks.find_all("li"):
                            task_text = task_item.get_text(strip=True)
                            logger.debug(f"Parsed task: {task_text} for day: {day_name}")
                            match = re.match(r"(\d{1,2}:\d{2}(?:AM|PM)) - (\d{1,2}:\d{2}(?:AM|PM)) (.+)", task_text)
                            if match:
                                start_time = datetime.strptime(match.group(1), "%I:%M%p").time()
                                end_time = datetime.strptime(match.group(2), "%I:%M%p").time()
                                task = match.group(3)

                                existing = StudyPlan.objects.filter(
                                    user=user,
                                    day_of_the_week__icontains=day_name,
                                    start_time__gte=start_time,
                                    end_time__lte=end_time,
                                    task=task,
                                ).exists()
                                if not existing:
                                    study_plan = StudyPlan(
                                        user=user,
                                        day_of_the_week=day_name,
                                        start_time=start_time,
                                        end_time=end_time,
                                        task=task,
                                    )
                                    try:
                                        study_plan.full_clean()
                                        study_plan.save()
                                        records_created += 1
                                    except Exception as e:
                                        logger.error(f"Error validating or saving study plan: {e}")

            if records_created > 0:
                logger.debug(f"Successfully saved {records_created} study plan records to the database.")
            else:
                logger.warning("No new study plan records were created. Possible duplicates or empty input.")

        except Exception as e:
            logger.error(f"Error saving study plan to DB: {e}")

    def call_gemini_api(self, message, files=None, user=None):
        """
        A method to call the Gemini API. 
        """
        google_api_key = os.getenv("API_KEY")
        genai.configure(api_key=google_api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")

        uploads_dir = os.path.join(settings.BASE_DIR, "uploads")
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
        uploaded_files = []
        for file in files:
            if isinstance(file, (str, Path)):  # File paths
                file = open(file, "rb")
                temp_path = file.name  # Use the real file path
            else:
                temp_path = Path(uploads_dir)/file.name 
                with temp_path.open("wb") as temp_file:
                    for chunk in file.chunks():
                        temp_file.write(chunk)

            uploaded_file = genai.upload_file(temp_path)
            uploaded_files.append(uploaded_file)

        try:
            result = model.generate_content(
                [*uploaded_files, "\n\n", message]
            )
            result_text = markdown2.markdown(result.text)

            return {"result": "success", "text": result_text}

        except Exception as e:
            error_data = {
                "result": "error",
                "error_message": str(e),
                "status": "failed"
            }
            return error_data


    def save_prompt_to_db(self, user_prompt, response, user):
        if self.request.user.is_authenticated:
            try:
                clean_response = clean_html(response)
                prompt = Prompt(
                    user=user,
                    user_prompt=user_prompt,
                    bot_response=clean_response
                )
                prompt.save()
                logger.debug("Prompt saved successfully!")
            except Exception as e:
                logger.error(f"Error saving prompt: {e}")
        else:
            return {"result": "error", "error_message": "User is not authenticated", "status": "failed"}




def get_user_schedule(request, username):
    schedules_dir = os.path.join(settings.BASE_DIR, "schedules")
    file_name = f"{username}_study_plan.json"
    schedule_file_path = os.path.join(schedules_dir, file_name)

    if os.path.exists(schedule_file_path):
        with open(schedule_file_path, "r") as file:
            study_plan_data = file.read()
        return JsonResponse(eval(study_plan_data))  # Convert string to JSON and return
    else:
        return HttpResponseNotFound("Schedule not found.")


class UserSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = Session.objects.filter(user=request.user)
        serializer = SessionSerializer(sessions, many=True)
        return Response(serializer.data)




class QuizListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        # Fetch quizzes for the authenticated user
        quizzes = Quiz.objects.filter(user=request.user)
        serializer = QuizSerializer(quizzes, many=True)
        lookup_field = 'id'
        return Response(serializer.data)