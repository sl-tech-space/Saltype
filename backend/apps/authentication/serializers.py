from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError


class AuthenticationSerializer(BaseSerializer):
    """
    認証情報をバリデーションし、ユーザーを認証するためのシリアライザクラス。
    """

    email = serializers.EmailField(required=True)  # メールアドレス
    password = serializers.CharField(
        write_only=True, required=False, style={"input_type": "password"}
    )  # パスワード
    username = serializers.CharField(max_length=150, required=False)  # ユーザー名
    picture = serializers.URLField(required=False, allow_blank=True)  # 画像URL

    def validate(self, data):
        """
        入力されたデータを検証し、認証を行います。

        Args:
            data (dict): バリデーション対象のデータ。

        Returns:
            dict: 認証されたユーザーを含むデータ。
        """
        email = data.get("email")
        if not email:
            raise ValidationError({"email": "メールアドレスが必要です。"})

        password = data.get("password")
        if password:
            self._validate_min_length(password)
            user = authenticate(
                request=self.context.get("request"), username=email, password=password
            )
            if user is None:
                raise ValidationError(
                    {"detail": _("メールアドレスまたはパスワードが正しくありません。")},
                    code="authorization",
                )
            if not user.is_active:
                raise ValidationError(
                    {"detail": _("ユーザーアカウントが無効です。")}, code="authorization"
                )
            data["user"] = user
        else:
            username = data.get("username")
            if not username:
                raise ValidationError({"username": "ユーザー名が必要です。"})

        return data

    def _validate_min_length(self, value, min_length=8):
        """
        パスワードの長さを検証します。

        Args:
            value (str): 検証対象のパスワード。
            min_length (int): パスワードの最小長。
        """
        if len(value) < min_length:
            raise ValidationError(
                {"password": f"パスワードは{min_length}文字以上で入力してください。入力値：{len(value)}文字"}
            )
