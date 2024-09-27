from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Miss

User = get_user_model()


class MissDataSerializer(serializers.ModelSerializer):
    """
    個別のミスタイプデータ（miss_char, miss_count）のシリアライザー
    """

    miss_char = serializers.CharField()
    miss_count = serializers.IntegerField()

    class Meta:
        model = Miss
        fields = ['miss_char', 'miss_count']

    def validate_miss_char(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("ミスタイプ文字はアルファベットである必要があります")
        return value


class MissTypeSerializer(serializers.Serializer):
    """
    全体のミスタイプシリアライザー

    Attributes:
        - user_idとmiss_dataをバリデート
    """
    user_id = serializers.UUIDField(write_only=True)
    miss_data = MissDataSerializer(many=True)

    def create(self, validated_data):
        """
        シリアライズされたデータからMissインスタンスを作成する
        """
        user_id = validated_data.pop('user_id')
        miss_data = validated_data.pop('miss_data')

        user = User.objects.get(pk=user_id)

        miss_instances = []
        for miss in miss_data:
            miss_instance = Miss(user=user, **miss)
            miss_instance.save()
            miss_instances.append(miss_instance)

        return miss_instances


class UserIDSerializer(serializers.Serializer):
    """
    ユーザーIDのバリデーション用シリアライザー
    """
    user_id = serializers.UUIDField()

    def validate_user_id(self, value):

        return value
