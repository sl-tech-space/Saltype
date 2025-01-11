from rest_framework import serializers
from apps.common.models import Diff, Lang, User
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError


class ScoreSerializer(BaseSerializer):
    """
    スコアデータを処理するためのシリアライザクラス。
    ユーザーID、言語ID、難易度ID、タイピング数、正確度、スコアのバリデーションを行います。
    """

    ACTION_CHOICES = ["get_average_score", "get_past_scores"]  # アクションの選択肢
    action = serializers.ChoiceField(
        choices=ACTION_CHOICES, required=False
    )  # アクションフィールド
    user_id = serializers.UUIDField()  # ユーザーID
    lang_id = serializers.IntegerField(required=False)  # 言語ID
    diff_id = serializers.IntegerField(required=False)  # 難易度ID
    typing_count = serializers.IntegerField(required=False, min_value=0)  # タイピング数
    accuracy = serializers.FloatField(
        required=False, min_value=0, max_value=1
    )  # 正確度
    score = serializers.IntegerField(required=False, min_value=0)  # スコア

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        ユーザー、言語、難易度の存在確認、アクションの検証を行います。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            dict: バリデーションを通過したデータ。
        """
        # 共通のバリデーションメソッドを使用
        attrs = self.check_user_id(attrs)
        attrs = self.check_lang_id(attrs)
        attrs = self.check_diff_id(attrs)

        # アクションの検証
        action = attrs.get("action")
        if action and action not in self.ACTION_CHOICES:
            raise ValidationError("無効なアクションが指定されました。")

        return attrs
