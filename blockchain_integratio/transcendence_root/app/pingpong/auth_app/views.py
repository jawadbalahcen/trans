from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, CustomTokenObtainPairSerializer, UserSerializer
from .models import CustomUser
import logging

logger = logging.getLogger(__name__)

# Create your views here.

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            token = response.data['access']
            response.set_cookie(
                'access_token',
                token,
                max_age=24 * 60 * 60,  # 1 day in seconds
                httponly=True,
                samesite='Lax'
            )
            # Only return user data, token is in cookie
            response.data = {
                'user': response.data['user']
            }
        return response

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_object(self):
        return self.request.user

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    print("Received registration request:", request.data)
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                print("User created:", user.username)
                token = RefreshToken.for_user(user).access_token
                response = Response({
                    'user': {
                        'username': user.username,
                        'email': user.email,
                        'full_name': user.full_name,
                        'city': user.city
                    },
                    'message': 'User registered successfully'
                }, status=status.HTTP_201_CREATED)
                
                # Set JWT token in cookie
                response.set_cookie(
                    'access_token',
                    str(token),
                    max_age=24 * 60 * 60,  # 1 day in seconds
                    httponly=True,
                    samesite='Lax'
                )
                return response
            except Exception as e:
                print("Error creating user:", str(e))
                return Response({
                    'error': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def check_username(request, username):
    exists = CustomUser.objects.filter(username=username).exists()
    return Response({'exists': exists})
