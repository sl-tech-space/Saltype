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
        serializer.is_valid(raise_exception=True)
        return Response(
            self.handle_request(serializer.validated_data),
            status=status.HTTP_201_CREATED,
        )

    def get_today_highest_score(self, user):
        """
        ユーザーの今日の最高スコアを取得する共通メソッド。

        Args:
            user: ユーザーオブジェクト
        Returns:
            int or None: 今日の最高スコア（なければNone）
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
