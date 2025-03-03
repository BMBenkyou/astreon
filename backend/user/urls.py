from django.contrib import admin
from django.urls import path,include
from . views import get_csrf_token
urlpatterns = [
    path("get-csrf-token/", get_csrf_token, name="get_csrf_token"),
]
