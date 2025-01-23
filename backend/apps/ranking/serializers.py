from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class RankingSerializer(BaseSerializer):
    """
    ランキングに関連するリクエストデータを検証するシリアライザクラス
    """

    lang_id = serializers.IntegerField()  # 言語ID
    diff_id = serializers.IntegerField()  # 難易度ID
    limit = serializers.IntegerField(required=False, min_value=1)  # リミット
    date = serializers.DateField(required=False)  # 日付

    def validate(self, attrs):
        """
        リクエストデータに対してバリデーションを実行します。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            attrs: バリデーションを通過したデータ。
        """
        # 言語IDのバリデーション
        attrs = self.check_lang_id(attrs)
        # 難易度IDのバリデーション
        attrs = self.check_diff_id(attrs)
        # 日付のバリデーション
        attrs = self.check_date(attrs)

        return attrs
