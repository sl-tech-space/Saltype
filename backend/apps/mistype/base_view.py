from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import MistypeSerializer


class BaseMistypeView(APIView):
    """
    ミスタイプに関連する操作のためのスーパークラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでリクエストを処理し、バリデーションを行った後に具体的な処理を呼び出します。

        Args:
            request: HTTPリクエストオブジェクト。
        Returns:
            Responseオブジェクト: 処理結果をレスポンスとして返します。
        """
        serializer = MistypeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_data = self.handle_request(serializer.validated_data)
        return Response(response_data, status=status.HTTP_200_OK)

    def handle_request(self, validated_data):
        """
        サブクラスで実装するべきリクエストデータの処理メソッド。

        Args:
            validated_data: バリデーション済みのデータ。
        Raises:
            NotImplementedError: サブクラスでこのメソッドが未実装の場合に発生。
        """
        raise NotImplementedError(
            "サブクラスはhandle_requestメソッドを実装する必要があります"
        )

    def format_response(self, response_data, status="success", message=None):
        """
        レスポンスデータを共通のフォーマットで整形する。

        Args:
            response_data: レスポンスデータ
            status: レスポンスのステータス（デフォルトは"success"）。
            message: エラーメッセージなど、オプションのメッセージ。

        Returns:
            dict: フォーマットされたレスポンスデータ
        """
        response = {"status": status}

        # メッセージがあれば追加
        if message:
            response["message"] = message

        # `data` キーを使わずにレスポンスデータを直接追加
        response.update(response_data)

        return response
