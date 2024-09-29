from apps.common.models import Score
from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RankingSerializer


class GetRanking(APIView):
    """言語IDと難易度IDに基づいてユーザをスコアで並べて取得"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """リクエストから送信されたデータをもとにシリアライズインスタンス作成"""
        serializer = RankingSerializer(data=request.data)

        if serializer.is_valid():
            ranking_data = serializer.validated_data
            lang_id = ranking_data['lang_id']  # 言語ID
            diff_id = ranking_data['diff_id']  # 難易度ID
            ranking_limit = ranking_data['ranking_limit']  # ランキング上限
            """ 言語IDと難易度IDに基づいてスコアをフィルタリング """
            filtered_scores = Score.objects.filter(lang_id=lang_id,
                                                   diff_id=diff_id).select_related('user')
            """ スコアを降順で取得 """
            scores = filtered_scores.order_by('-score')[:ranking_limit]
            """ スコアのリストをフロントに返すために必要なデータに変換 """
            ranking_response_data = [{
                'user_id': score_entry.user.user_id,
                'username': score_entry.user.username,
                'score': score_entry.score
            } for score_entry in scores]

            return Response({'ranking_data': ranking_response_data}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
