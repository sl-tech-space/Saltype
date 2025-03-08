from rest_framework import serializers
from apps.common.serializers import BaseSerializer
from django.core.validators import RegexValidator


class GenerateTextViewSerializer(BaseSerializer):
    input = serializers.CharField(
        required=True,
        min_length=1,
        max_length=10,
        validators=[
            RegexValidator(
                regex=r"^[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$",
                message="ひらがな、カタカナ、漢字のみを入力してください。",
            )
        ],
    )
    user_id = serializers.UUIDField()

    def validate(self, attrs):
        attrs = self.check_user_id(attrs)
        return attrs
