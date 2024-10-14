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


class ScoreAndRankHandler(APIView):
    """
    平均スコア取得:get_average_score
    スコア計算:calculate_score
    最高ランク判定:is_new_high_score
    ランキング取得処理:get_ranking_position
    """
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """リクエストから送信されたデータをもとにシリアライズインスタンス作成"""
        serializer = ScoreSerializer(data=request.data)

        if not serializer.is_valid():
            logger.error("Validation errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return self.score_process(serializer.validated_data)

    def score_process(self, score_data):
        """スコア処理のメインロジック"""
        user_id = score_data['user_id']  # ユーザID
        lang_id = score_data['lang']  # 言語ID
        diff_id = score_data['diff']  # 難易度ID

        score_service = ScoreService(user_id, lang_id, diff_id)

        # 平均スコア取得
        average_score = score_service.get_average_score(user_id, lang_id, diff_id)

        # スコア計算
        typing_count = score_data.get('typing_count', 0)
        accuracy = score_data.get('accuracy', 1.0)
        logger.debug(f'Typing Count: {typing_count}, Accuracy: {accuracy}')
        score = score_service.calculate_score(typing_count, accuracy)

        # 最高スコア判定
        is_high_score, new_highest_score = score_service.is_new_high_score(score)

        # ランク判定
        rank = score_service.determine_rank(score)

        # ランキング取得
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


class ScoreInsertHandler(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):

        serializer = ScoreInsertSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_score = serializer.save()

        return Response({
            'message': 'スコアインサート成功',
            'score_id': new_score.score_id
        },
                        status=status.HTTP_201_CREATED)


class RankUpdate(APIView):
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """リクエストからユーザーのランクを更新"""
        serializer = RankUpdateSerializer(data=request.data)
        if serializer.is_valid():
            return self.update_rank(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @HandleExceptions()
    def update_rank(self, data):
        """ランク更新処理"""
        user_id = data['user_id']
        new_rank = data['new_rank']

        user = User.objects.get(user_id=user_id)
        rank = Rank.objects.get(rank=new_rank)

        user.rank = rank
        user.save()

        return Response({"message": "ランク更新成功"}, status=status.HTTP_200_OK)


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
