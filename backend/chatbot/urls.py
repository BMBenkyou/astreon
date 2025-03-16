from django.contrib import admin
from django.urls import path,include
from .views import chat_with_gemini

urlpatterns = [
    path('ai-chat/',chat_with_gemini, name='chat_with_gemini'),
]