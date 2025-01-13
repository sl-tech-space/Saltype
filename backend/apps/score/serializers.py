from rest_framework import serializers
from apps.common.models import Diff, Lang, User
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError
from django.core.cache import cache


class ScoreSerializer(BaseSerializer):
    """
    スコアデータに関連するリクエストデータを検証するシリアライザクラス。
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
        リクエストデータに対してバリデーションを実行します。

        Args:
            attrs (dict): バリデーション対象のデータ。
        Returns:
            attrs: バリデーションを通過したデータ。
        """
        # ユーザーIDのバリデーション
        attrs = self.check_user_id(attrs)
        # 言語IDのバリデーション
        attrs = self.check_lang_id(attrs)
        # 難易度IDのバリデーション
        attrs = self.check_diff_id(attrs)
        # アクションのバリデーション
        attrs = self.check_action(attrs, self.ACTION_CHOICES)
        # キャッシュキーのバリデーション
        self.check_cache_key(attrs)

        return attrs

    def check_cache_key(self, attrs):
        """
        キャッシュに登録されているキーとリクエストのキーが一致するか確認します。
        """
        user_id = attrs.get("user_id")
        cache_key = f"user_rank_{user_id}"
        cached_rank_name = cache.get(cache_key)

        if cached_rank_name is not None:
            # キャッシュが存在する場合のみバリデーションを実行
            if cache_key != f"user_rank_{user_id}":
                raise ValidationError(
                    "リクエストのユーザーIDとキャッシュのユーザーIDが一致しません。"
                )
