from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Miss

User = get_user_model()


class MissTypeSerializer(serializers.Serializer):
    """全体のミスタイプシリアライザー"""
    user_id = serializers.UUIDField(write_only=True)
    miss_data = serializers.ListField(child=serializers.DictField())

    def validate_miss_data(self, value):
        """各ミスタイプデータの検証"""
        if not value:
            raise serializers.ValidationError("ミスタイプデータは空であってはなりません。")

        for item in value:
            miss_char = item.get('miss_char')
            miss_count = item.get('miss_count')
            """ミスタイプカウント検証"""
            if miss_count is None or not isinstance(miss_count, int) or miss_count < 0:
                raise serializers.ValidationError("ミスタイプカウントは0以上の整数でなければなりません。")

        return value


class TopMistypesSerializer(serializers.Serializer):
    """ミスタイプ取得リクエスト用シリアライザー"""
    user_id = serializers.UUIDField()
    count = serializers.IntegerField(default=3)
