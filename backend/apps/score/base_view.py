from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import ScoreSerializer


class BaseScoreView(BaseView):
    """
    スコアに関連する操作をするための基底クラス。
    """

    def post(self, request, *args, **kwargs):
        """
        POSTリクエストを処理します。
        """
        # ScoreSerializerを使用
        return super().post(request, ScoreSerializer, *args, **kwargs)
