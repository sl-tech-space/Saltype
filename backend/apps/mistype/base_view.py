from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import MistypeSerializer


class BaseMistypeView(APIView):
    """
    ミスタイプに関連する操作のための基底クラス。
    サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]  # 誰でもアクセス可能なパーミッションを設定

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでリクエストを処理し、リクエストデータをバリデーションします。
        バリデーションが成功した場合、`handle_request`メソッドを呼び出します。

        Args:
            request (HttpRequest): HTTPリクエストオブジェクト。
        Returns:
            Response: 処理結果やエラーを含むHTTPレスポンスオブジェクト。
        """
        serializer = MistypeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            self.handle_request(serializer.validated_data),
            status=status.HTTP_201_CREATED,
        )

    def handle_request(self, validated_data):
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
            "サブクラスは`handle_request`メソッドを実装する必要があります"
        )
