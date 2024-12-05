from django.urls import path
from .views import ChatWithGeminiView,get_user_schedule

urlpatterns = [
    path('', ChatWithGeminiView.as_view(), name='chat_with_gemini'),
    path('schedule/<str:username>/',get_user_schedule, name="get_user_schedule"),

]