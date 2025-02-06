import re
import requests
import imghdr

from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect
from .forms import CustomUserCreationForm
from .models import Profile, Tournament, MatchHistory
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from PIL import Image
from io import BytesIO
from django.core.files import File
from django.core.files.base import ContentFile
from django.shortcuts import redirect
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.core.files.storage import default_storage
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token
from django.core.mail import send_mail
from django.shortcuts import render
from django.http import JsonResponse
import urllib.request, json, base64, uuid
from datetime import datetime

def authenticate_custom_user(email, password):
	User = get_user_model()

	try:
		user = User.objects.get(email=email)
		if user.check_password(password):
			return user
		else:
			return 'passwordError'
	except User.DoesNotExist:
		return 'emailError'

@ensure_csrf_cookie
def sign_in(request):
	# if request.method == 'GET':
	# 	get_token(request)
	# 	return render(request, 'base.html')

	elif request.method == 'POST':
		# Get the data
		data = json.loads(request.body)
		email = data.get('email')
		password = data.get('password')

		# Authenticate the user
		user = authenticate_custom_user(email=email, password=password)

		if user == 'emailError':
			return JsonResponse({"success": False, "email": "Invalid email"}, status=401)
		elif user == 'passwordError':
			return JsonResponse({"success": False, "password": "Invalid password"}, status=401)
		else:
			login(request, user)

			# Update the user status
			user.set_status("online")

			# Send an email to the user	
			if user.emailAlerts:
				now = datetime.now()
				date = now.strftime("%Y-%m-%d")
				time = now.strftime("%H:%M:%S")
			
				message = f"""
				
                
                
                            <p>Hello <b>{user.username}</b>,</p>
				
				"""
				
				

			return JsonResponse({"success": True, "message": "Successful login"}, status=200)


@ensure_csrf_cookie
def sign_up(request):
	if request.method == 'GET':
		get_token(request)
		return render(request, 'base.html')
	
	elif request.method == 'POST':
		# Get the data
		data = json.loads(request.body)
		username = data.get('username')
		email = data.get('email')
		password = data.get('password')

		try:
			validate_email(email)
		except ValidationError:
			return JsonResponse({"success": False, "email": "Invalid email format"}, status=401)
		
		if CustomUser.objects.filter(email=email).exists():
			return JsonResponse({"success": False, "email": "This email is already taken"}, status=401)
		
		if CustomUser.objects.filter(username=username).exists():
			return JsonResponse({"success": False, "username": "This username is already taken"}, status=401)
		elif not re.match('^[a-zA-Z0-9-]*$', username):
			return JsonResponse({"success": False, "username": "This username cannot contain special characters"}, status=401)
		elif len(username) < 4:
			return JsonResponse({"success": False, "username": "Your username is too short (4 characters minimum)"}, status=401)
		elif len(username) > 20:
			return JsonResponse({"success": False, "username": "Your username is too long (20 characters maximum)"}, status=401)
		# elif containBadwords(username):
		# 	return JsonResponse({"success": False, "username": "This username contains inappropriate words"}, status=401)

		# Create the user
		user = CustomUser.objects.create_user(
				username=username,
				email=email,
				password=password)
		
		user.save()

		# Login the user
		login(request, user)

		user.set_status("online")
		
		# Send an email to the user
		if user.emailAlerts:
			message = f"""
			
            
            <p>Hello <b>{user.username}</b>,</p>
			
			</p>
			"""
		

        #[placeholder]

		return JsonResponse({"success": True, "message": "Successful sign up"}, status=200)



