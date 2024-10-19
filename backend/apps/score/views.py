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


class ScoreInsert(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = ScoreInsertSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        score_service = ScoreService(user_id=serializer.validated_data['user_id'],
                                     lang_id=serializer.validated_data['lang'],
                                     diff_id=serializer.validated_data['diff'])
        score = score_service.calculate_score(serializer.validated_data['typing_count'],
                                              serializer.validated_data['accuracy'])
        try:
            user = User.objects.get(user_id=serializer.validated_data['user_id'])
        except User.DoesNotExist:
            return Response({'error': '指定されたユーザーは存在しません。'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'score': score}, status=status.HTTP_201_CREATED)


class ScoreProcess(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = ScoreSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return self.process_score(serializer.validated_data)

    def process_score(self, score_data):
        recent_score = Score.objects.filter(
            user_id=score_data['user_id'], lang_id=score_data['lang'],
            diff_id=score_data['diff']).order_by('-created_at').first()

        score_service = ScoreService(score_data['user_id'], score_data['lang'], score_data['diff'])
        average_score = score_service.get_average_score()

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
        try:
            user = User.objects.get(user_id=data['user_id'])
        except User.DoesNotExist:
            return Response({'error': 'ユーザーが見つかりません。'}, status=status.HTTP_404_NOT_FOUND)

        try:
            rank = Rank.objects.filter(rank=data['new_rank']).first()
        except Rank.DoesNotExist:
            return Response({'error': '指定されたランクは存在しません。'}, status=status.HTTP_404_NOT_FOUND)

        user.rank = rank
        user.save()

        rank_data = {
            'rank_id': rank.rank_id,
            'rank': rank.rank,
        }

        return Response(rank_data, status=status.HTTP_200_OK)


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
