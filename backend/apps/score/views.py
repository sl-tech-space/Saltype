from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError
from django.db.models import Avg
from django.db import DatabaseError
from django.db import transaction
from apps.common.utils import CommonUtils
from .services import ScoreService
from .serializers import ScoreSerializer
from apps.common.models import Rank, User, Score
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
            user_id, lang_id, diff_id = CommonUtils.validate_request_params(request.data, ['user_id', 'lang_id', 'diff_id'])
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        """ 平均スコア取得を求める場合 """
        if request.data.get('action') == 'get_average_score':
            average_score = self.get_average_score(user_id, lang_id, diff_id)
            return Response({'average_score': average_score}, status=status.HTTP_200_OK)
        
        """ リクエストデータをシリアライザーへ """
        serializer = ScoreSerializer(data=request.data)
        
        """ バリデーション通過できたら """
        if serializer.is_valid():
            """ タイピング数と正確さを受け取理、スコアを計算 """
            typing_count = request.data.get('typing_count', 0)
            accuracy = request.data.get('accuracy', 1.0)
            score = self.calculate_score(typing_count, accuracy)
            
            """ スコアをserializerに設定 """
            serializer.validated_data['score'] = score

            """ スコア判定と処理 """
            score_service = ScoreService(user_id, lang_id, diff_id, score)
            score_instance, is_high_score, new_highest_score, rank = self.handle_score_and_rank_update(score_service, serializer)
            
            """ 平均スコアの取得 """
            average_score = self.get_average_score(user_id, lang_id, diff_id)

            """ 現在のランキング順位取得 """
            ranking_position = score_service.get_ranking_position()

            return Response({
                'score': score_service.score,
                'average_score': average_score,
                'is_high_score': is_high_score,
                'highest_score': new_highest_score,
                'rank': rank.rank if rank else None,
                'ranking_position': ranking_position,
            }, status=status.HTTP_200_OK)
        
        logger.error(f"シリアライザーのバリデーションエラー: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    BASE_SCORE_MULTIPLIER = 10
    
    def calculate_score(self, typing_count, accuracy):
        """ タイピング数と正確さに基づいてスコアを計算 """
        return typing_count * self.BASE_SCORE_MULTIPLIER * accuracy
    
    @transaction.atomic
    def handle_score_and_rank_update(self, score_service, serializer):
        """
        スコアとランクの更新処理
        1. 最高スコア判定
        2. スコアのインサート
        3. ランク判定
        4. 最高スコアの場合、最高ランクアップデート
        """
        score_instance = self.insert_score(serializer)
        is_high_score, new_highest_score = self.check_high_score(score_service)  
        rank = self.determine_rank(score_service)
        
        if is_high_score and rank:
            self.update_user_rank(score_service.user_id, rank.rank_id)
            
        return score_instance, is_high_score, new_highest_score, rank
    
    def insert_score(self, serializer):
        """ スコアをデータベースに保存 """
        try:
            return serializer.save()
        except Exception as e:
            logger.error(f"スコア保存中にエラーが発生しました: {e}")
            return None
        
    def check_high_score(self, score_service):
        """
        最高スコア判定
        :param score_service: ScoreServiceインスタンス
        :return: is_high_score (bool), new_highest_score (int or None)
        """
        return score_service.is_new_high_score()

    def determine_rank(self, score_service):
        """ ランクを判定 """
        rank_id = score_service.determine_rank()
        return Rank.objects.filter(rank_id=rank_id).first()

    def update_user_rank(self, user_id, rank_id):
        """ ランクアップデート処理 """
        try:
            user = User.objects.get(user_id=user_id)
            user.rank_id = rank_id
            user.save()
            return user
        except User.DoesNotExist:
            logger.error("指定されたユーザーは存在しません。")
            return None
        except DatabaseError as e:
            logger.error(f"ユーザーのランク更新中にデータベースエラーが発生しました: {e}")
            return None
        
    def get_average_score(self, user_id, lang_id, diff_id):
        """ 指定されたユーザー、言語、難易度の平均スコアを取得 """
        average_score = Score.objects.filter(user_id=user_id, lang_id=lang_id, diff_id=diff_id).aggregate(Avg('score'))
        return average_score['score__avg'] if average_score['score__avg'] is not None else 0


        
class PastScoresView(APIView):
    """ ユーザーの過去30回のスコアデータを取得 """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        ユーザーの過去30回のスコアデータを返す
        """
        try:
            user_id, lang_id, diff_id = CommonUtils.validate_request_params(request.data, ['user_id', 'lang_id', 'diff_id'])
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
