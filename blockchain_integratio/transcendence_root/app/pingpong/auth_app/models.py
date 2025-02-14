from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

class CustomUser(AbstractUser):
    # id is automatically added by Django
    # username is already in AbstractUser
    # email is already in AbstractUser
    # password is already in AbstractUser
    
    full_name = models.CharField(max_length=255)
    city = models.CharField(max_length=100, blank=True, null=True)
    image_link = models.URLField(max_length=500, blank=True, null=True)
    
    # Make email required and unique
    email = models.EmailField(unique=True)
    
    # You can customize required fields
    REQUIRED_FIELDS = ['email', 'full_name']
    
    def __str__(self):
        return self.username

    # Add your custom fields here
    # For example:
    # profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    pass
