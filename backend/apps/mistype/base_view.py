from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import MistypeSerializer


class BaseMistypeView(BaseView):
    """
    ミスタイプに関連する操作のための基底クラス。
    サブクラスで具体的な処理を実装する必要があります。
    """

    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでリクエストを処理し、リクエストデータをバリデーションします。
        バリデーションが成功した場合、`handle_post_request`メソッドを呼び出します。

        Args:
            request (HttpRequest): HTTPリクエストオブジェクト。
        Returns:
            Response: 処理結果やエラーを含むHTTPレスポンスオブジェクト。
        """
        return super().post(request, MistypeSerializer, *args, **kwargs)
