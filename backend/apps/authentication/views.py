from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import GoogleAuthSerializer, UserSerializer, UserLoginSerializer


class LoginView(APIView):
    """オリジナルフォームからのログインを行う"""
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                'user_id': user.user_id,
                'email': user.email,
                'username': user.username,
                'token': token.key
            },
            status=status.HTTP_200_OK)


class CheckTokenView(APIView):
    """リクエストのトークンを使って自動ログインを行う"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class GoogleAuthView(APIView):
    """Google認証 認証と同時にDBにユーザを作成"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create(serializer.validated_data)
            token, _ = Token.objects.get_or_create(user=user)
            return Response(
                {
                    'message': 'User information saved successfully',
                    'user_id': user.user_id,
                    'email': user.email,
                    'username': user.username,
                    'token': token.key
                },
                status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
