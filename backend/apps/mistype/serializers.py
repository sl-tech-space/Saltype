from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class MistypeSerializer(BaseSerializer):
    """
    ユーザーのミスタイプデータを処理するためのシリアライザクラス。
    ユーザーID、ミスタイプの詳細、制限値のバリデーションを行います。
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    mistypes = serializers.ListField(
        child=serializers.DictField(), required=False, allow_empty=True
    )  # ミスタイプのリスト
    limit = serializers.IntegerField(required=False)  # 制限値

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        ユーザーIDの存在確認、ミスタイプの詳細検証、制限値の確認を行います。
        """
        attrs = self.check_user_id(attrs)
        attrs = self.check_mistypes(attrs)
        attrs = self.check_limit(attrs)
        return attrs
