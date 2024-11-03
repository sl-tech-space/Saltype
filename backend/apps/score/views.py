from typing import Optional

from apps.common.models import Score
from apps.common.util.exception_handler import HandleExceptions
from django.db import transaction
from django.db.models import Avg, Max
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ScoreSerializer


class ScoreAPIView(APIView):
    """スコアに関連する操作のためのスーパークラス"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """POSTメソッドでスコア関連のリクエストを処理"""
        serializer = ScoreSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = self.handle_request(serializer.validated_data)
        return Response(response_data, status=status.HTTP_200_OK)

    def handle_request(self, validated_data):
        """リクエストデータを処理するためのロジック"""
        raise NotImplementedError("サブクラスはhandle_requestメソッドを実装する必要あり")


class ScoreInsertView(ScoreAPIView):
    """スコアを挿入するためのAPIビュークラス"""
    SCORE_MULTIPLIER = 10

    def handle_request(self, validated_data: dict) -> dict:
        """スコアを挿入するリクエストを処理"""
        score_instance = self.insert_score(validated_data)
        return self.format_response(score_instance)

    @transaction.atomic
    def insert_score(self, validated_data: dict) -> Score:
        """データベースにスコアを挿入"""
        user = validated_data['user']
        lang = validated_data['lang']
        diff = validated_data['diff']
        typing_count = validated_data['typing_count']
        accuracy = validated_data['accuracy']
        calculated_score = self.calculate_score(typing_count, accuracy)
        return Score.objects.create(user=user, lang=lang, diff=diff, score=calculated_score)

    def calculate_score(self, typing_count: int, accuracy: float) -> float:
        """与えられた入力に基づいてスコアを計算"""
        return round(typing_count * self.SCORE_MULTIPLIER * accuracy)

    def format_response(self, score_instance: Score) -> dict:
        """スコア挿入に関するデータをフォーマット"""
        return {
            'status': 'success',
            'user_id': score_instance.user_id,
            'lang_id': score_instance.lang_id,
            'diff_id': score_instance.diff_id,
            'score': score_instance.score
        }


class AverageScoreView(ScoreAPIView):
    """ユーザーの平均スコアを取得するためのAPIビュークラス"""

    def handle_request(self, validated_data: dict) -> dict:
        """ユーザーの平均スコアを取得するためのリクエストを処理"""
        user_id = validated_data['user_id']
        lang_id = validated_data['lang_id']
        diff_id = validated_data['diff_id']
        average_score = self.get_average_score(user_id, lang_id, diff_id)
        return self.format_response(average_score)

    def get_average_score(self, user_id: int, lang_id: int, diff_id: int) -> float:
        """指定された条件での平均スコアを計算"""
        average_score = Score.objects\
            .filter(user_id=user_id, lang_id=lang_id, diff_id=diff_id)\
            .aggregate(Avg('score'))['score__avg']
        return average_score

    def format_response(self, average_score: float) -> dict:
        """平均スコア取得に関するデータをフォーマット"""
        return {'status': 'success',\
                'average_score': round(average_score or 0)
        }


class HighestScoreCheckView(ScoreAPIView):
    """ユーザーの最高スコアを確認するためのAPIビュークラス"""

    def handle_request(self, validated_data: dict) -> dict:
        """提供されたスコアがユーザーの最高スコアかどうかを確認"""
        user_id = validated_data['user_id']
        lang_id = validated_data['lang_id']
        diff_id = validated_data['diff_id']
        score = validated_data['score']
        is_highest_score = self.check_if_highest_score(user_id, lang_id, diff_id, score)
        return self.format_response(is_highest_score)

    def check_if_highest_score(self, user_id: int, lang_id: int, diff_id: int,
                               score: float) -> bool:
        """ユーザーの最高スコアを取得し、提供されたスコアと比較"""
        highest_score = Score.objects\
            .filter(user_id=user_id, lang_id=lang_id, diff_id=diff_id)\
            .aggregate(Max('score'))['score__max']
        return highest_score is None or score > highest_score

    def format_response(self, is_highest_score: bool) -> dict:
        """最高スコア確認に関するデータをフォーマット"""
        return {
            'status': 'success',\
            'is_highest_score': is_highest_score
        }


class UserRankingView(ScoreAPIView):
    """ユーザーのスコアに基づくランキング位置を取得するためのAPIビュークラス"""

    def handle_request(self, validated_data: dict) -> dict:
        """ユーザーのスコアに基づくランキング位置を取得"""
        user_id = validated_data['user_id']
        lang_id = validated_data['lang_id']
        diff_id = validated_data['diff_id']
        score = validated_data['score']
        ranking_position = self.get_ranking_position(user_id, lang_id, diff_id, score)
        return self.format_response(ranking_position)

    def get_ranking_position(self, user_id: int, lang_id: int, diff_id: int, score: float) -> int:
        """ユーザーのスコアよりも高いスコアの数を数え、ランキング位置を決定"""
        higher_score_count = Score.objects\
            .filter(lang_id=lang_id, diff_id=diff_id, score__gt=score)\
            .count()
        return higher_score_count + 1

    def format_response(self, ranking_position: int) -> dict:
        """ランキング取得に関するデータをフォーマット"""
        return {
            'status': 'success',\
            'ranking_position': ranking_position
        }


class PastScoresView(ScoreAPIView):
    """ユーザーの過去のスコアを取得するためのAPIビュークラス"""

    def handle_request(self, validated_data: dict) -> dict:
        """ユーザーの過去のスコアを取得"""
        user_id = validated_data['user_id']
        lang_id = validated_data['lang_id']
        diff_id = validated_data['diff_id']
        scores = self.get_past_scores(user_id, lang_id, diff_id, limit=30)
        return self.format_response(scores)

    def get_past_scores(self, user_id: int, lang_id: int, diff_id: int, limit: int = 30) -> list:
        """ユーザーの過去のスコアをデータベースから取得"""
        past_scores = Score.objects\
            .filter(user_id=user_id, lang_id=lang_id, diff_id=diff_id)\
            .order_by('-created_at').only('score')[:limit]
        return past_scores

    def format_response(self, scores: list) -> dict:
        """過去スコア取得に関するデータをフォーマット"""
        return {
            'status': 'success',\
            'scores': [score.score for score in scores]
        }


class RankDeterminationView(ScoreAPIView):
    """スコアに基づいてランクを決定するためのAPIビュークラス"""
    RANKS = [
        (1000, "社長"),
        (900, "取締役"),
        (700, "部長"),
        (500, "課長"),
        (300, "係長"),
        (100, "主任"),
        (0, "メンバー"),
    ]

    def handle_request(self, validated_data: dict) -> dict:
        """スコアに基づいてランクを決定"""
        score = validated_data['score']
        rank = self.determine_rank(score)
        return self.format_response(rank)

    def determine_rank(self, score: int) -> Optional[str]:
        """スコアに対する適切なランクを決定"""
        for threshold, rank in self.RANKS:
            if score >= threshold:
                return rank
        return None  # ランクが決まらなかった場合はNoneを返す

    def format_response(self, rank: Optional[str]) -> dict:
        """ランク決定に関するデータをフォーマット"""
        return {'status': 'success',\
                'message': "ランクを決定しました",\
                'rank': rank
        }


class UserRankUpdateView(ScoreAPIView):
    """ユーザーのランクを更新するためのAPIビュークラス"""

    def handle_request(self, validated_data: dict) -> dict:
        """ユーザーのランクを更新"""
        user = validated_data['user']
        rank_id = validated_data['rank_id']
        rank_name = validated_data['new_rank']

        self.update_user_rank(user, rank_id)

        return self.format_response(rank_id, rank_name)

    def update_user_rank(self, user, rank_id: int) -> None:
        """ユーザーのランクを更新"""
        user.rank_id = rank_id
        user.save()

    def format_response(self, rank_id: int, rank_name: str) -> dict:
        """ユーザーランク更新に関するデータをフォーマット"""
        return {'status': 'success',\
                'rank_id': rank_id,\
                'rank_name': rank_name
        }
