from apps.common.models import Score
from apps.common.utils import CommonUtils, HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class GetRanking(APIView):
    """ 
    言語IDと難易度IDに基づいてスコアを降順で取得して返すビュー 
    """
    permission_classes = [AllowAny]

    @HandleExceptions()  # デコレーターを使用して例外処理を共通化
    def post(self, request, *args, **kwargs):
        """ POSTリクエストボディからlang_idとdiff_idを取得 """
        # CommonUtilsを使ってリクエストパラメータをバリデーション
        lang_id, diff_id, ranking_limit = CommonUtils.validate_request_params(request.data, ['lang_id', 'diff_id', 'ranking_limit'])
        """ 言語IDと難易度IDに基づいてスコアをフィルタリング """
        filtered_scores = Score.objects.filter(lang_id=lang_id, diff_id=diff_id).select_related('user')
        """ スコアを降順で取得 """
        scores = filtered_scores.order_by('-score')[:ranking_limit]
        """ スコアのリストをフロントに返すために必要なデータに変換 """
        ranking_data = [{
            'user_id': score_entry.user.user_id,
            'username': score_entry.user.username,
            'score': score_entry.score
        } for score_entry in scores]

        return Response({'ranking-data': ranking_data}, status=status.HTTP_200_OK)
