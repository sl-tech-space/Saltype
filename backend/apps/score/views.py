from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (PastScoreSerializer, RankUpdateSerializer, ScoreInsertSerializer,
                          ScoreSerializer)
from .services import ScoreService


class ScoreInsert(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ScoreInsertSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        score_instance = serializer.create(serializer.validated_data)
        return Response({'score': score_instance.score}, status=status.HTTP_201_CREATED)


class ScoreProcess(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = ScoreSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.process_score(serializer.validated_data)

    def process_score(self, score_data):
        """スコア計算とランク決定の処理を行うメソッド"""
        score_service = ScoreService(user_id=score_data['user_id'],
                                     lang_id=score_data['lang'],
                                     diff_id=score_data['diff'])
        """直近のスコア取得処理"""
        recent_score = score_service.get_recent_score()
        score = recent_score.score if recent_score else 0
        """平均スコア取得処理"""
        average_score = score_service.get_average_score()
        """最高スコア判定処理"""
        is_high_score, new_highest_score = score_service.is_new_high_score(score)
        """ランク判定処理"""
        rank = score_service.determine_rank(score)
        """ランキング取得処理"""
        ranking_position = score_service.get_ranking_position(score)

        return self.create_response(score, average_score, is_high_score, new_highest_score, rank,
                                    ranking_position)

    def create_response(self, score, average_score, is_high_score, new_highest_score, rank,
                        ranking_position):
        """レスポンス作成メソッド"""
        return Response(
            {
                'score': score,
                'average_score': average_score,
                'is_high_score': is_high_score,
                'highest_score': new_highest_score,
                'rank': rank,
                'ranking_position': ranking_position,
            },
            status=status.HTTP_200_OK)


class RankUpdate(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = RankUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        """ScoreServiceインスタンス作成"""
        score_service = ScoreService(serializer.validated_data['user_id'],
                                     lang_id=None,
                                     diff_id=None)
        """ランク更新"""
        rank_data = score_service.update_user_rank(serializer.validated_data['new_rank'])

        return Response(rank_data, status=status.HTTP_200_OK)


class PastScoresSelect(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = PastScoreSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        """ScoreService"インスタンス作成"""
        score_service = ScoreService(user_id=serializer.validated_data['user_id'],
                                     lang_id=serializer.validated_data['lang'],
                                     diff_id=serializer.validated_data['diff'])
        """過去のスコア取得"""
        scores = score_service.get_past_scores()
        scores_data = ScoreSerializer(scores, many=True).data

        return Response(scores_data, status=status.HTTP_200_OK)
