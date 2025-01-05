from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import AuthenticationSerializer


class BaseAuthView(APIView):
    """
    認証に関連する操作を行うための基底クラス。
    認証関連のリクエストを処理する共通のロジックを提供します。
    """

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでリクエストを処理し、バリデーション後にサブクラスの処理を呼び出します。

        Args:
            request: HTTPリクエストオブジェクト。リクエストのデータを含む。
        Returns:
            Response: 処理結果やエラーを含むHTTPレスポンス。
        """
        serializer = AuthenticationSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        return Response(
            self.handle_request(serializer.validated_data),
            status=status.HTTP_200_OK,
        )
