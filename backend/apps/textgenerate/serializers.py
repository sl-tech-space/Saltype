from rest_framework import serializers
from apps.common.serializers import BaseSerializer
from django.core.validators import RegexValidator

class GenerateTextViewSerializer(BaseSerializer):
    input = serializers.CharField(
        required=True, 
        max_length=10, 
        validators=[
            RegexValidator(
                regex=r'^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$',
                message="ひらがな、カタカナ、漢字のみを入力してください。"
            )
        ]
    )
