import logging

from apps.common.models import Rank, Score, User
from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (PastScoreSerializer, RankUpdateSerializer, ScoreInsertSerializer,
                          ScoreSerializer)
from .services import ScoreService

logger = logging.getLogger(__name__)

from django.shortcuts import get_object_or_404


class ScoreInsert(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = ScoreInsertSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        """スコア計算"""
        score_service = ScoreService(user_id=serializer.validated_data['user_id'],
                                     lang_id=serializer.validated_data['lang'],
                                     diff_id=serializer.validated_data['diff'])
        score = score_service.calculate_score(serializer.validated_data['typing_count'],
                                              serializer.validated_data['accuracy'])

        user = get_object_or_404(User, user_id=serializer.validated_data['user_id'])
        """スコアを作成"""
        new_score = Score.objects.create(user=user,
                                         lang=serializer.validated_data['lang'],
                                         diff=serializer.validated_data['diff'],
                                         score=score)

        return Response({
            'score_id': new_score.score_id,
            'score': score
        },
                        status=status.HTTP_201_CREATED)


class ScoreProcess(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = ScoreSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.process_score(serializer.validated_data)

    def process_score(self, score_data):
        """最も最近インサートされたスコアを取得"""
        recent_score = Score.objects.filter(
            user_id=score_data['user_id'], lang_id=score_data['lang'],
            diff_id=score_data['diff']).order_by('-created_at').first()
        """ScoreServiceを初期化"""
        score_service = ScoreService(score_data['user_id'], score_data['lang'], score_data['diff'])
        """平均スコアの取得"""
        average_score = score_service.get_average_score()
        """スコア情報を使って最高スコア判定とランク判定"""
        score = recent_score.score if recent_score else 0
        is_high_score, new_highest_score = score_service.is_new_high_score(score)
        rank = score_service.determine_rank(score)
        ranking_position = score_service.get_ranking_position(score)

        return self.create_response(score, average_score, is_high_score, new_highest_score, rank,
                                    ranking_position)

    def create_response(self, score, average_score, is_high_score, new_highest_score, rank,
                        ranking_position):
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
        return self.update_rank(serializer.validated_data)

    def update_rank(self, data):
        user = User.objects.get(user_id=data['user_id'])
        rank = Rank.objects.get(rank=data['new_rank'])
        user.rank = rank
        user.save()
        return Response({"message": "ランク更新成功"}, status=status.HTTP_200_OK)


class PastScoresSelect(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = PastScoreSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        score_data = serializer.validated_data
        scores = Score.objects.filter(user_id=score_data['user_id'],
                                      lang_id=score_data['lang'],
                                      diff_id=score_data['diff']).order_by('-created_at')[:30]

        scores_data = ScoreSerializer(scores, many=True).data
        return Response(scores_data, status=status.HTTP_200_OK)
