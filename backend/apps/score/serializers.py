from rest_framework import serializers
from apps.common.models import Diff, Lang, User
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError
from django.core.cache import cache


class ScoreSerializer(BaseSerializer):
    """
    スコアデータを処理するためのシリアライザクラス。
    ユーザーID、言語ID、難易度ID、アクション、タイピング数、正確度、スコアに関するバリデーションを行います。
    """

    ACTION_CHOICES = ["get_average_score", "get_past_scores"]  # アクションの選択肢
    action = serializers.ChoiceField(
        choices=ACTION_CHOICES, required=False
    )  # アクションフィールド
    user_id = serializers.UUIDField()  # ユーザーID（必須）
    lang_id = serializers.IntegerField(required=False)  # 言語ID
    diff_id = serializers.IntegerField(required=False)  # 難易度ID
    typing_count = serializers.IntegerField(
        required=False, min_value=0
    )  # タイピング数（オプション、0以上）
    accuracy = serializers.FloatField(
        required=False, min_value=0, max_value=1
    )  # 正確度（オプション、0〜1の範囲）
    score = serializers.IntegerField(
        required=False, min_value=0
    )  # スコア（オプション、0以上）

    def validate(self, attrs):
        """
        入力データに対してバリデーションを実行します。
        ユーザーID、言語ID、難易度ID、アクションの有効性を確認します。
        """

        # ユーザーIDの存在確認
        attrs = self.check_user_id(attrs)
        # 言語IDの存在確認
        attrs = self.check_lang_id(attrs)
        # 難易度IDの存在確認
        attrs = self.check_diff_id(attrs)
        # アクションの選択肢が有効であることを確認
        attrs = self.check_action(attrs, self.ACTION_CHOICES)

        # キャッシュキーのバリデーション
        self.validate_cache_key(attrs)

        return attrs

    def validate_cache_key(self, attrs):
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