@ensure_csrf_cookie
def profile(request, username):
	if request.method == 'GET':
		return render(request, 'base.html')

	elif request.method == 'POST':
		if not request.user.is_authenticated:
			return JsonResponse({"success": False, "message": "The user is not authenticated"}, status=401)
		elif (request.user.username != username):
			return JsonResponse({"success": False, "message": "You are not allowed to modify this profile"}, status=401)
		
		# Get the data
		data = json.loads(request.body)
		new_username = data.get('new_username')
		new_description = data.get('new_description')
		photo = data.get('photo')
		new_email = data.get('new_email')
		new_password = data.get('new_password')
		emailAlerts = data.get('emailAlerts')

		# Validate the email alerts
		if emailAlerts is not None:
			if emailAlerts not in [True, False]:
				return JsonResponse({"success": False, "message": "Invalid email alerts value"}, status=401)
			else:
				request.user.emailAlerts = emailAlerts
				request.user.save()

		# Check if the username is valid
		if new_username == request.user.username:
			pass
		elif len(new_username) < 4:
			return JsonResponse({"success": False, "username": "This username is too short (4 characters minimum)"}, status=401)
		elif len(new_username) > 20:
			return JsonResponse({"success": False, "username": "This username is too long (20 characters maximum)"}, status=401)
		elif containBadwords(new_username):
			return JsonResponse({"success": False, "username": "This username contains inappropriate words"}, status=401)
		elif ' ' in new_username:
			return JsonResponse({"success": False, "username": "This username cannot contain space"}, status=401)
		# elif not re.match('^[a-zA-Z0-9-]*$', new_username):
		# 	return JsonResponse({"success": False, "username": "This username cannot contain special characters"}, status=401)
		elif CustomUser.objects.filter(username=new_username).exists():
			return JsonResponse({"success": False, "username": "This username is already taken"}, status=401)
		else:
			request.user.username = new_username
			request.user.save()

		# Check if the description is valid
		if new_description:
			if len(new_description) > 150:
				return JsonResponse({"success": False, "description": "Description too long (150 characters max)"}, status=401)
			elif containBadwords(new_description):
				return JsonResponse({"success": False, "description": "This description contains inappropriate words"}, status=401)
			else:
				request.user.description = new_description
				request.user.save()
		else:
			request.user.description = ''
			request.user.save()
		
		# Check if the photo is valid
		if photo:
			# Delete the old photo
			if request.user.photo and request.user.photo.path != 'static/users/img/default.jpg':
				default_storage.delete(request.user.photo.path)
			
			# Decode the Base64 photo
			try:
				photo_data = base64.b64decode(photo)
				photo_image = Image.open(BytesIO(photo_data))
			except Exception as e:
				return JsonResponse({"success": False, "message": "Invalid image file"}, status=401)

			# Determine the image file type
			image_type = imghdr.what(None, photo_data)
			if image_type is None:
				return JsonResponse({"success": False, "message": "Invalid image file"}, status=401)
			
			# Save the new photo
			photo_temp = BytesIO()
			photo_image.save(photo_temp, format=image_type.upper())
			photo_temp.seek(0)
			request.user.photo.save(f"{request.user.email}.{image_type}", File(photo_temp), save=True)
			request.user.save()

		# Check if the email is valid
		try:
			old_email = request.user.email
			if new_email == request.user.email:
				pass
			elif not new_email:
				return JsonResponse({"success": False, "email": "This email is empty"}, status=401)
			elif not len(new_email):
				return JsonResponse({"success": False, "email": "This email is empty"}, status=401)
			elif not validate_email(new_email):
				return JsonResponse({"success": False, "email": "Invalid email format"}, status=401)
			elif CustomUser.objects.filter(email=new_email).exists():
				return JsonResponse({"success": False, "email": "This email is already taken"}, status=401)
			else:
				# Change the status to offline
				request.user.set_status("offline")

				request.user.email = new_email
				request.user.save()

		except ValidationError:
				return JsonResponse({"success": False, "email": "Invalid email format"}, status=401)
		
		# Check if the password is valid
		if not new_password:
			pass
		if not len(new_password):
			pass
		else:
			# Change the status to offline
			request.user.set_status("offline")

			request.user.set_password(new_password)
			request.user.save()
		
		# Send an email to the user
		# if new_email != request.user.email or new_password:
		# 	now = datetime.now()
		# 	date = now.strftime("%Y-%m-%d")
		# 	time = now.strftime("%H:%M:%S")
		
		# 	message = f"""
		# 	<p>Hello <b>{request.user.username}</b>,</p>
		# 	"""

			# if old_email != request.user.email:
			# 	message += f"""
			# 	<p>Your email has been successfully changed from <b>{old_email}</b> to <b>{new_email}</b>.</p>
			# 	"""
			# if new_password:
			# 	message += f"""
			# 	<p>Your password has been successfully changed.</p>
			# 	"""

			# message += f"""
			
			# <p>
			# - <b>Date</b>: {date}<br>
			# - <b>Time</b>: {time}<br>
			# - <b>IP address</b>: {request.META.get('REMOTE_ADDR')}
			# </p>

			
			# """
			
			# send_mail(
			# 	'Successful profile update',
			# 	message,
			# 	'Transcendence Team <transcendence.42lyon.project@gmail.com>',
			# 	[old_email, request.user.email] if old_email != request.user.email else [request.user.email],
			# 	html_message=message,
			# 	fail_silently=True,
			# )

		return JsonResponse({"success": True, "message": "Successful profile update"}, status=200)
	else:
		return JsonResponse({"success": False, "message": "Method not allowed"}, status=405)
	
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