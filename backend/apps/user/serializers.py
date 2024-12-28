from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from apps.common.models import User


class UserSerializer(serializers.Serializer):
    """
    スコア関連のデータをシリアライズおよびバリデーションするためのクラス。
    """

    user_id = serializers.UUIDField(required=False)  # ユーザーID（UUID形式）

    def validate(self, attrs):
        """
        受け取ったデータに対してバリデーションを実行します。
        ユーザー、言語、難易度、タイピング数、精度、アクションに関する検証を行います。
        """

        # ユーザーIDの検証
        if "user_id" in attrs:
            try:
                user = User.objects.get(pk=attrs["user_id"])
                attrs["user"] = user
            except User.DoesNotExist:
                raise ValidationError({"user_id": "指定されたユーザーは存在しません。"})

        return attrs
