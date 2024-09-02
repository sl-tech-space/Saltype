from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(username=email, password=password)
        
        if user is None:
            raise serializers.ValidationError("認証エラー")
        data['user'] = user
        
        return data