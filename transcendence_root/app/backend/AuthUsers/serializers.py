from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'full_name', 'email', 'city', 'avatar', 'image_link']
        extra_kwargs = {'image_link': {'required': False}}