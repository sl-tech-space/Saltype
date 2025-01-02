from rest_framework import serializers
from apps.common.models import User
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError


class MistypeSerializer(BaseSerializer):
    user_id = serializers.UUIDField()
    mistypes = serializers.ListField(
        child=serializers.DictField(), required=False, allow_empty=True
    )
    limit = serializers.IntegerField(required=False)

    def validate(self, attrs):
        # ユーザーの存在を確認し、オブジェクトを追加
        user_id = attrs.get("user_id")
        if user_id:
            try:
                attrs["user"] = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                raise ValidationError({"user_id": "指定されたユーザーは存在しません。"})

        mistypes = attrs.get("mistypes", [])
        for item in mistypes:
            miss_char = item.get("miss_char")
            if not miss_char.isalpha():
                raise ValidationError("miss_charはアルファベットでなければなりません。")
            if not isinstance(item.get("miss_count"), int) or item.get("miss_count") < 0:
                raise ValidationError("miss_countは正の整数でなければなりません。")

        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise ValidationError("limitは正の整数である必要があります。")
        return attrs
