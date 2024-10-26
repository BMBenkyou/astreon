from django.shortcuts import render, redirect
from django.contrib.auth import login
from . forms import CustomSignupForm


def signup(request):
    if request.method == "POST":
        form = CustomSignupForm(request.POST)
        
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomSignupForm()
    return render(request, 'registration/SignUp.html', {'form':form})
