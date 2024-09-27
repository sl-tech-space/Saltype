import logging

from apps.common.models import Score
from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PastScoreSerializer, ScoreSerializer
from .services import ScoreService

logger = logging.getLogger(__name__)


class ScoreAndRankHandler(APIView):
    """
    スコア計算処理、最高スコア判定処理、スコア平均取得処理、ランク更新処理
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):

        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid():

            score_data = serializer.validated_data
            user_id = score_data['user_id']
            lang_id = score_data['lang']
            diff_id = score_data['diff']

            score_service = ScoreService(user_id, lang_id, diff_id)
            average_score = score_service.get_average_score(user_id, lang_id, diff_id)

            typing_count = request.data.get('typing_count', 0)
            accuracy = request.data.get('accuracy', 1.0)
            score = score_service.calculate_score(typing_count, accuracy)

            score_data = serializer.validated_data
            score_data['score'] = score
            score_instance, is_high_score, new_highest_score, rank = score_service.save_score_and_update_rank(
                score_data)

            average_score = score_service.get_average_score(user_id, lang_id, diff_id)

            ranking_position = score_service.get_ranking_position(score)

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
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetPastScores(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):

        serializer = PastScoreSerializer(data=request.data)

        if serializer.is_valid():
            score_data = serializer.validated_data
            lang_id = score_data['lang']
            diff_id = score_data['diff']

            scores = Score.objects.filter(lang_id=lang_id,
                                          diff_id=diff_id).order_by('-created_at')[:30]

            scores_data = ScoreSerializer(scores, many=True).data
            return Response(scores_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
