from apps.common.models import User
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .base_view import BaseAuthenticationView
from django.conf import settings

class LoginView(BaseAuthenticationView):
    """
    ユーザーがオリジナルフォームからログインするためのAPIビュークラス。
    """

    permission_classes = [AllowAny]

    def handle_post_request(self, validated_data):
        """
        ログインリクエストを処理します。
        バリデーションを通過したデータを用いてユーザーのトークンを取得または作成し、認証結果を返します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 認証結果を含むレスポンスデータ。
        """
        user = validated_data["user"]
        token = self.get_or_create_token(user)

        return {
            "status": "success",
            "user_id": user.user_id,
            "email": user.email,
            "username": user.username,
            "token": token.key,
        }

    def get_or_create_token(self, user):
        """
        ユーザーのトークンを取得または新規作成します。

        Args:
            user (User): 認証されたユーザーオブジェクト。
        Returns:
            Token: ユーザーのトークンオブジェクト。
        """
        token, _ = Token.objects.get_or_create(user=user)
        return token

class CheckTokenView(BaseAuthenticationView):
    """
    トークンを使用した自動ログインAPIビュークラス。
    """

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def handle_get_request(self, request, *args, **kwargs):
        """
        GETメソッドでユーザー情報を返します。
        リクエストされたユーザー情報を取得し、レスポンスとして返します。

        Args:
            request (Request): クライアントからのリクエストオブジェクト。
        Returns:
            dict: ユーザー情報を含むレスポンスデータ。
        """
        user = request.user
        user_data = {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
        }
        return user_data

class GoogleAuthView(BaseAuthenticationView):
    """
    Google認証APIビュークラス。
    """

    permission_classes = [AllowAny]

    def handle_post_request(self, validated_data):
        """
        Google認証リクエストを処理します。
        バリデーションを通過したデータを用いてユーザーを作成または更新し、トークンを取得して認証結果を返します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 認証結果を含むレスポンスデータ。
        """
        user = self.create_or_update_user(validated_data)
        token, _ = Token.objects.get_or_create(user=user)

        admin_emails = settings.ADMIN_EMAILS
        is_admin = user.email in admin_emails
        if is_admin:
            user.permission = 0
            user.save()

        return {
            "status": "success",
            "user_id": user.user_id,
            "email": user.email,
            "username": user.username,
            "token": token.key,
            "is_admin": is_admin,
        }

    def create_or_update_user(self, validated_data):
        """
        Google認証データを使用してユーザーを作成または更新します。
        ユーザーを取得または作成し、必要に応じて更新します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
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