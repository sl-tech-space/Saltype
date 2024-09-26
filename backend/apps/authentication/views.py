from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import GoogleAuthSerializer, UserLoginSerializer


class LoginView(APIView):
    """
    オリジナルフォームからのログインを行う
    """
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
    """
    リクエストのトークンを使って自動ログインを行う
    """
    permission_classes = [AllowAny]

    def post(self, request):
        token_key = request.data.get('token')
        if not token_key:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            return Response(
                {
                    'is_valid': True,
                    'user_id': user.user_id,
                    'email': user.email,
                    'username': user.username
                },
                status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({
                'is_valid': False,
                'error': 'Invalid token'
            },
                            status=status.HTTP_401_UNAUTHORIZED)


class GoogleAuthView(APIView):
    """
    Google認証
    認証と同時にDBにユーザを作成
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.create(serializer.validated_data)
                return Response(
                    {
                        'message': 'User information saved successfully',
                        'user_id': user.user_id,
                        'email': user.email,
                        'username': user.username
                    },
                    status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
