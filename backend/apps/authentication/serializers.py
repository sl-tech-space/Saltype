from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class UserLoginSerializer(BaseSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={"input_type": "password"})

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")
        self._validate_min_length(password)

        user = authenticate(request=self.context.get("request"), username=email, password=password)
        if user is None:
            raise ValidationError(_("メールアドレスまたはパスワードが正しくありません。"), code="authorization")
        if not user.is_active:
            raise ValidationError(_("ユーザーアカウントが無効です。"), code="authorization")

        data["user"] = user
        return data

    def _validate_min_length(self, value, min_length=8):
        if len(value) < min_length:
            raise ValidationError(f"パスワードは{min_length}文字以上で入力してください。入力値：{len(value)}文字")



class UserSerializer(serializers.ModelSerializer):
    """
    ユーザーデータのシリアライザ。
    """

    class Meta:
        model = get_user_model()
        fields = ["user_id", "username", "email"]
        extra_kwargs = {"email": {"read_only": True}}


class GoogleAuthSerializer(serializers.Serializer):
    """
    Google認証用シリアライザ。
    `email`, `username`, `picture` を受け取ります。
    """

    email = serializers.EmailField(required=True)
    username = serializers.CharField(max_length=150, required=True)
    picture = serializers.URLField(required=False, allow_blank=True)
