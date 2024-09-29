from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Miss

User = get_user_model()


class MissTypeSerializer(serializers.Serializer):
    """
    全体のミスタイプシリアライザー
    Attributes:
        - user_idとmiss_dataをバリデート
    """
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

    def create(self, validated_data):
        """シリアライズされたデータからMissインスタンスを作成する"""
        user_id = validated_data.pop('user_id')
        miss_data = validated_data.pop('miss_data')
        user = User.objects.get(pk=user_id)

        miss_instances = []
        for miss in miss_data:
            miss_char = miss.get('miss_char')
            miss_count = miss.get('miss_count', 1)
            miss_instance, created = Miss.objects.get_or_create(user=user,
                                                                miss_char=miss_char,
                                                                defaults={'miss_count': miss_count})
            if not created:
                """既存のミスタイプの場合、カウントを更新"""
                miss_instance.miss_count += miss_count
                miss_instance.save()

            miss_instances.append(miss_instance)

        return miss_instances


class UserIDSerializer(serializers.Serializer):
    """ユーザーIDのバリデーション用シリアライザー"""
    user_id = serializers.UUIDField()
    count = serializers.IntegerField(default=3)
