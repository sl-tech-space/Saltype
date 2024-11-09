from apps.common.util.email import RequestEmail
from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RequestSerializer


class SubmitRequestView(APIView):
    """リクエスト送信処理"""

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request):
        """リクエストから送信されたデータをもとにシリアライズインスタンスを作成"""
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            """有効データを取得"""
            user_id = serializer.validated_data["user_id"]
            request_content = serializer.validated_data["request_content"]
            request_email = ContactEmail(user_id, request_content)
            request_email.send_request_email()
            return self.format_response("要望送信成功", status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def format_response(self, message, http_status):
        """レスポンスをフォーマットして生成"""
        return Response({"status": "success", "message": message}, status=http_status)
