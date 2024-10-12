import logging

from apps.common.models import Score
from apps.common.utils import HandleExceptions
from django.core.cache import cache
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import PastScoreSerializer, ScoreSerializer
from .services import ScoreService

logger = logging.getLogger(__name__)


class ScoreAndRankHandler(APIView):
    """
    平均スコア取得:get_average_score
    スコア計算:calculate_score
    最高ランク判定:is_new_high_score
    ランク更新:update_rank
    ランキング取得処理:get_ranking_position
    """
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """リクエストから送信されたデータをもとにシリアライズインスタンス作成"""
        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid():
            """有効データの取得"""
            score_data = serializer.validated_data
            user_id = score_data['user_id']  #ユーザID
            lang_id = score_data['lang']  #言語ID
            diff_id = score_data['diff']  #難易度ID
            """スコアサービスのインスタンス作成"""
            score_service = ScoreService(user_id, lang_id, diff_id)
            """平均スコア取得"""
            average_score = score_service.get_average_score(user_id, lang_id, diff_id)
            """スコア計算"""
            typing_count = request.data.get('typing_count')
            accuracy = request.data.get('accuracy')
            if typing_count and accuracy:
                score = score_service.calculate_score(typing_count, accuracy)
                """score_dataからscoreフィールドを削除"""
                score_data.pop('score', None)
                """スコアを保存"""
                score_instance = Score.objects.create(**score_data, score=score)
                """最高スコア判定"""
                is_high_score, new_highest_score = score_service.is_new_high_score(score)
                """ランク更新処理"""
                rank = score_service.update_rank(score, is_high_score)
                """ランキング取得"""
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

        return Response({'message': 'スコアインサートスキップ'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetPastScores(APIView):
    """過去スコア取得処理(30個)"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """リクエストから送信されたデータをもとにシリアライズインスタンス作成"""
        serializer = PastScoreSerializer(data=request.data)

        if serializer.is_valid():
            """有効データの取得"""
            score_data = serializer.validated_data
            user_id = score_data['user_id']
            lang_id = score_data['lang']  # 言語ID
            diff_id = score_data['diff']  # 難易度ID
            """最新のデータ30件取得"""
            scores = Score.objects.filter(user_id=user_id, lang_id=lang_id,
                                          diff_id=diff_id).order_by('-created_at')[:30]
            """スコアをシリアライズ"""
            scores_data = ScoreSerializer(scores, many=True).data

            return Response(scores_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
