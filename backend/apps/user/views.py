from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from apps.common.models import User, Rank
from django.template.loader import render_to_string
from .serializers import (
    PasswordResetSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetSuccessNotificationSerializer,
    DeleteUserSerializer,
    UpdateUserSerializer,
    GetUserSerializer,
)
from apps.common.views import BaseView
from apps.common.util.score_util import ScoreUtil
import uuid
from django.urls import reverse


class GetUsersView(BaseView):
    """
    ユーザー情報全取得APIビュークラス。
    すべてのユーザー情報を取得し、レスポンスとして返します。
    """

    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def handle_get_request(self, *args, **kwargs):
        users = User.objects.filter(del_flg=False).select_related("rank")
        users_data = []

        for user in users:
            # 今日の最高スコアを取得する
            todays_highest_score = ScoreUtil.get_today_highest_score(user)

            # パスワードの存在有無を確認（NULLかどうかをチェック）
            password_exists = user.password is not None

            # ランク情報を個別に取得
            rank_name = user.rank.rank if user.rank else None

            users_data.append(
                {
                    "user_id": user.user_id,
                    "username": user.username,
                    "email": user.email,
                    "rank_name": rank_name,
                    "highest_score": todays_highest_score,
                    "password_exists": password_exists,
                }
            )

        return {"data": users_data}


class GetUserView(BaseView):
    """
    指定したuser_idに基づくユーザー情報を取得するAPIビュークラス。
    """

    def get(self, request, *args, **kwargs):
        serializer = GetUserSerializer(data=kwargs)
        serializer.is_valid(raise_exception=True)
        return super().get(request, *args, **kwargs)

    def handle_get_request(self, *args, **kwargs):
        """
        指定されたuser_idのユーザー情報を取得するGETリクエストを処理します。

        Returns:
            dict: 指定されたユーザー情報を含むレスポンスデータ。
        """
        user_id = kwargs.get("user_id")
        # del_flgがFalseのユーザーのみを取得
        user = User.objects.select_related("rank").get(user_id=user_id, del_flg=False)
        # パスワードの存在有無を確認（NULLかどうかをチェック）
        password_exists = user.password is not None

        # 今日の最高スコアを取得
        todays_highest_score = ScoreUtil.get_today_highest_score(user)
        rank_name = user.rank.rank if user.rank else None

        user_data = {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "permission": user.permission,
            "rank_name": rank_name,
            "highest_score": todays_highest_score,
            "password_exists": password_exists,
        }

        return {"data": user_data}


class UpdateUserView(BaseView):
    """
    ユーザー情報更新APIビュークラス。
    ユーザーの情報を更新します。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, UpdateUserSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data: dict):
        """
        ユーザーの情報を更新するリクエストを処理します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 更新結果を含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        google_login = validated_data.get("google_login")
        password = validated_data.get("password")
        new_password = validated_data.get("new_password")

        # ユーザーIDに基づいてユーザーを取得
        user = User.objects.get(user_id=user_id)

        # ユーザー名とメールアドレスの更新
        user.username = validated_data.get("username", user.username)
        user.email = validated_data.get("email", user.email)

        password_updated = False

        # パスワードの更新処理
        if new_password:
            if google_login:
                # google_loginがTrueの場合、パスワードが存在しない場合に新しいパスワードに更新
                if not user.password:
                    user.set_password(new_password)
                    password_updated = True
            else:
                # google_loginがFalseの場合、現在のパスワードが一致するか確認し、新しいパスワードに更新
                if user.check_password(password):
                    user.set_password(new_password)
                    password_updated = True

        # 変更を保存
        user.save()

        return {
            "status": "success",
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "password_updated": password_updated,
        }


