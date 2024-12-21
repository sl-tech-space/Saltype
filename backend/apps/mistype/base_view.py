from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MistypeSerializer


class BaseMistypeView(APIView):
    """
    ミスタイプに関連する操作のためのスーパークラス。
    このクラスは、ミスタイプに関するリクエストの処理を共通化するための基底クラスです。
    サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでリクエストを処理し、リクエストデータをバリデーションします。

        バリデーションが成功した場合、`handle_request`メソッドをサブクラスで定義された
        処理に基づいて呼び出します。

        Args:
            request (HttpRequest): HTTPリクエストオブジェクト。
                リクエストデータが含まれています。
        Returns:
            Response: 処理結果やエラーを含むHTTPレスポンスオブジェクト。
        """
        serializer = MistypeSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            score_data = self.handle_request(validated_data)
            return Response(score_data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def handle_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータ処理ロジック。

        サブクラスで具体的な処理を実装する必要があります。

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
