from rest_framework import serializers
from apps.common.serializers import BaseSerializer
from rest_framework.exceptions import ValidationError
from django.core.cache import cache


class InsertScoreSerializer(BaseSerializer):
    """
    スコアデータに関連するリクエストデータを検証するシリアライザクラス。
    """

    user_id = serializers.UUIDField()  # ユーザーID
    lang_id = serializers.IntegerField()  # 言語ID
    diff_id = serializers.IntegerField()  # 難易度ID
    typing_count = serializers.IntegerField(min_value=0)  # タイピング数
    accuracy = serializers.FloatField(min_value=0, max_value=1)  # 正確度


class GetScoreSerializer(BaseSerializer):
    """
    ユーザーのスコアを取得するためのシリアライザー。
    """

    ACTION_CHOICES = ["get_average_score", "get_past_scores"]  # アクションの選択肢
    action = serializers.ChoiceField(choices=ACTION_CHOICES)  # アクションフィールド
    user_id = serializers.UUIDField()  # ユーザーID
    lang_id = serializers.IntegerField()  # 言語ID
    diff_id = serializers.IntegerField()  # 難易度ID


class GetUserRankingSerializer(BaseSerializer):
    """
    ユーザーのランキングを取得するためのシリアライザー。
    """

    user_id = serializers.UUIDField()  # ユーザーID
    lang_id = serializers.IntegerField()  # 言語ID
    diff_id = serializers.IntegerField()  # 難易度ID
    score = serializers.IntegerField()  # スコア


class UserRankSerializer(BaseSerializer):
    """
    ユーザーのランクを取得するためのシリアライザー。
    """

    user_id = serializers.UUIDField()

    def validate(self, attrs):
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

        if cached_rank_name is None:
            raise ValidationError("キャッシュに登録されているランクが見つかりません。")

        # キャッシュが存在する場合のみバリデーションを実行
        if cache_key != f"user_rank_{user_id}":
            raise ValidationError(
                "リクエストのユーザーIDとキャッシュのユーザーIDが一致しません。"
            )
