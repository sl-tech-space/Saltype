from apps.common.email_utils import RequestEmail
from apps.common.utils import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RequestSerializer


class SubmitRequest(APIView):
    """リクエスト送信処理"""
    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request):
        """リクエストから送信されたデータをもとにシリアライズインスタンスを作成"""
        serializer = RequestSerializer(data=request.data)
        if serializer.is_valid():
            """有効データを取得"""
            user_id = serializer.validated_data['user_id']
            request_content = serializer.validated_data['request_content']
            request_email = RequestEmail(user_id, request_content)
            request_email.send_request_email()
            return Response({'message': '要望送信成功'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
