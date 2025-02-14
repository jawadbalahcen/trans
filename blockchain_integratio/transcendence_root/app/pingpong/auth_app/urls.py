from django.urls import path
from .views import register_user, UserDetailView, check_username, CustomTokenObtainPairView

urlpatterns = [
    path('register/', register_user, name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('check-username/<str:username>/', check_username, name='check_username'),
] 