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
        # メールアドレスの検証を行う
        attrs = self.check_email(attrs)
        # パスワードの検証を行う
        attrs = self.check_password(attrs)

        email = attrs.get("email")
        password = attrs.get("password")
        if password:
            # ユーザーを認証する
            user = authenticate(
                request=self.context.get("request"), username=email, password=password
            )
            if user is None:
                # 認証に失敗した場合のエラーメッセージ
                raise ValidationError(
                    {"detail": _("メールアドレスまたはパスワードが正しくありません。")},
                    code="authorization",
                )
            if not user.is_active:
                # ユーザーアカウントが無効な場合のエラーメッセージ
                raise ValidationError(
                    {"detail": _("ユーザーアカウントが無効です。")},
                    code="authorization",
                )
            # 認証に成功したユーザーを属性に追加
            attrs["user"] = user
        else:
            # パスワードが提供されていない場合、ユーザー名の存在を確認
            username = attrs.get("username")
            if not username:
                # ユーザー名が必要な場合のエラーメッセージ
                raise ValidationError({"username": "ユーザー名が必要です。"})

        return attrs
