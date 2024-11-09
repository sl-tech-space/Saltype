from rest_framework import serializers


class MistypeSerializer(serializers.Serializer):
    """ミスタイプの挿入とトップミスタイプの取得用シリアライザー。"""

    user_id = serializers.UUIDField(write_only=True)
    mistypes = serializers.ListField(child=serializers.DictField(), required=False)
    limit = serializers.IntegerField(required=False)

    def validate(self, attrs):
        """操作に基づいて入力データを検証する。"""
        if "mistypes" in attrs:
            mistypes = attrs["mistypes"]
            if not mistypes:
                raise serializers.ValidationError(
                    "ミスタイプデータは空であってはいけません。"
                )

            for item in mistypes:
                miss_count = item.get("miss_count")
                if (
                    miss_count is None
                    or not isinstance(miss_count, int)
                    or miss_count < 0
                ):
                    raise serializers.ValidationError(
                        "ミスタイプのカウントは正の整数でなければなりません。"
                    )

        return attrs
