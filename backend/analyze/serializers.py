from rest_framework import serializers
from .models import t_miss

class MissTypeSerializer(serializers.ModelSerializer):
    """
    ミスタイプシリアライザー

    Atributes:
        user_idとmiss_charをバリデーション
    """
    class Meta:
        model = t_miss
        fields = ['user_id', 'miss_char']  
