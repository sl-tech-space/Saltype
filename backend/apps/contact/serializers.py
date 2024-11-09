from rest_framework import serializers


class RequestSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()
    request_content = serializers.CharField(max_length=1000)
