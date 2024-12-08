from rest_framework import serializers


class MistypeSerializer(serializers.Serializer):
    """
    ミスタイプの挿入とトップミスタイプの取得用シリアライザー。
    """

    user_id = serializers.UUIDField(write_only=True)  # ユーザーID（UUID形式）
    mistypes = serializers.ListField(
        child=serializers.DictField(), required=False, allow_empty=True
    )  # ミスタイプ情報(list)
    limit = serializers.IntegerField(required=False)  # 取得上限(int)

    def validate(self, attrs):
        """
        操作に基づいて入力データを検証する。

        Args:
            attrs (dict): シリアライズされたデータ（リクエストの内容）。
        Returns:
            dict: バリデーションされたデータ（エラーがなければそのままのデータを返却）。
        Raises:
            ValidationError: 入力データに誤りがある場合に発生。
        """
        if "mistypes" in attrs:
            mistypes = attrs["mistypes"]

            for item in mistypes:
                miss_count = item.get("miss_count")

                # ミスタイプのカウントが`None`、整数でない、または負の値であればエラー
                if (
                    miss_count is None
                    or not isinstance(miss_count, int)
                    or miss_count < 0
                ):
                    raise serializers.ValidationError(
                        "ミスタイプのカウントは正の整数でなければなりません。"
                    )

        return attrs
