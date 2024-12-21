from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RankingSerializer


class BaseRankingView(APIView):
    """
    ランキングに関連する操作を共通化するためのスーパークラス。

    このクラスは、ランキングに関連するリクエスト処理の共通ロジックを提供します。
    サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでランキング取得リクエストを処理します。

        バリデーションを行った後、サブクラスで実装された`handle_request`メソッドを呼び出し、処理結果を返します。

        Args:
            request (HttpRequest): HTTPリクエストオブジェクト。リクエストデータが含まれています。

        Returns:
            Response: フォーマットされたランキングデータを含むHTTPレスポンスオブジェクト。
        """
        serializer = RankingSerializer(data=request.data)
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
            NotImplementedError: サブクラスでこのメソッドが実装されていない場合に発生。
        Returns:
            dict: 処理結果を返す辞書形式のデータ。
        """
        raise NotImplementedError(
            "サブクラスは`handle_request`メソッドを実装する必要があります"
        )
