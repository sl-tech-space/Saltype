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
            if not miss_char or not miss_char.isalpha() or len(miss_char) != 1:
                raise serializers.ValidationError("ミスタイプ文字は1文字のアルファベットである必要があります。")
            if miss_count is None or miss_count < 0:
                raise serializers.ValidationError("ミスタイプカウントは0以上でなければなりません。")

        return value


class UserIDSerializer(serializers.Serializer):
    """ユーザーIDのバリデーション用シリアライザー"""
    user_id = serializers.UUIDField()
    count = serializers.IntegerField(default=3)
