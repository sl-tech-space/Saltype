from rest_framework import serializers


class MistypeSerializer(serializers.Serializer):
    """
    ミスタイプの挿入とトップミスタイプの取得用シリアライザー。
    """

    action = serializers.ChoiceField(
        choices=[
            "insert_mistypes",
            "get_top_mistypes",
        ],  # action の選択肢を制限
        required=False,
    )
    user_id = serializers.UUIDField(required=False)  # ユーザーID（UUID形式）
    mistypes = serializers.ListField(
        child=serializers.DictField(), required=False, allow_empty=True
    )  # ミスタイプ情報(list)
    limit = serializers.IntegerField(required=False)  # 取得上限(int)

    def validate(self, attrs):
        """
        操作に基づいて入力データを検証する。
        """
        action = attrs.get("action")
        if action not in ["insert_mistypes", "get_top_mistypes"]:
            raise serializers.ValidationError("無効なアクションが指定されました。")

        if "mistypes" in attrs:
            mistypes = attrs["mistypes"]
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
