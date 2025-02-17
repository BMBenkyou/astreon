from django.shortcuts import render
from django.http import HttpResponse


def test_view(request):
    return HttpResponse ("mimasaur? ikaw ba yan yes")

# Create your views here.
