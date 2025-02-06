from django.db import models
from django.contrib.auth.models import User

# Create your models here.


# ======================================

class CustomUser(AbstractUser):
	email = models.EmailField(unique=True)
	username = models.CharField(max_length=150, unique=True)
	description = models.CharField(max_length=150, default='')
	is42 = models.BooleanField(default=False)
	isOfficial = models.BooleanField(default=False)
	photo = models.ImageField(upload_to='', default='default.jpg')
	follows = ArrayField(models.IntegerField(), default=list)
	friendRequests = ArrayField(models.IntegerField(), default=list)
	status = models.CharField(max_length=150, default="online")
	nbNewNotifications = models.IntegerField(default=0)
	blockedUsers = ArrayField(models.IntegerField(), default=list)
	player = models.OneToOneField(Player, on_delete=models.CASCADE, related_name='user', null=True)
	favoritesChannels = ArrayField(models.TextField(), default=list)
	resetPasswordID = models.CharField(max_length=150, default='')
	emailAlerts = models.BooleanField(default=True)

	# Use the custom manager
	objects = CustomUserManager()

	class Meta:
		# Allow to change the AUTH_USER_MODEL in settings.py
		swappable = 'AUTH_USER_MODEL'

	def __str__(self):
		return self.username
	
	def save(self, *args, **kwargs):
		super(CustomUser, self).save(*args, **kwargs)
	
	def set_status(self, status):
		self.status = status
		self.save()

# =============================================

# class Profile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     display_name = models.CharField(max_length=50, unique=True)
#     avatar = models.ImageField(upload_to='avatars/', default='default_avatar.png')  # Requires Pillow
#     online = models.BooleanField(default=False)
#     friends = models.ManyToManyField('self', symmetrical=False, blank=True)

class Tournament(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(User, through='TournamentParticipant')

class TournamentParticipant(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)

class MatchHistory(models.Model):
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='match_histories_as_user'  # Fixes clash
    )
    opponent = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='match_histories_as_opponent'  # Fixes clash
    )
    tournament = models.ForeignKey(Tournament, on_delete=models.SET_NULL, null=True)
    result = models.CharField(max_length=10)
    date = models.DateTimeField(auto_now_add=True)
