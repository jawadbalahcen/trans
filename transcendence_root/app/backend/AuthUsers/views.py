from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password
from .models import CustomUser

@api_view(['POST'])
def register_user(request):
    data = request.data
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    if not all(field in data for field in required_fields):
        return Response({'error': 'Missing required fields'}, status=400)
    
    # Check for existing user
    if CustomUser.objects.filter(username=data['username']).exists():
        return Response({'error': 'Username already exists'}, status=400)
    
    # Create user
    user = CustomUser.objects.create(
        username=data['username'],
        email=data['email'],
        password=make_password(data['password']),
        full_name=data.get('full_name', ''),
        city=data.get('city', '')
    )
    
    # Auto-login after registration
    login(request, user)
    return Response({'message': 'Registration successful'}, status=201)

@api_view(['POST'])
def user_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Login successful'})
    return Response({'error': 'Invalid credentials'}, status=401)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data.copy()
        
        if 'image_link' in request.FILES:
            user.image_link = request.FILES['image_link']
        
        for field in ['full_name', 'username', 'email', 'city', 'avatar']:
            if field in data:
                setattr(user, field, data[field])
        
        user.save()
        return Response(UserSerializer(user).data)

class AuthCheckView(APIView):
    def get(self, request):
        return Response({
            'isLoggedIn': request.user.is_authenticated
        })

class CSRFTokenView(APIView):
    def get(self, request):
        return Response({'csrfToken': get_token(request)})

# @csrf_protect
# @csrf_exempt  # Remove or replace this decorator in production
# def register(request):
#     if request.method == 'POST':
#         if request.content_type == 'application/json':
#             try:
#                 data = json.loads(request.body)
#             except json.JSONDecodeError:
#                 return JsonResponse({'error': 'Invalid JSON'}, status=400)
#         else:
#             data = request.POST.dict()

#         if 'fullname' in data:
#             data['display_name'] = data.pop('fullname')

#         if 'password' in data:
#             data['password1'] = data['password']
#             data['password2'] = data['password']
#             data.pop('password', None)

#         city = data.pop('City', None)

#         form = CustomUserCreationForm(data)
#         if form.is_valid():
#             user = form.save()
#             user.email = form.cleaned_data['email']
#             user.save()

#             profile = Profile.objects.create(
#                 user=user, 
#                 display_name=form.cleaned_data['display_name']
#             )
#             if city:
#                 profile.city = city
#                 profile.save()

#             return JsonResponse({'status': 'success'})
#         else:
#             return JsonResponse({'errors': form.errors}, status=400)

#     return JsonResponse({'error': 'Invalid method'}, status=405)

# # @csrf_protect
# @csrf_exempt  # Remove this in production!
# def user_login(request):
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)

#         username = data.get('username')
#         password = data.get('password')

#         user = authenticate(request, username=username, password=password)
        
#         if user:
#             login(request, user)
#             user.profile.online = True
#             user.profile.save()
#             return JsonResponse({'status': 'success'})
#         else:
#             return JsonResponse({'error': 'Invalid credentials'}, status=401)
    
#     return JsonResponse({'error': 'Invalid method'}, status=405)


# def user_logout(request):
#     if request.user.is_authenticated:
#         request.user.profile.online = False
#         request.user.profile.save()
#     logout(request)
#     return JsonResponse({'status': 'success'})

# def update_profile(request):
#     if request.method == 'POST':
#         user = request.user
#         display_name = request.POST.get('display_name')
#         avatar = request.FILES.get('avatar')
#         if display_name:
#             if Profile.objects.filter(display_name=display_name).exclude(user=user).exists():
#                 return JsonResponse({'error': 'Display name taken'}, status=400)
#             user.profile.display_name = display_name
#         if avatar:
#             # Add validation for file type/size in production
#             user.profile.avatar = avatar
#         user.profile.save()
#         return JsonResponse({'status': 'success'})
#     return JsonResponse({'error': 'Invalid method'}, status=405)

# def add_friend(request):
#     if request.method == 'POST':
#         friend_username = request.POST.get('friend_username')
#         try:
#             friend = User.objects.get(username=friend_username)
#             request.user.profile.friends.add(friend.profile)
#             return JsonResponse({'status': 'success'})
#         except User.DoesNotExist:
#             return JsonResponse({'error': 'User not found'}, status=404)
#     return JsonResponse({'error': 'Invalid method'}, status=405)

# def get_match_history(request):
#     matches = MatchHistory.objects.filter(user=request.user).select_related('opponent', 'tournament')
#     data = []
#     for match in matches:
#         opponent_display_name = match.opponent.profile.display_name if hasattr(match.opponent, 'profile') else 'Unknown'
#         data.append({
#             'opponent': opponent_display_name,
#             'result': match.result,
#             'date': match.date.strftime('%Y-%m-%d %H:%M'),
#             'tournament': match.tournament.name if match.tournament else None
#         })
#     return JsonResponse(data, safe=False)

# def auth_check(request):
#     return JsonResponse({'isLoggedIn': request.user.is_authenticated})