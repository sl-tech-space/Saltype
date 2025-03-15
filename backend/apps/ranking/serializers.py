from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class GetRankingSerializer(BaseSerializer):
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
        """
        attrs = self.check_lang_id(attrs)
        attrs = self.check_diff_id(attrs)
        attrs = self.check_date(attrs)

        return attrs
