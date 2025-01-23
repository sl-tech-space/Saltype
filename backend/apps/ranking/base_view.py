from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import RankingSerializer


class BaseRankingView(BaseView):
    """
    ランキングに関連する操作をするための基底クラス。
    """

    def post(self, request, *args, **kwargs):
        """
        POSTリクエストを処理します。
        """
        # RankingSerializerを使用
        return super().post(request, RankingSerializer, *args, **kwargs)
