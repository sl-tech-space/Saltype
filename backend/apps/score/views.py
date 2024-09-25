from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from apps.common.utils import CommonUtils
from .services import ScoreService
from .serializers import ScoreSerializer
from apps.common.models import Score
from rest_framework import status
from apps.common.utils import HandleExceptions
import logging

logger = logging.getLogger(__name__)

handle_exceptions = HandleExceptions() 

class AddScoreAndRankView(APIView):
    permission_classes = [AllowAny]

    @handle_exceptions
    def post(self, request, *args, **kwargs):
        user_id, lang_id, diff_id = CommonUtils.validate_request_params(request.data, ['user_id', 'lang_id', 'diff_id'])
        score_service = ScoreService(user_id, lang_id, diff_id)

        if request.data.get('action') == 'get_average_score':
            average_score = score_service.get_average_score(user_id, lang_id, diff_id)
            return Response({'average_score': average_score}, status=status.HTTP_200_OK)

        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid():
            typing_count = request.data.get('typing_count', 0)
            accuracy = request.data.get('accuracy', 1.0)
            score = score_service.calculate_score(typing_count, accuracy)

            score_data = serializer.validated_data
            score_data['score'] = score
            score_instance, is_high_score, new_highest_score, rank = score_service.save_score_and_update_rank(score_data)

            average_score = score_service.get_average_score(user_id, lang_id, diff_id)
            ranking_position = score_service.get_ranking_position(score)

            return Response({
                'score': score,
                'average_score': average_score,
                'is_high_score': is_high_score,
                'highest_score': new_highest_score,
                'rank': rank,
                'ranking_position': ranking_position,
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PastScoresView(APIView):
    permission_classes = [AllowAny]

    @handle_exceptions
    def post(self, request, *args, **kwargs):
        user_id, lang_id, diff_id = CommonUtils.validate_request_params(request.data, ['user_id', 'lang_id', 'diff_id'])

        scores = Score.objects.filter(
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id
        ).order_by('-created_at')[:30]

        scores_data = ScoreSerializer(scores, many=True).data
        return Response(scores_data, status=status.HTTP_200_OK)
