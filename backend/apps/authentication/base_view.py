from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import AuthenticationSerializer


class BaseAuthenticationView(BaseView):
    """
    認証に関連する操作を行うための基底クラス。
    認証関連のリクエストを処理する共通のロジックを提供します。
    """

    def post(self, request, *args, **kwargs):
        """
        POSTリクエストを処理します。
        認証シリアライザを使用してリクエストデータをバリデートし、共通のロジックを実行します。

        Args:
            request (Request): クライアントからのリクエストオブジェクト。
            *args: 可変長引数。
            **kwargs: キーワード引数。

        Returns:
            Response: 処理結果のレスポンスオブジェクト。
        """
        return super().post(request, AuthenticationSerializer, *args, **kwargs)
