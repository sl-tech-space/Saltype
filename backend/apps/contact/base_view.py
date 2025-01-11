from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import ContactSerializer

class BaseContactView(BaseView):
    """
    要望に関連する操作を行うための基底クラス。
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
