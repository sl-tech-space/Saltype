from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import MistypeSerializer


class BaseMistypeView(BaseView):
    """
    ミスタイプに関連する操作のための基底クラス。
    """

    def post(self, request, *args, **kwargs):
        """
        POSTリクエストを処理します。
        """
        # MistypeSerializerを使用
        return super().post(request, MistypeSerializer, *args, **kwargs)
