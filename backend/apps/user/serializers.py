from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db.models import Q
from apps.common.models import User


class UserSerializer(serializers.Serializer):
    """
    ユーザー関連のデータをシリアライズおよびバリデーションするためのクラス。
    ユーザーID、ユーザー名、メールアドレス、パスワードなどのデータを検証します。
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    username = serializers.CharField(
        max_length=150, required=False
    )  # ユーザー名（最大150文字）
    email = serializers.EmailField(
        max_length=254, required=False
    )  # メールアドレス（Email形式）
    google_login = serializers.BooleanField(required=False)  # Googleログインフラグ
    password = serializers.CharField(
        write_only=True, required=False, max_length=128
    )  # パスワード
    new_password = serializers.CharField(
        write_only=True, required=False, max_length=128
    )  # 新しいパスワード

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        ユーザーIDの存在確認、ユーザー名とメールアドレスの重複検証、パスワードの検証を行います。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            dict: バリデーションを通過したデータ。
        """
        # ユーザーIDの存在を検証
        user_id = attrs.get("user_id")
        if user_id:
            try:
                attrs["user"] = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                raise ValidationError({"user_id": "指定されたユーザーは存在しません。"})

        # ユーザー名とメールアドレスの重複を一度のクエリで検証
        username = attrs.get("username")
        email = attrs.get("email")
        existing_users = User.objects.filter(
            Q(username=username) | Q(email=email)
        ).exclude(user_id=user_id)
        if existing_users.exists():
            if username and existing_users.filter(username=username).exists():
                raise ValidationError(
                    {"username": "このユーザー名は既に使用されています。"}
                )
            if email and existing_users.filter(email=email).exists():
                raise ValidationError(
                    {"email": "このメールアドレスは既に使用されています。"}
                )

        # パスワードの検証
        password = attrs.get("password")
        new_password = attrs.get("new_password")
        google_login = attrs.get("google_login")
        if google_login and password and new_password:
            user = attrs.get("user")
            if user and not user.check_password(password):
                raise ValidationError(
                    {"password": "現在のパスワードが正しくありません。"}
                )
            if password == new_password:
                raise ValidationError(
                    {
                        "new_password": "新しいパスワードは現在のパスワードと異なる必要があります。"
                    }
                )

        return attrs
