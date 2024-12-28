from rest_framework import serializers
from apps.common.models import User


class ContactSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    request_content = serializers.CharField(max_length=1000)  # 要望内容

    def validate_user_id(self, value):
        """
        ユーザーIDの検証を行います。
        """
        try:
            user = User.objects.get(pk=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("指定されたユーザーは存在しません。")
        return user

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        """
        attrs["user"] = self.validate_user_id(attrs["user_id"])
        return attrs
