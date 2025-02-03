from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
   
def user_profile(request):

    user = request.user

    data = {

    'fullName': "user.fullName",

    'userName': "user.userName",
    'Mail': "user.Mail",
    'Avatar': "user.Avatar",
    'City': "user.City",

    # Add any other fields needed

    }
    return JsonResponse(data)