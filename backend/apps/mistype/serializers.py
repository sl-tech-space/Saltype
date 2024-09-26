from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Miss


class MissTypeSerializer(serializers.ModelSerializer):
    """
    ミスタイプシリアライザー

    Attributes:
        user_idとmiss_charをバリデーション
    """
    user = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())

    class Meta:
        model = Miss
        fields = ['user', 'miss_char', 'miss_count']

    def validate_miss_char(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("ミスタイプ文字はアルファベットである必要があります")
        return value
