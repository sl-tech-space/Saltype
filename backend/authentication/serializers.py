from rest_framework import serializers
from django.db import transaction
from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _

class UserLoginSerializer(serializers.Serializer):
    """
    リクエストのバリデーション、ログインを行う

    Raises:
        serializers.ValidationError: メールアドレス、パスワードが未入力
        serializers.ValidationError: メールアドレスまたはパスワードが不一致
        serializers.ValidationError: ユーザが存在しない

    Returns:
        data: 認証されたユーザの情報を返す
    """
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            msg = _('メールアドレスとパスワードを入力してください。')
            raise serializers.ValidationError(msg, code='authorization')

        user = authenticate(request=self.context.get('request'),
                            username=email, password=password)

        if user is None:
            msg = _('メールアドレスまたはパスワードが正しくありません。')
            raise serializers.ValidationError(msg, code='authorization')

        if not user.is_active:
            msg = _('ユーザーアカウントが無効です。')
            raise serializers.ValidationError(msg, code='authorization')
        
        data['user'] = user
        return data
    
User = get_user_model()

class GoogleAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    picture = serializers.URLField(required=False, allow_blank=True)

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data['email']
        username = validated_data['username']
        
        user, created = User.objects.get_or_create(email=email)
        if created:
            user.username = username
            user.save()

        return user