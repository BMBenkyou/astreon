from django.urls import path
from .views import ChatWithGeminiView,get_user_schedule,UserSessionsView,QuizListView,FlashcardListView

urlpatterns = [
    path('', ChatWithGeminiView.as_view(), name='chat_with_gemini'),
    path('schedule/<str:username>/',get_user_schedule, name="get_user_schedule"),
    path('session/', UserSessionsView.as_view(), name="user_sessions"),
    path('quizzes/<int:quiz_id>', QuizListView.as_view(), name='quiz-list'), 
    path('flashcards/<int:flashcard_id>', FlashcardListView.as_view(), name='flashcard-list'), 

]