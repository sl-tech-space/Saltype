from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import User
from apps.common.serializers import BaseSerializer
from django.core.validators import RegexValidator

# 大文字、数字、記号を含む正規表現
password_validator = RegexValidator(
    regex=r"^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,100}$",
    message="パスワードは大文字英字、数字、記号をそれぞれ1文字以上含む必要があります。",
)


class UserSerializer(BaseSerializer):
    """
    ユーザー関連のリクエストデータを検証するためのシリアライザクラス
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    username = serializers.CharField(
        max_length=15, required=False
    )  # ユーザー名（最大150文字）
    email = serializers.EmailField(
        max_length=256, required=False
    )  # メールアドレス（Email形式）
    google_login = serializers.BooleanField(required=False)  # Googleログインフラグ
    password = serializers.CharField(
        write_only=True,
        required=False,
        min_length=8,
        max_length=100,
        validators=[password_validator],
    )  # パスワード
    new_password = serializers.CharField(
        write_only=True, required=False, min_length=8, max_length=100
    )  # 新しいパスワード

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            dict: バリデーションを通過したデータ。
        """
        attrs = self.check_user_id(attrs)

        self.check_unique_username_and_email(
            attrs.get("username"), attrs.get("email"), attrs.get("user_id")
        )

        if not attrs.get("google_login"):
            self.check_passwords(
                attrs.get("password"), attrs.get("new_password"), attrs.get("user")
            )

        return attrs

    def check_unique_username_and_email(self, username, email, user_id):
        """
        ユーザー名とメールアドレスの重複を検証します。

        Args:
            username (str): ユーザー名。
            email (str): メールアドレス。
            user_id (UUID): ユーザーID。

        Raises:
            ValidationError: ユーザー名またはメールアドレスが既に使用されている場合。
        """
        existing_users = User.objects.filter(
            Q(username=username) | Q(email=email)
        ).exclude(pk=user_id)
        if existing_users.exists():
            if username and existing_users.filter(username=username).exists():
                raise ValidationError(
                    {"username": "このユーザー名は既に使用されています。"}
                )
            if email and existing_users.filter(email=email).exists():
                raise ValidationError(
                    {"email": "このメールアドレスは既に使用されています。"}
                )

    def check_passwords(self, password, new_password, user):
        """
        パスワードの検証を行います。

        Args:
            password (str): 現在のパスワード。
            new_password (str): 新しいパスワード。
            user (User): ユーザーオブジェクト。

        Raises:
            ValidationError: パスワードが正しくない場合や新しいパスワードが現在のパスワードと同じ場合。
        """
        if password and new_password:
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
