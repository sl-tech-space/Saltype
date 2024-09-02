from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserLoginSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckTokenView(ObtainAuthToken):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'email': user.email
        })