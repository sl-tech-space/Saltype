from apps.common.models import Score
from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RankingSerializer


class RankingView(APIView):
    """
    ランキング情報を取得するためのAPIビュークラス。
    """

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """
        POSTメソッドでランキング取得リクエストを処理。

        Args:
            request: HTTPリクエストオブジェクト。

        Returns:
            Response: フォーマットされたランキングデータを含むHTTPレスポンス。
        """
        serializer = RankingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ranking_datas = self.get_ranking_data(serializer.validated_data)

        return Response(self.format_response(ranking_datas), status=status.HTTP_200_OK)

    def get_ranking_data(self, validated_data):
        """
        リクエストデータに基づいてランキングデータを取得。

        Args:
            validated_data: 検証済みのリクエストデータ。

        Returns:
            list: 取得したランキングデータのリスト。
        """
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        limit = validated_data["limit"]
        date = validated_data.get("date")

        if date:
            return self.get_daily_ranking(lang_id, diff_id, date, limit)

        return self.get_ranking(lang_id, diff_id, limit)

    def get_ranking(self, lang_id: int, diff_id: int, limit: int) -> list:
        """
        通常のランキングを取得するメソッド。

        Args:
            lang_id: 言語ID。
            diff_id: 難易度ID。
            limit: ランキングの表示件数。

        Returns:
            list: 取得したスコアオブジェクトのリスト。
        """
        return list(
            Score.objects.filter(lang_id=lang_id, diff_id=diff_id)
            .select_related("user")
            .only("user__user_id", "user__username", "score")
            .order_by("-score")[:limit]
        )

    def get_daily_ranking(
        self, lang_id: int, diff_id: int, date: str, limit: int
    ) -> list:
        """
        日別ランキングを取得するメソッド。

        Args:
            lang_id: 言語ID。
            diff_id: 難易度ID。
            date: ランキング取得対象の日付（YYYY-MM-DD形式）。
            limit: ランキングの表示件数。

        Returns:
            list: 取得した日別スコアオブジェクトのリスト。
        """
        return list(
            Score.objects.filter(
                lang_id=lang_id, diff_id=diff_id, created_at__date=date
            )
            .select_related("user")
            .only("user__user_id", "user__username", "score")
            .order_by("-score")[:limit]
        )

    def format_response(self, ranking_datas):
        """
        取得したランキングデータをフォーマットするメソッド。

        Args:
            ranking_datas: ランキングデータのリスト。

        Returns:
            list: フォーマット済みのランキングデータのリスト。
        """
        return [
            {
                "user_id": ranking_data.user.user_id,
                "username": ranking_data.user.username,
                "score": ranking_data.score,
            }
            for ranking_data in ranking_datas
        ]
