from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class InsertMistypesSerializer(BaseSerializer):
    """
    ミスタイプを挿入するためのシリアライザー。
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    mistypes = serializers.ListField(
        child=serializers.DictField(), required=False, allow_empty=True
    )  # ミスタイプのリスト

    def validate(self, attrs):
        """
        リクエストデータに対してバリデーションを実行します。
        """
        attrs = self.check_user_id(attrs)
        attrs = self.check_mistypes(attrs)
        return attrs

    def check_mistypes(self, attrs):
        """
        ミスタイプがリスト形式であり、各要素に正の整数のmiss_countが含まれているかを確認します。

        Args:
            attrs (dict): バリデーション対象のデータ。

        Returns:
            dict: 更新されたattrs。
        """
        mistypes = attrs.get("mistypes", [])
        if not isinstance(mistypes, list):
            raise ValidationError(
                {"mistypes": "mistypesはリスト形式である必要があります。"}
            )
        for item in mistypes:
            if (
                not isinstance(item, dict)
                or not isinstance(item.get("miss_count"), int)
                or item.get("miss_count") < 0
            ):
                raise ValidationError(
                    {"mistypes": "各ミスタイプには正の整数のmiss_countが必要です。"}
                )
        return attrs


class GetTopMistypesSerializer(BaseSerializer):
    """
    ミスタイプを取得するためのシリアライザー。
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    limit = serializers.IntegerField(required=False, min_value=1)  # リミット

    def validate(self, attrs):
        """
        リクエストデータに対してバリデーションを実行します。
        """
        attrs = self.check_user_id(attrs)
        return attrs
