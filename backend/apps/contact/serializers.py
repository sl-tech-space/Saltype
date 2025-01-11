from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class ContactSerializer(BaseSerializer):
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
        # ユーザーIDの存在を検証
        attrs = self.check_user_id(attrs)
        return attrs
