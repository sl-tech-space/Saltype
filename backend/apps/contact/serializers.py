from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class ContactSerializer(BaseSerializer):
    """
    要望送信に関連するリクエストデータを検証するシリアライザクラス
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    request_content = serializers.CharField(min_length=1, max_length=300)  # 要望内容

    def validate(self, attrs):
        """
        リクエストデータに対してバリデーションを実行します。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            attrs: バリデーションを通過したデータ。
        """
        attrs = self.check_user_id(attrs)

        return attrs
