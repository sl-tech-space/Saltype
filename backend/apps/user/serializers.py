from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import User


class UserSerializer(serializers.Serializer):
    """
    スコア関連のデータをシリアライズおよびバリデーションするためのクラス。
    """

    user_id = serializers.UUIDField(required=True)  # ユーザーID（UUID形式）
    username = serializers.CharField(max_length=150, required=False)  # ユーザー名（最大150文字）
    email = serializers.EmailField(max_length=254, required=False)  # メールアドレス（Email形式）
    password = serializers.CharField(write_only=True, required=False, max_length=100)  # パスワード

    def validate_user_id(self, value):
        """
        ユーザーIDに対する個別バリデーションを実施します。
        """
        try:
            user = User.objects.get(pk=value)  # ユーザーIDが存在するか確認
        except User.DoesNotExist:
            raise ValidationError("指定されたユーザーは存在しません。")
        
        self.context['user'] = user  
        return value

    def validate_username(self, value):
        """
        ユーザー名に対するバリデーション
        """
        if value and not value.isalnum():  # アルファベットと数字のみ許可
            raise ValidationError("ユーザー名はアルファベットと数字のみで構成される必要があります。")
        return value

    def validate_email(self, value):
        """
        メールアドレスに対するバリデーション
        """
        if value and "@" not in value:  # 基本的なメールアドレスの形式チェック
            raise ValidationError("メールアドレスが無効です。")
        return value

    def validate(self, attrs):
        """
        受け取ったデータに対してバリデーションを実行します。
        """
        user = self.context.get('user')
        if user:
            attrs["user"] = user
        return attrs
