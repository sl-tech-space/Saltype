from apps.common.models import Score
from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RankingSerializer


class GetRanking(APIView):
    """言語IDと難易度IDに基づいてユーザをスコア順で取得"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        serializer = RankingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ranking_data = serializer.validated_data
        lang_id = ranking_data['lang_id']
        diff_id = ranking_data['diff_id']
        ranking_count = ranking_data['ranking_count']
        """スコアを降順で取得し、ランキングデータを作成"""
        scores = Score.objects.filter(lang_id=lang_id, diff_id=diff_id) \
            .select_related('user').order_by('-score')[:ranking_count]

        ranking_response_data = [{
            'user_id': score_entry.user.user_id,
            'username': score_entry.user.username,
            'score': score_entry.score
        } for score_entry in scores]

        return Response({'ranking_data': ranking_response_data}, status=status.HTTP_200_OK)
