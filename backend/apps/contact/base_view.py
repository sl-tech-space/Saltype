from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import ContactSerializer


class BaseContactView(BaseView):
    """
    要望に関連する操作をするための基底クラス。
    """

    def post(self, request, *args, **kwargs):
        """
        POSTリクエストを処理します。
        """
        # ContactSerializerを使用
        return super().post(request, ContactSerializer, *args, **kwargs)
