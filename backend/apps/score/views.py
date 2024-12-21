from apps.common.models import Score, User
from django.db import transaction
from django.db.models import Avg, Max
from .base_view import BaseScoreView


class InsertScoreView(BaseScoreView):
    """
    ユーザーのスコアを挿入するためのAPIビュークラス。
    スコアの計算、データベースへの挿入を行います。
    """

    SCORE_MULTIPLIER = 10  # スコア計算時の乗数

    def handle_request(self, validated_data: dict):
        """
        スコアを挿入するリクエストを処理します。
        引数として提供されたデータに基づいてスコアを計算し、データベースに保存します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: スコア挿入結果を含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        typing_count = validated_data["typing_count"]
        accuracy = validated_data["accuracy"]

        # タイピング数と正確度からスコアを計算
        calculated_score = self.calculate_score(typing_count, accuracy)

        # スコアをデータベースに挿入
        score_data = self.insert_score(
            user_id,
            lang_id,
            diff_id,
            calculated_score,
        )
        # 挿入結果をレスポンスとして返す
        return {
            "status": "success",
            "user_id": score_data.user_id,
            "lang_id": score_data.lang_id,
            "diff_id": score_data.diff_id,
            "score": calculated_score,
        }

    @transaction.atomic
    def insert_score(
        self, user_id: int, lang_id: int, diff_id: int, calculated_score: float
    ):
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

    def calculate_score(self, typing_count: int, accuracy: float):
        """
        スコアを計算します。
        スコアは、タイピング数と正確度に基づいて計算され、定数 `SCORE_MULTIPLIER` が掛けられます。

        Args:
            typing_count (int): 入力した文字数。
            accuracy (float): 正確度。
        Returns:
            float: 計算されたスコア。
        """
        return round(typing_count * self.SCORE_MULTIPLIER * accuracy)


class GetScoreView(BaseScoreView):
    """
    ユーザーのスコアに関連するリクエストを処理するAPIビュークラス。
    ユーザーの平均スコアや過去のスコアを取得します。
    """

    def handle_request(self, validated_data: dict):
        """
        ユーザーのスコアに関連するリクエストを処理します。
        `action` によって処理を分け、指定されたアクションに応じた処理を行います。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 処理結果を含むレスポンスデータ。
        """
        action = validated_data.get("action")
        user_id = validated_data["user_id"]
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]

        if action == "get_average_score":  # 平均スコアを取得
            average_score = self.get_average_score(
                user_id,
                lang_id,
                diff_id,
            )
            return {
                "status": "success",
                "average_score": round(average_score),
            }

        elif action == "get_past_scores":  # 過去のスコアを取得
            past_scores = self.get_past_scores(
                user_id,
                lang_id,
                diff_id,
            )
            return {"status": "success", "scores": past_scores}

    def get_average_score(self, user_id: int, lang_id: int, diff_id: int):
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

    def get_past_scores(self, user_id: int, lang_id: int, diff_id: int):
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
        scores = Score.objects.select_related("user", "lang", "diff").filter(
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id,
        )
        return [score.score for score in scores]


class GetUserRankingView(BaseScoreView):
    """
    ユーザーのスコアに基づくランキング位置を取得するためのAPIビュークラス。
    ユーザーのスコアが全体で何位かを計算します。
    """

    def handle_request(self, validated_data: dict):
        """
        ユーザーのスコアに基づくランキング位置を取得します。
        引数として提供されたスコアとユーザーIDを基に、ランキング位置を決定します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: ユーザーのランキング位置を含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        score = validated_data["score"]

        ranking_position = self.get_ranking_position(user_id, lang_id, diff_id, score)
        return {"status": "success", "ranking_position": ranking_position}

    def get_ranking_position(
        self, score: int, user_id: int, lang_id: int, diff_id: int
    ):
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

        # ランキング位置（1位からの順位）を計算
        return higher_score_count + 1


class UpdateUserRankView(BaseScoreView):
    """
    スコアに基づいてランクを決定し、ユーザーのランクを更新するAPIビュークラス。
    ユーザーのスコアに基づいて、適切なランクを決定します。
    """

    RANKS = {
        1000: "社長",
        900: "取締役",
        700: "部長",
        500: "課長",
        300: "係長",
        100: "主任",
        0: "メンバー",
    }

    def handle_request(self, validated_data: dict):
        """
        ユーザーのスコアに基づいてランクを決定し、最高スコアであればランクを更新します。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。

        Returns:
            dict: ランク決定と更新結果を含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        score = validated_data["score"]
        # ランクを決定
        rank_name = self.determine_rank(score)
        # 最高スコア判定
        is_highest = self.is_highest_score(user_id, lang_id, diff_id, score)
        # 最高スコアであればランクを更新
        if is_highest:
            # ランクIDを取得して更新
            self.update_user_rank(user_id, score)
        return {
            "status": "success",
            "is_highest": is_highest,
            "rank_name": rank_name,
        }

    def determine_rank(self, score: int):
        """
        スコアに基づいて適切なランクを決定します。
        ランクはスコア順にソートされ、指定されたスコア以上の最初のランクが選ばれます。

        Args:
            score (int): スコア。

        Returns:
            str: 決定されたランク名。
        """
        # ランクをスコア順にソートし、スコア以上の最初のランクを返す
        for threshold, rank in sorted(self.RANKS.items(), reverse=True):
            if score >= threshold:
                return rank
        return "メンバー"

    def is_highest_score(self, score: int, user_id: int, lang_id: int, diff_id: int):
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
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id,
        ).aggregate(Max("score"))["score__max"]

        return highest_score is None or score > highest_score

    def update_user_rank(self, score: int, user_id: int):
        """
        ユーザーのランクを更新します。
        新しいランクを決定し、ユーザーのランクIDを更新します。

        Args:
            score (int): ユーザーのスコア。
            user_id (int): ユーザーID。
        """
        user = User.objects.get(user_id=user_id)
        rank_name = self.determine_rank(score)
        rank_id = list(self.RANKS.keys())[list(self.RANKS.values()).index(rank_name)]
        user.rank_id = rank_id
        user.save()
