from apps.common.models import Score, User, Rank
from django.db import transaction
from django.db.models import Avg, Max
from django.core.cache import cache
from rest_framework.exceptions import ValidationError
from .serializers import (
    UserRankSerializer,
    GetUserRankingSerializer,
    GetScoreSerializer,
    InsertScoreSerializer,
)
from apps.common.views import BaseView


class InsertScoreView(BaseView):
    """
    ユーザーのスコアを挿入または更新するためのAPIビュークラス。
    スコアの計算、データベースへの挿入、最高スコアの場合はランクの更新を行います。
    """

    RANKS = {
        900: "社長",
        800: "取締役",
        700: "部長",
        600: "課長",
        500: "係長",
        400: "主任",
        0: "メンバー",
    }
    SCORE_MULTIPLIER = 10  # スコア計算時の乗数

    def post(self, request, *args, **kwargs):
        return super().post(request, InsertScoreSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data: dict):
        """
        スコアを挿入または更新するリクエストを処理します。
        引数として提供されたデータに基づいてスコアを計算し、データベースに保存します。
        最高スコアであればランクを更新します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: スコア挿入または更新結果を含むレスポンスデータ。
        """
        user_id = validated_data.get("user_id")
        lang_id = validated_data.get("lang_id")
        diff_id = validated_data.get("diff_id")
        typing_count = validated_data.get("typing_count")
        accuracy = validated_data.get("accuracy")

        # スコアを計算
        calculated_score = self.calculate_score(typing_count, accuracy)

        # 最高スコア判定
        is_highest = self.is_highest_score(user_id, lang_id, diff_id, calculated_score)

        # 挑戦結果のランクを決定
        rank_name = self.determine_rank(typing_count)

        # キャッシュにランク名を保存
        cache_key = f"user_rank_{user_id}"
        cache.set(cache_key, rank_name, timeout=600)  # 10分のキャッシュ

        # 最高ならランク更新
        if is_highest:
            self.update_user_rank(user_id, rank_name)

        # スコアをインサート
        score_data = self.insert_score(
            user_id,
            lang_id,
            diff_id,
            calculated_score,
            typing_count,
            accuracy,
        )

        return {
            "status": "success",
            "score": calculated_score,
            "is_highest": is_highest,
        }

    @transaction.atomic
    def insert_score(
        self,
        user_id: int,
        lang_id: int,
        diff_id: int,
        calculated_score: float,
        typing_count: int,
        accuracy: float,
    ) -> Score:
        """
        スコアをデータベースに挿入します。

        トランザクションを利用して、スコアの挿入処理を一貫して行います。

        Args:
            user_id (int): ユーザーID。
            lang_id (int): 言語ID。
            diff_id (int): 難易度ID。
            calculated_score (float): 計算されたスコア。
            typing_count (int): タイピング数。
            accuracy (float): 正確度。
        Returns:
            Score: 保存されたスコアインスタンス。
        """
        return Score.objects.create(
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id,
            score=calculated_score,
            typing_count=typing_count,
            accuracy=accuracy,
        )

    def calculate_score(self, typing_count: int, accuracy: float) -> int:
        """
        スコアを計算します。
        スコアは、タイピング数と正確度に基づいて計算され、定数 `SCORE_MULTIPLIER` が掛けられます。

        Args:
            typing_count (int): 入力した文字数。
            accuracy (float): 正確度。
        Returns:
            int: 計算されたスコア。
        """
        return round(typing_count * self.SCORE_MULTIPLIER * accuracy)

    def determine_rank(self, typing_count: int) -> str:
        """
        タイピング数に基づいて適切なランクを決定します。
        ランクはタイピング数順にソートされ、指定されたタイピング数以上の最初のランクが選ばれます。

        Args:
            typing_count (int): タイピング数。

        Returns:
            str: 決定されたランク名。
        """
        for threshold, rank in sorted(self.RANKS.items(), reverse=True):
            if typing_count >= threshold:
                return rank
        return "メンバー"

    def is_highest_score(
        self, user_id: int, lang_id: int, diff_id: int, score: int
    ) -> bool:
        """
        ユーザーの最高スコアを取得し、提供されたスコアと比較します。

        Args:
            score (int): 提供されたスコア。
            user_id (int): ユーザーID。
            lang_id (int): 言語ID。
            diff_id (int): 難易度ID。
        Returns:
            bool: 最高スコアの場合はTrue、それ以外はFalse。
        """
        highest_score = Score.objects.filter(
            user_id=user_id, lang_id=lang_id, diff_id=diff_id
        ).aggregate(Max("score"))["score__max"]

        return highest_score is None or score > highest_score

    @transaction.atomic
    def update_user_rank(self, user_id: int, rank_name: str) -> None:
        """
        ユーザーのランクを更新します。
        """
        user = User.objects.select_for_update().get(user_id=user_id)
        rank = Rank.objects.get(rank=rank_name)
        user.rank_id = rank.rank_id
        user.save()


