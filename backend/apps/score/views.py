from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Avg

from .services import ScoreService
from .serializers import ScoreSerializer
from apps.common.models import Rank, User,Score

class AddScoreAndRankView(APIView):
    """
    スコアインサートとランクインサート処理

    Attributes:
        1.最高スコア判定
        2.スコアインサート
        3.ランク判定
        4.最高スコアの時のみランクインサート
    """

    """ アクセス認証（全員） """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """
        postでリクエストが来た時の処理
        
        :return:
            score(int):スコア
            is_high_score(bool):最高スコアかどうか
            highest_score(int):最高スコア
            rank(int):ランク名
            ranking_position(int):ユーザのランキング 
        """
        
        """リクエストデータをシリアライザーへ"""
        serializer = ScoreSerializer(data=request.data)
        
        """ バリデーション通過できたら """
        if serializer.is_valid():
            """ データ取得 """
            data = serializer.validated_data
            user = data.get('user')
            lang = data.get('lang')
            diff = data.get('diff')

            """ NULLチェック """
            if not user or not lang or not diff:
                return Response({'error': 'Invalid data: user, lang or diff is None'}, status=status.HTTP_400_BAD_REQUEST)
            
            """ モデルの属性アクセス """
            user_id = user.user_id
            lang_id = lang.lang_id
            diff_id = diff.diff_id
            
            """ タイピング数と正確さを受け取る """
            typing_count = request.data.get('typing_count', 0)
            accuracy = request.data.get('accuracy', 1.0)

            """ スコアを計算 """
            score = self.calculate_score(typing_count, accuracy)
            
            """ スコアをserializerに設定 """
            serializer.validated_data['score'] = score
            score_instance = serializer.save()  

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
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def calculate_score(self, typing_count, accuracy):
        """ タイピング数と正確さに基づいてスコアを計算 """
        base_score = typing_count * 10  
        score = base_score * accuracy  
        return score
    
    def process_score_and_rank(self, score_service, serializer):
        """
        1.最高スコア判定
        2.スコアのインサート
        3.ランク判定
        4.最高スコアの場合、最高ランクアップデート
        """
        
        """ 最高スコア判定 """
        is_high_score, new_highest_score = score_service.is_new_high_score()

        """ スコアインサート """
        try:
            score_instance = serializer.save()
        except Exception as e:
            print(f"Error saving score: {e}")
            return score_instance, is_high_score, new_highest_score, None

        """ ランク判定 """
        rank_id = score_service.determine_rank()
        rank = Rank.objects.filter(rank_id=rank_id).first()

        """ 最高スコアの場合のみユーザのランクアップデート """
        if is_high_score and rank:
            user = self.update_user_rank(score_service.user_id, rank.rank_id)
            if not user:
                return score_instance, is_high_score, new_highest_score, None

        return score_instance, is_high_score, new_highest_score, rank

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
        user_id = request.data.get('user_id')
        lang_id = request.data.get('lang_id')
        diff_id = request.data.get('diff_id')

        """ パラメータ確認 """
        if not all([user_id, lang_id, diff_id]):
            return Response({'error': 'user_id, lang_id, and diff_id are required'}, status=status.HTTP_400_BAD_REQUEST)

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
        user_id = request.data.get('user_id')
        lang_id = request.data.get('lang_id')
        diff_id = request.data.get('diff_id')

        """ スコアデータを取得 """
        scores = Score.objects.filter(
            user_id=user_id,
            lang_id=lang_id,
            diff_id=diff_id
        ).order_by('-created_at')[:30]

        """ スコアデータをシリアライズ """
        scores_data = ScoreSerializer(scores, many=True).data

        return Response(scores_data, status=status.HTTP_200_OK)