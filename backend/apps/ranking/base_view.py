from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RankingSerializer

class BaseRankingView(APIView):
    """
    ランキングに関連する操作を共通化するための基底クラス。
    サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでランキング取得リクエストを処理します。
        バリデーション後、サブクラスで実装された`handle_request`メソッドを呼び出し、結果を返します。

        Args:
            request (HttpRequest): HTTPリクエストオブジェクト。

        Returns:
            Response: ランキングデータを含むHTTPレスポンスオブジェクト。
        """
        serializer = RankingSerializer(data=request.data)
        if serializer.is_valid():
            score_data = self.handle_request(serializer.validated_data)
            return Response(score_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def handle_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータ処理ロジック。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Raises:
            NotImplementedError: サブクラスでこのメソッドが実装されていない場合に発生。
        Returns:
            dict: 処理結果を返す辞書形式のデータ。
        """
        raise NotImplementedError("サブクラスは`handle_request`メソッドを実装する必要があります")