class DeleteUserView(BaseView):
    """
    ユーザー論理削除APIビュークラス。
    指定されたユーザーを論理削除します。
    """

    def delete(self, request, *args, **kwargs):
        return super().delete(request, DeleteUserSerializer, *args, **kwargs)

    def handle_delete_request(self, validated_data: dict):
        user_id = validated_data["user_id"]
        # ユーザーを論理削除
        user = User.objects.get(user_id=user_id)
        user.del_flg = True
        user.save()

        return {
            "status": "success",
            "message": "ユーザーが削除されました。",
            "user_id": user_id,
        }


class PasswordResetView(BaseView):
    """
    パスワードリセットリクエストを処理するビュークラス。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, PasswordResetSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data):
        """
        POSTリクエストを処理し、パスワードリセット用のリンクをメールで送信します。
        """
        email = validated_data.get("email")
        user = User.objects.get(email=email)
        token = self.create_password_reset_token(user)
        self.send_password_reset_email(user, token)

        return {
            "message": "パスワードリセット用のリンクが送信されました。",
            "token": token,
        }

    def create_password_reset_token(self, user):
        """
        パスワードリセット用のトークンを生成し、キャッシュに保存します。
        """
        token = uuid.uuid4().hex
        expiration_time = timezone.now() + timedelta(minutes=10)
        cache.set(
            token, {"user_id": user.user_id, "expires_at": expiration_time}, timeout=600
        )
        return token

    def send_password_reset_email(self, user, token):
        """
        パスワードリセット用のURLをメールで送信します。
        """
        token_url = reverse("password_reset_with_token", args=[token])
        full_url = f"{settings.SITE_URL}{token_url}"

        subject = "パスワードリセットのリクエスト"
        html_message = render_to_string(
            "password_reset_email.html", {"user": user, "full_url": full_url}
        )

        send_mail(
            subject,
            "",  # テキストメッセージは空にする
            settings.EMAIL_HOST_USER,
            [user.email],
            html_message=html_message,
        )


class PasswordResetConfirmView(BaseView):
    """
    パスワードリセット確認を処理するビュークラス。
    トークンと新しいパスワードを受け取り、パスワードリセットを実行します。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, PasswordResetConfirmSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data):
        """
        POSTリクエストで新しいパスワードを設定します。
        """
        token = validated_data.get("token")
        new_password = validated_data.get("new_password")

        # トークンからユーザーを取得
        user = self.get_user_from_token(token)

        # 新しいパスワードを設定
        user.set_password(new_password)
        user.save()

        # トークン無効化
        self.invalidate_token(token)

        # 試行回数をリセット
        attempt_key = f"password_reset_attempts_{token}"
        cache.delete(attempt_key)

        return {"message": "パスワードがリセットされました。"}

    def get_user_from_token(self, token):
        """
        トークンからユーザーを取得します。
        """
        token_data = cache.get(token)
        if not token_data:
            return None

        return User.objects.get(user_id=token_data["user_id"])

    def invalidate_token(self, token):
        """
        トークンを無効化します（キャッシュから削除）。
        """
        cache.delete(token)


class PasswordResetSuccessNotificationView(BaseView):
    """
    パスワードリセット成功の通知メールを送信するビュークラス。
    """

    def post(self, request, *args, **kwargs):
        return super().post(
            request, PasswordResetSuccessNotificationSerializer, *args, **kwargs
        )

    def handle_post_request(self, validated_data):
        """
        パスワードリセット成功時に通知メールを送信します。
        """
        email = validated_data.get("email")
        user = User.objects.get(email=email)
        self.send_password_reset_success_email(user)
        return {"message": "通知メールが送信されました。"}

    def send_password_reset_success_email(self, user):
        """
        パスワードリセット成功の通知メールを送信します。
        """
        subject = "パスワードリセット完了"
        html_message = render_to_string(
            "password_reset_success_email.html",
            {"user": user, "login_url": settings.LOGIN_URL},
        )
        send_mail(
            subject,
            "",  # テキストメッセージは空にする
            settings.EMAIL_HOST_USER,
            [user.email],
            html_message=html_message,  # HTMLメッセージを指定
        )
