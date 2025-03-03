from django.urls import path
from .views import create_quiz, get_quizzes, QuizGenerationView

urlpatterns = [
    path("quizzes/create/", create_quiz, name="create_quiz"),
    path("quizzes/generate/", QuizGenerationView.as_view(), name="generate_quiz"),
    path("quizzes/", get_quizzes, name="get_quizzes"),
]
