from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from .forms import CustomUserCreationForm
from .models import Profile, Tournament, MatchHistory
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

# @csrf_protect
@csrf_exempt  # Remove this in production!
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        form = CustomUserCreationForm(data)
        
        if form.is_valid():
            user = form.save()
            user.email = form.cleaned_data['email']
            user.save()
            Profile.objects.create(
                user=user, 
                display_name=form.cleaned_data['display_name']
            )
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    
    return JsonResponse({'error': 'Invalid method'}, status=405)

# @csrf_protect
@csrf_exempt  # Remove this in production!
def user_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user)
            user.profile.online = True
            user.profile.save()
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    
    return JsonResponse({'error': 'Invalid method'}, status=405)


def user_logout(request):
    if request.user.is_authenticated:
        request.user.profile.online = False
        request.user.profile.save()
    logout(request)
    return JsonResponse({'status': 'success'})

def update_profile(request):
    if request.method == 'POST':
        user = request.user
        display_name = request.POST.get('display_name')
        avatar = request.FILES.get('avatar')
        if display_name:
            if Profile.objects.filter(display_name=display_name).exclude(user=user).exists():
                return JsonResponse({'error': 'Display name taken'}, status=400)
            user.profile.display_name = display_name
        if avatar:
            # Add validation for file type/size in production
            user.profile.avatar = avatar
        user.profile.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'error': 'Invalid method'}, status=405)

def add_friend(request):
    if request.method == 'POST':
        friend_username = request.POST.get('friend_username')
        try:
            friend = User.objects.get(username=friend_username)
            request.user.profile.friends.add(friend.profile)
            return JsonResponse({'status': 'success'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    return JsonResponse({'error': 'Invalid method'}, status=405)

def get_match_history(request):
    matches = MatchHistory.objects.filter(user=request.user).select_related('opponent', 'tournament')
    data = []
    for match in matches:
        opponent_display_name = match.opponent.profile.display_name if hasattr(match.opponent, 'profile') else 'Unknown'
        data.append({
            'opponent': opponent_display_name,
            'result': match.result,
            'date': match.date.strftime('%Y-%m-%d %H:%M'),
            'tournament': match.tournament.name if match.tournament else None
        })
    return JsonResponse(data, safe=False)

def auth_check(request):
    return JsonResponse({'isLoggedIn': request.user.is_authenticated})