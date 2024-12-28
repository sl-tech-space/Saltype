from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer


class BaseUserView(APIView):
    """
    スコアに関連する操作のためのスーパークラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでスコア関連のリクエストを処理。

        Args:
            request: HTTPリクエストオブジェクト。
        Returns:
            Response: 成功時はスコアに関する情報が含まれたレスポンス。
        """
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            score_data = self.handle_request(validated_data)
            return Response(score_data, status=status.HTTP_201_CREATED)
        else:
            # バリデーションに失敗した場合、エラーレスポンスを返す
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def handle_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータ処理ロジック。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Raises:
            NotImplementedError: サブクラスで実装が必要な場合に発生。
        Returns:
            dict: 処理結果を返す辞書。
        """
        raise NotImplementedError(
            "サブクラスはhandle_requestメソッドを実装する必要あり"
        )
