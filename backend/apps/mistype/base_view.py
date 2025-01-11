from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import MistypeSerializer

class BaseMistypeView(BaseView):
    """
    ミスタイプに関連する操作のための基底クラス。
    サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]  # 誰でもアクセス可能なパーミッションを設定

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

    def handle_post_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータ処理ロジック。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Raises:
            NotImplementedError: サブクラスがこのメソッドを実装していない場合に発生。
        Returns:
            dict: 処理結果を辞書形式で返す。
        """
        raise NotImplementedError(
            "サブクラスは`handle_post_request`メソッドを実装する必要があります"
        )
