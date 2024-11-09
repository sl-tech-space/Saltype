from typing import Optional
from apps.common.models import Score, User
from apps.common.util.exception_handler import HandleExceptions
from django.db import transaction
from django.db.models import Avg, Max
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ScoreSerializer


class ScoreView(APIView):
    """
    スコアに関連する操作のためのスーパークラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでスコア関連のリクエストを処理。

        Args:
            request: HTTPリクエストオブジェクト。

        Returns:
            Response: 成功時はスコアに関する情報が含まれたレスポンス。
        """
        serializer = ScoreSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = self.handle_request(serializer.validated_data)
        return Response(response_data, status=status.HTTP_200_OK)

    def handle_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータ処理ロジック。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。

        Raises:
            NotImplementedError: サブクラスで実装が必要な場合に発生。

        Returns:
            dict: 処理結果を返す辞書。
        """
        raise NotImplementedError(
            "サブクラスはhandle_requestメソッドを実装する必要あり"
        )


class ScoreInsertView(ScoreView):
    """
    スコアをデータベースに挿入するためのAPIビュークラス。
    """

    SCORE_MULTIPLIER = 10

    def handle_request(self, validated_data: dict) -> dict:
        """
        スコアを挿入するリクエストを処理。

        リクエストデータをもとにスコアを計算し、データベースに保存します。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。

        Returns:
            dict: スコア挿入結果のレスポンスデータ。
        """
        score_instance = self.insert_score(validated_data)
        return self.format_response(score_instance)

    @transaction.atomic
    def insert_score(self, validated_data: dict) -> Score:
        """
        スコアをデータベースに挿入。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。

        Returns:
            Score: 保存されたスコアインスタンス。
        """
        user = validated_data["user"]
        lang = validated_data["lang"]
        diff = validated_data["diff"]
        typing_count = validated_data["typing_count"]
        accuracy = validated_data["accuracy"]
        calculated_score = self.calculate_score(typing_count, accuracy)
        return Score.objects.create(
            user=user, lang=lang, diff=diff, score=calculated_score
        )

    def calculate_score(self, typing_count: int, accuracy: float) -> float:
        """
        入力データに基づいてスコアを計算。

        Args:
            typing_count: 入力した文字数。
            accuracy: 正確度。

        Returns:
            float: 計算されたスコア。
        """
        return round(typing_count * self.SCORE_MULTIPLIER * accuracy)

    def format_response(self, score_instance: Score) -> dict:
        """
        スコア挿入結果をレスポンス形式でフォーマット。

        Args:
            score_instance: 保存されたスコアインスタンス。

        Returns:
            dict: フォーマットされたレスポンスデータ。
        """
        return {
            "status": "success",
            "user_id": score_instance.user_id,
            "lang_id": score_instance.lang_id,
            "diff_id": score_instance.diff_id,
            "score": score_instance.score,
        }


class AverageScoreView(ScoreView):
    """
    ユーザーの特定の条件に基づく平均スコアを取得するためのAPIビュークラス。
    """

    def handle_request(self, validated_data: dict) -> dict:
        """
        ユーザーの平均スコアを取得するリクエストを処理。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。

        Returns:
            dict: 平均スコアを含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        average_score = self.get_average_score(user_id, lang_id, diff_id)
        return self.format_response(average_score)

    def get_average_score(self, user_id: int, lang_id: int, diff_id: int) -> float:
        """
        特定の条件で平均スコアを計算。

        Args:
            user_id: ユーザーID。
            lang_id: 言語ID。
            diff_id: 難易度ID。

        Returns:
            float: 平均スコア。
        """
        average_score = Score.objects.filter(
            user_id=user_id, lang_id=lang_id, diff_id=diff_id
        ).aggregate(Avg("score"))["score__avg"]
        return average_score

    def format_response(self, average_score: float) -> dict:
        """
        平均スコア取得結果をレスポンス形式でフォーマット。

        Args:
            average_score: 計算された平均スコア。

        Returns:
            dict: フォーマットされたレスポンスデータ。
        """
        return {"status": "success", "average_score": round(average_score or 0)}


