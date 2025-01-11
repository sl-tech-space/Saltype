from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from apps.common.util.exception_handler import HandleExceptions


class BaseView(APIView):
    """
    共通の基底クラス。サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, serializer_class, *args, **kwargs):
        """
        POSTメソッドでリクエストを処理し、バリデーション後にサブクラスの処理を呼び出します。

        Args:
            request: HTTPリクエストオブジェクト。
            serializer_class: 使用するシリアライザクラス。
        Returns:
            Response: 処理結果やエラーを含むHTTPレスポンス。
        """
        serializer = serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            response_data = self.handle_post_request(serializer.validated_data)
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @HandleExceptions()
    def get(self, request, *args, **kwargs):
        """
        GETメソッドでリクエストを処理します。サブクラスでオーバーライド可能。

        Args:
            request: HTTPリクエストオブジェクト。
        Returns:
            Response: 処理結果やエラーを含むHTTPレスポンス。
        """
        response_data = self.handle_get_request(request, *args, **kwargs)
        return Response(response_data, status=status.HTTP_200_OK)

    def handle_post_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータ処理ロジック。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Raises:
            NotImplementedError: サブクラスがこのメソッドを実装していない場合に発生。
        Returns:
            dict: 処理結果を辞書形式で返す。
        """
        raise NotImplementedError(
            "サブクラスは`handle_post_request`メソッドを実装する必要があります"
        )

    def handle_get_request(self, *args, **kwargs):
        """
        サブクラスで実装されるべきGETリクエストデータ処理ロジック。

        Args:
            *args, **kwargs: 任意の引数。
        Raises:
            NotImplementedError: サブクラスがこのメソッドを実装していない場合に発生。
        Returns:
            dict: 処理結果を辞書形式で返す。
        """
        raise NotImplementedError(
            "サブクラスは`handle_get_request`メソッドを実装する必要があります"
        )

