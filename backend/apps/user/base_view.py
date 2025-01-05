from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import date
from .serializers import UserSerializer
from apps.common.models import Score


class BaseUserView(APIView):
    """
    ユーザー関連の操作を共通化するための基底クラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでユーザー関連のリクエストを処理します。
        リクエストデータがバリデーションに成功した場合、`handle_request`メソッドを呼び出して
        処理結果を返します。バリデーションに失敗した場合はエラーを返します。

        Args:
            request: HTTPリクエストオブジェクト。
        Returns:
            Response: 処理結果やエラーを含むHTTPレスポンス。
        """
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(
            self.handle_request(serializer.validated_data),
            status=status.HTTP_201_CREATED,
        )

    def get_today_highest_score(self, user):
        """
        ユーザーの今日の最高スコアを取得する共通メソッド。
        指定されたユーザーの今日の最高スコアをデータベースから取得します。

        Args:
            user: ユーザーオブジェクト。
        Returns:
            int or None: 今日の最高スコア（スコアが存在しない場合はNone）。
        """
        today = date.today()

        # ユーザーの今日の最高スコアを取得
        todays_score = (
            Score.objects.filter(
                user_id=user.user_id,
                created_at__date=today,
            )
            .order_by("-score")
            .first()
        )

        return todays_score.score if todays_score else None

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
        raise NotImplementedError(
            "サブクラスは`handle_request`メソッドを実装する必要があります"
        )
