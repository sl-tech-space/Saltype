from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from apps.common.models import Score

class ScoreByLangAndDiffView(APIView):
    """ 言語IDと難易度IDに基づいてスコアを降順で取得して返すビュー """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        """ POSTリクエストボディからlang_idとdiff_idを取得 """
        lang_id = request.data.get('lang_id')
        diff_id = request.data.get('diff_id')

        """ lang_idやdiff_idが指定されていない場合、エラーレスポンスを返す """
        if not lang_id or not diff_id:
            return Response({'error': 'lang_id and diff_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

        """ 言語IDと難易度IDに基づいてスコアをフィルタリング """
        score_query = Score.objects.filter(lang_id=lang_id, diff_id=diff_id)
        
        """ スコアを降順で取得 """
        scores = score_query.order_by('-score')
        
        """ スコアのリストをフロントに返すために必要なデータに変換 """
        score_list = [{'user_id': score.user_id, 'score': score.score} for score in scores]

        return Response({'scores': score_list}, status=status.HTTP_200_OK)
