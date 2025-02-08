from django.db import models
# from django.contrib.auth.models import User

# Create your models here.


# ======================================

from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    fullname = models.CharField(max_length=255, blank=True)
    City = models.CharField(max_length=100, blank=True)
    avatar = models.CharField(max_length=100, blank=True)
    image_link = models.ImageField(upload_to='avatars/', null=True, blank=True)
        
    def __str__(self):
        return self.username


# =============================================

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     display_name = models.CharField(max_length=50, unique=True)
#     avatar = models.ImageField(upload_to='avatars/', default='default_avatar.png')  # Requires Pillow
#     online = models.BooleanField(default=False)
#     friends = models.ManyToManyField('self', symmetrical=False, blank=True)

# class Tournament(models.Model):
#     name = models.CharField(max_length=100)
#     start_date = models.DateTimeField(auto_now_add=True)
#     participants = models.ManyToManyField(User, through='TournamentParticipant')

# class TournamentParticipant(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)

# class MatchHistory(models.Model):
#     user = models.ForeignKey(
#         User, 
#         on_delete=models.CASCADE, 
#         related_name='match_histories_as_user'  # Fixes clash
#     )
#     opponent = models.ForeignKey(
#         User, 
#         on_delete=models.CASCADE, 
#         related_name='match_histories_as_opponent'  # Fixes clash
#     )
#     tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True)
#     result = models.CharField(max_length=10)
#     date = models.DateTimeField(auto_now_add=True)
