from apps.common.models import User
from apps.common.util.exception_handler import HandleExceptions
from django.db import transaction
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    GoogleAuthSerializer,
    UserLoginSerializer,
    UserSerializer,
)


class LoginView(APIView):
    """
    ユーザーがオリジナルフォームからログインするためのAPIビュークラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでログイン処理を行う。

        Args:
            request: クライアントからのリクエストオブジェクト。

        Returns:
            Response: 認証結果を含むHTTPレスポンス。
        """
        serializer = UserLoginSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        token = self._get_or_create_token(user)

        return self._format_response(user, token, status.HTTP_200_OK)

    def _get_or_create_token(self, user):
        """
        ユーザーのトークンを取得または新規作成。

        Args:
            user: 認証されたユーザーオブジェクト。

        Returns:
            Token: ユーザーのトークンオブジェクト。
        """
        token, _ = Token.objects.get_or_create(user=user)
        return token

    def _format_response(self, user, token, http_status):
        """
        レスポンスデータをフォーマット。

        Args:
            user: ユーザーオブジェクト。
            token: 認証トークン。
            http_status: HTTPステータスコード。

        Returns:
            Response: フォーマットされたHTTPレスポンスオブジェクト。
        """
        return Response(
            {
                "status": "success",
                "user_id": user.user_id,
                "email": user.email,
                "username": user.username,
                "token": token.key,
            },
            status=http_status,
        )


class CheckTokenView(APIView):
    """
    トークンを使用した自動ログインAPIビュークラス。
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        GETメソッドでユーザー情報を返す。

        Args:
            request: クライアントからのリクエストオブジェクト。

        Returns:
            Response: ユーザー情報を含むHTTPレスポンス。
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class GoogleAuthView(APIView):
    """
    Google認証APIビュークラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request):
        """
        POSTメソッドでGoogle認証処理を行う。

        Args:
            request: クライアントからのリクエストオブジェクト。

        Returns:
            Response: 認証結果を含むHTTPレスポンス。
        """
        serializer = GoogleAuthSerializer(data=request.data)

        if serializer.is_valid():
            user = self._create_or_update_user(serializer.validated_data)
            token, _ = Token.objects.get_or_create(user=user)
            return self._format_response(user, token, status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @transaction.atomic
    def _create_or_update_user(self, validated_data):
        """
        Google認証データを使用してユーザーを作成または更新。

        Args:
            validated_data: 検証済みデータ。

        Returns:
            User: 作成または更新されたユーザーオブジェクト。
        """
        email = validated_data["email"]
        username = validated_data["username"]

        user, created = User.objects.get_or_create(email=email)
        if created:
            user.username = username
            user.save()

        return user

    def _format_response(self, user, token, http_status):
        """
        レスポンスデータをフォーマット。

        Args:
            user: ユーザーオブジェクト。
            token: 認証トークン。
            http_status: HTTPステータスコード。

        Returns:
            Response: フォーマットされたHTTPレスポンスオブジェクト。
        """
        return Response(
            {
                "status": "success",
                "user_id": user.user_id,
                "email": user.email,
                "username": user.username,
                "token": token.key,
            },
            status=http_status,
        )
