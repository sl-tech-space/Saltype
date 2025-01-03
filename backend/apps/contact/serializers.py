from rest_framework import serializers
from apps.common.models import User


class ContactSerializer(serializers.Serializer):
    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    request_content = serializers.CharField(min_length=1,max_length=1000)  # 要望内容

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        ユーザーIDの検証を行います。
        """

        # ユーザーIDの存在を検証
        if "user_id" in attrs:
            try:
                user = User.objects.get(pk=attrs["user_id"])
                attrs["user"] = user
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    {"user_id": "指定されたユーザーは存在しません。"}
                )
        return attrs
