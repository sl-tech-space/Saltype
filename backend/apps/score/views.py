from apps.common.models import Score, User, Rank
from django.db import transaction
from django.db.models import Avg, Max
from .base_view import BaseScoreView
from django.core.cache import cache
from rest_framework.exceptions import ValidationError


class InsertScoreView(BaseScoreView):
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
        user = validated_data["user"]
        lang = validated_data["lang"]
        diff = validated_data["diff"]
        typing_count = validated_data["typing_count"]
        accuracy = validated_data["accuracy"]

        # スコアを計算
        calculated_score = self.calculate_score(typing_count, accuracy)

        # 最高スコア判定
        is_highest = self.is_highest_score(
            user.user_id, lang.lang_id, diff.diff_id, calculated_score
        )

        # 挑戦結果のランクを決定
        rank_name = self.determine_rank(typing_count)

        # キャッシュにランク名を保存
        cache_key = f"user_rank_{user.user_id}"
        cache.set(cache_key, rank_name, timeout=3600)  # 1時間のキャッシュ

        # 最高ならランク更新
        if is_highest:
            self.update_user_rank(user.user_id, rank_name)

        # スコアをインサート
        score_data = self.insert_score(
            user.user_id,
            lang.lang_id,
            diff.diff_id,
            calculated_score,
        )

        return {
            "status": "success",
            "score": calculated_score,
            "is_highest": is_highest,
        }

    @transaction.atomic
    def insert_score(
        self, user_id: int, lang_id: int, diff_id: int, calculated_score: float
    ) -> Score:
        """
        スコアをデータベースに挿入します。

        トランザクションを利用して、スコアの挿入処理を一貫して行います。

        Args:
            user_id (int): ユーザーID。
            lang_id (int): 言語ID。
            diff_id (int): 難易度ID。
            calculated_score (float): 計算されたスコア。
        Returns:
            Score: 保存されたスコアインスタンス。
        """
        return Score.objects.create(
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id,
            score=calculated_score,
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
        highest_score = (
            Score.objects.filter(user_id=user_id, lang_id=lang_id, diff_id=diff_id)
            .order_by("-score")
            .values_list("score", flat=True)
            .first()
        )

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


class GetScoreView(BaseScoreView):
    """
    ユーザーのスコアに関連するリクエストを処理するAPIビュークラス。
    ユーザーの平均スコアや過去のスコアを取得します。
    """

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
        user = validated_data["user"]
        lang = validated_data["lang"]
        diff = validated_data["diff"]

        if action == "get_average_score":
            average_score = self.get_average_score(
                user.user_id, lang.lang_id, diff.diff_id
            )
            return {
                "status": "success",
                "average_score": round(average_score) if average_score else 0,
            }

        elif action == "get_past_scores":
            past_scores = self.get_past_scores(user.user_id, lang.lang_id, diff.diff_id)
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


class GetUserRankingView(BaseScoreView):
    """
    ユーザーのスコアに基づくランキング位置を取得するためのAPIビュークラス。
    ユーザーのスコアが全体で何位かを計算します。
    """

    def handle_post_request(self, validated_data: dict):
        """
        ユーザーのスコアに基づくランキング位置を取得します。
        引数として提供されたスコアとユーザーIDを基に、ランキング位置を決定します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: ユーザーのランキング位置を含むレスポンスデータ。
        """
        user = validated_data["user"]
        lang = validated_data["lang"]
        diff = validated_data["diff"]
        score = validated_data["score"]

        ranking_position = self.get_ranking_position(
            score, user.user_id, lang.lang_id, diff.diff_id
        )
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
        higher_score_count = Score.objects.filter(
            score__gt=score,
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id,
        ).count()

        return higher_score_count + 1


class GetUserRankView(BaseScoreView):
    """
    ユーザーIDに基づいてキャッシュに登録されたランクの名前を取得するためのAPIビュークラス。
    """

    def handle_post_request(self, validated_data: dict):
        user_id = validated_data["user_id"]
        cache_key = f"user_rank_{user_id}"

        rank_name = cache.get(cache_key)

        if rank_name is None:
            raise ValidationError("キャッシュに登録されているランクが見つかりません。")

        return {"status": "success", "rank_name": rank_name}
