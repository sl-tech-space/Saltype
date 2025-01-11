from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import ContactSerializer


class BaseContactView(BaseView):
    """
    ユーザーからの要望に関連する操作を共通化するための基底クラス。
    サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, serializer_class=ContactSerializer, *args, **kwargs)

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
