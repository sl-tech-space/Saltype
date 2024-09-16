from rest_framework import serializers
from .models import Miss

class MissTypeSerializer(serializers.ModelSerializer):
    """
    ミスタイプシリアライザー

    Atributes:
        user_idとmiss_charをバリデーション
    """
    class Meta:
        model = Miss
        fields = ['user_id', 'miss_char','miss_count'] 
