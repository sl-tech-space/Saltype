from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import ScoreSerializer


class BaseScoreView(BaseView):
    """
    スコアに関連する操作を共通化するための基底クラス。
    サブクラスで具体的な処理を実装する必要があります。
    """

    def post(self, request, *args, **kwargs):
        return super().post(request, ScoreSerializer, *args, **kwargs)