class GetScoreView(BaseView):
    """
    ユーザーのスコアに関連するリクエストを処理するAPIビュークラス。
    ユーザーの平均スコアや過去のスコアを取得します。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, GetScoreSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data: dict):
        """
        ユーザーのスコアに関連するリクエストを処理します。
        `action` によって処理を分け、指定されたアクションに応じた処理を行います。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 処理結果を含むレスポンスデータ。
        """
        action = validated_data.get("action")
        user_id = validated_data.get("user_id")
        lang_id = validated_data.get("lang_id")
        diff_id = validated_data.get("diff_id")

        if action == "get_average_score":
            average_score = self.get_average_score(user_id, lang_id, diff_id)
            return {
                "status": "success",
                "average_score": round(average_score) if average_score else 0,
            }

        elif action == "get_past_scores":
            past_scores = self.get_past_scores(user_id, lang_id, diff_id)
            return {"status": "success", "scores": past_scores}

    def get_average_score(self, user_id: int, lang_id: int, diff_id: int) -> float:
        """
        特定のユーザー、言語、難易度に基づく平均スコアを計算します。

        Args:
            user_id (int): ユーザーID。
            lang_id (int): 言語ID。
            diff_id (int): 難易度ID。
        Returns:
            float: 計算された平均スコア。
        """
        return Score.objects.filter(
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id,
        ).aggregate(Avg("score"))["score__avg"]

    def get_past_scores(self, user_id: int, lang_id: int, diff_id: int) -> list:
        """
        ユーザーの過去のスコアを取得します。
        指定された条件に合致する過去のスコアをリストとして返します。

        Args:
            user_id (int): ユーザーID。
            lang_id (int): 言語ID。
            diff_id (int): 難易度ID。
        Returns:
            list: ユーザーの過去スコアのリスト。
        """
        scores = Score.objects.filter(
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id,
        ).order_by("-created_at")
        return [score.score for score in scores]


class GetUserRankingView(BaseView):
    """
    ユーザーのスコアに基づくランキング位置を取得するためのAPIビュークラス。
    ユーザーのスコアが全体で何位かを計算します。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, GetUserRankingSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data: dict):
        """
        ユーザーのスコアに基づくランキング位置を取得します。
        引数として提供されたスコアとユーザーIDを基に、ランキング位置を決定します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: ユーザーのランキング位置を含むレスポンスデータ。
        """
        user_id = validated_data.get("user_id")
        lang_id = validated_data.get("lang_id")
        diff_id = validated_data.get("diff_id")
        score = validated_data.get("score")

        ranking_position = self.get_ranking_position(score, user_id, lang_id, diff_id)
        return {"status": "success", "ranking_position": ranking_position}

    def get_ranking_position(
        self, score: int, user_id: int, lang_id: int, diff_id: int
    ) -> int:
        """
        ユーザーのスコアよりも高いスコアの数を数え、ランキング位置を決定します。

        Args:
            score (int): ユーザーのスコア。
            user_id (int): ユーザーID。
            lang_id (int): 言語ID。
            diff_id (int): 難易度ID。
        Returns:
            int: ユーザーのランキング位置（1位からの順位）。
        """
        user_max_scores = Score.objects.filter(
            lang_id=lang_id,
            diff_id=diff_id,
        ).values('user_id').annotate(max_score=Max('score'))

        higher_score_count = user_max_scores.filter(
            max_score__gt=score
        ).count()

        return higher_score_count + 1


class GetUserRankView(BaseView):
    """
    ユーザーIDに基づいてキャッシュに登録されたランクの名前を取得するためのAPIビュークラス。
    このクラスは、キャッシュからユーザーのランクを取得し、レスポンスとして返します。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, UserRankSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data: dict):
        """
        ユーザーIDに基づきキャッシュからランク名を取得するリクエストを処理します。
        キャッシュにランク名が存在しない場合はエラーを返します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
                - user_id: ユーザーID（`int`）。キャッシュに格納されているランクを特定するために使用します。
        Returns:
            dict: ユーザーのランク名を含むレスポンスデータ。
                - status: 成功を示す文字列（`"success"`）。
                - rank_name: ユーザーのランク名（`str`）。
        """
        user_id = validated_data["user_id"]
        cache_key = f"user_rank_{user_id}"

        # キャッシュのバリデーションはシリアライザーで行うため削除
        rank_name = cache.get(cache_key)

        return {"status": "success", "rank_name": rank_name}
