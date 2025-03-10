from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError
from django.core.validators import RegexValidator

# 大文字、数字、記号を含む正規表現
password_validator = RegexValidator(
    regex=r"^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,100}$",
    message="パスワードは大文字英字、数字、記号をそれぞれ1文字以上含む必要があります。",
)


class LoginSerializer(BaseSerializer):
    """
    ユーザーがオリジナルフォームからログインするためのシリアライザー。
    """

    email = serializers.EmailField(max_length=256, required=True)  # メールアドレス
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        min_length=8,
        max_length=100,
        validators=[password_validator],
    )  # パスワード

    def validate(self, attrs):
        """
        リクエストデータに対してバリデーションを実行します。
        """
        attrs["user"] = self.check_user(attrs.get("email"), attrs.get("password"))
        return attrs

    def check_user(self, email, password):
        """
        ユーザーのバリデーションを行います。
        """
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
                {"detail": _("ユーザーアカウントが無効です。")},
                code="authorization",
            )
        return user


class GoogleAuthSerializer(BaseSerializer):
    """
    ユーザーがGoogle認証を行うためのシリアライザー。
    """

    email = serializers.EmailField(max_length=256, required=True)  # メールアドレス
    username = serializers.CharField(max_length=15, required=False)  # ユーザー名

    def validate(self, attrs):
        """
        リクエストデータに対してバリデーションを実行します。
        """
        attrs = self.check_email(attrs)
        attrs = self.check_username(attrs)
        return attrs
