from django.urls import path, include
from .views import signup
from rest_framework.routers import DefaultRouter
from .views import UserViewSet

# Create a router and register the UserViewSet
router = DefaultRouter()
router.register(r'api/users', UserViewSet, basename='user')

# Combine the existing signup route with the DRF routes
urlpatterns = [
    path("signup/", signup, name="signup"),  # Existing signup route
    path('', include(router.urls)),          # DRF routes, e.g., /api/users/ and /api/users/<id>/
]
