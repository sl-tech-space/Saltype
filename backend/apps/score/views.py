from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from django.db import DatabaseError
from django.db import transaction
from apps.common.utils import CommonUtils
from .services import ScoreService
from .serializers import ScoreSerializer
from apps.common.models import User, Score
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
            try:
                average_score = ScoreService.get_average_score(user_id, lang_id, diff_id)
            except Exception as e:
                logger.error(f"平均スコア取得中にエラーが発生しました: {e}")
                return Response({'error': '平均スコアの取得に失敗しました。'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            return Response({'average_score': average_score}, status=status.HTTP_200_OK)
        
        """ リクエストデータをシリアライザーへ """
        serializer = ScoreSerializer(data=request.data)
        
        """ バリデーション通過できたら """
        if serializer.is_valid():
            """ タイピング数と正確さを受け取理、スコアを計算 """
            score = ScoreCalculator.calculate(request.data)
            
            """ スコアをserializerに設定 """
            serializer.validated_data['score'] = score

            try:
                """ スコアとランクの処理を実行 """
                score_service = ScoreService(user_id, lang_id, diff_id, score)
                score_instance, is_high_score, new_highest_score, rank = ScoreHandler.handle_score_and_rank_update(score_service, serializer)
                
                """ 平均スコアの取得 """
                try:
                    average_score = ScoreService.get_average_score(user_id, lang_id, diff_id)
                except (DatabaseError, ValueError) as e:
                    logger.error(f"平均スコア取得中にエラーが発生しました: {e}")
                    return Response({'error': '平均スコアの取得に失敗しました。'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

                """ 現在のランキング順位取得 """
                ranking_position = score_service.get_ranking_position()

                return Response({
                    'score': score_service.score,
                    'average_score': average_score,
                    'is_high_score': is_high_score,
                    'highest_score': new_highest_score,
                    'rank': rank,
                    'ranking_position': ranking_position,
                }, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"スコア処理中にエラーが発生しました: {e}")
                return Response({'error': 'スコアの保存に失敗しました。'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        logger.error(f"シリアライザーのバリデーションエラー: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ScoreCalculator:
    BASE_SCORE_MULTIPLIER = 10

    @staticmethod
    def calculate(data, multiplier=None):
        """ タイピング数と正確さに基づいてスコアを計算 """
        typing_count = data.get('typing_count', 0)
        accuracy = data.get('accuracy', 1.0)
        multiplier = multiplier or ScoreCalculator.BASE_SCORE_MULTIPLIER
        return typing_count * multiplier * accuracy
    
class ScoreHandler:
    
    @staticmethod
    @transaction.atomic
    def handle_score_and_rank_update(score_service, serializer):
        """
        スコアとランクの更新処理
        1. 最高スコア判定
        2. スコアのインサート
        3. ランク判定
        4. 最高スコアの場合、最高ランクアップデート
        """
        try:
            try:
                score_instance = ScoreHandler.insert_score(serializer)
            except Exception as e:
                return Response({'error': 'スコアの保存に失敗しました。'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            is_high_score, new_highest_score = score_service.is_new_high_score()  
            rank = score_service.determine_rank()
            
            if is_high_score and rank:
                ScoreHandler.update_user_rank(score_service.user_id, rank.rank_id)
                
            return score_instance, is_high_score, new_highest_score, rank
        except Exception as e:
            logger.error(f"スコア処理中にエラーが発生しました: {e}")
            raise
    
    @transaction.atomic
    def insert_score(serializer):
        """ スコアをデータベースに保存（トランザクション管理）"""
        try:
            return serializer.save()
        except Exception as e:
            logger.error(f"スコア保存中にエラーが発生しました: {e}")
            raise

    @staticmethod
    def update_user_rank(user_id, rank_id):
        """ ランクアップデート処理 """
        try:
            user = User.objects.get(user_id=user_id)
            user.rank_id = rank_id
            user.save()
        except User.DoesNotExist:
            logger.error("指定されたユーザーは存在しません。")
            raise ValidationError("ユーザーが存在しません")
        except DatabaseError as e:
            logger.error(f"ユーザーのランク更新中にデータベースエラーが発生しました: {e}")
            raise


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

        try:
            """ スコアデータを取得 """
            scores = Score.objects.filter(
                user_id=user_id,
                lang_id=lang_id,
                diff_id=diff_id
            ).order_by('-created_at')[:30]
        except DatabaseError as e:
            logger.error(f"スコアデータ取得中にデータベースエラーが発生しました: {e}")
            return Response({'error': 'スコアデータの取得に失敗しました。'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        """ スコアデータをシリアライズ """
        scores_data = ScoreSerializer(scores, many=True).data

        return Response(scores_data, status=status.HTTP_200_OK)
