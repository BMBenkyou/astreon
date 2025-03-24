from django.urls import path
from .views import ChatView,QuizGenerationView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='chat'),
    path('quiz/generate/',QuizGenerationView.as_view(), name='quiz'),

]