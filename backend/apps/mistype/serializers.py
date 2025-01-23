from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class MistypeSerializer(BaseSerializer):
    """
    ミスタイプに関連するリクエストデータを検証するシリアライザクラス
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    mistypes = serializers.ListField(
        child=serializers.DictField(), required=False, allow_empty=True
    )  # ミスタイプのリスト
    limit = serializers.IntegerField(required=False, min_value=1)  # リミット

    def validate(self, attrs):
        """
        リクエストデータに対してバリデーションを実行します。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            attrs: バリデーションを通過したデータ。
        """
        # ユーザIDのバリデーション
        attrs = self.check_user_id(attrs)
        # ミスタイプのバリデーション
        attrs = self.check_mistypes(attrs)

        return attrs
