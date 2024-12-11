from apps.common.models import Score, User
from django.db import transaction
from django.db.models import Avg, Max
from .base_view import BaseScoreView


class ScoreInsertView(BaseScoreView):
    """
    スコアをデータベースに挿入するためのAPIビュークラス。
    """

    SCORE_MULTIPLIER = 10

    def handle_request(self, validated_data: dict):
        """
        スコアを挿入するリクエストを処理。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Returns:
            dict: スコア挿入結果のレスポンスデータ。
        """
        score_data = self.insert_score(validated_data)
        return self.format_response(score_data)

    @transaction.atomic
    def insert_score(self, validated_data: dict):
        """
        スコアをデータベースに挿入。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Returns:
            Score: 保存されたスコアインスタンス。
        """
        calculated_score = self.calculate_score(
            validated_data["typing_count"], validated_data["accuracy"]
        )
        return Score.objects.create(
            user_id=validated_data["user_id"],
            lang_id=validated_data["lang_id"],
            diff_id=validated_data["diff_id"],
            score=calculated_score,
        )

    def calculate_score(self, typing_count: int, accuracy: float):
        """
        スコアを計算。

        Args:
            typing_count: 入力した文字数。
            accuracy: 正確度。
        Returns:
            float: 計算されたスコア。
        """
        return round(typing_count * self.SCORE_MULTIPLIER * accuracy)

    def format_response(self, score_data: Score):
        """
        スコア挿入結果をレスポンス形式でフォーマット。

        Args:
            score_instance: 保存されたスコアインスタンス。
        Returns:
            dict: フォーマットされたレスポンスデータ。
        """
        return {
            "status": "success",
            "user_id": score_data.user_id,
            "lang_id": score_data.lang_id,
            "diff_id": score_data.diff_id,
            "score": score_data.score,
        }


class ScoreSelectView(BaseScoreView):
    """
    ユーザーのスコアに関連するリクエストを処理するAPIビュークラス。
    """

    def handle_request(self, validated_data: dict):
        """
        ユーザーのスコアに関連するリクエストを処理。`action` によって処理を分ける。
        """
        action = validated_data.get("action")

        if action == "get_average_score":  # 平均スコアを取得
            average_score = self.get_average_score(validated_data)
            return self.format_response({"average_score": round(average_score)})

        elif action == "get_past_scores":  # 過去のスコアを取得
            past_scores = self.get_past_scores(validated_data)
            return self.format_response({"scores": past_scores})

    def get_average_score(self, validated_data: dict):
        """
        特定の条件で平均スコアを計算。

        Args:
            validated_data: バリデーション済みのリクエストデータ。
        Returns:
            float: 平均スコア。
        """
        return Score.objects.filter(
            **{key: validated_data[key] for key in ["user_id", "lang_id", "diff_id"]}
        ).aggregate(Avg("score"))["score__avg"]

    def get_past_scores(self, validated_data):
        """
        ユーザーの過去のスコアをデータベースから取得。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Returns:
            list: ユーザーの過去スコアのリスト。
        """
        scores = Score.objects.select_related("user", "lang", "diff").filter(
            **{key: validated_data[key] for key in ["user_id", "lang_id", "diff_id"]}
        )
        # `score` フィールドの値をリストとして返す
        return [score.score for score in scores]


class UserRankingView(BaseScoreView):
    """
    ユーザーのスコアに基づくランキング位置を取得するためのAPIビュークラス。
    """

    def handle_request(self, validated_data: dict):
        """
        ユーザーのスコアに基づくランキング位置を取得。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Returns:
            dict: ランキング位置を含むレスポンスデータ。
        """
        ranking_position = self.get_ranking_position(validated_data)
        return self.format_response(ranking_position)

    def get_ranking_position(self, validated_data: dict) -> int:
        """
        ユーザーのスコアよりも高いスコアの数を数え、ランキング位置を決定。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Returns:
            int: ユーザーのランキング位置（1位からの順位）。
        """
        # validated_data から動的にフィルタリングする
        higher_score_count = Score.objects.filter(
            score__gt=validated_data["score"],
            **{key: validated_data[key] for key in ["user_id", "lang_id", "diff_id"]},
        ).count()

        # ランキング位置（1位からの順位）を計算
        return higher_score_count + 1

    def format_response(self, ranking_position: int) -> dict:
        """
        ランキング位置をレスポンス形式でフォーマット。

        Args:
            ranking_position: ユーザーのランキング位置。
        Returns:
            dict: ランキング位置を含むレスポンスデータ。
        """
        return {"status": "success", "ranking_position": ranking_position}


class UserRankView(BaseScoreView):
    """
    スコアに基づいてランクを決定し、ユーザーのランクを更新するAPIビュークラス。
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
        ユーザーのスコアに基づいてランクを決定し、最高スコアであればランクを更新するリクエストを処理。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Returns:
            dict: ランク決定と更新結果を含むレスポンスデータ。
        """
        # スコアに基づいてランクを決定
        rank_name = self.determine_rank(validated_data["score"])

        # 最高スコア判定
        if self.is_highest_score(validated_data):
            # ランクIDを取得して更新
            rank_id = self.get_rank_id_by_name(rank_name)
            self.update_user_rank(validated_data["user_id"], rank_id)

            return self.format_response(True, rank_name)
        return self.format_response(False, rank_name)

    def determine_rank(self, score: int):
        """
        スコアに基づいて適切なランクを決定。

        Args:
            score: スコア。
        Returns:
            str: 決定されたランク名。
        """
        # ランクをスコア順にソートし、スコア以上の最初のランクを返す
        for threshold, rank in sorted(self.RANKS.items(), reverse=True):
            if score >= threshold:
                return rank
        return "メンバー"

    def is_highest_score(self, validated_data: dict):
        """
        ユーザーの最高スコアを取得し、提供されたスコアと比較。

        Args:
            validated_data: バリデーション済みのリクエストデータ（user_id, lang_id, diff_id, score）。
        Returns:
            bool: 最高スコアの場合はTrue、それ以外はFalse。
        """
        highest_score = Score.objects.filter(
            **{key: validated_data[key] for key in ["user_id", "lang_id", "diff_id"]},
        ).aggregate(Max("score"))["score__max"]

        return highest_score is None or validated_data["score"] > highest_score

    def get_rank_id_by_name(self, rank_name: str):
        """
        ランク名に基づいてランクIDを取得。

        Args:
            rank_name: ランク名。

        Returns:
            int: ランクID。
        """
        return list(self.RANKS.values()).index(rank_name) + 1

    def update_user_rank(self, user_id: int, rank_id: int):
        """
        ユーザーのランクを更新。

        Args:
            user_id: ユーザーID。
            rank_id: 新しいランクID。
        """
        user = User.objects.get(user_id=user_id)
        user.rank_id = rank_id
        user.save()

    def format_response(self, is_highest: bool, rank_name: str):
        """
        ランク決定および更新結果をレスポンス形式でフォーマット。

        Args:
            is_highest: 最高スコアかどうか。
            rank_name: 新しいランク名。
        Returns:
            dict: フォーマットされたレスポンスデータ。
        """
        return {
            "status": "success",
            "is_highest": is_highest,
            "rank_name": rank_name,
        }
