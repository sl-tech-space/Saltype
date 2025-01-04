from rest_framework import serializers
from apps.common.models import User


class ContactSerializer(serializers.Serializer):
    """
    ユーザーからの要望を処理するためのシリアライザクラス。
    ユーザーIDの検証と要望内容のバリデーションを行います。
    """

    user_id = serializers.UUIDField()  # ユーザーID（UUID形式）
    request_content = serializers.CharField(min_length=1, max_length=1000)  # 要望内容

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        ユーザーIDの存在を確認し、存在しない場合はエラーを返します。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            dict: バリデーションを通過したデータ。
        """
        # ユーザーIDが提供されているか確認
        if "user_id" in attrs:
            try:
                # ユーザーIDに対応するユーザーが存在するか確認
                user = User.objects.get(pk=attrs["user_id"])
                attrs["user"] = user
            except User.DoesNotExist:
                # ユーザーが存在しない場合はバリデーションエラーを発生させる
                raise serializers.ValidationError(
                    {"user_id": "指定されたユーザーは存在しません。"}
                )
        return attrs
