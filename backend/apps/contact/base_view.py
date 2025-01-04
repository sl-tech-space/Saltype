from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ContactSerializer


class BaseContactView(APIView):
    """
    要望に関連する操作を行うための基底クラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        要望に関するリクエストをPOSTメソッドで処理します。

        Args:
            request (HTTPリクエストオブジェクト): クライアントからのリクエストデータを含む。
        Returns:
            Response: 成功時には要望に関する情報を含むレスポンスを返します。
        """
        serializer = ContactSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            self.handle_request(serializer.validated_data), status=status.HTTP_200_OK
        )

    def handle_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータの処理ロジック。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Returns:
            dict: 処理結果を返す辞書。
        """
        raise NotImplementedError(
            "サブクラスはhandle_requestメソッドを実装する必要があります"
        )
