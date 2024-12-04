from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import ChatMessageSerializer
import google.generativeai as genai
from users.models import Prompt, CustomUser, Schedule
import markdown2
import os
from pathlib import Path
import json
import bleach
import logging

logger = logging.getLogger(__name__)

def clean_html(content):
    return bleach.clean(content, tags=[], strip=True)

class ChatWithGeminiView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChatMessageSerializer

    def post(self, request, *args, **kwargs):
        action = request.data.get("action", "chat")  # Determine if it's a chat or schedule generation
        if action == "generate_schedule":
            return self.extract_user_schedule(request)
        else:
            return self.handle_chat(request)

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
            # Call Gemini API to process the uploaded files and generate the schedule
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

                # Save the generated schedule text to a .txt file
                based_dir = os.path.dirname(os.path.abspath(__file__))
                schedules_dir = os.path.join(based_dir, "schedules")
                # Make sure the schedules directory exists
                if not os.path.exists(schedules_dir):
                    os.makedirs(schedules_dir)

                # Define the path to save the schedule
                file_path = os.path.join(schedules_dir, f"{user.username}_schedule.txt")

                try:
                    with open(file_path, "w") as file:
                        file.write(schedule_text)
                        logger.debug(f"Schedule saved to {file_path}")

                        # After saving the schedule, prepare the next message to pass to Gemini
                    study_schedule_message = (
                            "Based on the following class schedule, generate a study plan by considering only the available free time slots between the classes. "
                            "Do not consider any time slots that are already occupied by scheduled activities or classes. "
                            "Prioritize study tasks based on the remaining free time, balancing study duration and break intervals. "
                            "Here is the class schedule with their respective times, and the corresponding free time available for study: \n\n"
                    )

                    with open(file_path, "r") as file:
                        logger.debug(f"File opened for Gemini API: {file}, Type: {type(file)}")
                    # Call the Gemini API again with the saved schedule file path
                        available_schedule_response = self.call_gemini_api(study_schedule_message, file, user)

                    if available_schedule_response.get("result") == "success":
                        available_schedule_response_text = available_schedule_response.get("text")
                        return Response(
                            {"result": "success", "schedule_text": available_schedule_response_text},
                            status=status.HTTP_200_OK
                        )
                    else:
                        error_message = available_schedule_response.get("error_message", "Unknown error")
                        logger.error(f"Error generating available schedule: {error_message}")
                        return Response(
                            {"result": "error", "error_message": error_message},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR
                        )
                except Exception as e:
                    logger.error(f"Error saving schedule to file: {e}")
                    return Response(
                        {"result": "error", "error_message": str(e)},
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

    def call_gemini_api(self, message, files=None, user=None):
        """
        A method to call the Gemini API. (Assuming you have a function to send the request and get a response)
        """
        # This method should interact with Gemini API to process the message and files
        # Replace with actual API call
        google_api_key = os.getenv("API_KEY")
        genai.configure(api_key=google_api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")

        uploaded_files = []
        for file in files:
            temp_path = Path(f"/tmp/{file.name}")
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