class PastScoresView(ScoreView):
    """
    ユーザーの過去のスコアを取得するためのAPIビュークラス。
    """

    def handle_request(self, validated_data: dict) -> dict:
        """
        ユーザーの過去のスコアを取得するリクエストを処理。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。

        Returns:
            dict: 過去スコアのリストを含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        scores = self.get_past_scores(user_id, lang_id, diff_id, limit=30)
        return self.format_response(scores)

    def get_past_scores(
        self, user_id: int, lang_id: int, diff_id: int, limit: int = 30
    ) -> list:
        """
        ユーザーの過去のスコアをデータベースから取得。

        Args:
            user_id: ユーザーID。
            lang_id: 言語ID。
            diff_id: 難易度ID。
            limit: 取得するスコアの最大件数（デフォルトは30件）。

        Returns:
            list: ユーザーの過去スコアのリスト。
        """
        past_scores = (
            Score.objects.filter(user_id=user_id, lang_id=lang_id, diff_id=diff_id)
            .order_by("-created_at")
            .only("score")[:limit]
        )
        return past_scores

    def format_response(self, scores: list) -> dict:
        """
        過去スコアの取得結果をレスポンス形式でフォーマット。

        Args:
            scores: ユーザーの過去スコア。

        Returns:
            dict: フォーマットされたレスポンスデータ。
        """
        return {"status": "success", "scores": [score.score for score in scores]}


class UserRankingView(ScoreView):
    """
    ユーザーのスコアに基づくランキング位置を取得するためのAPIビュークラス。
    """

    def handle_request(self, validated_data: dict) -> dict:
        """
        ユーザーのスコアに基づくランキング位置を取得。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。

        Returns:
            dict: ランキング位置を含むレスポンスデータ。
        """
        user_id = validated_data["user_id"]
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        score = validated_data["score"]
        ranking_position = self.get_ranking_position(user_id, lang_id, diff_id, score)
        return self.format_response(ranking_position)

    def get_ranking_position(
        self, user_id: int, lang_id: int, diff_id: int, score: float
    ) -> int:
        """
        ユーザーのスコアよりも高いスコアの数を数え、ランキング位置を決定。

        Args:
            user_id: ユーザーID。
            lang_id: 言語ID。
            diff_id: 難易度ID。
            score: ユーザーのスコア。

        Returns:
            int: ユーザーのランキング位置（1位からの順位）。
        """
        higher_score_count = Score.objects.filter(
            lang_id=lang_id, diff_id=diff_id, score__gt=score
        ).count()
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


class UserRankView(ScoreView):
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

    def handle_request(self, validated_data: dict) -> dict:
        """
        ユーザーのスコアに基づいてランクを決定し、最高スコアであればランクを更新するリクエストを処理。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。

        Returns:
            dict: ランク決定と更新結果を含むレスポンスデータ。
        """
        user = validated_data["user"]
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        score = validated_data["score"]

        # スコアに基づいてランクを決定
        rank_name = self.determine_rank(score)

        # 最高スコア判定
        if self.is_highest_score(user.id, lang_id, diff_id, score):
            # ランクIDを取得して更新
            rank_id = self.get_rank_id_by_name(rank_name)
            self.update_user_rank(user, rank_id)

            return self.format_response(True, rank_name)

        return self.format_response(False, rank_name)

    def determine_rank(self, score: int) -> str:
        """
        スコアに基づいて適切なランクを決定。

        Args:
            score: スコア。

        Returns:
            str: 決定されたランク名。
        """
        for threshold, rank in sorted(self.RANKS.items(), reverse=True):
            if score >= threshold:
                return rank
        return "メンバー"

    def is_highest_score(
        self, user_id: int, lang_id: int, diff_id: int, score: int
    ) -> bool:
        """
        ユーザーの最高スコアを取得し、提供されたスコアと比較。

        Args:
            user_id: ユーザーID。
            lang_id: 言語ID。
            diff_id: 難易度ID。
            score: 提供されたスコア。

        Returns:
            bool: 最高スコアの場合はTrue、それ以外はFalse。
        """
        highest_score = Score.objects.filter(
            user_id=user_id, lang_id=lang_id, diff_id=diff_id
        ).aggregate(Max("score"))["score__max"]

        if highest_score is None or score > highest_score:
            return True
        return False

    def get_rank_id_by_name(self, rank_name: str) -> int:
        """
        ランク名に基づいてランクIDを取得。

        Args:
            rank_name: ランク名。

        Returns:
            int: ランクID。
        """
        rank_id = list(self.RANKS.values()).index(rank_name) + 1
        return rank_id

    def update_user_rank(self, user: User, rank_id: int) -> None:
        """
        ユーザーのランクを更新。

        Args:
            user: ユーザーオブジェクト。
            rank_id: 新しいランクID。
        """
        user.rank_id = rank_id
        user.save()

    def format_response(self, is_highest: bool, rank_name: str) -> dict:
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