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

    def validate(self, attrs):
        """
        入力されたデータを検証し、認証を行います。
        """
        attrs = self.check_email(attrs)
        attrs = self.check_password(attrs)

        email = attrs.get("email")
        password = attrs.get("password")
        if password:
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
            attrs["user"] = user
        else:
            username = attrs.get("username")
            if not username:
                raise ValidationError({"username": "ユーザー名が必要です。"})

        return attrs
