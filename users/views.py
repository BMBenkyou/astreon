from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import CustomSignupForm
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from django.contrib.auth import get_user_model

# Existing signup view
def signup(request):
    if request.method == "POST":
        form = CustomSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
        else:
            # Return the form with errors
            return render(request, 'registration/SignUp.html', {'form': form})
    else:
        form = CustomSignupForm()
    return render(request, 'registration/SignUp.html', {'form': form})

# New DRF ViewSet for API
class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Optionally, customize the queryset
        return super().get_queryset()
