from apps.common.util.email import ContactEmail
from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ContactSerializer


class SubmitRequestView(APIView):
    """
    要望送信APIビュークラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request):
        """
        POSTメソッドで要望リクエストを処理。

        Args:
            request: クライアントからのリクエストオブジェクト。

        Returns:
            Response: 処理結果を含むHTTPレスポンス。
        """
        serializer = ContactSerializer(data=request.data)

        if serializer.is_valid():
            user_id = serializer.validated_data["user_id"]
            request_content = serializer.validated_data["request_content"]

            request_email = ContactEmail(user_id, request_content)
            request_email.send_request_email()

            return self.format_response(status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def format_response(self, http_status):
        """
        フォーマットされたレスポンスを生成。

        Args:
            message: レスポンスに含めるメッセージ。
            http_status: HTTPステータスコード。

        Returns:
            Response: フォーマットされたHTTPレスポンスオブジェクト。
        """
        return Response({"status": "success"}, status=http_status)
