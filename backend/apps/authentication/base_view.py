from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import AuthenticationSerializer


class BaseAuthenticationView(BaseView):
    """
    認証に関連する操作を行うための基底クラス。
    """

    def post(self, request, *args, **kwargs):
        """
        POSTリクエストを処理します。
        """
        # AuthenticationSerializerを使用
        return super().post(request, AuthenticationSerializer, *args, **kwargs)
