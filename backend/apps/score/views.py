from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from django.db.models import Avg
from django.db import DatabaseError

from apps.common.utils import CommonUtils
from .services import ScoreService
from .serializers import ScoreSerializer
from apps.common.models import Rank, User,Score
import logging

logger = logging.getLogger(__name__)

class AddScoreAndRankView(APIView):

    """ アクセス認証（全員） """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        POSTリクエスト処理
        """
        
        try:
            user_id, lang_id, diff_id = CommonUtils.validate_request_params(request.data)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        """リクエストデータをシリアライザーへ"""
        serializer = ScoreSerializer(data=request.data)
        
        """ バリデーション通過できたら """
        if serializer.is_valid():
            
            """ タイピング数と正確さを受け取る """
            typing_count = request.data.get('typing_count', 0)
            accuracy = request.data.get('accuracy', 1.0)

            """ スコアを計算 """
            score = self.calculate_score(typing_count, accuracy)
            
            """ スコアをserializerに設定 """
            serializer.validated_data['score'] = score

            """ スコア判定と処理 """
            score_service = ScoreService(user_id, lang_id, diff_id, score)
            score_instance, is_high_score, new_highest_score, rank = self.process_score_and_rank(score_service, serializer)

            """ 現在のランキング順位取得 """
            ranking_position = score_service.get_ranking_position()

            return Response({
                'score': ScoreSerializer(score_instance).data,
                'is_high_score': is_high_score,
                'highest_score': new_highest_score,
                'rank': rank.rank if rank else None,
                'ranking_position': ranking_position,
            }, status=status.HTTP_200_OK)
            
        if not serializer.is_valid():
            logger.error(f"Serializer validation error: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    BASE_SCORE_MULTIPLIER = 10
    
    def calculate_score(self, typing_count, accuracy):
        """ タイピング数と正確さに基づいてスコアを計算 """
        base_score = typing_count * self.BASE_SCORE_MULTIPLIER
        score = base_score * accuracy  
        return score
    
    def process_score_and_rank(self, score_service, serializer):
        """
        1.最高スコア判定
        2.スコアのインサート
        3.ランク判定
        4.最高スコアの場合、最高ランクアップデート
        """
        
        score_instance = self.insert_score(serializer)
        is_high_score, new_highest_score = self.check_high_score(score_service)
        rank = self.determine_rank(score_service)
        
        if is_high_score and rank:
            self.update_user_rank(score_service.user_id, rank.rank_id)
            
        return score_instance, is_high_score, new_highest_score, rank
    def insert_score(self, serializer):
        try:
            return serializer.save()
        except Exception as e:
            logger.error(f"Error saving score: {e}")
            return None

    def check_high_score(self, score_service):
        return score_service.is_new_high_score()

    def determine_rank(self, score_service):
        rank_id = score_service.determine_rank()
        return Rank.objects.filter(rank_id=rank_id).first()

    def update_user_rank(self, user_id, rank_id):
        """
        4.ランクアップデート処理
        """
        try:
            user = User.objects.get(user_id=user_id)
            user.rank_id = rank_id
            user.save()
            return user
        except User.DoesNotExist:
            return None
        except DatabaseError as e:
            logger.error(f"Database error while updating user rank: {e}")
            return None


class AverageScoreView(APIView):
    """
    平均スコアを取得
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        指定されたユーザーID、言語ID、難易度IDに基づいて平均スコアを返す

        :param request: POSTリクエスト
        :return: 平均スコア
        """
        
        try:
            user_id, lang_id, diff_id = CommonUtils.validate_request_params(request.data)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        """ 平均スコアを計算 """
        average_score = Score.objects.filter(user_id=user_id, lang_id=lang_id, diff_id=diff_id).aggregate(Avg('score'))

        if average_score['score__avg'] is not None:
            return Response({'average_score': average_score['score__avg']}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'No scores found for the given user, language, and difficulty'}, status=status.HTTP_404_NOT_FOUND)
        
class PastScoresView(APIView):
    """
    ユーザーの過去30回のスコアデータを取得
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        ユーザーの過去30回のスコアデータを返す
        """
        
        try:
            user_id, lang_id, diff_id = CommonUtils.validate_request_params(request.data)
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        """ スコアデータを取得 """
        scores = Score.objects.filter(
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id
        ).order_by('-created_at')[:30]

        """ スコアデータをシリアライズ """
        scores_data = ScoreSerializer(scores, many=True).data

        return Response(scores_data, status=status.HTTP_200_OK)