from rest_framework import serializers


class TextGenerateSerializer(serializers.Serializer):
    input = serializers.CharField(required=True, max_length=100)
