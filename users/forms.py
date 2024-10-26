from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

#Creates a custom signup form that inherits the UserCreationForm class
class CustomSignupForm(UserCreationForm):
    #override settings for the password fields1
    password1 = forms.CharField(label = 'Enter a password',
                                widget= forms.PasswordInput)
    password2 = forms.CharField(label = 'Confirm password',
                                widget = forms.PasswordInput)

    #specifies the fields to be used
    class Meta:
        model = User
        fields = ['username', 'email','password1', 'password2']
        help_texts = {
        #clear reminder texts for input validation
        'username': None,
        }
