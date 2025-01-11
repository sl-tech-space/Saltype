from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import RankingSerializer


class BaseRankingView(BaseView):
    """
    ランキングに関連する操作を共通化するための基底クラス。
    サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, RankingSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data):
        # サブクラスで具体的な処理を実装
        raise NotImplementedError(
            "サブクラスは`handle_post_request`メソッドを実装する必要があります"
        )
