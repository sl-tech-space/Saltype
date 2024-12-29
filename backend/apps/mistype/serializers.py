from rest_framework import serializers
from apps.common.models import User
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError

class MistypeSerializer(BaseSerializer):
    user_id = serializers.UUIDField()
    mistypes = serializers.ListField(child=serializers.DictField(), required=False, allow_empty=True)
    limit = serializers.IntegerField(required=False)

    def validate(self, attrs):
        self.validate_existence(attrs, "user_id", User, "指定されたユーザーは存在しません。")
        mistypes = attrs.get("mistypes", [])
        if any(not isinstance(item.get("miss_count"), int) or item.get("miss_count") < 0 for item in mistypes):
            raise ValidationError("ミスタイプのカウントは正の整数でなければなりません。")
        limit = attrs.get("limit")
        if limit is not None and limit <= 0:
            raise ValidationError("limitは正の整数である必要があります。")
        return attrs
