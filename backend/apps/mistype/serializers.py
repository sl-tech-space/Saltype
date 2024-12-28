from rest_framework import serializers
from apps.common.models import User


class MistypeSerializer(serializers.Serializer):
    """
    ミスタイプの挿入およびトップミスタイプの取得用シリアライザー。
    ユーザーIDやミスタイプ情報、取得上限などを検証します。
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    mistypes = serializers.ListField(
        child=serializers.DictField(), required=False, allow_empty=True
    )  # ミスタイプ情報（リスト形式）
    limit = serializers.IntegerField(required=False)  # 取得上限

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        ユーザーID、ミスタイプ情報、取得上限の検証を行います。
        """

        # ユーザーIDの存在を検証
        user_id = attrs.get("user_id")
        if user_id:
            if not User.objects.filter(pk=user_id).exists():
                raise serializers.ValidationError(
                    {"user_id": "指定されたユーザーは存在しません。"}
                )
            attrs["user"] = User.objects.get(pk=user_id)

        # ミスタイプ情報の検証
        mistypes = attrs.get("mistypes", [])
        for item in mistypes:
            miss_count = item.get("miss_count")
            if not isinstance(miss_count, int) or miss_count < 0:
                raise serializers.ValidationError(
                    "ミスタイプのカウントは正の整数でなければなりません。"
                )

        # limitの検証（正の整数であること）
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise serializers.ValidationError("limitは正の整数である必要があります。")

        return attrs
