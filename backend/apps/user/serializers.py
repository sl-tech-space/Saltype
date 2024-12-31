from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from apps.common.models import User


class UserSerializer(serializers.Serializer):
    """
    ユーザー関連のデータをシリアライズおよびバリデーションするためのクラス。
    ユーザーID、ユーザー名、メールアドレス、パスワードなどのデータを検証します。
    """

    user_id = serializers.UUIDField(required=True)  # ユーザーID（UUID形式）
    username = serializers.CharField(max_length=150, required=False)  # ユーザー名（最大150文字）
    email = serializers.EmailField(max_length=254, required=False)  # メールアドレス（Email形式）
    password = serializers.CharField(write_only=True, required=False, max_length=128)  # パスワード

    def validate(self, attrs):
        """
        受け取ったデータに対してバリデーションを実行します。
        ユーザーID、ユーザー名、メールアドレス、パスワードに関する検証を行います。
        """
        user_id = attrs.get("user_id")
        username = attrs.get("username")
        email = attrs.get("email")

        # ユーザーIDの存在を検証
        if user_id:
            attrs["user"] = self._get_user_by_id(user_id)

        # ユーザー名とメールアドレスの重複を一度のクエリで検証
        self._check_duplicate_user(username, email, user_id)

        return attrs

    def _get_user_by_id(self, user_id):
        """
        ユーザーIDに基づいてユーザーを取得します。
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            raise ValidationError({"user_id": "指定されたユーザーは存在しません。"})

    def _check_duplicate_user(self, username, email, user_id):
        """
        ユーザー名とメールアドレスの重複を検証します。
        """
        existing_users = User.objects.filter(Q(username=username) | Q(email=email)).exclude(user_id=user_id)
        if existing_users.exists():
            if username and existing_users.filter(username=username).exists():
                raise ValidationError({"username": "このユーザー名は既に使用されています。"})
            if email and existing_users.filter(email=email).exists():
                raise ValidationError({"email": "このメールアドレスは既に使用されています。"})
