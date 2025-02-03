from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import Profile 

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    display_name = forms.CharField(max_length=50)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def clean_display_name(self):
        display_name = self.cleaned_data['display_name']
        if Profile.objects.filter(display_name=display_name).exists():
            raise ValidationError("Display name already taken")
        return display_name