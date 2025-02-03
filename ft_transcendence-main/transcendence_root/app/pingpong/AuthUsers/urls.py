
from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),  # Add name='register'
    path('login/', views.user_login, name='user_login'),  # Add name='user_login'
    path('logout/', views.user_logout, name='user_logout'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('friends/add/', views.add_friend, name='add_friend'),  # Add name='add_friend'
    path('match-history/', views.get_match_history, name='get_match_history'),
    path('auth-check/', views.auth_check, name='auth_check'),
]