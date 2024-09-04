from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import login
from .serializers import UserLoginSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            # login(request, user)
            # request.session.set_expiry(1209600)
            # return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class CheckSessionView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         return Response({
#             'user': {
#                 'username': request.user.username,
#             }
#         })

class CheckTokenView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        token_key = request.data.get('token')
        if not token_key:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            return Response({
                'is_valid': True,
                'user_id': user.id,
                'email': user.email,
                'username': user.username
            }, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({
                'is_valid': False,
                'error': 'Invalid token'
            }, status=status.HTTP_401_UNAUTHORIZED)