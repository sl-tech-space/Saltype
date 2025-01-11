from rest_framework.permissions import AllowAny
from apps.common.views import BaseView
from .serializers import RankingSerializer

class BaseRankingView(BaseView):
    """
    ランキングに関連する操作を共通化するための基底クラス。
    サブクラスで具体的な処理を実装する必要があります。
    """

    permission_classes = [AllowAny]  # 誰でもアクセス可能なパーミッションを設定

    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでランキング取得リクエストを処理します。
        バリデーション後、サブクラスで実装された`handle_post_request`メソッドを呼び出し、結果を返します。

        Args:
            request (HttpRequest): HTTPリクエストオブジェクト。
        Returns:
            Response: ランキングデータを含むHTTPレスポンスオブジェクト。
        """
        return super().post(request, RankingSerializer, *args, **kwargs)

    def handle_post_request(self, validated_data):
        """
        サブクラスで実装されるべきリクエストデータ処理ロジック。

        Args:
            validated_data (dict): バリデーションを通過したリクエストデータ。
        Raises:
            NotImplementedError: サブクラスでこのメソッドが実装されていない場合に発生。
        Returns:
            dict: 処理結果を返す辞書形式のデータ。
        """
        raise NotImplementedError(
            "サブクラスは`handle_post_request`メソッドを実装する必要があります"
        )
