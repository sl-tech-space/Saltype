from apps.common.models import User
from django.shortcuts import get_object_or_404
from rest_framework import serializers


class UserAdminSerializer(serializers.Serializer):
    """
    スコア関連のデータをシリアライズおよびバリデーションするためのクラス。
    """

    user_id = serializers.UUIDField(required=False)  # ユーザーID（UUID形式）

    def validate(self, attrs):
        """
        受け取ったデータに対してバリデーションを実行。

        Args:
            attrs: シリアライズされるデータの辞書。

        Returns:
            attrs: バリデーション後のデータ（エラーがなければそのまま返却）。
        """
        # ユーザーIDが指定されている場合、ユーザーオブジェクトを取得
        if "user_id" in attrs:
            user = get_object_or_404(User, pk=attrs["user_id"])
            attrs["user"] = user

        return attrs
