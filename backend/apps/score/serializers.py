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
        # ユーザーの存在を確認し、オブジェクトを追加
        user_id = attrs.get("user_id")
        if user_id:
            try:
                attrs["user"] = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                raise ValidationError({"user_id": "指定されたユーザーは存在しません。"})

        # 言語の存在を確認し、オブジェクトを追加
        lang_id = attrs.get("lang_id")
        if lang_id:
            try:
                attrs["lang"] = Lang.objects.get(pk=lang_id)
            except Lang.DoesNotExist:
                raise ValidationError({"lang_id": "指定された言語は存在しません。"})

        # 難易度の存在を確認し、オブジェクトを追加
        diff_id = attrs.get("diff_id")
        if diff_id:
            try:
                attrs["diff"] = Diff.objects.get(pk=diff_id)
            except Diff.DoesNotExist:
                raise ValidationError({"diff_id": "指定された難易度は存在しません。"})

        # アクションの検証
        action = attrs.get("action")
        if action and action not in self.ACTION_CHOICES:
            raise ValidationError("無効なアクションが指定されました。")

        return attrs
