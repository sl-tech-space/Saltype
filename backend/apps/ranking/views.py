from apps.common.models import Score
from apps.common.util.exception_handler import HandleExceptions
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RankingSerializer


class RankingView(APIView):
    """リクエストによって日別または通常のランキングを取得するAPIビュークラス"""

    permission_classes = [AllowAny]

    @HandleExceptions()
    def post(self, request, *args, **kwargs):
        """POSTメソッドを使用してスコア関連リクエストを処理"""
        serializer = RankingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ranking_datas = self.get_ranking_data(serializer.validated_data)
        return Response(self.format_response(ranking_datas), status=status.HTTP_200_OK)

    def get_ranking_data(self, validated_data):
        """検証済みのリクエストデータに基づいてランキングを取得"""
        lang_id = validated_data["lang_id"]
        diff_id = validated_data["diff_id"]
        limit = validated_data["limit"]
        date = validated_data.get("date")

        if date:
            return self.get_daily_ranking(lang_id, diff_id, date, limit)
        return self.get_ranking(lang_id, diff_id, limit)

    def get_ranking(self, lang_id: int, diff_id: int, limit: int) -> list:
        """
        通常のランキングを取得
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
        指定日付に基づく日別ランキングを取得
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
        """取得したランキングデータをフォーマット"""
        return [
            {
                "user_id": ranking_data.user.user_id,
                "username": ranking_data.user.username,
                "score": ranking_data.score,
            }
            for ranking_data in ranking_datas
        ]
