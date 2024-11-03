from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            msg = _('メールアドレスとパスワードを入力してください。')
            raise serializers.ValidationError(msg, code='authorization')

        self.validate_min_length(password)

        user = authenticate(request=self.context.get('request'), username=email, password=password)

        if user is None:
            msg = _('メールアドレスまたはパスワードが正しくありません。')
            raise serializers.ValidationError(msg, code='authorization')

        if not user.is_active:
            msg = _('ユーザーアカウントが無効です。')
            raise serializers.ValidationError(msg, code='authorization')

        data['user'] = user
        return data

    def validate_min_length(self, value, min_length=8):
        if len(value) < min_length:
            raise ValidationError(f"パスワードは{min_length}文字以上で入力してください。入力値：{len(value)}文字")


class UserSerializer(ModelSerializer):

    class Meta:
        model = get_user_model()
        fields = ['user_id', 'username', 'email']


class GoogleAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    picture = serializers.URLField(required=False, allow_blank=True)
