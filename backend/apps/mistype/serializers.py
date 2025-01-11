from rest_framework import serializers
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError


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

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            dict: バリデーションを通過したデータ。
        """
        # ユーザーIDの存在を検証
        self.check_user_id(attrs)

        mistypes = attrs.get("mistypes", [])
        for item in mistypes:
            if (
                not isinstance(item.get("miss_count"), int)
                or item.get("miss_count") < 0
            ):
                raise ValidationError("miss_countは正の整数でなければなりません。")

        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise ValidationError("limitは正の整数である必要があります。")
        return attrs
