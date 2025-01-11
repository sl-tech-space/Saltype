from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import AuthenticationSerializer


class BaseAuthView(BaseView):
    """
    認証に関連する操作を行うための基底クラス。
    認証関連のリクエストを処理する共通のロジックを提供します。
    """

    permission_classes = [AllowAny]

    def handle_post_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータの処理ロジック。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 処理結果を返す辞書。
        """
        raise NotImplementedError(
            "サブクラスはhandle_post_requestメソッドを実装する必要があります"
        )

    def handle_get_request(self, *args, **kwargs):
        """
        サブクラスで実装されるべきGETリクエストデータの処理ロジック。

        Args:
            *args, **kwargs: 任意の引数。
        Returns:
            dict: 処理結果を返す辞書。
        """
        raise NotImplementedError(
            "サブクラスはhandle_get_requestメソッドを実装する必要があります"
        )
