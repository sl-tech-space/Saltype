from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError


class AuthenticationSerializer(BaseSerializer):
    """
    ユーザー認証に関連するリクエストデータを検証するシリアライザクラス
    """

    email = serializers.EmailField(required=True)  # メールアドレス
    password = serializers.CharField(
        write_only=True,
        required=False,
        style={"input_type": "password"},
        min_length=8,
        max_length=128,
    )  # パスワード
    username = serializers.CharField(max_length=150, required=False)  # ユーザー名
    picture = serializers.URLField(required=False, allow_blank=True)  # 画像URL

    def validate(self, attrs):
        """
        リクエストデータに対してバリデーションを実行します。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            attrs: バリデーションを通過したデータ。
        """
        # メールアドレスのバリデーション
        attrs = self.check_email(attrs)

        # パスワードのバリデーション
        password = attrs.get("password")
        if password:
            attrs["user"] = self.validate_user(
                attrs.get("email"), attrs.get("password")
            )
        else:
            attrs = self.check_username(attrs)

        return attrs

    def validate_user(self, email, password):
        """
        ユーザーのバリデーションを行います。

        Args:
            email (str): メールアドレス。
            password (str): パスワード。

        Returns:
            user: 認証されたユーザー。

        Raises:
            ValidationError: 認証に失敗した場合。
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
