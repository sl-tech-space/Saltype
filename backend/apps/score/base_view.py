from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ScoreSerializer


class BaseScoreView(APIView):
    """
    スコアに関連する操作のための基底クラス。
    スコア関連のリクエストを処理する共通ロジックを提供します。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでリクエストを処理し、バリデーション後にサブクラスの処理を呼び出します。

        リクエストデータがバリデーションに成功した場合、`handle_request`メソッドを呼び出して
        処理結果を返します。バリデーションに失敗した場合はエラーを返します。

        Args:
            request: HTTPリクエストオブジェクト。リクエストのデータを含む。
        Returns:
            Response: 処理結果やエラーを含むHTTPレスポンス。
        """
        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid():
            score_data = self.handle_request(serializer.validated_data)
            return Response(score_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def handle_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータ処理ロジック。

        サブクラスで具体的な処理を実装する必要があります。

        Args:
            validated_data: バリデーションを通過したリクエストデータ。
        Raises:
            NotImplementedError: サブクラスがこのメソッドを実装していない場合に発生。
        Returns:
            dict: 処理結果を辞書形式で返す。
        """
        raise NotImplementedError("サブクラスは`handle_request`メソッドを実装する必要があります")
