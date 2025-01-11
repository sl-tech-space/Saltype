from rest_framework import serializers
from apps.common.serializers import BaseSerializer


class RankingSerializer(BaseSerializer):
    """
    ランキングデータを処理するためのシリアライザクラス。
    言語ID、難易度ID、制限値、日付のバリデーションを行います。
    """

    lang_id = serializers.IntegerField()  # 言語ID
    diff_id = serializers.IntegerField()  # 難易度ID
    limit = serializers.IntegerField()  # 制限値
    date = serializers.DateField(required=False)  # 日付（オプション）

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        言語、難易度の存在確認、制限値と日付の検証を行います。
        """
        # 言語の存在を確認
        attrs = self.check_lang_id(attrs)
        # 難易度の存在を確認
        attrs = self.check_diff_id(attrs)
        # 制限値の確認
        attrs = self.check_limit(attrs)
        # 日付の確認
        attrs = self.check_date(attrs)

        return attrs
