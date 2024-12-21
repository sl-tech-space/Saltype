from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from apps.common.models import Diff, Lang, User, Score


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
        if "user_id" in attrs:
            try:
                user = User.objects.get(pk=attrs["user_id"])
                attrs["user"] = user
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {"user_id": "指定されたユーザーは存在しません。"}
                )

        # ミスタイプ情報の検証
        if "mistypes" in attrs:
            for item in attrs["mistypes"]:
                miss_count = item.get("miss_count")
                if (
                    miss_count is None
                    or not isinstance(miss_count, int)
                    or miss_count < 0
                ):
                    raise serializers.ValidationError(
                        "ミスタイプのカウントは正の整数でなければなりません。"
                    )

        # limitの検証（正の整数であること）
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise serializers.ValidationError("limitは正の整数である必要があります。")

        return attrs
