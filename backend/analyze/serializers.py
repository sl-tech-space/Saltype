from rest_framework import serializers
from .models import Miss

class MissTypeSerializer(serializers.ModelSerializer):
    """
    ミスタイプシリアライザー

    Attributes:
        user_idとmiss_charをバリデーション
    """
    class Meta:
        model = Miss
        fields = ['user_id', 'miss_char', 'miss_count']

    def validate_miss_char(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("ミスタイプ文字はアルファベットである必要がある")
        return value
